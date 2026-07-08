// Portage fidèle de la logique métier de "PACK_GABARITS_PROTOTYPE_IA (1).html"
// (balise <script>, IIFE) : ROLES, SHARED_RULES, CTA_INFO, storyTunnels,
// et la construction des prompts system/user pour les deux étapes du moteur.

export type Role = [
  id: string,
  nom: string,
  description: string,
  registre: string,
  biais: string,
  emotion: string,
  structureSpecifique: string
];

export type Objectif = "ATTRACTION" | "CONNEXION" | "CONVERSION";
export type Format = "Carrousel" | "Reel" | "Story";
export type ReelType = "court" | "parle";
export type SujetMode = "idee" | "inspire";

export const ROLES: Record<Objectif, Role[]> = {
  ATTRACTION: [
    ["AT1", "Contradiction d'une croyance", "Affirmer l'inverse du consensus de la niche.", "tu", "Dissonance cognitive", "Remise en question, surprise", ""],
    ["AT2", "Vérité qui dérange", "Réalité inconfortable que la cible évite de s'avouer.", "tu", "Biais d'évitement (on esquive ce qu'on sait déjà)", "Malaise reconnu, soulagement d'être vue", ""],
    ["AT3", "Prise de position polarisante", "Point de vue tranché, sans \"ça dépend\".", "mixte", "Effet de tribu (adhésion à un camp)", "Adhésion forte ou friction assumée", ""],
    ["AT4", "Chiffre/stat surprenante", "Nombre qui casse une croyance — jamais inventé.", "tu", "Ancrage numérique", "Étonnement", ""],
    ["AT5", "Mécanisme contre-intuitif", "Pourquoi la réponse \"logique\" ne marche pas.", "mixte", "Biais de simplicité (on croyait la solution évidente)", "Curiosité", ""],
    ["AT6", "Avant/après factuel", "Deux réalités côte à côte, sans offre, sans émotion ajoutée.", "tu", "Comparaison sociale", "Espoir projeté", "Slides alternées strictes : une slide \"avant\", la suivante \"après\", même structure de phrase des deux côtés pour que le contraste saute aux yeux — jamais un récit continu."],
    ["AT7", "Question rhétorique qui frappe", "Une question où la cible répond \"oui\" en tête.", "tu", "Auto-persuasion (réponse interne immédiate)", "Reconnaissance instantanée", ""],
    ["AT8", "Tendance / actu commentée", "Avis tranché sur une tendance fournie, jamais inventée.", "mixte", "Effet de récence (l'actualité crée une urgence de lecture)", "Appartenance à la conversation du moment", ""],
    ["AT9", "Liste de vérités", "\"5 choses que personne ne dit sur X\".", "tu", "Effet de complétude (une liste paraît exhaustive)", "Validation", "Une vérité numérotée par slide, chacune formulée comme une affirmation courte et autonome — pas de fil narratif entre les slides, chacune doit pouvoir se lire seule."],
    ["AT10", "Portrait de la cible", "La décrire si précisément qu'elle dit \"c'est moi\".", "tu", "Effet miroir / identification", "Sentiment d'être vue, comprise", ""],
    ["AT11", "Nouvelle perspective / et si", "Ouvrir un angle jamais envisagé.", "mixte", "Réévaluation cognitive", "Ouverture, curiosité", ""],
    ["AT12", "Boucle de curiosité", "Créer un gap d'info à combler.", "tu", "Effet Zeigarnik (tension d'une info incomplète)", "Impatience, envie de savoir", ""],
    ["AT13", "Contenu utile sauvegardable", "Checklist ou étapes concrètes qu'on veut relire plus tard — pas un simple constat.", "tu", "Effet checklist / utilité perçue", "Soulagement, contrôle retrouvé", "Étapes numérotées, chacune une action concrète à faire, pas une observation — le contenu doit ressembler à une checklist qu'on coche, pas à un article."],
    ["AT14", "L'ennemi commun", "\"Le vrai problème c'est X, pas toi\".", "tu", "Biais de groupe (union contre une cause commune)", "Soulagement de ne pas être fautive", ""],
    ["AT15", "Relatable / tag-a-friend", "Observation hyper-spécifique.", "tu", "Contagion sociale", "Complicité, amusement", ""],
  ],
  CONNEXION: [
    ["CN1", "Storytelling / scène vécue", "Scène unique et précise, arc tu→je→tu.", "je", "Transportation narrative (immersion dans l'histoire)", "Empathie", ""],
    ["CN2", "Arc de transformation", "Avant/pendant/maintenant, résultat vécu.", "je", "Projection (on s'imagine dans le \"après\")", "Espoir", "3 temps explicites et distincts, un par groupe de slides : AVANT (l'état de départ précis) → PENDANT (le moment de bascule) → MAINTENANT (l'état actuel) — les 3 doivent être nommés clairement, pas fondus dans un récit flou."],
    ["CN3", "Miroir / nommer la douleur", "Nommer la douleur exacte, sans l'édulcorer.", "tu", "Validation émotionnelle", "Soulagement d'être comprise", ""],
    ["CN4", "Recadrage / modèle mental", "Croyance répandue → recadrage (pilier valeur/éducatif).", "mixte", "Dissonance cognitive résolue", "Clarté, déclic", "Structure en 2 temps nets : la croyance telle qu'elle est vraiment formulée dans la tête de la cible, puis le recadrage — jamais fondus dans la même phrase."],
    ["CN5", "Anecdote du quotidien", "Scène ordinaire qui fait écho.", "je", "Familiarité (mere-exposure)", "Reconnaissance douce", ""],
    ["CN6", "Ce qui a changé mon approche", "Déclic personnel honnête.", "je", "Autorité vécue (crédibilité par l'expérience)", "Confiance", ""],
    ["CN7", "Coulisses / authenticité", "L'envers du décor, pas juste le résultat.", "je", "Effet de transparence", "Proximité", ""],
    ["CN8", "Doute réel surmonté", "Un vrai doute + comment traversé.", "je", "Normalisation", "Réconfort", ""],
    ["CN9", "Erreur / échec partagé", "Vulnérabilité utile, sans morale forcée.", "je", "Pratfall effect (on apprécie qui admet ses erreurs)", "Sympathie", ""],
    ["CN10", "Valeurs / opinion assumée", "Conviction personnelle — l'intimité.", "je", "Cohérence identitaire", "Adhésion", ""],
    ["CN11", "Bilan honnête", "Avancées ET blocages ensemble.", "je", "Authenticité perçue", "Confiance", ""],
    ["CN12", "Preuve à la taille de son état réel", "Preuve adaptée quand on est petite — filet anti-fabrication officiel, utilisé automatiquement en secours si aucune donnée réelle n'est fournie pour un rôle qui en réclame une.", "je", "Authenticité proportionnée (une preuve modeste mais vraie rassure plus qu'une preuve exagérée)", "Confiance sincère", ""],
    ["CN13", "Lettre à soi-même", "S'adresser à la version d'avant, à un moment précis et daté.", "je", "Distance temporelle (le conseil à soi-même devient universel)", "Tendresse, identification", "Adressée explicitement à un \"toi\" du passé à un moment précis (ex. \"à la moi d'il y a 2 ans\") — pas un conseil général déguisé en lettre."],
    ["CN14", "Ce que j'aurais voulu qu'on me dise", "Vérité comprise tard.", "mixte", "Effet de révélation tardive", "Gratitude", ""],
    ["CN15", "Célébration d'une petite victoire", "Joie partagée, pas un bilan, sans surjeu.", "je", "Renforcement positif partagé", "Joie, fierté partagée", ""],
    ["CN16", "Je ne sais pas encore", "Incertitude en cours, non résolue.", "je", "Humanisation (l'imperfection crédibilise)", "Complicité", ""],
    ["CN17", "Réponse à la communauté", "Répondre publiquement à une vraie question posée — format feed, pas story.", "mixte", "Réciprocité (répondre publiquement valorise qui a posé la question)", "Reconnaissance, appartenance", "La question réelle citée entre guillemets en ouverture, puis la réponse développée — jamais une réponse sans rappeler la question posée."],
    ["CN18", "Origine / mission", "Le \"pourquoi j'ai commencé\" — si vrai et précis.", "je", "Cohérence narrative", "Attachement", ""],
  ],
  CONVERSION: [
    ["CV2", "Démonstration concrète", "Montrer l'offre en action, étape par étape.", "tu", "Preuve par la démonstration (moins abstrait = plus crédible)", "Confiance rationnelle", ""],
    ["CV3", "Objection + réponse", "LA objection principale démolie depuis le vécu.", "tu", "Réduction de la dissonance pré-achat", "Soulagement", "2 temps par slide ou par paire de slides : l'objection formulée EXACTEMENT comme la cible la penserait (entre guillemets, à la première personne), puis la réponse — jamais résumée en une seule phrase neutre."],
    ["CV5", "Comparaison avec / sans l'offre", "Vie avant/après — factuel.", "tu", "Aversion à la perte", "Motivation", "Slides strictement alternées \"Sans l'offre : ...\" / \"Avec l'offre : ...\", même structure de phrase des deux côtés — jamais un paragraphe qui mélange les deux."],
    ["CV6", "Vente directe assumée", "Prix, comment l'avoir. CTA direct.", "tu", "Effet de simplicité (clarté = confiance)", "Sécurité", ""],
    ["CV7", "Urgence réelle", "Raison honnête d'agir — jamais fausse rareté.", "tu", "Rareté", "Urgence légitime", ""],
    ["CV8", "FAQ offensive", "3-5 objections fréquentes en un post.", "tu", "Réduction de l'incertitude", "Réassurance", "1 objection par slide, écrite entre guillemets comme une vraie question qu'on pose, suivie directement de la réponse sur la même slide — jamais une simple liste de sujets."],
    ["CV10", "Relance douce", "Pour celles qui ont regardé sans acheter.", "tu", "Effet de rappel (exposition répétée)", "Permission", ""],
    ["CV11", "Réassurance post-achat", "Fidéliser et générer du bouche-à-oreille chez celles qui ont déjà acheté.", "je", "Réduction de la dissonance post-achat", "Sérénité, fierté du choix fait", ""],
    ["CV12", "Pour qui / pas pour qui", "Qualification — auto-sélection.", "tu", "Auto-catégorisation", "Appartenance ou soulagement d'exclusion", "Structure OBLIGATOIRE en 2 blocs distincts, jamais un récit : un bloc \"C'est pour toi si...\" avec 3-4 puces courtes, puis un bloc \"C'est pas pour toi si...\" avec 3-4 puces courtes. Chaque puce commence par un verbe ou une situation concrète, pas une généralité."],
    ["CV13", "Valeur / contenu de l'offre", "Empilement de valeur qui justifie le prix.", "tu", "Ancrage de valeur", "Justification rationnelle", "Une slide par élément inclus dans l'offre, chacune avec l'élément + ce qu'il apporte concrètement — empilement visible, pas un paragraphe descriptif."],
    ["CV14", "Mécanisme unique", "Pourquoi ça marche là où le reste échoue.", "mixte", "Différenciation perçue", "Confiance dans la méthode", ""],
    ["CV15", "Coût de l'inaction", "Ce que coûte le statu quo.", "tu", "Aversion à la perte", "Urgence", ""],
    ["CV16", "Réduction du risque", "Réversibilité — jamais garantie en dur.", "mixte", "Réduction de l'incertitude perçue", "Sécurité", ""],
    ["CV1", "Preuve sociale directe", "Résultat client réel — nécessite une vraie donnée.", "mixte", "Preuve sociale", "Confiance par imitation", ""],
    ["CV4", "Résultat chiffré + mécanisme", "Nécessite une vraie donnée.", "je", "Ancrage numérique + preuve sociale", "Aspiration", ""],
    ["CV9", "Témoignage structuré", "Avant/problème/solution/résultat — nécessite une vraie donnée.", "je", "Preuve sociale narrative", "Identification, confiance", "4 temps stricts et nommés, un par slide ou groupe : AVANT → PROBLÈME → SOLUTION → RÉSULTAT — jamais fondus."],
  ],
};

