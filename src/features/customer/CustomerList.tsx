import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Client } from "@/interface/interface";
import React, { useEffect } from "react";
import { getAllClients } from "@/utils/supabaseFunction";
import { useRouter } from "next/navigation";

interface Props {
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
}
const CustomerList: React.FC<Props> = ({ clients, setClients }) => {
  const router = useRouter();
  useEffect(() => {
    const getClients = async () => {
      const data = await getAllClients();

      setClients(data);
      console.log(data);
    };
    getClients();

    console.log(clients);
  }, []);
  return (
    <Table>
      <TableCaption></TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">id</TableHead>
          <TableHead>更新日</TableHead>
          <TableHead>顧客名</TableHead>
          <TableHead>顧客名（カナ）</TableHead>
          <TableHead>郵便番号</TableHead>
          <TableHead>住所</TableHead>
          <TableHead>車ナンバー</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.map((client) => (
          <TableRow
            key={client.id}
            onClick={() => router.push(`/customer/edit/${client.id}`)}
          >
            <TableCell className="font-medium">{client.id}</TableCell>
            <TableCell>{client.created_at.toLocaleDateString()}</TableCell>
            <TableCell>{client.client_name}</TableCell>
            <TableCell>{client.client_name_kana}</TableCell>
            <TableCell>{client.post_number}</TableCell>
            <TableCell>{client.address}</TableCell>
            <TableCell>{client.car_number}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
export default CustomerList;
