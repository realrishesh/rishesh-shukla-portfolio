"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { Search, Award, ExternalLink, Shield, Calendar, Building2, X, Sparkles, Star, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Certification {
  id: string
  title: string
  organization: string
  issueDate: string
  expiryDate?: string
  credentialId?: string
  credentialUrl?: string
  badgeImage?: string
  description?: string
  isVerified?: boolean
  featured?: boolean
}

// Mock data to replace API call
const mockCertifications: Certification[] = [
  {
    id: '1',
    title: 'Machine Learning with Python',
    organization: 'IBM',
    issueDate: '2023-08-15',
    credentialId: 'IBM-ML-2023-08-001',
    credentialUrl: 'https://example.com/credential/1',
    badgeImage: '/api/placeholder/200/200',
    description: 'Comprehensive certification covering machine learning fundamentals, algorithms, and practical implementation with Python. Includes hands-on projects with scikit-learn, pandas, and numpy.',
    isVerified: true,
    featured: true
  },
  {
    id: '2',
    title: 'Data Science Foundation',
    organization: 'IIT Madras',
    issueDate: '2023-06-20',
    expiryDate: '2026-06-20',
    credentialId: 'IITM-DS-2023-062',
    credentialUrl: 'https://example.com/credential/2',
    badgeImage: '/api/placeholder/200/200',
    description: 'Advanced certification in data science covering statistical analysis, data visualization, and predictive modeling techniques.',
    isVerified: true,
    featured: true  
  },
  {
    id: '3',
    title: 'Microsoft Learn Student Ambassador - Data Analysis',
    organization: 'Microsoft',
    issueDate: '2023-04-10',
    credentialId: 'MSA-DA-2023-041',
    credentialUrl: 'https://example.com/credential/3',
    badgeImage: '/api/placeholder/200/200',
    description: 'Recognition for contributions to the student community and expertise in data analysis with Microsoft tools and technologies.',
    isVerified: true,
    featured: false
  },
  {
    id: '4',
    title: 'AWS Cloud Practitioner',
    organization: 'Amazon Web Services',
    issueDate: '2023-03-05',
    expiryDate: '2026-03-05',
    credentialId: 'AWS-CP-2023-030',
    credentialUrl: 'https://example.com/credential/4',
    badgeImage: '/api/placeholder/200/200',
    description: 'Foundational certification demonstrating understanding of AWS Cloud concepts, services, security, and pricing.',
    isVerified: true,
    featured: false
  },
  {
    id: '5',
    title: 'Full Stack Web Development',
    organization: 'freeCodeCamp',
    issueDate: '2023-01-15',
    credentialId: 'FCC-FSWD-2023-01',
    credentialUrl: 'https://example.com/credential/5',
    badgeImage: '/api/placeholder/200/200',
    description: 'Comprehensive certification covering HTML, CSS, JavaScript, React, Node.js, and database management.',
    isVerified: true,
    featured: false
  },
  {
    id: '6',
    title: 'Google Analytics Individual Qualification',
    organization: 'Google',
    issueDate: '2022-11-20',
    expiryDate: '2024-11-20',
    credentialId: 'GA-IQ-2022-112',
    credentialUrl: 'https://example.com/credential/6',
    badgeImage: '/api/placeholder/200/200',
    description: 'Certification demonstrating proficiency in Google Analytics and digital marketing measurement.',
    isVerified: false,
    featured: false
  }
]

interface CertificationsSectionProps {
  className?: string
}

