import Navbar from "@/components/navbar";
import { SubscriptionEntitlementQuery } from "@/convex/query.config";
import { combinedSlug } from "@/lib/utils";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const Layout = async ({ children }: Props) => {
  const { profileName, entitlement } = await SubscriptionEntitlementQuery();

  //   TODO : Remove Billing hardcoded path
//   if (!entitlement._valueJSON) {
//     // redirect(`/billing/${combinedSlug(profileName!)}`);
//     redirect(`/dashboard/${combinedSlug(profileName!)}`);
//   }

  return <div>
    <Navbar />
    {children}
    </div>;
};

export default Layout;
