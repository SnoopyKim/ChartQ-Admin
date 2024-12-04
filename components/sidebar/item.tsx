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
  const isActive = pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "flex gap-2 items-center p-2 rounded hover:no-underline",
        isActive
          ? "text-secondary-foreground bg-secondary/50"
          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
      )}
    >
      <Icon name={icon} className="" />
      <span className="hover:no-underline">{title}</span>
    </Link>
  );
}
