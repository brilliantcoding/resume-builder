import Link from 'next/link'
import { ArrowRight, Layout } from 'lucide-react'

const templates = [
  {
    id: 'modern',
    name: 'Modern',
    desc: 'Clean sidebar with accent colors',
    ring: 'ring-indigo-400/40',
    label: 'Most Popular',
    labelColor: 'bg-indigo-500/20 text-indigo-300',
    preview: (
      <div className="p-3.5 h-full">
        <div className="flex gap-2.5 h-full">
          <div className="w-[38%] bg-indigo-600 rounded-md p-2.5">
            <div className="w-7 h-7 bg-white/30 rounded-full mb-2" />
            <div className="h-1.5 bg-white/70 rounded mb-1 w-full" />
            <div className="h-1 bg-white/50 rounded mb-3 w-3/4" />
            {[1,2,3,4].map(i => <div key={i} className="h-1 bg-white/30 rounded mb-1.5" />)}
          </div>
          <div className="flex-1 pt-1">
            <div className="h-1.5 bg-gray-700 rounded mb-1 w-3/4" />
            <div className="h-1 bg-gray-300 rounded mb-3 w-1/2" />
            <div className="h-1 bg-indigo-300 rounded mb-2 w-1/3" />
            {[1,2,3,4,5].map(i => <div key={i} className="h-1 bg-gray-200 rounded mb-1.5" />)}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'classic',
    name: 'Classic',
    desc: 'ATS-optimized single column',
    ring: 'ring-gray-400/40',
    label: 'ATS Safe',
    labelColor: 'bg-gray-500/20 text-gray-300',
    preview: (
      <div className="p-3.5">
        <div className="text-center mb-3">
          <div className="h-2 bg-gray-800 rounded mx-auto w-1/2 mb-1" />
          <div className="h-1 bg-gray-400 rounded mx-auto w-1/3 mb-2" />
          <div className="h-px bg-gray-300 w-full" />
        </div>
        <div className="mb-3">
          <div className="h-1.5 bg-gray-700 rounded w-1/4 mb-2" />
          {[1,2,3].map(i => <div key={i} className="h-1 bg-gray-200 rounded mb-1.5" />)}
        </div>
        <div>
          <div className="h-1.5 bg-gray-700 rounded w-1/4 mb-2" />
          {[1,2,3].map(i => <div key={i} className="h-1 bg-gray-200 rounded mb-1.5" />)}
        </div>
      </div>
    ),
  },
  {
    id: 'minimal',
    name: 'Minimal',
    desc: 'Elegant whitespace design',
    ring: 'ring-teal-400/40',
    label: 'Clean',
    labelColor: 'bg-teal-500/20 text-teal-300',
    preview: (
      <div className="p-3.5">
        <div className="mb-3">
          <div className="h-2 bg-teal-700 rounded w-2/3 mb-1" />
          <div className="h-1 bg-gray-300 rounded w-1/3 mb-2" />
          <div className="h-px bg-teal-500 mb-3" />
        </div>
        {[1,2,3,4,5,6,7].map(i => (
          <div key={i} className={`h-1 bg-gray-200 rounded mb-2 ${i % 3 === 0 ? 'w-1/2' : 'w-full'}`} />
        ))}
      </div>
    ),
  },
  {
    id: 'creative',
    name: 'Creative',
    desc: 'Bold for creative industries',
    ring: 'ring-rose-400/40',
    label: 'Bold',
    labelColor: 'bg-rose-500/20 text-rose-300',
    preview: (
      <div className="h-full">
        <div className="bg-rose-500 p-3 rounded-t-md mb-2">
          <div className="h-2 bg-white/90 rounded w-1/2 mb-1" />
          <div className="h-1 bg-white/60 rounded w-1/3" />
        </div>
        <div className="px-3 flex gap-2">
          <div className="flex-1">
            {[1,2,3,4].map(i => <div key={i} className="h-1 bg-gray-200 rounded mb-1.5" />)}
          </div>
          <div className="w-1/3">
            <div className="h-1.5 bg-rose-400 rounded mb-1.5 w-full" />
            {[1,2,3].map(i => <div key={i} className="h-1 bg-gray-200 rounded mb-1" />)}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'executive',
    name: 'Executive',
    desc: 'Dark sidebar for senior roles',
    ring: 'ring-blue-400/40',
    label: 'C-Suite',
    labelColor: 'bg-blue-500/20 text-blue-300',
    preview: (
      <div className="h-full flex rounded-md overflow-hidden">
        <div className="w-[35%] bg-blue-900 p-2.5">
          <div className="h-1.5 bg-white/80 rounded w-3/4 mb-1" />
          <div className="h-1 bg-white/40 rounded mb-3 w-1/2" />
          <div className="h-1 bg-blue-400 rounded w-full mb-1.5" />
          {[1,2,3].map(i => <div key={i} className="h-1 bg-white/30 rounded mb-1.5" />)}
          <div className="h-1 bg-blue-400 rounded w-full mb-1.5 mt-2" />
          {[1,2,3].map(i => <div key={i} className="h-1 bg-white/30 rounded mb-1.5" />)}
        </div>
        <div className="flex-1 p-2.5">
          <div className="flex items-center gap-1 mb-1.5">
            <div className="w-1 h-3 bg-blue-500 rounded" />
            <div className="h-1.5 bg-gray-700 rounded w-2/3" />
          </div>
          {[1,2,3,4].map(i => <div key={i} className="h-1 bg-gray-200 rounded mb-1.5 ml-2" />)}
          <div className="flex items-center gap-1 mb-1.5 mt-2">
            <div className="w-1 h-3 bg-blue-500 rounded" />
            <div className="h-1.5 bg-gray-700 rounded w-1/2" />
          </div>
          {[1,2,3].map(i => <div key={i} className="h-1 bg-gray-200 rounded mb-1.5 ml-2" />)}
        </div>
      </div>
    ),
  },
  {
    id: 'timeline',
    name: 'Timeline',
    desc: 'Visual career progression',
    ring: 'ring-teal-400/40',
    label: 'Visual',
    labelColor: 'bg-teal-500/20 text-teal-300',
    preview: (
      <div className="p-3.5">
        <div className="flex justify-between items-end mb-2 pb-2 border-b-2 border-teal-400">
          <div>
            <div className="h-1.5 bg-gray-800 rounded w-24 mb-1" />
            <div className="h-1 bg-teal-500 rounded w-16" />
          </div>
        </div>
        <div className="h-1 bg-teal-600 rounded w-1/4 mb-2" />
        {[1,2,3].map(i => (
          <div key={i} className="flex gap-2 mb-2">
            <div className="flex flex-col items-center">
              <div className="w-2.5 h-2.5 rounded-full bg-teal-500 mt-0.5 flex-shrink-0" />
              <div className="w-px flex-1 bg-teal-100 mt-0.5" />
            </div>
            <div className="flex-1 pb-1">
              <div className="h-1.5 bg-gray-700 rounded w-3/4 mb-1" />
              <div className="h-1 bg-gray-200 rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'elegant',
    name: 'Elegant',
    desc: 'Serif design with gold accents',
    ring: 'ring-yellow-400/40',
    label: 'Premium',
    labelColor: 'bg-yellow-500/20 text-yellow-300',
    preview: (
      <div className="p-4">
        <div className="text-center mb-3">
          <div className="h-2 bg-gray-800 rounded mx-auto w-3/5 mb-1.5" />
          <div className="h-1 bg-yellow-600 rounded mx-auto w-1/3 mb-1.5" />
          <div className="flex justify-center gap-2">
            {[1,2].map(i => <div key={i} className="h-0.5 bg-gray-300 rounded w-10" />)}
          </div>
          <div className="w-6 h-px bg-yellow-600 mx-auto mt-1.5" />
        </div>
        <div className="flex items-center gap-2 mb-2.5">
          <div className="flex-1 h-px bg-yellow-400 opacity-40" />
          <div className="h-1 bg-yellow-600 rounded w-10" />
          <div className="flex-1 h-px bg-yellow-400 opacity-40" />
        </div>
        {[1,2,3,4].map(i => (
          <div key={i} className={`h-1 bg-gray-200 rounded mb-1.5 ${i % 3 === 0 ? 'w-1/2' : 'w-full'}`} />
        ))}
      </div>
    ),
  },
  {
    id: 'compact',
    name: 'Compact',
    desc: 'Dense two-column layout',
    ring: 'ring-violet-400/40',
    label: 'Info-Dense',
    labelColor: 'bg-violet-500/20 text-violet-300',
    preview: (
      <div className="h-full flex flex-col rounded-md overflow-hidden">
        <div className="bg-violet-700 p-2.5">
          <div className="h-1.5 bg-white/80 rounded w-2/5 mb-1" />
          <div className="h-1 bg-white/50 rounded w-1/3" />
        </div>
        <div className="flex flex-1">
          <div className="w-[38%] bg-violet-50 p-2 border-r border-violet-100">
            <div className="bg-violet-600 rounded px-1.5 py-0.5 mb-1.5">
              <div className="h-1 bg-white/80 rounded w-2/3" />
            </div>
            {[1,2,3,4].map(i => <div key={i} className="h-1 bg-gray-300 rounded mb-1.5" />)}
            <div className="bg-violet-600 rounded px-1.5 py-0.5 mb-1.5 mt-1.5">
              <div className="h-1 bg-white/80 rounded w-2/3" />
            </div>
            {[1,2].map(i => <div key={i} className="h-1 bg-gray-300 rounded mb-1.5" />)}
          </div>
          <div className="flex-1 p-2">
            <div className="h-1.5 bg-violet-600 rounded w-1/3 mb-2" />
            {[1,2,3,4,5].map(i => <div key={i} className="h-1 bg-gray-200 rounded mb-1.5" />)}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'professional',
    name: 'Professional',
    desc: 'Traditional serif ATS layout',
    ring: 'ring-amber-400/40',
    label: 'Traditional',
    labelColor: 'bg-amber-500/20 text-amber-300',
    preview: (
      <div className="p-3.5">
        <div className="text-center mb-2.5">
          <div className="h-2 bg-amber-900 rounded mx-auto w-2/3 mb-1" />
          <div className="h-1 bg-gray-400 rounded mx-auto w-1/3 mb-1" />
          <div className="h-1 bg-gray-300 rounded mx-auto w-1/2" />
        </div>
        <div className="border-t border-gray-700 pt-2 mb-2">
          <div className="h-1.5 bg-gray-800 rounded w-1/3 mb-1.5" />
          <div className="grid grid-cols-4 gap-1">
            {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-1 bg-gray-200 rounded" />)}
          </div>
        </div>
        <div className="border-t border-gray-700 pt-2">
          <div className="h-1.5 bg-gray-800 rounded w-1/4 mb-1.5" />
          {[1,2,3].map(i => <div key={i} className="h-1 bg-gray-200 rounded mb-1.5" />)}
        </div>
      </div>
    ),
  },
  {
    id: 'altacv',
    name: 'AltaCV',
    desc: 'Two-column with dot skill ratings',
    ring: 'ring-red-400/40',
    label: 'Overleaf',
    labelColor: 'bg-red-500/20 text-red-300',
    preview: (
      <div className="h-full">
        {/* Header bar */}
        <div className="bg-[#FAF5F0] border-b-2 border-[#8B3333] px-3 pt-3 pb-2 mb-0">
          <div className="h-2 bg-[#8B3333] rounded w-1/2 mb-1 opacity-80" />
          <div className="h-1 bg-[#B0522A] rounded w-1/3 opacity-60" />
        </div>
        {/* Two columns */}
        <div className="flex flex-1 h-[calc(100%-52px)]">
          {/* Left 60% */}
          <div className="w-[60%] border-r border-[#EDE0D4] p-2.5">
            <div className="h-px bg-[#C8A882] mb-2" />
            {[1,2,3,4].map(i => <div key={i} className="h-1 bg-gray-200 rounded mb-1.5" />)}
            <div className="h-px bg-[#C8A882] mb-2 mt-2" />
            <div className="h-1.5 bg-gray-700 rounded w-2/3 mb-1" />
            <div className="h-1 bg-[#8B3333] rounded w-1/2 mb-1 opacity-70" />
            {[1,2,3].map(i => <div key={i} className="h-1 bg-gray-200 rounded mb-1.5 ml-1" />)}
            <div className="h-1.5 bg-gray-700 rounded w-2/3 mb-1 mt-1" />
            <div className="h-1 bg-[#8B3333] rounded w-1/2 mb-1 opacity-70" />
            {[1,2].map(i => <div key={i} className="h-1 bg-gray-200 rounded mb-1.5 ml-1" />)}
          </div>
          {/* Right 40% */}
          <div className="w-[40%] p-2">
            <div className="h-px bg-[#C8A882] mb-2" />
            {[1,2,3].map(i => (
              <div key={i} className="flex items-center gap-1 mb-1.5">
                <div className="h-1 w-full bg-gray-200 rounded" />
                {/* Dot rating */}
                <div className="flex gap-0.5 flex-shrink-0">
                  {[1,2,3,4,5].map(d => (
                    <div key={d} className={`h-1.5 w-1.5 rounded-full ${d <= 4 - (i % 2) ? 'bg-[#8B3333]' : 'border border-gray-300'}`} />
                  ))}
                </div>
              </div>
            ))}
            <div className="h-px bg-[#C8A882] mb-2 mt-2" />
            <div className="h-1 bg-gray-300 rounded w-3/4 mb-1" />
            <div className="h-1 bg-[#8B3333] rounded w-1/2 mb-1 opacity-70" />
            <div className="h-1 bg-gray-200 rounded mb-1" />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'jakes',
    name: "Jake's",
    desc: 'Single-column LaTeX ATS classic',
    ring: 'ring-gray-500/40',
    label: 'ATS #1',
    labelColor: 'bg-gray-600/30 text-gray-300',
    preview: (
      <div className="p-3.5">
        {/* Centered header */}
        <div className="text-center mb-3">
          <div className="h-2.5 bg-gray-900 rounded mx-auto w-1/2 mb-1.5" />
          <div className="h-1 bg-gray-400 rounded mx-auto w-3/4" />
        </div>
        {/* Section with full rule */}
        {['Education','Experience','Skills'].map(sec => (
          <div key={sec} className="mb-2.5">
            <div className="h-1.5 bg-gray-900 rounded w-1/3 mb-0.5" />
            <div className="h-px bg-gray-900 mb-1.5" />
            <div className="flex justify-between mb-0.5">
              <div className="h-1 bg-gray-700 rounded w-2/5" />
              <div className="h-1 bg-gray-400 rounded w-1/4" />
            </div>
            <div className="h-1 bg-gray-400 rounded w-1/3 mb-1 italic" />
            {[1,2].map(i => <div key={i} className="h-1 bg-gray-200 rounded mb-1 ml-2" />)}
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'sixtyseconds',
    name: 'SixtySeconds',
    desc: 'Dark sidebar with skill progress bars',
    ring: 'ring-cyan-400/40',
    label: 'Overleaf',
    labelColor: 'bg-cyan-500/20 text-cyan-300',
    preview: (
      <div className="h-full flex rounded-md overflow-hidden">
        <div className="w-[30%] bg-[#1B2A3B] p-2 flex flex-col">
          <div className="h-2 bg-white/80 rounded w-4/5 mb-0.5" />
          <div className="h-1 bg-[#00B4D8] rounded w-2/3 mb-2.5" />
          <div className="h-0.5 bg-white/10 mb-1.5" />
          <div className="h-1 bg-[#00B4D8] rounded w-2/3 mb-1.5" />
          {[85,70,60,90].map((w, i) => (
            <div key={i} className="mb-1">
              <div className="h-0.5 bg-white/10 rounded mb-0.5 overflow-hidden">
                <div className="h-full bg-[#00B4D8] rounded" style={{ width: `${w}%` }} />
              </div>
            </div>
          ))}
          <div className="mt-1.5 h-1 bg-[#00B4D8] rounded w-2/3 mb-1.5" />
          {[1,2].map(i => <div key={i} className="h-0.5 bg-white/20 rounded mb-1" />)}
        </div>
        <div className="flex-1 p-2">
          <div className="flex items-center gap-1 mb-1.5">
            <div className="w-1 h-3 bg-[#00B4D8] rounded" />
            <div className="h-1.5 bg-gray-700 rounded w-2/3" />
          </div>
          <div className="h-px bg-gray-200 mb-1.5 ml-2" />
          {[1,2,3].map(i => <div key={i} className="h-1 bg-gray-200 rounded mb-1.5 ml-2" />)}
          <div className="flex items-center gap-1 mb-1.5">
            <div className="w-1 h-3 bg-[#00B4D8] rounded" />
            <div className="h-1.5 bg-gray-700 rounded w-1/2" />
          </div>
          <div className="h-px bg-gray-200 mb-1.5 ml-2" />
          {[1,2].map(i => <div key={i} className="h-1 bg-gray-200 rounded mb-1 ml-2" />)}
        </div>
      </div>
    ),
  },
  {
    id: 'berlin',
    name: 'Berlin',
    desc: 'Dark sidebar with avatar initials',
    ring: 'ring-slate-400/40',
    label: 'resume.io',
    labelColor: 'bg-slate-500/20 text-slate-300',
    preview: (
      <div className="h-full flex rounded-md overflow-hidden">
        {/* Dark sidebar */}
        <div className="w-[32%] bg-[#2B3240] p-2 flex flex-col items-center">
          {/* Avatar */}
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#4A6FA5] to-[#7EB8D4] flex items-center justify-center mb-1.5">
            <div className="h-1 w-4 bg-white/80 rounded" />
          </div>
          <div className="h-1.5 bg-white/80 rounded w-3/4 mb-0.5" />
          <div className="h-1 bg-[#7EB8D4] rounded w-1/2 mb-2.5" />
          <div className="h-px bg-white/10 w-full mb-2" />
          <div className="h-1 bg-[#7EB8D4] rounded w-2/3 mb-1.5 self-start" />
          {[1,2,3].map(i => <div key={i} className="h-1 bg-white/25 rounded mb-1 w-full" />)}
          <div className="h-1 bg-[#7EB8D4] rounded w-2/3 mb-1.5 self-start mt-1" />
          {[1,2].map(i => (
            <div key={i} className="flex flex-wrap gap-0.5 w-full mb-1">
              {[1,2].map(j => <div key={j} className="h-2.5 w-6 rounded-sm bg-[#7EB8D4]/20 border border-[#7EB8D4]/30" />)}
            </div>
          ))}
        </div>
        {/* Right content */}
        <div className="flex-1 p-2.5">
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="w-0.5 h-3 bg-[#2B3240] rounded" />
            <div className="h-1.5 bg-gray-700 rounded w-2/3" />
          </div>
          <div className="h-px bg-gray-200 mb-2" />
          {[1,2,3].map(i => <div key={i} className="h-1 bg-gray-200 rounded mb-1.5" />)}
          <div className="flex items-center gap-1.5 mb-1.5 mt-1">
            <div className="w-0.5 h-3 bg-[#2B3240] rounded" />
            <div className="h-1.5 bg-gray-700 rounded w-1/2" />
          </div>
          <div className="h-px bg-gray-200 mb-1.5" />
          <div className="h-1 bg-gray-700 rounded w-3/4 mb-0.5" />
          <div className="h-1 bg-[#7EB8D4] rounded w-1/2 mb-1" />
          {[1,2].map(i => <div key={i} className="h-1 bg-gray-200 rounded mb-1 ml-1.5" />)}
        </div>
      </div>
    ),
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    desc: 'Minimalist tech with skill squares',
    ring: 'ring-sky-400/40',
    label: 'resume.io',
    labelColor: 'bg-sky-500/20 text-sky-300',
    preview: (
      <div className="h-full flex flex-col">
        {/* Accent top bar */}
        <div className="h-1 bg-gradient-to-r from-[#0EA5E9] via-[#38BDF8] to-[#BAE6FD]" />
        {/* Header */}
        <div className="px-3 pt-2.5 pb-2 border-b border-gray-100">
          <div className="flex justify-between items-end">
            <div>
              <div className="h-2.5 bg-gray-900 rounded w-24 mb-1" />
              <div className="h-1 bg-[#0EA5E9] rounded w-16" />
            </div>
            <div className="text-right space-y-0.5">
              {[1,2,3].map(i => <div key={i} className="h-0.5 bg-gray-300 rounded w-12" />)}
            </div>
          </div>
        </div>
        {/* Two column body */}
        <div className="flex flex-1 px-2 pt-2 gap-2">
          {/* Left main */}
          <div className="flex-1">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="h-1 bg-[#0EA5E9] rounded w-12" />
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            {[1,2,3,4].map(i => <div key={i} className="h-1 bg-gray-200 rounded mb-1" />)}
            <div className="flex items-center gap-1.5 mb-1 mt-1.5">
              <div className="h-1 bg-[#0EA5E9] rounded w-14" />
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <div className="h-1.5 bg-gray-700 rounded w-2/3 mb-0.5" />
            {[1,2].map(i => <div key={i} className="h-1 bg-gray-200 rounded mb-1 ml-1" />)}
          </div>
          {/* Right sidebar */}
          <div className="w-[36%]">
            <div className="flex items-center gap-1 mb-1">
              <div className="h-1 bg-[#0EA5E9] rounded w-10" />
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            {[1,2,3].map(i => (
              <div key={i} className="flex justify-between items-center mb-1">
                <div className="h-1 bg-gray-200 rounded w-2/3" />
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(d => (
                    <div key={d} className={`h-1.5 w-1.5 rounded-sm ${d <= 4 ? 'bg-[#0EA5E9]' : 'bg-gray-200'}`} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'vienna',
    name: 'Vienna',
    desc: 'Bold colored header, two-column serif',
    ring: 'ring-rose-400/40',
    label: 'resume.io',
    labelColor: 'bg-rose-500/20 text-rose-300',
    preview: (
      <div className="h-full flex flex-col rounded-md overflow-hidden">
        {/* Bold header */}
        <div className="bg-[#6B2737] px-3 pt-3 pb-2.5 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 h-14 w-14 rounded-full bg-white/5" />
          <div className="h-2.5 bg-white/90 rounded w-1/2 mb-1" />
          <div className="h-1 bg-white/50 rounded w-1/3 mb-1.5" />
          <div className="flex gap-2">
            {[1,2,3].map(i => <div key={i} className="h-0.5 bg-white/30 rounded w-12" />)}
          </div>
        </div>
        {/* Two column body */}
        <div className="flex flex-1">
          {/* Left blush */}
          <div className="w-[36%] bg-[#F9F4F5] p-2">
            <div className="h-1 bg-[#6B2737]/60 rounded w-2/3 mb-0.5" />
            <div className="h-px bg-[#C96B82]/30 mb-1.5" />
            {[1,2,3].map(i => (
              <div key={i} className="h-2.5 rounded mb-1 px-1 py-0.5" style={{ background: 'rgba(107,39,55,0.08)', border: '1px solid rgba(107,39,55,0.15)' }}>
                <div className="h-1 bg-[#9B3A52]/60 rounded w-3/4" />
              </div>
            ))}
            <div className="h-1 bg-[#6B2737]/60 rounded w-2/3 mb-0.5 mt-2" />
            <div className="h-px bg-[#C96B82]/30 mb-1.5" />
            <div className="h-1 bg-gray-500 rounded w-3/4 mb-0.5" />
            <div className="h-1 bg-[#9B3A52]/70 rounded w-2/3 mb-0.5" />
            <div className="h-1 bg-gray-300 rounded w-1/2" />
          </div>
          {/* Right white */}
          <div className="flex-1 p-2">
            <div className="flex items-center gap-1 mb-1">
              <div className="w-3 h-0.5 bg-[#6B2737] rounded" />
              <div className="h-1.5 bg-gray-700 rounded w-2/3" />
            </div>
            {[1,2,3].map(i => <div key={i} className="h-1 bg-gray-200 rounded mb-1.5" />)}
            <div className="h-px bg-gray-100 mb-1.5" />
            <div className="flex items-center gap-1 mb-1">
              <div className="w-3 h-0.5 bg-[#6B2737] rounded" />
              <div className="h-1.5 bg-gray-700 rounded w-1/2" />
            </div>
            <div className="h-1 bg-gray-700 rounded w-3/4 mb-0.5" />
            <div className="h-1 bg-[#9B3A52]/70 rounded w-1/2 mb-1" />
            {[1,2].map(i => <div key={i} className="h-1 bg-gray-200 rounded mb-1 ml-1.5" />)}
          </div>
        </div>
      </div>
    ),
  },
]

export function TemplateShowcase() {
  return (
    <section id="templates" className="relative bg-[#06060F] py-28">
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-px w-full max-w-5xl bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
      <div className="absolute inset-0 bg-grid-pattern" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-1.5 text-sm font-medium text-slate-400">
            <Layout className="h-3.5 w-3.5 text-violet-400" />
            15 templates included
          </div>
          <h2 className="font-display mb-4 text-4xl font-bold tracking-tight text-slate-50 sm:text-5xl">
            Choose your{' '}
            <span className="gradient-text">perfect template</span>
          </h2>
          <p className="mx-auto max-w-xl text-lg text-slate-400">
            All templates are ATS-friendly and optimized for both screen and print.
          </p>
        </div>

        {/* Grid */}
        <div className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {templates.map((t) => (
            <Link href="/register" key={t.id} className="group block">
              <div className={`relative aspect-[3/4] mb-3 overflow-hidden rounded-2xl border border-white/[0.07] bg-white shadow-lg transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:ring-2 ${t.ring}`}>
                {t.preview}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/10" />
                <div className="absolute inset-x-0 bottom-0 flex translate-y-2 items-center justify-center pb-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="inline-flex items-center gap-1 rounded-lg bg-gray-900/90 px-3 py-1.5 text-xs font-semibold text-white shadow-lg backdrop-blur-sm">
                    Use template
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>

                {/* Top-right label */}
                <div className="absolute right-2 top-2">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${t.labelColor}`}>
                    {t.label}
                  </span>
                </div>
              </div>
              <div className="px-0.5">
                <p className="text-sm font-semibold text-slate-200">{t.name}</p>
                <p className="mt-0.5 text-xs text-slate-500">{t.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/register">
            <button className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-6 py-3.5 text-base font-semibold text-slate-200 transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-500/30 hover:bg-violet-500/[0.1] hover:shadow-xl">
              Start with any template — it&apos;s free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}
