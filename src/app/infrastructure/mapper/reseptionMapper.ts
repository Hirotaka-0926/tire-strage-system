import { Car, Client, TaskOutput } from "@/app/domain/type/reception";

export const mapClientToSupabase = (client: Client) => ({
  ...client,
});

export const mapClientFromSupabase = (client: any): Client => ({
  id: client.id,
  client_name: client.client_name ?? "",
  client_name_kana: client.client_name_kana ?? "",
  address: client.address ?? "",
  post_number: client.post_number ?? "",
  phone: client.phone ?? "",
  notes: client.notes ?? "",
});

export const mapCarToSupabase = (car: Car) => ({
  ...car,
});

export const mapCarFromSupabase = (car: any): Car => ({
  id: car.id,
  car_model: car.car_model ?? "",
  car_number: car.car_number ?? "",
});

export const mapTaskToSupabase = (task: TaskOutput) => ({
  ...task,
});

