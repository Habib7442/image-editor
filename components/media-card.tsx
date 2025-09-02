"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaCardProps {
  id: string;
  name: string;
  imageSrc: string;
  category: string;
  isPremium?: boolean;
  isVideo?: boolean;
  onClick?: () => void;
  href?: string;
}

const MediaCard = ({
  id,
  name,
  imageSrc,
  category,
  isPremium = false,
  isVideo = false,
  onClick,
  href,
}: MediaCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const cardContent = (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-xl",
        isHovered && "scale-[1.02]"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image/Video Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        <Image
          src={imageSrc}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />

        {/* Video play button removed for cleaner interface */}

        {/* Premium Badge */}
        {isPremium && (
          <div className="absolute right-2 top-2 rounded-full bg-white p-1.5 shadow-md">
            <Crown className="h-5 w-5 text-amber-500" />
          </div>
        )}

        {/* Caption */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-8">
          <h3 className="text-lg font-semibold text-white">{name}</h3>
        </div>
      </div>
    </div>
  );

  // If href is undefined and onClick is provided, don't use Link
  if (!href && onClick) {
    return (
      <div className="block cursor-pointer" onClick={onClick}>
        {cardContent}
      </div>
    );
  }

  // If href is provided, use it, otherwise construct a path to the editor
  const linkPath = href || `/templates/editor/${id}`;

  return (
    <Link href={linkPath} className="block" onClick={onClick}>
      {cardContent}
    </Link>
  );
};

export default MediaCard;
