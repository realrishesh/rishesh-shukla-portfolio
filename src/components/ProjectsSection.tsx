"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Search, Filter, X, Eye, EyeOff, Github, ExternalLink, FileText, Award, Calendar, Tag, ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, Maximize2, Loader2, Sparkles } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

interface Project {
  id: string
  title: string
  description: string
  longDescription: string
  role: string
  techStack: string[]
  status: 'Completed' | 'Ongoing' | 'Archived'
  visibility: 'public' | 'private'
  metrics: {
    patents?: number
    accuracy?: number
    awards?: string[]
  }
  links: {
    github?: string
    demo?: string
    paper?: string
    patent?: string
  }
  media: Array<{
    type: 'image' | 'video'
    url: string
    thumbnail?: string
    alt?: string
  }>
  createdAt: string
  featured: boolean
}

const seedProjects: Project[] = [
  {
    id: '1',
    title: 'SkillHub',
    description: 'AI-powered platform for skill assessment and learning path recommendations with patent-pending technology',
    longDescription: 'Developed a comprehensive AI-driven platform that analyzes user skills through interactive assessments and provides personalized learning recommendations. The system uses machine learning algorithms to match users with optimal career paths and learning resources, featuring advanced neural networks for skill prediction and career trajectory optimization.',
    role: 'Lead Full-Stack Developer & AI Architect',
    techStack: ['React', 'Node.js', 'Python', 'TensorFlow', 'PostgreSQL', 'Docker', 'AWS'],
    status: 'Completed',
    visibility: 'public',
    metrics: {
      accuracy: 94,
      patents: 1,
      awards: ['Best Innovation Award 2023', 'Tech Excellence Award']
    },
    links: {
      github: 'https://github.com/example/skillhub',
      demo: 'https://skillhub-demo.com',
      patent: 'https://patents.com/skillhub'
    },
    media: [
      {
        type: 'image',
        url: '/api/placeholder/800/600',
        alt: 'SkillHub Dashboard Interface'
      },
      {
        type: 'image',
        url: '/api/placeholder/800/500',
        alt: 'SkillHub AI Assessment Flow'
      }
    ],
    createdAt: '2023-12-01',
    featured: true
  },
  {
    id: '2',
    title: 'NIFTY 50 Stock Predictor',
    description: 'Advanced ML model for stock market prediction achieving 89% accuracy using ensemble methods',
    longDescription: 'Built a sophisticated machine learning model that predicts NIFTY 50 index movements using historical data, sentiment analysis, and technical indicators. Implemented ensemble methods combining LSTM networks, Random Forest, and traditional ML algorithms. The system processes real-time market data and news sentiment to provide accurate predictions.',
    role: 'Data Scientist & ML Engineer',
    techStack: ['Python', 'Scikit-learn', 'Keras', 'TensorFlow', 'Pandas', 'Streamlit', 'Apache Kafka'],
    status: 'Completed',
    visibility: 'public',
    metrics: {
      accuracy: 89,
      patents: 1,
      awards: ['Best ML Project 2023']
    },
    links: {
      paper: 'https://example.com/nifty-paper.pdf',
      patent: 'https://patents.com/nifty-predictor',
      demo: 'https://nifty-predictor.streamlit.app'
    },
    media: [
      {
        type: 'image',
        url: '/api/placeholder/800/600',
        alt: 'NIFTY 50 Prediction Dashboard'
      },
      {
        type: 'video',
        url: '/api/placeholder/video.mp4',
        thumbnail: '/api/placeholder/800/450',
        alt: 'NIFTY 50 Real-time Prediction Demo'
      }
    ],
    createdAt: '2023-10-15',
    featured: true
  },
  {
    id: '3',
    title: 'Data Science Virtual TA',
    description: 'Interactive teaching assistant tools powered by FastAPI and Gemini AI for data science education',
    longDescription: 'Created a comprehensive suite of interactive educational tools for teaching data science concepts. Features include AI-powered code review, automated assignment grading, interactive visualizations, and personalized learning paths. Used by over 500 students across multiple universities with 95% satisfaction rate.',
    role: 'Teaching Assistant & Full-Stack Developer',
    techStack: ['React', 'FastAPI', 'Python', 'Gemini AI', 'D3.js', 'Jupyter', 'PostgreSQL'],
    status: 'Ongoing',
    visibility: 'public',
    metrics: {
      awards: ['Excellence in Teaching 2023', 'Innovation in Education Award']
    },
    links: {
      github: 'https://github.com/example/ds-virtual-ta',
      demo: 'https://ds-virtual-ta.com'
    },
    media: [
      {
        type: 'video',
        url: '/api/placeholder/video2.mp4',
        thumbnail: '/api/placeholder/800/600',
        alt: 'Virtual TA Interactive Demo'
      },
      {
        type: 'image',
        url: '/api/placeholder/800/500',
        alt: 'Student Dashboard Interface'
      }
    ],
    createdAt: '2023-08-01',
    featured: false
  },
  {
    id: '4',
    title: 'Smart Campus IoT System',
    description: 'IoT-based smart campus management system with real-time monitoring and analytics',
    longDescription: 'Developed an end-to-end IoT solution for smart campus management including environmental monitoring, energy optimization, and student safety features. The system uses edge computing for real-time processing and machine learning for predictive maintenance.',
    role: 'IoT Solutions Architect',
    techStack: ['Arduino', 'Raspberry Pi', 'MQTT', 'InfluxDB', 'Grafana', 'Python', 'React'],
    status: 'Archived',
    visibility: 'public',
    metrics: {
      awards: ['Best IoT Project 2022']
    },
    links: {
      github: 'https://github.com/example/smart-campus'
    },
    media: [
      {
        type: 'image',
        url: '/api/placeholder/800/600',
        alt: 'Smart Campus Dashboard'
      }
    ],
    createdAt: '2022-06-15',
    featured: false
  }
]

