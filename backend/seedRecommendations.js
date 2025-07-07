const mongoose = require("mongoose");
const RecommendedBook = require("./src/models/RecommendedBook");
require("dotenv").config();

// Données des livres recommandés
const recommendedBooks = [
  {
    title: "L'Étranger",
    author: "Albert Camus",
    genre: "Roman",
    category: "Roman",
    description:
      "Un classique de la littérature française qui explore l'absurdité de l'existence",
    rating: 4.2,
    pages: 123,
    cover_url: "etranger.jpg",
    published_year: 1942,
    is_featured: true,
  },
  {
    title: "Dune",
    author: "Frank Herbert",
    genre: "Science-fiction",
    category: "Science-fiction",
    description: "Une épopée spatiale inoubliable dans un univers désertique",
    rating: 4.5,
    pages: 688,
    cover_url: "dune.jpg",
    published_year: 1965,
    is_featured: true,
  },
  {
    title: "Le Seigneur des Anneaux",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
    category: "Fantasy",
    description: "La trilogie fantasy par excellence qui a défini le genre",
    rating: 4.8,
    pages: 1216,
    cover_url: "leseigneurdesanneaux.jpg",
    published_year: 1954,
    is_featured: true,
  },
  {
    title: "1984",
    author: "George Orwell",
    genre: "Roman",
    category: "Roman",
    description:
      "Un roman dystopique visionnaire sur la surveillance et le totalitarisme",
    rating: 4.6,
    pages: 328,
    cover_url: "1984.jpg",
    published_year: 1949,
    is_featured: true,
  },
  {
    title: "Sapiens",
    author: "Yuval Noah Harari",
    genre: "Essai",
    category: "Essai",
    description: "Une brève histoire de l'humanité fascinante et accessible",
    rating: 4.4,
    pages: 512,
    cover_url: "sapiens.jpg",
    published_year: 2011,
    is_featured: false,
  },
  {
    title: "L'Alchimiste",
    author: "Paulo Coelho",
    genre: "Développement personnel",
    category: "Développement personnel",
    description: "Une fable philosophique inspirante sur la quête de ses rêves",
    rating: 4.3,
    pages: 163,
    cover_url: "alchimiste.jpg",
    published_year: 1988,
    is_featured: false,
  },
  {
    title: "Homo Deus",
    author: "Yuval Noah Harari",
    genre: "Essai",
    category: "Essai",
    description: "Une brève histoire de l'avenir de l'humanité",
    rating: 4.3,
    pages: 464,
    cover_url: "homodeus.jpg",
    published_year: 2015,
    is_featured: false,
  },
  {
    title: "Le Petit Prince",
    author: "Antoine de Saint-Exupéry",
    genre: "Roman",
    category: "Roman",
    description: "Un conte poétique et philosophique intemporel",
    rating: 4.7,
    pages: 96,
    cover_url: "petitprince.jpg",
    published_year: 1943,
    is_featured: false,
  },
  {
    title: "Harry Potter à l'école des sorciers",
    author: "J.K. Rowling",
    genre: "Fantasy",
    category: "Fantasy",
    description: "Le début de la saga magique qui a conquis le monde",
    rating: 4.6,
    pages: 320,
    cover_url: "harrypotter1.jpg",
    published_year: 1997,
    is_featured: false,
  },
  {
    title: "Neuromancer",
    author: "William Gibson",
    genre: "Science-fiction",
    category: "Science-fiction",
    description: "Le roman fondateur du cyberpunk et de la culture numérique",
    rating: 4.1,
    pages: 271,
    cover_url: "neuromancer.jpg",
    published_year: 1984,
    is_featured: false,
  },
  {
    title: "Le Nom de la Rose",
    author: "Umberto Eco",
    genre: "Policier",
    category: "Policier",
    description: "Un thriller médiéval érudit et passionnant",
    rating: 4.2,
    pages: 512,
    cover_url: "nomrose.jpg",
    published_year: 1980,
    is_featured: false,
  },
  {
    title: "Les Misérables",
    author: "Victor Hugo",
    genre: "Roman",
    category: "Roman",
    description: "Une fresque sociale inoubliable de la France du XIXe siècle",
    rating: 4.4,
    pages: 1488,
    cover_url: "miserables.jpg",
    published_year: 1862,
    is_featured: false,
  },
  {
    title: "Fondation",
    author: "Isaac Asimov",
    genre: "Science-fiction",
    category: "Science-fiction",
    description: "Un empire galactique en déclin et la science qui le sauvera",
    rating: 4.3,
    pages: 244,
    cover_url: "fondation.jpg",
    published_year: 1951,
    is_featured: false,
  },
  {
    title: "L'Assassin Royal",
    author: "Robin Hobb",
    genre: "Fantasy",
    category: "Fantasy",
    description: "Une saga fantasy épique aux personnages profondément humains",
    rating: 4.5,
    pages: 480,
    cover_url: "assassinroyal.jpg",
    published_year: 1995,
    is_featured: false,
  },
  {
    title: "Gone Girl",
    author: "Gillian Flynn",
    genre: "Thriller",
    category: "Thriller",
    description: "Un thriller psychologique saisissant sur un mariage toxique",
    rating: 4.1,
    pages: 432,
    cover_url: "gonegirl.jpg",
    published_year: 2012,
    is_featured: false,
  },
  {
    title: "Méditations",
    author: "Marc Aurèle",
    genre: "Philosophie",
    category: "Philosophie",
    description: "Les réflexions stoïciennes d'un empereur romain",
    rating: 4.4,
    pages: 304,
    cover_url: "meditations.jpg",
    published_year: 180,
    is_featured: false,
  },
  {
    title: "Steve Jobs",
    author: "Walter Isaacson",
    genre: "Biographie",
    category: "Biographie",
    description: "La biographie autorisée du cofondateur d'Apple",
    rating: 4.3,
    pages: 656,
    cover_url: "stevejobs.jpg",
    published_year: 2011,
    is_featured: false,
  },
  {
    title: "Une brève histoire du temps",
    author: "Stephen Hawking",
    genre: "Histoire",
    category: "Histoire",
    description: "Les mystères de l'univers expliqués de manière accessible",
    rating: 4.4,
    pages: 256,
    cover_url: "histoiretemps.jpg",
    published_year: 1988,
    is_featured: false,
  },
  {
    title: "Les Fleurs du Mal",
    author: "Charles Baudelaire",
    genre: "Poésie",
    category: "Poésie",
    description: "Le recueil de poèmes emblématique de la modernité",
    rating: 4.2,
    pages: 320,
    cover_url: "fleursdumal.jpg",
    published_year: 1857,
    is_featured: false,
  },
  {
    title: "Robinson Crusoé",
    author: "Daniel Defoe",
    genre: "Aventure",
    category: "Aventure",
    description: "L'histoire captivante d'un naufragé solitaire",
    rating: 4.0,
    pages: 352,
    cover_url: "robinson.jpg",
    published_year: 1719,
    is_featured: false,
  },
];

async function seedRecommendations() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connecté à MongoDB");

    // Supprimer les anciennes données (optionnel)
    await RecommendedBook.deleteMany({});
    console.log("Anciennes recommandations supprimées");

    // Insérer les nouvelles données
    await RecommendedBook.insertMany(recommendedBooks);
    console.log(
      `${recommendedBooks.length} livres recommandés ajoutés à la base de données`
    );

    // Fermer la connexion
    await mongoose.connection.close();
    console.log("Connexion fermée");
  } catch (error) {
    console.error("Erreur lors du peuplement de la base de données:", error);
    process.exit(1);
  }
}

seedRecommendations();
