"use client";

import { ClientWithExchangeHistory } from "@/app/refactor/domain/type/reception";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Edit,
  Eye,
  Trash2,
  XCircle,
} from "lucide-react";

interface CustomerTableProps {
  customers: ClientWithExchangeHistory[];
  onViewDetails: (customer: ClientWithExchangeHistory) => void;
  onEditCustomer: (customer: ClientWithExchangeHistory) => void;
  onDeleteCustomer: (customer: ClientWithExchangeHistory) => void;
  onTireExchange: (customer: ClientWithExchangeHistory) => void;
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

const getRowColor = (customer: ClientWithExchangeHistory) => {
  if (customer.thisSeasonExchange) return "bg-green-50";
  if (customer.lastSeasonExchange && !customer.thisSeasonExchange) {
    return "bg-yellow-50";
  }
  return "bg-red-50";
};

const getBadgeClass = (type: "success" | "warning" | "danger") => {
  if (type === "success") return "bg-green-100 text-green-800";
  if (type === "warning") return "bg-yellow-100 text-yellow-800";
  return "bg-red-100 text-red-800";
};

const CustomerTable = ({
  customers,
  onViewDetails,
  onEditCustomer,
  onDeleteCustomer,
  onTireExchange,
}: CustomerTableProps) => {
  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-16">ID</TableHead>
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
            const StatusIcon = status.icon;

            return (
              <TableRow key={customer.id} className={getRowColor(customer)}>
                <TableCell className="font-medium">{customer.id}</TableCell>
                <TableCell className="font-medium">
                  {customer.client_name}
                </TableCell>
                <TableCell>{customer.client_name_kana}</TableCell>
                <TableCell>{customer.post_number}</TableCell>
                <TableCell>{customer.address}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={getBadgeClass(status.type)}
                  >
                    <StatusIcon className="mr-1 h-3 w-3" />
                    {status.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onViewDetails(customer)}
                      title="詳細表示"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onTireExchange(customer)}
                      title="タイヤ交換受付"
                    >
                      <Calendar className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEditCustomer(customer)}
                      title="編集"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDeleteCustomer(customer)}
                      title="削除"
                    >
                      <Trash2 className="h-3 w-3" />
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
