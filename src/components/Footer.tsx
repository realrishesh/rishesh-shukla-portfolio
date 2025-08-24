"use client"

import { useState, useEffect } from "react"
import { Github, Twitter, Linkedin, Mail, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

interface MetaInfo {
  buildDate?: string
  version?: string
}

export default function Footer() {
  const [email, setEmail] = useState("")
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [metaInfo, setMetaInfo] = useState<MetaInfo>({})

  useEffect(() => {
    // Fetch meta information
    const fetchMeta = async () => {
      try {
        const response = await fetch("/api/meta")
        if (response.ok) {
          const data = await response.json()
          setMetaInfo(data)
        }
      } catch (error) {
        console.error("Failed to fetch meta info:", error)
      }
    }

    fetchMeta()
  }, [])

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubscribing(true)
    
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        toast.success("Successfully subscribed to newsletter!")
        setEmail("")
      } else {
        throw new Error("Subscription failed")
      }
    } catch (error) {
      toast.error("Failed to subscribe. Please try again.")
    } finally {
      setIsSubscribing(false)
    }
  }

  const socialLinks = [
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ]

  const quickLinks = [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Sitemap", href: "/sitemap" },
  ]

  return (
    <footer className="bg-card border-t border-border">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Left Section */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 bg-primary rounded-sm" />
              <span className="font-heading font-semibold text-sm">Logo</span>
            </div>
            <p className="text-xs text-muted-foreground">
              © 2024 Company Name. All rights reserved.
            </p>
          </div>

          {/* Center Section - Newsletter (Mobile: Below left, Desktop: Center) */}
          <div className="order-3 lg:order-2">
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
              <Input
                type="email"
                placeholder="Enter email for updates"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-xs h-8 bg-input border-border"
                disabled={isSubscribing}
              />
              <Button
                type="submit"
                size="sm"
                className="h-8 px-3 text-xs"
                disabled={isSubscribing || !email}
              >
                {isSubscribing ? "..." : "Subscribe"}
              </Button>
            </form>
          </div>

          {/* Right Section */}
          <div className="order-2 lg:order-3 flex flex-col sm:flex-row gap-4 sm:items-center">
            {/* Quick Links */}
            <nav className="flex gap-4">
              {quickLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Social Icons */}
            <div className="flex gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>

            {/* Build Info Badge */}
            {(metaInfo.buildDate || metaInfo.version) && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <ExternalLink className="h-3 w-3" />
                <span>
                  {metaInfo.version && `v${metaInfo.version}`}
                  {metaInfo.version && metaInfo.buildDate && " • "}
                  {metaInfo.buildDate && new Date(metaInfo.buildDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}