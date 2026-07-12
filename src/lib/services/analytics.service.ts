import { prisma } from "@/lib/prisma";
import {
  ANALYTICS_METRICS,
  PLACEHOLDER_ANALYTICS,
  type GrowthMetric,
  type PlatformAnalytics,
  type SellerAnalytics,
  type TrendPoint,
} from "@/types/analytics";
import {
  eachDayOfInterval,
  format,
  startOfDay,
  subDays,
} from "date-fns";

const TREND_DAYS = 14;

function calcGrowth(current: number, previous: number, periodLabel: string): GrowthMetric {
  const changePercent =
    previous === 0
      ? current > 0
        ? 100
        : 0
      : Math.round(((current - previous) / previous) * 100);

  return { current, previous, changePercent, periodLabel };
}

function buildDateRange(days: number) {
  const end = startOfDay(new Date());
  const start = subDays(end, days - 1);
  return eachDayOfInterval({ start, end });
}

function toTrendPoints(
  dates: Date[],
  valuesByDate: Map<string, number>,
  labelFormat = "MMM d"
): TrendPoint[] {
  return dates.map((date) => {
    const key = format(date, "yyyy-MM-dd");
    return {
      date: key,
      label: format(date, labelFormat),
      value: valuesByDate.get(key) ?? 0,
    };
  });
}

