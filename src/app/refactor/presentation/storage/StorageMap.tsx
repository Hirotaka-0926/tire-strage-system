"use client";

import { useMemo, useState } from "react";
import { MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

import { StatsCards } from "./components/StatusCard";
import { SearchAndFilters } from "./components/SearchAndFilters";
import { StorageGrid } from "./components/StorageGrid";
import { StorageList } from "./components/StorageList";
import { DetailPanel } from "./components/DetailPanel";
import { AddStorageModal } from "./components/AddStorageModal";
import DeleteSlots from "./components/DeleteSlots";

import { useStorageData } from "@/utils/hooks/useStorageData";
import {
  StorageAreaConfig,
  StorageSlot,
} from "@/app/refactor/domain/type/storage";

interface StorageMapProps {
  initialAreas: StorageAreaConfig[];
  initialSlots: StorageSlot[];
}

const StorageMap = ({ initialAreas, initialSlots }: StorageMapProps) => {
  const {
    areas,
    slots,
    addArea,
    addSlotsToArea,
    updateSlot,
    assignFromHistory,
    assignFromManual,
  } = useStorageData(initialAreas as any, initialSlots as any);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArea, setSelectedArea] = useState("A");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSlot, setSelectedSlot] = useState<StorageSlot | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const filteredSlots = useMemo(() => {
    return slots.filter((slot) => {
      const matchesSearch = slot.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesArea = selectedArea === "all" || slot.id.startsWith(`${selectedArea}_`);

      let matchesStatus = true;
      if (statusFilter === "occupied") {
        matchesStatus =
          slot.car_id !== null || slot.client_id !== null || slot.tire_state_id !== null;
      } else if (statusFilter === "available") {
        matchesStatus =
          slot.car_id === null && slot.client_id === null && slot.tire_state_id === null;
      }

      return matchesSearch && matchesArea && matchesStatus;
    });
  }, [searchTerm, selectedArea, statusFilter, slots]);

  const handleSlotSelect = (slot: StorageSlot | null) => {
    setSelectedSlot(slot);
  };

  const handleUpdateSlot = (slotId: string, updates: Partial<StorageSlot>) => {
    updateSlot(slotId, updates);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="mb-4 flex items-center text-2xl font-bold text-gray-800">
            <MapPin className="mr-2 h-6 w-6" />
            保管庫詳細マップ
          </h2>

          <StatsCards areas={areas as any} slots={slots as any} />

          <SearchAndFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedArea={selectedArea}
            setSelectedArea={setSelectedArea}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            areas={areas as any}
            filteredCount={filteredSlots.length}
            onAddStorage={() => setAddModalOpen(true)}
            onDeleteSlots={() => setDeleteModalOpen(true)}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="md:col-span-1 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>保管庫マップ</span>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-gray-600">表示:</span>
                    <Button
                      variant={viewMode === "grid" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                    >
                      グリッド
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                    >
                      リスト
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {viewMode === "grid" ? (
                  <Tabs
                    value={selectedArea === "all" ? areas[0]?.name || "A" : selectedArea}
                    onValueChange={(value) => setSelectedArea(value)}
                  >
                    <TabsList className="mb-4">
                      {areas
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((area) => (
                          <TabsTrigger key={area.name} value={area.name}>
                            エリア{area.name}
                          </TabsTrigger>
                        ))}
                    </TabsList>
                    {areas
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((area) => (
                        <TabsContent key={area.name} value={area.name}>
                          <div className="mb-2 text-xs text-gray-600">
                            エリア{area.name} (1-{area.totalSlots})
                          </div>
                          <StorageGrid
                            slots={filteredSlots.filter((slot) => slot.id.startsWith(`${area.name}_`)) as any}
                            selectedSlot={selectedSlot}
                            onSlotSelect={handleSlotSelect}
                          />
                        </TabsContent>
                      ))}
                  </Tabs>
                ) : (
                  <StorageList
                    slots={filteredSlots as any}
                    selectedSlot={selectedSlot}
                    onSlotSelect={handleSlotSelect}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1 lg:col-span-1">
            <DetailPanel
              selectedSlot={selectedSlot}
              onUpdateSlot={handleUpdateSlot}
              setSelectedSlot={setSelectedSlot}
              onUpdateFromHistory={assignFromHistory as any}
              assignFromManual={assignFromManual as any}
            />
          </div>
        </div>
      </div>

      <AddStorageModal
        areas={areas as any}
        onAddArea={addArea}
        onAddSlotsToArea={addSlotsToArea}
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
      />

      <DeleteSlots open={deleteModalOpen} onOpenChange={setDeleteModalOpen} />
    </div>
  );
};

export default StorageMap;
