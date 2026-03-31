"use client";

import React from "react";
import {
  Car,
  ClientWithExchangeHistory,
} from "@/app/refactor/domain/type/reception";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";

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
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>タイヤ交換受付</DialogTitle>
        </DialogHeader>

        {selectedCustomer && (
          <div className="space-y-4">
            <div className="rounded-lg bg-gray-50 p-4">
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
                <div className="mt-2 flex flex-col gap-4 space-y-2 md:flex-row">
                  {selectedCustomer.cars.map((car, index) => (
                    <div
                      key={`${car.id ?? "unknown"}-${car.car_number}-${index}`}
                      className="cursor-pointer rounded border p-2 hover:bg-gray-50"
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
                onChange={(e) =>
                  setSelectedCar((prev) => ({
                    ...prev,
                    car_model: e.target.value,
                  }))
                }
              />
              <Input
                placeholder="車両番号"
                value={selectedCar.car_number}
                onChange={(e) =>
                  setSelectedCar((prev) => ({
                    ...prev,
                    car_number: e.target.value,
                  }))
                }
              />
            </div>

            <p>この顧客のタイヤ交換を受付しますか？</p>
            <div className="flex space-x-2">
              <Button onClick={onTireExchange} className="flex-1">
                <Calendar className="mr-2 h-4 w-4" />
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
