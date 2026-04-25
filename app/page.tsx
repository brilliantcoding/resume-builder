import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/landing/Hero'
import { Features } from '@/components/landing/Features'
import { TemplateShowcase } from '@/components/landing/TemplateShowcase'
import Link from 'next/link'
import { ArrowRight, Sparkles, Star } from 'lucide-react'

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <TemplateShowcase />

        {/* CTA Section */}
        <section className="relative overflow-hidden bg-[#0B0B1A] py-32">
          {/* Dividers */}
          <div className="divider-glow pointer-events-none absolute top-0 left-0 right-0" />

          {/* Background */}
          <div className="absolute inset-0 bg-dot-pattern opacity-15" />
          <div className="animate-aurora pointer-events-none absolute -right-32 -top-32 h-[600px] w-[600px] rounded-full bg-violet-700/[0.12] blur-[120px]" />
          <div className="animate-orb-drift-2 pointer-events-none absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-indigo-600/[0.1] blur-[100px]" />

          <div className="relative mx-auto max-w-3xl px-4 text-center">
            {/* Social proof strip */}
            <div className="mb-8 flex items-center justify-center gap-4">
              <div className="flex -space-x-2">
                {['indigo', 'violet', 'teal', 'rose', 'amber'].map((color, i) => (
                  <div
                    key={i}
                    className={`h-8 w-8 rounded-full border-2 border-[#0B0B1A] bg-gradient-to-br from-${color}-500 to-${color}-600 flex items-center justify-center text-[10px] font-bold text-white`}
                  >
                    {['JD', 'SR', 'AK', 'ML', 'PW'][i]}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1.5 text-sm text-slate-400">
                <div className="flex">
                  {[1,2,3,4,5].map(i => <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}
                </div>
                <span className="font-semibold text-slate-300">10,000+</span> job seekers trust ResumeAI
              </div>
            </div>

            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/[0.08] px-4 py-1.5 text-sm font-semibold text-violet-300">
              <Sparkles className="h-3.5 w-3.5 text-violet-400" />
              Join thousands of job seekers
            </div>

            <h2 className="font-display mb-5 text-4xl font-extrabold leading-tight tracking-tight text-slate-50 sm:text-5xl">
              Ready to land your
              <span className="block gradient-text">next job?</span>
            </h2>
            <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-slate-400">
              Build your professional resume in minutes — AI writes the content, you pick the template, and download your PDF instantly.
            </p>

            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/register">
                <button className="btn-gradient group inline-flex items-center gap-2.5 rounded-xl px-7 py-3.5 text-base font-semibold text-white">
                  Build your resume — it&apos;s free
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
              <Link href="/login">
                <button className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-7 py-3.5 text-base font-semibold text-slate-200 transition-all duration-200 hover:border-violet-500/30 hover:bg-violet-500/[0.07]">
                  Sign in
                </button>
              </Link>
            </div>

            <p className="mt-8 text-sm text-slate-600">
              No credit card required · Free forever plan · Cancel anytime
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
