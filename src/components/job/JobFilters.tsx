import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Search, MapPin, Briefcase, DollarSign, X } from 'lucide-react'
import { JobFilters } from '@/types/job'

interface JobFiltersProps {
  filters: JobFilters
  onFiltersChange: (filters: JobFilters) => void
  availableTags: string[]
}

export function JobFiltersComponent({ filters, onFiltersChange, availableTags }: JobFiltersProps) {
  const updateFilter = (key: keyof JobFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const addTag = (tag: string) => {
    if (!filters.tags.includes(tag)) {
      updateFilter('tags', [...filters.tags, tag])
    }
  }

  const removeTag = (tag: string) => {
    updateFilter('tags', filters.tags.filter(t => t !== tag))
  }

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      location: '',
      jobType: '',
      salaryMin: 0,
      salaryMax: 200000,
      tags: []
    })
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search jobs..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Location */}
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Location"
            value={filters.location}
            onChange={(e) => updateFilter('location', e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Job Type */}
        <Select value={filters.jobType || "all"} onValueChange={(value) => updateFilter('jobType', value === "all" ? "" : value)}>
          <SelectTrigger>
            <div className="flex items-center">
              <Briefcase className="h-4 w-4 mr-2 text-gray-400" />
              <SelectValue placeholder="Job Type" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="full-time">Full Time</SelectItem>
            <SelectItem value="part-time">Part Time</SelectItem>
            <SelectItem value="contract">Contract</SelectItem>
            <SelectItem value="remote">Remote</SelectItem>
          </SelectContent>
        </Select>

        {/* Salary Range */}
        <Select 
          value={filters.salaryMin === 0 ? 'any' : filters.salaryMin.toString()} 
          onValueChange={(value) => updateFilter('salaryMin', value === 'any' ? 0 : parseInt(value))}
        >
          <SelectTrigger>
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
              <SelectValue placeholder="Min Salary" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any Salary</SelectItem>
            <SelectItem value="30000">$30,000+</SelectItem>
            <SelectItem value="50000">$50,000+</SelectItem>
            <SelectItem value="70000">$70,000+</SelectItem>
            <SelectItem value="100000">$100,000+</SelectItem>
            <SelectItem value="150000">$150,000+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tags */}
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 mb-2 block">Skills & Tags</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {availableTags.slice(0, 10).map((tag) => (
            <Button
              key={tag}
              variant={filters.tags.includes(tag) ? "default" : "outline"}
              size="sm"
              onClick={() => filters.tags.includes(tag) ? removeTag(tag) : addTag(tag)}
              className="text-xs"
            >
              {tag}
            </Button>
          ))}
        </div>
        
        {filters.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {filters.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-primary-50 text-primary-700">
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="ml-1 hover:text-primary-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Clear Filters */}
      <div className="flex justify-between items-center">
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Clear All Filters
        </Button>
        <span className="text-sm text-gray-500">
          {filters.search || filters.location || filters.jobType || filters.tags.length > 0 ? 'Filters applied' : 'No filters'}
        </span>
      </div>
    </div>
  )
}