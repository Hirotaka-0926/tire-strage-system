"use client";

import { ClientWithExchangeHistory } from "@/app/refactor/domain/type/reception";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Edit,
  XCircle,
} from "lucide-react";

interface CustomerDetailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  customer: ClientWithExchangeHistory | null;
  onEditCustomer: () => void;
  onTireExchange: () => void;
}

const getCustomerStatus = (customer: ClientWithExchangeHistory) => {
  if (customer.thisSeasonExchange) {
    return {
      type: "success" as const,
      label: "今シーズン交換済み",
      icon: CheckCircle,
    };
  }
  if (customer.lastSeasonExchange && !customer.thisSeasonExchange) {
    return {
      type: "warning" as const,
      label: "要連絡",
      icon: AlertTriangle,
    };
  }
  return {
    type: "danger" as const,
    label: "長期未利用",
    icon: XCircle,
  };
};

const getStatusClass = (type: "success" | "warning" | "danger") => {
  if (type === "success") return "bg-green-100 text-green-800";
  if (type === "warning") return "bg-yellow-100 text-yellow-800";
  return "bg-red-100 text-red-800";
};

const CustomerDetailDialog = ({
  isOpen,
  onOpenChange,
  customer,
  onEditCustomer,
  onTireExchange,
}: CustomerDetailDialogProps) => {
  if (!customer) return null;
  const status = getCustomerStatus(customer);
  const StatusIcon = status.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>顧客詳細情報</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">
                顧客名
              </Label>
              <p className="text-lg font-semibold">{customer.client_name}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">
                顧客名（カナ）
              </Label>
              <p>{customer.client_name_kana}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">
                郵便番号
              </Label>
              <p>{customer.post_number}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">住所</Label>
              <p>{customer.address}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">
                電話番号
              </Label>
              <p>{customer.phone}</p>
            </div>
            {customer.notes && (
              <div className="col-span-2">
                <Label className="text-sm font-medium text-gray-600">
                  備考
                </Label>
                <p>{customer.notes}</p>
              </div>
            )}
          </div>

          <div className="rounded-lg border p-4">
            <Label className="text-sm font-medium text-gray-600">
              現在のステータス
            </Label>
            <div className="mt-2">
              <Badge
                variant="secondary"
                className={getStatusClass(status.type)}
              >
                <StatusIcon className="mr-2 h-4 w-4" />
                {status.label}
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-lg font-semibold">タイヤ交換履歴</Label>
            {customer.exchangeHistory && customer.exchangeHistory.length > 0 ? (
              <div className="space-y-3">
                {customer.exchangeHistory.map((record, index) => (
                  <div
                    key={`${record.id}-${record.year}-${record.season}-${index}`}
                    className="rounded-lg border bg-white p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {record.season}
                          </Badge>
                        </div>
                        <p className="font-medium">{record.year}</p>
                        {record.next_theme && (
                          <p className="mt-1 text-sm text-gray-600">
                            {record.next_theme}
                          </p>
                        )}
                      </div>
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border bg-gray-50 p-8 text-center text-gray-500">
                <Calendar className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                <p>交換履歴がありません</p>
              </div>
            )}
          </div>

          <div className="flex space-x-2 border-t pt-4">
            <Button onClick={onTireExchange} className="flex-1">
              <Calendar className="mr-2 h-4 w-4" />
              タイヤ交換受付
            </Button>
            <Button
              variant="outline"
              onClick={onEditCustomer}
              className="flex-1"
            >
              <Edit className="mr-2 h-4 w-4" />
              編集
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDetailDialog;