const statusColors = {
  'Completed': 'bg-green-500/10 text-green-400 border-green-500/20',
  'Ongoing': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Archived': 'bg-gray-500/10 text-gray-400 border-gray-500/20'
}

const allTechTags = Array.from(new Set(seedProjects.flatMap(p => p.techStack)))

interface MediaViewerProps {
  media: Project['media']
  currentIndex: number
  onIndexChange: (index: number) => void
  onClose: () => void
}

function MediaViewer({ media, currentIndex, onIndexChange, onClose }: MediaViewerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const currentItem = media[currentIndex]

  const handlePrevious = () => {
    onIndexChange(currentIndex > 0 ? currentIndex - 1 : media.length - 1)
  }

  const handleNext = () => {
    onIndexChange(currentIndex < media.length - 1 ? currentIndex + 1 : 0)
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') handlePrevious()
      if (e.key === 'ArrowRight') handleNext()
      if (e.key === ' ' && currentItem.type === 'video') {
        e.preventDefault()
        togglePlay()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex, isPlaying])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div 
        className="relative max-w-7xl max-h-[90vh] w-full mx-4" 
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute -top-12 right-0 text-foreground hover:bg-card z-10"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>

        <div className="relative bg-card rounded-lg overflow-hidden shadow-2xl">
          {currentItem.type === 'image' ? (
            <motion.img
              key={currentItem.url}
              src={currentItem.url}
              alt={currentItem.alt}
              className="w-full h-full object-contain max-h-[80vh]"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            />
          ) : (
            <div className="relative">
              <video
                ref={videoRef}
                src={currentItem.url}
                className="w-full h-full object-contain max-h-[80vh]"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
              <motion.div 
                className="absolute bottom-4 left-4 flex items-center gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={togglePlay}
                  className="bg-background/80 backdrop-blur-sm hover:bg-background/90"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={toggleMute}
                  className="bg-background/80 backdrop-blur-sm hover:bg-background/90"
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
              </motion.div>
            </div>
          )}

          {media.length > 1 && (
            <>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/90"
                  onClick={handlePrevious}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/90"
                  onClick={handleNext}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </motion.div>
            </>
          )}
        </div>

        {media.length > 1 && (
          <motion.div 
            className="flex justify-center mt-4 gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {media.map((_, index) => (
              <motion.button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-primary' : 'bg-muted'
                }`}
                onClick={() => onIndexChange(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
              />
            ))}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}

interface ProjectModalProps {
  project: Project
  isOpen: boolean
  onClose: () => void
  relatedProjects: Project[]
}

function ProjectModal({ project, isOpen, onClose, relatedProjects }: ProjectModalProps) {
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0)
  const [showMediaViewer, setShowMediaViewer] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const openMediaViewer = (index: number) => {
    setSelectedMediaIndex(index)
    setShowMediaViewer(true)
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-sm overflow-y-auto"
            onClick={onClose}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="min-h-full flex items-start justify-center p-4 pt-16"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-card rounded-lg border border-border w-full max-w-4xl relative shadow-2xl">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 z-10 hover:bg-background/80"
                    onClick={onClose}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </motion.div>

                <div className="p-8">
                  <motion.div 
                    className="flex items-start justify-between mb-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <motion.h1 
                          className="text-3xl font-heading font-bold"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2, duration: 0.6 }}
                        >
                          {project.title}
                        </motion.h1>
                        {project.featured && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3, type: "spring" }}
                          >
                            <Sparkles className="h-5 w-5 text-accent" />
                          </motion.div>
                        )}
                        {project.visibility === 'private' ? (
                          <EyeOff className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <Eye className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <motion.div 
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Badge className={statusColors[project.status]}>
                          {project.status}
                        </Badge>
                        {project.featured && (
                          <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                            Featured
                          </Badge>
                        )}
                      </motion.div>
                    </div>
                  </motion.div>

                  <Tabs defaultValue="overview" className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="media">Media</TabsTrigger>
                        <TabsTrigger value="related">Related</TabsTrigger>
                      </TabsList>
                    </motion.div>

                    <TabsContent value="overview" className="space-y-6">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <h3 className="text-lg font-semibold mb-3">Description</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {project.longDescription}
                        </p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <h3 className="text-lg font-semibold mb-3">Role & Contribution</h3>
                        <p className="text-muted-foreground">{project.role}</p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                      >
                        <h3 className="text-lg font-semibold mb-3">Technology Stack</h3>
                        <div className="flex flex-wrap gap-2">
                          {project.techStack.map((tech, index) => (
                            <motion.div
                              key={tech}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.7 + index * 0.05 }}
                              whileHover={{ scale: 1.05 }}
                            >
                              <Badge variant="secondary">
                                <Tag className="h-3 w-3 mr-1" />
                                {tech}
                              </Badge>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>

                      {(project.metrics.patents || project.metrics.accuracy || project.metrics.awards?.length) && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8 }}
                        >
                          <h3 className="text-lg font-semibold mb-3">Metrics & Achievements</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {project.metrics.patents && (
                              <motion.div 
                                className="bg-muted/50 rounded-lg p-4 hover:bg-muted/70 transition-colors"
                                whileHover={{ scale: 1.02 }}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.9 }}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <Award className="h-4 w-4 text-accent" />
                                  <span className="font-medium">Patents</span>
                                </div>
                                <p className="text-2xl font-bold text-accent">{project.metrics.patents}</p>
                              </motion.div>
                            )}
                            {project.metrics.accuracy && (
                              <motion.div 
                                className="bg-muted/50 rounded-lg p-4 hover:bg-muted/70 transition-colors"
                                whileHover={{ scale: 1.02 }}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.0 }}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <Calendar className="h-4 w-4 text-green-400" />
                                  <span className="font-medium">Accuracy</span>
                                </div>
                                <p className="text-2xl font-bold text-green-400">{project.metrics.accuracy}%</p>
                              </motion.div>
                            )}
                            {project.metrics.awards?.length && (
                              <motion.div 
                                className="bg-muted/50 rounded-lg p-4 hover:bg-muted/70 transition-colors"
                                whileHover={{ scale: 1.02 }}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.1 }}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <Award className="h-4 w-4 text-yellow-400" />
                                  <span className="font-medium">Awards</span>
                                </div>
                                <div className="space-y-1">
                                  {project.metrics.awards.slice(0, 2).map(award => (
                                    <p key={award} className="text-xs text-muted-foreground">
                                      {award}
                                    </p>
                                  ))}
                                  {project.metrics.awards.length > 2 && (
                                    <p className="text-xs text-muted-foreground">
                                      +{project.metrics.awards.length - 2} more
                                    </p>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      )}

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 }}
                      >
                        <h3 className="text-lg font-semibold mb-3">Links</h3>
                        <div className="flex flex-wrap gap-2">
                          {project.links.github && (
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button variant="outline" size="sm" asChild>
                                <a href={project.links.github} target="_blank" rel="noopener noreferrer">
                                  <Github className="h-4 w-4 mr-2" />
                                  GitHub
                                </a>
                              </Button>
                            </motion.div>
                          )}
                          {project.links.demo && (
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button variant="outline" size="sm" asChild>
                                <a href={project.links.demo} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Live Demo
                                </a>
                              </Button>
                            </motion.div>
                          )}
                          {project.links.paper && (
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button variant="outline" size="sm" asChild>
                                <a href={project.links.paper} target="_blank" rel="noopener noreferrer">
                                  <FileText className="h-4 w-4 mr-2" />
                                  Paper
                                </a>
                              </Button>
                            </motion.div>
                          )}
                          {project.links.patent && (
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button variant="outline" size="sm" asChild>
                                <a href={project.links.patent} target="_blank" rel="noopener noreferrer">
                                  <Award className="h-4 w-4 mr-2" />
                                  Patent
                                </a>
                              </Button>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    </TabsContent>

                    <TabsContent value="media" className="space-y-4">
                      {project.media.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {project.media.map((item, index) => (
                            <motion.div
                              key={index}
                              className="relative group cursor-pointer rounded-lg overflow-hidden bg-muted/50"
                              onClick={() => openMediaViewer(index)}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                              whileHover={{ scale: 1.02, y: -2 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {item.type === 'image' ? (
                                <img
                                  src={item.url}
                                  alt={item.alt}
                                  className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                                />
                              ) : (
                                <div className="relative">
                                  <img
                                    src={item.thumbnail || item.url}
                                    alt={item.alt}
                                    className="w-full h-48 object-cover"
                                  />
                                  <motion.div 
                                    className="absolute inset-0 flex items-center justify-center bg-black/30"
                                    initial={{ opacity: 0 }}
                                    whileHover={{ opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <motion.div
                                      whileHover={{ scale: 1.2 }}
                                      transition={{ type: "spring", stiffness: 400 }}
                                    >
                                      <Play className="h-8 w-8 text-white" />
                                    </motion.div>
                                  </motion.div>
                                </div>
                              )}
                              <motion.div 
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                whileHover={{ scale: 1.1 }}
                              >
                                <Button size="icon" variant="secondary" className="h-6 w-6 bg-background/80 backdrop-blur-sm">
                                  <Maximize2 className="h-3 w-3" />
                                </Button>
                              </motion.div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-muted-foreground">
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            No media available for this project.
                          </motion.p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="related" className="space-y-4">
                      {relatedProjects.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {relatedProjects.slice(0, 4).map((relatedProject, index) => (
                            <motion.div
                              key={relatedProject.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              whileHover={{ y: -2 }}
                            >
                              <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between mb-2">
                                    <h4 className="font-semibold">{relatedProject.title}</h4>
                                    <Badge className={statusColors[relatedProject.status]}>
                                      {relatedProject.status}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2 overflow-hidden">
                                    {relatedProject.description}
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {relatedProject.techStack.slice(0, 3).map((tech) => (
                                      <Badge key={tech} variant="outline" className="text-xs">
                                        {tech}
                                      </Badge>
                                    ))}
                                    {relatedProject.techStack.length > 3 && (
                                      <Badge variant="outline" className="text-xs">
                                        +{relatedProject.techStack.length - 3}
                                      </Badge>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-muted-foreground">
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            No related projects found.
                          </motion.p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMediaViewer && (
          <MediaViewer
            media={project.media}
            currentIndex={selectedMediaIndex}
            onIndexChange={setSelectedMediaIndex}
            onClose={() => setShowMediaViewer(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTechTags, setSelectedTechTags] = useState<string[]>([])
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [sortBy, setSortBy] = useState('newest')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize with seed data
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true)
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        setProjects(seedProjects)
        setError(null)
      } catch (err) {
        setError('Failed to load projects. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    initializeData()
  }, [])

  // Filter and sort projects
  useEffect(() => {
    let filtered = projects

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.techStack.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Apply tech stack filter
    if (selectedTechTags.length > 0) {
      filtered = filtered.filter(project =>
        selectedTechTags.every(tag => project.techStack.includes(tag))
      )
    }

    // Apply status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(project => project.status === selectedStatus)
    }

    // Apply sorting
    filtered = filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'featured':
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'metrics':
          const aScore = (a.metrics.accuracy || 0) + (a.metrics.patents || 0) * 10 + (a.metrics.awards?.length || 0) * 5
          const bScore = (b.metrics.accuracy || 0) + (b.metrics.patents || 0) * 10 + (b.metrics.awards?.length || 0) * 5
          return bScore - aScore
        default:
          return 0
      }
    })

    setFilteredProjects(filtered)
  }, [projects, searchTerm, selectedTechTags, selectedStatus, sortBy])

  const toggleTechTag = (tag: string) => {
    setSelectedTechTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedTechTags([])
    setSelectedStatus('all')
    setSortBy('newest')
  }

  const getRelatedProjects = useCallback((project: Project) => {
    return projects
      .filter(p => p.id !== project.id)
      .filter(p => p.techStack.some(tech => project.techStack.includes(tech)))
      .slice(0, 4)
  }, [projects])

  const openProjectModal = (project: Project) => {
    setSelectedProject(project)
  }

  const closeProjectModal = () => {
    setSelectedProject(null)
  }

  if (error) {
    return (
      <section className="py-20">
        <div className="container max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl font-heading font-bold mb-4">Projects</h2>
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="py-20">
        <div className="container max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2 
              className="text-3xl font-heading font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              Featured Projects
            </motion.h2>
            <motion.p 
              className="text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Explore my portfolio of innovative projects spanning AI, machine learning, and full-stack development
            </motion.p>
          </motion.div>

          {/* Enhanced Filters */}
          <motion.div 
            className="bg-card rounded-lg border border-border p-6 mb-8 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search projects, technologies, or descriptions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Ongoing">Ongoing</SelectItem>
                    <SelectItem value="Archived">Archived</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="metrics">Best Metrics</SelectItem>
                  </SelectContent>
                </Select>

                {(searchTerm || selectedTechTags.length > 0 || selectedStatus !== 'all' || sortBy !== 'newest') && (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button variant="outline" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Tech Tags */}
            <motion.div 
              className="mt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filter by Technology:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {allTechTags.map((tag, index) => (
                  <motion.div
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.02 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant={selectedTechTags.includes(tag) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleTechTag(tag)}
                      className="text-xs transition-all duration-200"
                    >
                      {tag}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Project Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-muted rounded mb-4" />
                      <div className="h-20 bg-muted rounded mb-4" />
                      <div className="flex gap-2 mb-4">
                        <div className="h-6 w-16 bg-muted rounded" />
                        <div className="h-6 w-20 bg-muted rounded" />
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {[...Array(3)].map((_, j) => (
                          <div key={j} className="h-5 w-12 bg-muted rounded" />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    whileHover={{ 
                      y: -8, 
                      scale: 1.02,
                      boxShadow: "0 20px 50px rgba(0,0,0,0.4)" 
                    }}
                    transition={{ 
                      duration: 0.3,
                      delay: index * 0.05,
                      type: "spring",
                      stiffness: 400,
                      damping: 25
                    }}
                  >
                    <Card 
                      className="cursor-pointer hover:bg-card/80 transition-all duration-200 group h-full relative overflow-hidden"
                      onClick={() => openProjectModal(project)}
                    >
                      {project.featured && (
                        <motion.div
                          className="absolute top-3 right-3 z-10"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3, type: "spring" }}
                          whileHover={{ scale: 1.2, rotate: 12 }}
                        >
                          <div className="bg-accent/20 backdrop-blur-sm rounded-full p-1">
                            <Sparkles className="h-4 w-4 text-accent" />
                          </div>
                        </motion.div>
                      )}
                      
                      <CardContent className="p-6 h-full flex flex-col">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <motion.h3 
                              className="font-semibold text-lg group-hover:text-primary transition-colors duration-200 mb-1"
                              whileHover={{ x: 2 }}
                            >
                              {project.title}
                            </motion.h3>
                            {project.visibility === 'private' && (
                              <EyeOff className="h-4 w-4 text-muted-foreground inline" />
                            )}
                          </div>
                        </div>

                        <motion.div 
                          className="flex gap-1 mb-3"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <Badge className={statusColors[project.status]}>
                            {project.status}
                          </Badge>
                          {project.featured && (
                            <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                              Featured
                            </Badge>
                          )}
                        </motion.div>

                        <motion.p 
                          className="text-muted-foreground mb-4 flex-1 text-sm leading-relaxed overflow-hidden"
                          style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical' as const
                          }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          {project.description}
                        </motion.p>

                        <div className="space-y-3 mt-auto">
                          {(project.metrics.accuracy || project.metrics.patents || project.metrics.awards?.length) && (
                            <motion.div 
                              className="flex gap-3 text-xs"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.4 }}
                            >
                              {project.metrics.accuracy && (
                                <motion.span 
                                  className="text-green-400 font-medium"
                                  whileHover={{ scale: 1.05 }}
                                >
                                  {project.metrics.accuracy}% accuracy
                                </motion.span>
                              )}
                              {project.metrics.patents && (
                                <motion.span 
                                  className="text-accent font-medium"
                                  whileHover={{ scale: 1.05 }}
                                >
                                  {project.metrics.patents} patent{project.metrics.patents > 1 ? 's' : ''}
                                </motion.span>
                              )}
                              {project.metrics.awards?.length && (
                                <motion.span 
                                  className="text-yellow-400 font-medium"
                                  whileHover={{ scale: 1.05 }}
                                >
                                  {project.metrics.awards.length} award{project.metrics.awards.length > 1 ? 's' : ''}
                                </motion.span>
                              )}
                            </motion.div>
                          )}

                          <motion.div 
                            className="flex flex-wrap gap-1"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                          >
                            {project.techStack.slice(0, 3).map((tech, techIndex) => (
                              <motion.div
                                key={tech}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 + techIndex * 0.05 }}
                                whileHover={{ scale: 1.05 }}
                              >
                                <Badge variant="outline" className="text-xs">
                                  {tech}
                                </Badge>
                              </motion.div>
                            ))}
                            {project.techStack.length > 3 && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.65 }}
                                whileHover={{ scale: 1.05 }}
                              >
                                <Badge variant="outline" className="text-xs">
                                  +{project.techStack.length - 3}
                                </Badge>
                              </motion.div>
                            )}
                          </motion.div>
                        </div>

                        {/* Hover overlay */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                        />
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {!isLoading && filteredProjects.length === 0 && (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
              </motion.div>
              <p className="text-muted-foreground mb-4">No projects match your current filters.</p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Project Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          isOpen={!!selectedProject}
          onClose={closeProjectModal}
          relatedProjects={getRelatedProjects(selectedProject)}
        />
      )}
    </>
  )
}