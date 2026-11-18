type AdminCollectionPageProps = {
  title: string;
  description: string;
  columns: string[];
  entity: string;
};

export function AdminCollectionPage({
  title,
  description,
  columns,
  entity,
}: AdminCollectionPageProps) {
  return (
    <div className="page-content">
      <div className="page-heading">
        <div>
          <p className="eyebrow">MARKETPLACE / {title.toUpperCase()}</p>
          <h1>{title}</h1>
          <p className="page-description">{description}</p>
        </div>
        <span className="date-chip">0 records</span>
      </div>
      <section className="panel collection-panel">
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                {columns.map((column) => <th key={column}>{column}</th>)}
              </tr>
            </thead>
          </table>
        </div>
        <div className="collection-empty">
          <span className="empty-mark" aria-hidden="true">⌕</span>
          <h2>No {entity} connected yet</h2>
          <p>Connect this screen to your Supabase {entity} table to start managing marketplace data.</p>
          <span className="schema-hint">Table mapping required</span>
        </div>
      </section>
    </div>
  );
}
