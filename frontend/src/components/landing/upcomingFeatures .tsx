'use client'

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
    Smartphone,
    Users2,
    Link2,
    LineChart,
    Trophy,
    Rocket,
    Bot
} from 'lucide-react';

const upcomingFeatures = [
    {
        icon: Smartphone,
        title: 'Mobile Application',
        description: 'Native iOS/Android apps with offline logging and push notifications.',
    },
    {
        icon: Bot,
        title: 'Advanced AI Features',
        description: 'Personalized learning paths, skill gap analysis, and voice-based logging.',
    },
    {
        icon: Users2,
        title: 'Social & Community',
        description: 'Public profiles, study groups, mentorship programs, and progress competitions.',
    },
    {
        icon: Link2,
        title: 'Integration Ecosystem',
        description: 'Connect with Coursera, Udemy, calendars, wearables, and export to resumes.',
    },
    {
        icon: LineChart,
        title: 'Enhanced Analytics',
        description: 'Predictive trends, custom PDF reports, team dashboards, and ROI tracking.',
    },
    {
        icon: Trophy,
        title: 'Gamification+',
        description: 'Achievement badges, leaderboards, streak bonuses, and unlockable rewards.',
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.2,
        },
    },
};

const cardVariants = {
    hidden: { 
        opacity: 0, 
        y: 60, 
        scale: 0.9,
        rotateX: 10,
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        rotateX: 0,
        transition: {
            type: 'spring' as const,
            stiffness: 100,
            damping: 15,
            duration: 0.6,
        },
    },
};


export default function UpcomingFeaturesSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section
            id="upcoming"
            ref={ref}
            className="upcoming-section relative overflow-hidden mx-19"
        >
            {/* Background Blob */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="upcoming-blob absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] rounded-full" />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                        className="upcoming-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-4"
                    >
                        <Rocket className="w-4 h-4" />
                        Roadmap
                    </motion.div>
                    <h2 className="upcoming-title text-3xl md:text-5xl font-bold mb-6">
                        Upcoming{' '}
                        <span className="upcoming-gradient">Features</span>
                    </h2>
                    <p className="upcoming-description text-lg">
                        We're constantly building new features to help you succeed. Here's what's coming next.
                    </p>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {upcomingFeatures.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            variants={cardVariants}
                            whileHover={{ y: -8 }}
                            className="upcoming-card group relative p-6 rounded-2xl overflow-hidden"
                        >
                            {/* Icon */}
                            <motion.div
                                className="upcoming-icon-wrapper w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ type: 'spring', stiffness: 400 }}
                            >
                                <feature.icon className="upcoming-icon w-7 h-7" />
                            </motion.div>

                            {/* Content */}
                            <h3 className="upcoming-card-title text-xl font-semibold mb-2">
                                {feature.title}
                            </h3>
                            <p className="upcoming-card-description leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Suggestion Box */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="mt-12 text-center"
                >
                    <div className="upcoming-suggestion-box inline-flex items-center gap-3 px-6 py-4 rounded-2xl">
                        <span className="text-2xl">💡</span>
                        <p className="upcoming-suggestion-text">
                            Have a feature suggestion?{' '}
                            <a href="#" className="upcoming-suggestion-link">
                                Let us know!
                            </a>
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}












