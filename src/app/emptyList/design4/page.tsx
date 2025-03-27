// 保管庫のグリッドカードビュー
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

export default function StorageManagementPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">保管庫管理</h1>

      {/* 検索・フィルターエリア */}
      <div className="flex flex-wrap gap-3 mb-6 bg-slate-50 p-4 rounded-lg">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="保管庫名や場所で検索" className="pl-8" />
        </div>

        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="状態を選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべての状態</SelectItem>
            <SelectItem value="empty">空き有り</SelectItem>
            <SelectItem value="full">満タン</SelectItem>
            <SelectItem value="unused">未使用</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline">
          <Filter size={18} className="mr-2" />
          詳細フィルター
        </Button>
        <div className="ml-auto">
          <Button>
            <span className="mr-2">+</span>新規保管庫
          </Button>
        </div>
      </div>

      {/* グリッドカードビュー */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* カードを繰り返し */}
        {Array.from({ length: 8 }).map((_, idx) => (
          <Card key={idx} className="transition-all hover:shadow-md">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg">保管庫 #{idx + 1}</h3>
                <Badge
                  variant={
                    idx % 3 === 0
                      ? "success"
                      : idx % 3 === 1
                      ? "warning"
                      : "destructive"
                  }
                  className={
                    idx % 3 === 0
                      ? "bg-green-500 hover:bg-green-500/90"
                      : idx % 3 === 1
                      ? "bg-yellow-500 hover:bg-yellow-500/90"
                      : "bg-destructive hover:bg-destructive/90"
                  }
                >
                  {idx % 3 === 0
                    ? "空き有り"
                    : idx % 3 === 1
                    ? "ほぼ満タン"
                    : "満タン"}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                東棟1F-{String.fromCharCode(65 + idx)}
              </p>
              <div className="bg-gray-100 h-2 rounded-full mt-2 mb-1">
                <div
                  className={`h-2 rounded-full ${
                    idx % 3 === 0
                      ? "bg-green-500 w-3/4"
                      : idx % 3 === 1
                      ? "bg-yellow-500 w-4/5"
                      : "bg-red-500 w-full"
                  }`}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>
                  使用: {idx % 3 === 0 ? "75%" : idx % 3 === 1 ? "90%" : "100%"}
                </span>
                <span>容量: 20セット</span>
              </div>
              <div className="flex mt-4 gap-2">
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
    </div>
  );
}
