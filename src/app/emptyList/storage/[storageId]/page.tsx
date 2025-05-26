import React from "react";
import { Detail } from "./DetailTest";
import {
  getStorageByMasterStorageId,
  getPendingTasks,
  getLogsByStorageId,
} from "@/utils/supabaseFunction";
import { StorageInput, StorageLogInput } from "@/utils/interface";

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
  const initialPendingTasks: StorageInput[] = pendingTasks?.map((task) => ({
    car: task.car,
    client: task.client,
    state: task.state,
  }));

  const initalLog: StorageInput[] = storageLogs?.map((log) => ({
    car: log.car,
    id: log.storage.id,
    client: log.client,
    state: log.state,
  }));
  return (
    <Detail
      initialStorageDetail={storageDetail}
      initialPendingTasks={pendingTasks}
    />
  );
};

export default StorageDetail;
