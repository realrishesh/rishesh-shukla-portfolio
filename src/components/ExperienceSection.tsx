"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronDown, Search, Filter, Calendar, TrendingUp, Users, Award, Play, Pause, X, ExternalLink, MapPin, Sparkles, Star, Target, Zap } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

interface MediaItem {
  id: string
  type: 'image' | 'video'
  url: string
  thumbnail?: string
  caption?: string
}

interface Experience {
  id: string
  type: 'Leadership' | 'Events' | 'Competitions'
  role: string
  organization: string
  event?: string
  location?: string
  startDate: string
  endDate?: string
  current?: boolean
  shortDescription: string
  responsibilities: string[]
  achievements: string[]
  metrics: {
    audience?: number
    participants?: number
    budget?: number
    growth?: number
    impact?: string
    [key: string]: any
  }
  links?: Array<{
    title: string
    url: string
    type: 'website' | 'social' | 'document'
  }>
  media?: MediaItem[]
  tags: string[]
  featured?: boolean
}

// Mock data to replace API call
const mockExperiences: Experience[] = [
  {
    id: '1',
    type: 'Leadership',
    role: 'Vice President - International Relations',
    organization: 'KIET',
    location: 'Ghaziabad, India',
    startDate: '2023-01-01',
    endDate: '2024-01-01',
    shortDescription: 'Led international partnerships and student exchange programs, fostering global connections and cultural diversity.',
    responsibilities: [
      'Developed strategic partnerships with 15+ international universities',
      'Coordinated student exchange programs for 50+ students',
      'Organized international conferences and cultural events',
      'Managed international relations budget and activities'
    ],
    achievements: [
      'Increased international partnerships by 200%',
      'Successfully placed 45 students in exchange programs',
      'Organized IEAW\'25 with 750+ participants from 30+ universities',
      'Awarded "Outstanding Leadership" recognition'
    ],
    metrics: {
      audience: 750,
      participants: 45,
      growth: 200,
      partnerships: 15,
      universities: 30
    },
    links: [
      { title: 'IEAW Event Page', url: 'https://example.com/ieaw', type: 'website' },
      { title: 'Partnership Report', url: 'https://example.com/report', type: 'document' }
    ],
    tags: ['Leadership', 'International Relations', 'Partnerships', 'Events'],
    featured: true
  },
  {
    id: '2',
    type: 'Events',
    role: 'Event Coordinator',
    organization: 'Frescos\'24',
    event: 'Annual Freshers Welcome',
    location: 'KIET Campus',
    startDate: '2024-09-01',
    endDate: '2024-09-15',
    shortDescription: 'Orchestrated the largest freshers welcome event, creating memorable experiences for 3000+ new students.',
    responsibilities: [
      'Planned and executed multi-day orientation program',
      'Coordinated with 20+ vendors and sponsors',
      'Managed event logistics and student volunteer teams',
      'Ensured safety protocols and emergency planning'
    ],
    achievements: [
      'Successfully welcomed 3000+ new students',
      'Achieved 95% student satisfaction rating',
      'Managed event budget of ₹500K efficiently',
      'Zero safety incidents during the event'
    ],
    metrics: {
      audience: 3000,
      budget: 500000,
      satisfaction: 95,
      volunteers: 50,
      days: 15
    },
    links: [
      { title: 'Event Highlights', url: 'https://example.com/frescos', type: 'social' }
    ],
    tags: ['Event Management', 'Student Engagement', 'Logistics', 'Team Leadership'],
    featured: true
  },
  {
    id: '3',
    type: 'Competitions',
    role: 'Participant & Organizer',
    organization: 'Smart India Hackathon',
    event: 'SIH\'24',
    location: 'Ministry of Power',
    startDate: '2024-08-01',
    endDate: '2024-08-03',
    shortDescription: 'Participated in India\'s largest hackathon while coordinating outreach efforts that reached 100K+ students.',
    responsibilities: [
      'Developed innovative solution for power sector challenges',
      'Coordinated outreach campaigns across 50+ colleges',
      'Mentored junior participants in problem-solving',
      'Facilitated knowledge sharing sessions'
    ],
    achievements: [
      'Reached 100K+ students through outreach campaigns',
      'Successfully submitted working prototype',
      'Mentored 25+ teams to successful submissions',
      'Recognized for outstanding community contribution'
    ],
    metrics: {
      audience: 100000,
      participants: 25,
      colleges: 50,
      duration: 72
    },
    links: [
      { title: 'SIH Official', url: 'https://sih.gov.in', type: 'website' }
    ],
    tags: ['Hackathon', 'Innovation', 'Mentoring', 'Technology'],
    featured: false
  },
  {
    id: '4',
    type: 'Events',
    role: 'PR & Sponsorship Lead',
    organization: 'Reminiscence\'24',
    event: 'Alumni Meet',
    location: 'KIET Campus',
    startDate: '2024-03-15',
    endDate: '2024-03-17',
    shortDescription: 'Led PR and sponsorship efforts for the annual alumni meet, reconnecting 250+ alumni with their alma mater.',
    responsibilities: [
      'Secured sponsorships worth ₹300K from corporate partners',
      'Developed comprehensive PR strategy and campaigns',
      'Coordinated alumni outreach and registration',
      'Managed media relations and event publicity'
    ],
    achievements: [
      'Welcomed 250+ alumni from various batches',
      'Secured highest sponsorship in event history',
      'Achieved 80% alumni response rate',
      'Generated significant media coverage'
    ],
    metrics: {
      audience: 250,
      sponsorship: 300000,
      responseRate: 80,
      mediaReach: 10000
    },
    tags: ['Alumni Relations', 'Sponsorship', 'PR', 'Networking'],
    featured: false
  }
]

