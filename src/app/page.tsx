// src/app/dashboard/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getAllStorages,
  getAllClients,
  getAllTasks,
} from "@/utils/supabaseFunction";
import { calInspectionProgress } from "@/utils/globalFunctions";
import StorageMap from "@/app/emptyList/storageMap";

const Dashboard: React.FC = () => {
  const [storageCount, setStorageCount] = useState(0);
  const [clientCount, setClientCount] = useState(0);
  const [taskCount, setTaskCount] = useState(0);
  const [seasonalData, setSeasonalData] = useState({ summer: 0, winter: 0 });
  const [inspectionProgress, setInspectionProgress] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const storages = await getAllStorages();
      const clients = await getAllClients();
      const tasks = await getAllTasks();

      setStorageCount(storages.length);
      setClientCount(clients.length);
      setTaskCount(tasks.length);

      // シーズン別データ集計
      const summer = storages.filter((s) => s.season === "summer").length;
      const winter = storages.filter((s) => s.season === "winter").length;
      setSeasonalData({ summer, winter });
    };

    const fetchInspectionProgress = async () => {
      const progressRate = await calInspectionProgress();
      setInspectionProgress(progressRate);
    };
    fetchInspectionProgress();

    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">ダッシュボード</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="bg-blue-50">
            <CardTitle>総保管庫数</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold pt-4">
            {storageCount}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="bg-green-50">
            <CardTitle>顧客数</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold pt-4">
            {clientCount}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="bg-yellow-50">
            <CardTitle>作業タスク数</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold pt-4">
            {taskCount}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="bg-red-50">
            <CardTitle>シーズン別保管数</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p>
              夏タイヤ: <span className="font-bold">{seasonalData.summer}</span>
            </p>
            <p>
              冬タイヤ: <span className="font-bold">{seasonalData.winter}</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-blue-50">
            <CardTitle>装着率</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold pt-4">
            {inspectionProgress}%
          </CardContent>
        </Card>
      </div>
      <div className="mt-8">
        <StorageMap />
        <p className="text-sm text-gray-500 mt-2">
          ※保管庫マップは実際の保管庫の配置を示すものではありません。
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
