import { createStorageQueryApplication } from "@/app/refactor/application/storage/storageQueryApplication";
import StorageMap from "@/app/refactor/presentation/storage/StorageMap";

const RefactorStoragePage = async () => {
  const app = createStorageQueryApplication();
  const { areas, slots } = await app.getStorageMapData();

  return <StorageMap initialAreas={areas} initialSlots={slots} />;
};

export default RefactorStoragePage;
