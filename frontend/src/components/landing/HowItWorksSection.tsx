
'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  UserPlus,
  Layout,
  Target,
  PenLine,
  BookOpen,
  BarChart2,
  Sparkles,
  Mail,
  ArrowRight,
} from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    title: 'Sign Up & Onboard',
    description: 'Create your account with email verification and set up your profile in minutes.',
    bgClass: 'step-bg-primary-glow',
  },
  {
    icon: Layout,
    title: 'Access Dashboard',
    description: 'View your personalized dashboard with stats, streaks, and progress at a glance.',
    bgClass: 'step-bg-info-primary',
  },
  {
    icon: Target,
    title: 'Add Your Skills',
    description: 'Create and categorize skills you want to develop with custom learning goals.',
    bgClass: 'step-bg-warning-destructive',
  },
  {
    icon: PenLine,
    title: 'Log Daily Progress',
    description: 'Track time spent, add notes, and monitor your daily skill development.',
    bgClass: 'step-bg-success-primary',
  },
  {
    icon: BookOpen,
    title: 'Add Resources',
    description: 'Organize learning materials like articles, videos, books, and courses linked to each skill.',
    bgClass: 'step-bg-primary-info',
  },
  {
    icon: BarChart2,
    title: 'Track & Analyze',
    description: 'View interactive charts, monitor trends, and see detailed skill breakdowns.',
    bgClass: 'step-bg-warning-primary',
  },
  {
    icon: Sparkles,
    title: 'Get AI Insights',
    description: 'Receive weekly AI-powered summaries with personalized recommendations.',
    bgClass: 'step-bg-success-info',
  },
  {
    icon: Mail,
    title: 'Review & Improve',
    description: 'Read insights via email, adjust your learning plan, and set new goals.',
    bgClass: 'step-bg-primary-glow',
  },
];

