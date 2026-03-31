"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PitState } from "@/app/domain/type/pit";
import PitTireMakerCombobox from "@/app/presentation/pit/components/PitTireMakerCombobox";
import PitTirePatternCombobox from "@/app/presentation/pit/components/PitTirePatternCombobox";
import PitTireSizeCombobox from "@/app/presentation/pit/components/PitTireSizeCombobox";

interface PitTireBasicInfoFormProps {
  formData: PitState | null;
  updateField: (path: string, value: string | number) => void;
  loading: boolean;
}

const PitTireBasicInfoForm = ({
  formData,
  updateField,
  loading,
}: PitTireBasicInfoFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">タイヤ基本情報</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <PitTireMakerCombobox
            value={formData?.tire_maker || ""}
            onChange={(v) => updateField("tire_maker", v)}
            disabled={loading}
          />
          <PitTirePatternCombobox
            value={formData?.tire_pattern || ""}
            onChange={(v) => updateField("tire_pattern", v)}
            disabled={loading}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <PitTireSizeCombobox
            value={formData?.tire_size || ""}
            onChange={(v) => updateField("tire_size", v)}
            disabled={loading}
          />
          <div>
            <Label>製造年</Label>
            <Input
              type="number"
              value={formData?.manufacture_year ?? ""}
              onChange={(e) =>
                updateField(
                  "manufacture_year",
                  parseInt(e.target.value, 10) || 0,
                )
              }
              disabled={loading}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label>エアプレッシャー</Label>
            <Input
              type="number"
              value={formData?.air_pressure ?? ""}
              onChange={(e) =>
                updateField("air_pressure", parseFloat(e.target.value) || 0)
              }
              disabled={loading}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PitTireBasicInfoForm;
