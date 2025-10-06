export interface Guardian extends User {
  Id: number | null;
  relationship: string; // null يعني أن القيمة يمكن أن تكون فارغة
}
