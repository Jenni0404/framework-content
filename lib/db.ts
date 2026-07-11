import { neon } from "@neondatabase/serverless";

// Ne jette jamais au chargement du module : une variable DATABASE_URL absente
// ou invalide doit faire échouer la requête qui l'utilise (capturée par son
// appelant), jamais toute l'app (middleware inclus, qui protège aussi les
// pages publiques).
export const sql = neon(process.env.DATABASE_URL ?? "postgres://invalid");
