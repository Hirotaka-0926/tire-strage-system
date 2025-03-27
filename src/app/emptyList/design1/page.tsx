import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  PieChart,
  BarChart,
  Search,
  Download,
  Plus,
  RefreshCw,
} from "lucide-react";

export default function StorageDashboard() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">保管庫ダッシュボード</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            更新
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            新規保管庫
          </Button>
        </div>
      </div>

      {/* 概要統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="border-blue-200">
          <CardContent className="p-4 bg-blue-50">
            <h2 className="text-sm text-gray-600 mb-1">総保管庫数</h2>
            <div className="text-2xl font-bold">24</div>
            <div className="text-xs text-gray-500 mt-1">先月比 +2 庫</div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="p-4 bg-green-50">
            <h2 className="text-sm text-gray-600 mb-1">空き有り</h2>
            <div className="text-2xl font-bold">10 庫</div>
            <div className="text-xs text-gray-500 mt-1">全体の 41.6%</div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200">
          <CardContent className="p-4 bg-yellow-50">
            <h2 className="text-sm text-gray-600 mb-1">残りわずか</h2>
            <div className="text-2xl font-bold">8 庫</div>
            <div className="text-xs text-gray-500 mt-1">全体の 33.3%</div>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardContent className="p-4 bg-red-50">
            <h2 className="text-sm text-gray-600 mb-1">満タン</h2>
            <div className="text-2xl font-bold">6 庫</div>
            <div className="text-xs text-gray-500 mt-1">全体の 25.0%</div>
          </CardContent>
        </Card>
      </div>

      {/* グラフとクイックアクション */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold">保管庫利用状況</h2>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <PieChart className="mr-1 h-4 w-4" />
                    円グラフ
                  </Button>
                  <Button variant="ghost" size="sm">
                    <BarChart className="mr-1 h-4 w-4" />
                    棒グラフ
                  </Button>
                </div>
              </div>

              {/* ここにグラフコンポーネントが入ります */}
              <div className="h-64 bg-gray-100 flex items-center justify-center">
                <span className="text-gray-500">グラフ表示エリア</span>
              </div>

              <div className="flex justify-between text-xs text-gray-500 mt-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                  <span>空き有り: 41.6%</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
                  <span>残りわずか: 33.3%</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                  <span>満タン: 25.0%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="font-semibold mb-4">クイックアクション</h2>
              <div className="space-y-2">
                <Button className="w-full justify-start" variant="outline">
                  <Search className="mr-2 h-4 w-4" />
                  空き保管庫を検索
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  保管庫リストをエクスポート
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  利用率レポートを表示
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  保管庫の詳細を編集
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* タブ切り替え保管庫リスト */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">保管庫リスト</h2>
            <div className="flex items-center">
              <Input
                type="text"
                placeholder="保管庫を検索"
                className="mr-2 h-8"
              />
              <Button variant="outline" size="sm">
                詳細検索
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">すべて</TabsTrigger>
              <TabsTrigger value="available">空き有り</TabsTrigger>
              <TabsTrigger value="almost">残りわずか</TabsTrigger>
              <TabsTrigger value="full">満タン</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <Card key={idx} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between">
                        <h3 className="font-semibold">保管庫 #{idx + 1}</h3>
                        <Badge
                          variant={
                            idx % 3 === 0
                              ? "default"
                              : idx % 3 === 1
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {idx % 3 === 0
                            ? "空き有り"
                            : idx % 3 === 1
                            ? "残りわずか"
                            : "満タン"}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600">
                        {idx % 3 === 0
                          ? "東棟"
                          : idx % 3 === 1
                          ? "西棟"
                          : "南棟"}
                        {idx % 2 === 0 ? "1F" : "2F"}-
                        {String.fromCharCode(65 + idx)}
                      </p>
                      <div className="bg-gray-100 h-2 rounded-full my-2">
                        <div
                          className={`h-2 rounded-full ${
                            idx % 3 === 0
                              ? "bg-green-500 w-3/5"
                              : idx % 3 === 1
                              ? "bg-yellow-500 w-4/5"
                              : "bg-red-500 w-full"
                          }`}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>
                          容量:{" "}
                          {idx % 3 === 0 ? "20" : idx % 3 === 1 ? "15" : "25"}{" "}
                          セット
                        </span>
                        <span>
                          空き:{" "}
                          {idx % 3 === 0 ? "8" : idx % 3 === 1 ? "3" : "0"}{" "}
                          セット
                        </span>
                      </div>
                      <div className="flex mt-2 gap-1">
                        <Button size="sm" variant="outline" className="flex-1">
                          詳細
                        </Button>
                        <Button size="sm" className="flex-1">
                          管理
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* 他のタブコンテンツも同様の構造で */}
            <TabsContent value="available" className="mt-4">
              <div className="text-center py-4 text-gray-500">
                空き有りの保管庫リストがここに表示されます
              </div>
            </TabsContent>
            <TabsContent value="almost" className="mt-4">
              <div className="text-center py-4 text-gray-500">
                残りわずかの保管庫リストがここに表示されます
              </div>
            </TabsContent>
            <TabsContent value="full" className="mt-4">
              <div className="text-center py-4 text-gray-500">
                満タンの保管庫リストがここに表示されます
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
