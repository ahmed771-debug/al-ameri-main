import Image from "next/image";
import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="min-h-screen flex justify-around items-center">
      <div
        className="grid grid-cols-1 lg:py-3  lg:grid-cols-2 lg:gap-32 w-full  lg:h-[100vh] heights"
        // style={{ height: "100vh" }}-
      >
        <div className="flex justify-center items-center md:mx-auto">
          <div className="content">
            <div className="h-full">{children}</div>
          </div>
        </div>
        <div className="banner ">
          <div className=" relative lg:h-[100%] lg:w-[100%] ">
            <Image
              src="/banner.png"
              fill={true}
              alt="Banner"
              // className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
