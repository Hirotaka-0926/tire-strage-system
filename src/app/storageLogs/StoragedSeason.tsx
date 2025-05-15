"use client";

import React, { useState, useEffect } from "react";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getStoragedYear } from "@/utils/supabaseFunction";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [years, setYears] = useState<number[]>([]);
  useEffect(() => {
    const fetchYear = async () => {
      const getYears = await getStoragedYear();
      setYears(distinctYear(getYears));
    };

    const distinctYear = (years: { year: number }[]) => {
      return years.reduce<number[]>((prev, current) => {
        // 配列が空、または最後の要素と異なる場合に追加
        if (prev.length === 0 || prev[prev.length - 1] !== current.year) {
          prev.push(current.year);
        }
        return prev;
      }, []);
    };
    fetchYear();
  }, []);
  return (
    <div className="flex flex-col space-y-4 w-full p-4">
      <Select value={year.toString()} onValueChange={(value) => setYear(Number(value))}>
        <SelectTrigger className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <SelectValue placeholder="年度" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>年度</SelectLabel>
            {years.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

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
