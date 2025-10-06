// import { getGuardianById } from "../main/api-providers";
// import EditGuardianForm from "@/app/main/userManagement/guardian/edit/EditGuardianForm";
// import { Guardian } from "@/types/guardian";

import { getGuardianAnalytics } from "../main/api-providers";
import EditAddGuardianForm from "./EditAddGuardianForm";

// export default async function Page({
//   searchParams,
// }: {
//   searchParams: { id?: string };
// }) {
//   const idParam = searchParams?.id;
//   const guardian: Guardian | null = idParam
//     ? await getGuardianById(Number(idParam))
//     : null;

//   return <EditGuardianForm initialGuardian={guardian} />;
// }

export default async function GuardianPage({ searchParams }) {
  const guar = await getGuardianAnalytics();
  return (
    <div className="p-4">
      <EditAddGuardianForm guardiansData={guar.guardians} />
    </div>
  );
}
