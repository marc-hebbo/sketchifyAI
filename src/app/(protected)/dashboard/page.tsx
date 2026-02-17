import { SubscriptionEntitlementQuery } from "@/convex/query.config";
import { combinedSlug } from "@/lib/utils";
import { redirect } from "next/navigation";

// TODO : Remove Billing hardcoded path
const Page = async () => {
  const { entitlement, profileName } = await SubscriptionEntitlementQuery();
  const slug = combinedSlug(profileName || "guest");
  if (!entitlement || !entitlement._valueJSON) {
    // redirect(`/billing/${combinedSlug(profileName!)}`);
    redirect(`/dashboard/${slug}`);
  }
  redirect(`/dashboard/${slug}`);
};


export default Page;
