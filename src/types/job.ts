export interface Job {
  id: string
  title: string
  company: string
  location: string
  jobType: 'full-time' | 'part-time' | 'contract' | 'remote'
  salaryMin?: number
  salaryMax?: number
  description: string
  requirements?: string
  tags: string[]
  applicationType: 'email' | 'url'
  applicationEmail?: string
  applicationUrl?: string
  companyLogo?: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface JobFilters {
  search: string
  location: string
  jobType: string
  salaryMin: number
  salaryMax: number
  tags: string[]
}