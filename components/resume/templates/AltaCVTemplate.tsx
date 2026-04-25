/**
 * AltaCV-inspired template
 * Two-column layout (60/40 split), terracotta/rust accent,
 * dot-based skill ratings, icon-prefixed contact info.
 * Inspired by the Overleaf AltaCV template by LianTze Lim.
 */
import { ResumeData } from '@/types/resume'

interface Props { data: ResumeData; scale?: number }

const ACCENT   = '#8B3333'   // deep terracotta
const DARK     = '#2C1A1A'   // near-black for headings
const BODY     = '#4A4A4A'   // medium grey for body text
const LIGHT    = '#B0522A'   // lighter terracotta for sub-labels
const RULE_CLR = '#C8A882'   // warm gold rule

function DotRating({ score = 3, max = 5 }: { score?: number; max?: number }) {
  return (
    <span style={{ display: 'inline-flex', gap: '3px', verticalAlign: 'middle' }}>
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: i < score ? ACCENT : 'transparent',
            border: `1.5px solid ${i < score ? ACCENT : '#ccc'}`,
          }}
        />
      ))}
    </span>
  )
}

function SectionHeader({ children }: { children: string }) {
  return (
    <div style={{ marginBottom: '10px' }}>
      <h2 style={{
        fontSize: '11px',
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
        color: ACCENT,
        marginBottom: '4px',
      }}>{children}</h2>
      <div style={{ height: '1.5px', background: RULE_CLR, borderRadius: '1px' }} />
    </div>
  )
}

function ContactRow({ icon, value }: { icon: string; value: string }) {
  if (!value) return null
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginBottom: '5px' }}>
      <span style={{ fontSize: '9px', color: ACCENT, minWidth: '12px', marginTop: '0.5px' }}>{icon}</span>
      <span style={{ fontSize: '8.5px', color: BODY, lineHeight: '1.4', wordBreak: 'break-all' }}>{value}</span>
    </div>
  )
}

export function AltaCVTemplate({ data, scale = 1 }: Props) {
  const { personalInfo: p, summary, experience, education, skills, projects, certifications } = data

  return (
    <div style={{
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      fontSize: '10px',
      lineHeight: '1.5',
      color: BODY,
      background: 'white',
      minHeight: '297mm',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* ── Header ── */}
      <div style={{
        background: '#FAF5F0',
        borderBottom: `3px solid ${ACCENT}`,
        padding: '28px 32px 20px',
      }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '900',
          color: DARK,
          letterSpacing: '-0.5px',
          marginBottom: '2px',
        }}>{p.fullName || 'Your Name'}</h1>
        {p.jobTitle && (
          <p style={{ fontSize: '12px', color: LIGHT, fontWeight: '600', letterSpacing: '0.5px' }}>
            {p.jobTitle}
          </p>
        )}
      </div>

      {/* ── Body columns ── */}
      <div style={{ display: 'flex', flex: 1 }}>

        {/* Left main column (60%) */}
        <div style={{ width: '60%', padding: '24px 20px 24px 32px', borderRight: `1px solid #EDE0D4` }}>

          {/* Summary */}
          {summary && (
            <div style={{ marginBottom: '20px' }}>
              <SectionHeader>About Me</SectionHeader>
              <p style={{ fontSize: '9px', lineHeight: '1.75', color: BODY }}>{summary}</p>
            </div>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <SectionHeader>Experience</SectionHeader>
              {experience.map((exp, idx) => (
                <div key={exp.id} style={{ marginBottom: idx < experience.length - 1 ? '16px' : 0 }}>
                  {/* Role + Dates */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1px' }}>
                    <p style={{ fontWeight: '800', fontSize: '10px', color: DARK }}>{exp.position}</p>
                    <p style={{ fontSize: '8px', color: '#888', fontStyle: 'italic', flexShrink: 0, marginLeft: '8px' }}>
                      {exp.startDate}{exp.startDate ? ' – ' : ''}{exp.current ? 'Present' : exp.endDate}
                    </p>
                  </div>
                  {/* Company */}
                  <p style={{ fontSize: '9px', color: ACCENT, fontWeight: '700', marginBottom: '6px' }}>
                    {exp.company}
                  </p>
                  {/* Bullets */}
                  <ul style={{ margin: 0, paddingLeft: '13px' }}>
                    {exp.bullets.filter(b => b.trim()).map((b, i) => (
                      <li key={i} style={{ fontSize: '8.5px', lineHeight: '1.65', marginBottom: '2px', color: BODY }}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div>
              <SectionHeader>Projects</SectionHeader>
              {projects.map((proj, idx) => (
                <div key={proj.id} style={{ marginBottom: idx < projects.length - 1 ? '12px' : 0 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '2px' }}>
                    <p style={{ fontWeight: '800', fontSize: '9.5px', color: DARK }}>{proj.name}</p>
                    {proj.technologies.length > 0 && (
                      <span style={{ fontSize: '7.5px', color: LIGHT }}>
                        {proj.technologies.join(' · ')}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '8.5px', color: BODY, lineHeight: '1.6' }}>{proj.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right sidebar (40%) */}
        <div style={{ width: '40%', padding: '24px 24px 24px 20px' }}>

          {/* Contact */}
          <div style={{ marginBottom: '20px' }}>
            <SectionHeader>Contact</SectionHeader>
            <ContactRow icon="✉" value={p.email} />
            <ContactRow icon="☎" value={p.phone} />
            <ContactRow icon="⌖" value={p.location} />
            <ContactRow icon="in" value={p.linkedin} />
            <ContactRow icon="⌥" value={p.github} />
            <ContactRow icon="⊕" value={p.website} />
          </div>

          {/* Education */}
          {education.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <SectionHeader>Education</SectionHeader>
              {education.map((edu) => (
                <div key={edu.id} style={{ marginBottom: '12px' }}>
                  <p style={{ fontWeight: '800', fontSize: '9px', color: DARK }}>{edu.institution}</p>
                  <p style={{ fontSize: '8.5px', color: ACCENT, fontWeight: '600' }}>
                    {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                  </p>
                  <p style={{ fontSize: '8px', color: '#888', fontStyle: 'italic' }}>
                    {edu.startDate}{edu.startDate && edu.endDate ? ' – ' : ''}{edu.endDate}
                  </p>
                  {edu.gpa && (
                    <p style={{ fontSize: '8px', color: BODY }}>GPA: {edu.gpa}</p>
                  )}
                  {edu.honors && (
                    <p style={{ fontSize: '8px', color: BODY }}>{edu.honors}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <SectionHeader>Certifications</SectionHeader>
              {certifications.map((cert) => (
                <div key={cert.id} style={{ marginBottom: '8px' }}>
                  <p style={{ fontSize: '9px', fontWeight: '700', color: DARK }}>{cert.name}</p>
                  {(cert.issuer || cert.date) && (
                    <p style={{ fontSize: '8px', color: LIGHT }}>{cert.issuer}{cert.issuer && cert.date ? ' · ' : ''}{cert.date}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Skills with dot ratings */}
          {skills.length > 0 && (
            <div>
              <SectionHeader>Skills</SectionHeader>
              {skills.map((group) => (
                <div key={group.id} style={{ marginBottom: '12px' }}>
                  {group.category && (
                    <p style={{ fontSize: '9px', fontWeight: '700', color: DARK, marginBottom: '5px' }}>
                      {group.category}
                    </p>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {group.skills.map((skill, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '8.5px', color: BODY }}>{skill}</span>
                        <DotRating score={Math.max(2, 5 - (i % 3))} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
