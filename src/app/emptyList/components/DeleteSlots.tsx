import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
const DeleteSlots = ({ open, onOpenChange }: Props) => {
  return (
    <Dialog open={open} onOpenChange={() => onOpenChange(!open)}>
      <DialogHeader>
        <DialogTitle>保管庫削除</DialogTitle>
      </DialogHeader>
      <DialogContent>
        <Tabs defaultValue="delete-slots" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger className="w-full" value="delete-slots">
              保管庫調整
            </TabsTrigger>
            <TabsTrigger className="w-full" value="delete-area">
              エリア削除
            </TabsTrigger>
          </TabsList>
          <TabsContent value="delete-slots">
            <Card>
              <CardHeader>
                <CardTitle>保管庫削除</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  保管庫を削除する場合は、以下のフォームに削除したい保管庫のIDを入力してください。
                </p>
                <Input placeholder="保管庫ID" className="mb-4" />
                <Button variant="destructive">削除</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="delete-area">
            <Card>
              <CardHeader>
                <CardTitle>エリア削除</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  エリアを削除する場合は、以下のフォームに削除したいエリアのIDを入力してください。
                </p>
                <Input placeholder="エリアID" className="mb-4" />
                <Button variant="destructive">削除</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteSlots;
