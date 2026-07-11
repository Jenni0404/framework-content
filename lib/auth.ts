import { cookies } from "next/headers";
import { sql } from "@/lib/db";

// Résout la cliente courante à partir du cookie d'accès déjà posé par
// /api/access — même code que le middleware utilise pour la porte d'entrée,
// réutilisé ici pour savoir à qui appartient une requête sur la bibliothèque.
export async function getCurrentClientId(): Promise<number | null> {
  const code = cookies().get("fc_access")?.value;
  if (!code) return null;
  try {
    const rows = await sql`SELECT id FROM clients WHERE code_acces = ${code} LIMIT 1`;
    return rows.length > 0 ? (rows[0].id as number) : null;
  } catch {
    return null;
  }
}
