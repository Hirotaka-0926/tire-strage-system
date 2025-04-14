import { useParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { State, FormSchema } from "@/utils/interface";
import { upsertTire } from "@/utils/supabaseFunction";
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
        key: "oil.exchange",
        label: "オイル交換",
        type: "chechbox",
        required: true,
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
        key: "battery.exchange",
        label: "バッテリー交換",
        type: "chechbox",
        required: true,
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
        key: "wiper.exchange",
        label: "ワイパー交換",
        type: "chechbox",
        required: true,
      },
      {
        key: "wiper.note",
        label: "ワイパーメモ",
        type: "text",
        required: true,
      },
      {
        key: "other",
        label: "その他",
        type: "text",
        required: true,
      },
      {
        key: "state",
        label: "状態",
        type: "text",
        required: true,
      },
      {
        key: "memo.inspection_date",
        label: "点検日",
        type: "date",
        required: true,
      },
      {
        key: "memo.distance",
        label: "走行距離",
        type: "number",
        required: true,
      },
      {
        key: "memo.next_theme",
        label: "次回テーマ",
        type: "text",
        required: true,
      },
    ],
    title: "整備データ入力",
    submit: async (data: State) => {
      try {
        await upsertTire(data, Number(taskId));
      } catch (e) {
        console.error("Unexpected error", e);
      }
    },
    setDefault: () => {
      const defaultValues: Partial<State> = {
        id: Number(taskId),
      };
      form.reset(defaultValues);
    },
  };

  return (
    <>
      <FormCustomer schema={formSchema} />
    </>
  );
};

export default TaskForm;
