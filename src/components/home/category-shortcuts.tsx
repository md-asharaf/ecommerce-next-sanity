import { getAllCategories } from "@/sanity/lib/category/getAllCategories"
import Link from "next/link";
import { Card, CardContent } from "../ui/card";

const CatgeoryShortcuts = async () => {
    const {items:categories} = await getAllCategories(1,6);
    const categoryProductCount = Math.random() * 2000;
  return (
    <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
            <p className="text-gray-600">
              Explore our wide range of categories to find exactly what you're looking for
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <Link href={`/categories/${category.slug?.current}`} key={index} className="no-underline">
              <Card key={index} className="group cursor-pointer hover:shadow-lg transition-shadow overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                    <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
                      <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                      <p className="text-sm opacity-90">{categoryProductCount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              </Link>
              
            ))}
          </div>
        </div>
      </section>
  )
}

export default CatgeoryShortcuts