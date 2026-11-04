import { Sparkles, Download, Layout, Shield, Star, Zap as ZapIcon } from 'lucide-react'

const features = [
  {
    icon: Sparkles,
    number: '01',
    title: 'AI Content Generation',
    description: 'Generate professional summaries, improve bullet points, and get skill suggestions — powered by DeepSeek AI. Zero writer\'s block.',
    accent: 'from-crimson-500 via-amber-500 to-fuchsia-600',
    iconBg: 'bg-crimson-500/20',
    iconColor: 'text-crimson-300',
    large: true,
    tag: 'Core Feature',
    tagColor: 'badge-crimson',
  },
  {
    icon: Layout,
    number: '02',
    title: '9 Pro Templates',
    description: 'Modern, Classic, Minimal, Creative, Executive, Timeline, Elegant, Compact, Professional — every one ATS-optimized.',
    accent: 'from-amber-500 via-orange-500 to-red-600',
    iconBg: 'bg-amber-500/20',
    iconColor: 'text-amber-300',
    large: false,
    tag: 'Templates',
    tagColor: 'badge-amber',
  },
  {
    icon: Download,
    number: '03',
    title: 'One-Click PDF Export',
    description: 'Pixel-perfect PDFs, formatted for both print and screen. Ready to send to recruiters instantly.',
    accent: 'from-emerald-500 via-emerald-400 to-amber-400',
    iconBg: 'bg-emerald-500/20',
    iconColor: 'text-emerald-300',
    large: false,
    tag: 'Export',
    tagColor: 'badge-emerald',
  },
  {
    icon: ZapIcon,
    number: '04',
    title: 'Live Preview',
    description: 'Your resume updates in real-time as you type. Instant visual feedback, always.',
    accent: 'from-amber-500 via-orange-500 to-red-500',
    iconBg: 'bg-amber-500/20',
    iconColor: 'text-amber-300',
    large: false,
    tag: 'Real-time',
    tagColor: 'badge-amber',
  },
  {
    icon: Star,
    number: '05',
    title: 'AI Job Tailoring',
    description: 'Paste any job description. AI rewrites your summary and highlights the exact skills that match — increasing callbacks.',
    accent: 'from-emerald-500 via-emerald-400 to-amber-400',
    iconBg: 'bg-emerald-500/20',
    iconColor: 'text-emerald-300',
    large: false,
    tag: 'AI-powered',
    tagColor: 'badge-emerald',
  },
  {
    icon: Shield,
    number: '06',
    title: 'Secure & Private',
    description: 'Your data stored securely. Only you have access. No data sold, no ads, ever. Simple.',
    accent: 'from-slate-500 via-slate-600 to-gray-700',
    iconBg: 'bg-slate-500/20',
    iconColor: 'text-slate-300',
    large: false,
    tag: 'Privacy',
    tagColor: 'badge-slate',
  },
]

