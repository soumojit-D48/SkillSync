
'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, Menu, X, Sun, Moon, Monitor, LogOut, User } from "lucide-react";
import { useTheme } from "@/components/ThemeContext";
import { cn } from "@/lib/utils";
import { useGetCurrentUserQuery, useLogoutMutation } from "@/store/api/authApi";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Check if user is authenticated
  const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('accessToken');
  const { data: user, isLoading } = useGetCurrentUserQuery(undefined, {
    skip: !hasToken,
  });
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      await logout({ refresh_token: refreshToken || undefined }).unwrap();
      setIsUserMenuOpen(false);
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navLinks = [
    { name: "Challenges", href: "#challenges" },
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Upcoming Features", href: "#upcoming" },
  ];

  const themes = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ] as const;

  const CurrentIcon = theme === 'system' ? Monitor : resolvedTheme === 'dark' ? Moon : Sun;

  if (!mounted) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-muted animate-pulse" />
              <div className="w-24 h-6 rounded bg-muted animate-pulse" />
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "glass shadow-soft" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary rounded-lg blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative bg-gradient-primary p-2 rounded-lg">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
            </div>
            <span className="text-xl font-bold text-foreground">SkillSync</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle */}
            <div className="relative">
              <button
                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                className="p-2 rounded-full hover:bg-muted transition-colors"
                aria-label="Toggle theme"
              >
                <CurrentIcon className="h-5 w-5 text-foreground" />
              </button>
              
              {isThemeMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsThemeMenuOpen(false)} 
                  />
                  <div className="absolute right-0 top-full mt-2 z-50 w-36 rounded-xl bg-card border border-border shadow-lg overflow-hidden">
                    {themes.map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        onClick={() => {
                          setTheme(value);
                          setIsThemeMenuOpen(false);
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
                  </div>
                </>
              )}
            </div>

            {isLoading ? (
              <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
            ) : user ? (
              // User Menu
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
                  aria-label="User menu"
                >
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                </button>
                
                {isUserMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsUserMenuOpen(false)} 
                    />
                    <div className="absolute right-0 top-full mt-2 z-50 w-56 rounded-xl bg-card border border-border shadow-lg overflow-hidden">
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-sm font-semibold text-foreground">{user.username}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <Link href="/dashboard">
                        <button
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                        >
                          <User className="h-4 w-4" />
                          Dashboard
                        </button>
                      </Link>
                      <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors disabled:opacity-50"
                      >
                        <LogOut className="h-4 w-4" />
                        {isLoggingOut ? 'Logging out...' : 'Logout'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              // Auth Buttons
              <>
                <Link href="/auth">
                  <button className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors">
                    Log In
                  </button>
                </Link>
                <Link href="/auth">
                  <button className="px-6 py-2 text-sm font-semibold bg-gradient-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity shadow-primary">
                    Get Started
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                className="p-2 rounded-full hover:bg-muted transition-colors"
                aria-label="Toggle theme"
              >
                <CurrentIcon className="h-5 w-5 text-foreground" />
              </button>
              
              {isThemeMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsThemeMenuOpen(false)} 
                  />
                  <div className="absolute right-0 top-full mt-2 z-50 w-36 rounded-xl bg-card border border-border shadow-lg overflow-hidden">
                    {themes.map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        onClick={() => {
                          setTheme(value);
                          setIsThemeMenuOpen(false);
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
                  </div>
                </>
              )}
            </div>

            {user && (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
                  aria-label="User menu"
                >
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                </button>
                
                {isUserMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsUserMenuOpen(false)} 
                    />
                    <div className="absolute right-0 top-full mt-2 z-50 w-56 rounded-xl bg-card border border-border shadow-lg overflow-hidden">
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-sm font-semibold text-foreground">{user.username}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <Link href="/dashboard">
                        <button
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                        >
                          <User className="h-4 w-4" />
                          Dashboard
                        </button>
                      </Link>
                      <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors disabled:opacity-50"
                      >
                        <LogOut className="h-4 w-4" />
                        {isLoggingOut ? 'Logging out...' : 'Logout'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-foreground hover:bg-muted rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-6 border-t border-border mt-2">
            <div className="flex flex-col gap-4 pt-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground transition-colors font-medium px-4 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="flex flex-col gap-2 px-4 pt-4 border-t border-border">
                {user ? (
                  <>
                    <Link href="/dashboard">
                      <button className="w-full px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors flex items-center justify-center gap-2">
                        <User className="h-4 w-4" />
                        Dashboard
                      </button>
                    </Link>
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="w-full px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      {isLoggingOut ? 'Logging out...' : 'Logout'}
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/auth">
                      <button className="w-full px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors">
                        Log In
                      </button>
                    </Link>
                    <Link href="/auth">
                      <button className="w-full px-6 py-2 text-sm font-semibold bg-gradient-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
                        Get Started
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;