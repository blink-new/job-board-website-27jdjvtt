import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Building2, MapPin, Clock, DollarSign, ExternalLink, Mail, Users } from 'lucide-react'
import { Job } from '@/types/job'

interface JobDetailModalProps {
  job: Job | null
  isOpen: boolean
  onClose: () => void
}

export function JobDetailModal({ job, isOpen, onClose }: JobDetailModalProps) {
  if (!job) return null

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Salary not specified'
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`
    if (min) return `From $${min.toLocaleString()}`
    if (max) return `Up to $${max.toLocaleString()}`
  }

  const handleApply = () => {
    if (job.applicationType === 'email' && job.applicationEmail) {
      window.location.href = `mailto:${job.applicationEmail}?subject=Application for ${job.title}`
    } else if (job.applicationType === 'url' && job.applicationUrl) {
      window.open(job.applicationUrl, '_blank')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              {job.companyLogo ? (
                <img src={job.companyLogo} alt={job.company} className="w-12 h-12 object-contain" />
              ) : (
                <Building2 className="h-8 w-8 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
                {job.title}
              </DialogTitle>
              <div className="flex items-center space-x-4 text-gray-600 mb-4">
                <div className="flex items-center">
                  <Building2 className="h-4 w-4 mr-1" />
                  <span className="font-medium">{job.company}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant="secondary" className="bg-primary-50 text-primary-700 border-primary-200">
                  {job.jobType.replace('-', ' ').toUpperCase()}
                </Badge>
                <div className="flex items-center text-gray-600">
                  <DollarSign className="h-4 w-4 mr-1" />
                  <span className="font-medium">{formatSalary(job.salaryMin, job.salaryMax)}</span>
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Apply Button */}
          <div className="flex justify-center">
            <Button 
              onClick={handleApply}
              size="lg"
              className="bg-primary-600 hover:bg-primary-700 px-8"
            >
              {job.applicationType === 'email' ? (
                <>
                  <Mail className="h-5 w-5 mr-2" />
                  Apply via Email
                </>
              ) : (
                <>
                  <ExternalLink className="h-5 w-5 mr-2" />
                  Apply Now
                </>
              )}
            </Button>
          </div>

          <Separator />

          {/* Job Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Job Description
            </h3>
            <div className="prose prose-sm max-w-none text-gray-700">
              <p className="whitespace-pre-wrap">{job.description}</p>
            </div>
          </div>

          {/* Requirements */}
          {job.requirements && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Requirements
                </h3>
                <div className="prose prose-sm max-w-none text-gray-700">
                  <p className="whitespace-pre-wrap">{job.requirements}</p>
                </div>
              </div>
            </>
          )}

          {/* Skills & Tags */}
          {job.tags.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Skills & Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="bg-gray-50">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              About {job.company}
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                  {job.companyLogo ? (
                    <img src={job.companyLogo} alt={job.company} className="w-6 h-6 object-contain" />
                  ) : (
                    <Building2 className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <span className="font-medium text-gray-900">{job.company}</span>
              </div>
              <p className="text-gray-600 text-sm">
                Learn more about this company and their other opportunities.
              </p>
            </div>
          </div>

          {/* Apply Again */}
          <div className="flex justify-center pt-4">
            <Button 
              onClick={handleApply}
              size="lg"
              className="bg-primary-600 hover:bg-primary-700 px-8"
            >
              {job.applicationType === 'email' ? (
                <>
                  <Mail className="h-5 w-5 mr-2" />
                  Apply via Email
                </>
              ) : (
                <>
                  <ExternalLink className="h-5 w-5 mr-2" />
                  Apply Now
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}