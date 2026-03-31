"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";

interface PitFormActionsProps {
  loading: boolean;
  onSave: () => void;
  onCancel: () => void;
}

const PitFormActions = ({ loading, onSave, onCancel }: PitFormActionsProps) => {
  return (
    <div className="flex justify-end gap-3 border-t pt-4">
      <Button variant="outline" onClick={onCancel} disabled={loading}>
        キャンセル
      </Button>
      <Button onClick={onSave} disabled={loading}>
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Save className="mr-2 h-4 w-4" />
        )}
        保存
      </Button>
    </div>
  );
};

export default PitFormActions;
