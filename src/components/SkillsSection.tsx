"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { 
  Code, 
  Wrench, 
  Globe, 
  Brain, 
  Languages,
  Eye,
  EyeOff,
  Download,
  BarChart3,
  Radar,
  ExternalLink,
  Loader2,
  Sparkles,
  TrendingUp,
  Zap
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

interface Skill {
  id: string
  name: string
  category: 'Programming' | 'Frameworks' | 'Tools' | 'Soft Skills' | 'Languages'
  proficiency: number
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  note?: string
  isPublic: boolean
  projects?: Array<{
    id: string
    name: string
    description: string
  }>
}

const categoryIcons = {
  Programming: Code,
  Frameworks: Wrench,
  Tools: Globe,
  'Soft Skills': Brain,
  Languages: Languages,
}

const categoryColors = {
  Programming: 'bg-chart-1',
  Frameworks: 'bg-chart-2', 
  Tools: 'bg-chart-3',
  'Soft Skills': 'bg-chart-4',
  Languages: 'bg-chart-5',
}

const mockSkills: Skill[] = [
  {
    id: '1',
    name: 'TypeScript',
    category: 'Programming',
    proficiency: 9,
    level: 'Advanced',
    note: 'Primary language for modern web development',
    isPublic: true,
    projects: [
      { id: '1', name: 'E-commerce Platform', description: 'Full-stack TypeScript application' },
      { id: '2', name: 'Task Management App', description: 'React + TypeScript SPA' }
    ]
  },
  {
    id: '2',
    name: 'Next.js',
    category: 'Frameworks',
    proficiency: 8,
    level: 'Advanced',
    isPublic: true,
    projects: [
      { id: '3', name: 'Portfolio Website', description: 'Built with Next.js 15 and TypeScript' }
    ]
  },
  {
    id: '3',
    name: 'Docker',
    category: 'Tools',
    proficiency: 7,
    level: 'Intermediate',
    isPublic: true,
    projects: [
      { id: '4', name: 'Microservices Platform', description: 'Containerized with Docker' }
    ]
  },
  {
    id: '4',
    name: 'Leadership',
    category: 'Soft Skills',
    proficiency: 8,
    level: 'Advanced',
    note: 'Team leadership and mentoring',
    isPublic: true,
    projects: []
  },
  {
    id: '5',
    name: 'Spanish',
    category: 'Languages',
    proficiency: 6,
    level: 'Intermediate',
    isPublic: false,
    projects: []
  },
  {
    id: '6',
    name: 'Python',
    category: 'Programming',
    proficiency: 9,
    level: 'Advanced',
    note: 'AI/ML and backend development',
    isPublic: true,
    projects: [
      { id: '5', name: 'ML Pipeline', description: 'Data processing and model training' }
    ]
  },
  {
    id: '7',
    name: 'React',
    category: 'Frameworks',
    proficiency: 9,
    level: 'Advanced',
    isPublic: true,
    projects: [
      { id: '6', name: 'Dashboard App', description: 'Complex React application' }
    ]
  }
]

function RadarChart({ skills, selectedCategory }: { skills: Skill[]; selectedCategory: string | null }) {
  const filteredSkills = selectedCategory 
    ? skills.filter(skill => skill.category === selectedCategory)
    : skills.slice(0, 6) // Limit to 6 for radar chart readability

  const centerX = 150
  const centerY = 150
  const radius = 100
  const levels = 5

  const angleStep = (2 * Math.PI) / filteredSkills.length

  return (
    <motion.div 
      className="flex justify-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <svg width="300" height="300" className="text-muted-foreground">
        {/* Grid circles */}
        {Array.from({ length: levels }, (_, i) => (
          <motion.circle
            key={i}
            cx={centerX}
            cy={centerY}
            r={(radius * (i + 1)) / levels}
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: i * 0.1 }}
          />
        ))}
        
        {/* Grid lines */}
        {filteredSkills.map((_, i) => {
          const angle = i * angleStep - Math.PI / 2
          const x = centerX + radius * Math.cos(angle)
          const y = centerY + radius * Math.sin(angle)
          return (
            <motion.line
              key={i}
              x1={centerX}
              y1={centerY}
              x2={x}
              y2={y}
              stroke="currentColor"
              strokeOpacity="0.2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.05 }}
            />
          )
        })}
        
        {/* Skill polygon */}
        <motion.polygon
          points={filteredSkills.map((skill, i) => {
            const angle = i * angleStep - Math.PI / 2
            const distance = (radius * skill.proficiency) / 10
            const x = centerX + distance * Math.cos(angle)
            const y = centerY + distance * Math.sin(angle)
            return `${x},${y}`
          }).join(' ')}
          fill="hsl(var(--primary))"
          fillOpacity="0.3"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          initial={{ pathLength: 0, fillOpacity: 0 }}
          animate={{ pathLength: 1, fillOpacity: 0.3 }}
          transition={{ duration: 1.2, delay: 0.5 }}
        />
        
        {/* Skill points */}
        {filteredSkills.map((skill, i) => {
          const angle = i * angleStep - Math.PI / 2
          const distance = (radius * skill.proficiency) / 10
          const x = centerX + distance * Math.cos(angle)
          const y = centerY + distance * Math.sin(angle)
          
          return (
            <motion.g key={skill.id}>
              <motion.circle
                cx={x}
                cy={y}
                r="4"
                fill="hsl(var(--primary))"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  duration: 0.4, 
                  delay: 0.7 + i * 0.1,
                  type: "spring",
                  stiffness: 400 
                }}
                whileHover={{ scale: 1.5, r: 6 }}
              />
              {/* Pulse effect for high proficiency */}
              {skill.proficiency >= 8 && (
                <motion.circle
                  cx={x}
                  cy={y}
                  r="4"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [1, 2, 1], 
                    opacity: [0.8, 0, 0.8] 
                  }}
                  transition={{ 
                    duration: 2, 
                    delay: 1 + i * 0.2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
            </motion.g>
          )
        })}
        
        {/* Labels */}
        {filteredSkills.map((skill, i) => {
          const angle = i * angleStep - Math.PI / 2
          const labelDistance = radius + 20
          const x = centerX + labelDistance * Math.cos(angle)
          const y = centerY + labelDistance * Math.sin(angle)
          
          return (
            <motion.text
              key={skill.id}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-sm fill-foreground font-medium"
              fontSize="12"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.9 + i * 0.05 }}
            >
              {skill.name}
            </motion.text>
          )
        })}
      </svg>
    </motion.div>
  )
}

