"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  Filter,
  Search,
  Camera,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  TrendingUp,
  Award,
  Users,
} from "lucide-react"
import Link from "next/link"

// Mock data for reviews
const mockReviews = [
  {
    id: 1,
    user: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
      totalReviews: 23,
    },
    rating: 5,
    title: "Absolutely love this product!",
    content:
      "This product exceeded my expectations. The quality is outstanding and it arrived exactly as described. I've been using it for 3 months now and it still looks brand new. Highly recommend to anyone considering this purchase.",
    date: "2024-01-15",
    helpful: 24,
    notHelpful: 2,
    verified: true,
    images: ["/placeholder.svg?height=100&width=100", "/placeholder.svg?height=100&width=100"],
    variant: "Blue, Size M",
  },
  {
    id: 2,
    user: {
      name: "Mike Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
      totalReviews: 8,
    },
    rating: 4,
    title: "Great value for money",
    content:
      "Really solid product for the price point. The build quality is good and it does exactly what it's supposed to do. Only minor complaint is that the packaging could be better, but the product itself is excellent.",
    date: "2024-01-10",
    helpful: 18,
    notHelpful: 1,
    verified: true,
    images: [],
    variant: "Red, Size L",
  },
  {
    id: 3,
    user: {
      name: "Emily Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: false,
      totalReviews: 1,
    },
    rating: 3,
    title: "It's okay, but has some issues",
    content:
      "The product is decent but not amazing. It works as advertised but I've noticed some minor quality issues after a few weeks of use. Customer service was helpful when I reached out though.",
    date: "2024-01-05",
    helpful: 7,
    notHelpful: 3,
    verified: false,
    images: ["/placeholder.svg?height=100&width=100"],
    variant: "Green, Size S",
  },
  {
    id: 4,
    user: {
      name: "David Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
      totalReviews: 45,
    },
    rating: 5,
    title: "Perfect for my needs",
    content:
      "I've tried several similar products and this one is by far the best. The attention to detail is impressive and it's clear that a lot of thought went into the design. Will definitely buy again.",
    date: "2023-12-28",
    helpful: 31,
    notHelpful: 0,
    verified: true,
    images: [],
    variant: "Black, Size XL",
  },
]

const ratingDistribution = [
  { stars: 5, count: 156, percentage: 65 },
  { stars: 4, count: 48, percentage: 20 },
  { stars: 3, count: 24, percentage: 10 },
  { stars: 2, count: 7, percentage: 3 },
  { stars: 1, count: 5, percentage: 2 },
]

