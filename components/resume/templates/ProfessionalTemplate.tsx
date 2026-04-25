import { ResumeData } from '@/types/resume'

interface Props { data: ResumeData; scale?: number }

export function ProfessionalTemplate({ data, scale = 1 }: Props) {
  const { personalInfo: p, summary, experience, education, skills, projects, certifications } = data

  const SectionTitle = ({ children }: { children: string }) => (
    <div style={{ marginBottom: '6px', marginTop: '14px' }}>
      <h2 style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: '#1a1a1a', marginBottom: '3px' }}>{children}</h2>
      <div style={{ borderBottom: '1px solid #1a1a1a' }} />
    </div>
  )

  const allSkills = skills.flatMap(g => g.skills)
  const hasCategories = skills.some(g => g.category && g.category.trim())

  const contactParts = [p.phone, p.email, p.linkedin, p.github, p.website].filter(Boolean)

  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '10px', lineHeight: '1.5', color: '#1a1a1a', background: 'white', padding: '36px 44px', minHeight: '297mm' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '12px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '2px', fontVariant: 'small-caps', marginBottom: '3px' }}>{p.fullName || 'Your Name'}</h1>
        {p.location && <p style={{ fontSize: '10px', marginBottom: '4px' }}>{p.location}</p>}
        {contactParts.length > 0 && (
          <p style={{ fontSize: '9px', color: '#333' }}>
            {contactParts.join('  •  ')}
          </p>
        )}
      </div>

      {/* Summary */}
      {summary && (
        <div style={{ marginBottom: '4px' }}>
          <SectionTitle>Summary</SectionTitle>
          <p style={{ fontSize: '9.5px', lineHeight: '1.65', marginTop: '6px' }}>{summary}</p>
        </div>
      )}

      {/* Key Skills — flat multi-column grid */}
      {allSkills.length > 0 && !hasCategories && (
        <div style={{ marginBottom: '4px' }}>
          <SectionTitle>Key Skills</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px 0', marginTop: '6px' }}>
            {allSkills.map((skill, i) => (
              <div key={i} style={{ fontSize: '9px', paddingLeft: '2px' }}>• {skill}</div>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div style={{ marginBottom: '4px' }}>
          <SectionTitle>Experience</SectionTitle>
          {experience.map((exp) => (
            <div key={exp.id} style={{ marginTop: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontWeight: '700', fontSize: '10.5px' }}>{exp.company}</span>
                <span style={{ fontSize: '9px' }}>{exp.startDate}{exp.startDate ? ' – ' : ''}{exp.current ? 'Current Date' : exp.endDate}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontStyle: 'italic', fontSize: '9.5px' }}>{exp.position}</span>
              </div>
              {exp.bullets.filter(b => b.trim()).length > 0 && (
                <ul style={{ paddingLeft: '14px', margin: '4px 0 0', listStyleType: 'disc' }}>
                  {exp.bullets.filter(b => b.trim()).map((b, i) => (
                    <li key={i} style={{ fontSize: '9px', lineHeight: '1.65', marginBottom: '1px' }}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Technical Skills — category: values format */}
      {hasCategories && (
        <div style={{ marginBottom: '4px' }}>
          <SectionTitle>Technical Skills</SectionTitle>
          <div style={{ marginTop: '6px' }}>
            {skills.map((group) => (
              <div key={group.id} style={{ fontSize: '9px', lineHeight: '1.65', marginBottom: '2px' }}>
                {group.category && <span style={{ fontWeight: '700' }}>{group.category}: </span>}
                <span>{group.skills.join(', ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div style={{ marginBottom: '4px' }}>
          <SectionTitle>Certifications / Accomplishments</SectionTitle>
          <ul style={{ paddingLeft: '14px', margin: '6px 0 0', listStyleType: 'disc' }}>
            {certifications.map((cert) => (
              <li key={cert.id} style={{ fontSize: '9px', lineHeight: '1.65', marginBottom: '2px' }}>
                {cert.name}{cert.issuer ? ` (${cert.issuer})` : ''}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div style={{ marginBottom: '4px' }}>
          <SectionTitle>Projects</SectionTitle>
          {projects.map((proj) => (
            <div key={proj.id} style={{ marginTop: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontWeight: '700', fontSize: '10px' }}>{proj.name}</span>
                {proj.technologies.length > 0 && <span style={{ fontSize: '8.5px', color: '#555' }}>{proj.technologies.join(', ')}</span>}
              </div>
              <p style={{ fontSize: '9px', marginTop: '2px', lineHeight: '1.65' }}>{proj.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div style={{ marginBottom: '4px' }}>
          <SectionTitle>Education</SectionTitle>
          {education.map((edu) => (
            <div key={edu.id} style={{ marginTop: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontWeight: '700', fontSize: '10.5px' }}>{edu.institution}</span>
                <span style={{ fontSize: '9px' }}>{edu.startDate}{edu.startDate && edu.endDate ? ' – ' : ''}{edu.endDate}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontStyle: 'italic', fontSize: '9.5px' }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}{edu.honors ? `, ${edu.honors}` : ''}</span>
                {edu.gpa && <span style={{ fontSize: '9px' }}>GPA: {edu.gpa}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
