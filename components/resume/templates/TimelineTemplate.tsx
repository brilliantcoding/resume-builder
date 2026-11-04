import { ResumeData } from '@/types/resume'

interface Props { data: ResumeData; scale?: number }

const TEAL = '#0d9488'
const LIGHT_TEAL = '#ccfbf1'

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' as const, letterSpacing: '2px', color: TEAL, marginBottom: '12px', marginTop: '20px' }}>{children}</h2>
  )
}

function TimelineItem({ left, right, sub, children }: { left: string; right: string; sub?: string; children?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: '0', marginBottom: '14px' }}>
      {/* Timeline spine */}
      <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', marginRight: '14px', flexShrink: 0 }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: TEAL, flexShrink: 0, marginTop: '3px' }} />
        <div style={{ width: '2px', flex: 1, background: LIGHT_TEAL, minHeight: '20px' }} />
      </div>
      <div style={{ flex: 1, paddingBottom: '4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontWeight: '700', fontSize: '10.5px' }}>{left}</span>
          <span style={{ fontSize: '8.5px', color: '#6b7280', whiteSpace: 'nowrap' as const }}>{right}</span>
        </div>
        {sub && <p style={{ fontSize: '9px', color: TEAL, fontWeight: '600', marginBottom: '3px' }}>{sub}</p>}
        {children}
      </div>
    </div>
  )
}

export function TimelineTemplate({ data, scale = 1 }: Props) {
  const { personalInfo: p, summary, experience, education, skills, projects, certifications } = data

  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', fontFamily: "'Segoe UI', Arial, sans-serif", fontSize: '10px', lineHeight: '1.5', color: '#1a1a1a', background: 'white', padding: '36px 44px', minHeight: '297mm' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '6px', paddingBottom: '14px', borderBottom: `3px solid ${TEAL}` }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', letterSpacing: '-0.5px', color: '#111', marginBottom: '3px' }}>{p.fullName || 'Your Name'}</h1>
          {p.jobTitle && <p style={{ fontSize: '11px', color: TEAL, fontWeight: '600' }}>{p.jobTitle}</p>}
        </div>
        <div style={{ textAlign: 'right' as const }}>
          {[p.email, p.phone, p.location].filter(Boolean).map((v, i) => (
            <p key={i} style={{ fontSize: '8.5px', color: '#555', marginBottom: '2px' }}>{v}</p>
          ))}
          {[p.linkedin, p.github, p.website].filter(Boolean).map((v, i) => (
            <p key={i} style={{ fontSize: '8.5px', color: TEAL, marginBottom: '2px' }}>{v}</p>
          ))}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div style={{ marginBottom: '4px' }}>
          <SectionTitle>Summary</SectionTitle>
          <p style={{ fontSize: '9.5px', lineHeight: '1.7', color: '#444', marginLeft: '24px' }}>{summary}</p>
        </div>
      )}

      {/* Experience with timeline */}
      {experience.length > 0 && (
        <div style={{ marginBottom: '4px' }}>
          <SectionTitle>Experience</SectionTitle>
          {experience.map(exp => (
            <TimelineItem
              key={exp.id}
              left={exp.position}
              right={`${exp.startDate}${exp.startDate ? ' – ' : ''}${exp.current ? 'Present' : exp.endDate}`}
              sub={exp.company}
            >
              {exp.bullets.filter(b => b.trim()).map((b, i) => (
                <p key={i} style={{ fontSize: '8.5px', lineHeight: '1.65', marginBottom: '2px', color: '#444' }}>• {b}</p>
              ))}
            </TimelineItem>
          ))}
        </div>
      )}

      {/* Education with timeline */}
      {education.length > 0 && (
        <div style={{ marginBottom: '4px' }}>
          <SectionTitle>Education</SectionTitle>
          {education.map(edu => (
            <TimelineItem
              key={edu.id}
              left={edu.institution}
              right={`${edu.startDate}${edu.startDate && edu.endDate ? ' – ' : ''}${edu.endDate}`}
              sub={`${edu.degree}${edu.field ? ` in ${edu.field}` : ''}${edu.honors ? `, ${edu.honors}` : ''}`}
            >
              {edu.gpa && <p style={{ fontSize: '8.5px', color: '#888' }}>GPA: {edu.gpa}</p>}
            </TimelineItem>
          ))}
        </div>
      )}

      {/* Skills as tag pills */}
      {skills.length > 0 && (
        <div style={{ marginBottom: '4px' }}>
          <SectionTitle>Skills</SectionTitle>
          <div style={{ marginLeft: '24px' }}>
            {skills.map(g => (
              <div key={g.id} style={{ marginBottom: '8px' }}>
                {g.category && <p style={{ fontSize: '8.5px', fontWeight: '700', color: '#333', marginBottom: '4px' }}>{g.category}</p>}
                <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '4px' }}>
                  {g.skills.map((s, i) => (
                    <span key={i} style={{ fontSize: '8px', background: LIGHT_TEAL, color: TEAL, padding: '2px 8px', borderRadius: '20px', fontWeight: '600', border: `1px solid ${TEAL}22` }}>{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div style={{ marginBottom: '4px' }}>
          <SectionTitle>Certifications</SectionTitle>
          {certifications.map(c => (
            <TimelineItem key={c.id} left={c.name} right={c.date} sub={c.issuer} />
          ))}
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div>
          <SectionTitle>Projects</SectionTitle>
          {projects.map(proj => (
            <TimelineItem
              key={proj.id}
              left={proj.name}
              right={proj.technologies.join(', ')}
            >
              <p style={{ fontSize: '8.5px', lineHeight: '1.6', color: '#444' }}>{proj.description}</p>
            </TimelineItem>
          ))}
        </div>
      )}
    </div>
  )
}
