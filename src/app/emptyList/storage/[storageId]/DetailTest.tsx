"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { StorageLogsToDisplay } from "@/utils/interface";
import { getStorageByMasterStorageId } from "@/utils/supabaseFunction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DragDropContext, Droppable, Draggable } from "@/lib/drag-drop";
import {
  Car,
  Ruler,
  Calendar,
  MapPin,
  Package,
  AlertCircle,
  User,
  Phone,
  Mail,
  Tag,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Tire = {
  id: string;
  brand: string;
  model: string;
  size: string;
  type: string;
  treadDepth: number;
  condition: string;
  exchangeDate: string;
  customer: {
    id: string;
    name: string;
    phone: string;
    email: string;
    avatarUrl?: string;
  };
  vehicle: {
    id: string;
    make: string;
    model: string;
    year: number;
    licensePlate: string;
  };
};

// 保管庫の型定義
type StorageCell = {
  id: string;
  row: string;
  column: number;
  tire: Tire | null;
};

// 保管庫データの型定義
type Storage = {
  id: string;
  name: string;
  cells: StorageCell[];
};

// サンプルデータ - 保管庫
const storagesData: Record<string, Storage> = {
  "storage-1": {
    id: "storage-1",
    name: "第1保管庫",
    cells: [
      {
        id: "A1",
        row: "A",
        column: 1,
        tire: {
          id: "tire1",
          brand: "ブリヂストン",
          model: "BLIZZAK",
          size: "205/55R16",
          type: "スタッドレス",
          treadDepth: 7.5,
          condition: "良好",
          exchangeDate: "2023-11-15",
          customer: {
            id: "cust1",
            name: "田中 太郎",
            phone: "090-1234-5678",
            email: "tanaka@example.com",
            avatarUrl: "/placeholder.svg?height=40&width=40",
          },
          vehicle: {
            id: "veh1",
            make: "トヨタ",
            model: "カローラ",
            year: 2022,
            licensePlate: "品川 300 あ 1234",
          },
        },
      },
    ],
  },
};

// 未割り当てタイヤのタスクリスト
const initialTaskList: Tire[] = [
  {
    id: "tire4",
    brand: "ミシュラン",
    model: "X-ICE",
    size: "195/65R15",
    type: "スタッドレス",
    treadDepth: 6.8,
    condition: "良好",
    exchangeDate: "2023-12-10",
    customer: {
      id: "cust4",
      name: "山田 次郎",
      phone: "060-1357-2468",
      email: "yamada@example.com",
      avatarUrl: "/placeholder.svg?height=40&width=40",
    },
    vehicle: {
      id: "veh4",
      make: "ホンダ",
      model: "フィット",
      year: 2021,
      licensePlate: "横浜 500 さ 5678",
    },
  },
  {
    id: "tire5",
    brand: "コンチネンタル",
    model: "ContiPremiumContact",
    size: "225/45R18",
    type: "サマータイヤ",
    treadDepth: 5.5,
    condition: "使用感あり",
    exchangeDate: "2023-12-12",
    customer: {
      id: "cust5",
      name: "伊藤 三郎",
      phone: "050-9876-5432",
      email: "ito@example.com",
      avatarUrl: "/placeholder.svg?height=40&width=40",
    },
    vehicle: {
      id: "veh5",
      make: "スバル",
      model: "インプレッサ",
      year: 2020,
      licensePlate: "福岡 800 お 7890",
    },
  },
  {
    id: "tire6",
    brand: "ピレリ",
    model: "P Zero",
    size: "245/40R19",
    type: "サマータイヤ",
    treadDepth: 7.2,
    condition: "良好",
    exchangeDate: "2023-12-15",
    customer: {
      id: "cust6",
      name: "高橋 美咲",
      phone: "080-1122-3344",
      email: "takahashi@example.com",
      avatarUrl: "/placeholder.svg?height=40&width=40",
    },
    vehicle: {
      id: "veh6",
      make: "BMW",
      model: "3シリーズ",
      year: 2021,
      licensePlate: "東京 700 か 9876",
    },
  },
  {
    id: "tire7",
    brand: "グッドイヤー",
    model: "Eagle F1",
    size: "215/50R17",
    type: "オールシーズン",
    treadDepth: 6.0,
    condition: "使用感あり",
    exchangeDate: "2023-12-18",
    customer: {
      id: "cust7",
      name: "渡辺 健太",
      phone: "070-5566-7788",
      email: "watanabe@example.com",
      avatarUrl: "/placeholder.svg?height=40&width=40",
    },
    vehicle: {
      id: "veh7",
      make: "アウディ",
      model: "A4",
      year: 2019,
      licensePlate: "名古屋 500 え 1122",
    },
  },
];

export const Detail = () => {
  const params = useParams();
  const storageId = params.storageId as string;
  const [storageDetail, setStorageDetail] =
    useState<StorageLogsToDisplay | null>(null);

  useEffect(() => {
    const fetchStorageDetail = async () => {
      if (storageId) {
        const data = await getStorageByMasterStorageId(
          parseInt(storageId as string)
        );
        setStorageDetail(data);
      }
    };
    fetchStorageDetail();
  }, [storageId]);

  if (!storageDetail) {
    return <div>Loading...</div>;
  }

  // const storedTire = storageDetail;
  const storedTire = null;

  return (
    <div className="container mx-auto p-4">
      <h1 className="font-bold text-2xl mb-6">保管庫管理</h1>
      <DragDropContext>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/*ここから左側のコンポーネントだよ*/}
          <div className="lg:col-span-3">
            <div className="bg-muted/30 p-6 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">保管庫内データ</h2>
                <Badge variant="outline" className="text-base px-3 py-1">
                  <MapPin className="mr-2 h-4 w-4" />
                  位置：
                  {storageDetail.storage.storage_type +
                    storageDetail.storage.storage_number}
                </Badge>
              </div>

              <Droppable
                droppableId={storageDetail.id!.toString()}
                isDropDisabled={true}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`border rounded-lg p-6 min-h-[400px] ${
                      storedTire
                        ? "bg-white"
                        : snapshot.isDraggingOver
                        ? "bg-green-50 border-green-300 border-dashed"
                        : "bg-muted/50 border-dashed"
                    }`}
                  >
                    {storedTire ? (
                      <div className="space-y-6">
                        <div className="bg-muted/20 p-4 rounded-lg">
                          <h3 className="text-lg font-medium mb-3 flex item-center">
                            <User className="h-5 w-5 mr-2" />
                            顧客情報
                          </h3>
                          <div className="flex items-center gap-4 mb-4">
                            <Avatar className="h-16 w-16">
                              <AvatarFallback>
                                {storageDetail.client.client_name.substring(
                                  0,
                                  2
                                )}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-xl font-medium">
                                {storageDetail.client.client_name}
                              </p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                                <div className="flex items-center gap-1 text-sm">
                                  <Phone className="h-4 w-4 text-muted-foreground" />
                                  080-1234-5678
                                </div>
                                <div className="flex items-center gap-1 text-sm">
                                  <Mail className="w-4 h-4 text-muted-foreground" />
                                  {storageDetail.client.address}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-muted/20 p-4 rounded-lg">
                          <h3 className="text-lg font-medium mb-3 flex item-center">
                            <Car className="h-5 w-5 mr-2" />
                            車両情報
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-lg font-medium">
                                {storageDetail.car.car_model}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {/*年式 表示　まだ未実装*/}
                                2023年式
                              </p>
                            </div>
                            <div>
                              <div className="flex items-center gap-1 mb-1">
                                <Tag className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">
                                  ナンバープレート
                                </span>
                              </div>
                              <p className="text-base">
                                {storageDetail.car.car_number}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-muted/20 p-4 rounded-lg">
                          <h3 className="text-lg font-medium mb-3 flex item-center">
                            <Package className="h-5 w-5 mr-2" />
                            タイヤ情報
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-lg font-medium">
                                {`${storageDetail.state.tire_maker} ${storageDetail.state.tire_pattern}`}
                              </p>
                              <p className="text-sm ">
                                {storageDetail.state.tire_size}
                              </p>
                              <div className="flex items-center gap-1 mt-2">
                                <Badge
                                  className={`${
                                    storageDetail.state.tire_inspection
                                      ?.state === "良好"
                                      ? "bg-green-500"
                                      : storageDetail.state.tire_inspection
                                          ?.state === "新品同様"
                                      ? "bg-blue-500"
                                      : "bg-yellow-500"
                                  }`}
                                >
                                  {storageDetail.state.tire_inspection?.state}
                                </Badge>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-bold">
                                  タイヤ溝
                                </span>
                                <div className="flex items-center gap-1">
                                  <Ruler className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm font-medium">
                                    {/* 現在は仮プロパティ */}
                                    5mm
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-bold">
                                  製造年
                                </span>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm font-medium">
                                    {storageDetail.state.manufacture_year}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                          <Button variant="outline">編集</Button>
                          <Button variant="destructive">取り出し</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-hull text-muted-foreground">
                        <AlertCircle className="h-16 w-16 mb-4" />
                        <p className="text-xl mb-2">ここにタイヤをドロップ</p>
                        <p className="text-sm">
                          右側のタスクリストからタイヤをドラックして保管庫データに割り当ててください
                        </p>
                      </div>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
          <div className="lg:col-span-2"></div>
        </div>
      </DragDropContext>
    </div>
  );
};
