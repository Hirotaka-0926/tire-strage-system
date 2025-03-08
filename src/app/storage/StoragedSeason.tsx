import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Props {
  year: number;
  season: "summer" | "winter";
  setYear: React.Dispatch<React.SetStateAction<number>>;
  setSeason: React.Dispatch<React.SetStateAction<"summer" | "winter">>;
}

const StoragedSeason: React.FC<Props> = ({
  year,
  season,
  setYear,
  setSeason,
}) => {
  return (
    <div className="flex flex-col space-y-4 w-full p-4">
      <Input
        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        id="year"
        value={year}
        type="number"
        onChange={(e) => {
          setYear(Number(e.target.value));
        }}
      />

      <RadioGroup
        value={season}
        onValueChange={(value) => setSeason(value as "summer" | "winter")}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem id="summer" value="summer" />
          <Label htmlFor="summer">夏タイヤ</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem id="winter" value="winter" />
          <Label htmlFor="winter">冬タイヤ</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default StoragedSeason;
