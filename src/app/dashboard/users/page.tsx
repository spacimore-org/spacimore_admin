import { AdminCollectionPage } from "@/components/admin-collection-page";

export default function UsersPage() {
  return (
    <AdminCollectionPage
      title="Users"
      description="View and manage customer accounts."
      columns={["Customer", "Email", "Joined", "Status"]}
      entity="users"
    />
  );
}
