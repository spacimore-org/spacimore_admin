import { AdminCollectionPage } from "@/components/admin-collection-page";

export default function OrdersPage() {
  return (
    <AdminCollectionPage
      title="Orders"
      description="Track customer orders and their fulfillment status."
      columns={["Order", "Customer", "Date", "Total", "Status"]}
      entity="orders"
    />
  );
}