export default function CertificationsSection({ className = '' }: CertificationsSectionProps) {
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOrganization, setSelectedOrganization] = useState<string>('all')
  const [selectedCertification, setSelectedCertification] = useState<Certification | null>(null)
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<string>>(new Set())

  // Initialize with mock data
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true)
      try {
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        setCertifications(mockCertifications)
        setError(null)
      } catch (err) {
        setError('Failed to load certifications. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    initializeData()
  }, [])

  // Get unique organizations for filter
  const organizations = useMemo(() => {
    const orgs = [...new Set(certifications.map(cert => cert.organization))]
    return orgs.sort()
  }, [certifications])

  // Filter certifications
  const filteredCertifications = useMemo(() => {
    return certifications.filter(cert => {
      const matchesSearch = cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          cert.organization.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesOrganization = selectedOrganization === 'all' || 
                                cert.organization === selectedOrganization
      return matchesSearch && matchesOrganization
    }).sort((a, b) => {
      // Sort featured certifications first
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      return new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()
    })
  }, [certifications, searchTerm, selectedOrganization])

  const handleImageError = (certId: string) => {
    setImageLoadErrors(prev => new Set(prev).add(certId))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    })
  }

  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false
    const expiry = new Date(expiryDate)
    const now = new Date()
    const sixMonthsFromNow = new Date()
    sixMonthsFromNow.setMonth(now.getMonth() + 6)
    return expiry <= sixMonthsFromNow && expiry > now
  }

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false
    return new Date(expiryDate) <= new Date()
  }

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="space-y-2">
            <div className="h-8 bg-muted rounded w-1/3 loading-shimmer"></div>
            <div className="h-4 bg-muted rounded w-1/2 loading-shimmer"></div>
          </div>
          <div className="flex gap-4">
            <div className="h-10 bg-muted rounded w-64 loading-shimmer"></div>
            <div className="h-10 bg-muted rounded w-48 loading-shimmer"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="h-64 bg-muted rounded-lg loading-shimmer"></div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <motion.div 
        className={`flex items-center justify-center min-h-[400px] ${className}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="text-center space-y-4">
          <motion.div 
            className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <X className="w-8 h-8 text-destructive" />
          </motion.div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Error Loading Certifications</h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </motion.div>
        </div>
      </motion.div>
    )
  }

  if (certifications.length === 0) {
    return (
      <motion.div 
        className={`flex items-center justify-center min-h-[400px] ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center space-y-6 max-w-md">
          <motion.div 
            className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Award className="w-10 h-10 text-muted-foreground" />
          </motion.div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">No Certifications Yet</h3>
            <p className="text-muted-foreground">
              Start building your professional credentials by adding your first certification.
            </p>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Award className="w-4 h-4 mr-2" />
              Add Certification
            </Button>
          </motion.div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-heading font-bold text-foreground mb-2">Certifications & Achievements</h2>
        <p className="text-muted-foreground max-w-2xl">Professional credentials and industry certifications that validate my expertise across various technologies and domains.</p>
      </motion.div>

      {/* Filters */}
      <motion.div 
        className="flex flex-col sm:flex-row gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search certifications and organizations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-card border-input transition-all duration-200 focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Select value={selectedOrganization} onValueChange={setSelectedOrganization}>
            <SelectTrigger className="w-full sm:w-48 bg-card border-input">
              <SelectValue placeholder="Filter by organization" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Organizations</SelectItem>
              {organizations.map((org) => (
                <SelectItem key={org} value={org}>{org}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>
      </motion.div>

      {/* Results count */}
      {filteredCertifications.length !== certifications.length && (
        <motion.div 
          className="text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Showing {filteredCertifications.length} of {certifications.length} certifications
        </motion.div>
      )}

      {/* Certifications grid */}
      {filteredCertifications.length === 0 ? (
        <motion.div 
          className="text-center py-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div 
            className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4"
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Search className="w-8 h-8 text-muted-foreground" />
          </motion.div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No Matches Found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
        </motion.div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <AnimatePresence mode="popLayout">
            {filteredCertifications.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 400,
                  damping: 25
                }}
                whileHover={{ y: -6, scale: 1.02 }}
                layout
              >
                <Card 
                  className="h-full cursor-pointer bg-card border-border hover:border-primary/50 transition-all duration-300 group relative overflow-hidden"
                  onClick={() => setSelectedCertification(cert)}
                >
                  {/* Background gradient for featured */}
                  {cert.featured && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 opacity-0 group-hover:opacity-100"
                      animate={{ 
                        background: [
                          'linear-gradient(135deg, rgba(155, 140, 255, 0.05) 0%, rgba(255, 232, 155, 0.05) 100%)',
                          'linear-gradient(135deg, rgba(255, 232, 155, 0.05) 0%, rgba(155, 140, 255, 0.05) 100%)'
                        ]
                      }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    />
                  )}

                  <CardContent className="p-6 space-y-4 relative z-10">
                    {/* Badge/Image */}
                    <div className="flex items-start justify-between">
                      <motion.div 
                        className="w-16 h-16 rounded-lg bg-muted flex-shrink-0 overflow-hidden relative"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        {cert.badgeImage && !imageLoadErrors.has(cert.id) ? (
                          <img
                            src={cert.badgeImage}
                            alt={`${cert.title} badge`}
                            className="w-full h-full object-cover"
                            onError={() => handleImageError(cert.id)}
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                            <Award className="w-8 h-8 text-primary" />
                          </div>
                        )}
                        {cert.featured && (
                          <motion.div
                            className="absolute -top-1 -right-1"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3, type: "spring" }}
                            whileHover={{ rotate: 12, scale: 1.2 }}
                          >
                            <div className="bg-accent/20 backdrop-blur-sm rounded-full p-1">
                              <Star className="h-3 w-3 text-accent fill-accent" />
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                      
                      <div className="flex flex-col gap-1">
                        {cert.isVerified && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 + index * 0.05 }}
                            whileHover={{ scale: 1.05 }}
                          >
                            <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                              <Shield className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          </motion.div>
                        )}
                        {isExpiringSoon(cert.expiryDate) && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + index * 0.05 }}
                            whileHover={{ scale: 1.05 }}
                          >
                            <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                              <Zap className="w-3 h-3 mr-1" />
                              Expiring Soon
                            </Badge>
                          </motion.div>
                        )}
                        {isExpired(cert.expiryDate) && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + index * 0.05 }}
                            whileHover={{ scale: 1.05 }}
                          >
                            <Badge variant="secondary" className="bg-red-500/20 text-red-400 border-red-500/30">
                              Expired
                            </Badge>
                          </motion.div>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      <motion.h3 
                        className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200"
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical' as const,
                          overflow: 'hidden'
                        }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + index * 0.03 }}
                        whileHover={{ x: 2 }}
                      >
                        {cert.title}
                      </motion.h3>
                      
                      <motion.div 
                        className="flex items-center text-sm text-muted-foreground"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.03 }}
                      >
                        <Building2 className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span className="truncate">{cert.organization}</span>
                      </motion.div>

                      <motion.div 
                        className="flex items-center text-sm text-muted-foreground"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.03 }}
                      >
                        <Calendar className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span>{formatDate(cert.issueDate)}</span>
                        {cert.expiryDate && (
                          <span className="text-xs"> - {formatDate(cert.expiryDate)}</span>
                        )}
                      </motion.div>

                      {cert.credentialId && (
                        <motion.div 
                          className="text-xs text-muted-foreground font-mono"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 + index * 0.03 }}
                        >
                          ID: {cert.credentialId}
                        </motion.div>
                      )}
                    </div>

                    {/* View indicator */}
                    <motion.div 
                      className="flex items-center justify-between pt-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.03 }}
                    >
                      <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                        Click to view details
                      </span>
                      {cert.credentialUrl && (
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: 12 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </motion.div>
                      )}
                    </motion.div>

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

      {/* Certification Detail Modal */}
      <Dialog open={!!selectedCertification} onOpenChange={() => setSelectedCertification(null)}>
        <DialogContent className="max-w-2xl bg-card border-border">
          <AnimatePresence>
            {selectedCertification && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                    {selectedCertification.title}
                    {selectedCertification.featured && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Sparkles className="h-5 w-5 text-accent" />
                      </motion.div>
                    )}
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Certificate Image */}
                  {selectedCertification.badgeImage && !imageLoadErrors.has(selectedCertification.id) && (
                    <motion.div 
                      className="flex justify-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="max-w-md w-full">
                        <motion.img
                          src={selectedCertification.badgeImage}
                          alt={`${selectedCertification.title} certificate`}
                          className="w-full h-auto rounded-lg border border-border cursor-zoom-in"
                          onClick={() => window.open(selectedCertification.badgeImage, '_blank')}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Details */}
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Organization</label>
                        <p className="text-foreground">{selectedCertification.organization}</p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Issue Date</label>
                        <p className="text-foreground">{formatDate(selectedCertification.issueDate)}</p>
                      </div>

                      {selectedCertification.expiryDate && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Expiry Date</label>
                          <p className={`${isExpired(selectedCertification.expiryDate) ? 'text-red-400' : isExpiringSoon(selectedCertification.expiryDate) ? 'text-yellow-400' : 'text-foreground'}`}>
                            {formatDate(selectedCertification.expiryDate)}
                            {isExpired(selectedCertification.expiryDate) && ' (Expired)'}
                            {isExpiringSoon(selectedCertification.expiryDate) && !isExpired(selectedCertification.expiryDate) && ' (Expiring Soon)'}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      {selectedCertification.credentialId && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Credential ID</label>
                          <p className="text-foreground font-mono text-sm break-all">
                            {selectedCertification.credentialId}
                          </p>
                        </div>
                      )}

                      {selectedCertification.isVerified && (
                        <motion.div 
                          className="flex items-center gap-2"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <Shield className="w-5 h-5 text-green-400" />
                          <span className="text-green-400 font-medium">Verified Credential</span>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>

                  {/* Description */}
                  {selectedCertification.description && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label className="text-sm font-medium text-muted-foreground">Description</label>
                      <p className="text-foreground mt-1 leading-relaxed">
                        {selectedCertification.description}
                      </p>
                    </motion.div>
                  )}

                  {/* Actions */}
                  {selectedCertification.credentialUrl && (
                    <motion.div 
                      className="flex justify-end"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button 
                          asChild 
                          className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          <a 
                            href={selectedCertification.credentialUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View Credential
                          </a>
                        </Button>
                      </motion.div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </div>
  )
}