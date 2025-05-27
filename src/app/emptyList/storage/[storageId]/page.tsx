import React from "react";
import { Detail } from "./DetailTest";
import {
  getStorageByMasterStorageId,
  getPendingTasks,
  getLogsByStorageId,
} from "@/utils/supabaseFunction";

interface StorageParams {
  params: {
    storageId: string;
  };
}

const StorageDetail = async ({ params }: StorageParams) => {
  const { storageId } = params;
  console.log("storageId", storageId);
  const storageDetail = await getStorageByMasterStorageId(storageId);
  const pendingTasks = await getPendingTasks();
  const storageLogs = await getLogsByStorageId(storageId);
  return (
    <Detail
      initialStorageDetail={storageDetail}
      initialPendingTasks={pendingTasks}
      initialLogs={storageLogs}
    />
  );
};

export default StorageDetail;
