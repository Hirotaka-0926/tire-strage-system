"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Home,
  Users,
  CalendarDays,
  Package,
  BarChart3,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

大量のサンプルデータを生成;
const generateSampleCustomers = () => {
  const customers = [];
  const prefectures = [
    "東京都",
    "神奈川県",
    "千葉県",
    "埼玉県",
    "大阪府",
    "愛知県",
    "福岡県",
  ];
  const areas = ["○○区", "△△市", "□□町"];

  for (let i = 1; i <= 350; i++) {
    const thisSeasonExchange = Math.random() > 0.4;
    const lastSeasonExchange = Math.random() > 0.3;
    const prefecture =
      prefectures[Math.floor(Math.random() * prefectures.length)];
    const area = areas[Math.floor(Math.random() * areas.length)];

    // 交換履歴を生成
    const exchangeHistory = [];
    const currentYear = new Date().getFullYear();

    if (lastSeasonExchange) {
      exchangeHistory.push({
        id: `${i}-1`,
        date: `${currentYear - 1}/11/${Math.floor(Math.random() * 28) + 1}`,
        type: "冬タイヤ → 夏タイヤ",
        notes: "定期交換",
        season: "前シーズン",
      });
      exchangeHistory.push({
        id: `${i}-2`,
        date: `${currentYear - 1}/04/${Math.floor(Math.random() * 28) + 1}`,
        type: "夏タイヤ → 冬タイヤ",
        notes: "定期交換",
        season: "前シーズン",
      });
    }

    if (thisSeasonExchange) {
      exchangeHistory.push({
        id: `${i}-3`,
        date: `${currentYear}/11/${Math.floor(Math.random() * 28) + 1}`,
        type: "冬タイヤ → 夏タイヤ",
        notes: "定期交換",
        season: "今シーズン",
      });
    }

    customers.push({
      id: i,
      updateDate: `2024/${Math.floor(Math.random() * 12) + 1}/${
        Math.floor(Math.random() * 28) + 1
      }`,
      customerName: `顧客${i.toString().padStart(3, "0")}`,
      customerNameKana: `カナ${i.toString().padStart(3, "0")}`,
      postalCode: `${Math.floor(Math.random() * 900) + 100}-${
        Math.floor(Math.random() * 9000) + 1000
      }`,
      address: `${prefecture}${area}${Math.floor(Math.random() * 99) + 1}丁目`,
      lastExchange: thisSeasonExchange
        ? `2024/${Math.floor(Math.random() * 12) + 1}/${
            Math.floor(Math.random() * 28) + 1
          }`
        : "",
      thisSeasonExchange,
      lastSeasonExchange,
      phone: `0${Math.floor(Math.random() * 9) + 1}-${
        Math.floor(Math.random() * 9000) + 1000
      }-${Math.floor(Math.random() * 9000) + 1000}`,
      notes:
        Math.random() > 0.7
          ? ["要連絡", "新規顧客", "VIP顧客", ""][Math.floor(Math.random() * 4)]
          : "",
      exchangeHistory: exchangeHistory.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    });
  }

  return customers;
};

