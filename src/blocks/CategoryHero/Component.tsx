"use client"

import type React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import Image from "next/image"

interface Category {
  id: string
  title: string
  description?: string
  slug: string
  productCount?: number
}

interface CategoryHeroBlockProps {
  category: Category
  title: string
  description?: string
  backgroundImage?: {
    url: string
    alt: string
  }
  showProductCount: boolean
  layout: "centered" | "left" | "right"
}

export const CategoryHeroBlock: React.FC<CategoryHeroBlockProps> = ({
  category,
  title,
  description,
  backgroundImage,
  showProductCount,
  layout,
}) => {
  const getLayoutClasses = () => {
    switch (layout) {
      case "left":
        return "text-left items-start"
      case "right":
        return "text-right items-end"
      default:
        return "text-center items-center"
    }
  }

  return (
    <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
      {/* Background */}
      {backgroundImage ? (
        <div className="absolute inset-0">
          <Image
            src={backgroundImage.url || "/placeholder.svg"}
            alt={backgroundImage.alt}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5" />
      )}

      {/* Content */}
      <div className="relative h-full flex items-center px-4">
        <div className="max-w-7xl mx-auto w-full">
          <div
            className={`flex flex-col ${getLayoutClasses()} max-w-3xl ${layout === "right" ? "ml-auto" : layout === "centered" ? "mx-auto" : ""}`}
          >
            <Badge className="mb-4 w-fit bg-primary/90 text-primary-foreground">{category.title}</Badge>

            <h1 className={`text-4xl md:text-6xl font-bold mb-6 ${backgroundImage ? "text-white" : "text-foreground"}`}>
              {title}
            </h1>

            {description && (
              <p
                className={`text-lg md:text-xl mb-8 leading-relaxed max-w-2xl ${backgroundImage ? "text-gray-200" : "text-muted-foreground"}`}
              >
                {description}
              </p>
            )}

            {showProductCount && category.productCount && (
              <div className="flex items-center gap-2 mb-8">
                <span className={`text-sm font-medium ${backgroundImage ? "text-gray-300" : "text-muted-foreground"}`}>
                  {category.productCount} {category.productCount === 1 ? "Product" : "Products"} Available
                </span>
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              className={`w-fit ${backgroundImage ? "border-white text-white hover:bg-white hover:text-gray-900" : ""}`}
              onClick={() => {
                const nextSection = document.querySelector("[data-scroll-target]")
                nextSection?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              Explore Collection
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
