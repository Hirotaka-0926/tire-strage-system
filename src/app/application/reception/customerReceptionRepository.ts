import { Car, Client, TaskStatus } from "@/app/domain/type/reception";

export interface CustomerReceptionRepository {
  saveCustomer: (client: Client) => Promise<Client>;
  deleteCustomer: (customerId: number) => Promise<void>;
  saveCar: (car: Car) => Promise<Car>;
  saveTask: (task: {
    client_id: number;
    car_id: number;
    status: TaskStatus;
  }) => Promise<void>;
}
