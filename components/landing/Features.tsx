import { Sparkles, Download, Layout, Shield, Star, Zap as ZapIcon } from 'lucide-react'

const features = [
  {
    icon: Sparkles,
    number: '01',
    title: 'AI Content Generation',
    description: 'Generate professional summaries, improve bullet points, and get skill suggestions with AI-powered tools. Zero writer\'s block.',
    iconBg: 'bg-crimson-500/10',
    iconColor: 'text-crimson-400',
    large: true,
    tag: 'Core Feature',
    tagColor: 'badge-crimson',
  },
  {
    icon: Layout,
    number: '02',
    title: '15 Pro Templates',
    description: 'Modern, Classic, Minimal, Creative, Executive, Timeline, Elegant, Compact, Professional — every one ATS-optimized.',
    iconBg: 'bg-crimson-500/10',
    iconColor: 'text-crimson-400',
    large: false,
    tag: 'Templates',
    tagColor: 'badge-crimson',
  },
  {
    icon: Download,
    number: '03',
    title: 'One-Click PDF Export',
    description: 'Pixel-perfect PDFs, formatted for both print and screen. Ready to send to recruiters instantly.',
    iconBg: 'bg-crimson-500/10',
    iconColor: 'text-crimson-400',
    large: false,
    tag: 'Export',
    tagColor: 'badge-crimson',
  },
  {
    icon: ZapIcon,
    number: '04',
    title: 'Live Preview',
    description: 'Your resume updates in real-time as you type. Instant visual feedback, always.',
    iconBg: 'bg-crimson-500/10',
    iconColor: 'text-crimson-400',
    large: false,
    tag: 'Real-time',
    tagColor: 'badge-crimson',
  },
  {
    icon: Star,
    number: '05',
    title: 'AI Job Tailoring',
    description: 'Paste any job description. AI rewrites your summary and highlights the exact skills that match — increasing callbacks.',
    iconBg: 'bg-crimson-500/10',
    iconColor: 'text-crimson-400',
    large: false,
    tag: 'AI-powered',
    tagColor: 'badge-crimson',
  },
  {
    icon: Shield,
    number: '06',
    title: 'Secure & Private',
    description: 'Your data stored securely. Only you have access. No data sold, no ads, ever. Simple.',
    iconBg: 'bg-crimson-500/10',
    iconColor: 'text-crimson-400',
    large: false,
    tag: 'Privacy',
    tagColor: 'badge-crimson',
  },
]

export function Features() {
  const [large, rest] = [features[0], features.slice(1)]

  return (
    <section id="features" className="relative overflow-hidden py-28">
      {/* Divider */}
      <div className="divider-glow pointer-events-none absolute top-0 left-0 right-0" />

      {/* Soft ambient light */}
      <div className="animate-orb-drift pointer-events-none absolute right-[10%] top-1/3 h-[420px] w-[420px] rounded-full bg-crimson-600/[0.06] blur-[130px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-14 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-crimson-500/25 bg-crimson-500/[0.07] px-3.5 py-1.5 text-[13px] font-medium text-crimson-300">
            <ZapIcon className="h-3.5 w-3.5" />
            Built for job seekers
          </div>
          <h2 className="font-display mb-4 text-4xl font-bold tracking-tight text-primary sm:text-[2.75rem]">
            Everything you need to{' '}
            <span className="gradient-text">land your dream job</span>
          </h2>
          <p className="mx-auto max-w-xl text-[17px] leading-relaxed text-muted">
            From AI writing assistance to professional templates — the most powerful resume tool available.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Large hero feature card */}
          <div className="gradient-border-card group relative col-span-1 overflow-hidden p-7 lg:col-span-1 lg:row-span-2">
            {/* Number watermark */}
            <span className="font-display absolute right-5 top-3 select-none text-8xl font-black leading-none text-white/[0.03] transition-colors duration-500 group-hover:text-crimson-500/[0.08]">
              {large.number}
            </span>

            {/* Tag */}
            <div className={`badge ${large.tagColor} mb-6 px-2.5 py-1`}>
              <Sparkles className="h-3 w-3" />
              {large.tag}
            </div>

            {/* Icon */}
            <div className={`relative mb-6 inline-flex h-[52px] w-[52px] items-center justify-center rounded-2xl ${large.iconBg} border border-crimson-500/20 transition-transform duration-300 group-hover:scale-105`}>
              <large.icon className={`h-6 w-6 ${large.iconColor}`} strokeWidth={1.8} />
            </div>

            <h3 className="font-display mb-3 text-xl font-semibold text-primary">{large.title}</h3>
            <p className="text-sm leading-relaxed text-muted">{large.description}</p>

            {/* Feature list */}
            <ul className="mt-6 space-y-2.5">
              {['Summaries in seconds', 'Bullet point enhancer', 'Skill suggestions'].map(item => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-secondary">
                  <div className="h-1 w-1 rounded-full bg-crimson-400 flex-shrink-0" />
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
              {/* Number watermark */}
              <span className="font-display absolute right-4 top-3 select-none text-6xl font-black leading-none text-white/[0.03] transition-colors group-hover:text-crimson-500/[0.07]">
                {f.number}
              </span>

              {/* Icon */}
              <div className={`relative mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl ${f.iconBg} border border-white/[0.06] transition-transform duration-300 group-hover:scale-105`}>
                <f.icon className={`h-5 w-5 ${f.iconColor}`} strokeWidth={1.8} />
              </div>

              <h3 className="mb-2 font-semibold text-primary leading-snug">{f.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
