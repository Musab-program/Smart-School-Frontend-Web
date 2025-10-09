// import { getGuardianById } from "../main/api-providers";
// import EditGuardianForm from "@/app/main/userManagement/guardian/edit/EditGuardianForm";
// import { Guardian } from "@/types/guardian";

import { getRelation } from "@/lib/api";
import EditAddGuardianForm from "./EditAddGuardianForm";

export default async function GuardianPage({ searchParams }) {
  return (
    <div className="p-4">
      <EditAddGuardianForm />
    </div>
  );
}
