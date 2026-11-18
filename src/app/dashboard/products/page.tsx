import { AdminCollectionPage } from "@/components/admin-collection-page";

export default function ProductsPage() {
  return (
    <AdminCollectionPage
      title="Products"
      description="Manage the products available in your marketplace."
      columns={["Product", "Category", "Price", "Status"]}
      entity="products"
    />
  );
}
