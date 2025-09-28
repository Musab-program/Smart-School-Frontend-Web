export interface Teacher extends User {
    Id: number | null; // null يعني أن القيمة يمكن أن تكون فارغة
    SpecialtyId: number;
    Salary: number;
  }

 