export const CREDIBILITE: Record<string, string> = {
  "Formation en affiliation / MRR": "elle vend une offre qu'elle a elle-même suivie → crédibilité = son propre parcours",
  "Ma propre formation": "elle l'a créée → crédibilité = son expertise + résultats de ses élèves",
  "Coaching": "vente de proximité → crédibilité = transformation client + sa présence",
  "Accompagnement": "vente de proximité → crédibilité = transformation client + sa présence",
  "SaaS / outil en ligne": "vente de démonstration → crédibilité = cas d'usage + avant/après concrets",
  "Service": "vente de confiance → crédibilité = portfolio + processus + témoignages",
  "Produit digital": "vente d'impulsion raisonnée → crédibilité = aperçu + preuve d'utilité",
  "Autre": "crédibilité depuis son vécu réel, adaptée au contexte donné",
};

// Règles partagées par les deux appels — anti-patterns et gradient réels (ELLEA_reference_maitre_carrousels.md)
export const SHARED_RULES = `RÈGLE DE LANGUE, NON NÉGOCIABLE : français impeccable, zéro faute de grammaire, de conjugaison ou d'accord. Relis chaque phrase mentalement avant de l'écrire. Jamais de phrase coupée ou bancale — une phrase incomplète est pire qu'une phrase courte.

RÈGLE DE DATE : nous sommes en juillet 2026. N'invente jamais une actualité, une fonctionnalité ou un contexte qui contredit cette date.

RÈGLE — JAMAIS DE SOURCE INVENTÉE : ne cite jamais un nom d'étude, d'institut ou d'entreprise ("une étude HubSpot", "selon une enquête de X") avec un chiffre précis si cette source n'a pas été fournie explicitement dans le contexte donné plus bas. C'est une fabrication qui expose la créatrice à citer une fausse source publiquement — bien plus grave qu'un chiffre vague. Si tu veux illustrer un ordre de grandeur sans donnée réelle, formule-le comme une observation qualitative ("la plupart des...", "dans mon expérience...") jamais comme une statistique sourcée.

⚠️ IMPORTANT : "impeccable" ne veut PAS dire "soutenu" ou "littéraire". Une phrase peut être 100% relâchée, orale, familière, pleine de tournures parlées — et rester grammaticalement parfaite en même temps (bon accord, bonne conjugaison, pas de mot inventé). Ne confonds jamais "corriger les fautes" avec "rendre le texte plus propre/plus poli" — ce sont deux choses différentes. Si un échantillon de voix est fourni plus bas, il prime toujours sur toute tentation de lisser le style.

PIÈGES FRÉQUENTS À VÉRIFIER SYSTÉMATIQUEMENT AVANT DE RÉPONDRE (ce sont les erreurs les plus courantes en français familier écrit, sois particulièrement vigilant dessus) :
- Accord en genre de l'adjectif avec le nom : "compte" est masculin → "un gros compte" / "des gros comptes" (jamais "grosse(s) comptes"). Vérifie systématiquement le genre du nom avant d'accorder l'adjectif.
- Verbes pronominaux inventés : "galérer" ne se pronominalise pas ("tu galères", jamais "tu te galères" ni "avant de te galérer").
- Accord sujet/verbe même dans les phrases courtes et familières.
- Ne mélange jamais deux structures de phrase à mi-chemin.

RÈGLE DE TON, NON NÉGOCIABLE — évite absolument le style lisse/générique qu'on reconnaît dans le contenu IA par défaut :
- Interdits stricts : "il est important de", "en effet", "de plus", "dans le monde d'aujourd'hui", "n'hésitez pas à", "que ce soit... ou...", toute phrase parfaitement symétrique et équilibrée qui ne prend aucun risque.
- Préfère des phrases courtes, parfois volontairement incomplètes pour l'effet oral. Coupe des phrases là où une vraie personne couperait à l'oral.
- Un détail concret et spécifique (un objet, un moment précis, un chiffre réel) vaut toujours mieux qu'une généralité, même bien tournée.
- Assume un point de vue tranché plutôt qu'une position équilibrée et prudente — un contenu qui ne dérange jamais personne ne marque personne.
- Varie la longueur des phrases dans un même paragraphe — l'IA par défaut a tendance à produire des phrases toutes calibrées pareil, une vraie voix ne fait jamais ça.

ANTI-PATTERNS DE HOOK À NE JAMAIS PRODUIRE : "Aujourd'hui je vous parle de…", "Salut moi c'est…", "Je m'appelle…" en ouverture, hooks vagues, non ciblés, alarmistes, fausses promesses, hook à rallonge.

RÈGLE R3 — ANTI-CLICHÉ : détecte les patterns de hook usés et cliché et reformule-les toujours en version incarnée et spécifique à CETTE niche précise, jamais un hook cliché brut, même bien tourné.

RÈGLE — TOUJOURS CONVERTIR L'INFO EN ACTION UNIQUE : ne livre jamais une information brute sans la transformer en une action unique, concrète, que la lectrice peut faire immédiatement — particulièrement important pour AT13 (contenu sauvegardable) et toute slide de valeur.

AUTRES INTERDITS ABSOLUS :
- Jamais de monologue nombriliste : même en registre "je", le texte doit toujours se retourner vers la lectrice à un moment (question, "toi", invitation) — jamais un texte qui parle uniquement de soi du début à la fin.
- Jamais citer "selon Meta", "l'algorithme dit que" ou toute source externe dans le texte généré, même si le sujet touche à l'algorithme — les mécanismes de plateforme restent des heuristiques internes, jamais récités comme autorité dans le post lui-même.
- CTA "lien en bio" et "DM-moi" seuls sont formellement interdits en Conversion (voir règle CTA plus bas) — ce ne sont jamais des CTA valides, peu importe l'angle.

GRADIENT DE QUALITÉ (viser toujours le niveau Excellent) :
🔴 Mauvais : "Aujourd'hui je vous parle de…"
🟡 Bon : "Pourquoi tes [X] font [problème]"
🟢 Excellent : "J'ai analysé [N] [cas] — voici le seul point commun"

L'angle de crédibilité s'adapte au type d'offre fourni — une coach ne "prouve" pas comme une revendeuse MRR ni comme un SaaS.`;

