
'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, BarChart3, Target, Clock, TrendingUp, Brain, Infinity, Zap } from 'lucide-react';
import Link from 'next/link';

const HeroSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
    },
  };

  return (
    <section className="hero-section relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="hero-blob-1 absolute top-1/4 -left-20 w-72 h-72 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
          }}
        />
        <motion.div 
          className="hero-blob-2 absolute bottom-1/4 -right-20 w-96 h-96 rounded-full blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Grid Pattern */}
      <div className="hero-grid absolute inset-0" />

      {/* Decorative Circuits/Lines */}
      <svg className="hero-circuit absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="circuit" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 50 50 L 100 50" stroke="hsl(174 72% 50%)" strokeWidth="1" fill="none"/>
            <circle cx="50" cy="50" r="3" fill="hsl(174 72% 50%)"/>
            <path d="M 150 50 L 150 100 L 100 100" stroke="hsl(199 89% 48%)" strokeWidth="1" fill="none"/>
            <circle cx="150" cy="100" r="3" fill="hsl(199 89% 48%)"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#circuit)"/>
      </svg>

      {/* Floating Animated Icons */}
      <motion.div
        className="absolute left-[10%] top-[20%] p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border shadow-lg"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'easeInOut',
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        <TrendingUp className="h-8 w-8 text-primary" />
      </motion.div>

      <motion.div
        className="absolute right-[15%] top-[25%] p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border shadow-lg"
        animate={{
          y: [0, 15, 0],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 7,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'easeInOut',
          delay: 1,
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        <Brain className="h-8 w-8 text-info" />
      </motion.div>

      <motion.div
        className="absolute left-[15%] bottom-[20%] p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border shadow-lg"
        animate={{
          y: [0, -15, 0],
          rotate: [0, 3, 0],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'easeInOut',
          delay: 2,
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        <Sparkles className="h-8 w-8 text-success" />
      </motion.div>

      <motion.div
        className="absolute right-[10%] bottom-[25%] p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border shadow-lg"
        animate={{
          y: [0, 20, 0],
          rotate: [0, -3, 0],
        }}
        transition={{
          duration: 9,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'easeInOut',
          delay: 0.5,
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        <Zap className="h-8 w-8 text-warning" />
      </motion.div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div 
            className="text-center lg:text-left space-y-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div 
              variants={itemVariants}
              className="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-2"
            >
              <Sparkles className="hero-icon h-4 w-4" />
              <span className="hero-badge-text text-sm font-medium">
                Powered By Google's Gemini API
              </span>
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight"
            >
              <span className="hero-title">Master Your Skills with </span>
              <span className="hero-gradient inline-block">
                Intelligent Tracking
              </span>
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="hero-description text-lg sm:text-xl max-w-xl mx-auto lg:mx-0"
            >
              SkillSync helps you track, measure, and accelerate your skill development 
              with AI-powered insights and personalized learning recommendations.
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2"
            >
              <Link href="/dashboard">
                <button className="hero-btn-primary group px-8 py-3.5 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
                Start Learning 
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
              </Link>
              

              <Link href="/dashboard">
              <button className="hero-btn-secondary px-8 py-3.5 rounded-lg font-semibold transition-all duration-300">
                Watch Demo
              </button>
              </Link>

            </motion.div>

            {/* Stats - Updated with image design */}
            <motion.div 
              variants={itemVariants}
              className="hero-stats grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t"
            >
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                  <Brain className="h-5 w-5 text-primary" />
                  <div className="hero-stat-value text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
                    AI
                  </div>
                </div>
                <div className="hero-stat-label text-sm">Powered Insights</div>
              </div>

              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                  <TrendingUp className="h-5 w-5 text-info" />
                  <div className="hero-stat-value text-3xl sm:text-4xl font-bold bg-gradient-to-r from-info to-success bg-clip-text text-transparent">
                    24/7
                  </div>
                </div>
                <div className="hero-stat-label text-sm">Progress Tracking</div>
              </div>

              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                  <Infinity className="h-5 w-5 text-success" />
                  <div className="hero-stat-value text-3xl sm:text-4xl font-bold bg-gradient-to-r from-success to-warning bg-clip-text text-transparent">
                    Infinite
                  </div>
                </div>
                <div className="hero-stat-label text-sm">Skills to Master</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Visual */}
          <motion.div 
            className="relative hidden lg:block"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Main Dashboard Card */}
            <div className="relative">
              <motion.div 
                className="hero-card rounded-2xl p-6 backdrop-blur-xl border"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="hero-card-title font-semibold">Your Progress</h3>
                  <span className="hero-card-subtitle text-xs">This Week</span>
                </div>
                
                {/* Progress Bars */}
                <div className="space-y-4">
                  {[
                    { skill: "React Development", progress: 78, class: "progress-bar-primary" },
                    { skill: "TypeScript", progress: 65, class: "progress-bar-info" },
                    { skill: "UI/UX Design", progress: 45, class: "progress-bar-success" },
                  ].map((item, index) => (
                    <div key={item.skill}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="hero-card-title">{item.skill}</span>
                        <span className="hero-card-subtitle">{item.progress}%</span>
                      </div>
                      <div className="progress-track h-2 rounded-full overflow-hidden">
                        <motion.div
                          className={`${item.class} h-full rounded-full`}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${item.progress}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.8 + index * 0.2, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Floating Cards */}
              <motion.div 
                className="hero-float-card absolute -top-8 -right-8 backdrop-blur-xl rounded-xl p-4 border"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut', delay: 1 }}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3">
                  <div className="float-card-icon-success p-2 rounded-lg">
                    <Target className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <div className="hero-card-title text-sm font-medium">Goals Met</div>
                    <div className="float-card-value-success text-lg font-bold">12/15</div>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="hero-float-card absolute -bottom-4 -left-8 backdrop-blur-xl rounded-xl p-4 border"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut', delay: 0.5 }}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3">
                  <div className="float-card-icon-warning p-2 rounded-lg">
                    <Clock className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <div className="hero-card-title text-sm font-medium">Time Invested</div>
                    <div className="hero-card-title text-lg font-bold">24h 30m</div>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="hero-float-card absolute top-1/2 -right-12 backdrop-blur-xl rounded-xl p-4 border"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 7, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut', delay: 2 }}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3">
                  <div className="float-card-icon-primary p-2 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="hero-card-title text-sm font-medium">Weekly Growth</div>
                    <div className="float-card-value-primary text-lg font-bold">+15%</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="hero-bottom-fade absolute bottom-0 left-0 right-0 h-32" />
    </section>
  );
};

export default HeroSection;

















