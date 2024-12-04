"use client";

import { Client } from "@/interface/interface";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const FormCustomer = () => {
  const [newClient, setNewClient] = useState<Client>({
    id: 0,
    client_name: "",
    client_name_kana: "",
    car_model: "",
    car_number: "",
    address: "",
    post_number: "",
    tire_state_id: 0,
    inspection_id: 0,
    created_at: new Date(),
  });

  const changeVariable = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setNewClient((prevClient) => ({
      ...prevClient,
      [name]: value,
    }));
  };

  const submitNewClient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(newClient);
    setNewClient({
      id: 0,
      client_name: "",
      client_name_kana: "",
      car_model: "",
      car_number: "",
      address: "",
      post_number: "",
      created_at: new Date(),
    });
  };

  return (
    <form
      onSubmit={submitNewClient}
      className="max-w-lg mx-auto p-4 bg-white shadow-lg rounded-lg"
    >
      <h2 className="text-2xl font-bold mb-4">新しい顧客を追加</h2>
      <div className="mb-4">
        <Label
          htmlFor="client_name"
          className="block text-gray-700 font-semibold mb-2"
        >
          顧客名
        </Label>
        <Input
          type="text"
          id="client_name"
          name="client_name"
          value={newClient.client_name}
          onChange={changeVariable}
          className="w-full px-3 py-2 rounded-md border border-black "
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="client_name_kana" className="block text-gray-700">
          顧客名（カナ）
        </Label>
        <Input
          type="text"
          id="client_name_kana"
          name="client_name_kana"
          value={newClient.client_name_kana}
          onChange={changeVariable}
          className="w-full px-3 py-2 rounded-md border border-black"
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="car_model" className="block text-gray-700">
          車種
        </Label>
        <Input
          type="text"
          id="car_model"
          name="car_model"
          value={newClient.car_model}
          onChange={changeVariable}
          className="w-full px-3 py-2 rounded-md border border-black"
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="car_number" className="block text-gray-700">
          車ナンバー
        </Label>
        <Input
          type="text"
          id="car_number"
          name="car_number"
          value={newClient.car_number}
          onChange={changeVariable}
          className="w-full px-3 py-2 rounded-md border border-black"
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="address" className="block text-gray-700">
          住所
        </Label>
        <Input
          type="text"
          id="address"
          name="address"
          value={newClient.address}
          onChange={changeVariable}
          className="w-full px-3 py-2 rounded-md border border-black"
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="post_number" className="block text-gray-700">
          郵便番号
        </Label>
        <Input
          type="text"
          id="post_number"
          name="post_number"
          value={newClient.post_number}
          onChange={changeVariable}
          className="w-full px-3 py-2 rounded-md border border-black"
        />
      </div>
      <div className="mb-4">
        <Button
          className="w-full bg-zinc-800 text-white hover:bg-zinc-700 py-2 rounded-md"
          type="submit"
        >
          顧客を追加
        </Button>
      </div>
    </form>
  );
};

export default FormCustomer;
