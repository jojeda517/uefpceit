// admin/DocenteLayout.js
"use client";
import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useSession } from "next-auth/react";

const DocenteLayout = ({ children }) => {
  const { data: session } = useSession();
  const roles = session?.user?.roles || [];

  return (
    <div className="docente-layout">
      <Header />
      <div className="main-content">
        {/* <Sidebar /> */}
        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DocenteLayout;
