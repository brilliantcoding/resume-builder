import { ResumeData } from '@/types/resume'

interface Props { data: ResumeData; scale?: number }

export function CreativeTemplate({ data, scale = 1 }: Props) {
  const { personalInfo: p, summary, experience, education, skills, projects, certifications } = data

  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', fontFamily: "'Segoe UI', system-ui, sans-serif", fontSize: '10px', lineHeight: '1.5', color: '#1a1a2e', background: 'white', minHeight: '297mm' }}>
      {/* Bold header */}
      <div style={{ background: '#e11d48', padding: '28px 32px 20px', color: 'white' }}>
        <h1 style={{ fontSize: '30px', fontWeight: '800', letterSpacing: '-1px', marginBottom: '2px' }}>{p.fullName || 'Your Name'}</h1>
        {p.jobTitle && <p style={{ fontSize: '13px', fontWeight: '400', opacity: 0.9, marginBottom: '12px' }}>{p.jobTitle}</p>}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', fontSize: '9px', opacity: 0.85 }}>
          {p.email && <span>✉ {p.email}</span>}
          {p.phone && <span>📞 {p.phone}</span>}
          {p.location && <span>📍 {p.location}</span>}
          {p.linkedin && <span>🔗 {p.linkedin}</span>}
          {p.github && <span>⌥ {p.github}</span>}
          {p.website && <span>🌐 {p.website}</span>}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0' }}>
        {/* Left column */}
        <div style={{ flex: 1, padding: '24px 20px 24px 32px' }}>
          {/* Summary */}
          {summary && (
            <div style={{ marginBottom: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ width: '3px', height: '16px', background: '#e11d48', borderRadius: '2px' }} />
                <h2 style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>About</h2>
              </div>
              <p style={{ fontSize: '9.5px', lineHeight: '1.7', color: '#374151' }}>{summary}</p>
            </div>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <div style={{ marginBottom: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <div style={{ width: '3px', height: '16px', background: '#e11d48', borderRadius: '2px' }} />
                <h2 style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Experience</h2>
              </div>
              {experience.map((exp) => (
                <div key={exp.id} style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <p style={{ fontWeight: '700', fontSize: '11px' }}>{exp.position}</p>
                    <p style={{ fontSize: '8.5px', color: '#9ca3af', fontStyle: 'italic' }}>{exp.startDate}{exp.startDate ? ' – ' : ''}{exp.current ? 'Present' : exp.endDate}</p>
                  </div>
                  <p style={{ fontSize: '9px', color: '#e11d48', fontWeight: '600', marginBottom: '5px' }}>{exp.company}</p>
                  <ul style={{ paddingLeft: '12px', margin: 0 }}>
                    {exp.bullets.filter(b => b.trim()).map((b, i) => (
                      <li key={i} style={{ fontSize: '9px', color: '#4b5563', lineHeight: '1.6', marginBottom: '2px' }}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <div style={{ width: '3px', height: '16px', background: '#e11d48', borderRadius: '2px' }} />
                <h2 style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Projects</h2>
              </div>
              {projects.map((proj) => (
                <div key={proj.id} style={{ marginBottom: '10px' }}>
                  <p style={{ fontWeight: '700', fontSize: '10px' }}>{proj.name}</p>
                  {proj.technologies.length > 0 && <p style={{ fontSize: '8px', color: '#9ca3af', marginBottom: '2px' }}>{proj.technologies.join(' · ')}</p>}
                  <p style={{ fontSize: '9px', color: '#4b5563' }}>{proj.description}</p>
                  {(proj.url || proj.github) && (
                    <p style={{ fontSize: '8px', color: '#e11d48', marginTop: '2px' }}>{[proj.url, proj.github].filter(Boolean).join('  ·  ')}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div style={{ width: '200px', background: '#fef2f2', padding: '24px 20px', borderLeft: '1px solid #fecdd3' }}>
          {/* Skills */}
          {skills.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <div style={{ width: '3px', height: '14px', background: '#e11d48', borderRadius: '2px' }} />
                <h2 style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Skills</h2>
              </div>
              {skills.map((group) => (
                <div key={group.id} style={{ marginBottom: '10px' }}>
                  {group.category && <p style={{ fontSize: '8.5px', fontWeight: '600', color: '#e11d48', marginBottom: '5px' }}>{group.category}</p>}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                    {group.skills.map((skill, i) => (
                      <span key={i} style={{ background: 'white', border: '1px solid #fecdd3', color: '#1a1a2e', padding: '2px 7px', borderRadius: '4px', fontSize: '8px' }}>{skill}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <div style={{ width: '3px', height: '14px', background: '#e11d48', borderRadius: '2px' }} />
                <h2 style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Education</h2>
              </div>
              {education.map((edu) => (
                <div key={edu.id} style={{ marginBottom: '10px' }}>
                  <p style={{ fontWeight: '600', fontSize: '9.5px' }}>{edu.institution}</p>
                  <p style={{ fontSize: '8.5px', color: '#6b7280' }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
                  <p style={{ fontSize: '8px', color: '#9ca3af' }}>{edu.startDate}{edu.startDate && edu.endDate ? ' – ' : ''}{edu.endDate}</p>
                  {(edu.gpa || edu.honors) && (
                    <p style={{ fontSize: '8px', color: '#9ca3af' }}>{[edu.gpa ? `GPA ${edu.gpa}` : '', edu.honors].filter(Boolean).join(' · ')}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <div style={{ width: '3px', height: '14px', background: '#e11d48', borderRadius: '2px' }} />
                <h2 style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Certifications</h2>
              </div>
              {certifications.map((cert) => (
                <div key={cert.id} style={{ marginBottom: '7px' }}>
                  <p style={{ fontSize: '9px', fontWeight: '600', color: '#1a1a2e' }}>{cert.name}</p>
                  {(cert.issuer || cert.date) && (
                    <p style={{ fontSize: '8px', color: '#9ca3af' }}>{cert.issuer}{cert.issuer && cert.date ? ' · ' : ''}{cert.date}</p>
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
