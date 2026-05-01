"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Network,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/Logo";

const NAV_ITEMS = [
  {
    href: "/admin",
    label: "Visão Geral",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/admin/students",
    label: "Alunos",
    icon: Users,
    exact: false,
  },
  {
    href: "/admin/analytics",
    label: "Analytics",
    icon: BarChart3,
    exact: false,
  },
  {
    href: "/admin/networking",
    label: "Networking",
    icon: Network,
    exact: false,
  },
];

function NavItem({
  href,
  label,
  icon: Icon,
  exact,
}: (typeof NAV_ITEMS)[number]) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
        isActive
          ? "bg-brand-700 text-white shadow-sm"
          : "text-neutral-400 hover:text-white hover:bg-neutral-800"
      )}
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      {label}
    </Link>
  );
}

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex flex-col items-center gap-2 px-4 py-6 border-b border-neutral-800">
        <Logo width={140} priority />
        <p className="text-xs text-neutral-500">Admin Dashboard</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 p-4">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-neutral-600">
          Menu
        </p>
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-neutral-800 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all duration-150"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile trigger */}
      <div className="flex items-center h-14 px-4 border-b border-neutral-800 bg-neutral-900 lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="ml-3 text-sm font-semibold text-white">Leadrix IA Admin</span>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-64 bg-neutral-900">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-4 top-4 p-1.5 rounded-lg text-neutral-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 flex-shrink-0 flex-col bg-neutral-900 border-r border-neutral-800">
        <SidebarContent />
      </aside>
    </>
  );
}
