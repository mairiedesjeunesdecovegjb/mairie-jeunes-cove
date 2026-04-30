import { sql } from "drizzle-orm";
import {
  db,
  settingsTable,
  pagesTable,
  heroSlidesTable,
  teamMembersTable,
  projectsTable,
  newsTable,
  eventsTable,
  galleryTable,
  partnersTable,
  opportunitiesTable,
} from "@workspace/db";
import { logger } from "./logger";

async function isEmpty(table: any): Promise<boolean> {
  const [row] = await db
    .select({ c: sql<number>`count(*)::int` })
    .from(table);
  return Number(row?.c ?? 0) === 0;
}

const DEFAULT_PAGES = [
  {
    slug: "accueil",
    title: "Accueil",
    heading: "Bienvenue à la Mairie des Jeunes de Covè",
    subheading:
      "Engagés pour une jeunesse responsable, citoyenne et porteuse de changement.",
    body: "La Mairie des Jeunes de Covè est une institution qui rassemble les jeunes leaders de la commune autour des valeurs de citoyenneté, de solidarité et d'innovation. Ensemble, nous bâtissons un avenir meilleur pour notre communauté à travers des initiatives concrètes en éducation, environnement, santé et culture.",
    seoTitle: "Mairie des Jeunes de Covè - Bénin",
    seoDescription:
      "Site officiel de la Mairie des Jeunes de Covè au Bénin. Engagement citoyen, projets et opportunités pour la jeunesse.",
  },
  {
    slug: "a-propos",
    title: "À propos",
    heading: "Notre histoire et notre mission",
    subheading: "Découvrez l'institution qui porte la voix de la jeunesse covéenne.",
    body: "Fondée pour donner aux jeunes une plateforme d'expression et d'action, la Mairie des Jeunes de Covè œuvre depuis sa création à fédérer les énergies de la jeune génération autour de projets structurants. Nos missions : représenter, former, accompagner et inspirer les jeunes de la commune.",
    seoTitle: "À propos - Mairie des Jeunes de Covè",
    seoDescription:
      "Histoire, mission et vision de la Mairie des Jeunes de Covè.",
  },
  {
    slug: "cabinet",
    title: "Cabinet",
    heading: "Le cabinet du Maire des Jeunes",
    subheading: "Une équipe dévouée au service de la jeunesse.",
    body: "Le cabinet de la Mairie des Jeunes de Covè est composé de jeunes leaders élus et désignés pour porter les politiques jeunesse de la commune. Chaque membre apporte son expertise et son engagement au service du collectif.",
    seoTitle: "Cabinet - Mairie des Jeunes de Covè",
    seoDescription: "Découvrez les membres du cabinet de la Mairie des Jeunes de Covè.",
  },
  {
    slug: "projets",
    title: "Projets",
    heading: "Nos projets pour la commune",
    subheading: "Des actions concrètes pour transformer Covè.",
    body: "Découvrez l'ensemble des projets portés par la Mairie des Jeunes de Covè dans les domaines de l'éducation, de l'environnement, de la santé, de la culture et du développement économique.",
    seoTitle: "Projets - Mairie des Jeunes de Covè",
    seoDescription:
      "Tous les projets et initiatives de la Mairie des Jeunes de Covè.",
  },
  {
    slug: "actualites",
    title: "Actualités",
    heading: "Actualités",
    subheading: "Restez informé de nos dernières activités.",
    body: "Suivez en direct toutes les actualités, communiqués et événements de la Mairie des Jeunes de Covè.",
    seoTitle: "Actualités - Mairie des Jeunes de Covè",
    seoDescription: "Dernières actualités de la Mairie des Jeunes de Covè.",
  },
  {
    slug: "agenda",
    title: "Agenda",
    heading: "Agenda des événements",
    subheading: "Tous nos rendez-vous à venir.",
    body: "Consultez l'agenda complet des activités, formations, audiences et célébrations organisées par la Mairie des Jeunes de Covè.",
    seoTitle: "Agenda - Mairie des Jeunes de Covè",
    seoDescription: "Calendrier des événements de la Mairie des Jeunes de Covè.",
  },
  {
    slug: "galerie",
    title: "Galerie",
    heading: "Galerie photos",
    subheading: "Revivez nos moments forts en images.",
    body: "Plongez dans l'univers visuel de la Mairie des Jeunes de Covè à travers une sélection de photos de nos activités, cérémonies et projets.",
    seoTitle: "Galerie - Mairie des Jeunes de Covè",
    seoDescription: "Photos et souvenirs des activités de la Mairie des Jeunes de Covè.",
  },
  {
    slug: "opportunites",
    title: "Opportunités",
    heading: "Opportunités pour les jeunes",
    subheading: "Bourses, formations, emplois et appels à projets.",
    body: "Retrouvez ici toutes les opportunités sélectionnées par la Mairie des Jeunes de Covè pour aider les jeunes à se former, à entreprendre et à s'épanouir.",
    seoTitle: "Opportunités - Mairie des Jeunes de Covè",
    seoDescription:
      "Bourses, formations et opportunités pour la jeunesse de Covè.",
  },
  {
    slug: "contact",
    title: "Contact",
    heading: "Contactez-nous",
    subheading: "Nous sommes à votre écoute.",
    body: "Pour toute question, suggestion ou demande de partenariat, n'hésitez pas à nous écrire. Notre équipe vous répondra dans les meilleurs délais.",
    seoTitle: "Contact - Mairie des Jeunes de Covè",
    seoDescription: "Coordonnées et formulaire de contact de la Mairie des Jeunes de Covè.",
  },
];