function SkillBars({ skills, selectedCategory }: { skills: Skill[]; selectedCategory: string | null }) {
  const filteredSkills = selectedCategory 
    ? skills.filter(skill => skill.category === selectedCategory)
    : skills

  return (
    <div className="space-y-4">
      {filteredSkills.map((skill, index) => (
        <motion.div
          key={skill.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ x: 4 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">{skill.name}</span>
              {skill.proficiency >= 8 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <Sparkles className="h-3 w-3 text-accent" />
                </motion.div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{skill.proficiency}/10</span>
              {skill.proficiency >= 7 && (
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    delay: index * 0.3 
                  }}
                >
                  <TrendingUp className="h-3 w-3 text-green-400" />
                </motion.div>
              )}
            </div>
          </div>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <motion.div
              className={`h-3 rounded-full ${categoryColors[skill.category]} relative overflow-hidden`}
              initial={{ width: 0 }}
              animate={{ width: `${(skill.proficiency / 10) * 100}%` }}
              transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
            >
              {/* Shimmer effect for high proficiency */}
              {skill.proficiency >= 8 && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    delay: 1 + index * 0.2,
                    ease: "easeInOut"
                  }}
                />
              )}
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function SkillItem({ skill, index }: { skill: Skill; index: number }) {
  const IconComponent = categoryIcons[skill.category]

  return (
    <Popover>
      <PopoverTrigger asChild>
        <motion.div
          className="p-4 border rounded-lg cursor-pointer hover:bg-accent/5 transition-colors relative overflow-hidden group"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
        >
          {/* Background animation for high proficiency */}
          {skill.proficiency >= 8 && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 opacity-0 group-hover:opacity-100"
              animate={{ 
                background: [
                  'linear-gradient(45deg, rgba(155, 140, 255, 0.05) 0%, rgba(255, 232, 155, 0.05) 100%)',
                  'linear-gradient(45deg, rgba(255, 232, 155, 0.05) 0%, rgba(155, 140, 255, 0.05) 100%)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
          
          <div className="flex items-start gap-3 relative z-10">
            <motion.div 
              className={`p-2 rounded-md ${categoryColors[skill.category]}/20 relative`}
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <IconComponent className="w-4 h-4" />
              {skill.proficiency >= 9 && (
                <motion.div
                  className="absolute -top-1 -right-1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                >
                  <Zap className="w-3 h-3 text-accent" />
                </motion.div>
              )}
            </motion.div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <motion.h4 
                  className="font-medium truncate"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                >
                  {skill.name}
                </motion.h4>
                {skill.isPublic ? (
                  <Eye className="w-3 h-3 text-muted-foreground" />
                ) : (
                  <EyeOff className="w-3 h-3 text-muted-foreground" />
                )}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Badge 
                  variant="secondary" 
                  className="text-xs"
                >
                  {skill.level}
                </Badge>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-muted-foreground">
                    {skill.proficiency}/10
                  </span>
                  {skill.proficiency >= 8 && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      ⭐
                    </motion.div>
                  )}
                </div>
              </div>
              {skill.note && (
                <motion.p 
                  className="text-sm text-muted-foreground"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical' as const,
                    overflow: 'hidden'
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  {skill.note}
                </motion.p>
              )}
            </div>
          </div>
        </motion.div>
      </PopoverTrigger>
      <PopoverContent className="w-80" side="top">
        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-2">
            <IconComponent className="w-4 h-4" />
            <h4 className="font-semibold">{skill.name}</h4>
            {skill.proficiency >= 8 && (
              <Badge variant="outline" className="text-xs bg-accent/10 text-accent border-accent/30">
                Expert
              </Badge>
            )}
          </div>
          {skill.projects && skill.projects.length > 0 ? (
            <div>
              <h5 className="text-sm font-medium mb-2">Projects using this skill:</h5>
              <div className="space-y-2">
                {skill.projects.map((project, projectIndex) => (
                  <motion.div 
                    key={project.id} 
                    className="p-2 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: projectIndex * 0.1 }}
                    whileHover={{ x: 2 }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{project.name}</span>
                      <ExternalLink className="w-3 h-3 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {project.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No projects available for this skill yet.
            </p>
          )}
        </motion.div>
      </PopoverContent>
    </Popover>
  )
}

function LoadingSkeleton({ viewType }: { viewType: 'radar' | 'bars' }) {
  if (viewType === 'radar') {
    return (
      <div className="flex justify-center">
        <div className="w-[300px] h-[300px] bg-muted/20 rounded-full animate-pulse flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-8 h-8 text-muted-foreground" />
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }, (_, i) => (
        <motion.div 
          key={i} 
          className="space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
        >
          <div className="flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-8" />
          </div>
          <Skeleton className="h-2 w-full" />
        </motion.div>
      ))}
    </div>
  )
}

export default function SkillsSection() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [viewType, setViewType] = useState<'radar' | 'bars'>('radar')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = ['Programming', 'Frameworks', 'Tools', 'Soft Skills', 'Languages'] as const

  useEffect(() => {
    // Simulate API call
    const fetchSkills = async () => {
      setLoading(true)
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSkills(mockSkills)
      setLoading(false)
    }

    fetchSkills()
  }, [])

  useEffect(() => {
    // Set default view based on screen size
    const handleResize = () => {
      if (typeof window !== "undefined") {
        setViewType(window.innerWidth < 768 ? 'bars' : 'radar')
      }
    }

    if (typeof window !== "undefined") {
      handleResize()
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleExportSkills = () => {
    if (typeof window !== "undefined") {
      const dataStr = JSON.stringify(skills, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'skills-export.json'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      toast.success('Skills exported successfully!')
    }
  }

  const filteredSkills = selectedCategory 
    ? skills.filter(skill => skill.category === selectedCategory)
    : skills

  return (
    <section className="py-12">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.h2 
            className="text-3xl font-heading font-bold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Skills & Competencies
          </motion.h2>
          <motion.p 
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            A comprehensive overview of my technical skills and expertise across various domains
          </motion.p>
        </div>

        {/* Controls */}
        <motion.div 
          className="flex flex-wrap items-center justify-between gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant={selectedCategory === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                All
              </Button>
            </motion.div>
            {categories.map((category, index) => {
              const IconComponent = categoryIcons[category]
              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="gap-2"
                  >
                    <IconComponent className="w-3 h-3" />
                    {category}
                  </Button>
                </motion.div>
              )
            })}
          </div>

          {/* View Toggle & Export */}
          <div className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant={viewType === 'radar' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewType('radar')}
                className="gap-2"
              >
                <Radar className="w-3 h-3" />
                Radar
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant={viewType === 'bars' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewType('bars')}
                className="gap-2"
              >
                <BarChart3 className="w-3 h-3" />
                Bars
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportSkills}
                disabled={loading}
                className="gap-2"
              >
                <Download className="w-3 h-3" />
                Export
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Chart Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="overflow-hidden">
            <CardContent className="p-8">
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <LoadingSkeleton viewType={viewType} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="chart"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {viewType === 'radar' ? (
                      <div className="space-y-6">
                        <RadarChart skills={skills} selectedCategory={selectedCategory} />
                        {/* Accessibility: Textual summary */}
                        <div className="sr-only">
                          <h3>Skills Summary</h3>
                          <ul>
                            {filteredSkills.map(skill => (
                              <li key={skill.id}>
                                {skill.name}: {skill.proficiency} out of 10, {skill.level} level
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <SkillBars skills={skills} selectedCategory={selectedCategory} />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }, (_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Skeleton className="w-8 h-8 rounded-md" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-24" />
                          <div className="flex gap-2">
                            <Skeleton className="h-5 w-16" />
                            <Skeleton className="h-5 w-8" />
                          </div>
                          <Skeleton className="h-3 w-full" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {filteredSkills.map((skill, index) => (
                  <motion.div
                    key={skill.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SkillItem skill={skill} index={index} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}