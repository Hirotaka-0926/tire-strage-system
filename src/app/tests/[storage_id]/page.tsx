"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DragDropContext, Droppable, Draggable } from "@/lib/drag-drop";
import { Button } from "@/components/ui/button";
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
import { useParams } from "next/navigation";

// タイヤ情報の型定義
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

export default function TestView() {
  const params = useParams();
  const storageId = params.storage_id as string;

  const [storage, setStorage] = useState<Storage | null>(null);
  const [taskList, setTaskList] = useState<Tire[]>(initialTaskList);

  // 保管庫データの取得
  useEffect(() => {
    // 実際のアプリケーションではAPIからデータを取得する
    const storageData = storagesData[storageId];
    setStorage(storageData || null);
  }, [storageId]);

  // ドラッグ＆ドロップの処理
  const handleDragEnd = (result: any) => {
    const { source, destination } = result;

    // ドロップ先がない場合は何もしない
    if (!destination) return;

    // タスクリストからストレージへのドラッグ
    if (
      source.droppableId === "taskList" &&
      destination.droppableId.startsWith("storage-cell-")
    ) {
      const cellId = destination.droppableId.replace("storage-cell-", "");
      const tireIndex = source.index;
      const tire = taskList[tireIndex];

      // ドロップ先のセルを確認
      const targetCell = storage?.cells.find((cell) => cell.id === cellId);

      // セルが既に埋まっている場合は何もしない
      if (targetCell?.tire) {
        return;
      }

      // タスクリストから削除
      const newTaskList = [...taskList];
      newTaskList.splice(tireIndex, 1);
      setTaskList(newTaskList);

      // ストレージに追加
      if (storage) {
        const newCells = storage.cells.map((cell) => {
          if (cell.id === cellId) {
            return { ...cell, tire };
          }
          return cell;
        });
        setStorage({ ...storage, cells: newCells });
      }
    }
  };

  if (!storage) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">
          テストデータが見つかりません
        </h1>
        <p>指定されたテストID: {storageId} は存在しません。</p>
      </div>
    );
  }

  // 保管庫のタイヤデータを取得
  const storedTire = storage.cells[0]?.tire;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        テスト: {storage.name}{" "}
        <span className="text-muted-foreground text-lg">#{storage.id}</span>
      </h1>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* 左側: 保管庫データ */}
          <div className="lg:col-span-3">
            <div className="bg-muted/30 p-6 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">テスト情報</h2>
                <Badge variant="outline" className="text-base px-3 py-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  位置: {storage.cells[0].row}
                  {storage.cells[0].column}
                </Badge>
              </div>

              <Droppable
                droppableId={`storage-cell-${storage.cells[0].id}`}
                isDropDisabled={storedTire !== null}
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
                        {/* 顧客情報 */}
                        <div className="bg-muted/20 p-4 rounded-lg">
                          <h3 className="text-lg font-medium mb-3 flex items-center">
                            <User className="h-5 w-5 mr-2" />
                            顧客情報
                          </h3>
                          <div className="flex items-center gap-4 mb-4">
                            <Avatar className="h-16 w-16">
                              <AvatarImage
                                src={
                                  storedTire.customer.avatarUrl ||
                                  "/placeholder.svg"
                                }
                              />
                              <AvatarFallback>
                                {storedTire.customer.name.substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-xl font-medium">
                                {storedTire.customer.name}
                              </p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                                <div className="flex items-center gap-1 text-sm">
                                  <Phone className="h-4 w-4 text-muted-foreground" />
                                  <span>{storedTire.customer.phone}</span>
                                </div>
                                <div className="flex items-center gap-1 text-sm">
                                  <Mail className="h-4 w-4 text-muted-foreground" />
                                  <span>{storedTire.customer.email}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 車両情報 */}
                        <div className="bg-muted/20 p-4 rounded-lg">
                          <h3 className="text-lg font-medium mb-3 flex items-center">
                            <Car className="h-5 w-5 mr-2" />
                            車両情報
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-lg font-medium">
                                {storedTire.vehicle.make}{" "}
                                {storedTire.vehicle.model}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {storedTire.vehicle.year}年式
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
                                {storedTire.vehicle.licensePlate}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* タイヤ情報 */}
                        <div className="bg-muted/20 p-4 rounded-lg">
                          <h3 className="text-lg font-medium mb-3 flex items-center">
                            <Package className="h-5 w-5 mr-2" />
                            タイヤ情報
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-lg font-medium">
                                {storedTire.brand} {storedTire.model}
                              </p>
                              <p className="text-sm">
                                {storedTire.size} ({storedTire.type})
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge
                                  className={`${
                                    storedTire.condition === "良好"
                                      ? "bg-green-500"
                                      : storedTire.condition === "新品同様"
                                      ? "bg-blue-500"
                                      : "bg-yellow-500"
                                  }`}
                                >
                                  {storedTire.condition}
                                </Badge>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">
                                  タイヤ溝:
                                </span>
                                <div className="flex items-center">
                                  <Ruler className="h-4 w-4 mr-1 text-muted-foreground" />
                                  <span className="text-base font-medium">
                                    {storedTire.treadDepth}mm
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">
                                  交換日:
                                </span>
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                                  <span className="text-base">
                                    {storedTire.exchangeDate}
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
                      <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                        <AlertCircle className="h-16 w-16 mb-4" />
                        <p className="text-xl mb-2">ここにタイヤをドロップ</p>
                        <p className="text-sm">
                          右側のタスクリストからタイヤをドラッグしてテスト位置に割り当ててください
                        </p>
                      </div>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>

          {/* 右側: タスクリスト */}
          <div className="lg:col-span-2">
            <div className="bg-muted/30 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-3">
                未割当タスク ({taskList.length})
              </h2>
              <Droppable droppableId="taskList">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-4 max-h-[calc(100vh-180px)] overflow-y-auto pr-2"
                  >
                    {taskList.map((tire, index) => (
                      <Draggable
                        key={tire.id}
                        draggableId={tire.id}
                        index={index}
                      >
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="border-2 border-dashed border-yellow-500/50 bg-yellow-50/50"
                          >
                            <CardHeader className="p-4 pb-2">
                              <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage
                                      src={
                                        tire.customer.avatarUrl ||
                                        "/placeholder.svg"
                                      }
                                    />
                                    <AvatarFallback>
                                      {tire.customer.name.substring(0, 2)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <CardTitle className="text-sm">
                                      {tire.customer.name}
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                      {tire.customer.phone}
                                    </CardDescription>
                                  </div>
                                </div>
                                <Badge
                                  variant="outline"
                                  className="bg-yellow-100"
                                >
                                  未割当
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-2">
                              <div className="space-y-2 text-xs">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1">
                                    <Package className="h-3 w-3" />
                                    <span className="font-medium">
                                      {tire.brand}
                                    </span>
                                  </div>
                                  <span>{tire.size}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1">
                                    <Car className="h-3 w-3" />
                                    <span>
                                      {tire.vehicle.make} {tire.vehicle.model}
                                    </span>
                                  </div>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {tire.vehicle.licensePlate}
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1">
                                    <Ruler className="h-3 w-3" />
                                    <span>溝: {tire.treadDepth}mm</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>{tire.exchangeDate}</span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                            <CardFooter className="p-4 pt-0">
                              <div className="text-xs text-muted-foreground w-full text-center space-y-1">
                                <p>ドラッグしてテスト位置に割り当て</p>
                              </div>
                            </CardFooter>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {taskList.length === 0 && (
                      <div className="text-center p-4 text-muted-foreground">
                        <p>未割当のタイヤはありません</p>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
}
