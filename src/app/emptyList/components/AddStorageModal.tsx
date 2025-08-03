"use client";

import { useState } from "react";
import { Plus, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AreaConfig } from "@/utils/storage";

interface AddStorageModalProps {
  areas: AreaConfig[];
  onAddArea: (areaName: string, totalSlots: number) => void;
  onAddSlotsToArea: (areaName: string, additionalSlots: number) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddStorageModal = ({
  areas,
  onAddArea,
  onAddSlotsToArea,
  open,
  onOpenChange,
}: AddStorageModalProps) => {
  const [newAreaName, setNewAreaName] = useState("");
  const [newAreaSlots, setNewAreaSlots] = useState("");
  const [selectedExistingArea, setSelectedExistingArea] = useState("");
  const [additionalSlots, setAdditionalSlots] = useState("");

  const handleAddNewArea = () => {
    if (newAreaName && newAreaSlots) {
      const slots = Number.parseInt(newAreaSlots);
      if (slots > 0) {
        onAddArea(newAreaName.toUpperCase(), slots);
        setNewAreaName("");
        setNewAreaSlots("");
        onOpenChange(false);
      }
    }
  };

  const handleAddToExistingArea = () => {
    if (selectedExistingArea && additionalSlots) {
      const slots = Number.parseInt(additionalSlots);
      if (slots > 0) {
        onAddSlotsToArea(selectedExistingArea, slots);
        setSelectedExistingArea("");
        setAdditionalSlots("");
        onOpenChange(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Building className="w-5 h-5 mr-2" />
            保管庫を追加
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="new-area" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="new-area">新しいエリアを作成</TabsTrigger>
            <TabsTrigger value="existing-area">既存エリアに追加</TabsTrigger>
          </TabsList>

          <TabsContent value="new-area" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">新しいエリアを作成</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="area-name">エリア名</Label>
                  <Input
                    id="area-name"
                    placeholder="例: C, D, E..."
                    value={newAreaName}
                    onChange={(e) => setNewAreaName(e.target.value)}
                    maxLength={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="area-slots">区画数</Label>
                  <Input
                    id="area-slots"
                    type="number"
                    placeholder="例: 300"
                    value={newAreaSlots}
                    onChange={(e) => setNewAreaSlots(e.target.value)}
                    min="1"
                    max="1000"
                  />
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">プレビュー</h4>
                  <p className="text-sm text-blue-700">
                    {newAreaName && newAreaSlots
                      ? `エリア${newAreaName.toUpperCase()}に${newAreaSlots}個の区画が作成されます`
                      : "エリア名と区画数を入力してください"}
                  </p>
                </div>
                <Button
                  onClick={handleAddNewArea}
                  className="w-full"
                  disabled={!newAreaName || !newAreaSlots}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  新しいエリアを作成
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="existing-area" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  既存エリアに区画を追加
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="existing-area">追加先エリア</Label>
                  <Select
                    value={selectedExistingArea}
                    onValueChange={setSelectedExistingArea}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="エリアを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {areas.map((area) => (
                        <SelectItem key={area.name} value={area.name}>
                          エリア{area.name} (現在: {area.totalSlots}区画)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="additional-slots">追加する区画数</Label>
                  <Input
                    id="additional-slots"
                    type="number"
                    placeholder="例: 50"
                    value={additionalSlots}
                    onChange={(e) => setAdditionalSlots(e.target.value)}
                    min="1"
                    max="500"
                  />
                </div>
                {selectedExistingArea && additionalSlots && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">
                      プレビュー
                    </h4>
                    <p className="text-sm text-green-700">
                      エリア{selectedExistingArea}に{additionalSlots}
                      個の区画が追加されます
                      <br />
                      合計:{" "}
                      {areas.find((a) => a.name === selectedExistingArea)
                        ?.totalSlots || 0}{" "}
                      →{" "}
                      {(areas.find((a) => a.name === selectedExistingArea)
                        ?.totalSlots || 0) + Number.parseInt(additionalSlots)}
                      区画
                    </p>
                  </div>
                )}
                <Button
                  onClick={handleAddToExistingArea}
                  className="w-full"
                  disabled={!selectedExistingArea || !additionalSlots}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  区画を追加
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
