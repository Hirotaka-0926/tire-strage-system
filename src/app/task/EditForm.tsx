"use client";

import { useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, Settings, Loader2, AlertCircle } from "lucide-react";
import { TaskInput } from "@/utils/interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEditForm } from "@/utils/hooks/useEditForm";
import { useRouter } from "next/navigation";

interface Props {
  isMaintenanceDialogOpen: boolean;
  setIsMaintenanceDialogOpen: (open: boolean) => void;
  selectedItem: TaskInput | null;
  setSelectedItem: (item: TaskInput | null) => void;
}

const EditForm = ({
  isMaintenanceDialogOpen,
  setIsMaintenanceDialogOpen,
  selectedItem,
  setSelectedItem,
}: Props) => {
  const {
    formData,
    isLoading,
    isSubmitting,
    error,
    updateFormData,
    updateTireState,
    handleSubmit,
    resetForm,
  } = useEditForm({
    selectedItem,
    onSuccess: () => {
      setIsMaintenanceDialogOpen(false);
      setSelectedItem(null);
      router.refresh(); // 変更後にページをリフレッシュ
    },
  });

  const router = useRouter();

  // ダイアログが開かれた時にデータを初期化
  useEffect(() => {
    if (isMaintenanceDialogOpen && selectedItem) {
      // フックが自動的に初期化するので、特別な処理は不要
    }
  }, [isMaintenanceDialogOpen, selectedItem]);

  // 保存処理
  const handleSave = async () => {
    await handleSubmit();
  };

  // キャンセル処理
  const handleCancel = () => {
    setIsMaintenanceDialogOpen(false);
    setSelectedItem(null);
    resetForm();
  }; // フィールド更新のヘルパー関数
  const updateField = useCallback(
    (path: string, value: string | boolean | number | Date) => {
      const pathArray = path.split(".");

      if (pathArray.length > 1) {
        console.log("tireStatePath:", pathArray.join("."));
        console.log("value:", value);
        updateTireState({ [pathArray.join(".")]: value });
      } else {
        updateFormData({ [path]: value });
      }
    },
    [updateFormData, updateTireState]
  );

  const loading = isLoading || isSubmitting;

  return (
    <Dialog
      open={isMaintenanceDialogOpen}
      onOpenChange={setIsMaintenanceDialogOpen}
    >
      <DialogContent className="max-w-5xl w-full bg-gray-50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            整備データ入力
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          </DialogTitle>
        </DialogHeader>

        {/* エラー表示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">エラー</span>
            </div>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        )}

        <div className="space-y-4 py-4 overflow-y-scroll h-[calc(100vh-200px)]">
          {/* 顧客情報 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                {"顧客情報"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-medium">
                {selectedItem?.client?.client_name}
              </div>
              <div className="text-sm text-gray-600">
                {selectedItem?.car?.car_model}
              </div>
              <div className="text-sm text-gray-600">
                {selectedItem?.car?.car_number}
              </div>
            </CardContent>
          </Card>
          {/* フォーム */}
          <form className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  タイヤ基礎情報
                </CardTitle>
              </CardHeader>{" "}
              <CardContent>
                {" "}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>タイヤメーカー</Label>
                    <Input
                      value={formData?.tire_maker || ""}
                      onChange={(e) =>
                        updateField("tire_maker", e.target.value)
                      }
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <Label>タイヤパターン</Label>
                    <Input
                      value={formData?.tire_pattern || ""}
                      onChange={(e) =>
                        updateField("tire_pattern", e.target.value)
                      }
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>タイヤサイズ</Label>
                    <Input
                      value={formData?.tire_size || ""}
                      onChange={(e) => updateField("tire_size", e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <Label>製造年</Label>
                    <Input
                      type="number"
                      value={formData?.manufacture_year || ""}
                      onChange={(e) =>
                        updateField(
                          "manufacture_year",
                          parseInt(e.target.value) || 0
                        )
                      }
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {" "}
                  <div>
                    <Label>エアプレッシャー</Label>
                    <Input
                      type="number"
                      value={formData?.air_pressure || ""}
                      onChange={(e) =>
                        updateField(
                          "air_pressure",
                          parseInt(e.target.value) || 0
                        )
                      }
                      disabled={loading}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 点検・整備項目 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  点検・整備項目
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="border border-gray-500 rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-10 gap-2 border-b border-gray-500 p-2 bg-gray-200">
                    <div className="col-span-2">点検項目</div>
                    <div className="col-span-2">状態</div>
                    <div className="col-span-1">交換</div>
                    <div className="col-span-5">備考</div>
                  </div>{" "}
                  <div className="grid grid-cols-1 md:grid-cols-10 gap-2 p-2 border-b border-gray-500">
                    <div className="col-span-2">タイヤ</div>
                    <div className="col-span-2">
                      <Select
                        value={formData?.tire_inspection?.state || ""}
                        onValueChange={(value) =>
                          updateField("tire_inspection.state", value)
                        }
                        disabled={loading}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="タイヤ状態を選択" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5mm">5mm(良好)</SelectItem>
                          <SelectItem value="4mm">4mm</SelectItem>
                          <SelectItem value="3mm">3mm(交換おすすめ)</SelectItem>
                          <SelectItem value="2mm">2mm</SelectItem>
                          <SelectItem value="1mm">1mm(交換時期)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-1">
                      <Input
                        type="checkbox"
                        checked={
                          formData?.tire_inspection?.is_exchange || false
                        }
                        onChange={(e) =>
                          updateField(
                            "tire_inspection.is_exchange",
                            e.target.checked
                          )
                        }
                        disabled={loading}
                        className="w-4 h-4"
                      />
                    </div>
                    <div className="col-span-5">
                      <Input
                        type="text"
                        value={formData?.tire_inspection?.note || ""}
                        onChange={(e) =>
                          updateField("tire_inspection.note", e.target.value)
                        }
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-10 gap-4 p-2 border-b border-gray-500">
                    <div className="col-span-2 text-sm">エンジンオイル</div>
                    <div className="col-span-2">
                      <Input
                        type="text"
                        value={formData?.oil_inspection?.state || ""}
                        onChange={(e) =>
                          updateField("oil_inspection.state", e.target.value)
                        }
                        disabled={loading}
                      />
                    </div>
                    <div className="col-span-1">
                      <input
                        type="checkbox"
                        checked={formData?.oil_inspection?.is_exchange || false}
                        onChange={(e) =>
                          updateField(
                            "oil_inspection.is_exchange",
                            e.target.checked
                          )
                        }
                        disabled={loading}
                        className="w-4 h-4"
                      />
                    </div>
                    <div className="col-span-5">
                      <Input
                        type="text"
                        value={formData?.oil_inspection?.note || ""}
                        onChange={(e) =>
                          updateField("oil_inspection.note", e.target.value)
                        }
                        disabled={loading}
                      />
                    </div>
                  </div>{" "}
                  <div className="grid grid-cols-1 md:grid-cols-10 gap-4 p-2 border-b border-gray-500">
                    <div className="col-span-2">バッテリー</div>
                    <div className="col-span-2">
                      <Input
                        type="text"
                        value={formData?.battery_inspection?.state || ""}
                        onChange={(e) =>
                          updateField(
                            "battery_inspection.state",
                            e.target.value
                          )
                        }
                        disabled={loading}
                      />
                    </div>
                    <div className="col-span-1">
                      <input
                        type="checkbox"
                        checked={
                          formData?.battery_inspection?.is_exchange || false
                        }
                        onChange={(e) =>
                          updateField(
                            "battery_inspection.is_exchange",
                            e.target.checked
                          )
                        }
                        disabled={loading}
                        className="w-4 h-4"
                      />
                    </div>
                    <div className="col-span-5">
                      <Input
                        type="text"
                        value={formData?.battery_inspection?.note || ""}
                        onChange={(e) =>
                          updateField("battery_inspection.note", e.target.value)
                        }
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-10 gap-4 p-2 border-b border-gray-500">
                    <div className="col-span-2">ワイパーゴム</div>
                    <div className="col-span-2">
                      <Input
                        type="text"
                        value={formData?.wiper_inspection?.state || ""}
                        onChange={(e) =>
                          updateField("wiper_inspection.state", e.target.value)
                        }
                        disabled={loading}
                      />
                    </div>
                    <div className="col-span-1">
                      <input
                        type="checkbox"
                        checked={
                          formData?.wiper_inspection?.is_exchange || false
                        }
                        onChange={(e) =>
                          updateField(
                            "wiper_inspection.is_exchange",
                            e.target.checked
                          )
                        }
                        disabled={loading}
                        className="w-4 h-4"
                      />
                    </div>
                    <div className="col-span-5">
                      <Input
                        type="text"
                        value={formData?.wiper_inspection?.note || ""}
                        onChange={(e) =>
                          updateField("wiper_inspection.note", e.target.value)
                        }
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-10 gap-4 p-2">
                    <div className="col-span-2">その他</div>
                    <div className="col-span-8">
                      <Input
                        type="text"
                        value={formData?.other_inspection || ""}
                        onChange={(e) =>
                          updateField("other_inspection", e.target.value)
                        }
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">メモ</CardTitle>
              </CardHeader>{" "}
              <CardContent>
                {" "}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex flex-col gap-2">
                    <Label>車検期日</Label>
                    <Input
                      type="date"
                      value={
                        formData?.inspection_date
                          ? formData.inspection_date instanceof Date
                            ? formData.inspection_date
                                .toISOString()
                                .split("T")[0]
                            : formData.inspection_date
                          : ""
                      }
                      onChange={(e) =>
                        updateField("inspection_date", new Date(e.target.value))
                      }
                      disabled={loading}
                    />
                  </div>
                  <div className="flex flex-col gap-2 mb-2">
                    <Label>入庫時距離数</Label>
                    <Input
                      type="number"
                      value={formData?.drive_distance || ""}
                      onChange={(e) =>
                        updateField(
                          "drive_distance",
                          parseInt(e.target.value) || 0
                        )
                      }
                      disabled={loading}
                    />
                  </div>
                </div>
                <Label className="mt-2">次回のテーマ</Label>
                <Textarea
                  className="mt-2"
                  placeholder="ここにメモを入力してください"
                  rows={4}
                  value={formData?.next_theme || ""}
                  onChange={(e) => updateField("next_theme", e.target.value)}
                  disabled={loading}
                />
              </CardContent>
            </Card>
          </form>{" "}
          {/* ボタン */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleCancel} disabled={loading}>
              キャンセル
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              保存
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditForm;
