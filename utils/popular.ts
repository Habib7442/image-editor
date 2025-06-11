import PopularTemplate1 from "@/app/(root)/templates/popular/template1/page";

export interface PopularTemplate {
  id: string;
  name: string;
  img: string;
  category: string;
  type: string;
  component: React.ComponentType<Record<string, unknown>>;
  isPremium?: boolean;
  isVideo?: boolean;
  href?: string;
}

export const POPULAR_TEMPLATES: PopularTemplate[] = [
  {
    id: "1",
    name: "Beach Vibes",
    img: "/templates/post-template-1.jpg",
    category: "instagram",
    type: "popular",
    component: PopularTemplate1,
    href: "/templates/editor/1",
  },
];
