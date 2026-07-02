export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-[#08090d] px-4 py-10 text-zinc-100">
      <div className="mx-auto grid w-full max-w-7xl gap-4">
        <div className="h-16 animate-pulse rounded-lg border border-white/10 bg-white/[0.04]" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              className="h-32 animate-pulse rounded-lg border border-white/10 bg-white/[0.04]"
              key={item}
            />
          ))}
        </div>
        <div className="h-96 animate-pulse rounded-lg border border-white/10 bg-white/[0.04]" />
      </div>
    </main>
  );
}
