import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

export default function AdminLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">

      <AdminSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex-1 min-w-0">

        <AdminHeader
          setMobileOpen={setMobileOpen}
        />

        <main className="p-5 lg:p-8">
          {children}
        </main>

      </div>

    </div>
  );
}