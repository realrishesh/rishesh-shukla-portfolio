"use client"

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Eye, EyeOff, Github, Mail, Loader2, User, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  inviteToken: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

type LoginData = z.infer<typeof loginSchema>
type SignupData = z.infer<typeof signupSchema>
type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>

type AuthMode = 'login' | 'signup' | 'forgot-password'

interface User {
  id: string
  email: string
  name: string
  avatar?: string
}

interface AuthModalProps {
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultMode?: AuthMode
  inviteToken?: string
}

export default function AuthModal({
  trigger,
  open: controlledOpen,
  onOpenChange,
  defaultMode = 'login',
  inviteToken
}: AuthModalProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [mode, setMode] = useState<AuthMode>(defaultMode)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [authError, setAuthError] = useState('')

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setIsOpen = onOpenChange || setInternalOpen

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const signupForm = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      inviteToken: inviteToken || '',
    },
  })

  const forgotPasswordForm = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  useEffect(() => {
    if (inviteToken) {
      setMode('signup')
      signupForm.setValue('inviteToken', inviteToken)
    }
  }, [inviteToken, signupForm])

  const resetForms = () => {
    loginForm.reset()
    signupForm.reset()
    forgotPasswordForm.reset()
    setAuthError('')
    setUser(null)
    setShowPassword(false)
    setShowConfirmPassword(false)
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      resetForms()
      setMode(defaultMode)
    }
  }

  const handleAuth = async (endpoint: string, data: any) => {
    setIsLoading(true)
    setAuthError('')

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Authentication failed')
      }

      return result
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred'
      setAuthError(message)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const onLogin = async (data: LoginData) => {
    try {
      const result = await handleAuth('/api/auth/login', data)
      setUser(result.user)
      toast.success('Successfully signed in!')
    } catch (error) {
      // Error already handled in handleAuth
    }
  }

  const onSignup = async (data: SignupData) => {
    try {
      const result = await handleAuth('/api/auth/signup', data)
      setUser(result.user)
      toast.success('Account created successfully!')
    } catch (error) {
      // Error already handled in handleAuth
    }
  }

  const onForgotPassword = async (data: ForgotPasswordData) => {
    try {
      await handleAuth('/api/auth/forgot-password', data)
      toast.success('Password reset link sent to your email')
      setMode('login')
    } catch (error) {
      // Error already handled in handleAuth
    }
  }

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    setIsLoading(true)
    setAuthError('')

    try {
      const response = await fetch('/api/auth/oauth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'OAuth authentication failed')
      }

      if (result.redirectUrl) {
        if (typeof window !== 'undefined') {
          window.location.href = result.redirectUrl
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'OAuth authentication failed'
      setAuthError(message)
      setIsLoading(false)
    }
  }

  const handleBackToLogin = () => {
    setMode('login')
    setAuthError('')
  }

  const handleSwitchMode = (newMode: AuthMode) => {
    setMode(newMode)
    setAuthError('')
  }

  const renderUserProfile = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
        <Avatar className="h-12 w-12">
          <AvatarImage src={user?.avatar} alt={user?.name} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || <User className="h-6 w-6" />}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground truncate">{user?.name}</p>
          <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button 
          onClick={() => handleOpenChange(false)} 
          className="flex-1"
        >
          Continue
        </Button>
        <Button 
          variant="outline" 
          onClick={() => {
            setUser(null)
            resetForms()
          }}
        >
          Switch Account
        </Button>
      </div>
    </div>
  )

  const renderLoginForm = () => (
    <Form {...loginForm}>
      <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
        <FormField
          control={loginForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={loginForm.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={isLoading}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {authError && (
          <div className="text-sm text-destructive" role="alert" aria-live="polite">
            {authError}
          </div>
        )}

        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="link"
            className="px-0 text-sm"
            onClick={() => handleSwitchMode('forgot-password')}
          >
            Forgot password?
          </Button>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sign In
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOAuthLogin('google')}
            disabled={isLoading}
          >
            <Mail className="mr-2 h-4 w-4" />
            Google
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOAuthLogin('github')}
            disabled={isLoading}
          >
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </Button>
        </div>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <Button
            type="button"
            variant="link"
            className="px-0"
            onClick={() => handleSwitchMode('signup')}
          >
            Sign up
          </Button>
        </div>
      </form>
    </Form>
  )

  const renderSignupForm = () => (
    <Form {...signupForm}>
      <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4">
        <FormField
          control={signupForm.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={signupForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={signupForm.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    disabled={isLoading}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={signupForm.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    disabled={isLoading}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {inviteToken && (
          <FormField
            control={signupForm.control}
            name="inviteToken"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invite Token</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Invite token"
                    disabled={true}
                    className="bg-muted"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {authError && (
          <div className="text-sm text-destructive" role="alert" aria-live="polite">
            {authError}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Account
        </Button>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <Button
            type="button"
            variant="link"
            className="px-0"
            onClick={() => handleSwitchMode('login')}
          >
            Sign in
          </Button>
        </div>
      </form>
    </Form>
  )

  const renderForgotPasswordForm = () => (
    <Form {...forgotPasswordForm}>
      <form onSubmit={forgotPasswordForm.handleSubmit(onForgotPassword)} className="space-y-4">
        <div className="space-y-2 text-center">
          <p className="text-sm text-muted-foreground">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <FormField
          control={forgotPasswordForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {authError && (
          <div className="text-sm text-destructive" role="alert" aria-live="polite">
            {authError}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Send Reset Link
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={handleBackToLogin}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Sign In
        </Button>
      </form>
    </Form>
  )

  const getTitle = () => {
    if (user) return 'Welcome back!'
    switch (mode) {
      case 'login':
        return 'Sign In'
      case 'signup':
        return inviteToken ? 'Accept Invitation' : 'Create Account'
      case 'forgot-password':
        return 'Reset Password'
    }
  }

  const getDescription = () => {
    if (user) return 'You have successfully authenticated.'
    switch (mode) {
      case 'login':
        return 'Enter your credentials to access your account'
      case 'signup':
        return inviteToken ? 'Create your account using the invitation' : 'Create a new account to get started'
      case 'forgot-password':
        return 'We'll help you reset your password'
    }
  }

  const content = (
    <DialogContent className="sm:max-w-md bg-card border-border">
      <DialogHeader>
        <DialogTitle className="text-xl font-heading">{getTitle()}</DialogTitle>
        <DialogDescription>{getDescription()}</DialogDescription>
      </DialogHeader>
      
      <div className="mt-6">
        {user ? renderUserProfile() : (
          <>
            {mode === 'login' && renderLoginForm()}
            {mode === 'signup' && renderSignupForm()}
            {mode === 'forgot-password' && renderForgotPasswordForm()}
          </>
        )}
      </div>
    </DialogContent>
  )

  if (trigger) {
    return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
        {content}
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {content}
    </Dialog>
  )
}