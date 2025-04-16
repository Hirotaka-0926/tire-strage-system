// インタラクティブマップビュー
"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, ZoomIn, ZoomOut, Filter } from "lucide-react";

export default function StorageMapView() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">保管庫マップ</h1>

      {/* 検索・操作パネル */}
      <div className="flex justify-between flex-wrap gap-3 mb-6">
        <div className="flex gap-2">
          <div className="relative">
            <Input
              type="text"
              placeholder="保管庫を検索"
              className="pl-9 pr-4 py-2"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter size={18} />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <ZoomOut size={18} />
          </Button>
          <Button variant="outline" size="icon">
            <ZoomIn size={18} />
          </Button>
          <Select defaultValue="1F">
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="階層" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1F">1F</SelectItem>
              <SelectItem value="2F">2F</SelectItem>
              <SelectItem value="3F">3F</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* マップビュー */}
      <div className="border rounded-xl p-4 mb-6 overflow-x-auto">
        <div className="min-w-[800px] h-[500px] bg-slate-50 relative">
          {/* マップ上のセクション表示 - 実際には正しい位置に配置するためのCSSが必要 */}
          {Array.from({ length: 12 }).map((_, idx) => (
            <Card
              key={idx}
              style={{
                position: "absolute",
                left: `${(idx % 4) * 25 + 5}%`,
                top: `${Math.floor(idx / 4) * 30 + 5}%`,
                width: "20%",
                height: "25%",
              }}
              className={`border-2 ${
                idx % 3 === 0
                  ? "border-green-500 bg-green-50"
                  : idx % 3 === 1
                  ? "border-yellow-500 bg-yellow-50"
                  : "border-red-500 bg-red-50"
              } flex flex-col items-center justify-center cursor-pointer hover:opacity-80 transition-opacity p-2`}
            >
              <span className="font-semibold">保管庫 #{idx + 1}</span>
              <span className="text-xs text-gray-600">
                利用率: {idx % 3 === 0 ? "60%" : idx % 3 === 1 ? "85%" : "100%"}
              </span>
              <Badge
                variant={
                  idx % 3 === 0
                    ? "secondary"
                    : idx % 3 === 1
                    ? "outline"
                    : "destructive"
                }
                className="mt-1"
              >
                {idx % 3 === 0
                  ? "空き有り"
                  : idx % 3 === 1
                  ? "残りわずか"
                  : "満タン"}
              </Badge>
            </Card>
          ))}
        </div>
      </div>

      {/* 凡例 */}
      <div className="flex gap-4 mb-4 justify-center">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded-sm mr-2"></div>
          <span className="text-sm">空き有り</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-yellow-500 rounded-sm mr-2"></div>
          <span className="text-sm">残りわずか</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 rounded-sm mr-2"></div>
          <span className="text-sm">満タン</span>
        </div>
      </div>
    </div>
  );
}
