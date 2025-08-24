"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { ChevronDown, ChevronRight, GraduationCap, Heart, Lightbulb } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface EducationItem {
  institution: string
  degree: string
  score: string
  years: string
  icon?: string
}

interface ProfileData {
  shortBio: string
  longBio: string
  motto: string
  hobbies: string[]
  funFact: string
  education: EducationItem[]
}

const defaultData: ProfileData = {
  shortBio: "Full-stack developer with expertise in modern web technologies and a passion for creating impactful digital experiences. Currently building innovative solutions that bridge technology and user needs.",
  longBio: `I'm a passionate full-stack developer with over 5 years of experience in building scalable web applications and digital products. My journey began during my undergraduate studies at KIET, where I discovered my love for coding and problem-solving.

Throughout my career, I've had the privilege of working with diverse teams and technologies, from startups to established companies. I specialize in React, Node.js, and cloud architectures, but I'm always eager to learn new technologies and approaches.

When I'm not coding, you'll find me exploring the latest tech trends, contributing to open-source projects, or mentoring aspiring developers. I believe in the power of technology to solve real-world problems and create meaningful connections between people.`,
  motto: "Code with purpose, design with empathy, ship with confidence.",
  hobbies: ["Photography", "Chess", "Hiking", "Reading"],
  funFact: "I once debugged a production issue while on a mountain trek using just my phone's hotspot!",
  education: [
    {
      institution: "KIET",
      degree: "B.Tech Computer Science",
      score: "CGPA: 8.5/10",
      years: "2018-2022"
    },
    {
      institution: "IIT Madras",
      degree: "Advanced Certification",
      score: "Grade: A+",
      years: "2022"
    },
    {
      institution: "MV Convent",
      degree: "Higher Secondary",
      score: "95.2%",
      years: "2016-2018"
    }
  ]
}

const FlipCard = ({ front, back }: { front: string; back: string }) => {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div 
      className="relative h-8 w-24 cursor-pointer preserve-3d"
      style={{ perspective: "1000px" }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="absolute inset-0 w-full h-full backface-hidden"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{ 
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden"
        }}
      >
        <Badge 
          variant="secondary" 
          className="w-full h-full flex items-center justify-center text-xs bg-secondary/50 hover:bg-secondary/70 transition-colors"
        >
          {front}
        </Badge>
      </motion.div>
      <motion.div
        className="absolute inset-0 w-full h-full backface-hidden"
        animate={{ rotateY: isFlipped ? 0 : -180 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{ 
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)"
        }}
      >
        <Badge 
          variant="outline" 
          className="w-full h-full flex items-center justify-center text-xs bg-primary/10 border-primary/30 text-primary px-2"
        >
          <span className="truncate">{back}</span>
        </Badge>
      </motion.div>
    </div>
  )
}

const EducationCard = ({ item, index }: { item: EducationItem; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
  >
    <Card className="bg-card/50 border-border/50 hover:bg-card/70 transition-all duration-200 hover:border-primary/20">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm text-foreground mb-1 truncate">
              {item.institution}
            </h4>
            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
              {item.degree}
            </p>
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-xs">
                {item.score}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {item.years}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
)

const ChipToggle = ({ 
  icon: Icon, 
  label, 
  isActive, 
  onClick 
}: { 
  icon: React.ComponentType<any>
  label: string
  isActive: boolean
  onClick: () => void 
}) => (
  <Button
    variant={isActive ? "default" : "secondary"}
    size="sm"
    onClick={onClick}
    className={`
      flex items-center gap-2 transition-all duration-200
      ${isActive 
        ? "bg-primary text-primary-foreground shadow-lg scale-105" 
        : "bg-secondary/50 hover:bg-secondary/70"
      }
    `}
  >
    <Icon className="w-4 h-4" />
    {label}
  </Button>
)

export default function AboutSection() {
  const [data, setData] = useState<ProfileData>(defaultData)
  const [isLoading, setIsLoading] = useState(true)
  const [activeChips, setActiveChips] = useState<Set<string>>(new Set())

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call - replace with actual fetch
        await new Promise(resolve => setTimeout(resolve, 800))
        setData(defaultData)
      } catch (error) {
        console.error("Failed to fetch profile data:", error)
        setData(defaultData)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const toggleChip = (chip: string) => {
    setActiveChips(prev => {
      const newSet = new Set(prev)
      if (newSet.has(chip)) {
        newSet.delete(chip)
      } else {
        newSet.add(chip)
      }
      return newSet
    })
  }

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="space-y-8">
          {/* Bio skeleton */}
          <div className="space-y-4">
            <div className="h-6 bg-muted/30 rounded animate-pulse w-32" />
            <div className="space-y-2">
              <div className="h-4 bg-muted/20 rounded animate-pulse" />
              <div className="h-4 bg-muted/20 rounded animate-pulse w-3/4" />
            </div>
          </div>
          
          {/* Timeline skeleton */}
          <div className="space-y-4">
            <div className="h-6 bg-muted/30 rounded animate-pulse w-40" />
            <div className="grid gap-4 md:grid-cols-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-muted/20 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
          
          {/* Chips skeleton */}
          <div className="flex flex-wrap gap-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-8 w-20 bg-muted/20 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12">
      <div className="space-y-12">
        {/* Bio Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-heading font-bold text-foreground">
            About Me
          </h2>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="bio" className="border-border/50">
              <div className="space-y-4">
                <p className="text-foreground/90 leading-relaxed">
                  {data.shortBio}
                </p>
                <AccordionTrigger className="text-sm text-primary hover:text-primary/80 font-medium pt-0 pb-4">
                  Read more about my journey
                </AccordionTrigger>
              </div>
              <AccordionContent className="pb-6">
                <div className="prose prose-sm max-w-none prose-invert">
                  {data.longBio.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-foreground/80 leading-relaxed mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Education Timeline */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-heading font-semibold text-foreground">
              Education
            </h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary hover:text-primary/80 text-sm"
            >
              View Details
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.education.map((item, index) => (
              <EducationCard key={item.institution} item={item} index={index} />
            ))}
          </div>
        </div>

        {/* Interactive Elements */}
        <div className="space-y-6">
          <h3 className="text-xl font-heading font-semibold text-foreground">
            More About Me
          </h3>
          
          <div className="flex flex-wrap gap-4">
            <ChipToggle
              icon={Heart}
              label="Motto"
              isActive={activeChips.has("motto")}
              onClick={() => toggleChip("motto")}
            />
            <ChipToggle
              icon={Heart}
              label="Hobbies"
              isActive={activeChips.has("hobbies")}
              onClick={() => toggleChip("hobbies")}
            />
            <FlipCard front="Fun Fact" back={data.funFact} />
          </div>

          <AnimatePresence>
            {activeChips.has("motto") && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-foreground/90 italic">
                        "{data.motto}"
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeChips.has("hobbies") && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <Card className="bg-accent/5 border-accent/20">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Heart className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <div className="space-y-2">
                        <p className="text-foreground/90 text-sm font-medium">
                          Things I love doing:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {data.hobbies.map((hobby) => (
                            <Badge 
                              key={hobby} 
                              variant="secondary" 
                              className="bg-accent/10 text-accent border-accent/30"
                            >
                              {hobby}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}