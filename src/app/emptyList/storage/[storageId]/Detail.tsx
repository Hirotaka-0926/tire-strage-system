import { getYearAndSeason } from "@/utils/globalFunctions";
import { StorageLogsToDisplay } from "@/utils/interface";
import { getStorageByMasterStorageId } from "@/utils/supabaseFunction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Detail = async ({ params }: { params: { storageId: string } }) => {
  const { year, season } = getYearAndSeason();

  const storageId =
    typeof params.storageId === "string" ? parseInt(params.storageId) : null;

  const storageDetail = (await getStorageByMasterStorageId(
    storageId!
  )) as StorageLogsToDisplay;
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-bold">
          {storageDetail.client.client_name} {storageDetail.car.car_number}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <span className="font-semibold">保管庫ID:</span>
            <span>{storageDetail.storage.storage_number}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">シーズン:</span>
            <span>{`${year} ${season}`}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">保管庫タイプ:</span>
            <span>{storageDetail.storage.storage_type}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
