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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Client } from "@/utils/interface";

interface CreateCustomerDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newCustomer: Client;
  onCustomerChange: (customer: Client) => void;
  onCreateCustomer: () => void;
  isLoading: boolean;
}

const CreateCustomerDialog = ({
  isOpen,
  onOpenChange,
  newCustomer,
  onCustomerChange,
  onCreateCustomer,
  isLoading,
}: CreateCustomerDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-black hover:bg-gray-800">
          <Plus className="w-4 h-4 mr-2" />
          新しい顧客を作成
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>新規顧客作成</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="customerName">顧客名</Label>
            <Input
              id="customerName"
              value={newCustomer.client_name}
              onChange={(e) =>
                onCustomerChange({
                  ...newCustomer,
                  client_name: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="customerNameKana">顧客名（カナ）</Label>
            <Input
              id="customerNameKana"
              value={newCustomer.client_name_kana}
              onChange={(e) =>
                onCustomerChange({
                  ...newCustomer,
                  client_name_kana: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="postalCode">郵便番号</Label>
            <Input
              id="postalCode"
              value={newCustomer.post_number}
              onChange={(e) =>
                onCustomerChange({
                  ...newCustomer,
                  post_number: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="address">住所</Label>
            <Input
              id="address"
              value={newCustomer.address}
              onChange={(e) =>
                onCustomerChange({
                  ...newCustomer,
                  address: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="phone">電話番号</Label>
            <Input
              id="phone"
              value={newCustomer.phone}
              onChange={(e) =>
                onCustomerChange({
                  ...newCustomer,
                  phone: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="notes">備考</Label>
            <Textarea
              id="notes"
              value={newCustomer.notes}
              onChange={(e) =>
                onCustomerChange({
                  ...newCustomer,
                  notes: e.target.value,
                })
              }
            />
          </div>
          <Button
            onClick={onCreateCustomer}
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "作成中..." : "作成"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCustomerDialog;