const DEFAULT_HERO_SLIDES = [
  {
    title: "Une jeunesse engagée pour Covè",
    subtitle:
      "La Mairie des Jeunes mobilise les talents de la commune pour bâtir un avenir solidaire.",
    imageUrl: "/seed/hero-1.png",
    ctaLabel: "Découvrir nos projets",
    ctaUrl: "/projets",
    sortOrder: 0,
  },
  {
    title: "Des projets concrets pour la commune",
    subtitle:
      "Éducation, environnement, santé : nous agissons pour transformer le quotidien.",
    imageUrl: "/seed/hero-2.png",
    ctaLabel: "Voir nos actions",
    ctaUrl: "/projets",
    sortOrder: 1,
  },
  {
    title: "Rejoignez le mouvement",
    subtitle:
      "Devenez acteur du changement et faites entendre votre voix au sein de notre institution.",
    imageUrl: "/seed/hero-3.png",
    ctaLabel: "Nous contacter",
    ctaUrl: "/contact",
    sortOrder: 2,
  },
];

const DEFAULT_TEAM = [
  {
    fullName: "Étienne K. AGOSSOU",
    role: "Maire des Jeunes",
    bio: "Leader engagé, porteur de la vision jeunesse de la commune de Covè.",
    photoUrl: "/seed/mayor.png",
    sortOrder: 0,
  },
  {
    fullName: "Sandrine HOUNDJI",
    role: "Première Adjointe",
    bio: "En charge de l'éducation et de la formation des jeunes.",
    photoUrl: "/seed/team-1.png",
    sortOrder: 1,
  },
  {
    fullName: "Romaric DOSSOU",
    role: "Conseiller à l'environnement",
    bio: "Coordonne les initiatives écologiques et de développement durable.",
    photoUrl: "/seed/team-2.png",
    sortOrder: 2,
  },
];

const DEFAULT_PROJECTS = [
  {
    title: "Reboisement urbain de Covè",
    description:
      "Plantation de 5 000 arbres dans les espaces publics de la commune.",
    body: "Un programme ambitieux pour verdir notre commune, lutter contre l'érosion et offrir des espaces ombragés aux habitants. Mené en partenariat avec les écoles et associations locales.",
    imageUrl: "/seed/project-1.png",
    status: "ongoing",
    category: "Environnement",
    featured: true,
    progress: 45,
  },
  {
    title: "Bibliothèque numérique pour les jeunes",
    description:
      "Mise en place d'un espace numérique avec ressources éducatives gratuites.",
    body: "Donner à chaque jeune l'accès aux savoirs grâce à une bibliothèque numérique connectée, des ordinateurs et des sessions d'initiation.",
    imageUrl: "/seed/project-1.png",
    status: "planned",
    category: "Éducation",
    featured: true,
    progress: 10,
  },
];

const DEFAULT_NEWS = [
  {
    slug: `lancement-officiel-${Date.now().toString(36)}`,
    title: "Lancement officiel de la Mairie des Jeunes de Covè",
    excerpt:
      "Une cérémonie inaugurale historique a marqué la naissance de notre institution.",
    body: "Ce samedi, devant les autorités locales et les habitants, la Mairie des Jeunes de Covè a été officiellement installée. Une nouvelle page s'ouvre pour la jeunesse de notre commune.",
    coverImageUrl: "/seed/news-1.png",
    author: "Communication",
    category: "Institutionnel",
    publishedAt: new Date(),
  },
];