export const NEEDS_PROOF = ["CV1", "CV4", "CV9"];

// Vue publique et minimale d'un rôle, sûre à exposer au client (jamais SHARED_RULES/storyTunnels/fonctions de prompt).
export interface RoleOption {
  id: string;
  nom: string;
  description: string;
  registre: string;
  biais: string;
  emotion: string;
  needsProof: boolean;
}

export function getRoleOptionsMap(): Record<Objectif, RoleOption[]> {
  const objectifs: Objectif[] = ["ATTRACTION", "CONNEXION", "CONVERSION"];
  return Object.fromEntries(
    objectifs.map((objectif) => [
      objectif,
      ROLES[objectif].map(([id, nom, description, registre, biais, emotion]) => ({
        id,
        nom,
        description,
        registre,
        biais,
        emotion,
        needsProof: NEEDS_PROOF.includes(id),
      })),
    ])
  ) as Record<Objectif, RoleOption[]>;
}

export const CTA_INFO: Record<Objectif, { cta: string; pourquoi: string }> = {
  ATTRACTION: { cta: "Partage / sauvegarde / abonnement", pourquoi: "en Attraction, l'objectif est de convertir l'attention en portée (partage) ou en mémorisation (sauvegarde) — jamais une vente directe, une inconnue n'est pas encore prête." },
  CONNEXION: { cta: "Réponse / commentaire / partage à une amie", pourquoi: "en Connexion, l'objectif est d'ouvrir un dialogue réel pour construire la confiance avant toute idée de vente." },
  CONVERSION: { cta: "Mot-clé en commentaire → DM (jamais \"lien en bio\")", pourquoi: "en Conversion, l'intérêt accumulé en Attraction et Connexion se transforme enfin en décision — le mot-clé→DM convertit à 12-18% contre 2-3% pour un lien en bio, qui est banni comme CTA." },
};

