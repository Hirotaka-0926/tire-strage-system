"use client";

import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Tire, Inspection_Item } from "@/interface/interface";
import {
  getClientFromTask,
  getTire_StateFromClient,
  getInspectionFromClient,
} from "@/utils/supabaseFunction";

const TaskForm = () => {
  const searchParams = useSearchParams();
  const taskId = searchParams.get("task_id");

  const {
    register: registerTireState,
    handleSubmit: handleSubmitTireState,
    formState: { errors: errorsTireState },
    reset: resetTireState,
  } = useForm<Tire>();

  const {
    register: registerInspection,
    handleSubmit: handleSubmitInspection,
    formState: { errors: errorsInspection },
    reset: resetInspection,
  } = useForm<Inspection_Item>();

  useEffect(() => {
    const setClient = async (taskId: number): Promise<number> => {
      if (taskId === null) return 1;
      const client = await getClientFromTask(taskId);
      return client.id; //未完成
    };
    const setTireStateDefault = async (clientId: number) => {
      const tireDefault: Tire = await getTire_StateFromClient(clientId);
      console.log("tire id" + tireDefault.id);
      resetTireState(tireDefault);
    };

    const setInspectionDefault = async (clientId: number) => {
      const inspection_default = await getInspectionFromClient(clientId);
      console.log("inspection " + inspection_default);
      resetInspection(inspection_default);
    };

    const fetchClientData = async () => {
      const clientId = await setClient(taskId);
      await setTireStateDefault(clientId);
      await setInspectionDefault(clientId);
    };

    fetchClientData();
  }, []);

  const submit_TireState: SubmitHandler<Tire> = (data) => {
    console.log(data);
  };

  const submit_Inspection: SubmitHandler<Inspection_Item> = (data) => {
    console.log(data);
  };

  return (
    <div className="h-full mb-10">
      <form onSubmit={handleSubmitTireState(submit_TireState)}>
        <h2 className="text-xl font-bold">Task Form</h2>
        <div className="my-2">
          <label htmlFor="tire_maker">タイヤメーカー</label>
          <input
            id="tire_maker"
            type="text"
            {...registerTireState("tire_maker", { required: true })}
            className="border p-2 rounded"
          />
          {errorsTireState.tire_maker && <span>タイヤメーカーは必須です</span>}
        </div>
        <div className="my-2">
          <label htmlFor="tire_pattern">タイヤパターン</label>
          <input
            id="tire_pattern"
            type="text"
            {...registerTireState("tire_pattern", { required: true })}
            className="border p-2 rounded"
          />
          {errorsTireState.tire_pattern && (
            <span>タイヤパターンは必須です</span>
          )}
        </div>
        <div className="my-2">
          <label htmlFor="tire_size">タイヤサイズ</label>
          <input
            id="tire_size"
            type="text"
            {...registerTireState("tire_size", { required: true })}
            className="border p-2 rounded"
          />
          {errorsTireState.tire_size && <span>タイヤサイズは必須です</span>}
        </div>
        <div className="my-2">
          <label htmlFor="manufacture_year">製造年</label>
          <input
            id="manufacture_year"
            type="number"
            {...registerTireState("manufacture_year", { required: true })}
            className="border p-2 rounded"
          />
          {errorsTireState.manufacture_year && <span>製造年は必須です</span>}
        </div>
        <div className="my-2">
          <label htmlFor="air_pressure">空気圧</label>
          <input
            id="air_pressure"
            type="number"
            {...registerTireState("air_pressure", { required: true })}
            className="border p-2 rounded"
          />
          {errorsTireState.air_pressure && <span>空気圧は必須です</span>}
        </div>
        <div className="my-2">
          <label htmlFor="tire_state">タイヤの状態</label>
          <input
            id="tire_state"
            type="text"
            {...registerTireState("tire_state", { required: true })}
            className="border p-2 rounded"
          />
          {errorsTireState.tire_state && <span>タイヤの状態は必須です</span>}
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Save
        </button>
      </form>

      <form onSubmit={handleSubmitInspection(submit_Inspection)}>
        <h2 className="text-xl font-bold">整備項目</h2>
        <div>
          <div className="my-2">
            <label htmlFor="tire_inspection_state">タイヤの状態</label>
            <input
              id="tire_inspection_state"
              type="text"
              {...registerInspection("tire.state", { required: true })}
              className="border p-2 rounded"
            />
            {errorsInspection.tire?.state && (
              <span>タイヤの状態は必須です</span>
            )}

            <label htmlFor="tire_inspection_note">備考</label>
            <input
              type="text"
              id="tire_inspection_note"
              className="border p-2 rounded"
              {...registerInspection("tire.note", { required: false })}
            />
          </div>

          <div className="my-2">
            <label htmlFor="oil_inspection_state">オイルの状態</label>
            <input
              id="oil_inspection_state"
              type="text"
              className="border p-2 rounded"
              {...registerInspection("oil.state", { required: true })}
            />
            {errorsInspection.oil?.state && (
              <span>オイルの状態を入力してください</span>
            )}

            <label htmlFor="oil.exchange">交換</label>
            <input
              id="oil.exchange"
              type="text"
              className="border p-2 rounded"
              {...registerInspection("oil.exchange", { required: true })}
            />
            {errorsInspection.oil?.exchange && (
              <span>タイヤの交換を入力してください</span>
            )}

            <label htmlFor="oil_inspection_note">備考</label>
            <input
              id="oil_inspection_note"
              type="text"
              className="border p-2 rounded"
              {...registerInspection("oil.note", { required: false })}
            />
          </div>

          <div className="my-2">
            <label htmlFor="battery_inspection_state">バッテリーの状態</label>
            <input
              id="battery_inspection_state"
              type="text"
              className="border p-2 rounded"
              {...registerInspection("battery.state", { required: true })}
            />
            {errorsInspection.battery?.state && (
              <span>バッテリーの状態を入力してください</span>
            )}

            <label htmlFor="battery.exchange">交換</label>
            <input
              id="battery.exchange"
              type="text"
              className="border p-2 rounded"
              {...registerInspection("battery.exchange", { required: true })}
            />
            {errorsInspection.battery?.exchange && (
              <span>バッテリーの交換を入力してください</span>
            )}

            <label htmlFor="battery_inspection_note">備考</label>
            <input
              id="battery_inspection_note"
              type="text"
              className="border p-2 rounded"
              {...registerInspection("battery.note", { required: false })}
            />
          </div>

          <div className="my-2">
            <label htmlFor="wiper_inspection_state">ワイパーの状態</label>
            <input
              id="wiper_inspection_state"
              type="text"
              className="border p-2 rounded"
              {...registerInspection("wiper.state", { required: true })}
            />
            {errorsInspection.wiper?.state && <span>ワイパーの状態</span>}

            <label htmlFor="wiper_inspection_exchange">ワイパーの交換</label>
            <input
              id="wiper_inspection_exchange"
              type="text"
              className="border p-2 rounded"
              {...registerInspection("wiper.exchange", { required: true })}
            />
            {errorsInspection.wiper?.exchange && <span>ワイパーの交換</span>}

            <label htmlFor="wiper_inspection_note">備考</label>
            <input
              id="wiper_inspection_note"
              type="text"
              className="border p-2 rounded"
              {...registerInspection("wiper.note", { required: false })}
            />
          </div>

          <div>
            <label htmlFor="other">その他</label>
            <input
              id="other"
              type="text"
              className="border p-2 rounded"
              {...registerInspection("other", { required: false })}
            />
          </div>

          <div>
            <label htmlFor="state">状態</label>
            <input
              id="state"
              type="text"
              className="border p-2 rounded"
              {...registerInspection("state", { required: true })}
            />
            {errorsInspection.state && <span>状態は必須です</span>}
          </div>

          <div>
            <label htmlFor="memo_inspection_date">整備日</label>
            <input
              id="memo_inspection_date"
              type="date"
              className="border p-2 rounded"
              {...registerInspection("memo.inspection_date", {
                required: true,
              })}
            />
            {errorsInspection.memo?.inspection_date && (
              <span>整備日は必須です</span>
            )}

            <label htmlFor="memo_distance">走行距離</label>
            <input
              id="memo_distance"
              type="number"
              className="border p-2 rounded"
              {...registerInspection("memo.distance", { required: true })}
            />
            {errorsInspection.memo?.distance && <span>走行距離は必須です</span>}

            <label htmlFor="memo_next_theme">次回の整備</label>
            <input
              id="memo_next_theme"
              type="text"
              className="border p-2 rounded"
              {...registerInspection("memo.next_theme", { required: true })}
            />
            {errorsInspection.memo?.next_theme && (
              <span>次回の整備は必須です</span>
            )}
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          保存
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
