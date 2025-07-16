import { useState, useEffect, useMemo } from 'react'
import { Header } from '@/components/layout/Header'
import { JobCard } from '@/components/job/JobCard'
import { JobFiltersComponent } from '@/components/job/JobFilters'
import { PostJobModal } from '@/components/job/PostJobModal'
import { JobDetailModal } from '@/components/job/JobDetailModal'
import { Button } from '@/components/ui/button'
import { Briefcase, TrendingUp, Users, Building2 } from 'lucide-react'
import { Job, JobFilters } from '@/types/job'
import { sampleJobs } from '@/data/sampleJobs'
import { blink } from '@/blink/client'

function App() {
  const [jobs, setJobs] = useState<Job[]>(sampleJobs)
  const [filters, setFilters] = useState<JobFilters>({
    search: '',
    location: '',
    jobType: '',
    salaryMin: 0,
    salaryMax: 200000,
    tags: []
  })
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Auth state management
  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setIsLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  // Get all available tags from jobs
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>()
    jobs.forEach(job => {
      job.tags.forEach(tag => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  }, [jobs])

  // Filter jobs based on current filters
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch = 
          job.title.toLowerCase().includes(searchLower) ||
          job.company.toLowerCase().includes(searchLower) ||
          job.description.toLowerCase().includes(searchLower) ||
          job.tags.some(tag => tag.toLowerCase().includes(searchLower))
        if (!matchesSearch) return false
      }

      // Location filter
      if (filters.location) {
        const locationLower = filters.location.toLowerCase()
        if (!job.location.toLowerCase().includes(locationLower)) return false
      }

      // Job type filter
      if (filters.jobType && job.jobType !== filters.jobType) return false

      // Salary filter
      if (filters.salaryMin > 0 && job.salaryMax && job.salaryMax < filters.salaryMin) return false

      // Tags filter
      if (filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some(filterTag => 
          job.tags.some(jobTag => jobTag.toLowerCase().includes(filterTag.toLowerCase()))
        )
        if (!hasMatchingTag) return false
      }

      return true
    })
  }, [jobs, filters])

  const handlePostJob = (jobData: Omit<Job, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return

    const newJob: Job = {
      ...jobData,
      id: Date.now().toString(),
      userId: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setJobs(prev => [newJob, ...prev])
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Briefcase className="h-12 w-12 text-primary-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading JobBoard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <Briefcase className="h-16 w-16 text-primary-600 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to JobBoard</h1>
          <p className="text-gray-600 mb-8">
            Discover amazing job opportunities and connect with top companies. Sign in to get started.
          </p>
          <Button 
            onClick={() => blink.auth.login()}
            size="lg"
            className="bg-primary-600 hover:bg-primary-700"
          >
            Sign In to Continue
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onPostJobClick={() => setIsPostJobModalOpen(true)} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Dream Job
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover opportunities at top companies and take the next step in your career
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-center mb-2">
                <Briefcase className="h-8 w-8 text-primary-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{jobs.length}</div>
              <div className="text-gray-600">Active Jobs</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-center mb-2">
                <Building2 className="h-8 w-8 text-primary-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {new Set(jobs.map(job => job.company)).size}
              </div>
              <div className="text-gray-600">Companies</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-8 w-8 text-primary-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {Math.round(jobs.reduce((sum, job) => sum + (job.salaryMax || job.salaryMin || 0), 0) / jobs.length / 1000)}k
              </div>
              <div className="text-gray-600">Avg Salary</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <JobFiltersComponent
          filters={filters}
          onFiltersChange={setFilters}
          availableTags={availableTags}
        />

        {/* Results */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredJobs.length} Job{filteredJobs.length !== 1 ? 's' : ''} Found
            </h2>
            {filteredJobs.length !== jobs.length && (
              <p className="text-gray-600">
                Showing {filteredJobs.length} of {jobs.length} jobs
              </p>
            )}
          </div>
        </div>

        {/* Job Grid */}
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onViewDetails={setSelectedJob}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters or search terms to find more opportunities.
            </p>
            <Button 
              variant="outline" 
              onClick={() => setFilters({
                search: '',
                location: '',
                jobType: '',
                salaryMin: 0,
                salaryMax: 200000,
                tags: []
              })}
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </main>

      {/* Modals */}
      <PostJobModal
        isOpen={isPostJobModalOpen}
        onClose={() => setIsPostJobModalOpen(false)}
        onSubmit={handlePostJob}
      />

      <JobDetailModal
        job={selectedJob}
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Briefcase className="h-8 w-8 text-primary-600" />
                <h3 className="text-2xl font-bold text-gray-900">JobBoard</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Connecting talented professionals with amazing opportunities at top companies worldwide.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">For Job Seekers</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-primary-600">Browse Jobs</a></li>
                <li><a href="#" className="hover:text-primary-600">Career Advice</a></li>
                <li><a href="#" className="hover:text-primary-600">Resume Builder</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">For Employers</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-primary-600">Post Jobs</a></li>
                <li><a href="#" className="hover:text-primary-600">Find Candidates</a></li>
                <li><a href="#" className="hover:text-primary-600">Pricing</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2024 JobBoard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App