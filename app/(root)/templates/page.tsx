"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import MediaCard from "@/components/media-card";
import { POPULAR_TEMPLATES } from "@/utils/popular";
import { NEW_TEMPLATES } from "@/utils/new";
import { ANIMATED_TEMPLATES } from "@/lib/animated-templates";

// Define a unified template type
interface Template {
  id: string;
  name: string;
  img: string;
  category: string;
  type: string;
  isPremium?: boolean;
  isVideo?: boolean;
  href?: string;
  platform?: string;
  thumbnail?: string;
}

export default function TemplatesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [availableTemplates, setAvailableTemplates] = useState<Template[]>([]);

  // Initialize available templates
  useEffect(() => {
    // Convert all templates to a unified format
    const popularTemplates = POPULAR_TEMPLATES.map(template => ({
      ...template,
      img: template.img,
      category: template.category,
      type: template.type
    }));

    const newTemplates = NEW_TEMPLATES.map(template => ({
      ...template,
      img: template.img,
      category: template.category,
      type: template.type
    }));

    const animatedTemplates = ANIMATED_TEMPLATES.map(template => ({
      ...template,
      id: template.id,
      name: template.name,
      img: template.thumbnail,
      category: `${template.platform} ${template.type}`,
      type: "animated",
      isVideo: true,
      href: template.href
    }));

    // Combine all templates
    const allTemplates = [...popularTemplates, ...newTemplates, ...animatedTemplates];

    // Set available templates
    setAvailableTemplates(allTemplates);
  }, []);

  // Filter templates based on active tab
  const filteredTemplates = templates.filter(template => {
    if (activeTab === "all") return true;
    return template.category.toLowerCase().includes(activeTab.toLowerCase());
  });

  // Delete all templates
  const handleDeleteAll = () => {
    setTemplates([]);
  };

  // Add a template
  const handleAddTemplate = (template: Template) => {
    setTemplates(prev => [...prev, template]);
    setAvailableTemplates(prev => prev.filter(t => t.id !== template.id));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Templates</h1>
          <Button 
            variant="destructive" 
            onClick={handleDeleteAll}
            disabled={templates.length === 0}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete All
          </Button>
        </div>

        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="instagram">Instagram</TabsTrigger>
            <TabsTrigger value="snapchat">Snapchat</TabsTrigger>
            <TabsTrigger value="tiktok">TikTok</TabsTrigger>
            <TabsTrigger value="facebook">Facebook</TabsTrigger>
            <TabsTrigger value="youtube">YouTube</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {/* Current Templates */}
            {filteredTemplates.length > 0 ? (
              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Your Templates</h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {filteredTemplates.map((template) => (
                    <MediaCard
                      key={template.id}
                      id={template.id}
                      name={template.name}
                      imageSrc={template.img || template.thumbnail || ""}
                      category={template.category}
                      isPremium={template.isPremium}
                      isVideo={template.isVideo}
                      href={template.href}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 mb-12 bg-muted/30 rounded-lg">
                <p className="text-muted-foreground mb-4">No templates added yet.</p>
                <p className="text-muted-foreground mb-4">Add templates from the available templates below.</p>
              </div>
            )}

            {/* Available Templates */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Available Templates</h2>
              {availableTemplates.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {availableTemplates
                    .filter(template => {
                      if (activeTab === "all") return true;
                      return template.category.toLowerCase().includes(activeTab.toLowerCase());
                    })
                    .map((template) => (
                      <div key={template.id} className="relative group">
                        <MediaCard
                          id={template.id}
                          name={template.name}
                          imageSrc={template.img || template.thumbnail || ""}
                          category={template.category}
                          isPremium={template.isPremium}
                          isVideo={template.isVideo}
                          href={undefined} // Disable navigation
                          onClick={(e) => e.preventDefault()} // Prevent default link behavior
                        />
                        <Button 
                          className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          size="sm"
                          onClick={() => handleAddTemplate(template)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="flex items-center justify-center py-12 bg-muted/30 rounded-lg">
                  <p className="text-muted-foreground">All templates have been added.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
