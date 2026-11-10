import { ResumeData } from '@/types/resume'

interface Props { data: ResumeData; scale?: number }

const CRIMSON = '#b91c1c'
const CRIMSON_LIGHT = '#fee2e2'

function LeftSection({ title }: { title: string }) {
  return (
    <div style={{ background: CRIMSON, padding: '4px 10px', marginBottom: '8px', marginTop: '14px', borderRadius: '3px' }}>
      <h3 style={{ fontSize: '8px', fontWeight: '700', textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: 'white' }}>{title}</h3>
    </div>
  )
}

function RightSection({ title }: { title: string }) {
  return (
    <div style={{ borderBottom: `2px solid ${CRIMSON}`, marginBottom: '8px', marginTop: '14px', paddingBottom: '3px' }}>
      <h2 style={{ fontSize: '9.5px', fontWeight: '700', textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: CRIMSON }}>{title}</h2>
    </div>
  )
}

export function CompactTemplate({ data, scale = 1 }: Props) {
  const { personalInfo: p, summary, experience, education, skills, projects, certifications } = data

  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '10px', lineHeight: '1.5', color: '#1a1a1a', background: 'white', minHeight: '297mm' }}>

      {/* Top header bar */}
      <div style={{ background: CRIMSON, padding: '20px 28px', color: 'white' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', letterSpacing: '0.5px', marginBottom: '3px', color: 'white' }}>{p.fullName || 'Your Name'}</h1>
        {p.jobTitle && <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.8)', fontWeight: '400' }}>{p.jobTitle}</p>}
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '14px', marginTop: '8px' }}>
          {[p.phone, p.email, p.location, p.linkedin, p.github, p.website].filter(Boolean).map((v, i) => (
            <span key={i} style={{ fontSize: '8px', color: 'rgba(255,255,255,0.85)' }}>{v}</span>
          ))}
        </div>
      </div>

      {/* Two-column body */}
      <div style={{ display: 'flex', minHeight: 'calc(297mm - 80px)' }}>

        {/* Left column — 36% */}
        <div style={{ width: '36%', minWidth: '36%', background: '#f4fbf6', borderRight: '1px solid #d6f1df', padding: '16px 14px' }}>

          {skills.length > 0 && (
            <>
              <LeftSection title="Skills" />
              {skills.map(g => (
                <div key={g.id} style={{ marginBottom: '8px' }}>
                  {g.category && <p style={{ fontSize: '7.5px', fontWeight: '700', color: CRIMSON, textTransform: 'uppercase' as const, letterSpacing: '0.5px', marginBottom: '3px' }}>{g.category}</p>}
                  <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '3px' }}>
                    {g.skills.map((s, i) => (
                      <span key={i} style={{ fontSize: '7.5px', background: CRIMSON_LIGHT, color: CRIMSON, padding: '2px 6px', borderRadius: '3px', fontWeight: '600' }}>{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}

          {education.length > 0 && (
            <>
              <LeftSection title="Education" />
              {education.map(edu => (
                <div key={edu.id} style={{ marginBottom: '10px' }}>
                  <p style={{ fontWeight: '700', fontSize: '8.5px', color: '#1a1a1a' }}>{edu.institution}</p>
                  <p style={{ fontSize: '7.5px', color: '#555', lineHeight: '1.5' }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
                  <p style={{ fontSize: '7.5px', color: '#888' }}>{edu.startDate}{edu.startDate && edu.endDate ? ' – ' : ''}{edu.endDate}</p>
                  {edu.gpa && <p style={{ fontSize: '7px', color: '#aaa' }}>GPA: {edu.gpa}</p>}
                  {edu.honors && <p style={{ fontSize: '7px', color: '#aaa' }}>{edu.honors}</p>}
                </div>
              ))}
            </>
          )}

          {certifications.length > 0 && (
            <>
              <LeftSection title="Certifications" />
              {certifications.map(c => (
                <div key={c.id} style={{ marginBottom: '8px' }}>
                  <p style={{ fontWeight: '700', fontSize: '8px', color: '#1a1a1a' }}>{c.name}</p>
                  <p style={{ fontSize: '7.5px', color: '#888' }}>{c.issuer}{c.date ? ` · ${c.date}` : ''}</p>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Right column — 64% */}
        <div style={{ flex: 1, padding: '16px 20px' }}>

          {summary && (
            <div style={{ marginBottom: '4px' }}>
              <RightSection title="Summary" />
              <p style={{ fontSize: '9px', lineHeight: '1.7', color: '#444' }}>{summary}</p>
            </div>
          )}

          {experience.length > 0 && (
            <div style={{ marginBottom: '4px' }}>
              <RightSection title="Experience" />
              {experience.map(exp => (
                <div key={exp.id} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontWeight: '700', fontSize: '9.5px' }}>{exp.position}</span>
                    <span style={{ fontSize: '8px', color: '#6b7280', whiteSpace: 'nowrap' as const }}>{exp.startDate}{exp.startDate ? ' – ' : ''}{exp.current ? 'Present' : exp.endDate}</span>
                  </div>
                  <p style={{ fontSize: '8.5px', color: CRIMSON, fontWeight: '600', marginBottom: '3px' }}>{exp.company}</p>
                  {exp.bullets.filter(b => b.trim()).map((b, i) => (
                    <p key={i} style={{ fontSize: '8px', lineHeight: '1.6', marginBottom: '1px', color: '#444', paddingLeft: '8px' }}>• {b}</p>
                  ))}
                </div>
              ))}
            </div>
          )}

          {projects.length > 0 && (
            <div>
              <RightSection title="Projects" />
              {projects.map(proj => (
                <div key={proj.id} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontWeight: '700', fontSize: '9.5px' }}>{proj.name}</span>
                    {proj.technologies.length > 0 && <span style={{ fontSize: '7.5px', color: '#888' }}>{proj.technologies.join(', ')}</span>}
                  </div>
                  <p style={{ fontSize: '8px', marginTop: '2px', lineHeight: '1.6', color: '#444' }}>{proj.description}</p>
                  {(proj.url || proj.github) && (
                    <p style={{ fontSize: '7.5px', color: CRIMSON, marginTop: '1px' }}>{[proj.url, proj.github].filter(Boolean).join('  ·  ')}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
