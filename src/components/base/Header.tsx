import Link from "next/link";

export const Header = () => {
  return (
    <header className="bg-zinc-800 text-white p-4 shadow-md sticky top-0 z-20 h-16">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">タイヤ保管管理システム</h1>
        <nav>
          <ul className="flex gap-4">
            <li>
              <Link href="/">ホーム</Link>
            </li>
            <li>
              <Link href="/customer">顧客リスト</Link>
            </li>
            <li>
              <Link href="/task">タイヤ交換予約リスト</Link>
            </li>
            <li>
              <Link href="/storage">保管庫一覧</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
