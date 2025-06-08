"use client";
import React, { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle } from "lucide-react";

interface Notification {
  type: "success" | "error" | "info";
  message: string;
}

export const useNotification = () => {
  const [notification, setNotification] = useState<Notification | null>(null);

  const showNotification = (
    type: "success" | "error" | "info",
    message: string
  ) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const NotificationComponent = () => (
    <React.Fragment>
      {notification && (
        <div className="fixed top-20 right-4  w-80 z-900 m-4">
          <Alert
            className={`${
              notification.type === "success"
                ? "border-green-500 bg-green-50"
                : notification.type === "error"
                ? "border-red-500 bg-red-50"
                : "border-blue-500 bg-blue-50"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : notification.type === "error" ? (
              <AlertCircle className="h-4 w-4 text-red-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-blue-600" />
            )}
            <AlertDescription
              className={`${
                notification.type === "success"
                  ? "text-green-800"
                  : notification.type === "error"
                  ? "text-red-800"
                  : "text-blue-800"
              }`}
            >
              {notification.message}
            </AlertDescription>
          </Alert>
        </div>
      )}
    </React.Fragment>
  );

  return {
    showNotification,
    NotificationComponent,
  };
};
