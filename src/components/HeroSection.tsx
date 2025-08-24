"use client"

import { useState, useEffect } from "react"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { ArrowRight, MapPin, Github, Linkedin, Twitter, ChevronDown } from "lucide-react"
import Image from "next/image"

interface ProfileData {
  name: string
  title: string
  tagline: string
  location: string
  avatar: string
  intro: string
  social: {
    github?: string
    linkedin?: string
    twitter?: string
  }
}

const defaultProfile: ProfileData = {
  name: "Alex Chen",
  title: "Senior Product Designer & Developer",
  tagline: "Crafting digital experiences that drive business growth",
  location: "San Francisco, CA",
  avatar: "/api/placeholder/200/200",
  intro: "I bridge the gap between design and development, creating user-centered solutions that scale with business needs.",
  social: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com"
  }
}

export default function HeroSection() {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile)
  const [isLoading, setIsLoading] = useState(true)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    // Check for reduced motion preference
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
      setPrefersReducedMotion(mediaQuery.matches)
      
      const handleChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches)
      }
      
      mediaQuery.addEventListener("change", handleChange)
      return () => mediaQuery.removeEventListener("change", handleChange)
    }
  }, [])

  useEffect(() => {
    // Fetch profile data
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/profile")
        if (response.ok) {
          const data = await response.json()
          setProfile({ ...defaultProfile, ...data })
        }
      } catch (error) {
        console.log("Using default profile data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const headlineParts = [
    "Leading with Logic",
    "Designing with Data", 
    "Building for Impact"
  ]

  return (
    <section className="relative min-h-screen bg-background overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5" />
        {!prefersReducedMotion && (
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                "radial-gradient(circle at 20% 80%, rgba(155, 140, 255, 0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 20%, rgba(255, 232, 155, 0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 40% 40%, rgba(155, 140, 255, 0.1) 0%, transparent 50%)"
              ]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
        )}
      </div>

      <div className="relative container mx-auto px-6 py-20 min-h-screen flex flex-col justify-center">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-7xl mx-auto">
          
          {/* Left Content */}
          <div className="space-y-8 lg:pr-8">
            <motion.div
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-4"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold leading-tight">
                {headlineParts.map((part, index) => (
                  <motion.span
                    key={part}
                    initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      duration: 0.8, 
                      delay: index * 0.3,
                      ease: "easeOut"
                    }}
                    className="block"
                  >
                    {part}
                    {index < headlineParts.length - 1 && (
                      <span className="text-primary"> | </span>
                    )}
                  </motion.span>
                ))}
              </h1>
            </motion.div>

            <motion.div
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                {profile.intro}
              </p>
            </motion.div>

            {/* Primary CTAs */}
            <motion.div
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                size="lg"
                onClick={() => scrollToSection("projects")}
                className="group bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-8 py-3"
                aria-label="Explore my projects section"
              >
                Explore Projects
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollToSection("experience")}
                className="group border-border hover:bg-secondary/50 font-medium px-8 py-3"
                aria-label="View leadership and events section"
              >
                Leadership & Events
                <ChevronDown className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-1" />
              </Button>
              
              <Button
                size="lg"
                variant="ghost"
                onClick={() => scrollToSection("contact")}
                className="hover:bg-secondary/30 font-medium px-6"
                aria-label="Go to contact section"
              >
                Contact Me
              </Button>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.3 }}
              className="flex items-center gap-4 pt-4"
            >
              <span className="text-sm text-muted-foreground">Connect:</span>
              <div className="flex gap-3">
                {profile.social.github && (
                  <a
                    href={profile.social.github}
                    className="p-2 rounded-full hover:bg-secondary/50 transition-colors"
                    aria-label="GitHub profile"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                )}
                {profile.social.linkedin && (
                  <a
                    href={profile.social.linkedin}
                    className="p-2 rounded-full hover:bg-secondary/50 transition-colors"
                    aria-label="LinkedIn profile"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
                {profile.social.twitter && (
                  <a
                    href={profile.social.twitter}
                    className="p-2 rounded-full hover:bg-secondary/50 transition-colors"
                    aria-label="Twitter profile"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Content - Profile */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center lg:items-start space-y-6"
          >
            {/* Profile Image */}
            <div className="relative">
              <motion.div
                whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="relative w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full p-1">
                  <div className="w-full h-full bg-background rounded-full p-1">
                    <Image
                      src={profile.avatar}
                      alt={`${profile.name} - ${profile.title}`}
                      width={256}
                      height={256}
                      className="w-full h-full object-cover rounded-full"
                      priority
                    />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Profile Info */}
            <div className="text-center lg:text-left space-y-2">
              <motion.h2
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="text-2xl sm:text-3xl font-heading font-bold"
              >
                {profile.name}
              </motion.h2>
              
              <motion.p
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="text-lg text-primary font-medium"
              >
                {profile.title}
              </motion.p>
              
              <motion.p
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.1 }}
                className="text-muted-foreground max-w-sm"
              >
                {profile.tagline}
              </motion.p>
              
              <motion.div
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.3 }}
                className="flex items-center justify-center lg:justify-start gap-2 text-sm text-muted-foreground pt-2"
              >
                <MapPin className="h-4 w-4" />
                <span>{profile.location}</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}