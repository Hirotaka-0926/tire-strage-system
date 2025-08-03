"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Calendar, Database, Package } from "lucide-react";
import { cn } from "@/lib/utils";

export const Header = () => {
  const pathname = usePathname();

  const navigationItems = [
    { href: "/", icon: Home, label: "ホーム", exactMatch: true },
    { href: "/customer", icon: Users, label: "顧客リスト", exactMatch: false },
    {
      href: "/task",
      icon: Calendar,
      label: "予約リスト",
      exactMatch: false,
    },
    {
      href: "/storageLogs",
      icon: Database,
      label: "過去データ",
      exactMatch: false,
    },
    {
      href: "/emptyList",
      icon: Package,
      label: "保管庫",
      exactMatch: false,
    },
  ];

  const isActive = (href: string, exactMatch: boolean) => {
    if (exactMatch) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="bg-zinc-700 text-white p-4 shadow-md sticky top-0 z-20 h-16">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">タイヤ管理</h1>
        <nav>
          <ul className="flex gap-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href, item.exactMatch);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ease-in-out group",
                      active
                        ? "text-white shadow-lg transform scale-105"
                        : "hover:text-blue-300 hover:bg-zinc-600/50"
                    )}
                  >
                    {/* アクティブ時の背景グロー効果 */}

                    <Icon
                      size={18}
                      className={cn(
                        "transition-colors duration-300",
                        active
                          ? "text-white"
                          : "text-gray-300 group-hover:text-blue-300"
                      )}
                    />
                    <span
                      className={cn(
                        "font-medium transition-colors duration-300 hidden md:block ",
                        active
                          ? "text-white"
                          : "text-gray-200 group-hover:text-blue-300"
                      )}
                    >
                      {item.label}
                    </span>

                    {/* アクティブ時の下線 */}
                    {active && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-0.5 bg-blue-300 rounded-full" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
};
