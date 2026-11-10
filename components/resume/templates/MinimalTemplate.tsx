import { ResumeData } from '@/types/resume'

interface Props { data: ResumeData; scale?: number }

export function MinimalTemplate({ data, scale = 1 }: Props) {
  const { personalInfo: p, summary, experience, education, skills, projects, certifications } = data

  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontSize: '10px', lineHeight: '1.6', color: '#333', background: 'white', padding: '40px 44px', minHeight: '297mm' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '300', letterSpacing: '-0.5px', color: '#0f172a', marginBottom: '4px' }}>{p.fullName || 'Your Name'}</h1>
        {p.jobTitle && <p style={{ fontSize: '12px', color: '#0d9488', fontWeight: '500', marginBottom: '10px' }}>{p.jobTitle}</p>}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '9px', color: '#64748b' }}>
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.location && <span>{p.location}</span>}
          {p.linkedin && <span>{p.linkedin}</span>}
          {p.github && <span>{p.github}</span>}
          {p.website && <span>{p.website}</span>}
        </div>
        <div style={{ height: '2px', background: '#0d9488', marginTop: '14px' }} />
      </div>

      {/* Summary */}
      {summary && (
        <div style={{ marginBottom: '24px' }}>
          <p style={{ fontSize: '9.5px', lineHeight: '1.8', color: '#475569' }}>{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '2px', color: '#0d9488', marginBottom: '12px' }}>Experience</h2>
          {experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: '16px', paddingLeft: '12px', borderLeft: '2px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                <span style={{ fontWeight: '600', fontSize: '10.5px' }}>{exp.position}</span>
                <span style={{ fontSize: '8.5px', color: '#94a3b8' }}>{exp.startDate}{exp.startDate ? '–' : ''}{exp.current ? 'Present' : exp.endDate}</span>
              </div>
              <p style={{ fontSize: '9px', color: '#0d9488', marginBottom: '5px' }}>{exp.company}</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {exp.bullets.filter(b => b.trim()).map((b, i) => (
                  <li key={i} style={{ fontSize: '9px', lineHeight: '1.7', color: '#475569', marginBottom: '2px', paddingLeft: '10px', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 0, color: '#0d9488' }}>›</span>{b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: '32px' }}>
        <div style={{ flex: 1 }}>
          {/* Education */}
          {education.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '2px', color: '#0d9488', marginBottom: '12px' }}>Education</h2>
              {education.map((edu) => (
                <div key={edu.id} style={{ marginBottom: '10px' }}>
                  <p style={{ fontWeight: '600', fontSize: '10px' }}>{edu.institution}</p>
                  <p style={{ fontSize: '9px', color: '#64748b' }}>{edu.degree}{edu.field ? ` · ${edu.field}` : ''}</p>
                  <p style={{ fontSize: '8.5px', color: '#94a3b8' }}>{edu.startDate}{edu.startDate && edu.endDate ? ' – ' : ''}{edu.endDate}{edu.gpa ? ` · GPA ${edu.gpa}` : ''}{edu.honors ? ` · ${edu.honors}` : ''}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ width: '180px' }}>
          {/* Skills */}
          {skills.length > 0 && (
            <div>
              <h2 style={{ fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '2px', color: '#0d9488', marginBottom: '12px' }}>Skills</h2>
              {skills.map((group) => (
                <div key={group.id} style={{ marginBottom: '8px' }}>
                  {group.category && <p style={{ fontSize: '9px', fontWeight: '600', marginBottom: '4px', color: '#334155' }}>{group.category}</p>}
                  <p style={{ fontSize: '8.5px', color: '#64748b', lineHeight: '1.6' }}>{group.skills.join(' · ')}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Projects */}
      {projects.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '2px', color: '#0d9488', marginBottom: '12px' }}>Projects</h2>
          {projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: '10px' }}>
              <span style={{ fontWeight: '600', fontSize: '10px' }}>{proj.name}</span>
              {proj.technologies.length > 0 && <span style={{ fontSize: '8.5px', color: '#94a3b8', marginLeft: '8px' }}>{proj.technologies.join(', ')}</span>}
              <p style={{ fontSize: '9px', color: '#475569', marginTop: '2px' }}>{proj.description}</p>
              {(proj.url || proj.github) && (
                <p style={{ fontSize: '8.5px', color: '#0d9488', marginTop: '1px' }}>{[proj.url, proj.github].filter(Boolean).join('  ·  ')}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div>
          <h2 style={{ fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '2px', color: '#0d9488', marginBottom: '12px' }}>Certifications</h2>
          {certifications.map((cert) => (
            <div key={cert.id} style={{ marginBottom: '8px' }}>
              <p style={{ fontWeight: '600', fontSize: '10px' }}>{cert.name}</p>
              {(cert.issuer || cert.date) && (
                <p style={{ fontSize: '8.5px', color: '#94a3b8' }}>{cert.issuer}{cert.issuer && cert.date ? ' · ' : ''}{cert.date}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
