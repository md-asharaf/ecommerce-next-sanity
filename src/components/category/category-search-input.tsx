import { Search } from 'lucide-react'
import React from 'react'
import { Input } from '../ui/input'
interface CatgeorySearchInputProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
}
export const CategorySearchInput = ({ searchQuery, onSearchQueryChange }: CatgeorySearchInputProps) => {
  return (
    <div className="relative max-w-md mx-auto">

      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      <Input
        placeholder="Search categories..."
        className="pl-10 pr-4 py-3 text-gray-900"
        value={searchQuery}
        onChange={(e) => onSearchQueryChange(e.target.value)}
      />
    </div>
  )
}
