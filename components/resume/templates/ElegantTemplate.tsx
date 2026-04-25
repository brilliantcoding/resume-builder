import { ResumeData } from '@/types/resume'

interface Props { data: ResumeData; scale?: number }

const GOLD = '#92712a'
const GOLD_LIGHT = '#f5efe0'

export function ElegantTemplate({ data, scale = 1 }: Props) {
  const { personalInfo: p, summary, experience, education, skills, projects, certifications } = data

  const SectionTitle = ({ children }: { children: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', marginTop: '22px' }}>
      <div style={{ flex: 1, height: '1px', background: GOLD, opacity: 0.4 }} />
      <h2 style={{ fontSize: '9px', fontWeight: '400', textTransform: 'uppercase' as const, letterSpacing: '3px', color: GOLD, whiteSpace: 'nowrap' as const }}>{children}</h2>
      <div style={{ flex: 1, height: '1px', background: GOLD, opacity: 0.4 }} />
    </div>
  )

  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', fontFamily: 'Palatino Linotype, Palatino, Georgia, serif', fontSize: '10px', lineHeight: '1.6', color: '#2c2c2c', background: 'white', padding: '48px 52px', minHeight: '297mm' }}>

      {/* Header */}
      <div style={{ textAlign: 'center' as const, marginBottom: '8px' }}>
        <h1 style={{ fontSize: '30px', fontWeight: '300', letterSpacing: '6px', textTransform: 'uppercase' as const, color: '#1a1a1a', marginBottom: '6px' }}>{p.fullName || 'Your Name'}</h1>
        {p.jobTitle && <p style={{ fontSize: '10px', color: GOLD, letterSpacing: '2px', textTransform: 'uppercase' as const, fontWeight: '400', marginBottom: '10px' }}>{p.jobTitle}</p>}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' as const, gap: '16px' }}>
          {[p.phone, p.email, p.location, p.linkedin, p.github].filter(Boolean).map((v, i) => (
            <span key={i} style={{ fontSize: '8.5px', color: '#666', letterSpacing: '0.5px' }}>{v}</span>
          ))}
        </div>
        <div style={{ width: '60px', height: '2px', background: GOLD, margin: '16px auto 0' }} />
      </div>

      {/* Summary */}
      {summary && (
        <div style={{ marginBottom: '4px' }}>
          <SectionTitle>Profile</SectionTitle>
          <p style={{ fontSize: '9.5px', lineHeight: '1.85', color: '#444', textAlign: 'justify' as const }}>{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div style={{ marginBottom: '4px' }}>
          <SectionTitle>Experience</SectionTitle>
          {experience.map(exp => (
            <div key={exp.id} style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1px' }}>
                <span style={{ fontWeight: '700', fontSize: '10.5px', letterSpacing: '0.3px' }}>{exp.position}</span>
                <span style={{ fontSize: '8.5px', color: '#888', fontStyle: 'italic' }}>{exp.startDate}{exp.startDate ? ' – ' : ''}{exp.current ? 'Present' : exp.endDate}</span>
              </div>
              <p style={{ fontSize: '9px', color: GOLD, fontStyle: 'italic', marginBottom: '5px' }}>{exp.company}</p>
              {exp.bullets.filter(b => b.trim()).map((b, i) => (
                <p key={i} style={{ fontSize: '9px', lineHeight: '1.7', marginBottom: '2px', paddingLeft: '14px', color: '#444', textIndent: '-6px' }}>— {b}</p>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div style={{ marginBottom: '4px' }}>
          <SectionTitle>Education</SectionTitle>
          {education.map(edu => (
            <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px' }}>
              <div>
                <p style={{ fontWeight: '700', fontSize: '10px' }}>{edu.institution}</p>
                <p style={{ fontSize: '9px', color: '#666', fontStyle: 'italic' }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}{edu.honors ? `, ${edu.honors}` : ''}{edu.gpa ? ` — GPA ${edu.gpa}` : ''}</p>
              </div>
              <span style={{ fontSize: '8.5px', color: '#888', fontStyle: 'italic', whiteSpace: 'nowrap' as const }}>{edu.startDate}{edu.startDate && edu.endDate ? ' – ' : ''}{edu.endDate}</span>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div style={{ marginBottom: '4px' }}>
          <SectionTitle>Skills & Expertise</SectionTitle>
          {skills.map(g => (
            <div key={g.id} style={{ display: 'flex', gap: '8px', marginBottom: '5px' }}>
              {g.category && <span style={{ fontSize: '9px', fontWeight: '700', color: GOLD, minWidth: '110px', fontStyle: 'italic' }}>{g.category}:</span>}
              <span style={{ fontSize: '9px', color: '#444', lineHeight: '1.6' }}>{g.skills.join('  ·  ')}</span>
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div style={{ marginBottom: '4px' }}>
          <SectionTitle>Certifications</SectionTitle>
          {certifications.map(c => (
            <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
              <div>
                <span style={{ fontWeight: '700', fontSize: '9.5px' }}>{c.name}</span>
                {c.issuer && <span style={{ fontSize: '8.5px', color: '#888', fontStyle: 'italic' }}> — {c.issuer}</span>}
              </div>
              {c.date && <span style={{ fontSize: '8.5px', color: '#888', fontStyle: 'italic' }}>{c.date}</span>}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div>
          <SectionTitle>Projects</SectionTitle>
          {projects.map(proj => (
            <div key={proj.id} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                <span style={{ fontWeight: '700', fontSize: '10px', fontStyle: 'italic' }}>{proj.name}</span>
                {proj.technologies.length > 0 && <span style={{ fontSize: '8px', color: '#888' }}>{proj.technologies.join(' · ')}</span>}
              </div>
              <p style={{ fontSize: '9px', lineHeight: '1.7', color: '#444' }}>{proj.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
