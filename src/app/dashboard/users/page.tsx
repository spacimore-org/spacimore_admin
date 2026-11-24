import { createClient } from "@/lib/supabase/server";

function formatJoinedDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(value));
}

export default async function UsersPage() {
  const supabase = await createClient();
  const { data: users, error } = await supabase
    .from("admin_user_directory")
    .select("id, email, first_name, last_name, email_confirmed_at, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Unable to load the admin user directory.", error);
  }

  return (
    <div className="page-content">
      <div className="page-heading">
        <div>
          <p className="eyebrow">MARKETPLACE / USERS</p>
          <h1>Users</h1>
          <p className="page-description">View and manage customer accounts.</p>
        </div>
        <span className="date-chip">{error ? "Unavailable" : `${users?.length ?? 0} records`}</span>
      </div>
      <section className="panel collection-panel">
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Email</th>
                <th>Joined</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {error ? (
                <tr>
                  <td className="collection-message" colSpan={4} role="alert">
                    {error.code === "PGRST205" || error.code === "42P01"
                      ? "The user directory is not set up yet. Apply the Supabase migration described in the admin README."
                      : "Users could not be loaded. Check the admin server logs and try again."}
                  </td>
                </tr>
              ) : users?.length ? (
                users.map((user) => {
                  const name = [user.first_name, user.last_name].filter(Boolean).join(" ");

                  return (
                    <tr key={user.id}>
                      <td>{name || user.email || "—"}</td>
                      <td>{user.email || "—"}</td>
                      <td>{formatJoinedDate(user.created_at)}</td>
                      <td>
                        <span className={`user-status${user.email_confirmed_at ? " user-status-verified" : ""}`}>
                          {user.email_confirmed_at ? "Verified" : "Pending"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="collection-message" colSpan={4}>
                    No users have registered yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
