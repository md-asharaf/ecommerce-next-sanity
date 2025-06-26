"use client"
import { SignInButton, useUser } from "@clerk/nextjs"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCartStore } from "@/store/cart"
import { useState, useEffect } from "react"
import { useDebounce } from "use-debounce"
import {
  Home,
  Search,
  Heart,
  User,
  ShoppingBag,
  Menu,
  CreditCard,
  MapPin,
  Settings,
  Grid3X3,
  Tag,
  Sparkles,
  Star,
  HelpCircle,
  MessageCircle,
  LogOut,
} from "lucide-react"
import { Button } from "./ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { UserButton, SignOutButton } from "@clerk/nextjs"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
export const Header = () => {
  const { user } = useUser()
  const router = useRouter()
  const { items } = useCartStore()
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedValue] = useDebounce(searchQuery, 500)

  useEffect(() => {
    if (debouncedValue && debouncedValue.trim() !== "") {
      router.push(`/search?query=${encodeURIComponent(debouncedValue)}`)
    }
  }, [debouncedValue, router])

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-2 md:px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-gray-900 mr-2">
            ShopHub
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex space-x-6">
              <Link href="/categories" className="text-gray-600 hover:text-gray-900">
                Categories
              </Link>
              <Link href="/deals" className="text-gray-600 hover:text-gray-900">
                Deals
              </Link>
              <Link href="/new" className="text-gray-600 hover:text-gray-900">
                New Arrivals
              </Link>
              <Link href="/brands" className="text-gray-600 hover:text-gray-900">
                Brands
              </Link>
            </nav>
          </div>

          {/* Desktop Search */}
          <div className="flex-1 max-w-lg mx-8 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                className="pl-10 pr-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href='/wishlists'>
              <Button variant="ghost" size="icon" className="cursor-pointer">
                <Heart className="h-5 w-5" />
              </Button></Link>

            {user && <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="cursor-pointer">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={user?.imageUrl} />
                    <AvatarFallback>{user ? `${user?.firstName?.charAt(0).toUpperCase()}${user?.lastName?.charAt(0).toUpperCase()}` : <User />}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex items-center space-x-2">
                    <UserButton />
                    <div className="text-sm text-gray-600">
                      {user ? user.fullName : "Guest User"}
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/orders" className="flex items-center">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    My Orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/wishlist" className="flex items-center">
                    <Heart className="mr-2 h-4 w-4" />
                    Wishlist
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/payments" className="flex items-center">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Payment Methods
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/addresses" className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    Addresses
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <div className="flex space-x-2 items-center cursor-pointer">
                    <LogOut />
                    <SignOutButton />
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>

            </DropdownMenu>}
            {!user &&
              <SignInButton mode="modal">
                <Button variant="ghost" size="icon" className="text-xs cursor-pointer">
                  Sign in
                </Button>
              </SignInButton>}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {itemCount}
                </Badge>
              </Button>
            </Link>
          </div>

          {/* Mobile Actions - Only Search, Cart, and Menu */}
          <div className="flex md:hidden items-center md:space-x-2">
            {/* Mobile Search */}
            <div className="flex-1 max-w-xs">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search..."
                  className="pl-10 pr-4 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Mobile Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {itemCount}
                </Badge>
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Navigation</h3>
                    <div className="space-y-2">
                      <Link href="/" className="flex items-center py-2 text-gray-600 hover:text-gray-900">
                        <Home className="mr-3 h-4 w-4" />
                        Home
                      </Link>
                      <Link href="/categories" className="flex items-center py-2 text-gray-600 hover:text-gray-900">
                        <Grid3X3 className="mr-3 h-4 w-4" />
                        Categories
                      </Link>
                      <Link href="/deals" className="flex items-center py-2 text-gray-600 hover:text-gray-900">
                        <Tag className="mr-3 h-4 w-4" />
                        Deals
                      </Link>
                      <Link href="/new" className="flex items-center py-2 text-gray-600 hover:text-gray-900">
                        <Sparkles className="mr-3 h-4 w-4" />
                        New Arrivals
                      </Link>
                      <Link href="/brands" className="flex items-center py-2 text-gray-600 hover:text-gray-900">
                        <Star className="mr-3 h-4 w-4" />
                        Brands
                      </Link>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Account</h3>
                    <div className="space-y-2">
                      <Link href="/orders" className="flex items-center py-2 text-gray-600 hover:text-gray-900">
                        <ShoppingBag className="mr-3 h-4 w-4" />
                        My Orders
                      </Link>
                      <Link href="/wishlist" className="flex items-center py-2 text-gray-600 hover:text-gray-900">
                        <Heart className="mr-3 h-4 w-4" />
                        Wishlist
                      </Link>
                      <Link href="/payments" className="flex items-center py-2 text-gray-600 hover:text-gray-900">
                        <CreditCard className="mr-3 h-4 w-4" />
                        Payment Methods
                      </Link>
                      <Link href="/addresses" className="flex items-center py-2 text-gray-600 hover:text-gray-900">
                        <MapPin className="mr-3 h-4 w-4" />
                        Addresses
                      </Link>
                      <Link href="/profile" className="flex items-center py-2 text-gray-600 hover:text-gray-900">
                        <Settings className="mr-3 h-4 w-4" />
                        Settings
                      </Link>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Support</h3>
                    <div className="space-y-2">
                      <Link href="/help" className="flex items-center py-2 text-gray-600 hover:text-gray-900">
                        <HelpCircle className="mr-3 h-4 w-4" />
                        Help Center
                      </Link>
                      <Link href="/contact" className="flex items-center py-2 text-gray-600 hover:text-gray-900">
                        <MessageCircle className="mr-3 h-4 w-4" />
                        Contact Us
                      </Link>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
