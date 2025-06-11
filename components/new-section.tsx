"use client";

import MediaCard from "@/components/media-card";
import { NEW_TEMPLATES } from "@/utils/new";

interface NewSectionProps {
  title?: string;
  showSeeAll?: boolean;
  limit?: number;
}

const NewSection = ({
  title = "New",
  showSeeAll = true,
  limit = 4,
}: NewSectionProps) => {
  const templates = NEW_TEMPLATES.slice(0, limit);

  return (
    <section className="py-8">
      <div className="container px-4 md:px-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          {showSeeAll && (
            <a
              href="/templates"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              See All
            </a>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {templates.map((template) => (
            <MediaCard
              key={template.id}
              id={template.id}
              name={template.name}
              imageSrc={template.img}
              category={template.category}
              isPremium={template.isPremium}
              isVideo={template.isVideo}
              href={template.href}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewSection;