const DEFAULT_EVENTS = [
  {
    title: "Audience publique avec les jeunes",
    description: "Échange direct entre le Maire des Jeunes et les habitants.",
    location: "Place centrale de Covè",
    startsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
  },
  {
    title: "Atelier entrepreneuriat jeunesse",
    description: "Formation gratuite pour porteurs de projets.",
    location: "Salle communale de Covè",
    startsAt: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
  },
];

const DEFAULT_GALLERY = [
  { imageUrl: "/seed/gallery-1.png", title: "Cérémonie d'installation", category: "Cérémonies", sortOrder: 0 },
  { imageUrl: "/seed/hero-1.png", title: "Atelier jeunesse", category: "Activités", sortOrder: 1 },
  { imageUrl: "/seed/hero-2.png", title: "Reboisement", category: "Environnement", sortOrder: 2 },
];

const DEFAULT_PARTNERS = [
  { name: "Mairie de Covè", websiteUrl: "#", logoUrl: "/seed/team-1.png", sortOrder: 0 },
  { name: "PNUD Bénin", websiteUrl: "#", logoUrl: "/seed/team-2.png", sortOrder: 1 },
];

const DEFAULT_OPPORTUNITIES = [
  {
    title: "Bourse d'études Excellence Jeunesse 2026",
    category: "Bourse",
    description:
      "Bourse complète pour étudiants méritants de la commune de Covè.",
    deadline: "30 juin 2026",
    applyUrl: "#",
  },
  {
    title: "Formation gratuite en entrepreneuriat numérique",
    category: "Formation",
    description: "Programme intensif de 8 semaines pour jeunes entrepreneurs.",
    deadline: "15 juillet 2026",
    applyUrl: "#",
  },
];

export async function seedDefaults(): Promise<void> {
  try {
    if (await isEmpty(settingsTable)) {
      await db.insert(settingsTable).values({
        mayorName: "Étienne K. AGOSSOU",
        mayorTitle: "Maire des Jeunes de Covè",
        mayorMessage:
          "Chères Covéennes, chers Covéens, la Mairie des Jeunes incarne notre volonté commune de bâtir une commune solidaire, dynamique et tournée vers l'avenir. Aux côtés des autorités locales, des partenaires et de la population, nous mobilisons l'énergie de notre jeunesse autour de projets concrets en éducation, environnement, santé et entrepreneuriat. Ensemble, faisons de Covè un modèle de gouvernance participative et d'engagement citoyen.",
        mayorPhotoUrl: "/seed/mayor.png",
        whatsappNumber: "+22961000000",
        contactPhone: "+229 61 00 00 00",
        contactEmail: "contact@mairiejeunescove.bj",
        contactAddress: "Hôtel de Ville, Covè, République du Bénin",
        facebookUrl: "https://facebook.com/mairiejeunescove",
        designerName: "Builvision Group",
        designerUrl: "https://builvision.com",
      });
      logger.info("Seeded default settings");
    }
    if (await isEmpty(pagesTable)) {
      await db.insert(pagesTable).values(DEFAULT_PAGES);
      logger.info("Seeded default pages");
    }
    if (await isEmpty(heroSlidesTable)) {
      await db.insert(heroSlidesTable).values(DEFAULT_HERO_SLIDES);
      logger.info("Seeded hero slides");
    }
    if (await isEmpty(teamMembersTable)) {
      await db.insert(teamMembersTable).values(DEFAULT_TEAM);
      logger.info("Seeded team members");
    }
    if (await isEmpty(projectsTable)) {
      await db.insert(projectsTable).values(DEFAULT_PROJECTS);
      logger.info("Seeded projects");
    }
    if (await isEmpty(newsTable)) {
      await db.insert(newsTable).values(DEFAULT_NEWS);
      logger.info("Seeded news");
    }
    if (await isEmpty(eventsTable)) {
      await db.insert(eventsTable).values(DEFAULT_EVENTS);
      logger.info("Seeded events");
    }
    if (await isEmpty(galleryTable)) {
      await db.insert(galleryTable).values(DEFAULT_GALLERY);
      logger.info("Seeded gallery");
    }
    if (await isEmpty(partnersTable)) {
      await db.insert(partnersTable).values(DEFAULT_PARTNERS);
      logger.info("Seeded partners");
    }
    if (await isEmpty(opportunitiesTable)) {
      await db.insert(opportunitiesTable).values(DEFAULT_OPPORTUNITIES);
      logger.info("Seeded opportunities");
    }
  } catch (err) {
    logger.error({ err }, "Seed defaults failed");
  }
}
