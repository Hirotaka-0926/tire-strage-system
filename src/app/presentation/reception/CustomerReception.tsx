"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Client,
  Car,
  ClientWithExchangeHistory,
  CustomerFilterStatus,
  CustomerMap,
  StorageAssignmentSummary,
  StorageLogSummary,
} from "@/app/domain/type/reception";
import { getYearAndSeason } from "@/utils/globalFunctions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createCustomerReceptionApplication } from "@/app/application/reception/customerReceptionApplication";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// 既存のUIコンポーネントをそのまま利用
import SearchAndFilter from "@/app/presentation/reception/components/SearchAndFilter";
import CreateCustomerDialog from "@/app/presentation/reception/components/CreateCustomerDialog";
import CustomerTable from "@/app/presentation/reception/components/CustomerTable";
import CustomerDetailDialog from "@/app/presentation/reception/components/CustomerDetailDialog";
import EditCustomerDialog from "@/app/presentation/reception/components/EditCustomerDialog";
import TireExchangeDialog from "@/app/presentation/reception/components/TireExchangeDialog";
import Pagination from "@/app/presentation/reception/components/Pagination";
import CustomerStats from "@/app/presentation/reception/components/CustomerStats";

interface Props {
  initialCustomers: Client[];
  initialStorageLogs: StorageLogSummary[];
  initialStorageAssignments: StorageAssignmentSummary[];
}

