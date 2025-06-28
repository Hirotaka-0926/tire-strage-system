"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Edit,
  Trash2,
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react";

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
  updateDate?: string;
}

interface CustomerTableProps {
  customers: ClientWithExchangeHistory[];
  onViewDetails: (customer: ClientWithExchangeHistory) => void;
  onEditCustomer: (customer: ClientWithExchangeHistory) => void;
  onDeleteCustomer: (customerId: number) => void;
  onTireExchange: (customer: ClientWithExchangeHistory) => void;
}

const CustomerTable = ({
  customers,
  onViewDetails,
  onEditCustomer,
  onDeleteCustomer,
  onTireExchange,
}: CustomerTableProps) => {
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

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-16">ID</TableHead>
            <TableHead className="w-24">更新日</TableHead>
            <TableHead>顧客名</TableHead>
            <TableHead>顧客名（カナ）</TableHead>
            <TableHead>郵便番号</TableHead>
            <TableHead>住所</TableHead>
            <TableHead>ステータス</TableHead>
            <TableHead className="w-40">アクション</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => {
            const status = getCustomerStatus(customer);
            return (
              <TableRow
                key={customer.id}
                className={`
                  ${customer.thisSeasonExchange ? "bg-green-50" : ""}
                  ${
                    customer.lastSeasonExchange && !customer.thisSeasonExchange
                      ? "bg-yellow-50"
                      : ""
                  }
                  ${
                    !customer.lastSeasonExchange && !customer.thisSeasonExchange
                      ? "bg-red-50"
                      : ""
                  }
                `}
              >
                <TableCell className="font-medium">{customer.id}</TableCell>
                <TableCell>{customer.updateDate}</TableCell>
                <TableCell className="font-medium">
                  {customer.client_name}
                </TableCell>
                <TableCell>{customer.client_name_kana}</TableCell>
                <TableCell>{customer.post_number}</TableCell>
                <TableCell>{customer.address}</TableCell>
                <TableCell>
                  {status && (
                    <Badge
                      variant={
                        status.type === "success" ? "default" : "secondary"
                      }
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
                        ${
                          status.type === "danger"
                            ? "bg-red-100 text-red-800"
                            : ""
                        }
                      `}
                    >
                      <status.icon className="w-3 h-3 mr-1" />
                      {status.label}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onViewDetails(customer)}
                      title="詳細表示"
                    >
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onTireExchange(customer)}
                      title="タイヤ交換受付"
                    >
                      <Calendar className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEditCustomer(customer)}
                      title="編集"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDeleteCustomer(customer.id!)}
                      title="削除"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default CustomerTable;
