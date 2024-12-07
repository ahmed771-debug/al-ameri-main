// import Header from "@/components/ui/Header";
import dynamic from "next/dynamic";
import React from "react";

const Header = dynamic(() => import("@/components/ui/Header"), { ssr: false });
interface HomeLayoutProps {
  children: React.ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <main>
      <Header />
      <div>{children}</div>
    </main>
  );
}
