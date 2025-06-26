import { RefreshCw, Shield, Star, Truck } from 'lucide-react'
const features = [
    {
        icon: Truck,
        title: "Free Shipping",
        description: "Free shipping on orders over $50",
    },
    {
        icon: RefreshCw,
        title: "Easy Returns",
        description: "30-day hassle-free returns",
    },
    {
        icon: Shield,
        title: "Secure Payment",
        description: "Your payment information is safe",
    },
    {
        icon: Star,
        title: "Quality Guarantee",
        description: "We stand behind our products",
    },
]
const Features = () => {

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                                <feature.icon className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Features