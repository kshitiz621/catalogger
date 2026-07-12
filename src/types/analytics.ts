export type TrendPoint = {
  date: string;
  label: string;
  value: number;
};

export type GrowthMetric = {
  current: number;
  previous: number;
  changePercent: number;
  periodLabel: string;
};

export type PlatformAnalytics = {
  totalSellers: number;
  activeSellers: number;
  suspendedSellers: number;
  newSellers7d: number;
  newSellers30d: number;
  growth7d: GrowthMetric;
  growth30d: GrowthMetric;
  sellerTrend: TrendPoint[];
  newSellerTrend: TrendPoint[];
};

export type SellerAnalytics = {
  totalProducts: number;
  totalCategories: number;
  totalViews: number;
  totalOrders: number;
  viewsArePlaceholder: boolean;
  ordersArePlaceholder: boolean;
  productTrend: TrendPoint[];
  viewsTrend: TrendPoint[];
  ordersTrend: TrendPoint[];
  store: {
    id: string;
    name: string;
    slug: string;
    whatsappNumber: string | null;
  };
};

export const ANALYTICS_METRICS = {
  PLATFORM_SELLERS: "sellers",
  PLATFORM_NEW_SELLERS: "new_sellers",
  STORE_VIEWS: "views",
  STORE_ORDERS: "orders",
  STORE_PRODUCTS: "products",
} as const;

export const PLACEHOLDER_ANALYTICS = {
  views: 1240,
  orders: 42,
} as const;
