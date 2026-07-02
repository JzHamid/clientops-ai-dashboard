import { navItems } from "@/lib/mock-data";

export function Sidebar() {
  return (
    <aside className="border-b border-white/10 bg-[#090b10]/95 px-4 py-4 lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:border-b-0 lg:border-r lg:px-5">
      <div className="flex items-center justify-between gap-4 lg:block">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg border border-cyan-400/30 bg-cyan-400/10 text-sm font-bold text-cyan-200">
            CO
          </div>
          <div>
            <p className="text-sm font-semibold text-white">ClientOps</p>
            <p className="text-xs text-zinc-500">AI Dashboard</p>
          </div>
        </div>

        <div className="hidden rounded-md border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-xs font-medium text-emerald-200 sm:block lg:mt-6 lg:inline-block">
          Mock data
        </div>
      </div>

      <nav
        aria-label="Dashboard navigation"
        className="mt-5 flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0"
      >
        {navItems.map((item) => (
          <a
            key={item.label}
            href="#"
            className={`flex min-w-fit items-center justify-between rounded-lg border px-3 py-2 text-sm transition ${
              item.active
                ? "border-cyan-400/30 bg-cyan-400/10 text-white"
                : "border-transparent text-zinc-400 hover:border-white/10 hover:bg-white/[0.04] hover:text-zinc-100"
            }`}
          >
            <span>{item.label}</span>
            {item.active ? (
              <span className="ml-4 hidden h-1.5 w-1.5 rounded-full bg-cyan-300 lg:block" />
            ) : null}
          </a>
        ))}
      </nav>

      <div className="mt-6 hidden rounded-lg border border-white/10 bg-white/[0.035] p-4 lg:block">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
          Workspace
        </p>
        <p className="mt-3 text-sm font-medium text-white">Portfolio build</p>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Single-page SaaS admin UI with mock client, project, and automation
          data.
        </p>
      </div>
    </aside>
  );
}