export const CTA_INFO_STORY: Record<Objectif, { cta: string; pourquoi: string }> = {
  ATTRACTION: { cta: "\"Réponds-moi / dis-moi\" (jamais \"clique\")", pourquoi: "en story Attraction (= ré-accroche de tièdes, pas de portée froide), l'objectif est CTB (call-to-bond) : créer du lien, pas vendre — le sticker sert à faire parler, pas à faire cliquer." },
  CONNEXION: { cta: "Boîte à questions / \"dis-moi\"", pourquoi: "CTA≠CTB : cette séquence sert à créer du lien, jamais à pitcher — l'offre n'est mentionnée qu'en frame finale, sans jamais \"lien en bio\"." },
  CONVERSION: { cta: "Mot-clé tapé en DM ou sticker lien direct (1 tap)", pourquoi: "seule la frame CTA du Tunnel B autorise l'action sur le réflexe naturel — tout le reste de la séquence reste en \"réponds-moi\", jamais \"clique\"." },
};

export const storyTunnels: Record<Objectif, string> = {
  ATTRACTION: `TUNNEL A — Identification → Connexion → Invitation (ré-accroche d'abonnés TIÈDES, jamais des inconnues — une story ne touche jamais un inconnu) : Frame 1 IDENTIFICATION (pas de sticker) — miroir précis, vérité courte. Frame 2 APPROFONDISSEMENT + STICKER sondage — une vraie curiosité sur elle-même, jamais "t'es d'accord ?". Frame 3 MICRO-RÉVÉLATION (pas de sticker) — insight utile, pas un chiffre inventé. Frame 4 INVITATION (pas de sticker) — "réponds-moi/dis-moi" par défaut, jamais "clique le lien" ici (ce n'est pas le moment de vente).`,
  CONNEXION: `TUNNEL C — Coulisses → Confiance → Offre douce (milieu de séquence, CTA≠CTB : cette séquence sert à créer du lien, pas à vendre) : Frame 1 SCÈNE DE VIE RÉELLE (pas de sticker) — sans filtre, un moment précis. Frame 2 COULISSES + STICKER sondage — une vraie curiosité, l'envers du décor. Frame 3 LEÇON APPRISE (boîte à questions, "dis-moi") — ce que ça a appris, retourné vers la lectrice. Frame 4 OFFRE DOUCE (pas de sticker) — mentionnée sans pitcher, jamais "lien en bio", "réponds-moi" reste le réflexe même ici.`,
  CONVERSION: `TUNNEL B — Objection → Preuve → CTA (5 frames, seul moment où le CTA prime sur le lien) : Frame 1 NOMMER L'OBJECTION (pas de sticker). Frame 2 RECADRAGE + STICKER sondage — depuis le vécu, pas un argumentaire théorique. Frame 3 PREUVE (pas de sticker, jamais de chiffre inventé) — à la taille de l'état réel. Frame 4 PERMISSION (boîte à questions). Frame 5 CTA — mot-clé tapé DIRECTEMENT en DM (ex. "Écris DIAGNOSTIC en DM") ou sticker lien direct (1 tap) si le contexte le permet : une story n'a PAS de commentaires, ne propose jamais "commente X". C'est la SEULE frame de toute séquence story où "clique"/l'action prime sur "réponds-moi".`,
};

