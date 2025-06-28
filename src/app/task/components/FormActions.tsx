"use client";

import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";

interface FormActionsProps {
  loading: boolean;
  onSave: () => void;
  onCancel: () => void;
}

const FormActions = ({ loading, onSave, onCancel }: FormActionsProps) => {
  return (
    <div className="flex justify-end gap-3 pt-4 border-t">
      <Button variant="outline" onClick={onCancel} disabled={loading}>
        キャンセル
      </Button>
      <Button onClick={onSave} disabled={loading}>
        {loading ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Save className="h-4 w-4 mr-2" />
        )}
        保存
      </Button>
    </div>
  );
};

export default FormActions;