const CustomerReception = ({
  initialCustomers,
  initialStorageLogs,
  initialStorageAssignments,
}: Props) => {
  const [customers, setCustomers] = useState<CustomerMap>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<CustomerFilterStatus>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isExchangeDialogOpen, setIsExchangeDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] =
    useState<ClientWithExchangeHistory | null>(null);
  const [pendingDeleteCustomer, setPendingDeleteCustomer] =
    useState<ClientWithExchangeHistory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car>({
    car_model: "",
    car_number: "",
  });
  const thisSeason = useMemo(() => getYearAndSeason(), []);
  const lastSeason = useMemo(
    () =>
      getYearAndSeason(
        new Date(new Date().setMonth(new Date().getMonth() - 6)),
      ),
    [],
  );

  const router = useRouter();

  const app = useMemo(() => createCustomerReceptionApplication(), []);
  const [newCustomer, setNewCustomer] = useState<Client>(() =>
    app.createEmptyCustomer(),
  );

  useEffect(() => {
    const mapped = app.buildCustomersWithLogs(
      initialCustomers,
      initialStorageLogs,
      thisSeason,
      lastSeason,
    );
    setCustomers(mapped);
  }, [app, initialCustomers, initialStorageLogs, lastSeason, thisSeason]);

  const filteredCustomers = useMemo(
    () => app.filterCustomers(customers, searchTerm, filterStatus),
    [app, customers, filterStatus, searchTerm],
  );

  const { totalPages, startIndex, endIndex, currentCustomers } = useMemo(
    () => app.paginateCustomers(filteredCustomers, currentPage, itemsPerPage),
    [app, currentPage, filteredCustomers, itemsPerPage],
  );

  const pendingDeleteStorageAssignments = useMemo(() => {
    if (!pendingDeleteCustomer?.id) {
      return [] as StorageAssignmentSummary[];
    }
    return initialStorageAssignments.filter(
      (assignment) => assignment.client_id === pendingDeleteCustomer.id,
    );
  }, [initialStorageAssignments, pendingDeleteCustomer?.id]);

  const pendingDeleteStorageIds = useMemo(
    () => pendingDeleteStorageAssignments.map((assignment) => assignment.id),
    [pendingDeleteStorageAssignments],
  );

  const pendingDeleteHistoryCount = useMemo(() => {
    if (!pendingDeleteCustomer?.id) {
      return 0;
    }
    return initialStorageLogs.filter(
      (log) => log.client_id === pendingDeleteCustomer.id,
    ).length;
  }, [initialStorageLogs, pendingDeleteCustomer?.id]);

  useEffect(() => {
    const safeTotalPages = Math.max(
      1,
      Math.ceil(filteredCustomers.length / itemsPerPage),
    );
    if (currentPage > safeTotalPages) {
      setCurrentPage(safeTotalPages);
    }
  }, [currentPage, filteredCustomers.length, itemsPerPage]);

  const handleCreateCustomer = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const savedCustomer = await app.createCustomer(newCustomer);
      setCustomers((prev) => app.mergeCustomer(prev, savedCustomer));
      setNewCustomer(app.createEmptyCustomer());
      setIsCreateDialogOpen(false);
      toast.success("顧客を正常に作成しました");
      router.refresh();
    } catch (error) {
      console.error("Error creating customer:", error);
      toast.error("顧客の作成に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCustomer = async () => {
    if (!selectedCustomer || isLoading) return;
    setIsLoading(true);
    try {
      const updatedCustomer = await app.updateCustomer(selectedCustomer);
      setCustomers((prev) => app.mergeCustomer(prev, updatedCustomer));
      setIsEditDialogOpen(false);
      setSelectedCustomer(null);
      toast.success("顧客情報を正常に更新しました");
      router.refresh();
    } catch (error) {
      console.error("Error updating customer:", error);
      toast.error("顧客情報の更新に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCustomer = async (customerId: number): Promise<boolean> => {
    if (isLoading) return false;
    setIsLoading(true);
    try {
      await app.deleteCustomer(customerId);
      setCustomers((prev) => app.removeCustomer(prev, customerId));
      toast.success("顧客を削除しました");
      router.refresh();
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : `unknown error: ${JSON.stringify(error)}`;
      console.error("Error deleting customer:", {
        customerId,
        errorMessage,
        error,
      });
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const requestDeleteCustomer = (customer: ClientWithExchangeHistory) => {
    setPendingDeleteCustomer(customer);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteCustomer = async () => {
    if (!pendingDeleteCustomer?.id || isLoading) {
      return;
    }
    const deleted = await handleDeleteCustomer(pendingDeleteCustomer.id);
    if (deleted) {
      setIsDeleteDialogOpen(false);
      setPendingDeleteCustomer(null);
    }
  };

  const handleTireExchange = async () => {
    if (!selectedCustomer || isLoading) return;
    if (!selectedCar || !selectedCar.car_model || !selectedCar.car_number) {
      setIsExchangeDialogOpen(false);
      toast.error("車両情報を入力してください");
      return;
    }

    setIsLoading(true);
    try {
      const { finalCar } = await app.registerTireExchange(
        selectedCustomer,
        selectedCar,
      );
      setCustomers((prev) =>
        app.attachCarToCustomer(prev, selectedCustomer.id!, finalCar),
      );
      setSelectedCar({ car_model: "", car_number: "" });
      setIsExchangeDialogOpen(false);
      setSelectedCustomer(null);
      toast.success("タイヤ交換を受付しました");
      router.refresh();
    } catch (error) {
      console.error("Error creating tire exchange task:", error);
      toast.error("タイヤ交換受付に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">顧客リスト</CardTitle>
          </CardHeader>
          <CardContent>
            <SearchAndFilter
              searchTerm={searchTerm}
              filterStatus={filterStatus}
              onSearchChange={(value) => {
                setSearchTerm(value);
                setCurrentPage(1);
              }}
              onFilterChange={(value) => {
                setFilterStatus(value);
                setCurrentPage(1);
              }}
            />

            <CreateCustomerDialog
              isOpen={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
              newCustomer={newCustomer}
              onCustomerChange={setNewCustomer}
              onCreateCustomer={handleCreateCustomer}
              isLoading={isLoading}
            />

            <CustomerTable
              customers={currentCustomers}
              onViewDetails={(customer) => {
                setSelectedCustomer(customer);
                setIsDetailDialogOpen(true);
              }}
              onTireExchange={(customer) => {
                setSelectedCustomer(customer);
                setIsExchangeDialogOpen(true);
              }}
              onEditCustomer={(customer) => {
                setSelectedCustomer(customer);
                setIsEditDialogOpen(true);
              }}
              onDeleteCustomer={requestDeleteCustomer}
            />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              startIndex={startIndex}
              endIndex={endIndex}
              totalItems={filteredCustomers.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={(value) => {
                setItemsPerPage(value);
                setCurrentPage(1);
              }}
            />

            <CustomerStats customers={Object.values(customers)} />
          </CardContent>
        </Card>

        <CustomerDetailDialog
          isOpen={isDetailDialogOpen}
          onOpenChange={setIsDetailDialogOpen}
          customer={selectedCustomer}
          onTireExchange={() => {
            setIsDetailDialogOpen(false);
            setIsExchangeDialogOpen(true);
          }}
          onEditCustomer={() => {
            setIsDetailDialogOpen(false);
            setIsEditDialogOpen(true);
          }}
        />

        <EditCustomerDialog
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          customer={selectedCustomer}
          onCustomerChange={(customer) => setSelectedCustomer(customer)}
          onUpdateCustomer={handleEditCustomer}
          isLoading={isLoading}
        />

        <TireExchangeDialog
          isOpen={isExchangeDialogOpen}
          onOpenChange={setIsExchangeDialogOpen}
          selectedCustomer={selectedCustomer}
          selectedCar={selectedCar}
          setSelectedCar={setSelectedCar}
          onTireExchange={handleTireExchange}
        />

        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={(open) => {
            setIsDeleteDialogOpen(open);
            if (!open) {
              setPendingDeleteCustomer(null);
            }
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>顧客データを削除しますか？</AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    顧客「{pendingDeleteCustomer?.client_name ?? "不明"}
                    」を削除すると、
                    このお客さんの過去の交換記録と車の情報は削除されます。
                  </p>
                  <p>この操作は取り消せません。</p>
                  {pendingDeleteHistoryCount > 0 && (
                    <p>削除対象の交換記録: {pendingDeleteHistoryCount}件</p>
                  )}
                  {pendingDeleteStorageIds.length > 0 && (
                    <div className="rounded-md border border-red-200 bg-red-50 p-3 text-red-900">
                      <p className="font-medium">
                        以下の保管庫に顧客データがあります:
                      </p>
                      <p>{pendingDeleteStorageIds.join(", ")}</p>
                      <p className="mt-1">
                        該当する保管庫データも削除されます。
                      </p>
                    </div>
                  )}
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isLoading}>
                キャンセル
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={(event) => {
                  event.preventDefault();
                  void confirmDeleteCustomer();
                }}
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700"
              >
                {isLoading ? "削除中..." : "削除する"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default CustomerReception;
