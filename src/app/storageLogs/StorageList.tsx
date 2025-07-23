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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { ChevronDown, Info, Trash2, Eye } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useRouter } from "next/navigation";

interface Props {
  storageList: StorageLogInput[];
  setSelectedStorages: React.Dispatch<
    React.SetStateAction<Set<StorageLogInput>>
  >;
  selectedStorages: Set<StorageLogInput>;
  onDeleteStorage?: (storageId: number) => void;
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

const ROWS_PER_PAGE_DEFAULT = 10; // 1ページあたりの表示行数

const ROWS_PER_PAGE_OPTIONS = [10, 20, 50, 100]; // ページあたりの行数選択肢

const LogTable: React.FC<Props> = ({
  storageList,
  setSelectedStorages,
  selectedStorages,
  onDeleteStorage,
  // Not directly used in table display, st orageList is source
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
  const [loading] = useState(false);
  const router = useRouter();
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_DEFAULT);

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
  const totalPages = Math.ceil(storageList.length / rowsPerPage);
  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * rowsPerPage;
    const lastPageIndex = firstPageIndex + rowsPerPage;
    return storageList.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, storageList, rowsPerPage]);

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

  // 削除ハンドラー
  const handleDeleteStorage = (storageId: number) => {
    if (onDeleteStorage) {
      onDeleteStorage(storageId);
      // 削除後、選択状態をクリア
      setSelectedStorages((prev) => {
        const newSelection = new Set(prev);
        // 削除されたアイテムを選択から除外
        const deletedItem = Array.from(prev).find(item => item.id === storageId);
        if (deletedItem) {
          newSelection.delete(deletedItem);
        }
        return newSelection;
      });
    }
  };

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
                <TableHead key={"action"} className="text-base">
                  アクション
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: rowsPerPage }).map((_, i) => (
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

                    <TableCell className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/storageLogs/${row.id}`)}
                        title="詳細表示"
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            title="削除"
                            disabled={!onDeleteStorage}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>保管データを削除</AlertDialogTitle>
                            <AlertDialogDescription>
                              この保管データを削除してもよろしいですか？
                              <br />
                              保管庫ID: {row.storage.id}
                              <br />
                              顧客名: {row.client.client_name}
                              <br />
                              この操作は取り消すことができません。
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>キャンセル</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteStorage(row.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              削除
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                {rowsPerPage}行表示 <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {ROWS_PER_PAGE_OPTIONS.map((option) => (
                <DropdownMenuCheckboxItem
                  key={option}
                  onClick={() => setRowsPerPage(option)}
                  checked={option === rowsPerPage}
                >
                  {option}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LogTable;
