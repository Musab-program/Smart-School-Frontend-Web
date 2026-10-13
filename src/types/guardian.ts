import { User } from "./user";

export interface Guardian extends Omit<User, "id"> {
  id?: number | null;
  Id?: number | null;
  userId?: number;
  relationship?: string;
  relationTypeId?: number;
  relationType?: { id: number; name: string };
  secondryPhone?: string;
}


