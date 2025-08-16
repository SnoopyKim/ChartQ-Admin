"use client";

import { AnalyticsOverview } from "./analytics-overview";

export default function DashboardPage() {
  return (
    <div className="container">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
        <p className="text-gray-600 mt-2">ChartQ 관리자 통계 대시보드</p>
      </div>
      <AnalyticsOverview />
    </div>
  );
}
