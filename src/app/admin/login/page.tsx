import React from "react";
import AdminAuthModal from "@/components/ui/admin-auth-modal";

export const metadata = {
  title: "Admin Login | KabaadSe Operations",
  description: "Secure gateway for KabaadSe operations and logistics management.",
};

export default function AdminLoginPage() {
  return <AdminAuthModal standalonePage defaultOpen />;
}

