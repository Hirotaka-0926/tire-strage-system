import {StorageLogInput} from "@/utils/interface";
import React, {useState, useEffect} from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Props {
  searchKey: string;
  searchValue: string;
  year: number;
  season: "summer" | "winter";
  isSearchBySeason: boolean;
  storageList: StorageLogInput[];
  setStorageList: React.Dispatch<React.SetStateAction<StorageLogInput[]>>;
  setSelectedStorages: React.Dispatch<React.SetStateAction<StorageLogInput[]>>;
  selectedStorages: StorageLogInput[];
  isConvertPDF: boolean;
  tabText: string;
  setTabText: React.Dispatch<React.SetStateAction<string>>;
}

const TABLE_COLUMNS = [
  {key: "year", label: "年", visible: true},
  {key: "season", label: "シーズン", visible: true},
  {key: "storage_id", label: "保管庫ID", visible: true},
  {key: "client_name", label: "顧客名", visible: true},
  {key: "car_model", label: "車種", visible: true},
  {key: "car_number", label: "ナンバー", visible: true},
]

const LogTable:React.FC<Props> = ({
  searchKey,
  searchValue,
  year,
  season,
  isSearchBySeason,
  storageList,
  setStorageList,
  setSelectedStorages,
  selectedStorages,
  isConvertPDF,
  tabText,
  setTabText
}) => {
  const [visibleColumns, setVisibleColumns] = useState(
    TABLE_COLUMNS.reduce((acc, col) => ({
      ...acc,
      [col.key]: col.visible
    }), {} as Record<string, boolean>)
  );
  const [logDatas, setLogDatas] = useState<StorageLogInput[]>(storageList);

  useEffect(()=>{

  })


  return(
    
  )
}

