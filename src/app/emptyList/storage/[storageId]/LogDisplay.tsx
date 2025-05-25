import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getLogsByStorageId } from "@/utils/supabaseFunction";
import { StorageLogInput } from "@/utils/interface";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Car, Ruler, Calendar, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const LogDisplay = () => {
  const params = useParams();
  const storageId = params?.storageId as string;
  const [logs, setLogs] = useState<StorageLogInput[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const data = await getLogsByStorageId(storageId);
      if (data && data.length > 0) {
        setLogs(data);
      }
    };

    fetchLogs().catch((error) => {
      console.error("Error fetching logs:", error);
    });
  }, []);

  return (
    <React.Fragment>
      <h2 className="text-lg font-semibold mb-3">
        過去の保管庫データ ({logs.length})
      </h2>
      <div>
        {logs.map((log, index) => (
          <Card
            key={index}
            className="border-2 border-dashed border-yellow-500/50 bg-yellow-50/50"
          >
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {log.client.client_name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-sm">
                      {log.client.client_name}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {log.client.address}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="bg-yellow-100">
                  未割当
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Package className="h-3 w-3" />
                    <span className="font-medium">{log.state.tire_maker} </span>
                  </div>
                  <span>{log.state.tire_size}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Car className="h-3 w-3" />
                    <span>{log.car.car_model}</span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {log.car.car_number}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Ruler className="h-3 w-3" />
                    <span>溝: {log.state.tire_inspection?.state}mm</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{log.state.tire_inspection?.state}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <div className="text-xs text-muted-foreground w-full text-center space-y-1">
                <p>ドラッグしてテスト位置に割り当て</p>
              </div>
            </CardFooter>
          </Card>
        ))}
        {logs.length === 0 && (
          <div className="text-center p-4 text-muted-foreground">
            <p>未割当のタイヤはありません</p>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default LogDisplay;
