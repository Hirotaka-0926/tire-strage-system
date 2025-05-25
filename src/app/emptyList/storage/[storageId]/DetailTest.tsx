"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { StorageInput, TaskInput } from "@/utils/interface";
import { getStorageByMasterStorageId } from "@/utils/supabaseFunction";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// サンプルデータ - 保管庫
interface Props {
  initialStorageDetail: StorageInput;
  initialPendingTasks: TaskInput[] | null;
}

export const Detail: React.FC<Props> = ({
  initialStorageDetail,
  initialPendingTasks,
}) => {
  const [storageDetail] = useState<StorageInput>(initialStorageDetail);
  const [taskList] = useState<TaskInput[]>(initialPendingTasks || []);

  const storedTire = storageDetail;
  // const storedTire = null;

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
                  {storageDetail?.id.split("_")[0] +
                    storageDetail?.id.split("_")[1]}
                </Badge>
              </div>

              <Droppable
                droppableId={storageDetail?.id.toString()}
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
                                {storageDetail!.client.client_name.substring(
                                  0,
                                  2
                                )}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-xl font-medium">
                                {storageDetail!.client.client_name}
                              </p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                                <div className="flex items-center gap-1 text-sm">
                                  <Phone className="h-4 w-4 text-muted-foreground" />
                                  080-1234-5678
                                </div>
                                <div className="flex items-center gap-1 text-sm">
                                  <Mail className="w-4 h-4 text-muted-foreground" />
                                  {storageDetail!.client.address}
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
                                {storageDetail!.car.car_model}
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
                                {storageDetail!.car.car_number}
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
                                {`${storageDetail!.state.tire_maker} ${
                                  storageDetail!.state.tire_pattern
                                }`}
                              </p>
                              <p className="text-sm ">
                                {storageDetail!.state.tire_size}
                              </p>
                              <div className="flex items-center gap-1 mt-2">
                                <Badge
                                  className={`${
                                    storageDetail!.state.tire_inspection
                                      ?.state === "良好"
                                      ? "bg-green-500"
                                      : storageDetail!.state.tire_inspection
                                          ?.state === "新品同様"
                                      ? "bg-blue-500"
                                      : "bg-yellow-500"
                                  }`}
                                >
                                  {storageDetail!.state.tire_inspection?.state}
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
                    {taskList.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
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
                                    <AvatarFallback>
                                      {task.client.client_name.substring(0, 2)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <CardTitle className="text-sm">
                                      {task.client.client_name}
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                      {task.client.address}
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
                                      {task.tire_state.tire_maker}{" "}
                                    </span>
                                  </div>
                                  <span>{task.tire_state.tire_size}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1">
                                    <Car className="h-3 w-3" />
                                    <span>{task.car.car_model}</span>
                                  </div>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {task.car.car_number}
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1">
                                    <Ruler className="h-3 w-3" />
                                    <span>
                                      溝:{" "}
                                      {task.tire_state.tire_inspection?.state}mm
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>
                                      {task.tire_state.tire_inspection?.state}
                                    </span>
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
};
