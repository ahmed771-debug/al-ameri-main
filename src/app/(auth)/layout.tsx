import Image from "next/image";
import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="content">
            <div className="h-full">{children}</div>
          </div>
  );
}
