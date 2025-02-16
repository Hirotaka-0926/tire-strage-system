"use client";
import { useParams } from "next/navigation";
import FormCustomer from "@/features/customer/FormCustomer";
import { Task, Car } from "@/interface/interface";
import { useForm } from "react-hook-form";
import {
  upsertClient,
  upsertTask,
  getCarFromStorage,
  getCarFromExchangeLogs,
} from "@/utils/supabaseFunction";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

const ClientEditCarPage = () => {
  const clientId = useParams().client_id;
  const form = useForm<Car>();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const [candidateCars, setCandidateCars] = useState<Car[]>(() => []);
  const [defaultValue, setDefaultValue] = useState<Car | null>();

  useEffect(() => {
    const getCandidate = async () => {
      const storageCandidate = await getCarFromStorage(Number(clientId));
      const logsCandidate = await getCarFromExchangeLogs(Number(clientId));
      const candidate = storageCandidate!.concat(logsCandidate!);
      setCandidateCars(candidate);
    };
    getCandidate();
  }, []);

  const schema = {
    form: form,
    fields: [
      { key: "car_model", label: "車種名", type: "text", required: true },

      {
        key: "car_number",
        label: "車のナンバー",
        type: "text",
        required: true,
      },
    ],
    submit: async (data: Car) => {
      try {
        console.log(data);
        const newRow = await upsertClient(data);

        const newTask: Task = {
          client_id: newRow[0].id,
          state: 1,
        };

        await upsertTask(newTask);
        router.push("/customer");
      } catch (e) {
        console.error("Unexpected error", e);
      }
    }, // Add appropriate submit function
    title: "顧客情報の編集",
    setDefault: async () => {
      form.reset(defaultValue!);
    }, // Add appropriate setDefault function
  };
  console.log(candidateCars);
  return (
    <div className="container mx-auto p-4">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogTitle>デフォルトバリューの選択</DialogTitle>
          <DialogDescription>
            整備する車は以下の候補ですか？ 無ければ新しく入力してください
          </DialogDescription>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {candidateCars.length &&
              candidateCars.map((car) => (
                <Card
                  key={car.id}
                  className={`cursor-pointer hover:shadow-lg transition-shadow duration-300 ${
                    defaultValue?.id === car.id
                      ? "border-2 border-blue-500"
                      : ""
                  }`}
                  onClick={() => setDefaultValue(car)}
                >
                  <CardHeader>
                    <CardTitle>{car.car_model}</CardTitle>
                    <CardDescription>{car.car_number}</CardDescription>
                  </CardHeader>
                  <CardContent></CardContent>
                </Card>
              ))}
            <Card
              key="null"
              className={`cursor-pointer hover:shadow-lg transition-shadow duration-300 ${
                !defaultValue ? "border-2 border-blue-500" : ""
              }`}
              onClick={() => setDefaultValue(null)}
            >
              <CardHeader>
                <CardTitle>候補に無い場合はこちらをクリック</CardTitle>
                <CardDescription>押したのち閉じてください</CardDescription>
              </CardHeader>
            </Card>
          </div>
          <DialogClose asChild>
            <Button className="mt-4" onClick={() => setIsDialogOpen(false)}>
              閉じる
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
      {!isDialogOpen && (
        <>
          <h1 className="text-2xl font-bold mb-4">{schema.title}</h1>
          <FormCustomer schema={schema} />
        </>
      )}
    </div>
  );
};

export default ClientEditCarPage;
