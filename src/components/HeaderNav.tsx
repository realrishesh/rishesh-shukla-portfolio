"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from "framer-motion"
import { 
  Menu, 
  X, 
  Moon, 
  Sun, 
  Download, 
  User, 
  ChevronUp,
  Github,
  Linkedin,
  Mail,
  Twitter
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface HeaderNavProps {
  className?: string
}

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Education", href: "#education" },
  { label: "Projects", href: "#projects" },
  { label: "Leadership", href: "#leadership" },
  { label: "Skills", href: "#skills" },
  { label: "Certifications", href: "#certifications" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
]

const socialLinks = [
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Mail, href: "mailto:hello@rishesh.dev", label: "Email" },
]

export default function HeaderNav({ className }: HeaderNavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDark, setIsDark] = useState(true)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50)
    setShowBackToTop(latest > 800)
  })

  useEffect(() => {
    // Initialize theme from localStorage
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme")
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      const theme = stored || (prefersDark ? "dark" : "light")
      setIsDark(theme === "dark")
      document.documentElement.classList.toggle("dark", theme === "dark")
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const id = entry.target.id
              if (id) setActiveSection(id)
            }
          })
        },
        { threshold: 0.3, rootMargin: "-50px 0px -50px 0px" }
      )

      navItems.forEach(({ href }) => {
        const element = document.querySelector(href)
        if (element) observer.observe(element)
      })

      return () => observer.disconnect()
    }
  }, [])

  const toggleTheme = () => {
    if (typeof window !== "undefined") {
      const newTheme = !isDark
      setIsDark(newTheme)
      localStorage.setItem("theme", newTheme ? "dark" : "light")
      document.documentElement.classList.toggle("dark", newTheme)
    }
  }

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setIsMenuOpen(false)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const downloadResume = () => {
    // In a real app, this would trigger a download
    console.log("Downloading resume...")
  }

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b transition-shadow ${
          isScrolled ? "shadow-lg" : ""
        } ${className || ""}`}
        initial={{ height: 80 }}
        animate={{ height: isScrolled ? 64 : 80 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="container mx-auto px-4 h-full">
          <motion.div
            className="flex items-center justify-between h-full"
            layout
          >
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-heading font-bold text-sm">RS</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="font-heading font-bold text-lg text-foreground">Rishesh Shukla</h1>
                <p className="text-xs text-muted-foreground -mt-1">Full Stack Developer</p>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <motion.button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors relative ${
                    activeSection === item.href.slice(1)
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.label}
                  {activeSection === item.href.slice(1) && (
                    <motion.div
                      className="absolute inset-x-0 -bottom-px h-0.5 bg-primary rounded-full"
                      layoutId="activeTab"
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </motion.button>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-2">
              {/* Social Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <Github className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  {socialLinks.map((social) => (
                    <DropdownMenuItem key={social.label} asChild>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2"
                      >
                        <social.icon className="w-4 h-4" />
                        <span>{social.label}</span>
                      </a>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="text-muted-foreground"
                aria-label="Toggle theme"
              >
                {isLoading ? (
                  <div className="w-4 h-4 bg-muted rounded animate-pulse" />
                ) : isDark ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>

              {/* Resume Download */}
              <Button
                variant="outline"
                size="sm"
                onClick={downloadResume}
                className="text-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Resume
              </Button>

              {/* Admin Sign In */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAuthModalOpen(true)}
                className="text-muted-foreground"
              >
                {isLoading ? (
                  <div className="w-4 h-4 bg-muted rounded-full animate-pulse" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="text-muted-foreground"
                aria-label="Toggle theme"
              >
                {isLoading ? (
                  <div className="w-4 h-4 bg-muted rounded animate-pulse" />
                ) : isDark ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-card border-l z-50 lg:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="font-heading font-semibold text-lg">Menu</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <nav className="flex flex-col p-4 space-y-2">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.href}
                    onClick={() => scrollToSection(item.href)}
                    className={`text-left px-3 py-3 rounded-lg transition-colors ${
                      activeSection === item.href.slice(1)
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {item.label}
                  </motion.button>
                ))}
              </nav>

              <div className="p-4 mt-auto border-t">
                <div className="flex flex-col space-y-3">
                  <Button
                    variant="outline"
                    onClick={downloadResume}
                    className="justify-start"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Resume
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setIsAuthModalOpen(true)
                      setIsMenuOpen(false)
                    }}
                    className="justify-start text-muted-foreground"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Admin Sign In
                  </Button>
                  
                  <div className="flex items-center justify-center space-x-4 pt-4">
                    {socialLinks.map((social) => (
                      <Button
                        key={social.label}
                        variant="ghost"
                        size="sm"
                        asChild
                      >
                        <a
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={social.label}
                        >
                          <social.icon className="w-4 h-4" />
                        </a>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.div
            className="fixed bottom-6 right-6 z-40"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              onClick={scrollToTop}
              size="sm"
              className="rounded-full shadow-lg"
              aria-label="Back to top"
            >
              <ChevronUp className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <Dialog open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Admin Sign In</DialogTitle>
            <DialogDescription>
              Sign in to access the admin dashboard and manage content.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-4 py-4">
            <Button className="w-full">
              <Github className="w-4 h-4 mr-2" />
              Continue with GitHub
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>
            <div className="space-y-2">
              <input
                type="email"
                placeholder="Email"
                className="w-full px-3 py-2 bg-input border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-3 py-2 bg-input border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <Button className="w-full">Sign In</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}