import Image from "next/image"
import { cn } from "@/lib/utils"

interface FeatureCardProps {
  title: string
  description: string
  icon: string
  className?: string
}

const FeatureCard = ({ title, description, icon, className }: FeatureCardProps) => {
  return (
    <div className={cn(
      "bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow",
      className
    )}>
      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
        <Image src={icon} alt={title} width={24} height={24} />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  )
}

export default FeatureCard