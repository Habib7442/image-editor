// Aspect ratio options
export type AspectRatio = "1:1" | "4:5";

// Film strip templates
export const FILM_STRIP_TEMPLATES = [
  {
    id: "classic",
    name: "Classic",
    type: "classic",
    stripPosition: "left",
    stripColor: "#000000", // Black
    backgroundColor: "#93c5fd", // bg-blue-100
    rotation: 12,
    mainImageBorderColor: "#000000", // Black
    mainImageBorderWidth: 8,
    thumbnail: "/templates/film-strip-classic.jpg"
  },
  {
    id: "right-strip",
    name: "Right Strip",
    type: "right-strip",
    stripPosition: "right",
    stripColor: "#000000", // Black
    backgroundColor: "#93c5fd", // bg-blue-100
    rotation: -12,
    mainImageBorderColor: "#000000", // Black
    mainImageBorderWidth: 8,
    thumbnail: "/templates/film-strip-right.jpg"
  },
  {
    id: "double-strip",
    name: "Double Strip",
    type: "double-strip",
    stripPosition: "both",
    stripColor: "#000000", // Black
    backgroundColor: "#93c5fd", // bg-blue-100
    rotation: 0,
    mainImageBorderColor: "#000000", // Black
    mainImageBorderWidth: 8,
    thumbnail: "/templates/film-strip-double.jpg"
  },
  {
    id: "vintage",
    name: "Vintage",
    type: "vintage",
    stripPosition: "left",
    stripColor: "#3b2c1e", // Dark brown
    backgroundColor: "#e6d7c3", // Light beige
    rotation: 8,
    mainImageBorderColor: "#3b2c1e", // Dark brown
    mainImageBorderWidth: 10,
    thumbnail: "/templates/film-strip-vintage.jpg"
  },
  {
    id: "modern",
    name: "Modern",
    type: "modern",
    stripPosition: "left",
    stripColor: "#1e293b", // slate-800
    backgroundColor: "#f1f5f9", // slate-100
    rotation: 0,
    mainImageBorderColor: "#1e293b", // slate-800
    mainImageBorderWidth: 4,
    thumbnail: "/templates/film-strip-modern.jpg"
  }
];

export type FilmStripTemplate = typeof FILM_STRIP_TEMPLATES[0];
export type StripPosition = "left" | "right" | "both";
