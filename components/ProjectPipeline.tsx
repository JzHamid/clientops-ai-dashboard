import { pipelineStages } from "@/lib/mock-data";
import { StatusBadge } from "@/components/StatusBadge";

export function ProjectPipeline() {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/20">
      <div className="flex flex-col gap-2 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-violet-300">
            Pipeline
          </p>
          <h2 className="mt-1 text-lg font-semibold text-white">
            Project pipeline
          </h2>
        </div>
        <p className="text-sm text-zinc-400">
          Stage view across discovery, build, review, and launch.
        </p>
      </div>

      <div className="grid gap-4 p-4 lg:grid-cols-4">
        {pipelineStages.map((stage) => (
          <article key={stage.title} className="rounded-lg border border-white/10 bg-[#0d1017] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-white">{stage.title}</h3>
                <p className="mt-1 text-xs text-zinc-500">
                  {stage.count} projects / {stage.value}
                </p>
              </div>
              <StatusBadge label={stage.title} tone={stage.tone} />
            </div>

            <div className="mt-5 space-y-4">
              {stage.projects.map((project) => (
                <div key={`${stage.title}-${project.name}`}>
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="font-medium text-zinc-200">{project.name}</span>
                    <span className="text-zinc-500">{project.progress}%</span>
                  </div>
                  <p className="mt-1 text-xs text-zinc-500">{project.client}</p>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-cyan-300"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
