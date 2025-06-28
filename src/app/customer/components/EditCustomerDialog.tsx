"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
}

interface EditCustomerDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  customer: ClientWithExchangeHistory | null;
  onCustomerChange: (customer: ClientWithExchangeHistory) => void;
  onUpdateCustomer: () => void;
  isLoading: boolean;
}

const EditCustomerDialog = ({
  isOpen,
  onOpenChange,
  customer,
  onCustomerChange,
  onUpdateCustomer,
  isLoading,
}: EditCustomerDialogProps) => {
  if (!customer) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>顧客情報編集</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="editCustomerName">顧客名</Label>
            <Input
              id="editCustomerName"
              value={customer.client_name}
              onChange={(e) =>
                onCustomerChange({
                  ...customer,
                  client_name: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="editCustomerNameKana">顧客名（カナ）</Label>
            <Input
              id="editCustomerNameKana"
              value={customer.client_name_kana}
              onChange={(e) =>
                onCustomerChange({
                  ...customer,
                  client_name_kana: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="editPostalCode">郵便番号</Label>
            <Input
              id="editPostalCode"
              value={customer.post_number}
              onChange={(e) =>
                onCustomerChange({
                  ...customer,
                  post_number: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="editAddress">住所</Label>
            <Input
              id="editAddress"
              value={customer.address}
              onChange={(e) =>
                onCustomerChange({
                  ...customer,
                  address: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="editPhone">電話番号</Label>
            <Input
              id="editPhone"
              value={customer.phone || ""}
              onChange={(e) =>
                onCustomerChange({
                  ...customer,
                  phone: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="editNotes">備考</Label>
            <Textarea
              id="editNotes"
              value={customer.notes || ""}
              onChange={(e) =>
                onCustomerChange({
                  ...customer,
                  notes: e.target.value,
                })
              }
            />
          </div>
          <Button
            onClick={onUpdateCustomer}
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "更新中..." : "更新"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditCustomerDialog;
