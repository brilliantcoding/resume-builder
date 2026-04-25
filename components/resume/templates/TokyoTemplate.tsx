/**
 * Tokyo — resume.io inspired
 * Minimalist, tech-inspired. Thin accent top bar, clean centered header,
 * skill-point visuals (filled squares), monochromatic with one accent color.
 */
import { ResumeData } from '@/types/resume'

interface Props { data: ResumeData; scale?: number }

const ACCENT  = '#0EA5E9'   // sky blue — sharp, tech accent
const DARK    = '#0F172A'   // near-black for headings
const BODY    = '#334155'   // slate-700 for body text
const MUTED   = '#64748B'   // slate-500 for dates/labels
const RULE    = '#E2E8F0'   // very light rule

// Skill squares: filled = skill level indicator
function SkillDots({ count = 4, total = 5 }: { count?: number; total?: number }) {
  return (
    <span style={{ display: 'inline-flex', gap: '2px', verticalAlign: 'middle' }}>
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} style={{
          display: 'inline-block',
          width: '6px',
          height: '6px',
          borderRadius: '1px',
          background: i < count ? ACCENT : '#E2E8F0',
        }} />
      ))}
    </span>
  )
}

function Section({ title, children, noBorder = false }: { title: string; children: React.ReactNode; noBorder?: boolean }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <h2 style={{
          fontSize: '9.5px',
          fontWeight: '800',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          color: ACCENT,
          whiteSpace: 'nowrap',
        }}>{title}</h2>
        <div style={{ flex: 1, height: '1px', background: RULE }} />
      </div>
      {children}
    </div>
  )
}

