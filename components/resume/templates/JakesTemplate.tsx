/**
 * Jake's Resume-inspired template
 * Clean single-column, bold centered header with pipe-separated contact,
 * ALL CAPS section headers with thick rules, ATS-optimized, tight spacing.
 * Inspired by harshibar's resume (adapted from Jake's Resume) on Overleaf.
 */
import { ResumeData } from '@/types/resume'

interface Props { data: ResumeData; scale?: number }

function SectionTitle({ children }: { children: string }) {
  return (
    <div style={{ marginBottom: '6px', marginTop: '14px' }}>
      <h2 style={{
        fontSize: '11.5px',
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        color: '#111',
        marginBottom: '3px',
      }}>{children}</h2>
      <div style={{ height: '1.5px', background: '#111', borderRadius: '1px' }} />
    </div>
  )
}

export function JakesTemplate({ data, scale = 1 }: Props) {
  const { personalInfo: p, summary, experience, education, skills, projects, certifications } = data

  // Build contact line parts
  const contactParts = [
    p.location,
    p.phone,
    p.email,
    p.linkedin && `linkedin.com/in/${p.linkedin.replace(/.*linkedin\.com\/in\//i, '')}`,
    p.github && `github.com/${p.github.replace(/.*github\.com\//i, '')}`,
    p.website,
  ].filter(Boolean) as string[]

  return (
    <div style={{
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
      fontFamily: '"Nimbus Mono PS", "Courier New", monospace',
      fontFamily: '"Computer Modern", "Latin Modern", Georgia, serif',
      fontSize: '10px',
      lineHeight: '1.4',
      color: '#111',
      background: 'white',
      padding: '36px 44px',
      minHeight: '297mm',
    }}>

      {/* ── Header ── */}
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '900',
          letterSpacing: '0px',
          color: '#000',
          marginBottom: '6px',
          fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        }}>
          {p.fullName || 'Your Name'}
        </h1>
        {contactParts.length > 0 && (
          <p style={{
            fontSize: '8.5px',
            color: '#333',
            lineHeight: '1.6',
            letterSpacing: '0.2px',
          }}>
            {contactParts.join('  |  ')}
          </p>
        )}
      </div>

      {/* ── Summary ── */}
      {summary && (
        <div>
          <SectionTitle>Summary</SectionTitle>
          <p style={{ fontSize: '9px', lineHeight: '1.65', color: '#222', marginTop: '5px' }}>{summary}</p>
        </div>
      )}

      {/* ── Education ── */}
      {education.length > 0 && (
        <div>
          <SectionTitle>Education</SectionTitle>
          {education.map((edu) => (
            <div key={edu.id} style={{ marginTop: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <p style={{ fontWeight: '800', fontSize: '9.5px', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
                  {edu.institution}
                </p>
                <p style={{ fontSize: '8.5px', color: '#555', flexShrink: 0, marginLeft: '8px' }}>
                  {edu.startDate}{edu.startDate && edu.endDate ? ' -- ' : ''}{edu.endDate}
                </p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ fontSize: '9px', fontStyle: 'italic', color: '#333' }}>
                  {edu.degree}{edu.field ? `, ${edu.field}` : ''}{edu.honors ? `; ${edu.honors}` : ''}
                </p>
                {edu.gpa && (
                  <p style={{ fontSize: '8.5px', color: '#555' }}>GPA: {edu.gpa}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Experience ── */}
      {experience.length > 0 && (
        <div>
          <SectionTitle>Experience</SectionTitle>
          {experience.map((exp) => (
            <div key={exp.id} style={{ marginTop: '7px' }}>
              {/* Company + dates row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <p style={{ fontWeight: '800', fontSize: '9.5px', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
                  {exp.company}
                </p>
                <p style={{ fontSize: '8.5px', color: '#555', flexShrink: 0, marginLeft: '8px' }}>
                  {exp.startDate}{exp.startDate ? ' -- ' : ''}{exp.current ? 'Present' : exp.endDate}
                </p>
              </div>
              {/* Title + location */}
              <p style={{ fontSize: '9px', fontStyle: 'italic', color: '#333', marginBottom: '4px' }}>
                {exp.position}
              </p>
              {/* Bullets — standard LaTeX itemize look */}
              <ul style={{ margin: '0', paddingLeft: '16px', listStyleType: 'disc' }}>
                {exp.bullets.filter(b => b.trim()).map((b, i) => (
                  <li key={i} style={{
                    fontSize: '8.5px',
                    lineHeight: '1.6',
                    marginBottom: '1px',
                    color: '#222',
                    paddingLeft: '2px',
                  }}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* ── Projects ── */}
      {projects.length > 0 && (
        <div>
          <SectionTitle>Projects</SectionTitle>
          {projects.map((proj) => (
            <div key={proj.id} style={{ marginTop: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: '800', fontSize: '9.5px', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
                  {proj.name}
                </span>
                {proj.technologies.length > 0 && (
                  <span style={{ fontSize: '8.5px', color: '#444', fontStyle: 'italic' }}>
                    {' '}| {proj.technologies.join(', ')}
                  </span>
                )}
              </div>
              <p style={{ fontSize: '8.5px', lineHeight: '1.6', color: '#222', marginTop: '2px' }}>{proj.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Technical Skills ── */}
      {skills.length > 0 && (
        <div>
          <SectionTitle>Technical Skills</SectionTitle>
          <div style={{ marginTop: '5px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {skills.map((group) => (
              <div key={group.id} style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                {group.category && (
                  <span style={{ fontWeight: '800', fontSize: '8.5px', color: '#111', minWidth: '90px', flexShrink: 0, fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
                    {group.category}:
                  </span>
                )}
                <span style={{ fontSize: '8.5px', color: '#222', lineHeight: '1.5' }}>
                  {group.skills.join(', ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Certifications ── */}
      {certifications.length > 0 && (
        <div>
          <SectionTitle>Certifications / Accomplishments</SectionTitle>
          <ul style={{ margin: '5px 0 0', paddingLeft: '16px', listStyleType: 'disc' }}>
            {certifications.map((cert) => (
              <li key={cert.id} style={{ fontSize: '8.5px', lineHeight: '1.6', marginBottom: '1px', color: '#222' }}>
                {cert.name}{cert.issuer ? ` — ${cert.issuer}` : ''}{cert.date ? ` (${cert.date})` : ''}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
