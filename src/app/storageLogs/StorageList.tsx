"use client";

import type { StorageLogInput } from "@/utils/interface"; // Assuming this interface matches TABLE_COLUMNS keys
import type React from "react";
import { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

import { ChevronDown, Info } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  storageList: StorageLogInput[];
  setSelectedStorages: React.Dispatch<
    React.SetStateAction<Set<StorageLogInput>>
  >;
  selectedStorages: Set<StorageLogInput>;
  isConvertPDF: boolean;
  tabText: string;
  setTabText: React.Dispatch<React.SetStateAction<string>>;
}

const TABLE_COLUMNS = [
  { key: "year", label: "年", visible: true },
  { key: "season", label: "シーズン", visible: true },
  { key: "storage.id", label: "保管庫ID", visible: true },
  { key: "client.client_name", label: "顧客名", visible: true },
  { key: "car.car_model", label: "車種", visible: true },
  { key: "car.car_number", label: "ナンバー", visible: true },
  { key: "state.tire_maker", label: "タイヤメーカー", visible: true },
  { key: "state.tire_size", label: "タイヤサイズ", visible: true },
  { key: "state.tire_pattern", label: "タイヤパターン", visible: true },
];

const ROWS_PER_PAGE = 10; // 1ページあたりの表示行数

const LogTable: React.FC<Props> = ({
  storageList,
  setSelectedStorages,
  selectedStorages,
  isConvertPDF, // Not directly used in table display
  tabText, // Not directly used in table display
  setTabText, // Not directly used in table display
  // Not directly used in table display, storageList is source
}) => {
  const [visibleColumns, setVisibleColumns] = useState(
    TABLE_COLUMNS.reduce(
      (acc, col) => ({
        ...acc,
        [col.key]: col.visible,
      }),
      {} as Record<string, boolean>
    )
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCurrentPage(1); // ページをリセット
  }, [storageList, toast, setSelectedStorages]);

  const getNestedValue = (key: string, value: any) => {
    if (!key || !value) {
      return "/";
    }

    const splitKeys = key.split(".");
    const nestedValue = splitKeys.reduce((obj, c) => {
      // nullやundefinedの場合は空文字を返す
      if (obj == null) {
        return "/";
      }

      // オブジェクトでない場合（プリミティブ値）は空文字を返す
      if (typeof obj !== "object") {
        return "/";
      }

      return obj[c];
    }, value);

    // 最終的にnullやundefinedの場合は空文字を返す
    return nestedValue ?? "/";
  };

  // ページネーションロジック
  const totalPages = Math.ceil(storageList.length / ROWS_PER_PAGE);
  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * ROWS_PER_PAGE;
    const lastPageIndex = firstPageIndex + ROWS_PER_PAGE;
    return storageList.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, storageList]);

  // 全選択/全解除ハンドラ
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newSelected = new Set(selectedStorages);
      currentTableData.forEach((row) => newSelected.add(row));
      setSelectedStorages(newSelected);
    } else {
      const newSelected = new Set(selectedStorages);
      currentTableData.forEach((row) => newSelected.delete(row));
      setSelectedStorages(newSelected);
    }
  };

  // 個別行選択ハンドラ
  const handleRowSelect = (row: StorageLogInput, checked: boolean) => {
    setSelectedStorages((prev) => {
      const newSelection = new Set(prev);
      if (checked) {
        newSelection.add(row);
      } else {
        newSelection.delete(row);
      }
      return newSelection;
    });
  };

  // 現在のページで全ての行が選択されているか
  const canSelectAll =
    currentTableData.length > 0 &&
    currentTableData.every((row) => selectedStorages.has(row));

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100">
          保管タイヤ一覧
        </CardTitle>
        <div className="flex flex-wrap gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-10 text-base bg-transparent"
              >
                表示項目 <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {TABLE_COLUMNS.map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.key}
                  className="capitalize"
                  checked={visibleColumns[column.key]}
                  onCheckedChange={(value) =>
                    setVisibleColumns((prev) => ({
                      ...prev,
                      [column.key]: value,
                    }))
                  }
                >
                  {column.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {/* 削除、PDF出力、CSVダウンロードボタンは親コンポーネントで実装されていると仮定 */}
          {/* <Button variant="outline" className="h-10 text-base bg-transparent">CSVダウンロード</Button> */}
          {/* <Button variant="outline" className="h-10 text-base bg-transparent">PDF出力</Button> */}
          {/* <Button variant="destructive" disabled={selectedStorages.size === 0} className="h-10 text-base">削除 ({selectedStorages.size})</Button> */}
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={canSelectAll}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                    disabled={loading || currentTableData.length === 0}
                  />
                </TableHead>
                {TABLE_COLUMNS.filter((col) => visibleColumns[col.key]).map(
                  (column) => (
                    <TableHead key={column.key} className="text-base">
                      {column.label}
                    </TableHead>
                  )
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: ROWS_PER_PAGE }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-5 w-5 rounded-sm" />
                    </TableCell>
                    {TABLE_COLUMNS.filter((col) => visibleColumns[col.key]).map(
                      (column) => (
                        <TableCell key={column.key}>
                          <Skeleton className="h-5 w-[100px]" />
                        </TableCell>
                      )
                    )}
                  </TableRow>
                ))
              ) : storageList.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={
                      TABLE_COLUMNS.filter((col) => visibleColumns[col.key])
                        .length + 1
                    }
                    className="h-24 text-center text-gray-500 dark:text-gray-400"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <Info className="h-10 w-10 mb-2 text-gray-400" />
                      <p className="text-lg">
                        検索条件に一致するタイヤデータはありません。
                      </p>
                      {/* 親コンポーネントでフィルタークリアボタンを実装することを推奨 */}
                      {/* <Button variant="link" onClick={clearFilters} className="mt-2 text-primary">
                        フィルターをクリアして全件表示
                      </Button> */}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                currentTableData.map((row, index) => (
                  <TableRow
                    key={index} // Unique key for each row, assuming row data might not have a unique ID
                    data-state={selectedStorages.has(row) && "selected"}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedStorages.has(row)}
                        onCheckedChange={(checked) =>
                          handleRowSelect(row, !!checked)
                        }
                        aria-label={`Select row ${row.storage.id}`}
                      />
                    </TableCell>
                    {TABLE_COLUMNS.filter((col) => visibleColumns[col.key]).map(
                      (column) => (
                        <TableCell key={column.key} className="text-base">
                          {column.key === "season"
                            ? row[column.key] === "summer"
                              ? "夏"
                              : "冬"
                            : getNestedValue(column.key, row)}
                        </TableCell>
                      )
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t mt-6">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {selectedStorages.size} 件の行が選択されています ({storageList.length}{" "}
          件中)
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1 || loading}
            className="h-10 text-base"
          >
            前へ
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages || loading}
            className="h-10 text-base"
          >
            次へ
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LogTable;
