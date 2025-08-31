"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { State } from "@/utils/interface";

interface MemoFormProps {
  formData: State | null;
  updateField: (path: string, value: string | number | Date) => void;
  loading: boolean;
}

const MemoForm = ({ formData, updateField, loading }: MemoFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">メモ</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="flex flex-col gap-2">
            <Label>車検期日</Label>
            <Input
              type="date"
              value={
                formData?.inspection_date
                  ? formData.inspection_date instanceof Date
                    ? formData.inspection_date.toISOString().split("T")[0]
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
                updateField("drive_distance", parseInt(e.target.value) || 0)
              }
              disabled={loading}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>担当者</Label>
            <Input
              type="text"
              placeholder="担当者名を入力"
              value={formData?.assigner || ""}
              onChange={(e) => updateField("assigner", e.target.value)}
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
  );
};

export default MemoForm;
