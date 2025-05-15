import React from "react";
import { Detail } from "./DetailTest";

interface StorageParams {
  storageId: string;
}

const StorageDetail = ({ params }: { params: StorageParams }) => {
  const storageId = params.storageId as string;
  return <Detail params={{ storageId }} />;
};

export default StorageDetail;
