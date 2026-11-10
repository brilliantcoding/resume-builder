import { ResumeData } from '@/types/resume'

interface Props { data: ResumeData; scale?: number }

function SectionTitle({ children }: { children: string }) {
  return (
    <div style={{ borderBottom: '2px solid #1a1a1a', marginBottom: '8px', paddingBottom: '3px' }}>
      <h2 style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#1a1a1a' }}>{children}</h2>
    </div>
  )
}

export function ClassicTemplate({ data, scale = 1 }: Props) {
  const { personalInfo: p, summary, experience, education, skills, projects, certifications } = data

  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', fontFamily: 'Georgia, serif', fontSize: '10px', lineHeight: '1.5', color: '#1a1a1a', background: 'white', padding: '36px 40px', minHeight: '297mm' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '16px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '700', letterSpacing: '1px', marginBottom: '4px' }}>{p.fullName || 'Your Name'}</h1>
        {p.jobTitle && <p style={{ fontSize: '11px', color: '#444', marginBottom: '8px', fontStyle: 'italic' }}>{p.jobTitle}</p>}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '9px', color: '#555' }}>
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.location && <span>{p.location}</span>}
          {p.linkedin && <span>{p.linkedin}</span>}
          {p.github && <span>{p.github}</span>}
          {p.website && <span>{p.website}</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div style={{ marginBottom: '18px' }}>
          <SectionTitle>Summary</SectionTitle>
          <p style={{ fontSize: '9.5px', lineHeight: '1.7' }}>{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div style={{ marginBottom: '18px' }}>
          <SectionTitle>Professional Experience</SectionTitle>
          {experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div>
                  <span style={{ fontWeight: '700', fontSize: '10.5px' }}>{exp.position}</span>
                  {exp.company && <span style={{ fontSize: '9.5px' }}> — {exp.company}</span>}
                </div>
                <span style={{ fontSize: '9px', color: '#555' }}>{exp.startDate}{exp.startDate ? ' – ' : ''}{exp.current ? 'Present' : exp.endDate}</span>
              </div>
              <ul style={{ paddingLeft: '14px', margin: '4px 0 0' }}>
                {exp.bullets.filter(b => b.trim()).map((b, i) => (
                  <li key={i} style={{ fontSize: '9px', lineHeight: '1.7', marginBottom: '1px' }}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div style={{ marginBottom: '18px' }}>
          <SectionTitle>Education</SectionTitle>
          {education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontWeight: '700', fontSize: '10px' }}>{edu.institution}</p>
                <p style={{ fontSize: '9px', color: '#444' }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}{edu.honors ? `, ${edu.honors}` : ''}</p>
                {edu.gpa && <p style={{ fontSize: '8.5px', color: '#666' }}>GPA: {edu.gpa}</p>}
              </div>
              <span style={{ fontSize: '9px', color: '#555' }}>{edu.startDate}{edu.startDate && edu.endDate ? ' – ' : ''}{edu.endDate}</span>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div style={{ marginBottom: '18px' }}>
          <SectionTitle>Skills</SectionTitle>
          {skills.map((group) => (
            <div key={group.id} style={{ marginBottom: '5px', display: 'flex', gap: '8px' }}>
              {group.category && <span style={{ fontWeight: '700', fontSize: '9px', minWidth: '100px' }}>{group.category}:</span>}
              <span style={{ fontSize: '9px' }}>{group.skills.join(', ')}</span>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div style={{ marginBottom: '18px' }}>
          <SectionTitle>Projects</SectionTitle>
          {projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: '10px' }}>
              <span style={{ fontWeight: '700', fontSize: '10px' }}>{proj.name}</span>
              {proj.technologies.length > 0 && <span style={{ fontSize: '8.5px', color: '#555' }}> ({proj.technologies.join(', ')})</span>}
              <p style={{ fontSize: '9px', marginTop: '2px', lineHeight: '1.6' }}>{proj.description}</p>
              {(proj.url || proj.github) && (
                <p style={{ fontSize: '8.5px', color: '#1a6a48', marginTop: '1px' }}>{[proj.url, proj.github].filter(Boolean).join('  ·  ')}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div>
          <SectionTitle>Certifications / Accomplishments</SectionTitle>
          <ul style={{ paddingLeft: '14px', margin: '6px 0 0', listStyleType: 'disc' }}>
            {certifications.map((cert) => (
              <li key={cert.id} style={{ fontSize: '9px', lineHeight: '1.65', marginBottom: '2px' }}>
                {cert.name}{cert.issuer || cert.date ? ` (${[cert.issuer, cert.date].filter(Boolean).join(' · ')})` : ''}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
