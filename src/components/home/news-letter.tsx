"use client"
import { useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { toast } from 'sonner'

const NewsLetter = () => {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const handleSubscription = () => {
    if (isSubscribed) {
      setIsSubscribed(false);
      toast.success('You have unsubscribed from the newsletter.')
    } else {
      if (!email) {
        toast.error('Please enter a valid email address.')
        return;
      }
      setIsSubscribed(true)
      toast.success('Thank you for subscribing to our newsletter!')
    }
  }
  return (
    <section className="py-16 bg-blue-600">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Stay Updated with Our Latest Offers</h2>
        <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
          Subscribe to our newsletter and be the first to know about new products, exclusive deals, and special
          promotions.
        </p>

        <div className="max-w-md mx-auto flex gap-4">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white"
          />
          <Button onClick={handleSubscription} variant="secondary">{isSubscribed ? 'Unsubscribe' : 'Subscribe'}</Button>
        </div>
      </div>
    </section>
  )
}

export default NewsLetter