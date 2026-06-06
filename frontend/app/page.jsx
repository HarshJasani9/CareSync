  import Navbar       from '@/components/landing/Navbar'
  import Hero         from '@/components/landing/Hero'
  import TrustBar     from '@/components/landing/TrustBar'
  import HowItWorks   from '@/components/landing/HowItWorks'
  import Stats        from '@/components/landing/Stats'
  import Features     from '@/components/landing/Features'
  import Testimonials from '@/components/landing/Testimonials'
  import DoctorCTA    from '@/components/landing/DoctorCTA'
  import FinalCTA     from '@/components/landing/FinalCTA'

  export const metadata = {
    title: 'CareSync — Healthcare that fits your schedule',
    description: 'Book appointments, receive digital prescriptions, and manage your health records in one place.',
  }

  export default function LandingPage() {
    return (
      <main className="min-h-screen bg-white dark:bg-gray-950">
        <Navbar />
        <div className="max-w-5xl mx-auto px-6">
          <Hero />
          <TrustBar />
          <HowItWorks />
          <Stats />
          <Features />
          <Testimonials />
          <DoctorCTA />
          <FinalCTA />
        </div>
      </main>
    )
  }
