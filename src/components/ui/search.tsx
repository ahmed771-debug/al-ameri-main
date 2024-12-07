"use client";

import { useAppSelector } from "@/redux/hooks";
import React from "react";
import SearchTrainer from "../Role/Trainer/searchTrainer";
import SearchUser from "../Role/User/userTrainer";

const Page = () => {
  const { accountType } = useAppSelector((state) => ({
    accountType: state.AccountType.data,
  }));

  return <>{accountType === "TRAINER" ? <SearchTrainer /> : <SearchUser />}</>;
};

export default Page;
