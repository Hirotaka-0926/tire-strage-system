import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, SortAsc, Download, Eye, Edit, Trash } from "lucide-react";

export default function StorageTableView() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">保管庫一覧</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* フィルターサイドバー */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
            <h2 className="font-semibold text-lg mb-4">絞り込み検索</h2>

            <div className="mb-4">
              <h3 className="font-medium mb-2">空き状況</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="status-all" />
                  <label
                    htmlFor="status-all"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    すべて表示
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="status-empty" />
                  <label
                    htmlFor="status-empty"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    空き有り
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="status-almostfull" />
                  <label
                    htmlFor="status-almostfull"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    残りわずか
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="status-full" />
                  <label
                    htmlFor="status-full"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    満タン
                  </label>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-medium mb-2">保管場所</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="location-all" />
                  <label
                    htmlFor="location-all"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    すべての場所
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="location-east" />
                  <label
                    htmlFor="location-east"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    東棟
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="location-west" />
                  <label
                    htmlFor="location-west"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    西棟
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="location-south" />
                  <label
                    htmlFor="location-south"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    南棟
                  </label>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-medium mb-2">容量</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="capacity-all" />
                  <label
                    htmlFor="capacity-all"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    すべての容量
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="capacity-small" />
                  <label
                    htmlFor="capacity-small"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    小（〜10セット）
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="capacity-medium" />
                  <label
                    htmlFor="capacity-medium"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    中（11〜20セット）
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="capacity-large" />
                  <label
                    htmlFor="capacity-large"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    大（21セット〜）
                  </label>
                </div>
              </div>
            </div>

            <Button className="w-full">フィルターを適用</Button>
          </div>
        </div>

        {/* テーブルエリア */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm p-4">
            {/* テーブル上部の操作エリア */}
            <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
              <div className="flex gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="保管庫を検索" className="pl-8" />
                </div>
                <Button variant="outline">
                  <SortAsc className="h-4 w-4 mr-2" />
                  並び替え
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  エクスポート
                </Button>
                <Button>
                  <span className="mr-2">+</span>
                  新規保管庫
                </Button>
              </div>
            </div>

            {/* テーブル */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      保管庫 ID/名称
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      場所
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      空き状況
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      容量
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Array.from({ length: 8 }).map((_, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          保管庫 #{idx + 1}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: S00{idx + 1}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {idx % 3 === 0
                            ? "東棟"
                            : idx % 3 === 1
                            ? "西棟"
                            : "南棟"}
                          {idx % 2 === 0 ? "1F" : "2F"}-
                          {String.fromCharCode(65 + idx)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          variant={
                            idx % 3 === 0
                              ? "success"
                              : idx % 3 === 1
                              ? "warning"
                              : "destructive"
                          }
                        >
                          {idx % 3 === 0
                            ? "空き有り"
                            : idx % 3 === 1
                            ? "残りわずか"
                            : "満タン"}
                        </Badge>
                        <div className="text-xs text-gray-500 mt-1">
                          {idx % 3 === 0
                            ? "50%"
                            : idx % 3 === 1
                            ? "85%"
                            : "100%"}{" "}
                          使用中
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {idx % 3 === 0 ? "10" : idx % 3 === 1 ? "20" : "30"}{" "}
                          セット
                        </div>
                        <div className="text-xs text-gray-500">
                          {idx % 3 === 0 ? "5" : idx % 3 === 1 ? "3" : "0"}{" "}
                          セット利用可能
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-indigo-600 hover:text-indigo-900"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">詳細を見る</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">編集する</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-900"
                          >
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">削除する</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ページネーション */}
            <div className="flex items-center justify-between py-3 mt-4">
              <div className="flex-1 flex justify-between sm:hidden">
                <Button variant="outline">前へ</Button>
                <Button variant="outline">次へ</Button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    全 <span className="font-medium">20</span> 件中{" "}
                    <span className="font-medium">1</span> から{" "}
                    <span className="font-medium">8</span> 件を表示
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-l-md"
                    >
                      前へ
                    </Button>
                    <Button variant="outline" size="sm">
                      1
                    </Button>
                    <Button variant="outline" size="sm">
                      2
                    </Button>
                    <Button variant="outline" size="sm">
                      3
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-r-md"
                    >
                      次へ
                    </Button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
