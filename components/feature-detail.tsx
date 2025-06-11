"use client";

import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import FeatureShowcase from "@/components/feature-showcase";

interface FeatureItem {
  title: string;
  description: string;
  image: string;
}

interface FeatureDetailProps {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  color: string;
  darkColor: string;
  textColor: string;
  features: FeatureItem[];
}

export default function FeatureDetail({
  id,
  title,
  description,
  icon,
  color,
  darkColor,
  textColor,
  features,
}: FeatureDetailProps) {
  // Convert the feature title to a URL-friendly format
  const featureLink = title.toLowerCase().replace(/\s+/g, '-');

  return (
    <section id={id} className="py-24 relative overflow-hidden">
      {/* Decorative background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${color.replace('from-', 'from-').replace('to-', 'to-')}/5 ${darkColor.replace('dark:from-', 'dark:from-').replace('dark:to-', 'dark:to-')}/10 -z-10`}></div>
      
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column: Feature description */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className={`p-3 w-fit rounded-xl bg-gradient-to-br ${color} ${darkColor}`}>
              <div className={`${textColor}`}>
                {icon}
              </div>
            </div>
            
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              {title}
            </h2>
            
            <p className="text-xl text-muted-foreground">
              {description}
            </p>
            
            <ul className="space-y-4 mt-6">
              {features.map((feature, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className={`p-1 rounded-full bg-gradient-to-br ${color} ${darkColor} flex-shrink-0 mt-1`}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
            
            <Button asChild className={`mt-8 rounded-full bg-gradient-to-r ${color} hover:${color.replace('from-', 'from-').replace('to-', 'to-').replace('500', '600').replace('600', '700')} shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105`}>
              <Link href={`/effects/${featureLink}`} className="px-6 py-5 text-base font-medium">
                Try {title}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
          
          {/* Right column: Feature showcase */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <FeatureShowcase 
              features={features} 
              color={color}
              darkColor={darkColor}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
