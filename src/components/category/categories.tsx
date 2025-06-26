"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Grid, List, ArrowRight, TrendingUp, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExpandedCategory } from "@/types"
import { CategorySearchInput } from "./category-search-input"

export const Categories = ({ categories }: { categories: ExpandedCategory[] }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const filteredCategories = categories.filter(
    (category) =>
      category.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const popularCategories = categories.filter((cat) => cat.isPopular)
  const trendingCategories = categories.filter((cat) => cat.isTrending)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Explore Our Categories</h1>
            <p className="text-xl opacity-90 mb-8">Discover thousands of products across all categories</p>
            <CategorySearchInput searchQuery={searchQuery} onSearchQueryChange={setSearchQuery} />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Popular Categories */}
        {!searchQuery && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Star className="h-6 w-6 text-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-900">Popular Categories</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularCategories.map((category) => (
                <Link key={category._id} href={`/categories/${category.slug?.current}`}>
                  <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <Image
                          src={category.image || "/placeholder.svg"}
                          alt={category.name || "Category Image"}
                          width={400}
                          height={200}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                        <div className="absolute bottom-4 left-4 text-white">
                          <h3 className="font-semibold text-lg">{category.name}</h3>
                          <p className="text-sm opacity-90">{category.productCount} products</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Trending Categories */}
        {!searchQuery && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-6 w-6 text-green-500" />
              <h2 className="text-2xl font-bold text-gray-900">Trending Now</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {trendingCategories.map((category) => (
                <Link key={category._id} href={`/categories/${category.slug?.current}`}>
                  <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <Image
                            src={category.image || "/placeholder.svg"}
                            alt={category.name || "Category Image"}
                            width={80}
                            height={80}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <Badge className="absolute -top-2 -right-2 bg-green-500">Trending</Badge>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                            {category.name}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2">{category.description}</p>
                          <p className="text-gray-500 text-sm">{category.productCount} products</p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* All Categories */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {searchQuery ? `Search Results (${filteredCategories.length})` : "All Categories"}
            </h2>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCategories.map((category) => (
                <Link key={category._id} href={`/categories/${category.slug?.current}`}>
                  <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <Image
                          src={category.image || "/placeholder.svg"}
                          alt={category.name || "Category Image"}
                          width={400}
                          height={250}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                        {category.isPopular && <Badge className="absolute top-4 left-4 bg-yellow-500">Popular</Badge>}
                        {category.isTrending && <Badge className="absolute top-4 right-4 bg-green-500">Trending</Badge>}
                      </div>
                      <div className="p-6">
                        <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                          {category.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">{category.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500 text-sm">{category.productCount} products</span>
                          <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCategories.map((category) => (
                <Link key={category._id} href={`/categories/${category.slug?.current}`}>
                  <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-6">
                        <div className="relative">
                          <Image
                            src={category.image || "/placeholder.svg"}
                            alt={category.name || "Category Image"}
                            width={120}
                            height={120}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                          {category.isPopular && (
                            <Badge className="absolute -top-2 -left-2 bg-yellow-500">Popular</Badge>
                          )}
                          {category.isTrending && (
                            <Badge className="absolute -top-2 -right-2 bg-green-500">Trending</Badge>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-xl text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                            {category.name}
                          </h3>
                          <p className="text-gray-600 mb-3">{category.description}</p>
                          <p className="text-gray-500 mb-3">{category.productCount} products available</p>
                        </div>
                        <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>

        {filteredCategories.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-600">Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </div>
  )
}
