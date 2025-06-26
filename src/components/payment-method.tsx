"use client"
import { CreditCard } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { useState } from 'react'
import { Input } from './ui/input'

const PaymentMethod = () => {
    const [paymentMethod, setPaymentMethod] = useState('card')
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Method
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2 rounded-lg border p-4">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex-1 cursor-pointer">
                            Credit or Debit Card
                        </Label>
                        <div className="flex gap-2">
                            <div className="h-6 w-8 rounded bg-gray-200"></div>
                            <div className="h-6 w-8 rounded bg-gray-200"></div>
                            <div className="h-6 w-8 rounded bg-gray-200"></div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg border p-4">
                        <RadioGroupItem value="paypal" id="paypal" />
                        <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                            PayPal
                        </Label>
                        <div className="h-6 w-16 rounded bg-gray-200"></div>
                    </div>
                </RadioGroup>

                {paymentMethod === "card" && (
                    <div className="space-y-4 pt-4">
                        <div>
                            <Label htmlFor="cardNumber">Card number</Label>
                            <Input id="cardNumber" placeholder="1234 5678 9012 3456" className="mt-1" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="expiry">Expiry date</Label>
                                <Input id="expiry" placeholder="MM/YY" className="mt-1" />
                            </div>
                            <div>
                                <Label htmlFor="cvc">CVC</Label>
                                <Input id="cvc" placeholder="123" className="mt-1" />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="cardName">Name on card</Label>
                            <Input id="cardName" placeholder="John Doe" className="mt-1" />
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default PaymentMethod