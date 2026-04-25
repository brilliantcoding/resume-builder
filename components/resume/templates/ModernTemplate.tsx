import { ResumeData } from '@/types/resume'

interface Props { data: ResumeData; scale?: number }

export function ModernTemplate({ data, scale = 1 }: Props) {
  const { personalInfo: p, summary, experience, education, skills, projects, certifications } = data

  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', fontFamily: 'Inter, sans-serif', fontSize: '10px', lineHeight: '1.4', color: '#1a1a1a', background: 'white' }}>
      <div style={{ display: 'flex', minHeight: '297mm' }}>
        {/* Sidebar */}
        <div style={{ width: '35%', background: '#4f46e5', color: 'white', padding: '32px 20px' }}>
          {/* Name & Title */}
          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '4px', lineHeight: '1.2' }}>{p.fullName || 'Your Name'}</h1>
            <p style={{ fontSize: '11px', opacity: 0.85, fontWeight: '500' }}>{p.jobTitle || 'Job Title'}</p>
          </div>

          {/* Contact */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', opacity: 0.7 }}>Contact</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '9px' }}>
              {p.email && <span>✉ {p.email}</span>}
              {p.phone && <span>📞 {p.phone}</span>}
              {p.location && <span>📍 {p.location}</span>}
              {p.linkedin && <span>🔗 {p.linkedin}</span>}
              {p.github && <span>💻 {p.github}</span>}
            </div>
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', opacity: 0.7 }}>Skills</h2>
              {skills.map((group) => (
                <div key={group.id} style={{ marginBottom: '12px' }}>
                  {group.category && <p style={{ fontSize: '9px', fontWeight: '600', marginBottom: '6px', opacity: 0.85 }}>{group.category}</p>}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {group.skills.map((skill, i) => (
                      <span key={i} style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '10px', fontSize: '8px' }}>{skill}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', opacity: 0.7 }}>Education</h2>
              {education.map((edu) => (
                <div key={edu.id} style={{ marginBottom: '10px' }}>
                  <p style={{ fontWeight: '600', fontSize: '9px' }}>{edu.institution}</p>
                  <p style={{ fontSize: '8px', opacity: 0.85 }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
                  <p style={{ fontSize: '8px', opacity: 0.7 }}>{edu.startDate}{edu.startDate && edu.endDate ? ' – ' : ''}{edu.endDate}</p>
                  {edu.gpa && <p style={{ fontSize: '8px', opacity: 0.7 }}>GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div>
              <h2 style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', opacity: 0.7 }}>Certifications</h2>
              {certifications.map((cert) => (
                <div key={cert.id} style={{ marginBottom: '8px' }}>
                  <p style={{ fontSize: '9px', fontWeight: '600' }}>{cert.name}</p>
                  {(cert.issuer || cert.date) && (
                    <p style={{ fontSize: '7.5px', opacity: 0.7 }}>{cert.issuer}{cert.issuer && cert.date ? ' · ' : ''}{cert.date}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main content */}
        <div style={{ flex: 1, padding: '32px 24px' }}>
          {/* Summary */}
          {summary && (
            <div style={{ marginBottom: '22px' }}>
              <h2 style={{ fontSize: '12px', fontWeight: '700', color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '2px solid #4f46e5', paddingBottom: '4px', marginBottom: '10px' }}>Professional Summary</h2>
              <p style={{ fontSize: '9.5px', lineHeight: '1.6', color: '#374151' }}>{summary}</p>
            </div>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <div style={{ marginBottom: '22px' }}>
              <h2 style={{ fontSize: '12px', fontWeight: '700', color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '2px solid #4f46e5', paddingBottom: '4px', marginBottom: '10px' }}>Experience</h2>
              {experience.map((exp) => (
                <div key={exp.id} style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <p style={{ fontWeight: '700', fontSize: '10.5px' }}>{exp.position}</p>
                    <p style={{ fontSize: '8.5px', color: '#6b7280' }}>{exp.startDate}{exp.startDate ? ' – ' : ''}{exp.current ? 'Present' : exp.endDate}</p>
                  </div>
                  <p style={{ fontSize: '9px', color: '#4f46e5', fontWeight: '600', marginBottom: '6px' }}>{exp.company}</p>
                  <ul style={{ paddingLeft: '12px', margin: 0 }}>
                    {exp.bullets.filter(b => b.trim()).map((b, i) => (
                      <li key={i} style={{ fontSize: '9px', lineHeight: '1.6', color: '#374151', marginBottom: '2px' }}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div>
              <h2 style={{ fontSize: '12px', fontWeight: '700', color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '2px solid #4f46e5', paddingBottom: '4px', marginBottom: '10px' }}>Projects</h2>
              {projects.map((proj) => (
                <div key={proj.id} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '3px' }}>
                    <p style={{ fontWeight: '700', fontSize: '10px' }}>{proj.name}</p>
                    {proj.technologies.length > 0 && (
                      <p style={{ fontSize: '8px', color: '#6b7280' }}>({proj.technologies.join(', ')})</p>
                    )}
                  </div>
                  <p style={{ fontSize: '9px', color: '#374151', lineHeight: '1.5' }}>{proj.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
