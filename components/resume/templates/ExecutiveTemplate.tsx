import { ResumeData } from '@/types/resume'

interface Props { data: ResumeData; scale?: number }

const NAVY = '#1e3558'
const ACCENT = '#4f8ef7'

function SideSection({ title }: { title: string }) {
  return (
    <p style={{ fontSize: '7.5px', fontWeight: '700', textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: ACCENT, marginBottom: '7px', marginTop: '18px' }}>{title}</p>
  )
}

function MainSection({ title }: { title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', marginTop: '18px' }}>
      <div style={{ width: '3px', height: '14px', background: ACCENT, borderRadius: '2px', flexShrink: 0 }} />
      <h2 style={{ fontSize: '9.5px', fontWeight: '700', textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: NAVY }}>{title}</h2>
    </div>
  )
}

export function ExecutiveTemplate({ data, scale = 1 }: Props) {
  const { personalInfo: p, summary, experience, education, skills, projects, certifications } = data

  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '10px', lineHeight: '1.5', color: '#1a1a1a', background: 'white', minHeight: '297mm', display: 'flex' }}>

      {/* Left Sidebar */}
      <div style={{ width: '195px', minWidth: '195px', background: NAVY, color: 'white', padding: '28px 18px', minHeight: '297mm' }}>
        <div style={{ paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.15)', marginBottom: '4px' }}>
          <h1 style={{ fontSize: '15px', fontWeight: '700', lineHeight: '1.25', color: 'white', marginBottom: '4px' }}>{p.fullName || 'Your Name'}</h1>
          {p.jobTitle && <p style={{ fontSize: '8.5px', color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>{p.jobTitle}</p>}
        </div>

        <SideSection title="Contact" />
        {[p.location, p.phone, p.email, p.linkedin, p.github, p.website].filter(Boolean).map((v, i) => (
          <p key={i} style={{ fontSize: '8px', color: 'rgba(255,255,255,0.82)', marginBottom: '4px', wordBreak: 'break-all' as const }}>{v}</p>
        ))}

        {skills.length > 0 && (
          <>
            <SideSection title="Skills" />
            {skills.map(g => (
              <div key={g.id} style={{ marginBottom: '7px' }}>
                {g.category && <p style={{ fontSize: '7px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' as const, letterSpacing: '0.5px', marginBottom: '2px' }}>{g.category}</p>}
                {g.skills.map((s, i) => (
                  <p key={i} style={{ fontSize: '8px', color: 'rgba(255,255,255,0.82)', marginBottom: '2px' }}>• {s}</p>
                ))}
              </div>
            ))}
          </>
        )}

        {certifications.length > 0 && (
          <>
            <SideSection title="Certifications" />
            {certifications.map(c => (
              <div key={c.id} style={{ marginBottom: '7px' }}>
                <p style={{ fontSize: '8px', color: 'rgba(255,255,255,0.9)', fontWeight: '600' }}>{c.name}</p>
                <p style={{ fontSize: '7.5px', color: 'rgba(255,255,255,0.55)' }}>{c.issuer}{c.date ? ` · ${c.date}` : ''}</p>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '28px 28px' }}>
        {summary && (
          <div style={{ marginBottom: '4px' }}>
            <MainSection title="Professional Summary" />
            <p style={{ fontSize: '9.5px', lineHeight: '1.7', color: '#444' }}>{summary}</p>
          </div>
        )}

        {experience.length > 0 && (
          <div style={{ marginBottom: '4px' }}>
            <MainSection title="Experience" />
            {experience.map(exp => (
              <div key={exp.id} style={{ marginBottom: '13px', paddingLeft: '11px', borderLeft: '2px solid #e5e7eb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: '700', fontSize: '10px' }}>{exp.position}</span>
                  <span style={{ fontSize: '8.5px', color: '#6b7280', whiteSpace: 'nowrap' as const }}>{exp.startDate}{exp.startDate ? ' – ' : ''}{exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <p style={{ fontSize: '8.5px', color: ACCENT, fontWeight: '600', marginBottom: '4px' }}>{exp.company}</p>
                {exp.bullets.filter(b => b.trim()).map((b, i) => (
                  <p key={i} style={{ fontSize: '8.5px', lineHeight: '1.65', marginBottom: '2px', color: '#444' }}>• {b}</p>
                ))}
              </div>
            ))}
          </div>
        )}

        {education.length > 0 && (
          <div style={{ marginBottom: '4px' }}>
            <MainSection title="Education" />
            {education.map(edu => (
              <div key={edu.id} style={{ marginBottom: '10px', paddingLeft: '11px', borderLeft: '2px solid #e5e7eb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: '700', fontSize: '10px' }}>{edu.institution}</span>
                  <span style={{ fontSize: '8.5px', color: '#6b7280', whiteSpace: 'nowrap' as const }}>{edu.startDate}{edu.startDate && edu.endDate ? ' – ' : ''}{edu.endDate}</span>
                </div>
                <p style={{ fontSize: '9px', color: '#555' }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}{edu.honors ? `, ${edu.honors}` : ''}</p>
                {edu.gpa && <p style={{ fontSize: '8.5px', color: '#888' }}>GPA: {edu.gpa}</p>}
              </div>
            ))}
          </div>
        )}

        {projects.length > 0 && (
          <div>
            <MainSection title="Projects" />
            {projects.map(proj => (
              <div key={proj.id} style={{ marginBottom: '10px', paddingLeft: '11px', borderLeft: '2px solid #e5e7eb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: '700', fontSize: '10px' }}>{proj.name}</span>
                  {proj.technologies.length > 0 && <span style={{ fontSize: '8px', color: '#888' }}>{proj.technologies.join(', ')}</span>}
                </div>
                <p style={{ fontSize: '8.5px', marginTop: '2px', lineHeight: '1.6', color: '#444' }}>{proj.description}</p>
                {(proj.url || proj.github) && (
                  <p style={{ fontSize: '8px', color: ACCENT, marginTop: '1px' }}>{[proj.url, proj.github].filter(Boolean).join('  ·  ')}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
