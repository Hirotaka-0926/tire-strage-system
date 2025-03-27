import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Filter } from "lucide-react";

export default function StorageKanbanBoard() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">保管庫ステータス管理</h1>

      {/* 検索エリア */}
      <div className="flex gap-2 mb-6">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="保管庫や顧客名で検索" className="pl-8" />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          フィルター
        </Button>
      </div>

      {/* カンバンボード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 空き有りカラム */}
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-lg flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              空き有り
            </h2>
            <Badge className="bg-green-500">5 庫</Badge>
          </div>

          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <Card key={idx} className="shadow-sm">
                <CardContent className="p-3">
                  <div className="flex justify-between">
                    <h3 className="font-semibold">保管庫 #{idx + 1}</h3>
                    <span className="text-xs text-muted-foreground">
                      50% 使用中
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    東棟1F-{String.fromCharCode(65 + idx)}
                  </p>
                  <div className="bg-gray-100 h-2 rounded-full mt-2">
                    <div className="bg-green-500 h-2 rounded-full w-1/2" />
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    <span>利用可能: 10/20セット</span>
                  </div>
                  <Button size="sm" className="mt-2 w-full">
                    <Plus className="mr-1 h-4 w-4" />
                    タイヤを追加
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 残りわずかカラム */}
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-lg flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              残りわずか
            </h2>
            <Badge className="bg-yellow-500">3 庫</Badge>
          </div>

          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, idx) => (
              <Card key={idx} className="shadow-sm">
                <CardContent className="p-3">
                  <div className="flex justify-between">
                    <h3 className="font-semibold">保管庫 #{idx + 4}</h3>
                    <span className="text-xs text-muted-foreground">
                      85% 使用中
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    西棟2F-{String.fromCharCode(67 + idx)}
                  </p>
                  <div className="bg-gray-100 h-2 rounded-full mt-2">
                    <div className="bg-yellow-500 h-2 rounded-full w-4/5" />
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    <span>利用可能: 3/20セット</span>
                  </div>
                  <div className="flex gap-1 mt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      詳細
                    </Button>
                    <Button size="sm" className="flex-1">
                      追加
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 満タンカラム */}
        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-lg flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              満タン
            </h2>
            <Badge className="bg-red-500">4 庫</Badge>
          </div>

          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, idx) => (
              <Card key={idx} className="shadow-sm">
                <CardContent className="p-3">
                  <div className="flex justify-between">
                    <h3 className="font-semibold">保管庫 #{idx + 6}</h3>
                    <span className="text-xs text-muted-foreground">
                      100% 使用中
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    南棟B1-{String.fromCharCode(69 + idx)}
                  </p>
                  <div className="bg-gray-100 h-2 rounded-full mt-2">
                    <div className="bg-red-500 h-2 rounded-full w-full" />
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    <span>利用可能: 0/20セット</span>
                  </div>
                  <Button size="sm" variant="outline" className="mt-2 w-full">
                    詳細を表示
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
