"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Award, 
  BookOpen, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Download, 
  ExternalLink, 
  Eye, 
  FileText, 
  Pause, 
  Play, 
  Search, 
  Star, 
  Tag,
  User,
  Building
} from "lucide-react"

interface Award {
  id: string
  title: string
  organization: string
  year: number
  description?: string
  category?: string
}

interface Publication {
  id: string
  title: string
  authors: string[]
  journal: string
  year: number
  doi?: string
  url?: string
  pdfUrl?: string
  abstract?: string
  tags?: string[]
}

interface BlogPost {
  id: string
  title: string
  excerpt: string
  publishedAt: string
  readTime: number
  tags: string[]
  slug: string
  featured?: boolean
}

interface Testimonial {
  id: string
  name: string
  role: string
  organization: string
  content: string
  avatar?: string
  rating?: number
}

interface CreativeDemo {
  id: string
  title: string
  description: string
  demoUrl: string
  category: string
  technologies: string[]
  featured?: boolean
}

interface SectionVisibility {
  awards: boolean
  publications: boolean
  blog: boolean
  testimonials: boolean
  creative: boolean
}

export default function OptionalSectionsRenderer() {
  const [awards, setAwards] = useState<Award[]>([])
  const [publications, setPublications] = useState<Publication[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [creativeDemos, setCreativeDemos] = useState<CreativeDemo[]>([])
  
  const [loading, setLoading] = useState<SectionVisibility>({
    awards: true,
    publications: true,
    blog: true,
    testimonials: true,
    creative: true
  })
  
  const [visibility, setVisibility] = useState<SectionVisibility>({
    awards: false,
    publications: false,
    blog: false,
    testimonials: false,
    creative: false
  })

  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null)
  const [selectedDemo, setSelectedDemo] = useState<CreativeDemo | null>(null)
  const [publicationSearch, setPublicationSearch] = useState("")
  const [isCarouselPlaying, setIsCarouselPlaying] = useState(true)

  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({})

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (typeof window === "undefined") return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionName = entry.target.getAttribute('data-section')
            if (sectionName && !visibility[sectionName as keyof SectionVisibility]) {
              setVisibility(prev => ({ ...prev, [sectionName]: true }))
            }
          }
        })
      },
      { rootMargin: '100px' }
    )

    Object.values(sectionRefs.current).forEach(ref => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [visibility])

  // Fetch data when sections become visible
  useEffect(() => {
    const fetchSectionData = async (section: keyof SectionVisibility) => {
      if (!visibility[section] || !loading[section]) return

      try {
        const response = await fetch(`/api/${section === 'blog' ? 'posts' : section}`)
        if (response.ok) {
          const data = await response.json()
          
          switch (section) {
            case 'awards':
              setAwards(data.length > 0 ? data : [])
              break
            case 'publications':
              setPublications(data.length > 0 ? data : [])
              break
            case 'blog':
              setBlogPosts(data.length > 0 ? data.slice(0, 3) : [])
              break
            case 'testimonials':
              setTestimonials(data.length > 0 ? data : [])
              break
            case 'creative':
              setCreativeDemos(data.length > 0 ? data : [])
              break
          }
        }
      } catch (error) {
        console.error(`Failed to fetch ${section}:`, error)
      } finally {
        setLoading(prev => ({ ...prev, [section]: false }))
      }
    }

    Object.keys(visibility).forEach(section => {
      fetchSectionData(section as keyof SectionVisibility)
    })
  }, [visibility, loading])

  const filteredPublications = publications.filter(pub =>
    pub.title.toLowerCase().includes(publicationSearch.toLowerCase()) ||
    pub.authors.some(author => author.toLowerCase().includes(publicationSearch.toLowerCase())) ||
    pub.journal.toLowerCase().includes(publicationSearch.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const LoadingSkeleton = ({ type }: { type: 'cards' | 'list' | 'carousel' }) => {
    if (type === 'cards') {
      return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="bg-card border-border">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      )
    }

    if (type === 'list') {
      return (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="border-b border-border pb-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-16 w-full" />
            </div>
          ))}
        </div>
      )
    }

    return (
      <div className="flex gap-6 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="min-w-80 bg-card border-border">
            <CardHeader className="flex flex-row items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-16">
      {/* Awards Section */}
      <section
        ref={el => sectionRefs.current.awards = el}
        data-section="awards"
        className="space-y-8"
      >
        {loading.awards ? (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Award className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-heading font-bold">Awards & Recognition</h2>
            </div>
            <LoadingSkeleton type="cards" />
          </div>
        ) : awards.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <Award className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-heading font-bold">Awards & Recognition</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {awards.map((award, index) => (
                <motion.div
                  key={award.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="bg-card border-border hover:border-primary/20 transition-colors">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg font-heading">{award.title}</CardTitle>
                          <CardDescription className="text-muted-foreground">
                            {award.organization} • {award.year}
                          </CardDescription>
                        </div>
                        <Star className="h-5 w-5 text-accent flex-shrink-0" />
                      </div>
                    </CardHeader>
                    {award.description && (
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{award.description}</p>
                        {award.category && (
                          <Badge variant="secondary" className="mt-3">
                            {award.category}
                          </Badge>
                        )}
                      </CardContent>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : null}
      </section>

      {/* Publications Section */}
      <section
        ref={el => sectionRefs.current.publications = el}
        data-section="publications"
        className="space-y-8"
      >
        {loading.publications ? (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-heading font-bold">Publications</h2>
            </div>
            <div className="mb-6">
              <Skeleton className="h-10 w-full max-w-md" />
            </div>
            <LoadingSkeleton type="list" />
          </div>
        ) : publications.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-heading font-bold">Publications</h2>
            </div>
            
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search publications..."
                value={publicationSearch}
                onChange={(e) => setPublicationSearch(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>

            <div className="space-y-6">
              {filteredPublications.map((publication, index) => (
                <motion.div
                  key={publication.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="border-b border-border pb-6 last:border-b-0"
                >
                  <div className="space-y-3">
                    <h3 className="text-xl font-heading font-semibold text-foreground">
                      {publication.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {publication.authors.join(", ")} • {publication.journal} ({publication.year})
                    </p>
                    {publication.abstract && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {publication.abstract}
                      </p>
                    )}
                    <div className="flex items-center gap-3 flex-wrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPublication(publication)}
                        className="text-xs"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View Details
                      </Button>
                      {publication.doi && (
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="text-xs"
                        >
                          <a href={`https://doi.org/${publication.doi}`} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            DOI
                          </a>
                        </Button>
                      )}
                      {publication.pdfUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="text-xs"
                        >
                          <a href={publication.pdfUrl} target="_blank" rel="noopener noreferrer">
                            <Download className="h-3 w-3 mr-1" />
                            PDF
                          </a>
                        </Button>
                      )}
                      {publication.tags && publication.tags.length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                          {publication.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : null}
      </section>

      {/* Blog Preview Section */}
      <section
        ref={el => sectionRefs.current.blog = el}
        data-section="blog"
        className="space-y-8"
      >
        {loading.blog ? (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-heading font-bold">Latest Posts</h2>
            </div>
            <LoadingSkeleton type="cards" />
          </div>
        ) : blogPosts.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-heading font-bold">Latest Posts</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {blogPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="bg-card border-border hover:border-primary/20 transition-colors h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg font-heading line-clamp-2">
                          {post.title}
                        </CardTitle>
                        {post.featured && (
                          <Badge variant="default" className="bg-accent text-accent-foreground flex-shrink-0">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(post.publishedAt)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.readTime} min read
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1 flex-wrap">
                          {post.tags.slice(0, 2).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              <Tag className="h-2 w-2 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                          {post.tags.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{post.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <a href={`/blog/${post.slug}`}>
                            Read More
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : null}
      </section>

      {/* Testimonials Section */}
      <section
        ref={el => sectionRefs.current.testimonials = el}
        data-section="testimonials"
        className="space-y-8"
      >
        {loading.testimonials ? (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <User className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-heading font-bold">Testimonials</h2>
            </div>
            <LoadingSkeleton type="carousel" />
          </div>
        ) : testimonials.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-heading font-bold">Testimonials</h2>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCarouselPlaying(!isCarouselPlaying)}
                className="flex items-center gap-2"
              >
                {isCarouselPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                {isCarouselPlaying ? 'Pause' : 'Play'}
              </Button>
            </div>

            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <Card className="bg-card border-border h-full">
                        <CardHeader>
                          <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                              <AvatarFallback className="bg-primary text-primary-foreground">
                                {testimonial.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <CardTitle className="text-lg font-heading">
                                {testimonial.name}
                              </CardTitle>
                              <CardDescription className="text-muted-foreground">
                                {testimonial.role}
                                {testimonial.organization && (
                                  <>
                                    <span className="mx-1">•</span>
                                    <span className="inline-flex items-center gap-1">
                                      <Building className="h-3 w-3" />
                                      {testimonial.organization}
                                    </span>
                                  </>
                                )}
                              </CardDescription>
                            </div>
                          </div>
                          {testimonial.rating && (
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < testimonial.rating! 
                                      ? 'text-accent fill-current' 
                                      : 'text-muted-foreground'
                                  }`}
                                />
                              ))}
                            </div>
                          )}
                        </CardHeader>
                        <CardContent>
                          <blockquote className="text-sm text-muted-foreground italic">
                            "{testimonial.content}"
                          </blockquote>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </motion.div>
        ) : null}
      </section>

      {/* Creative Demos Section */}
      <section
        ref={el => sectionRefs.current.creative = el}
        data-section="creative"
        className="space-y-8"
      >
        {loading.creative ? (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Eye className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-heading font-bold">Creative Experiments</h2>
            </div>
            <LoadingSkeleton type="cards" />
          </div>
        ) : creativeDemos.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <Eye className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-heading font-bold">Creative Experiments</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {creativeDemos.map((demo, index) => (
                <motion.div
                  key={demo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="bg-card border-border hover:border-primary/20 transition-colors h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg font-heading">{demo.title}</CardTitle>
                          <CardDescription className="text-muted-foreground">
                            {demo.category}
                          </CardDescription>
                        </div>
                        {demo.featured && (
                          <Badge variant="default" className="bg-accent text-accent-foreground">
                            Featured
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">{demo.description}</p>
                      <div className="flex gap-1 flex-wrap">
                        {demo.technologies.map(tech => (
                          <Badge key={tech} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => setSelectedDemo(demo)}
                          className="flex-1"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Demo
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <a href={demo.demoUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : null}
      </section>

      {/* Publication Detail Modal */}
      <Dialog open={!!selectedPublication} onOpenChange={() => setSelectedPublication(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-card border-border">
          {selectedPublication && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-heading">
                  {selectedPublication.title}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  {selectedPublication.authors.join(", ")} • {selectedPublication.journal} ({selectedPublication.year})
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {selectedPublication.abstract && (
                  <div>
                    <h4 className="font-semibold mb-2">Abstract</h4>
                    <p className="text-sm text-muted-foreground">{selectedPublication.abstract}</p>
                  </div>
                )}
                <div className="flex gap-3">
                  {selectedPublication.doi && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={`https://doi.org/${selectedPublication.doi}`} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View on Publisher
                      </a>
                    </Button>
                  )}
                  {selectedPublication.pdfUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={selectedPublication.pdfUrl} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </a>
                    </Button>
                  )}
                </div>
                {selectedPublication.tags && selectedPublication.tags.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {selectedPublication.tags.map(tag => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Creative Demo Modal */}
      <Dialog open={!!selectedDemo} onOpenChange={() => setSelectedDemo(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] bg-card border-border">
          {selectedDemo && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-heading">
                  {selectedDemo.title}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  {selectedDemo.description}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                  <iframe
                    src={selectedDemo.demoUrl}
                    title={selectedDemo.title}
                    className="w-full h-full border-0"
                    sandbox="allow-scripts allow-same-origin allow-forms"
                    loading="lazy"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2 flex-wrap">
                    {selectedDemo.technologies.map(tech => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href={selectedDemo.demoUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open in New Tab
                    </a>
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}