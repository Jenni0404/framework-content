import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getCurrentClientId } from "@/lib/auth";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const clientId = await getCurrentClientId();
  if (!clientId) {
    return NextResponse.json({ ok: false, error: "Non autorisé." }, { status: 401 });
  }

  const id = Number(params.id);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ ok: false, error: "Identifiant invalide." }, { status: 400 });
  }

  try {
    // La condition client_id = ${clientId} garantit qu'on ne peut supprimer
    // que ses propres contenus, jamais ceux d'une autre cliente.
    await sql`DELETE FROM contenus_sauvegardes WHERE id = ${id} AND client_id = ${clientId}`;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Erreur serveur." }, { status: 500 });
  }
}
