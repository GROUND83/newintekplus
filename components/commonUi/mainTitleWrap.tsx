import { ReactNode } from "react";
import { Button } from "../ui/button";
import Link from "next/link";

export function SubWrap({ children }: { children: ReactNode }) {
  return <div className="w-full flex flex-col">{children}</div>;
}

export function MainTitleWrap({ children }: { children: ReactNode }) {
  return (
    <div className="w-full bg-white py-3 border-b px-6 flex flex-row items-center justify-between h-[70px]">
      {children}
    </div>
  );
}

export function SubMenuWrap({ children }: { children: ReactNode }) {
  return (
    <div className="w-full bg-white py-3 border-b px-6 flex flex-row items-center gap-2 h-[50px]">
      {children}
    </div>
  );
}
export function Submenu({
  link,
  pathname,
  title,
  size,
}: {
  link: string;
  pathname: string;
  title: string;
  size: "default" | "xs" | "sm" | "lg" | "icon";
}) {
  return (
    <Button
      asChild
      variant={pathname === link ? "default" : "outline"}
      size={size}
    >
      <Link href={link}>{title}</Link>
    </Button>
  );
}
