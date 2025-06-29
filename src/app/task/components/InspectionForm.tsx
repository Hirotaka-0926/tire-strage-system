"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { State } from "@/utils/interface";

interface InspectionFormProps {
  formData: State | null;
  updateField: (path: string, value: string | boolean) => void;
  loading: boolean;
}

const InspectionForm = ({
  formData,
  updateField,
  loading,
}: InspectionFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">点検・整備項目</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="border border-gray-500 rounded-md">
          {/* ヘッダー */}
          <div className="grid grid-cols-1 md:grid-cols-10 gap-2 border-b border-gray-500 p-2 bg-gray-200">
            <div className="col-span-2">点検項目</div>
            <div className="col-span-2">状態</div>
            <div className="col-span-1">交換</div>
            <div className="col-span-5">備考</div>
          </div>

          {/* タイヤ */}
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
                  <SelectItem value="2mm">2mm(交換時期)</SelectItem>
                  <SelectItem value="1mm">1mm(要交換)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-1">
              <Input
                type="checkbox"
                checked={formData?.tire_inspection?.is_exchange || false}
                onChange={(e) =>
                  updateField("tire_inspection.is_exchange", e.target.checked)
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

          {/* エンジンオイル */}
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
                  updateField("oil_inspection.is_exchange", e.target.checked)
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
          </div>

          {/* バッテリー */}
          <div className="grid grid-cols-1 md:grid-cols-10 gap-4 p-2 border-b border-gray-500">
            <div className="col-span-2">バッテリー</div>
            <div className="col-span-2">
              <Input
                type="text"
                value={formData?.battery_inspection?.state || ""}
                onChange={(e) =>
                  updateField("battery_inspection.state", e.target.value)
                }
                disabled={loading}
              />
            </div>
            <div className="col-span-1">
              <input
                type="checkbox"
                checked={formData?.battery_inspection?.is_exchange || false}
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

          {/* ワイパーゴム */}
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
                checked={formData?.wiper_inspection?.is_exchange || false}
                onChange={(e) =>
                  updateField("wiper_inspection.is_exchange", e.target.checked)
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

          {/* その他 */}
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
  );
};

export default InspectionForm;
