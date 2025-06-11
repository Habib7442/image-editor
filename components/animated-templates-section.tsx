"use client";

import MediaCard from "@/components/media-card";
import { ANIMATED_TEMPLATES } from "@/lib/animated-templates";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AnimatedTemplatesSectionProps {
  title?: string;
  showSeeAll?: boolean;
  limit?: number;
  showPlatformTabs?: boolean;
}

const AnimatedTemplatesSection = ({
  title = "Animated Templates",
  showSeeAll = true,
  limit = 8,
  showPlatformTabs = true,
}: AnimatedTemplatesSectionProps) => {
  const [activePlatform, setActivePlatform] = useState<string>("all");
  
  // Filter templates based on active platform
  const filteredTemplates = activePlatform === "all" 
    ? ANIMATED_TEMPLATES.slice(0, limit)
    : ANIMATED_TEMPLATES.filter(template => template.platform === activePlatform).slice(0, limit);

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
        
        {showPlatformTabs && (
          <Tabs defaultValue="all" onValueChange={setActivePlatform} className="mb-8">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="instagram">Instagram</TabsTrigger>
              <TabsTrigger value="snapchat">Snapchat</TabsTrigger>
              <TabsTrigger value="tiktok">TikTok</TabsTrigger>
            </TabsList>
          </Tabs>
        )}
        
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredTemplates.map((template) => (
            <MediaCard
              key={template.id}
              id={template.id}
              name={template.name}
              imageSrc={template.thumbnail}
              category={`${template.platform} ${template.type}`}
              isPremium={template.isPremium}
              isVideo={true} // Animated templates are treated as videos
              href={template.href}
            />
          ))}
        </div>
        
        {filteredTemplates.length === 0 && (
          <div className="flex justify-center items-center py-12">
            <p className="text-muted-foreground">No templates found for this platform.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default AnimatedTemplatesSection;