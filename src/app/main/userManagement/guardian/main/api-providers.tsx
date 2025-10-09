import { getGuardian } from "@/lib/api";
import { Guardian } from "@/types/guardian";
import { Relation } from "@/types/relation";

export async function getGuardianById(
  guardianId: number
): Promise<Guardian | null> {
  try {
    const guardians = await getGuardian();
    return guardians.find((guardian) => guardian.userId === guardianId) || null;
  } catch (error) {
    console.error("خطأ في جلب بيانات المعلم:", error);
    return null;
  }
}

export async function getGuardianAnalytics() {
  try {
    const guardians: Guardian[] = await getGuardian();

    const totalGuardians = guardians.length;
    const activeGuardians = guardians.filter((t) => t.IsActive).length;
    const inactiveGuardians = guardians.filter((t) => !t.IsActive).length;

    return {
      guardians,
      totalGuardians,
      activeGuardians,
      inactiveGuardians,
      // إحصائيات إضافية
      activationRate:
        totalGuardians > 0
          ? ((activeGuardians / totalGuardians) * 100).toFixed(1)
          : "0",
      // لا يوجد متوسط أولياء أمور لكل تخصص هنا، لذا نعيد قيمة افتراضية
      averageGuardiansPerSpecialty: "0",
    };
  } catch (error) {
    console.error("خطأ في جلب بيانات المعلمين:", error);
    throw new Error("فشل في جلب بيانات المعلمين");
  }
}

import { getRelation as fetchRelations } from "@/lib/api";

export async function getRelation(): Promise<Relation[]> {
  try {
    const relations: Relation[] = await fetchRelations();
    return relations;
  } catch (error) {
    console.error("خطأ في جلب بيانات المعلمين:", error);
    throw new Error("فشل في جلب بيانات المعلمين");
  }
}