"use client";

import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Tire, FormSchema } from "@/interface/interface";
import {
  getClientFromTask,
  getTire_StateFromClient,
  getInspectionFromClient,
} from "@/utils/supabaseFunction";

const TaskForm = () => {
  const searchParams = useParams();
  const taskId = searchParams.task_id;

  const formSchema: FormSchema<Tire> = {
    fields: [
      {
        key: "tire_maker",
        label: "タイヤメーカー",
        type: "text",
        required: true,
      },
      {
        key: "tire_pattern",
        label: "パターン",
        type: "text",
        required: true,
      },
      {
        key: "tire_size",
        label: "タイヤサイズ",
        type: "text",
        required: true,
      },
      {
        key: "manufacture_year",
        label: "製造年",
        type: "number",
        required: true,
      },
      {
        key: "air_pressure",
        label: "空気圧",
        type: "number",
        required: true,
      },
      {
        key: "tire_state",
        label: "タイヤ状態",
        type: "text",
        required: true,
      },
      {
        key: "",
      },
    ],
  };
};

export default TaskForm;
