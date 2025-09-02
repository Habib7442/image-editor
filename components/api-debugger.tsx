"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function ApiDebugger() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testApi = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Testing API with simple request");
      
      const formData = new FormData();
      formData.append("prompt", "Tell me about image editing");
      
      const response = await fetch("/api/gemini", {
        method: "POST",
        body: formData,
      });
      
      console.log("Response status:", response.status);
      
      const data = await response.json();
      console.log("API test response:", data);
      
      setResult(data);
    } catch (err) {
      console.error("API test error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg mb-8">
      <h2 className="text-lg font-semibold mb-4">API Debugger</h2>
      
      <Button 
        onClick={testApi}
        disabled={loading}
        className="mb-4"
      >
        {loading ? "Testing..." : "Test API"}
      </Button>
      
      {error && (
        <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded mb-4">
          {error}
        </div>
      )}
      
      {result && (
        <div className="mt-4">
          <h3 className="font-medium mb-2">API Response:</h3>
          <pre className="p-3 bg-gray-100 dark:bg-gray-800 rounded overflow-auto text-xs">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}