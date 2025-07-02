import { TaskInput } from "@/utils/interface";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedData: TaskInput | null;
}

const SaveTaskDialog = ({ open, setOpen, selectedData }: Props) => {
  return (
    <Dialog open={open} onOpenChange={setOpen} modal>
      <DialogHeader>
        <DialogTitle>以下のデータで保存してもよろしいでしょうか？</DialogTitle>
      </DialogHeader>
      <DialogContent>
        <pre>{JSON.stringify(selectedData, null, 2)}</pre>
      </DialogContent>
    </Dialog>
  );
};

export default SaveTaskDialog;