// Rôle exact de la frame 1 (l'amorce, générée à l'étape 1 avant que le tunnel complet
// ne soit connu) selon l'objectif — dérivé des libellés "Frame 1 ..." de storyTunnels
// ci-dessus ; à garder cohérent si ces libellés évoluent.
export const storyFrame1Role: Record<Objectif, string> = {
  ATTRACTION: `IDENTIFICATION : un miroir précis, une vérité courte sur elle — pas encore une scène développée ni une objection, juste un constat qui la touche directement.`,
  CONNEXION: `SCÈNE DE VIE RÉELLE : un moment précis et sans filtre, comme le tout début d'une anecdote qu'on va raconter — pas un constat ni une objection.`,
  CONVERSION: `NOMMER L'OBJECTION : le doute ou l'objection réelle que la cible a en tête à cet instant précis, formulé comme elle le penserait elle-même — ne le résous surtout pas ici, le recadrage viendra seulement à la frame suivante.`,
};

export interface GenContext {
  offreType: string;
  offre: string;
  sujet: string;
  sujetMode: SujetMode;
  voix: string;
  objectif: Objectif;
  roleId: string;
  preuve: string;
  format: Format;
  reelType: ReelType;
}

export function getRole(objectif: Objectif, roleId: string): Role {
  const role = ROLES[objectif].find((r) => r[0] === roleId);
  if (!role) {
    throw new Error(`Rôle inconnu "${roleId}" pour l'objectif "${objectif}"`);
  }
  return role;
}

export interface PromptPair {
  system: string;
  user: string;
}

