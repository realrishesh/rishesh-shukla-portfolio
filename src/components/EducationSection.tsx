"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  GraduationCap, 
  Award, 
  BookOpen, 
  Download, 
  X, 
  SortAsc, 
  SortDesc,
  Eye,
  EyeOff,
  ExternalLink
} from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

interface Education {
  id: string
  degree: string
  institution: string
  location: string
  startYear: number
  endYear: number | null
  cgpa?: number
  score?: string
  coursework?: string[]
  research?: string
  achievements?: string[]
  description?: string
  transcriptUrl?: string
  cvUrl?: string
  isPublic: boolean
  degreeType: "B.Tech" | "B.Sc" | "M.Tech" | "M.Sc" | "PhD" | "Diploma" | "Other"
}

interface EducationSectionProps {
  className?: string
}

export default function EducationSection({ className }: EducationSectionProps) {
  const [educations, setEducations] = useState<Education[]>([])
  const [filteredEducations, setFilteredEducations] = useState<Education[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedEducation, setSelectedEducation] = useState<Education | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDegreeType, setSelectedDegreeType] = useState("all")
  const [yearRange, setYearRange] = useState({ min: "", max: "" })
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    fetchEducations()
  }, [])

  useEffect(() => {
    filterEducations()
  }, [educations, searchTerm, selectedDegreeType, yearRange, sortOrder])

  const fetchEducations = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/education")
      if (!response.ok) throw new Error("Failed to fetch education data")
      const data = await response.json()
      setEducations(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      toast.error("Failed to load education data")
    } finally {
      setLoading(false)
    }
  }

  const filterEducations = () => {
    let filtered = [...educations]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(edu => 
        edu.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
        edu.degree.toLowerCase().includes(searchTerm.toLowerCase()) ||
        edu.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Degree type filter
    if (selectedDegreeType !== "all") {
      filtered = filtered.filter(edu => edu.degreeType === selectedDegreeType)
    }

    // Year range filter
    if (yearRange.min) {
      filtered = filtered.filter(edu => edu.startYear >= parseInt(yearRange.min))
    }
    if (yearRange.max) {
      filtered = filtered.filter(edu => 
        (edu.endYear || new Date().getFullYear()) <= parseInt(yearRange.max)
      )
    }

    // Sort by year
    filtered.sort((a, b) => {
      const aYear = a.endYear || new Date().getFullYear()
      const bYear = b.endYear || new Date().getFullYear()
      return sortOrder === "desc" ? bYear - aYear : aYear - bYear
    })

    setFilteredEducations(filtered)
  }

  const degreeTypes = ["B.Tech", "B.Sc", "M.Tech", "M.Sc", "PhD", "Diploma", "Other"]

  if (loading) {
    return (
      <div className={className}>
        <div className="space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <div className="flex flex-wrap gap-4">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="bg-card">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={className}>
        <div className="text-center py-12">
          <div className="mb-4">
            <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Failed to Load Education Data</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchEducations}>Try Again</Button>
        </div>
      </div>
    )
  }

  if (educations.length === 0) {
    return (
      <div className={className}>
        <div className="text-center py-12">
          <div className="mb-4">
            <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Education Records</h3>
          <p className="text-muted-foreground mb-4">
            Education information will appear here once added.
          </p>
          <Button variant="outline">
            <ExternalLink className="mr-2 h-4 w-4" />
            View Admin Panel
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="space-y-8">
        {/* Header and Filters */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Education</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
            >
              {sortOrder === "desc" ? (
                <SortDesc className="mr-2 h-4 w-4" />
              ) : (
                <SortAsc className="mr-2 h-4 w-4" />
              )}
              {sortOrder === "desc" ? "Newest First" : "Oldest First"}
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by institution, degree, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Tabs value={selectedDegreeType} onValueChange={setSelectedDegreeType}>
              <TabsList className="grid grid-cols-4 lg:grid-cols-8 w-full">
                <TabsTrigger value="all">All</TabsTrigger>
                {degreeTypes.map(type => (
                  <TabsTrigger key={type} value={type} className="text-xs">
                    {type}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div className="flex gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">From Year</label>
                <Input
                  type="number"
                  placeholder="2020"
                  value={yearRange.min}
                  onChange={(e) => setYearRange(prev => ({ ...prev, min: e.target.value }))}
                  className="w-32"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">To Year</label>
                <Input
                  type="number"
                  placeholder="2024"
                  value={yearRange.max}
                  onChange={(e) => setYearRange(prev => ({ ...prev, max: e.target.value }))}
                  className="w-32"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Education Grid */}
        {filteredEducations.length === 0 ? (
          <div className="text-center py-12">
            <Filter className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or filters.
            </p>
          </div>
        ) : (
          <motion.div 
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            layout
          >
            <AnimatePresence>
              {filteredEducations.map((education, index) => (
                <motion.div
                  key={education.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="cursor-pointer"
                  onClick={() => setSelectedEducation(education)}
                >
                  <Card className="bg-card hover:bg-card/80 transition-colors h-full">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold leading-tight">
                              {education.degree}
                            </h3>
                            <Badge variant={education.isPublic ? "default" : "secondary"}>
                              {education.isPublic ? (
                                <Eye className="mr-1 h-3 w-3" />
                              ) : (
                                <EyeOff className="mr-1 h-3 w-3" />
                              )}
                              {education.isPublic ? "Public" : "Private"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {education.institution}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {education.degreeType}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0 space-y-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {education.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {education.startYear} - {education.endYear || "Present"}
                        </div>
                      </div>

                      {(education.cgpa || education.score) && (
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-accent" />
                          <span className="text-sm font-medium">
                            {education.cgpa ? `CGPA: ${education.cgpa}` : education.score}
                          </span>
                        </div>
                      )}

                      {education.research && (
                        <div className="flex items-start gap-2">
                          <BookOpen className="h-4 w-4 text-primary mt-0.5" />
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {education.research}
                          </p>
                        </div>
                      )}

                      {education.achievements && education.achievements.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {education.achievements.slice(0, 2).map((achievement, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {achievement}
                            </Badge>
                          ))}
                          {education.achievements.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{education.achievements.length - 2} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Detail Modal */}
        <AnimatePresence>
          {selectedEducation && (
            <Dialog open={!!selectedEducation} onOpenChange={() => setSelectedEducation(null)}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <DialogTitle className="text-xl">
                        {selectedEducation.degree}
                      </DialogTitle>
                      <p className="text-muted-foreground">
                        {selectedEducation.institution}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {selectedEducation.degreeType}
                    </Badge>
                  </div>
                </DialogHeader>

                <div className="space-y-6 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {selectedEducation.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {selectedEducation.startYear} - {selectedEducation.endYear || "Present"}
                    </div>
                    {(selectedEducation.cgpa || selectedEducation.score) && (
                      <div className="flex items-center gap-2 text-sm col-span-2">
                        <Award className="h-4 w-4 text-accent" />
                        {selectedEducation.cgpa ? `CGPA: ${selectedEducation.cgpa}` : selectedEducation.score}
                      </div>
                    )}
                  </div>

                  {selectedEducation.description && (
                    <div>
                      <h4 className="font-semibold mb-2">Description</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {selectedEducation.description}
                      </p>
                    </div>
                  )}

                  {selectedEducation.coursework && selectedEducation.coursework.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3">Coursework</h4>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {selectedEducation.coursework.map((course, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <BookOpen className="h-3 w-3 text-primary" />
                            {course}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedEducation.research && (
                    <div>
                      <h4 className="font-semibold mb-2">Research</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {selectedEducation.research}
                      </p>
                    </div>
                  )}

                  {selectedEducation.achievements && selectedEducation.achievements.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3">Achievements</h4>
                      <div className="space-y-2">
                        {selectedEducation.achievements.map((achievement, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm">
                            <Award className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                            {achievement}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(selectedEducation.transcriptUrl || selectedEducation.cvUrl) && (
                    <div>
                      <h4 className="font-semibold mb-3">Downloads</h4>
                      <div className="flex gap-3">
                        {selectedEducation.transcriptUrl && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={selectedEducation.transcriptUrl} target="_blank" rel="noopener noreferrer">
                              <Download className="mr-2 h-4 w-4" />
                              Transcript
                            </a>
                          </Button>
                        )}
                        {selectedEducation.cvUrl && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={selectedEducation.cvUrl} target="_blank" rel="noopener noreferrer">
                              <Download className="mr-2 h-4 w-4" />
                              CV
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}