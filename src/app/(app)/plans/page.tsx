export const dynamic = "force-dynamic";

import { getPlansWithStudents } from "@/lib/db/plans";
import { PlansListClient } from "./plans-list-client";

export default async function PlansPage() {
  const plans = await getPlansWithStudents();

  return <PlansListClient plans={plans} />;
}
