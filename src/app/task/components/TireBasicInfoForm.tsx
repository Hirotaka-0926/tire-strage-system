"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { State } from "@/utils/interface";

interface TireBasicInfoFormProps {
  formData: State | null;
  updateField: (path: string, value: string | number) => void;
  loading: boolean;
}

const TireBasicInfoForm = ({
  formData,
  updateField,
  loading,
}: TireBasicInfoFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          タイヤ基礎情報
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>タイヤメーカー</Label>
            <Input
              value={formData?.tire_maker || ""}
              onChange={(e) => updateField("tire_maker", e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <Label>タイヤパターン</Label>
            <Input
              value={formData?.tire_pattern || ""}
              onChange={(e) => updateField("tire_pattern", e.target.value)}
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
                updateField("manufacture_year", parseInt(e.target.value) || 0)
              }
              disabled={loading}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>エアプレッシャー</Label>
            <Input
              type="number"
              value={formData?.air_pressure || ""}
              onChange={(e) =>
                updateField("air_pressure", parseInt(e.target.value) || 0)
              }
              disabled={loading}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TireBasicInfoForm;
