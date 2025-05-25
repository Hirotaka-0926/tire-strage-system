import React, { useCallback, useEffect } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { StorageLogInput } from "@/utils/interface";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ChevronDown } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Props {
  searchKey: string;
  searchValue: string;
  year: number;
  season: "summer" | "winter";
  isSearchBySeason: boolean;
  storageList: StorageLogInput[];
  setStorageList: React.Dispatch<React.SetStateAction<StorageLogInput[]>>;
  setSelectedStorages: React.Dispatch<React.SetStateAction<StorageLogInput[]>>;
  selectedStorages: StorageLogInput[];
  isConvertPDF: boolean;
  setTabText: React.Dispatch<React.SetStateAction<string>>;
  tabText: string;
}

export const columns: ColumnDef<StorageLogInput>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "storage.id",
    header: "保管庫ID",
    cell: ({ row }) => {
      const storageType = row.original.storage?.id;
      return <div className="capitalize">{storageType || "-"}</div>;
    },
  },
  {
    accessorKey: "client.client_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          顧客名
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div>{row.original.client?.client_name || "-"}</div>;
    },
  },
  {
    accessorKey: "car.car_model",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          車種
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div>{row.original.car?.car_model || "-"}</div>;
    },
  },

  {
    accessorKey: "car.car_number",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          車ナンバー
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div>{row.original.car?.car_number || "-"}</div>;
    },
  },

  {
    accessorKey: "state.tire_maker",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          タイヤメーカー
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div>{row.original.state?.tire_maker || "-"}</div>;
    },
  },

  {
    accessorKey: "state.tire_pattern",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          タイヤパターン
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div>{row.original.state?.tire_pattern || "-"}</div>;
    },
  },

  {
    accessorKey: "state.tire_size",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          タイヤサイズ
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div>{row.original.state?.tire_size || "-"}</div>;
    },
  },
];

export const DataTableDemo: React.FC<Props> = ({
  searchKey,
  searchValue,
  year,
  season,
  isSearchBySeason,
  storageList,
  setStorageList,
  setSelectedStorages,
  setTabText,
  tabText,
}) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [allStorages, setAllStorages] = React.useState<StorageLogInput[]>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const router = useRouter();

  const table = useReactTable({
    data: storageList,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  const selectedRows = table
    .getSelectedRowModel()
    .rows.map((row) => row.original);
  console.log(selectedRows);

  const filterStorageList = useCallback(() => {
    if (!allStorages.length) return;

    if (!searchValue) {
      if (isSearchBySeason) {
        const filteredBySeason = allStorages.filter(
          (storage: StorageLogInput) =>
            storage.season === season && storage.year === year
        );
        setStorageList(
          filteredBySeason.length ? filteredBySeason : allStorages
        );
      } else {
        setStorageList(allStorages);
      }
      return;
    }

    const filteredByKey = allStorages.filter((storage: StorageLogInput) => {
      try {
        const fieldValue = getNestedProperty(storage, searchKey);

        if (fieldValue === undefined || fieldValue === null) return false;

        if (typeof fieldValue === "string") {
          return fieldValue.toLowerCase().includes(searchValue.toLowerCase());
        } else if (typeof fieldValue === "number") {
          return fieldValue.toString().includes(searchValue);
        } else if (fieldValue instanceof Date) {
          return fieldValue.toISOString().includes(searchValue);
        }
      } catch (err) {
        console.error("フィルタリングエラー:", err);
      }
      return false;
    });

    if (isSearchBySeason) {
      const filteredBySeason = filteredByKey.filter(
        (storage: StorageLogInput) =>
          storage.season === season && storage.year === year
      );
      setStorageList(
        filteredBySeason.length ? filteredBySeason : filteredByKey
      );
    } else {
      setStorageList(filteredByKey);
    }
  }, [
    allStorages,
    searchKey,
    searchValue,
    isSearchBySeason,
    season,
    year,
    setStorageList,
  ]);

  const getNestedProperty = useCallback(
    (obj: StorageLogInput, path: string): unknown => {
      try {
        return path.split(".").reduce((prev: unknown, curr: string) => {
          if (prev && typeof prev === "object") {
            return (prev as Record<string, unknown>)[curr];
          }
          return undefined;
        }, obj);
      } catch (error) {
        console.error("プロパティアクセスエラー:", error);
        return undefined;
      }
    },
    []
  );

  useEffect(() => {
    filterStorageList();
  }, [filterStorageList]);

  useEffect(() => {
    setAllStorages(storageList);
  }, []);

  React.useEffect(() => {
    const selectColumn = table.getColumn("select");

    if (selectColumn) {
      // When in detail view, hide the select column and manage column visibility
      setColumnVisibility((prev) => ({
        ...prev,
        select: tabText !== "detail",
      }));
    }
  }, [tabText]);

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Tabs className="w-[400px]" value={tabText} onValueChange={setTabText}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="detail">詳細表示</TabsTrigger>
            <TabsTrigger value="checkbox">選択</TabsTrigger>
          </TabsList>
        </Tabs>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => {
                    if (tabText == "checkbox") {
                      row.toggleSelected(!row.getIsSelected());
                      console.log(row.getIsSelected());
                      console.log(row.original);
                      // Update the selected storages state
                      const selectedRowData = row.original;
                      if (!row.getIsSelected()) {
                        // The current state is not selected, so we're selecting it now
                        setSelectedStorages((prev) => [
                          ...prev,
                          selectedRowData,
                        ]);
                      } else {
                        // The current state is selected, so we're deselecting it now
                        setSelectedStorages((prev) =>
                          prev.filter(
                            (storage) => storage.id !== selectedRowData.id
                          )
                        );
                      }
                    } else if (tabText == "detail") {
                      router.push(`/storageLogs/${row.original.id}`);
                    }
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
