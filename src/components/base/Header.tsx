import Link from "next/link";

export const Header = () => {
  return (
    <header className="bg-zinc-800 text-white p-4 shadow-md sticky top-0">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Header</h1>
        <nav>
          <ul className="flex gap-4">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/customer">customer list</Link>
            </li>
            <li>
              <Link href="/task">task list</Link>
            </li>
            <li>
              <Link href="#">Contact</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
