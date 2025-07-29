"use client";

import { useState, useMemo } from "react";
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

import { useStorageData } from "@/utils/hooks/useStorageData";
import type { StorageSlot } from "@/utils/storage";

export default function TireStorageMap() {
  const { areas, slots, addArea, addSlotsToArea, updateSlot } =
    useStorageData();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArea, setSelectedArea] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSlot, setSelectedSlot] = useState<StorageSlot | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [addModalOpen, setAddModalOpen] = useState(false);

  const filteredSlots = useMemo(() => {
    return slots.filter((slot) => {
      const matchesSearch =
        slot.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (slot.customerInfo?.customerName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ??
          false);
      const matchesArea = selectedArea === "all" || slot.area === selectedArea;
      const matchesStatus =
        statusFilter === "all" || slot.status === statusFilter;
      return matchesSearch && matchesArea && matchesStatus;
    });
  }, [searchTerm, selectedArea, statusFilter, slots]);

  const handleSlotSelect = (slot: StorageSlot | null) => {
    setSelectedSlot(slot);
  };

  const handleUpdateSlot = (slotId: string, updates: Partial<StorageSlot>) => {
    updateSlot(slotId, updates);
    // 選択中のスロットも更新
    if (selectedSlot?.id === slotId) {
      setSelectedSlot({ ...selectedSlot, ...updates });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <MapPin className="w-6 h-6 mr-2" />
            保管庫詳細マップ
          </h2>

          <StatsCards areas={areas} slots={slots} />

          <SearchAndFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedArea={selectedArea}
            setSelectedArea={setSelectedArea}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            areas={areas}
            filteredCount={filteredSlots.length}
            onAddStorage={() => setAddModalOpen(true)}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* メインマップエリア */}
          <div className="lg:col-span-2">
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
                    value={
                      selectedArea === "all"
                        ? areas[0]?.name || "A"
                        : selectedArea
                    }
                    onValueChange={(value) => setSelectedArea(value)}
                  >
                    <TabsList className="mb-4">
                      {areas.map((area) => (
                        <TabsTrigger key={area.name} value={area.name}>
                          エリア{area.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {areas.map((area) => (
                      <TabsContent key={area.name} value={area.name}>
                        <div className="text-xs text-gray-600 mb-2">
                          エリア{area.name} (1-{area.totalSlots})
                        </div>
                        <StorageGrid
                          slots={filteredSlots.filter(
                            (slot) => slot.area === area.name
                          )}
                          selectedSlot={selectedSlot}
                          onSlotSelect={handleSlotSelect}
                        />
                      </TabsContent>
                    ))}
                  </Tabs>
                ) : (
                  <StorageList
                    slots={filteredSlots}
                    selectedSlot={selectedSlot}
                    onSlotSelect={handleSlotSelect}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* 詳細パネル */}
          <div className="lg:col-span-1">
            <DetailPanel
              selectedSlot={selectedSlot}
              onUpdateSlot={handleUpdateSlot}
            />
          </div>
        </div>
      </div>

      <AddStorageModal
        areas={areas}
        onAddArea={addArea}
        onAddSlotsToArea={addSlotsToArea}
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
      />
    </div>
  );
}
