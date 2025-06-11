"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { POPULAR_TEMPLATES } from "@/utils/popular";
import { NEW_TEMPLATES } from "@/utils/new";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { setTemplateId } from "@/lib/redux/slices/templateEditorSlice";

export default function TemplateEditorPage({ params }: { params: { id: string } }) {
  // Unwrap params using React.use()
  const unwrappedParams = React.use(params);
  const router = useRouter();
  const dispatch = useDispatch();
  const [template, setTemplate] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find the template from both popular and new templates
    const foundTemplate =
      POPULAR_TEMPLATES.find((t) => t.id === unwrappedParams.id) ||
      NEW_TEMPLATES.find((t) => t.id === unwrappedParams.id);

    if (foundTemplate) {
      setTemplate(foundTemplate);
      dispatch(setTemplateId(unwrappedParams.id));
    } else {
      // If template not found, redirect to templates page
      router.push("/templates");
    }

    setLoading(false);
  }, [unwrappedParams.id, router, dispatch]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-t-4 border-gray-200 border-t-blue-500 mx-auto"></div>
          <p>Loading template...</p>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-xl">Template not found</p>
          <Button asChild>
            <Link href="/templates">Back to Templates</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Dynamically render the template component
  const TemplateComponent = template.component;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 flex items-center">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href="/templates">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{template.name}</h1>
        </div>

        <div className="rounded-lg border bg-card shadow-sm">
          <TemplateComponent />
        </div>
      </div>
    </div>
  );
}
