import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Building2, MapPin, Clock, DollarSign, ExternalLink, Mail } from 'lucide-react'
import { Job } from '@/types/job'

interface JobCardProps {
  job: Job
  onViewDetails: (job: Job) => void
}

export function JobCard({ job, onViewDetails }: JobCardProps) {
  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Salary not specified'
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`
    if (min) return `From $${min.toLocaleString()}`
    if (max) return `Up to $${max.toLocaleString()}`
  }

  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (job.applicationType === 'email' && job.applicationEmail) {
      window.location.href = `mailto:${job.applicationEmail}?subject=Application for ${job.title}`
    } else if (job.applicationType === 'url' && job.applicationUrl) {
      window.open(job.applicationUrl, '_blank')
    }
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group border-gray-200 hover:border-primary-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              {job.companyLogo ? (
                <img src={job.companyLogo} alt={job.company} className="w-8 h-8 object-contain" />
              ) : (
                <Building2 className="h-6 w-6 text-gray-400" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900 group-hover:text-primary-600 transition-colors">
                {job.title}
              </h3>
              <p className="text-gray-600 font-medium">{job.company}</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-primary-50 text-primary-700 border-primary-200">
            {job.jobType.replace('-', ' ').toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pb-4">
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="h-4 w-4 mr-2" />
            {job.location}
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <DollarSign className="h-4 w-4 mr-2" />
            {formatSalary(job.salaryMin, job.salaryMax)}
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <Clock className="h-4 w-4 mr-2" />
            {new Date(job.createdAt).toLocaleDateString()}
          </div>
        </div>
        
        <p className="text-gray-700 text-sm line-clamp-3 mb-4">
          {job.description}
        </p>
        
        <div className="flex flex-wrap gap-2">
          {job.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {job.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{job.tags.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <div className="flex space-x-2 w-full">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onViewDetails(job)}
            className="flex-1"
          >
            View Details
          </Button>
          <Button 
            size="sm" 
            onClick={handleApply}
            className="flex-1 bg-primary-600 hover:bg-primary-700"
          >
            {job.applicationType === 'email' ? (
              <>
                <Mail className="h-4 w-4 mr-2" />
                Apply
              </>
            ) : (
              <>
                <ExternalLink className="h-4 w-4 mr-2" />
                Apply
              </>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}