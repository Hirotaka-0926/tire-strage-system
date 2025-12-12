import {
  Car,
  Client,
  ClientWithExchangeHistory,
  CustomerMap,
  Season,
  StorageLogSummary,
} from "@/app/refactor/type";

export type SeasonSnapshot = {
  year: number;
  season: Season;
};

export const createCustomerReceptionService = () => {
  const createCustomerMap = (customers: Client[]): CustomerMap => {
    const map: CustomerMap = {};
    customers.forEach((customer) => {
      if (!customer.id) {
        return;
      }
      map[customer.id] = {
        ...customer,
        cars: customer.cars ? [...customer.cars] : undefined,
        exchangeHistory: customer.exchangeHistory
          ? [...customer.exchangeHistory]
          : undefined,
      };
    });
    return map;
  };

  const buildCustomersWithLogs = (
    initialCustomers: Client[],
    initialStorageLogs: StorageLogSummary[],
    thisSeason: SeasonSnapshot,
    lastSeason: SeasonSnapshot
  ): CustomerMap => {
    const targetCustomers: CustomerMap = createCustomerMap(initialCustomers);

    initialStorageLogs.forEach((log) => {
      const targetId = log.client_id;
      if (!targetId || !targetCustomers[targetId]) {
        return;
      }

      const customer = targetCustomers[targetId];
      const historyItem = {
        id: log.id,
        season: log.season,
        year: log.year,
        next_theme: log.next_theme,
      };

      customer.exchangeHistory = customer.exchangeHistory
        ? [...customer.exchangeHistory, historyItem]
        : [historyItem];

      if (log.car) {
        const exists =
          customer.cars?.some((car) => car.id === log.car?.id) ?? false;
        if (!exists) {
          customer.cars = customer.cars ? [...customer.cars, log.car] : [log.car];
        }
      }

      if (log.season === thisSeason.season && log.year === thisSeason.year) {
        customer.thisSeasonExchange = true;
      }
      if (log.season === lastSeason.season && log.year === lastSeason.year) {
        customer.lastSeasonExchange = true;
      }
    });

    return targetCustomers;
  };

  const filterCustomers = (
    customers: CustomerMap,
    searchTerm: string,
    filterStatus: string
  ): ClientWithExchangeHistory[] => {
    return Object.values(customers)
      .filter((customer, index, array) => {
        return array.findIndex((c) => c.id === customer.id) === index;
      })
      .filter((customer) => {
        const matchesSearch =
          (customer.client_name &&
            customer.client_name
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (customer.client_name_kana &&
            customer.client_name_kana
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (customer.post_number && customer.post_number.includes(searchTerm)) ||
          (customer.address &&
            customer.address.toLowerCase().includes(searchTerm.toLowerCase()));

        if (filterStatus === "this-season") {
          return matchesSearch && customer.thisSeasonExchange;
        } else if (filterStatus === "needs-contact") {
          return (
            matchesSearch &&
            customer.lastSeasonExchange &&
            !customer.thisSeasonExchange
          );
        } else if (filterStatus === "not-used") {
          return (
            matchesSearch &&
            !customer.lastSeasonExchange &&
            !customer.thisSeasonExchange
          );
        }

        return matchesSearch;
      });
  };

  const paginateCustomers = (
    customers: ClientWithExchangeHistory[],
    currentPage: number,
    itemsPerPage: number
  ) => {
    const totalPages = Math.ceil(customers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentCustomers = customers.slice(startIndex, endIndex);

    return { totalPages, startIndex, endIndex, currentCustomers };
  };

  const mergeCustomer = (
    customers: CustomerMap,
    customer: ClientWithExchangeHistory
  ): CustomerMap => {
    if (!customer.id) {
      return customers;
    }

    return {
      ...customers,
      [customer.id]: {
        ...(customers[customer.id] || {}),
        ...customer,
      },
    };
  };

  const removeCustomer = (
    customers: CustomerMap,
    customerId: number
  ): CustomerMap => {
    const updated = { ...customers };
    delete updated[customerId];
    return updated;
  };

  const attachCarToCustomer = (
    customers: CustomerMap,
    customerId: number,
    car: Car
  ): CustomerMap => {
    const target = customers[customerId];
    if (!target) {
      return customers;
    }

    const exists = target.cars?.some((storedCar) => storedCar.id === car.id);
    if (exists) {
      return customers;
    }

    const updatedCars = target.cars ? [...target.cars, car] : [car];

    return {
      ...customers,
      [customerId]: {
        ...target,
        cars: updatedCars,
      },
    };
  };

  const prepareTireExchange = (
    selectedCustomer: ClientWithExchangeHistory,
    selectedCar: Car
  ) => {
    if (!selectedCustomer.id) {
      throw new Error("顧客IDが不正です");
    }
    if (!selectedCar.car_model || !selectedCar.car_number) {
      throw new Error("車両情報が不足しています");
    }

    const existingCar =
      selectedCustomer.cars?.find((car) => car.id === selectedCar.id) ?? null;

    const carToPersist = existingCar ?? selectedCar;
    return { existingCar, carToPersist };
  };

  return {
    buildCustomersWithLogs,
    filterCustomers,
    paginateCustomers,
    mergeCustomer,
    removeCustomer,
    attachCarToCustomer,
    prepareTireExchange,
  };
};
