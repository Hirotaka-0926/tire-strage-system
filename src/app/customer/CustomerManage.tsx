"use client";

import React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Client, Car } from "@/utils/interface";
import { getYearAndSeason } from "@/utils/globalFunctions";
import {
  upsertClient,
  deleteClient,
  upsertTask,
  upsertCar,
} from "@/utils/supabaseFunction";
import { useRouter } from "next/navigation";
import { useNotification } from "@/utils/hooks/useNotification";

// サブコンポーネントのインポート
import SearchAndFilter from "./components/SearchAndFilter";
import CreateCustomerDialog from "./components/CreateCustomerDialog";
import CustomerTable from "./components/CustomerTable";
import Pagination from "./components/Pagination";
import CustomerStats from "./components/CustomerStats";
import CustomerDetailDialog from "./components/CustomerDetailDialog";
import EditCustomerDialog from "./components/EditCustomerDialog";
import TireExchangeDialog from "./components/TireExchangeDialog";

interface Props {
  initialCustomers: Client[];
  initialStorageLogs: {
    id: number;
    client_id: number | null;
    year: number;
    season: "summer" | "winter";
    car: Car | null;
    next_theme: string;
  }[];
}

export interface ClientWithExchangeHistory extends Client {
  thisSeasonExchange?: boolean;
  lastSeasonExchange?: boolean;
  cars?: Car[];
  exchangeHistory?: {
    id: number;
    season: "winter" | "summer";
    year: number;
    next_theme: string;
  }[];
}

interface ClientMap {
  [id: number]: ClientWithExchangeHistory;
}

