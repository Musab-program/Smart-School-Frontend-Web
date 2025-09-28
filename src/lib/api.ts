import { Role } from "@/types/role";
import { Specialty } from "@/types/specialty";
import { Teacher } from "@/types/teacher";

 async function fetchData<T>(fileName:string): Promise<T> {
  const response = await fetch(`/src/data/${fileName}`)

  if(!response.ok){
    throw new Error(`Failed to fetch ${fileName}`);
  }

  return response.json();
}

export async function getTeacher():Promise<Teacher[]> {
  return fetchData<Teacher[]>('teachers.json');
}

export async function getSpecialty() : Promise<Specialty[]> {
  return fetchData<Specialty[]>('specialties.json');
}

export async function getUsers(): Promise<User[]> {
  return fetchData<User[]>('users.json');
}


export async function getRoles(): Promise<Role[]> {
  return fetchData<Role[]>('role.json');
}
// export const api = {
//   get: async <T>(url: string): Promise<T> => {
//     const res = await fetch(url, { credentials: "include" })
//     if (!res.ok) throw new Error(`GET ${url} failed`)
//     return res.json()
//   },
//   post: async <T>(url: string, body: unknown): Promise<T> => {
//     const res = await fetch(url, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       credentials: "include",
//       body: JSON.stringify(body),
//     })
//     if (!res.ok) throw new Error(`POST ${url} failed`)
//     return res.json()
//   },
// }



