

import { motion } from 'framer-motion';
import { Zap, Target, TrendingUp, BookOpen, Sparkles } from 'lucide-react';

export default function AuthHero() {
  return (
    <div className="hidden lg:flex flex-1 items-center justify-center bg-[hsl(var(--background))] p-12 relative overflow-hidden">
      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-info/20" />
      
      {/* Animated Background Blobs */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div 
          className="absolute bottom-1/4 -right-20 w-96 h-96 bg-info/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="max-w-2xl text-center relative z-10">
        {/* Animated Circle Illustration with Zap Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12 flex justify-center"
        >
          <div className="relative">
            {/* Main Large Circle with Zap */}
            <motion.div 
              className="h-64 w-64 rounded-full gradient-primary flex items-center justify-center shadow-primary relative"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            >
              <Zap className="h-32 w-32 text-white" strokeWidth={2} />
            </motion.div>
            
            {/* Floating Gradient Circles with Icons */}
            <motion.div
              className="absolute -top-4 right-8 h-16 w-16 rounded-full bg-card border border-border shadow-lg flex items-center justify-center backdrop-blur-sm"
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-info/20 flex items-center justify-center">
                <Target className="h-6 w-6 text-primary" />
              </div>
            </motion.div>
            
            <motion.div
              className="absolute top-1/3 -left-12 h-20 w-20 rounded-full bg-card border border-border shadow-lg backdrop-blur-sm flex items-center justify-center"
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            >
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-info/10 flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-primary/60" />
              </div>
            </motion.div>
            
            <motion.div
              className="absolute bottom-8 -right-8 h-20 w-20 rounded-full bg-card border border-border shadow-lg backdrop-blur-sm flex items-center justify-center"
              animate={{ x: [10, -10, 10] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            >
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-info/20 to-primary/10 flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-primary/60" />
              </div>
            </motion.div>
            
            <motion.div
              className="absolute bottom-0 -left-8 h-16 w-16 rounded-full bg-card border border-border shadow-lg flex items-center justify-center backdrop-blur-sm"
              animate={{ x: [-10, 10, -10] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
            >
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-info/20 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-5xl font-bold mb-4"
        >
          <span className="text-foreground">Master Your Skills,</span>
          <br />
          <span className="text-primary">Track Your Growth</span>
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-muted-foreground text-lg mb-12 px-8"
        >
          Join thousands of learners who are achieving their goals with SkillSync. 
          Set targets, monitor progress, and celebrate every milestone.
        </motion.p>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 px-6 py-3 bg-card border border-border rounded-full shadow-md backdrop-blur-sm"
          >
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Target className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-medium text-foreground">Track unlimited skills</span>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 px-6 py-3 bg-card border border-border rounded-full shadow-md backdrop-blur-sm"
          >
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-medium text-foreground">Daily progress logging</span>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 px-6 py-3 bg-card border border-border rounded-full shadow-md backdrop-blur-sm"
          >
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-medium text-foreground">Weekly AI summaries</span>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 px-6 py-3 bg-card border border-border rounded-full shadow-md backdrop-blur-sm"
          >
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-medium text-foreground">Resource management</span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}