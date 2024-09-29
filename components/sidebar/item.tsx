"use client";

import Link from "next/link";
import Icon, { IconType } from "../ui/icon";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";

export default function NavItem({
  href,
  title,
  icon,
}: {
  href: string;
  title: string;
  icon: IconType;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "flex gap-2 items-center p-2 rounded hover:no-underline",
        isActive
          ? "text-black bg-slate-100"
          : "text-slate-500 hover:text-black hover:bg-slate-100"
      )}
    >
      <Icon name={icon} className="" />
      <span className="hover:no-underline">{title}</span>
    </Link>
  );
}
