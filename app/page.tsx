'use client'
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
        <section className="relative overflow-hidden py-28">
          {/* Divider */}
          <div className="divider-glow pointer-events-none absolute top-0 left-0 right-0" />

          {/* Background */}
          <div className="absolute inset-0 bg-dot-pattern opacity-20 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,black,transparent)]" />
          <div className="animate-aurora pointer-events-none absolute -right-32 -top-32 h-[600px] w-[600px] rounded-full bg-crimson-600/[0.08] blur-[130px]" />
          <div className="animate-orb-drift-2 pointer-events-none absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-emerald-600/[0.07] blur-[110px]" />

          <div className="relative mx-auto max-w-3xl px-4 text-center">
            {/* Social proof strip */}
            <div className="mb-8 flex items-center justify-center gap-4">
              <div className="flex -space-x-2">
                {[
                  { initials: 'JD', bg: 'from-green-500 to-green-600' },
                  { initials: 'SR', bg: 'from-teal-500 to-teal-600' },
                  { initials: 'AK', bg: 'from-emerald-500 to-emerald-600' },
                  { initials: 'ML', bg: 'from-crimson-500 to-crimson-700' },
                  { initials: 'PW', bg: 'from-zinc-500 to-zinc-600' },
                ].map(({ initials, bg }) => (
                  <div
                    key={initials}
                    className={`h-8 w-8 rounded-full border-2 border-background bg-gradient-to-br ${bg} flex items-center justify-center text-[10px] font-bold text-white`}
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted">
                <div className="flex">
                  {[1,2,3,4,5].map(i => <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}
                </div>
                <span className="font-semibold text-secondary">10,000+</span> job seekers trust ResumeAI
              </div>
            </div>

            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-crimson-500/25 bg-crimson-500/[0.07] px-3.5 py-1.5 text-[13px] font-medium text-crimson-300">
              <Sparkles className="h-3.5 w-3.5" />
              Join thousands of job seekers
            </div>

            <h2 className="font-display mb-5 text-4xl font-bold leading-tight tracking-tight text-primary sm:text-5xl">
              Ready to land your
              <span className="block gradient-text">next job?</span>
            </h2>
            <p className="mx-auto mb-10 max-w-xl text-[17px] leading-relaxed text-muted">
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
                <button className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.03] px-7 py-3.5 text-base font-semibold text-secondary transition-all duration-200 hover:border-white/20 hover:bg-white/[0.06] hover:text-primary">
                  Sign in
                </button>
              </Link>
            </div>

            <p className="mt-8 text-sm text-muted">
              No credit card required · Free forever plan · Cancel anytime
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