export function Features() {
  const [large, rest] = [features[0], features.slice(1)]

  return (
    <section id="features" className="relative overflow-hidden bg-card py-32">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-card/95" />

      {/* Dividers */}
      <div className="divider-glow pointer-events-none absolute top-0 left-0 right-0" />
      <div className="divider-glow pointer-events-none absolute bottom-0 left-0 right-0" />
      <div className="absolute inset-0 bg-dot-pattern opacity-25" />

      {/* Animated glow orbs with crimson/gold theme */}
      <div className="animate-orb-drift pointer-events-none absolute right-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-crimson-600/[0.15] blur-[100px] shadow-[0_0_100px_rgba(20,184,166,0.3)]" />
      <div className="animate-aurora pointer-events-none absolute left-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-gradient-to-r from-amber-600 via-fuchsia-600 to-crimson-600/[0.12] blur-[120px] shadow-[0_0_120px_rgba(192,38,211,0.25)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-16 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-crimson-500/35 bg-crimson-500/[0.12] px-4 py-1.5 text-sm font-semibold text-crimson-300 backdrop-blur-sm shadow-[0_0_20px_rgba(20,184,166,0.15)]">
            <ZapIcon className="h-3.5 w-3.5 text-amber-300" />
            Built for job seekers
          </div>
          <h2 className="font-display mb-5 text-4xl font-extrabold tracking-tight text-slate-100 sm:text-5xl">
            Everything you need to{' '}
            <span className="bg-gradient-to-r from-crimson-400 via-amber-400 to-fuchsia-400 bg-clip-text text-transparent animate-rich-glow">
              land your dream job
            </span>
          </h2>
          <p className="mx-auto max-w-xl text-lg leading-relaxed text-slate-400">
            From AI writing assistance to professional templates — the most powerful resume tool available.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Large hero feature card */}
          <div className="gradient-border-card group relative col-span-1 overflow-hidden p-7 md:col-span-2 lg:col-span-1 lg:row-span-2 glass-card transition-all duration-300 hover:shadow-[0_0_80px_rgba(20,184,166,0.25)]">
            {/* Background gradient */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-crimson-500/[0.1] via-amber-500/[0.05] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 rounded-2xl shadow-[0_0_60px_rgba(20,184,166,0.2)]" />

            {/* Number watermark */}
            <span className="font-display absolute right-5 top-3 select-none text-8xl font-black leading-none text-white/[0.03] transition-colors duration-500 group-hover:text-white/[0.055]">
              {large.number}
            </span>

            {/* Tag */}
            <div className={`badge ${large.tagColor} mb-6 px-2.5 py-1 shadow-lg`}>
              <Sparkles className="h-3 w-3" />
              {large.tag}
            </div>

            {/* Icon */}
            <div className={`relative mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${large.iconBg} border border-crimson-500/30 shadow-[0_0_30px_rgba(20,184,166,0.25)] transition-transform duration-300 group-hover:scale-110 group-hover:shadow-[0_0_50px_rgba(20,184,166,0.4)]`}>
              <large.icon className={`h-7 w-7 ${large.iconColor}`} strokeWidth={1.8} />
            </div>

            <h3 className="font-display mb-3 text-xl font-bold text-slate-100">{large.title}</h3>
            <p className="text-sm leading-relaxed text-slate-400">{large.description}</p>

            {/* Feature list */}
            <ul className="mt-6 space-y-2.5">
              {['Summaries in seconds', 'Bullet point enhancer', 'Skill suggestions'].map(item => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-slate-300 transition-colors group-hover:text-slate-200">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-crimson-400 to-amber-400 flex-shrink-0 shadow-[0_0_10px_rgba(20,184,166,0.4)]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Regular feature cards */}
          {rest.map((f) => (
            <div
              key={f.title}
              className="gradient-border-card group relative cursor-default overflow-hidden p-6 glass-card transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(0,0,0,0.5)]"
            >
              {/* Hover gradient fill */}
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 rounded-2xl"
                style={{ background: `radial-gradient(ellipse at 20% 20%, ${f.accent.includes('emerald') ? 'rgba(16,185,129,0.08)' : f.accent.includes('amber') ? 'rgba(251,191,36,0.08)' : f.accent.includes('crimson') ? 'rgba(20,184,166,0.08)' : 'rgba(139,92,246,0.05)'} 0%, transparent 70%)` }}
              />

              {/* Number watermark */}
              <span className="font-display absolute right-4 top-3 select-none text-6xl font-black leading-none text-white/[0.03] transition-colors group-hover:text-white/[0.055]">
                {f.number}
              </span>

              {/* Icon */}
              <div className={`relative mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl ${f.iconBg} border border-white/[0.08] shadow-[0_0_20px_rgba(20,184,166,0.15)] transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_40px_rgba(20,184,166,0.3)]`}>
                <f.icon className={`h-5 w-5 ${f.iconColor}`} strokeWidth={1.8} />
              </div>

              <h3 className="mb-2 font-semibold text-slate-100 leading-snug group-hover:text-slate-50 transition-colors">{f.title}</h3>
              <p className="text-sm leading-relaxed text-slate-500 group-hover:text-slate-300 transition-colors">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
