"use client";

import { useEffect, useMemo, useState } from "react";
import { HistoryListItem } from "@/app/refactor/domain/type/history";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Info } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface HistoryTableProps {
  items: HistoryListItem[];
}

const TABLE_COLUMNS = [
  { key: "year", label: "年", visible: true },
  { key: "season", label: "シーズン", visible: true },
  { key: "storageId", label: "保管庫ID", visible: true },
  { key: "clientName", label: "顧客名", visible: true },
  { key: "carModel", label: "車種", visible: true },
  { key: "carNumber", label: "ナンバー", visible: true },
  { key: "assigner", label: "担当者", visible: true },
] as const;

const ROWS_PER_PAGE_DEFAULT = 10;
const ROWS_PER_PAGE_OPTIONS = [10, 20, 50, 100];

const HistoryTable = ({ items }: HistoryTableProps) => {
  const [visibleColumns, setVisibleColumns] = useState(
    TABLE_COLUMNS.reduce(
      (acc, column) => ({
        ...acc,
        [column.key]: column.visible,
      }),
      {} as Record<(typeof TABLE_COLUMNS)[number]["key"], boolean>,
    ),
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_DEFAULT);

  useEffect(() => {
    setCurrentPage(1);
  }, [items, rowsPerPage]);

  const totalPages = Math.max(1, Math.ceil(items.length / rowsPerPage));

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * rowsPerPage;
    const lastPageIndex = firstPageIndex + rowsPerPage;
    return items.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, items, rowsPerPage]);

  if (items.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center text-gray-500">
        <Info className="mx-auto mb-2 h-8 w-8 text-gray-400" />
        履歴データがありません。
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-transparent">
              表示項目 <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {TABLE_COLUMNS.map((column) => (
              <DropdownMenuCheckboxItem
                key={column.key}
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
      </div>

      <div className="overflow-x-auto">
        <Table className="min-w-[760px]">
          <TableHeader>
            <TableRow>
              {TABLE_COLUMNS.filter((column) => visibleColumns[column.key]).map(
                (column) => (
                  <TableHead key={column.key}>{column.label}</TableHead>
                ),
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentTableData.map((item, index) => (
              <TableRow key={`${item.id}-${item.year}-${item.storageId}-${index}`}>
                {visibleColumns.year && <TableCell>{item.year}</TableCell>}
                {visibleColumns.season && (
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        item.season === "summer"
                          ? "bg-orange-50 text-orange-700"
                          : "bg-blue-50 text-blue-700"
                      }
                    >
                      {item.seasonLabel}
                    </Badge>
                  </TableCell>
                )}
                {visibleColumns.storageId && (
                  <TableCell className="font-mono">{item.storageId}</TableCell>
                )}
                {visibleColumns.clientName && <TableCell>{item.clientName}</TableCell>}
                {visibleColumns.carModel && <TableCell>{item.carModel}</TableCell>}
                {visibleColumns.carNumber && (
                  <TableCell className="font-mono">{item.carNumber}</TableCell>
                )}
                {visibleColumns.assigner && <TableCell>{item.assigner}</TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-gray-600">全 {items.length} 件</div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            前へ
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage >= totalPages}
          >
            次へ
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {rowsPerPage}件表示 <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {ROWS_PER_PAGE_OPTIONS.map((option) => (
                <DropdownMenuCheckboxItem
                  key={option}
                  checked={option === rowsPerPage}
                  onCheckedChange={() => setRowsPerPage(option)}
                >
                  {option}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default HistoryTable;
