import { Bell, Menu, Search } from "lucide-react";

export default function AdminHeader({ setMobileOpen }) {
  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-5 lg:px-8">

      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center"
      >
        <Menu size={20} />
      </button>

      <div className="hidden md:flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 w-80">
        <Search size={18} className="text-gray-400" />

        <input
          placeholder="Search orders..."
          className="bg-transparent outline-none text-sm w-full"
        />
      </div>

      <div className="flex items-center gap-4 ml-auto">

        <button className="relative w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
          <Bell size={19} />

          <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full" />
        </button>

        <div className="hidden sm:block">
          <p className="text-sm font-bold">
            Admin
          </p>

          <p className="text-xs text-gray-400">
            Super Admin
          </p>
        </div>

        <div className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-black">
          A
        </div>

      </div>
    </header>
  );
}