function countByCreatedAt<T extends { createdAt: Date }>(
  items: T[],
  dates: Date[]
): TrendPoint[] {
  const counts = new Map<string, number>();
  for (const date of dates) {
    counts.set(format(date, "yyyy-MM-dd"), 0);
  }

  for (const item of items) {
    const key = format(startOfDay(item.createdAt), "yyyy-MM-dd");
    if (counts.has(key)) {
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }

  return toTrendPoints(dates, counts);
}

function buildCumulativeSellerTrend(
  sellers: { createdAt: Date }[],
  dates: Date[]
): TrendPoint[] {
  return dates.map((date) => {
    const count = sellers.filter(
      (seller) => startOfDay(seller.createdAt).getTime() <= date.getTime()
    ).length;

    return {
      date: format(date, "yyyy-MM-dd"),
      label: format(date, "MMM d"),
      value: count,
    };
  });
}

async function countSellersInRange(start: Date, end: Date) {
  return prisma.user.count({
    where: {
      role: "SELLER",
      createdAt: { gte: start, lte: end },
    },
  });
}

export async function initStoreAnalytics(storeId: string) {
  await prisma.storeAnalytics.upsert({
    where: { storeId },
    create: { storeId, totalViews: 0, totalOrders: 0 },
    update: {},
  });
}

export async function ensureStoreAnalytics(storeId: string) {
  const existing = await prisma.storeAnalytics.findUnique({ where: { storeId } });
  if (existing) return existing;

  return prisma.storeAnalytics.create({
    data: {
      storeId,
      totalViews: PLACEHOLDER_ANALYTICS.views,
      totalOrders: PLACEHOLDER_ANALYTICS.orders,
    },
  });
}

async function getOrSeedStoreMetricTrend(
  storeId: string,
  metric: string,
  total: number,
  dates: Date[]
): Promise<TrendPoint[]> {
  const scope = storeId;
  const existing = await prisma.analyticsDataPoint.findMany({
    where: {
      scope,
      metric,
      date: { gte: dates[0], lte: dates[dates.length - 1] },
    },
    orderBy: { date: "asc" },
  });

  if (existing.length >= dates.length) {
    const values = new Map(
      existing.map((row) => [format(row.date, "yyyy-MM-dd"), row.value])
    );
    return toTrendPoints(dates, values);
  }

  const dailyBase = Math.floor(total / dates.length);
  const remainder = total % dates.length;
  const rows = dates.map((date, index) => ({
    scope,
    metric,
    storeId,
    date,
    value: dailyBase + (index < remainder ? 1 : 0),
  }));

  await prisma.$transaction(
    rows.map((row) =>
      prisma.analyticsDataPoint.upsert({
        where: {
          scope_metric_date: {
            scope: row.scope,
            metric: row.metric,
            date: row.date,
          },
        },
        create: row,
        update: { value: row.value },
      })
    )
  );

  const values = new Map(rows.map((row) => [format(row.date, "yyyy-MM-dd"), row.value]));
  return toTrendPoints(dates, values);
}

export class AnalyticsService {
  static async getPlatformAnalytics(): Promise<PlatformAnalytics> {
    const now = new Date();
    const sevenDaysAgo = subDays(now, 7);
    const fourteenDaysAgo = subDays(now, 14);
    const thirtyDaysAgo = subDays(now, 30);
    const sixtyDaysAgo = subDays(now, 60);

    const [
      totalSellers,
      activeSellers,
      suspendedSellers,
      newSellers7d,
      newSellers30d,
      prevNewSellers7d,
      prevNewSellers30d,
      sellers,
    ] = await Promise.all([
      prisma.user.count({ where: { role: "SELLER" } }),
      prisma.user.count({ where: { role: "SELLER", status: "ACTIVE" } }),
      prisma.user.count({ where: { role: "SELLER", status: "SUSPENDED" } }),
      countSellersInRange(sevenDaysAgo, now),
      countSellersInRange(thirtyDaysAgo, now),
      countSellersInRange(fourteenDaysAgo, sevenDaysAgo),
      countSellersInRange(sixtyDaysAgo, thirtyDaysAgo),
      prisma.user.findMany({
        where: { role: "SELLER" },
        select: { createdAt: true },
        orderBy: { createdAt: "asc" },
      }),
    ]);

    const dates = buildDateRange(TREND_DAYS);
    const newSellerTrend = countByCreatedAt(sellers, dates);
    const sellerTrend = buildCumulativeSellerTrend(sellers, dates);

    return {
      totalSellers,
      activeSellers,
      suspendedSellers,
      newSellers7d,
      newSellers30d,
      growth7d: calcGrowth(newSellers7d, prevNewSellers7d, "vs prior 7 days"),
      growth30d: calcGrowth(newSellers30d, prevNewSellers30d, "vs prior 30 days"),
      sellerTrend,
      newSellerTrend,
    };
  }

  static async getSellerAnalytics(storeId: string): Promise<SellerAnalytics> {
    const store = await prisma.store.findUniqueOrThrow({
      where: { id: storeId },
      select: {
        id: true,
        name: true,
        slug: true,
        whatsappNumber: true,
      },
    });

    const analytics = await ensureStoreAnalytics(storeId);
    const dates = buildDateRange(TREND_DAYS);

    const [totalProducts, totalCategories, products] = await Promise.all([
      prisma.product.count({ where: { storeId } }),
      prisma.category.count({ where: { storeId } }),
      prisma.product.findMany({
        where: { storeId },
        select: { createdAt: true },
        orderBy: { createdAt: "asc" },
      }),
    ]);

    const productTrend = countByCreatedAt(products, dates);
    const viewsTrend = await getOrSeedStoreMetricTrend(
      storeId,
      ANALYTICS_METRICS.STORE_VIEWS,
      analytics.totalViews,
      dates
    );
    const ordersTrend = await getOrSeedStoreMetricTrend(
      storeId,
      ANALYTICS_METRICS.STORE_ORDERS,
      analytics.totalOrders,
      dates
    );

    const viewsArePlaceholder = analytics.totalViews === PLACEHOLDER_ANALYTICS.views;
    const ordersArePlaceholder = analytics.totalOrders === PLACEHOLDER_ANALYTICS.orders;

    return {
      totalProducts,
      totalCategories,
      totalViews: analytics.totalViews,
      totalOrders: analytics.totalOrders,
      viewsArePlaceholder,
      ordersArePlaceholder,
      productTrend,
      viewsTrend,
      ordersTrend,
      store,
    };
  }
}
