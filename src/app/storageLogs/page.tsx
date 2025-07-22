import { Suspense } from "react";
import StoragePage from "./StoragePage";

import { getAllStorages } from "@/utils/supabaseServerFunction";

import { StorageLogInput } from "@/utils/interface";
import SpinLoading from "@/components/base/Loading/SpinLoading";

const StorageServerPage = async () => {
  const initialStorages = await getAllStorages();

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">保管庫一覧</h1>
      <Suspense fallback={<SpinLoading />}>
        <StoragePage initialStorages={initialStorages as StorageLogInput[]} />
      </Suspense>
    </div>
  );
};

export default StorageServerPage;
