import { Sparkles, Download, Layout, Shield, Zap, Star, ArrowRight } from 'lucide-react'

const features = [
  {
    icon: Sparkles,
    number: '01',
    title: 'AI Content Generation',
    description: 'Generate professional summaries, improve bullet points, and get skill suggestions — powered by DeepSeek AI. Zero writer\'s block.',
    accent: 'from-violet-500 to-purple-600',
    iconBg: 'bg-violet-500/15',
    iconColor: 'text-violet-400',
    large: true,
    tag: 'Core Feature',
    tagColor: 'badge-violet',
  },
  {
    icon: Layout,
    number: '02',
    title: '9 Pro Templates',
    description: 'Modern, Classic, Minimal, Creative, Executive, Timeline, Elegant, Compact, Professional — every one ATS-optimized.',
    accent: 'from-indigo-500 to-blue-600',
    iconBg: 'bg-indigo-500/15',
    iconColor: 'text-indigo-400',
    large: false,
    tag: 'Templates',
    tagColor: 'badge-cyan',
  },
  {
    icon: Download,
    number: '03',
    title: 'One-Click PDF Export',
    description: 'Pixel-perfect PDFs, formatted for both print and screen. Ready to send to recruiters instantly.',
    accent: 'from-cyan-500 to-blue-500',
    iconBg: 'bg-cyan-500/15',
    iconColor: 'text-cyan-400',
    large: false,
    tag: 'Export',
    tagColor: 'badge-cyan',
  },
  {
    icon: Zap,
    number: '04',
    title: 'Live Preview',
    description: 'Your resume updates in real-time as you type. Instant visual feedback, always.',
    accent: 'from-amber-500 to-orange-500',
    iconBg: 'bg-amber-500/15',
    iconColor: 'text-amber-400',
    large: false,
    tag: 'Real-time',
    tagColor: 'badge-amber',
  },
  {
    icon: Star,
    number: '05',
    title: 'AI Job Tailoring',
    description: 'Paste any job description. AI rewrites your summary and highlights the exact skills that match — increasing callbacks.',
    accent: 'from-emerald-500 to-teal-500',
    iconBg: 'bg-emerald-500/15',
    iconColor: 'text-emerald-400',
    large: false,
    tag: 'AI-powered',
    tagColor: 'badge-emerald',
  },
  {
    icon: Shield,
    number: '06',
    title: 'Secure & Private',
    description: 'Your data stored securely. Only you have access. No data sold, no ads, ever. Simple.',
    accent: 'from-slate-400 to-slate-600',
    iconBg: 'bg-slate-500/15',
    iconColor: 'text-slate-400',
    large: false,
    tag: 'Privacy',
    tagColor: 'badge-violet',
  },
]

export function Features() {
  const [large, rest] = [features[0], features.slice(1)]

  return (
    <section id="features" className="relative overflow-hidden bg-[#0B0B1A] py-32">
      {/* Dividers */}
      <div className="divider-glow pointer-events-none absolute top-0 left-0 right-0" />
      <div className="divider-glow pointer-events-none absolute bottom-0 left-0 right-0" />
      <div className="absolute inset-0 bg-dot-pattern opacity-20" />

      {/* Subtle glow */}
      <div className="animate-orb-drift pointer-events-none absolute right-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-violet-600/[0.05] blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-16 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/[0.08] px-4 py-1.5 text-sm font-semibold text-violet-300">
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            Built for job seekers
          </div>
          <h2 className="font-display mb-5 text-4xl font-extrabold tracking-tight text-slate-50 sm:text-5xl">
            Everything you need to{' '}
            <span className="gradient-text">land your dream job</span>
          </h2>
          <p className="mx-auto max-w-xl text-lg leading-relaxed text-slate-400">
            From AI writing assistance to professional templates — the most powerful resume tool available.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">

          {/* Large hero feature card */}
          <div className="gradient-border-card group relative col-span-1 overflow-hidden p-7 md:col-span-2 lg:col-span-1 lg:row-span-2">
            {/* Background gradient */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/[0.07] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 rounded-2xl" />

            {/* Number watermark */}
            <span className="font-display absolute right-5 top-3 select-none text-8xl font-black leading-none text-white/[0.025] transition-colors duration-500 group-hover:text-white/[0.04]">
              {large.number}
            </span>

            {/* Tag */}
            <div className={`badge ${large.tagColor} mb-6 px-2.5 py-1`}>
              <Sparkles className="h-3 w-3" />
              {large.tag}
            </div>

            {/* Icon */}
            <div className={`relative mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${large.iconBg} border border-violet-500/20 shadow-sm transition-transform duration-300 group-hover:scale-105`}>
              <large.icon className={`h-7 w-7 ${large.iconColor}`} strokeWidth={1.8} />
            </div>

            <h3 className="font-display mb-3 text-xl font-bold text-slate-100">{large.title}</h3>
            <p className="text-sm leading-relaxed text-slate-400">{large.description}</p>

            {/* Feature list */}
            <ul className="mt-6 space-y-2.5">
              {['Summaries in seconds', 'Bullet point enhancer', 'Skill suggestions'].map(item => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-slate-300">
                  <div className="h-1.5 w-1.5 rounded-full bg-violet-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Regular feature cards */}
          {rest.map((f) => (
            <div
              key={f.title}
              className="gradient-border-card group relative cursor-default overflow-hidden p-6"
            >
              {/* Hover gradient fill */}
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 rounded-2xl"
                style={{ background: `radial-gradient(ellipse at 20% 20%, ${f.accent.includes('cyan') ? 'rgba(34,211,238,0.05)' : f.accent.includes('amber') ? 'rgba(245,158,11,0.05)' : f.accent.includes('emerald') ? 'rgba(16,185,129,0.05)' : 'rgba(139,92,246,0.05)'} 0%, transparent 70%)` }}
              />

              {/* Number watermark */}
              <span className="font-display absolute right-4 top-3 select-none text-6xl font-black leading-none text-white/[0.025] transition-colors group-hover:text-white/[0.045]">
                {f.number}
              </span>

              {/* Icon */}
              <div className={`relative mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl ${f.iconBg} border border-white/[0.06] shadow-sm transition-transform duration-300 group-hover:scale-105`}>
                <f.icon className={`h-5 w-5 ${f.iconColor}`} strokeWidth={1.8} />
              </div>

              <h3 className="mb-2 font-semibold text-slate-100 leading-snug">{f.title}</h3>
              <p className="text-sm leading-relaxed text-slate-500">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
