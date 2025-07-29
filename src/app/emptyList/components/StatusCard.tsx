import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StorageSlot, AreaConfig, StorageStats } from "@/utils/storage";

interface StatsCardsProps {
  areas: AreaConfig[];
  slots: StorageSlot[];
}

export const StatsCards = ({ areas, slots }: StatsCardsProps) => {
  const getAreaStats = (areaName: string): StorageStats => {
    const areaSlots = slots.filter((slot) => slot.area === areaName);
    return {
      total: areaSlots.length,
      available: areaSlots.filter((s) => s.status === "available").length,
      occupied: areaSlots.filter((s) => s.status === "occupied").length,
    };
  };

  const totalStats: StorageStats = {
    total: slots.length,
    available: slots.filter((s) => s.status === "available").length,
    occupied: slots.filter((s) => s.status === "occupied").length,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {areas.map((area) => {
        const stats = getAreaStats(area.name);
        return (
          <Card key={area.name}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                エリア{area.name} ({area.totalSlots}区画)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center">
                    <div className="w-3 h-3 rounded bg-green-500 mr-2"></div>
                    空き
                  </span>
                  <span className="font-semibold">{stats.available}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="flex items-center">
                    <div className="w-3 h-3 rounded bg-red-500 mr-2"></div>
                    使用中
                  </span>
                  <span className="font-semibold">{stats.occupied}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
            <BarChart3 className="w-4 h-4 mr-2" />
            全体統計
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>稼働率</span>
              <span className="font-semibold">
                {Math.round((totalStats.occupied / totalStats.total) * 100)}%
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>空き率</span>
              <span className="font-semibold">
                {Math.round((totalStats.available / totalStats.total) * 100)}%
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>総区画数</span>
              <span className="font-semibold">{totalStats.total}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
