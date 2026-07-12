import { getSellerById } from "@/lib/actions/platform.actions";
import { notFound } from "next/navigation";
import EditSellerForm from "./edit-form";

export default async function EditSellerPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const seller = await getSellerById(params.id);

  if (!seller) {
    notFound();
  }

  return <EditSellerForm seller={seller} />;
}
