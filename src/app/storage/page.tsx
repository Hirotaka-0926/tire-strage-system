"use client";

import React, { useState } from "react";
import StorageList from "./StorageList";
import SearchStorage from "./SearchStorage";

const StoragePage: React.FC = () => {
  const [searchKey, setSearchKey] = useState<string>("id");
  const [searchValue, setSearchValue] = useState<string>("");

  return (
    <div>
      <SearchStorage
        searchKey={searchKey}
        setSearchKey={setSearchKey}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
      />
      <StorageList searchKey={searchKey} searchValue={searchValue} />
    </div>
  );
};

export default StoragePage;
