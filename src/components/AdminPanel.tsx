"use client"

import React, { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Upload, 
  Download, 
  Save, 
  X, 
  Settings, 
  Users, 
  BarChart3, 
  FileText, 
  Image, 
  GripVertical,
  Calendar,
  Tag,
  Link2,
  Globe,
  LogOut,
  Shield,
  Activity,
  ChevronRight,
  ExternalLink,
  AlertTriangle,
  Check
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"

interface AdminPanelProps {
  className?: string
}

interface User {
  id: string
  email: string
  role: "admin" | "editor"
  lastLogin?: string
}

interface AnalyticsData {
  visitors: number
  clicks: number
  topProjects: Array<{ name: string; views: number }>
}

interface ContentItem {
  id: string
  title: string
  type: string
  visible: boolean
  status?: "completed" | "ongoing" | "archived"
  order: number
  updatedAt: string
  description?: string
  content?: string
  metadata?: Record<string, any>
}

interface AuditLog {
  id: string
  action: string
  entityType: string
  entityId: string
  timestamp: string
  user: string
}

const contentTypes = [
  "Profile",
  "Education", 
  "Projects",
  "Experience",
  "Skills",
  "Certifications",
  "Responsibilities",
  "Awards",
  "Publications",
  "Blog",
  "Testimonials",
  "Creative"
]

const statusColors = {
  completed: "bg-green-500/20 text-green-300 border-green-500/30",
  ongoing: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  archived: "bg-gray-500/20 text-gray-300 border-gray-500/30"
}

export default function AdminPanel({ className }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  
  // Auth state
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [authLoading, setAuthLoading] = useState(false)
  
  // Data state
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [contentItems, setContentItems] = useState<Record<string, ContentItem[]>>({})
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [users, setUsers] = useState<User[]>([])
  
  // UI state
  const [activeTab, setActiveTab] = useState("dashboard")
  const [activeContentTab, setActiveContentTab] = useState("Profile")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null)
  const [showItemDialog, setShowItemDialog] = useState(false)
  const [showUserDialog, setShowUserDialog] = useState(false)
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  // Check authentication on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("admin_token")
      if (!token) {
        setLoading(false)
        return
      }

      const response = await fetch("/api/admin/auth/verify", {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        setIsAuthenticated(true)
        loadDashboardData()
      } else {
        localStorage.removeItem("admin_token")
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      localStorage.removeItem("admin_token")
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthLoading(true)

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm)
      })

      if (response.ok) {
        const { token, user } = await response.json()
        localStorage.setItem("admin_token", token)
        setUser(user)
        setIsAuthenticated(true)
        toast.success("Login successful")
        loadDashboardData()
      } else {
        const error = await response.json()
        toast.error(error.message || "Login failed")
      }
    } catch (error) {
      toast.error("Network error during login")
    } finally {
      setAuthLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("admin_token")
    setIsAuthenticated(false)
    setUser(null)
    toast.success("Logged out successfully")
  }

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem("admin_token")
      const headers = { Authorization: `Bearer ${token}` }

      // Load analytics
      try {
        const analyticsRes = await fetch("/api/admin/analytics", { headers })
        if (analyticsRes.ok) {
          setAnalytics(await analyticsRes.json())
        }
      } catch (e) {
        console.warn("Analytics not available")
      }

      // Load content for all types
      const contentPromises = contentTypes.map(async (type) => {
        try {
          const res = await fetch(`/api/admin/content/${type.toLowerCase()}`, { headers })
          if (res.ok) {
            return { type, items: await res.json() }
          }
        } catch (e) {
          console.warn(`Failed to load ${type}`)
        }
        return { type, items: [] }
      })

      const contentResults = await Promise.all(contentPromises)
      const newContentItems: Record<string, ContentItem[]> = {}
      contentResults.forEach(({ type, items }) => {
        newContentItems[type] = items
      })
      setContentItems(newContentItems)

      // Load audit logs
      try {
        const auditRes = await fetch("/api/admin/audit", { headers })
        if (auditRes.ok) {
          setAuditLogs(await auditRes.json())
        }
      } catch (e) {
        console.warn("Audit logs not available")
      }

      // Load users
      try {
        const usersRes = await fetch("/api/admin/users", { headers })
        if (usersRes.ok) {
          setUsers(await usersRes.json())
        }
      } catch (e) {
        console.warn("Users not available")
      }

    } catch (error) {
      console.error("Failed to load dashboard data:", error)
    }
  }

  const handleVisibilityToggle = async (itemId: string, visible: boolean) => {
    try {
      const token = localStorage.getItem("admin_token")
      const response = await fetch(`/api/admin/content/${itemId}/visibility`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ visible })
      })

      if (response.ok) {
        // Optimistic update
        setContentItems(prev => {
          const newItems = { ...prev }
          Object.keys(newItems).forEach(type => {
            newItems[type] = newItems[type].map(item =>
              item.id === itemId ? { ...item, visible } : item
            )
          })
          return newItems
        })
        toast.success(`Item ${visible ? "shown" : "hidden"}`)
      } else {
        toast.error("Failed to update visibility")
      }
    } catch (error) {
      toast.error("Network error")
    }
  }

  const handleReorder = async (fromIndex: number, toIndex: number) => {
    const items = contentItems[activeContentTab] || []
    const reorderedItems = [...items]
    const [movedItem] = reorderedItems.splice(fromIndex, 1)
    reorderedItems.splice(toIndex, 0, movedItem)

    // Update order numbers
    const updatedItems = reorderedItems.map((item, index) => ({
      ...item,
      order: index
    }))

    // Optimistic update
    setContentItems(prev => ({
      ...prev,
      [activeContentTab]: updatedItems
    }))

    try {
      const token = localStorage.getItem("admin_token")
      await fetch(`/api/admin/content/${activeContentTab.toLowerCase()}/reorder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ 
          items: updatedItems.map(({ id, order }) => ({ id, order }))
        })
      })
      toast.success("Order updated")
    } catch (error) {
      // Rollback on error
      loadDashboardData()
      toast.error("Failed to update order")
    }
  }

  const handleSaveItem = async (item: ContentItem) => {
    try {
      const token = localStorage.getItem("admin_token")
      const isNew = !item.id
      const url = isNew 
        ? `/api/admin/content/${activeContentTab.toLowerCase()}`
        : `/api/admin/content/${item.id}`
      
      const response = await fetch(url, {
        method: isNew ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(item)
      })

      if (response.ok) {
        const savedItem = await response.json()
        setContentItems(prev => ({
          ...prev,
          [activeContentTab]: isNew 
            ? [...(prev[activeContentTab] || []), savedItem]
            : (prev[activeContentTab] || []).map(i => i.id === savedItem.id ? savedItem : i)
        }))
        setShowItemDialog(false)
        setEditingItem(null)
        toast.success(`Item ${isNew ? "created" : "updated"}`)
      } else {
        toast.error("Failed to save item")
      }
    } catch (error) {
      toast.error("Network error")
    }
  }

  const handleDeleteItem = async (itemId: string) => {
    try {
      const token = localStorage.getItem("admin_token")
      const response = await fetch(`/api/admin/content/${itemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        setContentItems(prev => ({
          ...prev,
          [activeContentTab]: (prev[activeContentTab] || []).filter(item => item.id !== itemId)
        }))
        toast.success("Item deleted")
      } else {
        toast.error("Failed to delete item")
      }
    } catch (error) {
      toast.error("Network error")
    }
  }

  const handleBulkAction = async (action: "show" | "hide" | "delete") => {
    if (selectedItems.length === 0) return

    try {
      const token = localStorage.getItem("admin_token")
      const response = await fetch("/api/admin/content/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ action, itemIds: selectedItems })
      })

      if (response.ok) {
        if (action === "delete") {
          setContentItems(prev => ({
            ...prev,
            [activeContentTab]: (prev[activeContentTab] || []).filter(item => !selectedItems.includes(item.id))
          }))
        } else {
          const visible = action === "show"
          setContentItems(prev => ({
            ...prev,
            [activeContentTab]: (prev[activeContentTab] || []).map(item =>
              selectedItems.includes(item.id) ? { ...item, visible } : item
            )
          }))
        }
        setSelectedItems([])
        toast.success(`Bulk ${action} completed`)
      } else {
        toast.error(`Failed to ${action} items`)
      }
    } catch (error) {
      toast.error("Network error")
    }
  }

  const filteredItems = (contentItems[activeContentTab] || [])
    .filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.order - b.order)

  if (loading) {
    return (
      <div className={`min-h-screen bg-background flex items-center justify-center ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen bg-background flex items-center justify-center p-4 ${className}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Admin Login</CardTitle>
              <CardDescription>
                Enter your credentials to access the admin panel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                    required
                    className="mt-1"
                  />
                </div>
                <Button type="submit" disabled={authLoading} className="w-full">
                  {authLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
              
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Button variant="outline" className="w-full">
                    Google
                  </Button>
                  <Button variant="outline" className="w-full">
                    GitHub
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-background ${className}`}>
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-heading font-bold">Admin Panel</h1>
            <Badge variant="secondary">{user?.role}</Badge>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user?.email}
            </span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-card/30 backdrop-blur-sm min-h-[calc(100vh-4rem)] sticky top-16">
          <nav className="p-4 space-y-2">
            <Button
              variant={activeTab === "dashboard" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("dashboard")}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant={activeTab === "content" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("content")}
            >
              <FileText className="h-4 w-4 mr-2" />
              Content Manager
            </Button>
            <Button
              variant={activeTab === "media" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("media")}
            >
              <Image className="h-4 w-4 mr-2" />
              Media Library
            </Button>
            <Button
              variant={activeTab === "users" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("users")}
            >
              <Users className="h-4 w-4 mr-2" />
              Users
            </Button>
            <Button
              variant={activeTab === "audit" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("audit")}
            >
              <Activity className="h-4 w-4 mr-2" />
              Activity Log
            </Button>
            <Button
              variant={activeTab === "settings" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6">
          <AnimatePresence mode="wait">
            {activeTab === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-heading font-bold">Dashboard</h2>
                  <Button onClick={loadDashboardData} variant="outline" size="sm">
                    <Activity className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>

                {analytics && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{analytics.visitors.toLocaleString()}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{analytics.clicks.toLocaleString()}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Top Project</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-lg font-semibold">
                          {analytics.topProjects[0]?.name || "N/A"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {analytics.topProjects[0]?.views || 0} views
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {contentTypes.map(type => (
                        <div key={type} className="text-center p-4 rounded-lg bg-muted/30">
                          <div className="text-2xl font-bold">
                            {(contentItems[type] || []).length}
                          </div>
                          <div className="text-sm text-muted-foreground">{type}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "content" && (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-heading font-bold">Content Manager</h2>
                  <div className="flex items-center gap-2">
                    {selectedItems.length > 0 && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleBulkAction("show")}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Show ({selectedItems.length})
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleBulkAction("hide")}
                        >
                          <EyeOff className="h-4 w-4 mr-2" />
                          Hide ({selectedItems.length})
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleBulkAction("delete")}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete ({selectedItems.length})
                        </Button>
                      </>
                    )}
                    <Button
                      onClick={() => {
                        setEditingItem({
                          id: "",
                          title: "",
                          type: activeContentTab,
                          visible: true,
                          order: (contentItems[activeContentTab] || []).length,
                          updatedAt: new Date().toISOString()
                        })
                        setShowItemDialog(true)
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add {activeContentTab}
                    </Button>
                  </div>
                </div>

                <Tabs value={activeContentTab} onValueChange={setActiveContentTab}>
                  <TabsList className="grid grid-cols-6 lg:grid-cols-12 w-full">
                    {contentTypes.map(type => (
                      <TabsTrigger key={type} value={type} className="text-xs">
                        {type}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {contentTypes.map(type => (
                    <TabsContent key={type} value={type} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder={`Search ${type}...`}
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="pl-10 w-64"
                            />
                          </div>
                          <Badge variant="secondary">
                            {filteredItems.length} items
                          </Badge>
                        </div>
                      </div>

                      <Card>
                        <CardContent className="p-0">
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="border-b">
                                  <th className="text-left p-4 w-12">
                                    <Checkbox
                                      checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          setSelectedItems(filteredItems.map(item => item.id))
                                        } else {
                                          setSelectedItems([])
                                        }
                                      }}
                                    />
                                  </th>
                                  <th className="text-left p-4 w-8"></th>
                                  <th className="text-left p-4">Title</th>
                                  <th className="text-left p-4">Status</th>
                                  <th className="text-left p-4">Visible</th>
                                  <th className="text-left p-4">Updated</th>
                                  <th className="text-left p-4 w-24">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {filteredItems.map((item, index) => (
                                  <motion.tr
                                    key={item.id}
                                    layout
                                    className="border-b hover:bg-muted/20 transition-colors"
                                    draggable
                                    onDragStart={() => setDraggedItem(item.id)}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => {
                                      e.preventDefault()
                                      if (draggedItem) {
                                        const draggedIndex = filteredItems.findIndex(i => i.id === draggedItem)
                                        if (draggedIndex !== -1 && draggedIndex !== index) {
                                          handleReorder(draggedIndex, index)
                                        }
                                        setDraggedItem(null)
                                      }
                                    }}
                                  >
                                    <td className="p-4">
                                      <Checkbox
                                        checked={selectedItems.includes(item.id)}
                                        onCheckedChange={(checked) => {
                                          if (checked) {
                                            setSelectedItems(prev => [...prev, item.id])
                                          } else {
                                            setSelectedItems(prev => prev.filter(id => id !== item.id))
                                          }
                                        }}
                                      />
                                    </td>
                                    <td className="p-4">
                                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                                    </td>
                                    <td className="p-4">
                                      <div>
                                        <div className="font-medium">{item.title}</div>
                                        {item.description && (
                                          <div className="text-sm text-muted-foreground truncate max-w-xs">
                                            {item.description}
                                          </div>
                                        )}
                                      </div>
                                    </td>
                                    <td className="p-4">
                                      {item.status && (
                                        <Badge 
                                          variant="outline" 
                                          className={statusColors[item.status]}
                                        >
                                          {item.status}
                                        </Badge>
                                      )}
                                    </td>
                                    <td className="p-4">
                                      <Switch
                                        checked={item.visible}
                                        onCheckedChange={(checked) => handleVisibilityToggle(item.id, checked)}
                                      />
                                    </td>
                                    <td className="p-4 text-sm text-muted-foreground">
                                      {new Date(item.updatedAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4">
                                      <div className="flex items-center gap-1">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => {
                                            setEditingItem(item)
                                            setShowItemDialog(true)
                                          }}
                                        >
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handleDeleteItem(item.id)}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </td>
                                  </motion.tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  ))}
                </Tabs>
              </motion.div>
            )}

            {activeTab === "audit" && (
              <motion.div
                key="audit"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-heading font-bold">Activity Log</h2>
                <Card>
                  <CardContent className="p-0">
                    <div className="space-y-4 p-6">
                      {auditLogs.map(log => (
                        <div key={log.id} className="flex items-center justify-between border-b pb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                            <div>
                              <div className="font-medium">{log.action}</div>
                              <div className="text-sm text-muted-foreground">
                                {log.entityType} - {log.user}
                              </div>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(log.timestamp).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Item Edit Dialog */}
      <Dialog open={showItemDialog} onOpenChange={setShowItemDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem?.id ? "Edit" : "Create"} {activeContentTab}
            </DialogTitle>
          </DialogHeader>
          {editingItem && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem(prev => prev ? { ...prev, title: e.target.value } : null)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editingItem.description || ""}
                  onChange={(e) => setEditingItem(prev => prev ? { ...prev, description: e.target.value } : null)}
                  className="mt-1"
                  rows={3}
                />
              </div>
              {activeContentTab === "Projects" && (
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={editingItem.status}
                    onValueChange={(value) => setEditingItem(prev => prev ? { ...prev, status: value as any } : null)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Switch
                  id="visible"
                  checked={editingItem.visible}
                  onCheckedChange={(checked) => setEditingItem(prev => prev ? { ...prev, visible: checked } : null)}
                />
                <Label htmlFor="visible">Visible</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowItemDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => editingItem && handleSaveItem(editingItem)}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}