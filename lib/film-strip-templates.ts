// Aspect ratio options
export type AspectRatio = "1:1" | "4:5";

// Film strip templates - Premium collection with various styles
export const FILM_STRIP_TEMPLATES = [
  {
    id: "classic",
    name: "Classic",
    type: "classic",
    stripPosition: "left",
    stripColor: "#000000", // Black
    backgroundColor: "#93c5fd", // Light blue
    rotation: 0,
    mainImageBorderColor: "#000000", // Black
    mainImageBorderWidth: 8,
    thumbnail: "/templates/film-strip-classic.jpg"
  },
  {
    id: "vintage",
    name: "Vintage",
    type: "vintage",
    stripPosition: "right",
    stripColor: "#8b4513", // Saddle brown
    backgroundColor: "#f5deb3", // Wheat
    rotation: -5,
    mainImageBorderColor: "#654321", // Dark brown
    mainImageBorderWidth: 12,
    thumbnail: "/templates/film-strip-vintage.jpg"
  },
  {
    id: "neon",
    name: "Neon",
    type: "neon",
    stripPosition: "left",
    stripColor: "#ff1493", // Deep pink
    backgroundColor: "#1a1a2e", // Dark blue
    rotation: 8,
    mainImageBorderColor: "#00ffff", // Cyan
    mainImageBorderWidth: 6,
    thumbnail: "/templates/film-strip-neon.jpg"
  },
  {
    id: "golden",
    name: "Golden",
    type: "golden",
    stripPosition: "both",
    stripColor: "#ffd700", // Gold
    backgroundColor: "#2f1b14", // Dark brown
    rotation: 0,
    mainImageBorderColor: "#ffb347", // Light gold
    mainImageBorderWidth: 10,
    thumbnail: "/templates/film-strip-golden.jpg"
  },
  {
    id: "minimalist",
    name: "Minimalist",
    type: "minimalist",
    stripPosition: "right",
    stripColor: "#f8f9fa", // Light gray
    backgroundColor: "#ffffff", // White
    rotation: 3,
    mainImageBorderColor: "#e9ecef", // Very light gray
    mainImageBorderWidth: 4,
    thumbnail: "/templates/film-strip-minimalist.jpg"
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    type: "cyberpunk",
    stripPosition: "left",
    stripColor: "#0d1117", // Dark gray
    backgroundColor: "#21262d", // GitHub dark
    rotation: -8,
    mainImageBorderColor: "#f85149", // Red
    mainImageBorderWidth: 8,
    thumbnail: "/templates/film-strip-cyberpunk.jpg"
  },
  {
    id: "pastel",
    name: "Pastel",
    type: "pastel",
    stripPosition: "right",
    stripColor: "#ffc0cb", // Pink
    backgroundColor: "#e6e6fa", // Lavender
    rotation: 6,
    mainImageBorderColor: "#dda0dd", // Plum
    mainImageBorderWidth: 6,
    thumbnail: "/templates/film-strip-pastel.jpg"
  },
  {
    id: "monochrome",
    name: "Monochrome",
    type: "monochrome",
    stripPosition: "both",
    stripColor: "#2c2c2c", // Dark gray
    backgroundColor: "#f5f5f5", // Light gray
    rotation: 0,
    mainImageBorderColor: "#000000", // Black
    mainImageBorderWidth: 12,
    thumbnail: "/templates/film-strip-monochrome.jpg"
  }
];

export type FilmStripTemplate = typeof FILM_STRIP_TEMPLATES[0];
export type StripPosition = "left" | "right" | "both";
