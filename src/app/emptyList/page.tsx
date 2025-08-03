import TireStorageMap from "./TireStorageMap";
import { getAreaConfig, getStorages } from "@/utils/supabaseServerFunction";

export default async function Page() {
  const iniArea = await getAreaConfig();
  const iniSlots = await getStorages();
  return <TireStorageMap initialAreas={iniArea} initialSlots={iniSlots} />;
}
