import {
  Car,
  Client,
  ClientWithExchangeHistory,
  CustomerFilterStatus,
  CustomerMap,
  StorageLogSummary,
} from "@/app/refactor/domain/type/reception";
import {
  createCustomerReceptionService,
  EMPTY_CUSTOMER,
  SeasonSnapshot,
} from "@/app/refactor/domain/service/reception/customerReceptionService";
import { CustomerReceptionRepository } from "./customerReceptionRepository";
import { createSupabaseReceptionRepository } from "@/app/refactor/infrastructure/reception/supabaseReceptionRepository";

export const createCustomerReceptionApplication = (
  repository: CustomerReceptionRepository = createSupabaseReceptionRepository()
) => {
  const service = createCustomerReceptionService();

  const buildCustomersWithLogs = (
    initialCustomers: Client[],
    initialStorageLogs: StorageLogSummary[],
    thisSeason: SeasonSnapshot,
    lastSeason: SeasonSnapshot
  ) =>
    service.buildCustomersWithLogs(
      initialCustomers,
      initialStorageLogs,
      thisSeason,
      lastSeason
    );

  const filterCustomers = (
    customers: CustomerMap,
    searchTerm: string,
    filterStatus: CustomerFilterStatus
  ) => service.filterCustomers(customers, searchTerm, filterStatus);

  const paginateCustomers = (
    customers: ClientWithExchangeHistory[],
    currentPage: number,
    itemsPerPage: number
  ) => service.paginateCustomers(customers, currentPage, itemsPerPage);

  const createCustomer = async (customer: Client) =>
    repository.saveCustomer(service.normalizeCustomer(customer));

  const updateCustomer = async (customer: ClientWithExchangeHistory) =>
    repository.saveCustomer(service.normalizeCustomer(customer));

  const deleteCustomer = async (customerId: number) =>
    repository.deleteCustomer(customerId);

  const registerTireExchange = async (
    selectedCustomer: ClientWithExchangeHistory,
    selectedCar: Car
  ) => {
    const { carToPersist } = service.prepareTireExchange(
      selectedCustomer,
      selectedCar
    );

    const carRecord = carToPersist.id
      ? carToPersist
      : await repository.saveCar(carToPersist);

    if (!carRecord.id) {
      throw new Error("車両IDの取得に失敗しました");
    }

    await repository.saveTask({
      client_id: selectedCustomer.id!,
      car_id: carRecord.id,
      status: "incomplete",
    });

    return { finalCar: carRecord };
  };

  const createEmptyCustomer = (): Client => ({ ...EMPTY_CUSTOMER });

  const mergeCustomer = (map: CustomerMap, customer: ClientWithExchangeHistory) =>
    service.mergeCustomer(map, customer);

  const removeCustomer = (map: CustomerMap, customerId: number) =>
    service.removeCustomer(map, customerId);

  const attachCarToCustomer = (map: CustomerMap, customerId: number, car: Car) =>
    service.attachCarToCustomer(map, customerId, car);

  return {
    buildCustomersWithLogs,
    filterCustomers,
    paginateCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    registerTireExchange,
    createEmptyCustomer,
    mergeCustomer,
    removeCustomer,
    attachCarToCustomer,
  };
};
