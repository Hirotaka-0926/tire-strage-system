"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";
import { Car } from "@/utils/interface";

import { ClientWithExchangeHistory } from "@/utils/interface";

interface TireExchangeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCustomer: ClientWithExchangeHistory | null;
  selectedCar: Car;
  setSelectedCar: React.Dispatch<React.SetStateAction<Car>>;
  onTireExchange: () => void;
}

const TireExchangeDialog = ({
  isOpen,
  onOpenChange,
  selectedCustomer,
  selectedCar,
  setSelectedCar,
  onTireExchange,
}: TireExchangeDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lgs">
        <DialogHeader>
          <DialogTitle>タイヤ交換受付</DialogTitle>
        </DialogHeader>
        {selectedCustomer && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium">{selectedCustomer.client_name}</h3>
              <p className="text-sm text-gray-600">
                {selectedCustomer.client_name_kana}
              </p>
              <p className="text-sm text-gray-600">
                {selectedCustomer.address}
              </p>
            </div>

            {selectedCustomer.cars && selectedCustomer.cars.length > 0 && (
              <div>
                <Label className="text-sm font-medium">
                  車両情報を入力してください
                </Label>
                <div className="space-y-2 mt-2 flex flex-col md:flex-row gap-4">
                  {selectedCustomer.cars.map((car) => (
                    <div
                      key={car.id}
                      className="p-2 border rounded cursor-pointer hover:bg-gray-50"
                      onClick={() => setSelectedCar(car)}
                    >
                      <p className="font-medium">{car.car_model}</p>
                      <p className="text-sm text-gray-600">{car.car_number}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2 rounded-md bg-gray-50 p-4">
              <Input
                placeholder="車両モデル"
                value={selectedCar.car_model}
                onChange={(e) => {
                  setSelectedCar((prev) => ({
                    ...prev,
                    car_model: e.target.value,
                  }));
                }}
              />
              <Input
                placeholder="車両番号"
                value={selectedCar.car_number}
                onChange={(e) => {
                  setSelectedCar((prev) => ({
                    ...prev,
                    car_number: e.target.value,
                  }));
                }}
              />
              <Input
                placeholder="年式"
                type="number"
                value={selectedCar.model_year}
                onChange={(e) => {
                  setSelectedCar((prev) => ({
                    ...prev,
                    model_year: Number(e.target.value),
                  }));
                }}
              />
            </div>

            <p>この顧客のタイヤ交換を受付しますか？</p>
            <div className="flex space-x-2">
              <Button onClick={onTireExchange} className="flex-1">
                <Calendar className="w-4 h-4 mr-2" />
                受付
              </Button>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                キャンセル
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TireExchangeDialog;
