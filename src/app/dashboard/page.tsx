const metrics = [
  { label: "Total users", note: "Connect user source", value: "—" },
  { label: "Active products", note: "Connect product table", value: "—" },
  { label: "Orders", note: "Connect order table", value: "—" },
  { label: "Gross sales", note: "Connect order totals", value: "—" },
];

export default function DashboardPage() {
  return (
    <div className="page-content">
      <div className="page-heading">
        <div>
          <p className="eyebrow">OVERVIEW</p>
          <h1>Good morning.</h1>
          <p className="page-description">Here’s what’s happening across your marketplace.</p>
        </div>
        <div className="date-chip"><span className="live-dot" /> Live workspace</div>
      </div>

      <section className="metric-grid" aria-label="Marketplace metrics">
        {metrics.map((metric, index) => (
          <article className="metric-card" key={metric.label}>
            <div className="metric-card-top">
              <span className={`metric-icon metric-icon-${index}`} aria-hidden="true">
                {["U", "P", "O", "$"][index]}
              </span>
              <span className="metric-period">ALL TIME</span>
            </div>
            <p className="metric-value">{metric.value}</p>
            <h2>{metric.label}</h2>
            <p className="metric-note">{metric.note}</p>
          </article>
        ))}
      </section>

      <div className="dashboard-panels">
        <section className="panel activity-panel">
          <div className="panel-heading">
            <div>
              <h2>Recent activity</h2>
              <p>Updates from across your store</p>
            </div>
            <span className="panel-badge">LIVE</span>
          </div>
          <div className="panel-empty">
            <span className="empty-mark" aria-hidden="true">↗</span>
            <h3>Your activity will show up here</h3>
            <p>Connect marketplace tables to see recent orders, new customers, and product updates.</p>
          </div>
        </section>
        <section className="panel setup-panel">
          <p className="eyebrow">NEXT STEP</p>
          <h2>Connect your marketplace data</h2>
          <p>Authentication is shared with Spacemore. Add the Users, Products, and Orders table names and columns to connect live dashboard data.</p>
          <div className="setup-checklist">
            <span><i className="check-mark">✓</i> Shared Supabase sign-in</span>
            <span><i className="check-mark">✓</i> Admin role protection</span>
            <span><i className="pending-mark">•</i> Marketplace table mapping</span>
          </div>
        </section>
      </div>
    </div>
  );
}