export default function HowItWorksSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const headerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.34, 1.56, 0.64, 1] as const,
      },
    },
  };

  const stepVariants = {
    hidden: (index: number) => ({
      opacity: 0,
      x: index % 2 === 0 ? -100 : 100,
      scale: 0.85,
      rotateY: index % 2 === 0 ? -15 : 15,
    }),
    visible: (index: number) => ({
      opacity: 1,
      x: 0,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 0.7,
        delay: index * 0.15,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    }),
  };

  const connectorVariants = {
    hidden: { scaleY: 0, opacity: 0 },
    visible: (index: number) => ({
      scaleY: 1,
      opacity: 1,
      transition: {
        duration: 0.6,
        delay: index * 0.15 + 0.3,
        ease: 'easeOut' as const,
      },
    }),
  };

  return (
    <section id="how-it-works" ref={ref} className="how-it-works-section">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="how-it-works-blob-1"
          animate={{
            scale: [1, 1.15, 1],
            x: [0, -30, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="how-it-works-blob-2"
          animate={{
            scale: [1.1, 1, 1.1],
            x: [0, 40, 0],
            y: [0, -25, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        {/* Section Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.span
            variants={badgeVariants}
            className="how-it-works-badge inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4"
          >
            <motion.span
              animate={
                isInView
                  ? {
                      opacity: [1, 0.7, 1],
                    }
                  : {}
              }
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              How It Works
            </motion.span>
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="how-it-works-title text-3xl md:text-5xl font-bold mb-6"
          >
            Your Journey to{' '}
            <motion.span
              className="how-it-works-gradient inline-block"
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
              Skill Mastery
            </motion.span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="how-it-works-description text-lg"
          >
            A simple, powerful workflow designed to help you build skills consistently and
            effectively.
          </motion.p>
        </motion.div>

        {/* Steps Timeline */}
        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => {
            const isFromLeft = index % 2 === 0;
            
            return (
              <motion.div
                key={step.title}
                custom={index}
                variants={stepVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                onHoverStart={() => setHoveredStep(index)}
                onHoverEnd={() => setHoveredStep(null)}
                className={`step-container ${isFromLeft ? '' : 'step-container-reverse'}`}
                style={{ perspective: '1000px' }}
              >
                {/* Step Number & Icon */}
                <motion.div
                  className="step-icon-wrapper relative"
                  animate={{
                    scale: hoveredStep === index ? 1.15 : 1,
                    rotate: hoveredStep === index ? (isFromLeft ? 5 : -5) : 0,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 15,
                  }}
                >
                  {/* Animated Connector Line */}
                  {index < steps.length - 1 && (
                    <motion.div
                      className="step-connector"
                      custom={index}
                      variants={connectorVariants}
                      initial="hidden"
                      animate={isInView ? 'visible' : 'hidden'}
                      style={{ originY: 0 }}
                    />
                  )}

                  {/* Pulse Effect on Hover */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl"
                    animate={{
                      scale: hoveredStep === index ? [1, 1.3, 1] : 1,
                      opacity: hoveredStep === index ? [0.5, 0, 0.5] : 0,
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: hoveredStep === index ? Infinity : 0,
                    }}
                    style={{
                      background: 'hsl(var(--primary) / 0.3)',
                      filter: 'blur(10px)',
                    }}
                  />

                  <motion.div
                    className={`w-full h-full rounded-2xl ${step.bgClass} flex items-center justify-center relative z-10`}
                    animate={
                      isInView
                        ? {
                            boxShadow: [
                              '0 4px 14px hsla(var(--primary), 0.25)',
                              '0 8px 20px hsla(var(--primary), 0.35)',
                              '0 4px 14px hsla(var(--primary), 0.25)',
                            ],
                          }
                        : {}
                    }
                    transition={{
                      duration: 2,
                      delay: index * 0.15 + 0.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <motion.div
                      animate={
                        isInView
                          ? {
                              rotate: [0, -10, 10, -10, 0],
                              scale: [1, 1.1, 1],
                            }
                          : {}
                      }
                      transition={{
                        duration: 2,
                        delay: index * 0.15 + 0.8,
                        ease: 'easeInOut',
                      }}
                    >
                      <step.icon className="step-icon" />
                    </motion.div>
                  </motion.div>

                  {/* Step Number with Pop Animation */}
                  <motion.div
                    className="step-number"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={
                      isInView
                        ? { scale: 1, rotate: 0 }
                        : { scale: 0, rotate: -180 }
                    }
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 15,
                      delay: index * 0.15 + 0.4,
                    }}
                  >
                    <span className="step-number-text">{index + 1}</span>
                  </motion.div>
                </motion.div>

                {/* Content Card with 3D Effect */}
                <motion.div
                  className="step-content-card"
                  animate={{
                    y: hoveredStep === index ? -8 : 0,
                    scale: hoveredStep === index ? 1.02 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Shimmer Effect on Hover */}
                  <motion.div
                    className="absolute inset-0 rounded-xl pointer-events-none overflow-hidden"
                    initial={{ x: isFromLeft ? '-100%' : '100%' }}
                    animate={{
                      x: hoveredStep === index ? (isFromLeft ? '100%' : '-100%') : (isFromLeft ? '-100%' : '100%'),
                    }}
                    transition={{
                      duration: 0.8,
                      ease: 'easeInOut',
                    }}
                    style={{
                      background:
                        'linear-gradient(90deg, transparent, hsl(var(--primary) / 0.1), transparent)',
                    }}
                  />

                  {/* Title with Character Animation */}
                  <h3 className="step-content-title">
                    {step.title.split('').map((char, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{
                          duration: 0.3,
                          delay: index * 0.15 + 0.5 + i * 0.02,
                        }}
                        style={{ display: 'inline-block' }}
                      >
                        {char === ' ' ? '\u00A0' : char}
                      </motion.span>
                    ))}
                  </h3>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.15 + 0.7,
                    }}
                    className="step-content-description"
                  >
                    {step.description}
                  </motion.p>

                  {/* Glow Effect on Hover */}
                  <motion.div
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    animate={{
                      opacity: hoveredStep === index ? 0.1 : 0,
                    }}
                    style={{
                      background: 'radial-gradient(circle at center, hsl(var(--primary)), transparent 70%)',
                    }}
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Cycle Indicator with Advanced Animations */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={
            isInView
              ? { opacity: 1, y: 0, scale: 1 }
              : { opacity: 0, y: 30, scale: 0.9 }
          }
          transition={{
            duration: 0.7,
            delay: steps.length * 0.15 + 0.3,
            ease: [0.34, 1.56, 0.64, 1] as const,
          }}
          className="cycle-indicator"
        >
          {/* Animated Lines */}
          <motion.div
            className="cycle-line cycle-line-left"
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{
              duration: 0.8,
              delay: steps.length * 0.15 + 0.5,
            }}
            style={{ originX: 1 }}
          />

          <motion.div
            className="cycle-badge"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <motion.div
              animate={isInView ? { rotate: 360 } : { rotate: 0 }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <ArrowRight className="cycle-icon" />
            </motion.div>
            <motion.span
              className="cycle-text"
              animate={
                isInView
                  ? {
                      opacity: [1, 0.7, 1],
                    }
                  : {}
              }
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              Continuous Learning Loop
            </motion.span>
          </motion.div>

          <motion.div
            className="cycle-line cycle-line-right"
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{
              duration: 0.8,
              delay: steps.length * 0.15 + 0.5,
            }}
            style={{ originX: 0 }}
          />
        </motion.div>

        {/* Floating Particles */}
        {isInView && (
          <>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-primary/30"
                style={{
                  left: `${15 + i * 12}%`,
                  top: `${20 + (i % 4) * 20}%`,
                }}
                animate={{
                  y: [0, -40, 0],
                  opacity: [0, 0.8, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{
                  duration: 4 + i * 0.3,
                  repeat: Infinity,
                  delay: i * 0.4,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </>
        )}
      </div>
    </section>
  );
}