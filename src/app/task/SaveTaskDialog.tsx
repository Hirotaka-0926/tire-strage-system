import { TaskInput } from "@/utils/interface";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CustomerInfoCard from "./components/CustomerInfoCard";

import InspectionInfoCard from "./components/InspectionInfoCard";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedData: TaskInput | null;
  onSave: () => void;
}

const SaveTaskDialog = ({ open, setOpen, selectedData }: Props) => {
  return (
    <Dialog open={open} onOpenChange={setOpen} modal>
      <DialogHeader>
        <DialogTitle>以下のデータで保存してもよろしいでしょうか？</DialogTitle>
      </DialogHeader>
      <DialogContent className="max-h-[80vh] overflow-y-auto bg-gray-50 p-6">
        <CustomerInfoCard selectedItem={selectedData} />
        <InspectionInfoCard selectedItem={selectedData} />
      </DialogContent>
    </Dialog>
  );
};

export default SaveTaskDialog;
