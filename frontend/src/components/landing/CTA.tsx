import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Rocket, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CTA() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">

  {/* Base Gradient */}
  <div className="absolute inset-0 bg-linear-to-br 
    from-[#2cd5b9] 
    via-[#1a9d96] 
    to-[#0c5b5b]" />

  {/* Soft vignette */}
  <div className="absolute inset-0 bg-radial 
    from-white/20 
    via-transparent 
    to-black/20" />

  {/* Pattern */}
  <div className="absolute inset-0 opacity-[0.04]">
    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.15)_50%,transparent_75%)] bg-size-[60px_60px]" />
  </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white/10 blur-xl"
        animate={{
          y: [0, -30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-32 h-32 rounded-full bg-white/10 blur-xl"
        animate={{
          y: [0, 30, 0],
          scale: [1.2, 1, 1.2],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-8"
          >
            {/* <Sparkles className="w-8 h-8 text-primary-foreground" /> */}
            <Sparkles className="w-8 h-8 text-white dark:text-black" />
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-white dark:text-black mb-6"
          >
            Join the SkillSync Journey
          </motion.h2>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-lg md:text-xl text-white/90 dark:text-black/90 max-w-2xl mx-auto mb-10"
          >
            Transform your learning experience today. Be among the first to unlock the power of AI-driven skill development.
          </motion.p>

          {/* Features Row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-6 md:gap-10 mb-12"
          >
            {[
              { icon: Rocket, text: 'Track Skills' },
              { icon: Sparkles, text: 'AI Insights' },
              { icon: Target, text: 'Achieve Goals' },
            ].map((item, index) => (
              <motion.div
                key={item.text}
                className="flex items-center gap-2 text-white/90 dark:text-black/90"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <item.icon className="w-5 h-5 text-white dark:text-black" />
                <span className="font-medium">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <Button
              size="xl"
              className="bg-card text-primary hover:bg-card/90 font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
            >
              Get Early Access
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.span>
            </Button>
          </motion.div>

          {/* Trust Badge */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-sm text-white/70 dark:text-black/70"
          >
            🔒 Free to join • No credit card required • Cancel anytime
          </motion.p>
        </div>
      </div>
    </section>
  );
}