// Reproduit step1Btn.addEventListener du prototype (génération des 3 hooks/amorces).
export function buildHooksPrompt(ctx: GenContext): PromptPair {
  const role = getRole(ctx.objectif, ctx.roleId);

  const sujetInstruction =
    ctx.sujetMode === "idee" && ctx.sujet
      ? `\nSujet imposé pour ce post : ${ctx.sujet} — les 3 hooks doivent porter précisément sur ce sujet.`
      : `\nAucun sujet imposé — choisis toi-même un sujet pertinent selon l'offre, l'objectif et l'angle donnés, et indique-le en une ligne "SUJET CHOISI : ..." avant les 3 hooks.`;
  const voiceInstructionHooks = ctx.voix
    ? `\n\nVOIX À REPRODUIRE, RÈGLE LA PLUS IMPORTANTE : voici un échantillon réel de comment cette personne parle : "${ctx.voix}". Les 3 propositions doivent sonner comme si CETTE personne les avait tapées, pas un français plus soutenu ou plus littéraire que l'échantillon.`
    : "";

  const isStory = ctx.format === "Story";
  const elementLabel = isStory ? "amorce" : "hook";
  const system = isStory
    ? `Tu génères UNIQUEMENT 3 propositions d'AMORCE pour la 1re frame d'une story Instagram, rien d'autre. Pas de frames suivantes, pas de pont DM, pas de préambule.

UNE AMORCE DE STORY N'EST PAS UN HOOK DE REEL/CARROUSEL — DIFFÉRENCE FONDAMENTALE : un hook doit arrêter un scroll dans un feed compétitif, face à des dizaines d'autres posts. Une story n'a AUCUN scroll à arrêter — elle est déjà ouverte par quelqu'un qui te suit et qui tape déjà à travers ta séquence. L'amorce n'a pas besoin d'accrocher au sens marketing du terme : c'est une entrée en matière naturelle, comme si tu commençais à raconter un truc à une copine — un constat, une scène, une pensée du moment. Jamais de mécanisme de rupture appuyé (pas de "vérité qui dérange" version choc, pas de chiffre balancé pour choquer) — juste une ouverture qui donne envie de rester par curiosité humaine, pas par réflexe de scroll-stop.

EXEMPLES CALIBRÉS DE CE QUI SONNE JUSTE (le ton à atteindre, pas le fond à copier) :
- "Bon. J'avoue, j'ai failli pas la poster celle-là."
- "Ok donc une abonnée m'a écrit un truc ce matin et j'arrête pas d'y repenser."
- "J'étais en train de répondre à mes DM et faut que je vous dise un truc."
- "Tu vois le genre de truc qu'on se dit "je le fais demain" depuis 3 semaines ?"
- "Franchement je sais pas trop comment le dire mais bon, on y va."
CE QUI SONNE FAUX (à éviter absolument, ça sonne comme un hook déguisé) :
- "3 choses que personne ne te dit sur X" (c'est une liste de carrousel)
- "Voici pourquoi tu n'arrives pas à Y" (c'est un hook de vérité qui dérange)
- "J'ai analysé 50 comptes et voici ce que j'ai trouvé" (c'est un hook chiffré)
- "Je le vois trop souvent pour l'ignorer" / "je le remarque partout" / "je vois trop de gens tomber dans ce piège" / "j'aurais dû le dire plus tôt" (affirmation d'autorité en ouverture, sonne comme un constat d'experte préparé, pas une pensée qui vient de te traverser l'esprit là maintenant)

LE VRAI TEST, APPLICABLE À N'IMPORTE QUEL OBJECTIF ET N'IMPORTE QUEL ANGLE (attraction, connexion, conversion — pas un cas particulier) : une amorce ne doit JAMAIS teaser une révélation à venir. Un hook dit "il y a une chose que je vais te dire" (ça crée un gap de curiosité, c'est un mécanisme marketing) — une amorce EST déjà la pensée ou la scène, directement, sans l'annoncer d'abord. Avant de valider ta 1re frame, vérifie : est-ce que ma phrase promet quelque chose qui va suivre au lieu de le dire tout de suite ("il y a un truc que...", "j'ai mis du temps à comprendre...", "je vois trop de...") ? Si oui, quel que soit l'angle donné, c'est un hook déguisé — recommence directement dans la scène ou la pensée elle-même.

RÔLE PRÉCIS DE CETTE AMORCE, NON NÉGOCIABLE : cette amorce sera figée comme frame 1 d'une séquence story complète que tu ne vois pas encore à cette étape — son rôle exact dépend de l'objectif ${ctx.objectif} donné plus bas : ${storyFrame1Role[ctx.objectif]} Respecte ce rôle en plus des principes généraux ci-dessus, sinon la suite de la séquence (générée ensuite autour de cette amorce fixée) ne pourra pas s'enchaîner logiquement dessus.

${SHARED_RULES}${voiceInstructionHooks}

Format de réponse STRICT : si un sujet doit être choisi par toi, une ligne "SUJET CHOISI : [sujet]" en premier, sinon rien avant. Puis exactement 3 lignes :
1. [amorce]
2. [amorce]
3. [amorce]
Chaque amorce doit explorer une variante différente du même angle imposé, dans un registre parlé/conversationnel, jamais dans un registre "post". IMPORTANT : les 3 propositions doivent TOUTES viser le niveau Excellent du gradient de qualité donné plus haut — ne produis JAMAIS volontairement une version faible ou moyenne parmi les 3 pour "varier". La variation doit porter sur le mécanisme/l'angle choisi à l'intérieur de chaque amorce, pas sur le niveau de qualité entre les 3.`
    : `Tu génères UNIQUEMENT 3 propositions de hook pour un post Instagram, rien d'autre. Pas de slides, pas de légende, pas de préambule.

${SHARED_RULES}${voiceInstructionHooks}

Format de réponse STRICT : si un sujet doit être choisi par toi, une ligne "SUJET CHOISI : [sujet]" en premier, sinon rien avant. Puis exactement 3 lignes :
1. [hook]
2. [hook]
3. [hook]
Chaque hook doit explorer une variante différente du même angle imposé (pas 3 fois la même idée reformulée à peine). IMPORTANT : les 3 propositions doivent TOUTES viser le niveau Excellent du gradient de qualité donné plus haut — ne produis JAMAIS volontairement une version faible ou moyenne parmi les 3 pour "varier". La variation doit porter sur le mécanisme/l'angle choisi à l'intérieur de chaque hook, pas sur le niveau de qualité entre les 3.`;

  const user = `Type d'offre : ${ctx.offreType} (${CREDIBILITE[ctx.offreType]})
Offre précise + cliente : ${ctx.offre}${sujetInstruction}
Objectif : ${ctx.objectif}
Angle imposé : ${role[0]} — ${role[1]} (${role[2]}), registre ${role[3]}
Format : ${ctx.format}${ctx.preuve ? "\nDonnée réelle : " + ctx.preuve : ""}${ctx.voix ? '\nVoix : "' + ctx.voix + '"' : ""}

Propose 3 ${elementLabel}s pour cet angle précis.`;

  return { system, user };
}

export interface ParsedHooks {
  sujetChoisi: string;
  hooks: string[];
}

// Reproduit le parsing des lignes 490-493 du prototype.
export function parseHooksResponse(rawText: string, fallbackSujet: string): ParsedHooks {
  const sujetMatch = rawText.match(/SUJET CHOISI\s*:\s*(.+)/i);
  const sujetChoisi = sujetMatch ? sujetMatch[1].trim() : fallbackSujet || "";
  const lines = rawText
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => /^[123][.)]/.test(l));
  const hooks = lines.map((l) => l.replace(/^[123][.)]\s*/, ""));
  return { sujetChoisi, hooks };
}

