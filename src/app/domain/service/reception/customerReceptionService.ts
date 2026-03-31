import {
  Car,
  Client,
  ClientWithExchangeHistory,
  CustomerFilterStatus,
  CustomerMap,
  StorageLogSummary,
  Season,
} from "@/app/domain/type/reception";

export type SeasonSnapshot = {
  year: number;
  season: Season;
};

export const EMPTY_CUSTOMER: Client = {
  client_name: "",
  client_name_kana: "",
  post_number: "",
  address: "",
  phone: "",
  notes: "",
};

const normalizeText = (value: string): string => value.trim();
const asSafeString = (value: unknown): string =>
  typeof value === "string" ? value : "";

const normalizeCustomer = (customer: Client): Client => ({
  ...customer,
  client_name: normalizeText(customer.client_name),
  client_name_kana: normalizeText(customer.client_name_kana),
  post_number: normalizeText(customer.post_number),
  address: normalizeText(customer.address),
  phone: normalizeText(customer.phone),
  notes: normalizeText(customer.notes),
});

const createCustomerMap = (customers: Client[]): CustomerMap => {
  const map: CustomerMap = {};
  customers.forEach((customer) => {
    if (!customer.id) {
      return;
    }
    if (!map[customer.id]) {
      map[customer.id] = { ...customer };
    }
  });
  return map;
};

const buildCustomersWithLogs = (
  initialCustomers: Client[],
  initialStorageLogs: StorageLogSummary[],
  thisSeason: SeasonSnapshot,
  lastSeason: SeasonSnapshot
): CustomerMap => {
  const targetCustomers = createCustomerMap(initialCustomers);

  initialStorageLogs.forEach((log) => {
    const targetId = log.client_id;
    if (!targetId || !targetCustomers[targetId]) {
      return;
    }

    const target = targetCustomers[targetId];
    const history = {
      id: log.id,
      season: log.season,
      year: log.year,
      next_theme: log.next_theme,
    };

    target.exchangeHistory = target.exchangeHistory
      ? [...target.exchangeHistory, history]
      : [history];

    if (log.car) {
      const exists = target.cars?.some((car) => car.id === log.car?.id);
      if (!exists) {
        target.cars = target.cars ? [...target.cars, log.car] : [log.car];
      }
    }

    if (log.season === thisSeason.season && log.year === thisSeason.year) {
      target.thisSeasonExchange = true;
    }
    if (log.season === lastSeason.season && log.year === lastSeason.year) {
      target.lastSeasonExchange = true;
    }
  });

  return targetCustomers;
};

const filterCustomers = (
  customers: CustomerMap,
  searchTerm: string,
  filterStatus: CustomerFilterStatus
): ClientWithExchangeHistory[] => {
  return Object.values(customers)
    .filter((customer, index, array) => {
      return array.findIndex((target) => target.id === customer.id) === index;
    })
    .filter((customer) => {
      const loweredTerm = searchTerm.toLowerCase();
      const name = asSafeString(customer.client_name).toLowerCase();
      const kana = asSafeString(customer.client_name_kana).toLowerCase();
      const postNumber = asSafeString(customer.post_number);
      const address = asSafeString(customer.address).toLowerCase();
      const matchesSearch =
        name.includes(loweredTerm) ||
        kana.includes(loweredTerm) ||
        postNumber.includes(searchTerm) ||
        address.includes(loweredTerm);

      if (filterStatus === "this-season") {
        return matchesSearch && customer.thisSeasonExchange;
      }
      if (filterStatus === "needs-contact") {
        return (
          matchesSearch &&
          customer.lastSeasonExchange &&
          !customer.thisSeasonExchange
        );
      }
      if (filterStatus === "not-used") {
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

  return {
    totalPages,
    startIndex,
    endIndex,
    currentCustomers: customers.slice(startIndex, endIndex),
  };
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
      ...customers[customer.id],
      ...customer,
    },
  };
};

const removeCustomer = (
  customers: CustomerMap,
  customerId: number
): CustomerMap => {
  const next = { ...customers };
  delete next[customerId];
  return next;
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

  const exists = target.cars?.some((targetCar) => targetCar.id === car.id);
  if (exists) {
    return customers;
  }

  return {
    ...customers,
    [customerId]: {
      ...target,
      cars: target.cars ? [...target.cars, car] : [car],
    },
  };
};

const prepareTireExchange = (
  selectedCustomer: ClientWithExchangeHistory,
  selectedCar: Car
) => {
  if (!selectedCustomer.id) {
    throw new Error("顧客IDは必須です");
  }
  if (!selectedCar.car_model || !selectedCar.car_number) {
    throw new Error("車のモデルとナンバーは必須です");
  }

  const existingCar =
    selectedCustomer.cars?.find((car) => car.id === selectedCar.id) ?? null;

  return { carToPersist: existingCar ?? selectedCar };
};

export const createCustomerReceptionService = () => {
  return {
    buildCustomersWithLogs,
    filterCustomers,
    paginateCustomers,
    normalizeCustomer,
    mergeCustomer,
    removeCustomer,
    attachCarToCustomer,
    prepareTireExchange,
  };
};
