"use client";

import { deleteStorageSchema, StorageLogInput } from "@/utils/interface";
import { deleteStorages } from "@/utils/supabaseFunction";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

type Props = {
  selectedStorages: StorageLogInput[];
};

const DeleteStorages: React.FC<Props> = ({ selectedStorages }) => {
  const router = useRouter();
  const handleDelete = async () => {
    const deleteData: deleteStorageSchema[] = selectedStorages
      .filter((storage_logs) => storage_logs.id !== undefined)
      .map((storage_logs: StorageLogInput) => ({
        id: storage_logs.id as number,
        storage_id: storage_logs.storage.storage_number,
        client_id: deleteProperties.client ? storage_logs.client.id : undefined,
        car_id: deleteProperties.car ? storage_logs.car.id : undefined,
        tire_state_id: deleteProperties.tire_state
          ? storage_logs.state.id
          : undefined,
      }));

    try {
      await deleteStorages(deleteData);
    } catch (error) {
      console.error("Error deleting storages:", error);
    }
    router.refresh();
  };

  const [deleteProperties, setDeleteProperties] = useState({
    tire_state: false,
    car: false,
    client: false,
  });

  if (selectedStorages.length === 0) {
    return (
      <Button variant="destructive" className="m-4" disabled>
        Delete
      </Button>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" className="m-4">
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Storage</DialogTitle>
          <DialogDescription>
            紐づいてるデータを削除しますか？
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <p>選択した保管庫を削除しますか？</p>
          <ul className="list-disc pl-5 flex flex-col gap-4">
            <div>
              <Switch
                id="tire_state"
                checked={deleteProperties.tire_state}
                onCheckedChange={(checked) =>
                  setDeleteProperties({
                    ...deleteProperties,
                    tire_state: checked,
                  })
                }
              />
              <label htmlFor="tire_state">タイヤの整備データ</label>
            </div>
            <div>
              <Switch
                id="car"
                checked={deleteProperties.car}
                onCheckedChange={(checked) =>
                  setDeleteProperties({
                    ...deleteProperties,
                    car: checked,
                  })
                }
              />
              <label htmlFor="car">車の情報</label>
            </div>
            <div>
              <Switch
                id="client"
                checked={deleteProperties.client}
                onCheckedChange={(checked) =>
                  setDeleteProperties({
                    ...deleteProperties,
                    client: checked,
                  })
                }
              />
              <label htmlFor="client">顧客の情報</label>
            </div>
          </ul>
        </div>

        <DialogFooter>
          <Button
            variant={"destructive"}
            onClick={handleDelete}
            className="w-full"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteStorages;
