
'use client'

// import { ThemeProvider } from '@/components/ThemeContext';
import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import ChallengesSection from '@/components/landing/ChallengesSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import UpcomingFeaturesSection from '@/components/landing/upcomingFeatures ';
import CTA from '@/components/landing/CTA';
import  Footer  from '@/components/landing/Footer';


export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main className=''>
        <HeroSection />
        <ChallengesSection/>
        <FeaturesSection/>
        <HowItWorksSection/>
        <UpcomingFeaturesSection/>
        <CTA/>
        <Footer/>
      </main>
      

    </>
      
  );
}