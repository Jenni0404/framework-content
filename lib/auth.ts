import { cookies } from "next/headers";
import { sql } from "@/lib/db";

// Sous ce seuil, l'API renvoie un avertissement à afficher côté client,
// avant que le solde tombe à 0 et bloque la génération.
export const LOW_BALANCE_THRESHOLD = 10;

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

export async function getGenerationsRestantes(clientId: number): Promise<number | null> {
  const rows = await sql`SELECT generations_restantes FROM clients WHERE id = ${clientId} LIMIT 1`;
  return rows.length > 0 ? (rows[0].generations_restantes as number) : null;
}

export function lowBalanceWarning(remaining: number): string | null {
  if (remaining <= 0) {
    return "Tu n'as plus de générations disponibles. Achète un pack de générations pour continuer.";
  }
  return remaining <= LOW_BALANCE_THRESHOLD
    ? `Il te reste ${remaining} génération${remaining > 1 ? "s" : ""}. Pense à prendre un pack de générations si tu veux continuer sans interruption.`
    : null;
}
