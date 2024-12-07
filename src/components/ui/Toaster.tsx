"use client";
import React from "react";
import { NotificationContainer } from "react-notifications";
import "react-notifications/lib/notifications.css";

interface ToasterProps {
  children: React.ReactNode;
}

const ToasterContainer: React.FC<ToasterProps> = ({ children }) => {
  return (
    <div>
      {children}
      <NotificationContainer />
    </div>
  );
};
export default ToasterContainer;
