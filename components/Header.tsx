type HeaderProps = {
  summary: {
    eyebrow: string;
    title: string;
    description: string;
    owner: string;
  };
  actions: string[];
};

export function Header({ summary, actions }: HeaderProps) {
  return (
    <header className="border-b border-white/10 bg-[#08090d]/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-300">
            {summary.eyebrow}
          </p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end">
            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              {summary.title}
            </h1>
            <span className="w-fit rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-zinc-400">
              Owner: {summary.owner}
            </span>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400">
            {summary.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {actions.map((action, index) => (
            <button
              key={action}
              className={`h-10 rounded-lg border px-4 text-sm font-medium transition ${
                index === 0
                  ? "border-cyan-300/40 bg-cyan-300 text-zinc-950 hover:bg-cyan-200"
                  : "border-white/10 bg-white/[0.04] text-zinc-200 hover:bg-white/[0.08]"
              }`}
              type="button"
            >
              {action}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
