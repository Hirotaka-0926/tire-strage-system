// src/app/storage/[storage_id]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StorageLogsToDisplay } from "@/utils/interface";
import { getStorageById } from "@/utils/supabaseFunction";
import StorageToPdf from "./StorageToPdf";

const StorageDetail: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const storageId =
    typeof params.storage_id === "string" ? parseInt(params.storage_id) : null;
  const [storage, setStorage] = useState<StorageLogsToDisplay | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStorage = async () => {
      if (!storageId) {
        setError("無効な保管庫IDです");
        setLoading(false);
        return;
      }

      try {
        const data = await getStorageById(storageId);
        setStorage(data);
      } catch (err) {
        console.error("Error fetching storage:", err);
        setError("保管庫情報の取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchStorage();
  }, [storageId]);

  const handleEditCustomer = () => {
    if (storage && storage.client) {
      router.push(`/customer/edit/${storage.client.id}`);
    }
  };

  const handleEditCar = () => {
    if (storage && storage.car) {
      router.push(`/customer/edit/${storage.client.id}/car/${storage.car.id}`);
    }
  };

  const handleReturn = () => {
    router.push("/storage");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        読み込み中...
      </div>
    );
  }

  if (error || !storage) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-red-500">
          {error || "保管庫データが見つかりません"}
        </p>
        <Button onClick={handleReturn} className="mt-4">
          戻る
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Button onClick={handleReturn} className="mb-4">
        ← 戻る
      </Button>
      <StorageToPdf storage={storage} className="flex justify-end" />

      <h1 className="text-2xl font-bold mb-6">保管庫詳細</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>保管庫情報</CardTitle>
            <CardDescription>保管庫の基本情報</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <p className="font-semibold">保管庫タイプ:</p>
              <p>{storage.storage?.storage_type}</p>

              <p className="font-semibold">保管庫ID:</p>
              <p>{storage.storage?.storage_number}</p>

              <p className="font-semibold">作成年:</p>
              <p>{storage.year}</p>
              <p className="font-semibold">シーズン:</p>
              <p>{storage.season}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>顧客情報</CardTitle>
            <CardDescription>保管庫に関連する顧客情報</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <p className="font-semibold">顧客名:</p>
              <p>{storage.client?.client_name}</p>

              <p className="font-semibold">顧客名(カナ):</p>
              <p>{storage.client?.client_name_kana}</p>

              <p className="font-semibold">住所:</p>
              <p>{storage.client?.address}</p>

              <p className="font-semibold">郵便番号:</p>
              <p>{storage.client?.post_number}</p>
            </div>
            <Button onClick={handleEditCustomer} className="mt-4 w-full">
              顧客情報を編集
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>車両情報</CardTitle>
            <CardDescription>保管庫に関連する車両情報</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <p className="font-semibold">車種:</p>
              <p>{storage.car?.car_model}</p>

              <p className="font-semibold">ナンバー:</p>
              <p>{storage.car?.car_number}</p>
            </div>
            <Button onClick={handleEditCar} className="mt-4 w-full">
              車両情報を編集
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>タイヤ情報</CardTitle>
            <CardDescription>
              保管庫に保存されているタイヤの情報
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <p className="font-semibold">タイヤメーカー:</p>
              <p>{storage.state?.tire_maker}</p>

              <p className="font-semibold">タイヤパターン:</p>
              <p>{storage.state?.tire_pattern}</p>

              <p className="font-semibold">タイヤサイズ:</p>
              <p>{storage.state?.tire_size}</p>

              <p className="font-semibold">タイヤ状態:</p>
              <p>{storage.state?.tire_inspection?.state || "不明"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StorageDetail;
