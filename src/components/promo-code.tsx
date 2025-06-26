"use client"
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Button } from './ui/button'
interface PromoCodeProps {
    onApplyPromo: (code: string) => void;
}
export const PromoCode = ({ onApplyPromo }: PromoCodeProps) => {
    const [promoCode, setPromoCode] = useState('')
    const [promoApplied, setPromoApplied] = useState(false)
    const applyPromoCode = () => {
        if (!promoCode) return;
        onApplyPromo(promoCode)
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Promo Code</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-2">
                    <Input
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        disabled={promoApplied}
                    />
                    <Button
                        onClick={applyPromoCode}
                        disabled={!promoCode || promoApplied}
                        variant={promoApplied ? "secondary" : "default"}
                    >
                        {promoApplied ? "Applied" : "Apply"}
                    </Button>
                </div>
                {promoApplied && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                        <span>✓ SAVE10 applied - 10% off</span>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
