import { Card, CardContent } from '../ui/card'
import { Lock, Package, Truck } from 'lucide-react'

const TrustBadges = () => {
    return (
        <Card>
            <CardContent className="pt-6">
                <div className="text-center space-y-4">
                    <h3 className="font-semibold text-gray-900">Secure Checkout</h3>
                    <div className="flex justify-center items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                            <Lock className="h-3 w-3" />
                            SSL Encrypted
                        </div>
                        <div className="flex items-center gap-1">
                            <Package className="h-3 w-3" />
                            Free Returns
                        </div>
                        <div className="flex items-center gap-1">
                            <Truck className="h-3 w-3" />
                            Fast Shipping
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default TrustBadges