export default function TireManagementSystem() {
  const [customers, setCustomers] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isExchangeDialogOpen, setIsExchangeDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [newCustomer, setNewCustomer] = useState({
    customerName: "",
    customerNameKana: "",
    postalCode: "",
    address: "",
    phone: "",
    notes: "",
  });

  // フィルタリングされた顧客リスト
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.customerNameKana
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      customer.postalCode.includes(searchTerm) ||
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
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 検索やフィルター変更時にページをリセット
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (value) => {
    setFilterStatus(value);
    setCurrentPage(1);
  };

  // 顧客ステータスの取得
  const getCustomerStatus = (customer) => {
    if (customer.thisSeasonExchange) {
      return {
        type: "success",
        label: "今シーズン交換済み",
        icon: CheckCircle,
      };
    } else if (customer.lastSeasonExchange && !customer.thisSeasonExchange) {
      return { type: "warning", label: "要連絡", icon: AlertTriangle };
    } else if (!customer.lastSeasonExchange && !customer.thisSeasonExchange) {
      return { type: "danger", label: "長期未利用", icon: XCircle };
    }
    return null;
  };

  // 新規顧客作成
  const handleCreateCustomer = () => {
    const newId = Math.max(...customers.map((c) => c.id)) + 1;
    const customer = {
      ...newCustomer,
      id: newId,
      updateDate: new Date().toLocaleDateString("ja-JP"),
      lastExchange: "",
      thisSeasonExchange: false,
      lastSeasonExchange: false,
      exchangeHistory: [],
    };
    setCustomers([...customers, customer]);
    setNewCustomer({
      customerName: "",
      customerNameKana: "",
      postalCode: "",
      address: "",
      phone: "",
      notes: "",
    });
    setIsCreateDialogOpen(false);
  };

  // 顧客編集
  const handleEditCustomer = () => {
    setCustomers(
      customers.map((c) =>
        c.id === selectedCustomer.id ? selectedCustomer : c
      )
    );
    setIsEditDialogOpen(false);
    setSelectedCustomer(null);
  };

  // 顧客削除
  const handleDeleteCustomer = (customerId) => {
    setCustomers(customers.filter((c) => c.id !== customerId));
  };

  // タイヤ交換受付
  const handleTireExchange = () => {
    const newExchangeRecord = {
      id: `${selectedCustomer.id}-${Date.now()}`,
      date: new Date().toLocaleDateString("ja-JP"),
      type: "タイヤ交換",
      notes: "受付処理",
      season: "今シーズン",
    };

    const updatedCustomer = {
      ...selectedCustomer,
      thisSeasonExchange: true,
      lastExchange: new Date().toLocaleDateString("ja-JP"),
      updateDate: new Date().toLocaleDateString("ja-JP"),
      exchangeHistory: [newExchangeRecord, ...selectedCustomer.exchangeHistory],
    };
    setCustomers(
      customers.map((c) => (c.id === selectedCustomer.id ? updatedCustomer : c))
    );
    setIsExchangeDialogOpen(false);
    setSelectedCustomer(null);
  };

  // ページネーションコンポーネント
  const Pagination = () => {
    const getPageNumbers = () => {
      const pages = [];
      const maxVisiblePages = 5;

      if (totalPages <= maxVisiblePages) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        if (currentPage <= 3) {
          for (let i = 1; i <= 5; i++) {
            pages.push(i);
          }
        } else if (currentPage >= totalPages - 2) {
          for (let i = totalPages - 4; i <= totalPages; i++) {
            pages.push(i);
          }
        } else {
          for (let i = currentPage - 2; i <= currentPage + 2; i++) {
            pages.push(i);
          }
        }
      }

      return pages;
    };

    return (
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-600">
          {startIndex + 1} - {Math.min(endIndex, filteredCustomers.length)} /{" "}
          {filteredCustomers.length} 件
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            <ChevronsLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          {getPageNumbers().map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            <ChevronsRight className="w-4 h-4" />
          </Button>
        </div>
        <Select
          value={itemsPerPage.toString()}
          onValueChange={(value) => {
            setItemsPerPage(Number.parseInt(value));
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10件</SelectItem>
            <SelectItem value="20">20件</SelectItem>
            <SelectItem value="50">50件</SelectItem>
            <SelectItem value="100">100件</SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-gray-800 text-white p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">タイヤ保管管理システム</h1>
          <nav className="flex space-x-6">
            <a
              href="#"
              className="flex items-center space-x-1 hover:text-gray-300"
            >
              <Home className="w-4 h-4" />
              <span>ホーム</span>
            </a>
            <a
              href="#"
              className="flex items-center space-x-1 bg-gray-700 px-3 py-1 rounded"
            >
              <Users className="w-4 h-4" />
              <span>顧客リスト</span>
            </a>
            <a
              href="#"
              className="flex items-center space-x-1 hover:text-gray-300"
            >
              <CalendarDays className="w-4 h-4" />
              <span>タイヤ交換予約リスト</span>
            </a>
            <a
              href="#"
              className="flex items-center space-x-1 hover:text-gray-300"
            >
              <Package className="w-4 h-4" />
              <span>保管庫一覧</span>
            </a>
            <a
              href="#"
              className="flex items-center space-x-1 hover:text-gray-300"
            >
              <BarChart3 className="w-4 h-4" />
              <span>保管庫状況確認</span>
            </a>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">顧客リスト</CardTitle>
          </CardHeader>
          <CardContent>
            {/* 検索・フィルター・アクションエリア */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="顧客名、カナ、郵便番号、住所で検索..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={handleFilterChange}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="ステータスで絞り込み" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  <SelectItem value="this-season">
                    今シーズン交換済み
                  </SelectItem>
                  <SelectItem value="needs-contact">
                    要連絡（前シーズンのみ）
                  </SelectItem>
                  <SelectItem value="not-used">長期未利用</SelectItem>
                </SelectContent>
              </Select>
              <Dialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button className="bg-black hover:bg-gray-800">
                    <Plus className="w-4 h-4 mr-2" />
                    新しい顧客を作成
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>新規顧客作成</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="customerName">顧客名</Label>
                      <Input
                        id="customerName"
                        value={newCustomer.customerName}
                        onChange={(e) =>
                          setNewCustomer({
                            ...newCustomer,
                            customerName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="customerNameKana">顧客名（カナ）</Label>
                      <Input
                        id="customerNameKana"
                        value={newCustomer.customerNameKana}
                        onChange={(e) =>
                          setNewCustomer({
                            ...newCustomer,
                            customerNameKana: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode">郵便番号</Label>
                      <Input
                        id="postalCode"
                        value={newCustomer.postalCode}
                        onChange={(e) =>
                          setNewCustomer({
                            ...newCustomer,
                            postalCode: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">住所</Label>
                      <Input
                        id="address"
                        value={newCustomer.address}
                        onChange={(e) =>
                          setNewCustomer({
                            ...newCustomer,
                            address: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">電話番号</Label>
                      <Input
                        id="phone"
                        value={newCustomer.phone}
                        onChange={(e) =>
                          setNewCustomer({
                            ...newCustomer,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="notes">備考</Label>
                      <Textarea
                        id="notes"
                        value={newCustomer.notes}
                        onChange={(e) =>
                          setNewCustomer({
                            ...newCustomer,
                            notes: e.target.value,
                          })
                        }
                      />
                    </div>
                    <Button onClick={handleCreateCustomer} className="w-full">
                      作成
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* 顧客テーブル */}
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-16">ID</TableHead>
                    <TableHead className="w-24">更新日</TableHead>
                    <TableHead>顧客名</TableHead>
                    <TableHead>顧客名（カナ）</TableHead>
                    <TableHead>郵便番号</TableHead>
                    <TableHead>住所</TableHead>
                    <TableHead>ステータス</TableHead>
                    <TableHead className="w-40">アクション</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentCustomers.map((customer) => {
                    const status = getCustomerStatus(customer);
                    return (
                      <TableRow
                        key={customer.id}
                        className={`
                          ${customer.thisSeasonExchange ? "bg-green-50" : ""}
                          ${
                            customer.lastSeasonExchange &&
                            !customer.thisSeasonExchange
                              ? "bg-yellow-50"
                              : ""
                          }
                          ${
                            !customer.lastSeasonExchange &&
                            !customer.thisSeasonExchange
                              ? "bg-red-50"
                              : ""
                          }
                        `}
                      >
                        <TableCell className="font-medium">
                          {customer.id}
                        </TableCell>
                        <TableCell>{customer.updateDate}</TableCell>
                        <TableCell className="font-medium">
                          {customer.customerName}
                        </TableCell>
                        <TableCell>{customer.customerNameKana}</TableCell>
                        <TableCell>{customer.postalCode}</TableCell>
                        <TableCell>{customer.address}</TableCell>
                        <TableCell>
                          {status && (
                            <Badge
                              variant={
                                status.type === "success"
                                  ? "default"
                                  : "secondary"
                              }
                              className={`
                                ${
                                  status.type === "success"
                                    ? "bg-green-100 text-green-800"
                                    : ""
                                }
                                ${
                                  status.type === "warning"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : ""
                                }
                                ${
                                  status.type === "danger"
                                    ? "bg-red-100 text-red-800"
                                    : ""
                                }
                              `}
                            >
                              <status.icon className="w-3 h-3 mr-1" />
                              {status.label}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedCustomer(customer);
                                setIsDetailDialogOpen(true);
                              }}
                              title="詳細表示"
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedCustomer(customer);
                                setIsExchangeDialogOpen(true);
                              }}
                              title="タイヤ交換受付"
                            >
                              <Calendar className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedCustomer(customer);
                                setIsEditDialogOpen(true);
                              }}
                              title="編集"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteCustomer(customer.id)}
                              title="削除"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* ページネーション */}
            <Pagination />

            {/* 統計情報 */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">
                        今シーズン交換済み
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        {customers.filter((c) => c.thisSeasonExchange).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="text-sm text-gray-600">要連絡</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {
                          customers.filter(
                            (c) => c.lastSeasonExchange && !c.thisSeasonExchange
                          ).length
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="text-sm text-gray-600">長期未利用</p>
                      <p className="text-2xl font-bold text-red-600">
                        {
                          customers.filter(
                            (c) =>
                              !c.lastSeasonExchange && !c.thisSeasonExchange
                          ).length
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">総顧客数</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {customers.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* 顧客詳細ダイアログ */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>顧客詳細情報</DialogTitle>
            </DialogHeader>
            {selectedCustomer && (
              <div className="space-y-6">
                {/* 基本情報 */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      顧客名
                    </Label>
                    <p className="text-lg font-semibold">
                      {selectedCustomer.customerName}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      顧客名（カナ）
                    </Label>
                    <p>{selectedCustomer.customerNameKana}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      郵便番号
                    </Label>
                    <p>{selectedCustomer.postalCode}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      住所
                    </Label>
                    <p>{selectedCustomer.address}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      電話番号
                    </Label>
                    <p>{selectedCustomer.phone}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      最終更新日
                    </Label>
                    <p>{selectedCustomer.updateDate}</p>
                  </div>
                  {selectedCustomer.notes && (
                    <div className="col-span-2">
                      <Label className="text-sm font-medium text-gray-600">
                        備考
                      </Label>
                      <p>{selectedCustomer.notes}</p>
                    </div>
                  )}
                </div>

                {/* ステータス */}
                <div className="p-4 border rounded-lg">
                  <Label className="text-sm font-medium text-gray-600">
                    現在のステータス
                  </Label>
                  <div className="mt-2">
                    {(() => {
                      const status = getCustomerStatus(selectedCustomer);
                      return status ? (
                        <Badge
                          variant={
                            status.type === "success" ? "default" : "secondary"
                          }
                          className={`
                            ${
                              status.type === "success"
                                ? "bg-green-100 text-green-800"
                                : ""
                            }
                            ${
                              status.type === "warning"
                                ? "bg-yellow-100 text-yellow-800"
                                : ""
                            }
                            ${
                              status.type === "danger"
                                ? "bg-red-100 text-red-800"
                                : ""
                            }
                          `}
                        >
                          <status.icon className="w-4 h-4 mr-2" />
                          {status.label}
                        </Badge>
                      ) : null;
                    })()}
                  </div>
                </div>

                {/* 交換履歴 */}
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">
                    タイヤ交換履歴
                  </Label>
                  {selectedCustomer.exchangeHistory &&
                  selectedCustomer.exchangeHistory.length > 0 ? (
                    <div className="space-y-3">
                      {selectedCustomer.exchangeHistory.map((record) => (
                        <div
                          key={record.id}
                          className="p-4 border rounded-lg bg-white"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <Badge variant="outline" className="text-xs">
                                  {record.season}
                                </Badge>
                                <span className="text-sm text-gray-600">
                                  {record.date}
                                </span>
                              </div>
                              <p className="font-medium">{record.type}</p>
                              {record.notes && (
                                <p className="text-sm text-gray-600 mt-1">
                                  {record.notes}
                                </p>
                              )}
                            </div>
                            <Calendar className="w-5 h-5 text-gray-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-500 border rounded-lg bg-gray-50">
                      <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>交換履歴がありません</p>
                    </div>
                  )}
                </div>

                {/* アクションボタン */}
                <div className="flex space-x-2 pt-4 border-t">
                  <Button
                    onClick={() => {
                      setIsDetailDialogOpen(false);
                      setIsExchangeDialogOpen(true);
                    }}
                    className="flex-1"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    タイヤ交換受付
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsDetailDialogOpen(false);
                      setIsEditDialogOpen(true);
                    }}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    編集
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* 編集ダイアログ */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>顧客情報編集</DialogTitle>
            </DialogHeader>
            {selectedCustomer && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="editCustomerName">顧客名</Label>
                  <Input
                    id="editCustomerName"
                    value={selectedCustomer.customerName}
                    onChange={(e) =>
                      setSelectedCustomer({
                        ...selectedCustomer,
                        customerName: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="editCustomerNameKana">顧客名（カナ）</Label>
                  <Input
                    id="editCustomerNameKana"
                    value={selectedCustomer.customerNameKana}
                    onChange={(e) =>
                      setSelectedCustomer({
                        ...selectedCustomer,
                        customerNameKana: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="editPostalCode">郵便番号</Label>
                  <Input
                    id="editPostalCode"
                    value={selectedCustomer.postalCode}
                    onChange={(e) =>
                      setSelectedCustomer({
                        ...selectedCustomer,
                        postalCode: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="editAddress">住所</Label>
                  <Input
                    id="editAddress"
                    value={selectedCustomer.address}
                    onChange={(e) =>
                      setSelectedCustomer({
                        ...selectedCustomer,
                        address: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="editPhone">電話番号</Label>
                  <Input
                    id="editPhone"
                    value={selectedCustomer.phone || ""}
                    onChange={(e) =>
                      setSelectedCustomer({
                        ...selectedCustomer,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="editNotes">備考</Label>
                  <Textarea
                    id="editNotes"
                    value={selectedCustomer.notes || ""}
                    onChange={(e) =>
                      setSelectedCustomer({
                        ...selectedCustomer,
                        notes: e.target.value,
                      })
                    }
                  />
                </div>
                <Button onClick={handleEditCustomer} className="w-full">
                  更新
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* タイヤ交換受付ダイアログ */}
        <Dialog
          open={isExchangeDialogOpen}
          onOpenChange={setIsExchangeDialogOpen}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>タイヤ交換受付</DialogTitle>
            </DialogHeader>
            {selectedCustomer && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium">
                    {selectedCustomer.customerName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedCustomer.customerNameKana}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedCustomer.address}
                  </p>
                </div>
                <p>この顧客のタイヤ交換を受付しますか？</p>
                <div className="flex space-x-2">
                  <Button onClick={handleTireExchange} className="flex-1">
                    受付
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsExchangeDialogOpen(false)}
                    className="flex-1"
                  >
                    キャンセル
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
