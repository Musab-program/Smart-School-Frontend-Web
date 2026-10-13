export interface Specialty {
  id: number;
  name: string;
  qualification: string;
  // Compatibility aliases
  SpecialtyId?: number;
  SpecialtyName?: string;
  Qualification?: string;
  Description?: string;
}

export interface SpecialtyCreationPayload {
  name: string;
  qualification: string;
}

export interface SpecialtyUpdatePayload extends SpecialtyCreationPayload {
  id: number;
}