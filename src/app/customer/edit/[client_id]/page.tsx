"use client";
import { useParams } from "next/navigation";
import FormCustomer from "@/features/customer/FormCustomer";
import { Client, Task } from "@/interface/interface";
import { useForm } from "react-hook-form";
import {
  upsertClient,
  upsertTask,
  getSpecificClient,
} from "@/utils/supabaseFunction";
import { useRouter } from "next/navigation";

const ClientEditPage = () => {
  const clientId = useParams().client_id;
  const form = useForm<Client>();
  const router = useRouter();

  const schema = {
    form: form,
    fields: [
      { key: "client_name", label: "顧客名", type: "text", required: true },
      {
        key: "client_name_kana",
        label: "顧客名(カナ)",
        type: "text",
        required: true,
      },

      { key: "address", label: "住所", type: "text", required: true },
      { key: "post_number", label: "郵便番号", type: "text", required: true },
    ],
    submit: async (data: Client) => {
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
      const client: Client[] = await getSpecificClient(
        "id",
        clientId as string
      );
      form.reset(client[0]);
    }, // Add appropriate setDefault function
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{schema.title}</h1>
      <FormCustomer schema={schema} />
    </div>
  );
};

export default ClientEditPage;
