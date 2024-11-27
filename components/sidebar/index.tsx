import Link from "next/link";
import SignOutButton from "../ui/button/sign-out";
import { ChartColumn } from "lucide-react";
import NavItem from "./item";

export default function Sidebar() {
  return (
    <nav className="h-screen flex flex-col p-4 bg-white border-r border-slate-200 rounded-e-2xl">
      <Link href={"/"} className="text-black hover:no-underline">
        <h1 className="text-4xl">ChartQ</h1>
      </Link>
      <div className="flex mt-4 flex-1 flex-col items-stretch gap-2">
        <NavItem href="/dashboard" icon={"chart-column"} title="대시보드" />
        <NavItem href="/users" icon={"users"} title="사용자 관리" />
        <NavItem href="/study" icon={"library"} title="차트자료 관리" />
        <NavItem href="/tag" icon={"tag"} title="태그 관리" />
      </div>
      <div className="">
        <SignOutButton />
      </div>
    </nav>
  );
}
