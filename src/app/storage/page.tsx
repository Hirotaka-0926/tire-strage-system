"use client";

import React, { useState } from "react";
import StorageList from "./StorageList";
import SearchStorage from "./SearchStorage";

const StoragePage: React.FC = () => {
  const [searchKey, setSearchKey] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string | null>(null);

  return (
    <div>
      <SearchStorage
        searchKey={searchKey}
        setSearchKey={setSearchKey}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
      />
      <StorageList />
    </div>
  );
};

export default StoragePage;