export function TokyoTemplate({ data, scale = 1 }: Props) {
  const { personalInfo: p, summary, experience, education, skills, projects, certifications } = data

  const contactItems = [
    p.email,
    p.phone,
    p.location,
    p.linkedin,
    p.github,
    p.website,
  ].filter(Boolean)

  return (
    <div style={{
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
      fontFamily: '"SF Pro Display", "Helvetica Neue", Helvetica, Arial, sans-serif',
      fontSize: '10px',
      lineHeight: '1.5',
      color: BODY,
      background: 'white',
      minHeight: '297mm',
    }}>

      {/* ── Top accent bar ── */}
      <div style={{
        height: '4px',
        background: `linear-gradient(90deg, ${ACCENT} 0%, #38BDF8 60%, #BAE6FD 100%)`,
      }} />

      {/* ── Header ── */}
      <div style={{
        padding: '28px 40px 20px',
        borderBottom: `1px solid ${RULE}`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{
              fontSize: '26px',
              fontWeight: '900',
              color: DARK,
              letterSpacing: '-0.8px',
              marginBottom: '2px',
              lineHeight: 1,
            }}>{p.fullName || 'Your Name'}</h1>
            {p.jobTitle && (
              <p style={{ fontSize: '11px', color: ACCENT, fontWeight: '600', letterSpacing: '0.3px', marginTop: '4px' }}>
                {p.jobTitle}
              </p>
            )}
          </div>
          {/* Contact cluster — right-aligned */}
          {contactItems.length > 0 && (
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {contactItems.map((item, i) => (
                <p key={i} style={{ fontSize: '8px', color: MUTED }}>{item}</p>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ padding: '22px 40px', display: 'flex', gap: '28px' }}>

        {/* Left column (main — 62%) */}
        <div style={{ flex: '0 0 62%' }}>

          {summary && (
            <Section title="Summary">
              <p style={{ fontSize: '9px', lineHeight: '1.75', color: BODY }}>{summary}</p>
            </Section>
          )}

          {experience.length > 0 && (
            <Section title="Experience">
              {experience.map((exp, idx) => (
                <div key={exp.id} style={{
                  marginBottom: idx < experience.length - 1 ? '14px' : 0,
                  paddingBottom: idx < experience.length - 1 ? '14px' : 0,
                  borderBottom: idx < experience.length - 1 ? `1px solid ${RULE}` : 'none',
                }}>
                  {/* Row 1: Title + dates */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1px' }}>
                    <p style={{ fontWeight: '800', fontSize: '10.5px', color: DARK }}>{exp.position}</p>
                    <p style={{ fontSize: '7.5px', color: MUTED, flexShrink: 0, marginLeft: '8px' }}>
                      {exp.startDate}{exp.startDate ? ' – ' : ''}{exp.current ? 'Present' : exp.endDate}
                    </p>
                  </div>
                  {/* Row 2: Company */}
                  <p style={{ fontSize: '9px', color: ACCENT, fontWeight: '600', marginBottom: '6px' }}>
                    {exp.company}
                  </p>
                  {/* Bullets */}
                  <ul style={{ margin: 0, paddingLeft: '13px' }}>
                    {exp.bullets.filter(b => b.trim()).map((b, i) => (
                      <li key={i} style={{ fontSize: '8.5px', lineHeight: '1.6', marginBottom: '2px', color: BODY }}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </Section>
          )}

          {projects.length > 0 && (
            <Section title="Projects">
              {projects.map((proj, idx) => (
                <div key={proj.id} style={{ marginBottom: idx < projects.length - 1 ? '10px' : 0 }}>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'baseline', flexWrap: 'wrap', marginBottom: '2px' }}>
                    <span style={{ fontWeight: '800', fontSize: '9.5px', color: DARK }}>{proj.name}</span>
                    {proj.technologies.map((tech, i) => (
                      <span key={i} style={{
                        fontSize: '7px',
                        background: '#F0F9FF',
                        color: ACCENT,
                        padding: '1px 5px',
                        borderRadius: '2px',
                        fontWeight: '600',
                        border: `1px solid #BAE6FD`,
                      }}>{tech}</span>
                    ))}
                  </div>
                  <p style={{ fontSize: '8.5px', color: BODY, lineHeight: '1.6' }}>{proj.description}</p>
                </div>
              ))}
            </Section>
          )}
        </div>

        {/* Right column (sidebar — 38%) */}
        <div style={{ flex: '0 0 38%' }}>

          {education.length > 0 && (
            <Section title="Education">
              {education.map((edu) => (
                <div key={edu.id} style={{ marginBottom: '10px' }}>
                  <p style={{ fontWeight: '800', fontSize: '9px', color: DARK }}>{edu.institution}</p>
                  <p style={{ fontSize: '8.5px', color: ACCENT, fontWeight: '600' }}>
                    {edu.degree}{edu.field ? ` · ${edu.field}` : ''}
                  </p>
                  <p style={{ fontSize: '8px', color: MUTED }}>
                    {edu.startDate}{edu.startDate && edu.endDate ? ' – ' : ''}{edu.endDate}
                  </p>
                  {edu.gpa && <p style={{ fontSize: '8px', color: MUTED }}>GPA: {edu.gpa}</p>}
                  {edu.honors && <p style={{ fontSize: '8px', color: MUTED }}>{edu.honors}</p>}
                </div>
              ))}
            </Section>
          )}

          {skills.length > 0 && (
            <Section title="Skills">
              {skills.map((group) => (
                <div key={group.id} style={{ marginBottom: '10px' }}>
                  {group.category && (
                    <p style={{ fontSize: '8px', fontWeight: '700', color: DARK, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {group.category}
                    </p>
                  )}
                  {group.skills.map((skill, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '8.5px', color: BODY }}>{skill}</span>
                      <SkillDots count={Math.max(2, 5 - (i % 3))} />
                    </div>
                  ))}
                </div>
              ))}
            </Section>
          )}

          {certifications.length > 0 && (
            <Section title="Certifications">
              {certifications.map((cert) => (
                <div key={cert.id} style={{ marginBottom: '8px' }}>
                  <p style={{ fontWeight: '700', fontSize: '8.5px', color: DARK }}>{cert.name}</p>
                  {(cert.issuer || cert.date) && (
                    <p style={{ fontSize: '8px', color: MUTED }}>{cert.issuer}{cert.issuer && cert.date ? ' · ' : ''}{cert.date}</p>
                  )}
                </div>
              ))}
            </Section>
          )}
        </div>
      </div>
    </div>
  )
}
