import { Button } from '@/components/ui/button'
import { Briefcase, Plus } from 'lucide-react'

interface HeaderProps {
  onPostJobClick: () => void
}

export function Header({ onPostJobClick }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Briefcase className="h-8 w-8 text-primary-600" />
            <h1 className="text-2xl font-bold text-gray-900">JobBoard</h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              Browse Jobs
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              Companies
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              About
            </a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Button 
              onClick={onPostJobClick}
              className="bg-primary-600 hover:bg-primary-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Post Job
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}