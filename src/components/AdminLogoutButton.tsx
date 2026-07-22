"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function AdminLogoutButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.push("/admin/login");
        router.refresh();
      }}
      className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-soft hover:text-brand-600"
    >
      <LogOut className="h-3.5 w-3.5" /> Log out
    </button>
  );
}
