import Link from "next/link";
import { Button } from "./ui/button";

const Footer = () => (
  <footer className="bg-gray-900 text-white py-16">
  <div className="container mx-auto px-4">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <div>
        <h3 className="text-2xl font-bold mb-4">ShopHub</h3>
        <p className="text-gray-400 mb-4">
          Your one-stop destination for premium products and exceptional shopping experience.
        </p>
        <div className="flex space-x-4">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <div className="w-5 h-5 bg-current rounded" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <div className="w-5 h-5 bg-current rounded" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <div className="w-5 h-5 bg-current rounded" />
          </Button>
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-4">Quick Links</h4>
        <ul className="space-y-2 text-gray-400">
          <li>
            <Link href="/about" className="hover:text-white">
              About Us
            </Link>
          </li>
          <li>
            <Link href="/contact" className="hover:text-white">
              Contact
            </Link>
          </li>
          <li>
            <Link href="/careers" className="hover:text-white">
              Careers
            </Link>
          </li>
          <li>
            <Link href="/blog" className="hover:text-white">
              Blog
            </Link>
          </li>
        </ul>
      </div>

      <div>
        <h4 className="font-semibold mb-4">Customer Service</h4>
        <ul className="space-y-2 text-gray-400">
          <li>
            <Link href="/help" className="hover:text-white">
              Help Center
            </Link>
          </li>
          <li>
            <Link href="/returns" className="hover:text-white">
              Returns
            </Link>
          </li>
          <li>
            <Link href="/shipping" className="hover:text-white">
              Shipping Info
            </Link>
          </li>
          <li>
            <Link href="/track" className="hover:text-white">
              Track Order
            </Link>
          </li>
        </ul>
      </div>

      <div>
        <h4 className="font-semibold mb-4">Legal</h4>
        <ul className="space-y-2 text-gray-400">
          <li>
            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link href="/terms" className="hover:text-white">
              Terms of Service
            </Link>
          </li>
          <li>
            <Link href="/cookies" className="hover:text-white">
              Cookie Policy
            </Link>
          </li>
          <li>
            <Link href="/accessibility" className="hover:text-white">
              Accessibility
            </Link>
          </li>
        </ul>
      </div>
    </div>

    <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
      <p>&copy; 2024 ShopHub. All rights reserved.</p>
    </div>
  </div>
</footer>
  );
  
  export default Footer;
  