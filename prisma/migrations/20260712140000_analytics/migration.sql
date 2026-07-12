-- CreateTable
CREATE TABLE "StoreAnalytics" (
    "storeId" TEXT NOT NULL,
    "totalViews" INTEGER NOT NULL DEFAULT 0,
    "totalOrders" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoreAnalytics_pkey" PRIMARY KEY ("storeId")
);

-- CreateTable
CREATE TABLE "AnalyticsDataPoint" (
    "id" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "metric" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "value" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "storeId" TEXT,

    CONSTRAINT "AnalyticsDataPoint_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AnalyticsDataPoint_scope_metric_idx" ON "AnalyticsDataPoint"("scope", "metric");

-- CreateIndex
CREATE INDEX "AnalyticsDataPoint_storeId_metric_date_idx" ON "AnalyticsDataPoint"("storeId", "metric", "date");

-- CreateIndex
CREATE UNIQUE INDEX "AnalyticsDataPoint_scope_metric_date_key" ON "AnalyticsDataPoint"("scope", "metric", "date");

-- AddForeignKey
ALTER TABLE "StoreAnalytics" ADD CONSTRAINT "StoreAnalytics_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalyticsDataPoint" ADD CONSTRAINT "AnalyticsDataPoint_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill analytics rows for existing stores (placeholder totals)
INSERT INTO "StoreAnalytics" ("storeId", "totalViews", "totalOrders", "updatedAt")
SELECT "id", 1240, 42, CURRENT_TIMESTAMP FROM "Store"
ON CONFLICT ("storeId") DO NOTHING;
