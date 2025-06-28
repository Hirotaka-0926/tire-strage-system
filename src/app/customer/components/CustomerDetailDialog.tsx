"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar,
  Edit,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react";

interface ExchangeRecord {
  id: number;
  season: "winter" | "summer";
  year: number;
  next_theme: string;
}

interface ClientWithExchangeHistory {
  id?: number;
  client_name: string;
  client_name_kana: string;
  address: string;
  post_number: string;
  phone: string;
  notes: string;
  thisSeasonExchange?: boolean;
  lastSeasonExchange?: boolean;
  exchangeHistory?: ExchangeRecord[];
}

interface CustomerDetailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  customer: ClientWithExchangeHistory | null;
  onEditCustomer: () => void;
  onTireExchange: () => void;
}

const CustomerDetailDialog = ({
  isOpen,
  onOpenChange,
  customer,
  onEditCustomer,
  onTireExchange,
}: CustomerDetailDialogProps) => {
  const getCustomerStatus = (customer: ClientWithExchangeHistory) => {
    if (customer.thisSeasonExchange) {
      return {
        type: "success",
        label: "今シーズン交換済み",
        icon: CheckCircle,
      };
    } else if (customer.lastSeasonExchange && !customer.thisSeasonExchange) {
      return { type: "warning", label: "要連絡", icon: AlertTriangle };
    } else if (!customer.lastSeasonExchange && !customer.thisSeasonExchange) {
      return { type: "danger", label: "長期未利用", icon: XCircle };
    }
    return null;
  };

  if (!customer) return null;

  const status = getCustomerStatus(customer);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>顧客詳細情報</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* 基本情報 */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
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

          {/* ステータス */}
          <div className="p-4 border rounded-lg">
            <Label className="text-sm font-medium text-gray-600">
              現在のステータス
            </Label>
            <div className="mt-2">
              {status && (
                <Badge
                  variant={status.type === "success" ? "default" : "secondary"}
                  className={`
                    ${
                      status.type === "success"
                        ? "bg-green-100 text-green-800"
                        : ""
                    }
                    ${
                      status.type === "warning"
                        ? "bg-yellow-100 text-yellow-800"
                        : ""
                    }
                    ${status.type === "danger" ? "bg-red-100 text-red-800" : ""}
                  `}
                >
                  <status.icon className="w-4 h-4 mr-2" />
                  {status.label}
                </Badge>
              )}
            </div>
          </div>

          {/* 交換履歴 */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">タイヤ交換履歴</Label>
            {customer.exchangeHistory && customer.exchangeHistory.length > 0 ? (
              <div className="space-y-3">
                {customer.exchangeHistory.map((record) => (
                  <div
                    key={record.id}
                    className="p-4 border rounded-lg bg-white"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {record.season}
                          </Badge>
                        </div>
                        <p className="font-medium">{record.year}</p>
                        {record.next_theme && (
                          <p className="text-sm text-gray-600 mt-1">
                            {record.next_theme}
                          </p>
                        )}
                      </div>
                      <Calendar className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500 border rounded-lg bg-gray-50">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>交換履歴がありません</p>
              </div>
            )}
          </div>

          {/* アクションボタン */}
          <div className="flex space-x-2 pt-4 border-t">
            <Button onClick={onTireExchange} className="flex-1">
              <Calendar className="w-4 h-4 mr-2" />
              タイヤ交換受付
            </Button>
            <Button
              variant="outline"
              onClick={onEditCustomer}
              className="flex-1"
            >
              <Edit className="w-4 h-4 mr-2" />
              編集
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDetailDialog;
