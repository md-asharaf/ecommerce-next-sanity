"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageGalleryProps {
  images: string[]
  productTitle: string
  discountPercentage?: number
}

export function ImageGallery({ images, productTitle, discountPercentage }: ImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [mainImage, setMainImage] = useState(images[0])

  const nextImage = () => {
    const nextIndex = (currentImageIndex + 1) % images.length
    setCurrentImageIndex(nextIndex)
    setMainImage(images[nextIndex])
  }

  const prevImage = () => {
    const prevIndex = (currentImageIndex - 1 + images.length) % images.length
    setCurrentImageIndex(prevIndex)
    setMainImage(images[prevIndex])
  }

  const selectImage = (index: number) => {
    setCurrentImageIndex(index)
    setMainImage(images[index])
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-lg border bg-gray-100">
        <Image
          src={mainImage || "/placeholder.svg"}
          alt={productTitle}
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
        {discountPercentage && discountPercentage > 0 && (
          <div className="absolute left-4 top-4 rounded-full bg-rose-500 px-3 py-1 text-xs font-medium text-white">
            {discountPercentage}% OFF
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-between p-4">
          <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full opacity-80" onClick={prevImage}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full opacity-80" onClick={nextImage}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button
            key={index}
            className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border ${
              currentImageIndex === index ? "ring-2 ring-rose-500" : ""
            }`}
            onClick={() => selectImage(index)}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`${productTitle} thumbnail ${index + 1}`}
              fill
              className="object-cover object-center"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
