import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { X, Plus } from 'lucide-react'
import { Job } from '@/types/job'

interface PostJobModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (job: Omit<Job, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void
}

export function PostJobModal({ isOpen, onClose, onSubmit }: PostJobModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    jobType: 'full-time' as Job['jobType'],
    salaryMin: '',
    salaryMax: '',
    description: '',
    requirements: '',
    tags: [] as string[],
    applicationType: 'email' as Job['applicationType'],
    applicationEmail: '',
    applicationUrl: '',
    companyLogo: ''
  })
  
  const [newTag, setNewTag] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const jobData: Omit<Job, 'id' | 'userId' | 'createdAt' | 'updatedAt'> = {
      title: formData.title,
      company: formData.company,
      location: formData.location,
      jobType: formData.jobType,
      salaryMin: formData.salaryMin ? parseInt(formData.salaryMin) : undefined,
      salaryMax: formData.salaryMax ? parseInt(formData.salaryMax) : undefined,
      description: formData.description,
      requirements: formData.requirements || undefined,
      tags: formData.tags,
      applicationType: formData.applicationType,
      applicationEmail: formData.applicationType === 'email' ? formData.applicationEmail : undefined,
      applicationUrl: formData.applicationType === 'url' ? formData.applicationUrl : undefined,
      companyLogo: formData.companyLogo || undefined
    }
    
    onSubmit(jobData)
    
    // Reset form
    setFormData({
      title: '',
      company: '',
      location: '',
      jobType: 'full-time',
      salaryMin: '',
      salaryMax: '',
      description: '',
      requirements: '',
      tags: [],
      applicationType: 'email',
      applicationEmail: '',
      applicationUrl: '',
      companyLogo: ''
    })
    
    onClose()
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Post a New Job</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. Senior Frontend Developer"
                required
              />
            </div>
            <div>
              <Label htmlFor="company">Company *</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                placeholder="e.g. TechCorp Inc."
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g. San Francisco, CA"
                required
              />
            </div>
            <div>
              <Label htmlFor="jobType">Job Type *</Label>
              <Select value={formData.jobType} onValueChange={(value: Job['jobType']) => setFormData(prev => ({ ...prev, jobType: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full Time</SelectItem>
                  <SelectItem value="part-time">Part Time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Salary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="salaryMin">Minimum Salary</Label>
              <Input
                id="salaryMin"
                type="number"
                value={formData.salaryMin}
                onChange={(e) => setFormData(prev => ({ ...prev, salaryMin: e.target.value }))}
                placeholder="50000"
              />
            </div>
            <div>
              <Label htmlFor="salaryMax">Maximum Salary</Label>
              <Input
                id="salaryMax"
                type="number"
                value={formData.salaryMax}
                onChange={(e) => setFormData(prev => ({ ...prev, salaryMax: e.target.value }))}
                placeholder="80000"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Job Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the role, responsibilities, and what you're looking for..."
              rows={4}
              required
            />
          </div>

          {/* Requirements */}
          <div>
            <Label htmlFor="requirements">Requirements</Label>
            <Textarea
              id="requirements"
              value={formData.requirements}
              onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
              placeholder="List the required skills, experience, and qualifications..."
              rows={3}
            />
          </div>

          {/* Tags */}
          <div>
            <Label>Skills & Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a skill or tag"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-primary-50 text-primary-700">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:text-primary-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Application Method */}
          <div>
            <Label>How should candidates apply?</Label>
            <RadioGroup
              value={formData.applicationType}
              onValueChange={(value: Job['applicationType']) => setFormData(prev => ({ ...prev, applicationType: value }))}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="email" id="email" />
                <Label htmlFor="email">Email Application</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="url" id="url" />
                <Label htmlFor="url">External Application URL</Label>
              </div>
            </RadioGroup>
            
            {formData.applicationType === 'email' && (
              <Input
                value={formData.applicationEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, applicationEmail: e.target.value }))}
                placeholder="hr@company.com"
                type="email"
                className="mt-2"
                required
              />
            )}
            
            {formData.applicationType === 'url' && (
              <Input
                value={formData.applicationUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, applicationUrl: e.target.value }))}
                placeholder="https://company.com/careers/apply"
                type="url"
                className="mt-2"
                required
              />
            )}
          </div>

          {/* Company Logo */}
          <div>
            <Label htmlFor="companyLogo">Company Logo URL (optional)</Label>
            <Input
              id="companyLogo"
              value={formData.companyLogo}
              onChange={(e) => setFormData(prev => ({ ...prev, companyLogo: e.target.value }))}
              placeholder="https://company.com/logo.png"
              type="url"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary-600 hover:bg-primary-700">
              Post Job
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}