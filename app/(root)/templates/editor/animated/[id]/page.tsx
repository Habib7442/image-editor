"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ANIMATED_TEMPLATES } from "@/lib/animated-templates";
import AnimatedTemplate from "@/components/animated-template";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function AnimatedTemplateEditor() {
  const params = useParams();
  // Unwrap params using React.use()
  const unwrappedParams = React.use(params);
  const templateId = unwrappedParams.id as string;

  const [template, setTemplate] = useState<typeof ANIMATED_TEMPLATES[0] | null>(null);
  const [selectedImage, setSelectedImage] = useState("/placeholder.jpg");
  const [effectsIntensity, setEffectsIntensity] = useState<Record<string, number>>({});
  const [activeEffects, setActiveEffects] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Find the template by ID
    const foundTemplate = ANIMATED_TEMPLATES.find(t => t.id === templateId);
    if (foundTemplate) {
      setTemplate(foundTemplate);

      // Initialize effects intensity and active state
      const intensityDefaults: Record<string, number> = {};
      const activeDefaults: Record<string, boolean> = {};

      foundTemplate.effects.forEach(effect => {
        intensityDefaults[effect] = 50; // Default to 50%
        activeDefaults[effect] = true; // Default to active
      });

      setEffectsIntensity(intensityDefaults);
      setActiveEffects(activeDefaults);
    }
  }, [templateId]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const handleIntensityChange = (effect: string, value: number[]) => {
    setEffectsIntensity(prev => ({
      ...prev,
      [effect]: value[0]
    }));
  };

  const handleEffectToggle = (effect: string, checked: boolean) => {
    setActiveEffects(prev => ({
      ...prev,
      [effect]: checked
    }));
  };

  if (!template) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-screen">
        <p>Template not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">{template.name} Editor</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Preview Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                {template.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="w-full max-w-md">
                <AnimatedTemplate
                  id={template.id}
                  name={template.name}
                  animationType={template.animation as any}
                  imageSrc={selectedImage}
                  aspectRatio={template.aspectRatio}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls Section */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Controls</CardTitle>
              <CardDescription>
                Customize your template
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="media">
                <TabsList className="w-full">
                  <TabsTrigger value="media" className="flex-1">Media</TabsTrigger>
                  <TabsTrigger value="effects" className="flex-1">Effects</TabsTrigger>
                  <TabsTrigger value="animation" className="flex-1">Animation</TabsTrigger>
                </TabsList>

                <TabsContent value="media" className="space-y-4 pt-4">
                  <div>
                    <Label htmlFor="image-upload">Upload Image</Label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      className="w-full mt-2"
                      onClick={() => document.getElementById('image-upload')?.click()}
                    >
                      Choose Image
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="effects" className="space-y-6 pt-4">
                  {template.effects.map(effect => (
                    <div key={effect} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`effect-${effect}`}
                            checked={activeEffects[effect]}
                            onCheckedChange={(checked) => 
                              handleEffectToggle(effect, checked as boolean)
                            }
                          />
                          <Label htmlFor={`effect-${effect}`} className="capitalize">
                            {effect.replace(/-/g, ' ')}
                          </Label>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {effectsIntensity[effect]}%
                        </span>
                      </div>
                      <Slider
                        disabled={!activeEffects[effect]}
                        value={[effectsIntensity[effect]]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={(value) => handleIntensityChange(effect, value)}
                      />
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="animation" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Animation Type</Label>
                    <div className="p-4 rounded-md bg-muted">
                      <p className="text-sm font-medium">{template.animation}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Duration</Label>
                    <div className="p-4 rounded-md bg-muted">
                      <p className="text-sm font-medium">{template.duration} seconds</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="pt-4">
                <Button className="w-full">Save Template</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
