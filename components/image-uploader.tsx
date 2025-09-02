"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploaderProps {
  imagePreview: string | null;
  onImageUpload: (file: File | null) => void;
}

export default function ImageUploader({
  imagePreview,
  onImageUpload,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onImageUpload(file);
  };

  const handleRemoveImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageUpload(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center justify-center w-full">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          id="image-upload"
        />

        {!imagePreview ? (
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-10 h-10 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PNG, JPG or WEBP (MAX. 10MB)
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="relative w-full rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-64 object-contain bg-checkerboard"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white"
              onClick={handleRemoveImage}
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="mt-2"
        >
          <Upload className="w-4 h-4 mr-2" />
          {imagePreview ? "Change Image" : "Upload Image"}
        </Button>
      </div>
    </div>
  );
}