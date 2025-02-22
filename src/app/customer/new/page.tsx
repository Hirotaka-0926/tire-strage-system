"use client";

import FormCustomer from "@/features/customer/FormCustomer";
import { Client, FormSchema } from "@/interface/interface";
import { useForm } from "react-hook-form";
import { upsertClient } from "@/utils/supabaseFunction";
import { useRouter } from "next/navigation";

const NewCustomer = () => {
  const form = useForm<Client>();
  const router = useRouter();

  const schema: FormSchema<Client> = {
    //以下formの設定
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
        const newRow = await upsertClient(data);
        const clientId = newRow[0].id;
        router.push(`/customer/edit/${clientId}/car`);
      } catch (e) {
        console.error("Unexpected error", e);
      }
    }, // Add appropriate submit function
    title: "New Customer",
    setDefault: () => {}, // Add appropriate setDefault function
  };

  return <FormCustomer schema={schema} />;
};

export default NewCustomer;
