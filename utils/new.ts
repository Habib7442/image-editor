import NewYearsEveTemplate from "@/app/(root)/templates/new/template1/page";

export interface NewTemplate {
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

export const NEW_TEMPLATES: NewTemplate[] = [
  {
    id: "new-1",
    name: "New Year's Eve",
    img: "/templates/new-template-1.jpg",
    category: "instagram",
    type: "new",
    component: NewYearsEveTemplate,
    href: "/templates/editor/new-1",
  },
];