export default function ProductReviewsPage() {
  const [reviews, setReviews] = useState(mockReviews)
  const [sortBy, setSortBy] = useState("newest")
  const [filterRating, setFilterRating] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showWriteReview, setShowWriteReview] = useState(false)
  const [newReview, setNewReview] = useState({
    rating: 0,
    title: "",
    content: "",
    images: [],
  })

  const totalReviews = 240
  const averageRating = 4.3

  const renderStars = (rating: number, size: "sm" | "md" | "lg" = "sm") => {
    const sizeClasses = {
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-6 w-6",
    }

    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    )
  }

  const handleWriteReview = () => {
    // Handle review submission
    console.log("Submitting review:", newReview)
    setShowWriteReview(false)
    setNewReview({ rating: 0, title: "", content: "", images: [] })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900">
              Home
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-gray-900">
              Products
            </Link>
            <span>/</span>
            <Link href="/product/wireless-headphones" className="hover:text-gray-900">
              Wireless Headphones
            </Link>
            <span>/</span>
            <span className="text-gray-900">Reviews</span>
          </nav>
        </div>
      </div>

      {/* Product Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <img
              src="/placeholder.svg?height=120&width=120"
              alt="Product"
              className="w-24 h-24 md:w-30 md:h-30 rounded-lg object-cover bg-white/10"
            />
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Premium Wireless Headphones</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-2">
                  {renderStars(Math.round(averageRating), "md")}
                  <span className="text-xl font-semibold">{averageRating}</span>
                </div>
                <span className="text-white/80">({totalReviews} reviews)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-white/20 text-white">
                  <Award className="h-3 w-3 mr-1" />
                  Top Rated
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white">
                  <Users className="h-3 w-3 mr-1" />
                  {totalReviews}+ Reviews
                </Badge>
              </div>
            </div>
            <Dialog open={showWriteReview} onOpenChange={setShowWriteReview}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Write a Review
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Write a Review</DialogTitle>
                  <DialogDescription>
                    Share your experience with this product to help other customers.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div>
                    <Label className="text-base font-medium">Rating</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setNewReview({ ...newReview, rating: star })}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`h-8 w-8 ${
                              star <= newReview.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300 hover:text-yellow-400"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="title">Review Title</Label>
                    <Input
                      id="title"
                      placeholder="Summarize your review in a few words"
                      value={newReview.title}
                      onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="content">Your Review</Label>
                    <Textarea
                      id="content"
                      placeholder="Tell others about your experience with this product..."
                      value={newReview.content}
                      onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                      className="mt-2 min-h-[120px]"
                    />
                  </div>
                  <div>
                    <Label>Add Photos (Optional)</Label>
                    <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Camera className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">Click to upload photos</p>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <Button variant="outline" onClick={() => setShowWriteReview(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleWriteReview} disabled={!newReview.rating || !newReview.content}>
                      Submit Review
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Rating Overview */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Rating Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900">{averageRating}</div>
                  <div className="flex justify-center mt-2">{renderStars(Math.round(averageRating), "md")}</div>
                  <p className="text-sm text-gray-600 mt-1">Based on {totalReviews} reviews</p>
                </div>

                <Separator />

                <div className="space-y-3">
                  {ratingDistribution.map((item) => (
                    <div key={item.stars} className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1 w-12">
                        <span className="text-sm">{item.stars}</span>
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      </div>
                      <Progress value={item.percentage} className="flex-1" />
                      <span className="text-sm text-gray-600 w-8">{item.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Filter Options */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="h-5 w-5" />
                  <span>Filters</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Rating</Label>
                  <Select value={filterRating} onValueChange={setFilterRating}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Ratings</SelectItem>
                      <SelectItem value="5">5 Stars</SelectItem>
                      <SelectItem value="4">4 Stars</SelectItem>
                      <SelectItem value="3">3 Stars</SelectItem>
                      <SelectItem value="2">2 Stars</SelectItem>
                      <SelectItem value="1">1 Star</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Show Only</Label>
                  <div className="mt-2 space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Verified purchases</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">With photos</span>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Reviews */}
          <div className="lg:col-span-3">
            {/* Search and Sort */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search reviews..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="highest">Highest Rating</SelectItem>
                  <SelectItem value="lowest">Lowest Rating</SelectItem>
                  <SelectItem value="helpful">Most Helpful</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={review.user.avatar || "/placeholder.svg"} alt={review.user.name} />
                        <AvatarFallback>
                          {review.user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold">{review.user.name}</h4>
                            {review.user.verified && (
                              <Badge variant="secondary" className="text-xs">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                            <span className="text-sm text-gray-500">{review.user.totalReviews} reviews</span>
                          </div>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>

                        <div className="flex items-center space-x-2 mb-3">
                          {renderStars(review.rating)}
                          {review.verified && (
                            <Badge variant="outline" className="text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified Purchase
                            </Badge>
                          )}
                        </div>

                        <h5 className="font-medium mb-2">{review.title}</h5>
                        <p className="text-gray-700 mb-3">{review.content}</p>

                        {review.variant && (
                          <p className="text-sm text-gray-500 mb-3">
                            <strong>Variant:</strong> {review.variant}
                          </p>
                        )}

                        {review.images.length > 0 && (
                          <div className="flex space-x-2 mb-4">
                            {review.images.map((image, index) => (
                              <img
                                key={index}
                                src={image || "/placeholder.svg"}
                                alt={`Review image ${index + 1}`}
                                className="w-16 h-16 rounded-lg object-cover cursor-pointer hover:opacity-80"
                              />
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900">
                              <ThumbsUp className="h-4 w-4" />
                              <span>Helpful ({review.helpful})</span>
                            </button>
                            <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900">
                              <ThumbsDown className="h-4 w-4" />
                              <span>Not Helpful ({review.notHelpful})</span>
                            </button>
                          </div>
                          <Button variant="ghost" size="sm">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            Report
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <Button variant="outline" size="lg">
                Load More Reviews
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
