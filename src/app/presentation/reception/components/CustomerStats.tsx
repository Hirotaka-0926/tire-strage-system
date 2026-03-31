"use client";

import { ClientWithExchangeHistory } from "@/app/domain/type/reception";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Users, XCircle } from "lucide-react";

interface CustomerStatsProps {
  customers: ClientWithExchangeHistory[];
}

const CustomerStats = ({ customers }: CustomerStatsProps) => {
  const thisSeasonCount = customers.filter((c) => c.thisSeasonExchange).length;
  const needsContactCount = customers.filter(
    (c) => c.lastSeasonExchange && !c.thisSeasonExchange,
  ).length;
  const longTermUnusedCount = customers.filter(
    (c) => !c.lastSeasonExchange && !c.thisSeasonExchange,
  ).length;
  const totalCount = customers.length;

  return (
    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">今シーズン交換済み</p>
              <p className="text-2xl font-bold text-green-600">
                {thisSeasonCount}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <div>
              <p className="text-sm text-gray-600">要連絡</p>
              <p className="text-2xl font-bold text-yellow-600">
                {needsContactCount}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <XCircle className="h-5 w-5 text-red-600" />
            <div>
              <p className="text-sm text-gray-600">長期未利用</p>
              <p className="text-2xl font-bold text-red-600">
                {longTermUnusedCount}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">総顧客数</p>
              <p className="text-2xl font-bold text-blue-600">{totalCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerStats;
