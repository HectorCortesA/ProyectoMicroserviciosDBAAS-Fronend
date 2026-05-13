import { Outlet } from "react-router";

export function DashboardLayout() {
  return (
    <div className="min-h-screen w-full bg-[#232323] text-white font-sans overflow-x-hidden">
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-40"
        style={{
          backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <main className="relative z-10 size-full min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
