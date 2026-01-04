
'use client'

import { useState, useEffect } from 'react';
import { motion, useScroll } from 'framer-motion';
import { 
  Zap, 
  Target, 
  BookOpen, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2,
  Menu,
  X,
  Award,
  BarChart3,
  Sparkles,
  Clock,
  Globe,
  Play,
  Moon,
  Sun,
  Monitor,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/ThemeContext';
import { useGetCurrentUserQuery, useLogoutMutation } from '@/store/api/authApi';

// Types
interface NavLink {
  label: string;
  href: string;
}

interface Feature {
  icon: any;
  title: string;
  description: string;
  color: string;
}

interface Step {
  number: string;
  title: string;
  description: string;
  icon: any;
}

interface User {
  id: number;
  email: string;
  username: string;
  full_name?: string;
}

// Data
const navLinks: NavLink[] = [
  { label: 'Features', href: '#features' },
  { label: 'How it Works', href: '#how-it-works' },
];

const features: Feature[] = [
  { 
    icon: Target, 
    title: 'Skill Tracking', 
    description: 'Set goals and monitor your progress across unlimited skills with visual progress indicators.',
    color: 'bg-primary/10 text-primary',
  },
  { 
    icon: BookOpen, 
    title: 'Resource Library', 
    description: 'Organize courses, books, videos, and tutorials in one centralized learning hub.',
    color: 'bg-info/10 text-info',
  },
  { 
    icon: BarChart3, 
    title: 'Smart Analytics', 
    description: 'Get insights into your learning patterns with detailed charts and weekly reports.',
    color: 'bg-success/10 text-success',
  },
  { 
    icon: Award, 
    title: 'Achievements', 
    description: 'Stay motivated with gamified badges, streaks, and milestone celebrations.',
    color: 'bg-warning/10 text-warning',
  },
  { 
    icon: Clock, 
    title: 'Time Tracking', 
    description: 'Log your learning hours and see exactly where your time is being invested.',
    color: 'bg-destructive/10 text-destructive',
  },
  { 
    icon: Globe, 
    title: 'Cross-Platform', 
    description: 'Access your learning dashboard from any device, anywhere in the world.',
    color: 'bg-accent/10 text-accent-foreground',
  },
];

const steps: Step[] = [
  { number: '01', title: 'Add Your Skills', description: 'Start by adding the skills you want to learn or improve.', icon: Target },
  { number: '02', title: 'Track Resources', description: 'Log courses, books, and tutorials as you discover them.', icon: BookOpen },
  { number: '03', title: 'Log Progress', description: 'Update your progress and time spent learning daily.', icon: TrendingUp },
  { number: '04', title: 'Achieve Mastery', description: 'Watch your skills grow and celebrate milestones.', icon: Award },
];

// Theme Toggle Component
function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const themes = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ] as const;

  if (!mounted) {
    return (
      <div className="p-2 rounded-lg bg-muted/50 w-10 h-10 animate-pulse" />
    );
  }

  const CurrentIcon = theme === 'system' ? Monitor : resolvedTheme === 'dark' ? Moon : Sun;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
        aria-label="Toggle theme"
      >
        <CurrentIcon className="h-5 w-5 text-foreground" />
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            className="absolute right-0 top-full mt-2 z-50 w-36 rounded-xl bg-card border border-border shadow-lg overflow-hidden"
          >
            {themes.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => {
                  setTheme(value);
                  setIsOpen(false);
                }}
                className={cn(
                  'flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors',
                  theme === value 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-foreground hover:bg-muted'
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
}

// User Menu Component
function UserMenu({ user }: { user: User }) {
  const [isOpen, setIsOpen] = useState(false);
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      await logout({ refresh_token: refreshToken || undefined }).unwrap();
      setIsOpen(false);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const initials = user.username.charAt(0).toUpperCase();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
        aria-label="User menu"
      >
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
          {initials}
        </div>
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            className="absolute right-0 top-full mt-2 z-50 w-56 rounded-xl bg-card border border-border shadow-lg overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-border">
              <p className="text-sm font-semibold text-foreground">{user.username}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors disabled:opacity-50"
            >
              <LogOut className="h-4 w-4" />
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </button>
          </motion.div>
        </>
      )}
    </div>
  );
}

