

'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { AlertCircle, Clock, Eye, RefreshCcw, TrendingDown } from 'lucide-react';

const problems = [
  {
    icon: Clock,
    title: 'Manual Tracking',
    description: 'Time-consuming and inconsistent skill tracking methods',
    colorClass: 'problem-icon-destructive',
    bgClass: 'problem-bg-destructive',
  },
  {
    icon: Eye,
    title: 'No Visibility',
    description: 'Lack of insights into learning patterns and trends',
    colorClass: 'problem-icon-warning',
    bgClass: 'problem-bg-warning',
  },
  {
    icon: TrendingDown,
    title: 'Low Motivation',
    description: 'Difficulty maintaining progress without milestones',
    colorClass: 'problem-icon-info',
    bgClass: 'problem-bg-info',
  },
  {
    icon: RefreshCcw,
    title: 'Skill Gaps',
    description: 'Hard to identify which skills need attention',
    colorClass: 'problem-icon-primary',
    bgClass: 'problem-bg-primary',
  },
];

const stats = [
  {
    value: '87%',
    label: 'of professionals believe continuous skill development is crucial',
    source: 'LinkedIn Learning',
  },
  {
    value: '90%',
    label: 'increase in learning retention with structured tracking',
    source: 'National Training Labs',
  },
  {
    value: '30-50%',
    label: 'higher engagement with learning cultures',
    source: 'Deloitte',
  },
];

export default function ChallengesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,   
        delayChildren: 0.4,     
      },
    },
  };



  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: 0.3,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };



  const cardVariants = {
    hidden: { opacity: 0, y: 50, rotateX: -15 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.8,
        delay: 0.2,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };

  const statVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.7,
        delay: 0.25,
        ease: [0.34, 1.56, 0.64, 1] as const,
      },

    },
  };

  return (
    <section id='challenges' ref={ref} className="challenges-section relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="text-center mb-16"
        >
          <motion.div
            variants={itemVariants}
            className="challenges-badge inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6"
          >
            <motion.div
              animate={isInView ? { rotate: [0, -10, 10, -10, 0] } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <AlertCircle className="challenges-badge-icon h-4 w-4" />
            </motion.div>
            <span className="challenges-badge-text text-sm font-medium">The Challenge</span>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="challenges-title font-bold text-4xl sm:text-5xl lg:text-6xl mb-4"
          >
            Why Skill Tracking{' '}
            <motion.span
              className="challenges-gradient inline-block"
              animate={
                isInView
                  ? {
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }
                  : {}
              }
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{
                backgroundSize: '200% 200%',
              }}
            >
              Matters
            </motion.span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="challenges-description text-lg sm:text-xl max-w-2xl mx-auto"
          >
            People struggle to track skill development effectively. Without a centralized system,
            monitoring learning consistency over time becomes nearly impossible.
          </motion.p>
        </motion.div>

        {/* Problems Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {problems.map((problem, index) => (
            <motion.div
              key={problem.title}
              variants={cardVariants}
              whileHover={{
                y: -8,
                scale: 1.02,
                transition: { duration: 0.2 },
              }}
              className="problem-card group"
            >
              <motion.div
                className={`${problem.bgClass} problem-icon-wrapper`}
                whileHover={{
                  scale: 1.15,
                  rotate: 8,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 10,
                }}
              >
                <motion.div
                  animate={
                    isInView
                      ? {
                        rotate: [0, -5, 5, -5, 0],
                      }
                      : {}
                  }
                  transition={{
                    duration: 2,
                    delay: 0.8 + index * 0.2,
                    ease: 'easeInOut',
                  }}
                >
                  <problem.icon className={`${problem.colorClass} h-7 w-7`} />
                </motion.div>
              </motion.div>

              <motion.h3
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                className="problem-card-title text-xl font-semibold mb-2"
              >
                {problem.title}
              </motion.h3>

              <motion.p
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                className="problem-card-description"
              >
                {problem.description}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-3 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={statVariants}
              whileHover={{
                y: -6,
                scale: 1.03,
                transition: { duration: 0.2 },
              }}
              className="stat-card group"
            >
              <motion.div className="stat-value text-5xl sm:text-6xl font-bold mb-3">
                {stat.value.split('').map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{
                      duration: 0.3,
                      delay: 0.8 + index * 0.15 + i * 0.05,
                      ease: [0.4, 0, 0.2, 1] as const,
                    }}
                    style={{ display: 'inline-block' }}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.4,
                  delay: 1 + index * 0.15,
                }}
                className="stat-label mb-2"
              >
                {stat.label}
              </motion.p>

              <motion.span
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{
                  duration: 0.4,
                  delay: 1.2 + index * 0.15,
                }}
                className="stat-source text-xs italic"
              >
                — {stat.source}
              </motion.span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}