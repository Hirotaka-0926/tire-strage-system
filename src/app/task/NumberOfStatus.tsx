import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const NumberOfStatus = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader>
          <CardTitle>整備データ未入力</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">{/*ここにデータ数を入力 */}2件</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>保管庫ID未入力</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">{/*ここにデータ数を入力 */}2件</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>作業完了</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">{/*ここにデータ数を入力 */}2件</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default NumberOfStatus;