// Navbar Component
function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Check if user is authenticated by looking for token
  const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('accessToken');
  
  // Only fetch user data if token exists
  const { data: user, isLoading } = useGetCurrentUserQuery(undefined, {
    skip: !hasToken,
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled 
          ? 'bg-background/80 backdrop-blur-xl border-b border-border shadow-lg' 
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          <a href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-lg group-hover:shadow-primary transition-all duration-300">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
              SkillSync
            </span>
          </a>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {isLoading ? (
              <div className="h-8 w-8 rounded-lg bg-muted/50 animate-pulse" />
            ) : user ? (
              <UserMenu user={user} />
            ) : (
              <>
                <a href="/auth">
                  <Button variant="ghost" className="font-medium">Sign In</Button>
                </a>
                <a href="/auth">
                  <Button variant="gradient" className="shadow-lg">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </a>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            {user && <UserMenu user={user} />}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <motion.div
        initial={false}
        animate={isMobileMenuOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        className="lg:hidden overflow-hidden bg-background border-b border-border"
      >
        <div className="container mx-auto px-6 py-6 space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
          {!user && (
            <div className="pt-4 flex flex-col gap-3">
              <a href="/auth">
                <Button variant="outline" className="w-full" size="lg">Sign In</Button>
              </a>
              <a href="/auth">
                <Button variant="gradient" className="w-full" size="lg">Get Started</Button>
              </a>
            </div>
          )}
        </div>
      </motion.div>
    </motion.nav>
  );
}

// Hero Section Component
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-20 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />
        
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-[120px]"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-info/30 rounded-full blur-[120px]"
          animate={{ 
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/80 backdrop-blur border border-border mb-8"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Now with AI-powered recommendations</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            Master Any Skill
            <br />
            <span className="bg-gradient-to-r from-primary via-info to-primary bg-clip-text text-transparent">
              with Purpose
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
          >
            The all-in-one platform to track your learning journey, organize resources, 
            and achieve your goals faster than ever before.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-10"
          >
            <a href="/dashboard">
              <Button variant="gradient" size="xl" className="w-full sm:w-auto group">
                Start Learning Free 
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
            <Button variant="outline" size="xl" className="w-full sm:w-auto gap-2">
              <Play className="h-5 w-5" />
              Watch Demo
            </Button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
          >
            {['Free forever plan', 'No credit card required', 'Cancel anytime'].map((text) => (
              <div key={text} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span>{text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Features Section Component
function FeaturesSection() {
  return (
    <section id="features" className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Features
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything You Need to
            <br />
            <span className="bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
              Accelerate Learning
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to transform how you learn and grow
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300"
            >
              <div className={cn('h-12 w-12 rounded-xl flex items-center justify-center mb-4', feature.color)}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// How It Works Section Component
function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Start Learning in
            <br />
            <span className="bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
              4 Simple Steps
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="text-center"
            >
              <div className="relative inline-block mb-6">
                <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section Component
function CTASection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your
            <br />
            <span className="bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
              Learning Journey?
            </span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of learners who are already accelerating their skill development.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/auth">
              <Button variant="gradient" size="xl" className="group">
                Get Started Free
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
            <Button variant="outline" size="xl">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

// Footer Component
function Footer() {
  return (
    <footer className="py-16 border-t border-border bg-card/50">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">
            <a href="/" className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-lg">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">SkillSync</span>
            </a>
            <p className="text-muted-foreground mb-6">
              The all-in-one platform to track your learning journey and achieve your goals.
            </p>
            <div className="flex gap-4">
              {['twitter', 'github', 'linkedin'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors"
                >
                  <span className="sr-only">{social}</span>
                  <Globe className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
          {[
            { title: 'Product', links: ['Features', 'How it Works', 'Changelog', 'Roadmap'] },
            { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
            { title: 'Legal', links: ['Privacy', 'Terms', 'Security', 'Cookies'] },
          ].map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-foreground mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2024 SkillSync. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Made with</span>
            <span className="text-destructive">❤</span>
            <span>for learners everywhere</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Main Component
export default function Index() {
  const { scrollYProgress } = useScroll();

  return (
    <div className="min-h-screen bg-background">
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-info to-primary z-[60] origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
      <Footer />
    </div>
  );
}