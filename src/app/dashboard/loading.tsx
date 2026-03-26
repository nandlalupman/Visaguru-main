export default function DashboardLoading() {
  return (
    <section className="section-padding">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="skeleton h-10 w-64" />
            <div className="skeleton mt-3 h-4 w-96" />
          </div>
          <div className="skeleton h-10 w-24 rounded-full" />
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="surface-card rounded-2xl p-5" style={{ transform: "none" }}>
              <div className="skeleton h-3 w-24" />
              <div className="skeleton mt-3 h-8 w-16" />
            </div>
          ))}
        </div>

        <div className="mt-8 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="surface-card rounded-2xl p-5" style={{ transform: "none" }}>
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="skeleton h-4 w-48" />
                  <div className="skeleton mt-2 h-3 w-32" />
                </div>
                <div className="flex gap-2">
                  <div className="skeleton h-6 w-16 rounded-full" />
                  <div className="skeleton h-6 w-16 rounded-full" />
                </div>
              </div>
              <div className="skeleton mt-4 h-20 w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