export default function CustomerManage({
  initialCustomers,
  initialStorageLogs,
}: Props) {
  const [customers, setCustomers] = useState<ClientMap>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
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
    model_year: 0,
  });
  const [newCustomer, setNewCustomer] = useState<Client>({
    client_name: "",
    client_name_kana: "",
    post_number: "",
    address: "",
    phone: "",
    notes: "",
  });
  const { showNotification, NotificationComponent } = useNotification();
  const thisSeason = getYearAndSeason();
  const lastSeason = getYearAndSeason(
    new Date(new Date().setMonth(new Date().getMonth() - 6))
  );
  const router = useRouter();

  const createMapFromClients = () => {
    const clientMap: ClientMap = {};
    initialCustomers.forEach((customer) => {
      if (customer.id && !clientMap[customer.id]) {
        clientMap[customer.id] = customer;
      }
    });
    return clientMap;
  };

  const handleCreateCustomer = async () => {
    if (isLoading) return;
    //２連続実行させないため
    setIsLoading(true);

    try {
      const result = await upsertClient(newCustomer);

      if (result) {
        const savedCustomer = result;

        setCustomers((prev) => ({
          ...prev,
          [savedCustomer.id!]: savedCustomer,
        }));

        setNewCustomer({
          client_name: "",
          client_name_kana: "",
          post_number: "",
          address: "",
          phone: "",
          notes: "",
        });

        setIsCreateDialogOpen(false);
        showNotification("success", "顧客を正常に作成しました");

        router.refresh();
      }
    } catch (error) {
      console.error("Error creating customer:", error);
      showNotification("error", "顧客の作成に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const createStatusAndHistoryFromLogs = () => {
    const targetCustomers: ClientMap = createMapFromClients();
    initialStorageLogs.forEach((log) => {
      const targetId = log.client_id;
      if (targetId && targetCustomers && targetCustomers[targetId]) {
        const newHistory = {
          id: log.id,
          season: log.season,
          year: log.year,

          next_theme: log.next_theme,
        };
        if (targetCustomers[targetId].exchangeHistory) {
          targetCustomers[targetId].exchangeHistory.push(newHistory);
          // タイヤ交換履歴を追加
        } else {
          targetCustomers[targetId].exchangeHistory = [newHistory];
        } // タイヤ交換履歴を初期化
        if (log.car) {
          if (targetCustomers[targetId].cars) {
            const existingCar = targetCustomers[targetId].cars!.find(
              (car) => car.id === log.car!.id
            );
            if (!existingCar) {
              targetCustomers[targetId].cars!.push(log.car);
            }
          } else {
            targetCustomers[targetId].cars = [log.car];
          }
        }

        // 今シーズンと前シーズンの交換ステータスを設定
        if (log.season === thisSeason.season && log.year === thisSeason.year) {
          targetCustomers[targetId].thisSeasonExchange = true;
        }
        if (log.season === lastSeason.season && log.year === lastSeason.year) {
          targetCustomers[targetId].lastSeasonExchange = true;
        }
      }
    });
    setCustomers(targetCustomers);
  };

  useEffect(() => {
    createStatusAndHistoryFromLogs();
  }, [initialCustomers, initialStorageLogs]);

  // フィルタリングされた顧客リスト（重複除去も含む）
  const filteredCustomers = Object.values(customers)
    .filter((customer, index, array) => {
      // 重複除去: 同じIDの最初の要素のみを残す
      return array.findIndex((c) => c.id === customer.id) === index;
    })
    .filter((customer: ClientWithExchangeHistory) => {
      const matchesSearch =
        customer.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.client_name_kana
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        customer.post_number.includes(searchTerm) ||
        customer.address.toLowerCase().includes(searchTerm.toLowerCase());

      if (filterStatus === "this-season") {
        return matchesSearch && customer.thisSeasonExchange;
      } else if (filterStatus === "needs-contact") {
        return (
          matchesSearch &&
          customer.lastSeasonExchange &&
          !customer.thisSeasonExchange
        );
      } else if (filterStatus === "not-used") {
        return (
          matchesSearch &&
          !customer.lastSeasonExchange &&
          !customer.thisSeasonExchange
        );
      }

      return matchesSearch;
    });

  // ページネーション計算
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCustomers = filteredCustomers.slice(startIndex, endIndex);

  // ページ変更時の処理
  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
  };

  // 検索やフィルター変更時にページをリセット
  const handleSearchChange = (value: string): void => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (value: string): void => {
    setFilterStatus(value);
    setCurrentPage(1);
  };

  // 顧客編集
  const handleEditCustomer = async () => {
    if (!selectedCustomer || isLoading) return;
    //２連続実行を防ぐ
    setIsLoading(true);

    try {
      const updatedCustomer = {
        id: selectedCustomer.id,
        client_name: selectedCustomer.client_name,
        client_name_kana: selectedCustomer.client_name_kana,
        post_number: selectedCustomer.post_number,
        address: selectedCustomer.address,
        phone: selectedCustomer.phone,
        notes: selectedCustomer.notes,
      };
      const result = await upsertClient(updatedCustomer);

      if (result) {
        //nullチェック
        const updatedCustomer = result;

        setCustomers((prev) => ({
          ...prev,
          [updatedCustomer.id!]: {
            ...prev[updatedCustomer.id!],
            ...updatedCustomer,
          },
        }));

        setIsEditDialogOpen(false);
        setSelectedCustomer(null);
        showNotification("success", "顧客情報を正常に更新しました");
        router.refresh();
      }
    } catch (error) {
      console.error("Error updating customer:", error);
      showNotification("error", "顧客情報の更新に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  // 顧客削除
  const handleDeleteCustomer = async (customerId: number) => {
    if (isLoading) return;
    setIsLoading(true);
    await deleteClient(customerId);
    showNotification("success", "顧客を削除しました");
    router.refresh();
  };

  // タイヤ交換受付
  const handleTireExchange = async () => {
    if (!selectedCustomer || isLoading) return;

    // 車が選択されていない場合はエラー表示
    if (
      !selectedCar ||
      !selectedCar.car_model ||
      !selectedCar.car_number ||
      selectedCar.model_year === 0
    ) {
      setIsExchangeDialogOpen(false);
      showNotification("error", "車の情報を入力してください");
      return;
    }

    setIsLoading(true);

    try {
      // 新しいタスクを作成

      // 新しい車の場合はDBに保存
      const isExistCar = selectedCustomer.cars?.includes(selectedCar) ?? false;

      if (!isExistCar) {
        const newCar = await upsertCar(selectedCar);
        if (newCar) {
          setSelectedCar(newCar);
        }
      }

      const newTask = {
        client_id: selectedCustomer.id!,
        car_id: selectedCar.id!,
        status: "incomplete",
      };

      await upsertTask(newTask);

      // リセット
      setSelectedCar({ car_model: "", car_number: "", model_year: 2003 });
      setIsExchangeDialogOpen(false);
      setSelectedCustomer(null);

      showNotification("success", "タイヤ交換を受付しました");
      router.refresh();
    } catch (error) {
      console.error("Error creating tire exchange task:", error);
      showNotification("error", "タイヤ交換受付に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationComponent />

      <div className="max-w-7xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">顧客リスト</CardTitle>
          </CardHeader>
          <CardContent>
            {/* 検索・フィルター・アクションエリア */}
            <SearchAndFilter
              searchTerm={searchTerm}
              filterStatus={filterStatus}
              onSearchChange={handleSearchChange}
              onFilterChange={handleFilterChange}
            />

            <CreateCustomerDialog
              isOpen={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
              newCustomer={newCustomer}
              onCustomerChange={setNewCustomer}
              onCreateCustomer={handleCreateCustomer}
              isLoading={isLoading}
            />

            {/* 顧客テーブル */}
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

            {/* ページネーション */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              startIndex={startIndex}
              endIndex={endIndex}
              totalItems={filteredCustomers.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={(value) => {
                setItemsPerPage(value);
                setCurrentPage(1);
              }}
            />

            {/* 統計情報 */}
            <CustomerStats customers={Object.values(customers)} />
          </CardContent>
        </Card>

        {/* ダイアログ */}
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
}
