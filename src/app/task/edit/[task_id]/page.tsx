"use client";

import { useParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { State, FormSchema } from "@/interface/interface";
import { upsertTire, getStateByTaskId } from "@/utils/supabaseFunction";
import FormCustomer from "@/features/customer/FormCustomer";

const TaskForm = () => {
  const searchParams = useParams();
  const taskId = searchParams.task_id;
  const form = useForm<State>();

  const formSchema: FormSchema<State> = {
    form: form,
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
        key: "tire_state.state",
        label: "タイヤ状態",
        type: "text",
        required: true,
      },
      {
        key: "tire_state.note",
        label: "タイヤ状態メモ",
        type: "text",
        required: true,
      },
      {
        key: "oil.state",
        label: "オイル状態",
        type: "text",
        required: true,
      },
      {
        key: "oil.isExchange",
        label: "オイル交換",
        type: "checkbox",
        required: false,
      },
      {
        key: "oil.note",
        label: "オイルメモ",
        type: "text",
        required: true,
      },
      {
        key: "battery.state",
        label: "バッテリー状態",
        type: "text",
        required: true,
      },
      {
        key: "battery.isExchange",
        label: "バッテリー交換",
        type: "checkbox",
        required: false,
      },
      {
        key: "battery.note",
        label: "バッテリーメモ",
        type: "text",
        required: true,
      },
      {
        key: "wiper.state",
        label: "ワイパー状態",
        type: "text",
        required: true,
      },
      {
        key: "wiper.isExchange",
        label: "ワイパー交換",
        type: "checkbox",
        required: false,
      },
      {
        key: "wiper.note",
        label: "ワイパーメモ",
        type: "text",
        required: true,
      },
      {
        key: "other_inspection",
        label: "その他",
        type: "text",
        required: true,
      },
      {
        key: "state_inspection",
        label: "状態",
        type: "text",
        required: true,
      },
      {
        key: "inspection_date",
        label: "点検日",
        type: "date",
        required: true,
      },
      {
        key: "drive_distance",
        label: "走行距離",
        type: "number",
        required: true,
      },
      {
        key: "next_theme",
        label: "次回テーマ",
        type: "text",
        required: true,
      },
    ],
    title: "整備データ入力",
    submit: async (data: State) => {
      await upsertTire(data, Number(taskId));
    },
    setDefault: async () => {
      const defaultValue = await getStateByTaskId(Number(taskId));
      form.reset(defaultValue);
    },
  };

  return (
    <>
      <FormCustomer schema={formSchema} />
    </>
  );
};

export default TaskForm;
