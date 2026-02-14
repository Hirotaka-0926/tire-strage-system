"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Client,
  Car,
  ClientWithExchangeHistory,
  CustomerFilterStatus,
  CustomerMap,
  StorageLogSummary,
} from "@/app/refactor/domain/type/reseption";
import { getYearAndSeason } from "@/utils/globalFunctions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createCustomerReceptionApplication } from "@/app/refactor/application/reseption/customerReceptionApplication";

// 既存のUIコンポーネントをそのまま利用
import SearchAndFilter from "@/app/refactor/prezentation/reseption/components/SearchAndFilter";
import CreateCustomerDialog from "@/app/refactor/prezentation/reseption/components/CreateCustomerDialog";
import CustomerTable from "@/app/refactor/prezentation/reseption/components/CustomerTable";
import Pagination from "@/app/customer/components/Pagination";
import CustomerStats from "@/app/customer/components/CustomerStats";
import CustomerDetailDialog from "@/app/customer/components/CustomerDetailDialog";
import EditCustomerDialog from "@/app/customer/components/EditCustomerDialog";
import TireExchangeDialog from "@/app/customer/components/TireExchangeDialog";

interface Props {
  initialCustomers: Client[];
  initialStorageLogs: StorageLogSummary[];
}

const CustomerReception = ({ initialCustomers, initialStorageLogs }: Props) => {
  const [customers, setCustomers] = useState<CustomerMap>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<CustomerFilterStatus>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isExchangeDialogOpen, setIsExchangeDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] =
    useState<ClientWithExchangeHistory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car>({
    car_model: "",
    car_number: "",
  });
  const thisSeason = useMemo(() => getYearAndSeason(), []);
  const lastSeason = useMemo(
    () => getYearAndSeason(new Date(new Date().setMonth(new Date().getMonth() - 6))),
    []
  );

  const router = useRouter();

  const app = useMemo(
    () => createCustomerReceptionApplication(),
    []
  );
  const [newCustomer, setNewCustomer] = useState<Client>(() =>
    app.createEmptyCustomer()
  );

  useEffect(() => {
    const mapped = app.buildCustomersWithLogs(
      initialCustomers,
      initialStorageLogs,
      thisSeason,
      lastSeason
    );
    setCustomers(mapped);
  }, [app, initialCustomers, initialStorageLogs, lastSeason, thisSeason]);

  const filteredCustomers = useMemo(
    () => app.filterCustomers(customers, searchTerm, filterStatus),
    [app, customers, filterStatus, searchTerm]
  );

  const { totalPages, startIndex, endIndex, currentCustomers } = useMemo(
    () => app.paginateCustomers(filteredCustomers, currentPage, itemsPerPage),
    [app, currentPage, filteredCustomers, itemsPerPage]
  );

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

  const handleDeleteCustomer = async (customerId: number) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await app.deleteCustomer(customerId);
      setCustomers((prev) => app.removeCustomer(prev, customerId));
      toast.success("顧客を削除しました");
      router.refresh();
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast.error("顧客の削除に失敗しました");
    } finally {
      setIsLoading(false);
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
        selectedCar
      );
      setCustomers((prev) =>
        app.attachCarToCustomer(prev, selectedCustomer.id!, finalCar)
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
              onDeleteCustomer={handleDeleteCustomer}
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
          onCustomerChange={setSelectedCustomer}
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
      </div>
    </div>
  );
};

export default CustomerReception;



