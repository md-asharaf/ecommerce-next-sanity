import NewsLetter from "@/components/home/news-letter"
import CatgeoryShortcuts from "@/components/home/category-shortcuts"
import HeroBanners from "@/components/home/hero-banners"
import Features from "@/components/home/features"
import BestSellingProducts from "@/components/home/best-selling-products"
import FeaturedProducts from "@/components/home/featured-products"


export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <HeroBanners />
      <Features />
      <FeaturedProducts />
      <BestSellingProducts />
      <CatgeoryShortcuts />
      <NewsLetter />
    </div>
  )
}