interface CountUpProps {
  end: number
  duration?: number
  prefix?: string
  suffix?: string
}

const CountUp = ({ end, duration = 2000, prefix = '', suffix = '' }: CountUpProps) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(easeOutQuart * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration])

  return <span>{prefix}{count.toLocaleString()}{suffix}</span>
}

const Sparkline = ({ data, className }: { data: number[], className?: string }) => {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 60
    const y = 20 - ((value - min) / range) * 20
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width="60" height="20" className={className}>
      <motion.polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-accent"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      />
    </svg>
  )
}

const MediaLightbox = ({ media, isOpen, onClose }: { 
  media: MediaItem[], 
  isOpen: boolean, 
  onClose: () => void 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  if (!isOpen) return null

  const currentMedia = media[currentIndex]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 bg-background/95 backdrop-blur-sm">
        <motion.div 
          className="relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 z-10 bg-background/80 hover:bg-background"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="aspect-video bg-muted flex items-center justify-center">
            {currentMedia?.type === 'image' ? (
              <motion.img
                src={currentMedia.url}
                alt={currentMedia.caption || 'Experience media'}
                className="max-w-full max-h-full object-contain"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              />
            ) : (
              <div className="relative w-full h-full">
                <video
                  src={currentMedia?.url}
                  controls={isPlaying}
                  className="w-full h-full object-contain"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
                {!isPlaying && (
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.8 }}
                  >
                    <Button
                      variant="secondary"
                      size="lg"
                      className="absolute inset-0 m-auto w-16 h-16 rounded-full"
                      onClick={() => setIsPlaying(true)}
                    >
                      <Play className="h-6 w-6 ml-1" />
                    </Button>
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {currentMedia?.caption && (
            <motion.div 
              className="p-4 bg-background/80"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-sm text-muted-foreground">{currentMedia.caption}</p>
            </motion.div>
          )}

          {media.length > 1 && (
            <motion.div 
              className="flex justify-center gap-2 p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {media.map((_, index) => (
                <motion.button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-primary' : 'bg-muted-foreground/30'
                  }`}
                  onClick={() => setCurrentIndex(index)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.8 }}
                />
              ))}
            </motion.div>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}

const ExperienceCard = ({ experience, isExpanded, onToggle, index }: {
  experience: Experience
  isExpanded: boolean
  onToggle: () => void
  index: number
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    })
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Leadership': return <Users className="h-4 w-4" />
      case 'Events': return <Calendar className="h-4 w-4" />
      case 'Competitions': return <Award className="h-4 w-4" />
      default: return <TrendingUp className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Leadership': return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      case 'Events': return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'Competitions': return 'bg-purple-500/10 text-purple-400 border-purple-500/20'
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ 
        duration: 0.3, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 400,
        damping: 25
      }}
    >
      <Card className="group cursor-pointer hover:bg-card/80 transition-all duration-300 relative overflow-hidden">
        {/* Background gradient for featured experiences */}
        {experience.featured && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 opacity-0 group-hover:opacity-100"
            animate={{ 
              background: [
                'linear-gradient(45deg, rgba(155, 140, 255, 0.05) 0%, rgba(255, 232, 155, 0.05) 100%)',
                'linear-gradient(45deg, rgba(255, 232, 155, 0.05) 0%, rgba(155, 140, 255, 0.05) 100%)'
              ]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        <CardHeader className="pb-3 relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <motion.div 
                className="flex items-center gap-2 mb-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
              >
                <Badge className={getTypeColor(experience.type)}>
                  {getTypeIcon(experience.type)}
                  {experience.type}
                </Badge>
                {experience.featured && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                    whileHover={{ rotate: 12, scale: 1.2 }}
                  >
                    <Star className="h-4 w-4 text-accent fill-accent" />
                  </motion.div>
                )}
                <span className="text-xs text-muted-foreground">
                  {formatDate(experience.startDate)} - {
                    experience.current ? 'Present' : 
                    experience.endDate ? formatDate(experience.endDate) : 'Present'
                  }
                </span>
              </motion.div>
              
              <motion.h3 
                className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors duration-200"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                whileHover={{ x: 2 }}
              >
                {experience.role}
              </motion.h3>
              
              <motion.div 
                className="flex items-center gap-2 text-muted-foreground mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
              >
                <span className="font-medium">{experience.organization}</span>
                {experience.event && (
                  <>
                    <span>•</span>
                    <span>{experience.event}</span>
                  </>
                )}
                {experience.location && (
                  <>
                    <MapPin className="h-3 w-3" />
                    <span className="text-xs">{experience.location}</span>
                  </>
                )}
              </motion.div>

              <motion.p 
                className="text-sm text-muted-foreground mb-3 leading-relaxed"
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical' as const,
                  overflow: 'hidden'
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.05 }}
              >
                {experience.shortDescription}
              </motion.p>

              {/* Metrics Preview */}
              <motion.div 
                className="flex items-center gap-4 mb-3 flex-wrap"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.05 }}
              >
                {experience.metrics.audience && (
                  <motion.div 
                    className="flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Users className="h-3 w-3 text-accent" />
                    <span className="text-sm font-medium">
                      <CountUp end={experience.metrics.audience} suffix=" people" />
                    </span>
                  </motion.div>
                )}
                {experience.metrics.participants && (
                  <motion.div 
                    className="flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Award className="h-3 w-3 text-chart-3" />
                    <span className="text-sm font-medium">
                      <CountUp end={experience.metrics.participants} suffix=" participants" />
                    </span>
                  </motion.div>
                )}
                {experience.metrics.growth && (
                  <motion.div 
                    className="flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                  >
                    <TrendingUp className="h-3 w-3 text-chart-4" />
                    <span className="text-sm font-medium">
                      <CountUp end={experience.metrics.growth} suffix="% growth" />
                    </span>
                    <Sparkline data={[0, 25, 45, 30, experience.metrics.growth]} />
                  </motion.div>
                )}
              </motion.div>

              {/* Tags */}
              <motion.div 
                className="flex flex-wrap gap-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.05 }}
              >
                {experience.tags.slice(0, 3).map((tag, tagIndex) => (
                  <motion.div
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.05 + tagIndex * 0.02 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Badge variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  </motion.div>
                ))}
                {experience.tags.length > 3 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Badge variant="outline" className="text-xs">
                      +{experience.tags.length - 3}
                    </Badge>
                  </motion.div>
                )}
              </motion.div>
            </div>

            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="ml-4 flex-shrink-0"
              >
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-4 w-4" />
                </motion.div>
              </Button>
            </motion.div>
          </div>
        </CardHeader>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <CardContent className="pt-0 relative z-10">
                <Tabs defaultValue="responsibilities" className="w-full">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="responsibilities">Responsibilities</TabsTrigger>
                      <TabsTrigger value="achievements">Achievements</TabsTrigger>
                      <TabsTrigger value="metrics">Metrics</TabsTrigger>
                      <TabsTrigger value="media">Media</TabsTrigger>
                    </TabsList>
                  </motion.div>

                  <TabsContent value="responsibilities" className="mt-4">
                    <ul className="space-y-2">
                      {experience.responsibilities.map((responsibility, respIndex) => (
                        <motion.li 
                          key={respIndex} 
                          className="text-sm flex items-start gap-2"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: respIndex * 0.05 }}
                          whileHover={{ x: 2 }}
                        >
                          <motion.span 
                            className="text-accent mt-1.5 block w-1 h-1 rounded-full bg-current flex-shrink-0"
                            whileHover={{ scale: 1.5 }}
                          />
                          <span>{responsibility}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </TabsContent>

                  <TabsContent value="achievements" className="mt-4">
                    <ul className="space-y-2">
                      {experience.achievements.map((achievement, achIndex) => (
                        <motion.li 
                          key={achIndex} 
                          className="text-sm flex items-start gap-2"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: achIndex * 0.05 }}
                          whileHover={{ x: 2 }}
                        >
                          <motion.div
                            whileHover={{ rotate: 12, scale: 1.2 }}
                          >
                            <Award className="h-3 w-3 text-accent mt-1 flex-shrink-0" />
                          </motion.div>
                          <span>{achievement}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </TabsContent>

                  <TabsContent value="metrics" className="mt-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.entries(experience.metrics).map(([key, value], metricIndex) => (
                        <motion.div 
                          key={key} 
                          className="text-center p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: metricIndex * 0.05 }}
                          whileHover={{ scale: 1.02, y: -2 }}
                        >
                          <div className="text-lg font-semibold text-primary">
                            {typeof value === 'number' ? (
                              <CountUp end={value} />
                            ) : (
                              value
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="media" className="mt-4">
                    {experience.media && experience.media.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {experience.media.map((item, mediaIndex) => (
                          <motion.div
                            key={item.id}
                            className="relative aspect-video bg-muted rounded-lg overflow-hidden cursor-pointer group"
                            onClick={() => setLightboxOpen(true)}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: mediaIndex * 0.1 }}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <img
                              src={item.thumbnail || item.url}
                              alt={item.caption || `Media ${mediaIndex + 1}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {item.type === 'video' && (
                              <motion.div 
                                className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors"
                                whileHover={{ scale: 1.1 }}
                              >
                                <Play className="h-6 w-6 text-white" />
                              </motion.div>
                            )}
                            <motion.div
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              whileHover={{ scale: 1.1 }}
                            >
                              <div className="w-2 h-2 bg-accent rounded-full" />
                            </motion.div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <motion.div 
                        className="text-muted-foreground text-sm text-center py-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No media available for this experience.</p>
                      </motion.div>
                    )}
                  </TabsContent>
                </Tabs>

                {/* Links */}
                {experience.links && experience.links.length > 0 && (
                  <motion.div 
                    className="mt-4 pt-4 border-t border-border"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex flex-wrap gap-2">
                      {experience.links.map((link, linkIndex) => (
                        <motion.div
                          key={link.url}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 + linkIndex * 0.05 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="text-xs"
                          >
                            <a href={link.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              {link.title}
                            </a>
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {experience.media && (
        <MediaLightbox
          media={experience.media}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </motion.div>
  )
}

const ExperienceSection = () => {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [filteredExperiences, setFilteredExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('date')
  const [expandedCard, setExpandedCard] = useState<string | null>(null)

  useEffect(() => {
    // Use mock data instead of API call
    const initializeData = async () => {
      setLoading(true)
      try {
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        setExperiences(mockExperiences)
        setFilteredExperiences(mockExperiences)
        setError(null)
      } catch (err) {
        setError('Failed to load experiences. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    initializeData()
  }, [])

  useEffect(() => {
    let filtered = experiences

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(exp => exp.type === filterType)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(exp =>
        exp.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (exp.event && exp.event.toLowerCase().includes(searchTerm.toLowerCase())) ||
        exp.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        case 'impact':
          const aImpact = a.metrics.audience || a.metrics.participants || 0
          const bImpact = b.metrics.audience || b.metrics.participants || 0
          return bImpact - aImpact
        case 'type':
          return a.type.localeCompare(b.type)
        case 'featured':
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        default:
          return 0
      }
    })

    setFilteredExperiences(filtered)
  }, [experiences, searchTerm, filterType, sortBy])

  const handleCardToggle = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id)
  }

  if (loading) {
    return (
      <section className="space-y-8">
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Skeleton className="h-8 w-64" />
          <div className="flex gap-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </motion.div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-5 w-32" />
                    </div>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <motion.section 
        className="text-center py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-destructive mb-4">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <TrendingUp className="h-12 w-12 mx-auto mb-2" />
          </motion.div>
          <h3 className="text-lg font-semibold">Unable to load experiences</h3>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </motion.div>
      </motion.section>
    )
  }

  if (experiences.length === 0) {
    return (
      <motion.section 
        className="text-center py-12"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="text-muted-foreground mb-4">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Award className="h-12 w-12 mx-auto mb-2" />
          </motion.div>
          <h3 className="text-lg font-semibold">No experiences yet</h3>
          <p className="text-sm">Check back later for updates on leadership roles and events.</p>
        </div>
      </motion.section>
    )
  }

  return (
    <section className="space-y-8">
      {/* Header & Controls */}
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-heading font-bold mb-2">Leadership & Experience</h2>
          <p className="text-muted-foreground max-w-2xl">
            A comprehensive overview of my leadership roles, event management, and competitive achievements that have shaped my professional journey.
          </p>
        </motion.div>

        <motion.div 
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search organizations, roles, events, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Leadership">Leadership</SelectItem>
                <SelectItem value="Events">Events</SelectItem>
                <SelectItem value="Competitions">Competitions</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Sort by Date</SelectItem>
                <SelectItem value="featured">Sort by Featured</SelectItem>
                <SelectItem value="impact">Sort by Impact</SelectItem>
                <SelectItem value="type">Sort by Type</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>
        </motion.div>
      </div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {filteredExperiences.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center py-12"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            </motion.div>
            <h3 className="text-lg font-semibold mb-2">No experiences found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {filteredExperiences.map((experience, index) => (
              <ExperienceCard
                key={experience.id}
                experience={experience}
                isExpanded={expandedCard === experience.id}
                onToggle={() => handleCardToggle(experience.id)}
                index={index}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default ExperienceSection