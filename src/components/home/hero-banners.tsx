"use client"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import { Button } from "../ui/button"

const HeroBanners = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const heroSlides = [
    {
      title: "Summer Collection 2024",
      subtitle: "Discover the latest trends",
      description: "Shop our curated selection of premium products with up to 50% off",
      image: "/placeholder.svg?height=600&width=800",
      cta: "Shop Now",
    },
    {
      title: "Tech Innovation",
      subtitle: "Future is here",
      description: "Explore cutting-edge technology that transforms your daily life",
      image: "/placeholder.svg?height=600&width=800",
      cta: "Explore Tech",
    },
    {
      title: "Sustainable Living",
      subtitle: "Eco-friendly choices",
      description: "Make a difference with our environmentally conscious products",
      image: "/placeholder.svg?height=600&width=800",
      cta: "Go Green",
    },
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }
  return (<section className="relative h-[600px] overflow-hidden">
    <div className="absolute inset-0">
      <img
        src={heroSlides[currentSlide].image || "/placeholder.svg"}
        alt="Hero"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />
    </div>

    <div className="relative container mx-auto px-4 h-full flex items-center">
      <div className="max-w-2xl text-white">
        <p className="text-lg mb-2 opacity-90">{heroSlides[currentSlide].subtitle}</p>
        <h1 className="text-5xl md:text-6xl font-bold mb-6">{heroSlides[currentSlide].title}</h1>
        <p className="text-xl mb-8 opacity-90">{heroSlides[currentSlide].description}</p>
        <Button size="lg" className="bg-white text-black hover:bg-gray-100">
          {heroSlides[currentSlide].cta}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>

    {/* Slider Controls */}
    <button
      onClick={prevSlide}
      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
    >
      <ChevronLeft className="h-6 w-6 text-white" />
    </button>
    <button
      onClick={nextSlide}
      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
    >
      <ChevronRight className="h-6 w-6 text-white" />
    </button>

    {/* Slider Indicators */}
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
      {heroSlides.map((_, index) => (
        <button
          key={index}
          onClick={() => setCurrentSlide(index)}
          className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? "bg-white" : "bg-white/50"
            }`}
        />
      ))}
    </div>
  </section>)
}

export default HeroBanners;
