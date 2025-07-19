import React from "react";
import { Detail } from "./DetailTest";
import {
  getStorageByMasterStorageId,
  getPendingTasks,
  getLogsByStorageId,
} from "@/utils/supabaseServerFunction";

interface StorageParams {
  params: Promise<{
    storageId: string;
  }>;
}

const StorageDetail = async ({ params }: StorageParams) => {
  const { storageId } = await params;
  console.log("storageId", storageId);

  const storageDetail = (await getStorageByMasterStorageId(storageId)) || null;
  const pendingTasks = (await getPendingTasks()) || null;
  const storageLogs = (await getLogsByStorageId(storageId)) || null;

  // ストレージが空または初期状態の場合
  if (
    !storageDetail ||
    (storageDetail.car === null && storageDetail.client === null) ||
    storageDetail.state === null
  ) {
    return (
      <Detail
        initialStorageDetail={null}
        initialPendingTasks={pendingTasks}
        initialLogs={storageLogs}
      />
    );
  }

  return (
    <Detail
      initialStorageDetail={storageDetail}
      initialPendingTasks={pendingTasks}
      initialLogs={storageLogs}
    />
  );
};

export default StorageDetail;
