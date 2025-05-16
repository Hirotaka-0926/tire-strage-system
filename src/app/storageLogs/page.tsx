import { Suspense } from "react";
import StoragePage from "./ClientPage";
import { getAllStorages } from "@/utils/supabaseFunction";
import { Loader2 } from "lucide-react";
import { StorageLogsToDisplay } from "@/utils/interface";

const StorageServerPage = async () => {
  const initialStorages = await getAllStorages();

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">保管庫一覧</h1>
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-lg font-semibold ml-2 animate">
              読み込み中<span className="animate-ping">...</span>
            </p>
          </div>
        }
      >
        <StoragePage
          initialStorages={initialStorages as StorageLogsToDisplay[]}
        />
      </Suspense>
    </div>
  );
};

export default StorageServerPage;
