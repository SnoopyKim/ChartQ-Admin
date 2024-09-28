import Link from "next/link";

export default function Sidebar() {
  return (
    <nav className="w-36 h-full flex flex-col">
      <Link href={"/"} className="text-black no-underline">
        <h1>ChartQ</h1>
      </Link>
    </nav>
  );
}
