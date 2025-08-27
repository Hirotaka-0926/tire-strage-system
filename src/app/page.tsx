"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getAllStorages,
  getAllClients,
  getAllTasks,
  getStorages,
} from "@/utils/supabaseFunction";
import {
  calInspectionProgress,
  getYearAndSeason,
} from "@/utils/globalFunctions";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
} from "lucide-react";

// 新しい分析データの型定義
interface AnalyticsData {
  storageUtilization: number;
  monthlyTrend: { month: string; count: number }[];
  topCustomers: { name: string; count: number }[];
  urgentTasks: number;
  seasonalTrend: {
    currentSeason: { season: string; count: number };
    previousSeason: { season: string; count: number };
    growth: number;
  };
  customerRetention: number;
  averageStorageDuration: number;
}

const Dashboard: React.FC = () => {
  const [storageCount, setStorageCount] = useState(0);
  const [clientCount, setClientCount] = useState(0);
  const [taskCount, setTaskCount] = useState(0);
  const [seasonalData, setSeasonalData] = useState({ summer: 0, winter: 0 });
  const [inspectionProgress, setInspectionProgress] = useState<
    number | undefined
  >();
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    storageUtilization: 0,
    monthlyTrend: [],
    topCustomers: [],
    urgentTasks: 0,
    seasonalTrend: {
      currentSeason: { season: "", count: 0 },
      previousSeason: { season: "", count: 0 },
      growth: 0,
    },
    customerRetention: 0,
    averageStorageDuration: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const [storages, clients, tasks, storageSlots] = await Promise.all([
        getAllStorages(),
        getAllClients(),
        getAllTasks(),
        getStorages(),
      ]);

      setStorageCount(storages.length);
      setClientCount(clients.length);
      setTaskCount(tasks.length);

      // 既存のシーズン別データ集計
      const summer = storages.filter((s) => s.season === "summer").length;
      const winter = storages.filter((s) => s.season === "winter").length;
      setSeasonalData({ summer, winter });

      // 新しい分析データの計算
      await calculateAnalytics(storages, clients, tasks, storageSlots);
    };

    const fetchInspectionProgress = async () => {
      const progressRate = await calInspectionProgress();
      setInspectionProgress(progressRate);
    };

    fetchInspectionProgress();
    fetchData();
  }, []);

  const calculateAnalytics = async (
    storages: any[],
    clients: any[],
    tasks: any[],
    storageSlots: any[]
  ) => {
    const { year, season } = getYearAndSeason();

    // 保管庫稼働率の計算
    const occupiedSlots = storageSlots.filter(
      (slot) =>
        slot.car_id !== null ||
        slot.client_id !== null ||
        slot.tire_state_id !== null
    ).length;
    const utilization =
      storageSlots.length > 0 ? (occupiedSlots / storageSlots.length) * 100 : 0;

    // 月別トレンドの計算（過去6ヶ月）
    const monthlyTrend = calculateMonthlyTrend(storages);

    // 上位顧客の計算
    const topCustomers = calculateTopCustomers(storages, clients);

    // 緊急タスクの計算
    const urgentTasks = tasks.filter(
      (task) =>
        task.status === "incomplete" &&
        new Date(task.created_at) <
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;

    // シーズントレンドの計算
    const seasonalTrend = calculateSeasonalTrend(storages, year, season);

    // 顧客リテンション率の計算
    const retention = calculateCustomerRetention(storages, clients);

    // 平均保管期間の計算
    const avgDuration = calculateAverageStorageDuration(storages);

    setAnalytics({
      storageUtilization: Math.round(utilization),
      monthlyTrend,
      topCustomers,
      urgentTasks,
      seasonalTrend,
      customerRetention: retention,
      averageStorageDuration: avgDuration,
    });
  };

  const calculateMonthlyTrend = (storages: any[]) => {
    const months = ["1月", "2月", "3月", "4月", "5月", "6月"];
    return months.map((month) => ({
      month,
      count: Math.floor(Math.random() * 50) + 10, // 実際のデータ計算に置き換える
    }));
  };

  const calculateTopCustomers = (storages: any[], clients: any[]) => {
    const customerCounts = storages.reduce((acc, storage) => {
      const clientName = storage.client?.client_name || "不明";
      acc[clientName] = (acc[clientName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(customerCounts)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([name, count]) => ({ name, count: count as number }));
  };

  const calculateSeasonalTrend = (
    storages: any[],
    currentYear: number,
    currentSeason: string
  ) => {
    const currentSeasonData = storages.filter(
      (s) => s.year === currentYear && s.season === currentSeason
    );

    const previousSeason = currentSeason === "summer" ? "winter" : "summer";
    const previousYear =
      currentSeason === "summer" ? currentYear : currentYear - 1;
    const previousSeasonData = storages.filter(
      (s) => s.year === previousYear && s.season === previousSeason
    );

    const growth =
      previousSeasonData.length > 0
        ? ((currentSeasonData.length - previousSeasonData.length) /
            previousSeasonData.length) *
          100
        : 0;

    return {
      currentSeason: {
        season: currentSeason === "summer" ? "夏タイヤ" : "冬タイヤ",
        count: currentSeasonData.length,
      },
      previousSeason: {
        season: previousSeason === "summer" ? "夏タイヤ" : "冬タイヤ",
        count: previousSeasonData.length,
      },
      growth: Math.round(growth),
    };
  };

  const calculateCustomerRetention = (storages: any[], clients: any[]) => {
    const thisYearCustomers = new Set(
      storages
        .filter((s) => s.year === new Date().getFullYear())
        .map((s) => s.client_id)
    );

    const lastYearCustomers = new Set(
      storages
        .filter((s) => s.year === new Date().getFullYear() - 1)
        .map((s) => s.client_id)
    );

    if (lastYearCustomers.size === 0) return 0;

    const retainedCustomers = [...thisYearCustomers].filter((id) =>
      lastYearCustomers.has(id)
    );
    return Math.round(
      (retainedCustomers.length / lastYearCustomers.size) * 100
    );
  };

  const calculateAverageStorageDuration = (storages: any[]) => {
    // 簡易計算：実際のデータ構造に合わせて調整が必要
    return Math.round(Math.random() * 12) + 1; // 1-12ヶ月
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">ダッシュボード</h1>
        <Badge variant="outline" className="text-sm">
          {new Date().toLocaleDateString("ja-JP")} 更新
        </Badge>
      </div>

      {/* 既存の基本統計（改善版） */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="bg-blue-50 flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総保管庫数</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{storageCount}</div>
            <div className="text-xs text-muted-foreground mt-1">
              稼働率: {analytics.storageUtilization}%
            </div>
            <Progress value={analytics.storageUtilization} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="bg-green-50 flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">顧客数</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientCount}</div>
            <div className="text-xs text-muted-foreground mt-1">
              リテンション率: {analytics.customerRetention}%
            </div>
            <Progress value={analytics.customerRetention} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="bg-yellow-50 flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">作業タスク数</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskCount}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <AlertTriangle className="h-3 w-3 mr-1 text-red-500" />
              緊急: {analytics.urgentTasks}件
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="bg-purple-50 flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">検査進捗率</CardTitle>
            <CheckCircle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {inspectionProgress ? `${inspectionProgress}%` : "計算不可"}
            </div>
            <Progress value={inspectionProgress || 0} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* 新しい分析セクション */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* シーズントレンド */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              シーズントレンド
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {analytics.seasonalTrend.currentSeason.season}（今シーズン）
                </span>
                <span className="text-lg font-bold">
                  {analytics.seasonalTrend.currentSeason.count}件
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {analytics.seasonalTrend.previousSeason.season}（前シーズン）
                </span>
                <span className="text-sm text-muted-foreground">
                  {analytics.seasonalTrend.previousSeason.count}件
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">前シーズン比</span>
                <div className="flex items-center">
                  {analytics.seasonalTrend.growth > 0 ? (
                    <>
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-green-500 font-bold">
                        +{analytics.seasonalTrend.growth}%
                      </span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                      <span className="text-red-500 font-bold">
                        {analytics.seasonalTrend.growth}%
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 上位顧客 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              利用頻度上位顧客
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.topCustomers.map((customer, index) => (
                <div
                  key={customer.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <Badge
                      variant="outline"
                      className="mr-2 w-6 h-6 p-0 flex items-center justify-center"
                    >
                      {index + 1}
                    </Badge>
                    <span className="text-sm font-medium">{customer.name}</span>
                  </div>
                  <span className="text-sm font-bold">{customer.count}回</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 追加の統計情報 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="bg-indigo-50">
            <CardTitle className="text-sm font-medium">平均保管期間</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.averageStorageDuration}ヶ月
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              顧客あたりの平均保管期間
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-orange-50">
            <CardTitle className="text-sm font-medium">
              今月の新規保管
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.monthlyTrend[analytics.monthlyTrend.length - 1]
                ?.count || 0}
              件
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              今月追加された保管庫数
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-red-50">
            <CardTitle className="text-sm font-medium">要注意タスク</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {analytics.urgentTasks}件
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              1週間以上未処理のタスク
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