// Reproduit generateFull() du prototype (génération du post complet à partir du hook choisi).
export function buildFullPrompt(ctx: GenContext, chosenHook: string): PromptPair {
  const role = getRole(ctx.objectif, ctx.roleId);

  const structureSpecifique =
    role[6] && ctx.format !== "Story"
      ? `\n\nSTRUCTURE OBLIGATOIRE POUR CET ANGLE PRÉCIS (prime sur le squelette générique ci-dessus, à respecter au mot près) : ${role[6]}`
      : "";
  const voiceInstruction = ctx.voix
    ? `\n\nVOIX À REPRODUIRE, RÈGLE QUI PRIME SUR TOUT LE RESTE : voici un échantillon réel de comment cette personne parle : "${ctx.voix}". N'écris PAS dans un français plus soutenu que cet échantillon — repère ses expressions, ses images, son rythme, et réutilise ce registre précis dans le corps du gabarit, pas juste dans le hook. Reprends le même niveau de familiarité, le même rythme de phrase, les mêmes types de mots. Si l'échantillon utilise des tournures orales, des phrases coupées, une ponctuation relâchée (points d'interrogation en cascade, tirets, etc.) — fais pareil PARTOUT dans le texte, légende comprise, pas seulement au début. Un texte plus "propre" ou plus "littéraire" que l'échantillon est un ÉCHEC, même s'il est grammaticalement correct — la règle de grammaire impeccable ne t'autorise jamais à lisser le ton.`
    : "";

  const reelInstruction =
    ctx.format === "Reel"
      ? ctx.reelType === "parle"
        ? `\n\nSTRUCTURE REEL PARLÉ (choisi) — 3 éléments distincts :
1. TEXTE À L'ÉCRAN : le hook fourni tel quel, affiché en overlay.
2. SCRIPT PARLÉ COMPLET, OBLIGATOIRE : écris mot pour mot ce qu'elle dit à la caméra, du hook jusqu'à la fin — c'est ici que TOUT le développement (l'angle, la valeur, la preuve) est dit à l'oral. Rythme oral, phrases courtes, comme si elle parlait vraiment.
3. LÉGENDE COMPLÉMENTAIRE (pas un résumé du script) : puisque l'essentiel a déjà été dit à l'oral, la légende n'a pas besoin de réexpliquer — elle ajoute une couche différente (contexte, un détail non dit à l'oral, ou renforce le CTA), reste courte, ouverture distincte du hook, CTA selon objectif, hashtags.`
        : `\n\nSTRUCTURE REEL COURT (choisi) — 2 éléments distincts :
1. TEXTE À L'ÉCRAN : le hook fourni tel quel, SEUL affiché à l'écran du début à la fin (pas de script parlé développé — le Reel est visuel/rythmé, pas un talking head qui explique). Ajoute un repère visuel de CTA à l'écran si pertinent (ex. "👇 suite en légende").
2. LÉGENDE COMPLÈTE, OBLIGATOIRE : puisque rien n'est développé à l'oral, c'est ELLE qui porte tout le développement AIDA (l'angle, la valeur, la preuve, le CTA) — jamais raccourcie sous prétexte que le hook est déjà à l'écran. Ouverture distincte du hook, arc tu→je→tu, CTA selon objectif, hashtags.`
      : "";

  const storyInstruction =
    ctx.format === "Story"
      ? `\n\nSTRUCTURE STORY — CE N'EST PAS UN CARROUSEL, ne construis JAMAIS une story comme une suite de slides longues à lire. LE TUNNEL DONNÉ CI-DESSOUS EST LA SEULE STRUCTURE À SUIVRE, quel que soit le rôle éditorial choisi — ignore toute autre indication de structure par slides/alternance qui viendrait du rôle lui-même (ex. "slides alternées sans/avec l'offre"), ça décrit un carrousel, pas une story. Le nombre de frames vient du tunnel (4, ou 5 pour le Tunnel B), jamais plus. Contexte fondamental : une story ne touche QUE les abonnés déjà acquis, jamais de portée froide — le ton peut donc être plus familier, plus proche, comme à quelqu'un qui te suit déjà. Chaque frame se lit en 3 à 7 secondes maximum : une phrase, jamais un paragraphe. UN SEUL sticker par séquence, jamais sur la frame 1. Utilise "frame" jamais "slide" dans ta réponse.

CTA ≠ CTB, RÈGLE CRITIQUE : une story ne vend pas à chaque frame. Sauf en Conversion (Tunnel B), l'objectif de cette séquence est de créer du lien (call-to-bond), pas d'inviter à l'action (call-to-action) — ne force jamais un CTA de vente là où le tunnel dit "réponds-moi".

LE STICKER EST UNE VRAIE CURIOSITÉ, PAS UN APPÂT : le sondage doit porter sur un truc que la lectrice a envie de dire sur elle-même, jamais une question fermée du type "t'es d'accord ?" qui n'invite à rien de personnel.

TON STORY, RÈGLE CRITIQUE : une story c'est comme un texto ou une note vocale à une amie, pas un post rédigé qu'on relit et polit. C'est LE format le plus brut, le plus spontané d'Instagram — encore plus relâché que le Reel ou le carrousel. Écris comme si tu tapais vite entre deux trucs, pas comme si tu composais une phrase. Pas de connecteurs logiques ("cependant", "ainsi", "de ce fait"), pas de structure de phrase soignée. Une frame qui sonne "écrite" plutôt que "dite" est un échec, même si le contenu est bon.

CE PRINCIPE S'APPLIQUE À TOUTES LES FRAMES, PAS QUE LA PREMIÈRE : une séquence qui commence bien puis retombe en phrases de carrousel à la frame 3 est un échec. Exemple de ce qui sonne juste sur une frame de milieu de séquence : "Genre concrètement je faisais X sans même m'en rendre compte" — pas "Voici pourquoi X pose problème". Garde le même relâchement du début à la fin.
${storyTunnels[ctx.objectif]}
PONT STORY → DM, ÉLÉMENT OBLIGATOIRE ET DISTINCT (à écrire après les frames, jamais fondu dedans) : le message que Jenni envoie en DM dès que quelqu'un répond au sticker ou au mot-clé — répondre en DM à toute réponse story est le mouvement le plus rentable et le plus sous-exploité, jamais laisser une réponse sans suite. Ton différent selon l'objectif (remerciement+relance en Connexion/Attraction, livraison de l'offre en Conversion). Pas de hashtags sur une story.`
      : "";

  const ctaRule =
    ctx.format === "Story"
      ? `\nCTA par objectif SUR STORY (jamais de "commente X", ça n'existe pas sur une story) : ATTRACTION = action (partage/sauvegarde/abonnement, pas de mot-clé). CONNEXION = boîte à questions / réponse à la story. CONVERSION = mot-clé tapé directement en DM, ou tap sticker lien — jamais "commente" ni "lien en bio".`
      : `\nCTA par objectif : ATTRACTION = partage/sauvegarde/abonnement (JAMAIS mot-clé commentaire). CONNEXION = réponse/commentaire/partage à une amie. CONVERSION = mot-clé en commentaire → DM, EXCLUSIVEMENT — "lien en bio" et "DM-moi" seuls sont FORMELLEMENT INTERDITS, ce ne sont jamais des CTA valides (le mot-clé→DM convertit à 12-18% contre 2-3% pour un lien en bio).`;

  const legendeRule =
    ctx.format === "Story"
      ? `\n\nPAS DE LÉGENDE SUR UNE STORY : une story n'a aucune légende, aucune caption séparée — ne génère RIEN qui ressemble à une légende de post. Le contenu s'arrête aux frames + le pont DM. Termine ta réponse juste après le pont DM.`
      : `\n\nPRIORITÉ ABSOLUE SI L'ESPACE MANQUE : la légende complète ne doit JAMAIS être coupée ni omise, quitte à raccourcir le nombre de slides. Termine toujours par la légende entière, hashtags compris — ne t'arrête jamais en plein milieu d'une phrase.`;

  const carrouselInstruction =
    ctx.format === "Carrousel"
      ? `\n\nSTRUCTURE CARROUSEL (8-10 slides, sauf structure spécifique fournie plus bas) : Slide 1 = hook fourni tel quel → Rétention (tient seule) → Valeur (1 idée/slide, 2-3 phrases) → Récap (reformule) → CTA (mot-clé + bénéfice). Puis une LÉGENDE complète et OBLIGATOIRE (jamais omise) : ouverture distincte du hook, arc tu→je→tu, CTA selon objectif, 3-5 hashtags ciblés.`
      : "";

  const system = `Tu remplis le CORPS COMPLET d'un gabarit de contenu Instagram — ${
    ctx.format === "Story"
      ? "l'amorce (frame 1) est déjà choisie et figée, tu ne la regénères jamais"
      : "le hook est déjà choisi et figé, tu ne le regénères jamais"
  }, tu construis tout autour. Le format demandé est ${ctx.format} : ne mélange JAMAIS les codes d'un autre format (pas de "légende" sur une story, pas de slides sur un reel, pas de mécanisme de hook scroll-stop sur une story, etc.) — chaque format a ses propres règles ci-dessous, applique UNIQUEMENT celles qui correspondent au format demandé.

${SHARED_RULES}${carrouselInstruction}${reelInstruction}${storyInstruction}${ctaRule}${structureSpecifique}${voiceInstruction}${legendeRule}

Réponds avec le gabarit ENTIER${ctx.format === "Story" ? "" : ", légende incluse sans exception"}, en français impeccable mais fidèle à la voix donnée. Pas de préambule.`;

  const CN12 = ROLES.CONNEXION.find((r) => r[0] === "CN12") as Role;
  const fallbackNote =
    NEEDS_PROOF.includes(role[0]) && !ctx.preuve
      ? `\nAucune donnée réelle fournie — bascule officielle vers le fallback anti-fabrication CN12 (${CN12[1]} : ${CN12[2]}), pas juste "rester vague".`
      : ctx.preuve
        ? "\nDonnée réelle : " + ctx.preuve
        : "";

  const user = `Type d'offre : ${ctx.offreType} (${CREDIBILITE[ctx.offreType]})
Offre précise + cliente : ${ctx.offre}${ctx.sujet ? "\nSujet du post : " + ctx.sujet : ""}
Objectif : ${ctx.objectif}
Angle : ${role[0]} — ${role[1]}, registre ${role[3]}
Format : ${ctx.format}${fallbackNote}${ctx.voix ? '\nVoix : "' + ctx.voix + '"' : ""}

Hook choisi (ne pas regénérer, construire tout autour) : "${chosenHook}"

Génère le gabarit ${ctx.format} complet avec ce hook exact, légende incluse.`;

  return { system, user };
}
