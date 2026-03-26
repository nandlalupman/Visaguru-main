export default function AdminDashboardLoading() {
  return (
    <section className="section-padding">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="skeleton h-10 w-56" />
            <div className="skeleton mt-3 h-4 w-40" />
          </div>
          <div className="skeleton h-10 w-24 rounded-full" />
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="surface-card rounded-2xl p-5" style={{ transform: "none" }}>
              <div className="skeleton h-3 w-24" />
              <div className="skeleton mt-3 h-8 w-16" />
            </div>
          ))}
        </div>

        <div className="mt-6 overflow-x-auto">
          <div className="surface-card min-w-full rounded-2xl p-6" style={{ transform: "none" }}>
            <div className="grid grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="skeleton h-4 w-full" />
              ))}
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="mt-4 grid grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <div key={j} className="skeleton h-4 w-full" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
