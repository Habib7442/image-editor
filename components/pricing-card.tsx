import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

interface PricingFeature {
  text: string
}

interface PricingCardProps {
  title: string
  price: string
  description: string
  features: PricingFeature[]
  popular?: boolean
  buttonText: string
}

const PricingCard = ({
  title,
  price,
  description,
  features,
  popular = false,
  buttonText
}: PricingCardProps) => {
  return (
    <div className={`rounded-xl p-6 ${
      popular 
        ? "bg-gradient-to-b from-purple-500 to-pink-500 text-white" 
        : "bg-white border border-gray-200"
    }`}>
      {popular && (
        <div className="bg-white text-purple-600 text-xs font-semibold px-3 py-1 rounded-full w-fit mb-4">
          MOST POPULAR
        </div>
      )}
      <h3 className={`text-xl font-bold ${popular ? "text-white" : "text-gray-900"}`}>{title}</h3>
      <div className="mt-4 flex items-baseline">
        <span className={`text-3xl font-extrabold ${popular ? "text-white" : "text-gray-900"}`}>{price}</span>
        {price !== "Free" && <span className={`ml-1 text-sm ${popular ? "text-white/80" : "text-gray-500"}`}>/month</span>}
      </div>
      <p className={`mt-2 text-sm ${popular ? "text-white/80" : "text-gray-500"}`}>{description}</p>
      
      <ul className="mt-6 space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <div className={`flex-shrink-0 ${popular ? "text-white" : "text-purple-500"}`}>
              <Check size={18} />
            </div>
            <span className={`ml-2 text-sm ${popular ? "text-white" : "text-gray-600"}`}>{feature.text}</span>
          </li>
        ))}
      </ul>
      
      <Button 
        variant={popular ? "default" : "outline"} 
        className={`mt-6 w-full ${
          popular 
            ? "bg-white text-purple-600 hover:bg-gray-100" 
            : "border-purple-600 text-purple-600 hover:bg-purple-50"
        }`}
      >
        {buttonText}
      </Button>
    </div>
  )
}

export default PricingCard