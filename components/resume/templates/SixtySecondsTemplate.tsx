/**
 * SixtySeconds-inspired template
 * Dark left sidebar (~30%) with progress bars for skills,
 * clean white right column, teal/cyan accent throughout.
 * Inspired by the SixtySecondsCV template on Overleaf.
 */
import { ResumeData } from '@/types/resume'

interface Props { data: ResumeData; scale?: number }

const SIDEBAR_BG   = '#1B2A3B'  // dark navy sidebar
const ACCENT       = '#00B4D8'  // bright cyan accent
const ACCENT_DIM   = '#0096B5'  // slightly dimmer cyan
const SIDEBAR_TEXT = '#E2EAF0'  // light text on dark sidebar
const SIDEBAR_MUTED = '#7FA0BB' // muted sidebar text
const HEADING_CLR  = '#1B2A3B'  // navy for right-side headings
const BODY_CLR     = '#2D3748'  // body text color

function SkillBar({ skill, level = 70 }: { skill: string; level?: number }) {
  return (
    <div style={{ marginBottom: '7px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
        <span style={{ fontSize: '8px', color: SIDEBAR_TEXT, fontWeight: '500' }}>{skill}</span>
      </div>
      <div style={{ height: '4px', background: 'rgba(255,255,255,0.12)', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${level}%`,
          background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_DIM})`,
          borderRadius: '2px',
        }} />
      </div>
    </div>
  )
}

function RightSectionTitle({ children }: { children: string }) {
  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
        <div style={{ width: '4px', height: '16px', background: ACCENT, borderRadius: '2px', flexShrink: 0 }} />
        <h2 style={{
          fontSize: '11px',
          fontWeight: '800',
          textTransform: 'uppercase',
          letterSpacing: '1.2px',
          color: HEADING_CLR,
        }}>{children}</h2>
      </div>
      <div style={{ height: '1px', background: '#E2E8F0', marginLeft: '12px' }} />
    </div>
  )
}

// Generate a deterministic skill level from the skill name
function skillLevel(skill: string, index: number): number {
  const base = 55
  const variance = (skill.length * 7 + index * 13) % 40
  return base + variance
}

export function SixtySecondsTemplate({ data, scale = 1 }: Props) {
  const { personalInfo: p, summary, experience, education, skills, projects, certifications } = data

  return (
    <div style={{
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
      fontFamily: '"Segoe UI", system-ui, -apple-system, sans-serif',
      fontSize: '10px',
      lineHeight: '1.5',
      color: BODY_CLR,
      background: 'white',
      display: 'flex',
      minHeight: '297mm',
    }}>

      {/* ── Left Sidebar ── */}
      <div style={{
        width: '30%',
        background: SIDEBAR_BG,
        padding: '32px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '0',
      }}>

        {/* Name + Title */}
        <div style={{ marginBottom: '24px', paddingBottom: '16px', borderBottom: `1px solid rgba(255,255,255,0.1)` }}>
          <h1 style={{
            fontSize: '16px',
            fontWeight: '800',
            color: '#FFFFFF',
            lineHeight: '1.2',
            marginBottom: '4px',
            wordBreak: 'break-word',
          }}>
            {(p.fullName || 'Your Name').split(' ').map((word, i) => (
              <span key={i} style={{ display: 'block' }}>{word}</span>
            ))}
          </h1>
          {p.jobTitle && (
            <p style={{ fontSize: '8.5px', color: ACCENT, fontWeight: '600', letterSpacing: '0.5px' }}>
              {p.jobTitle}
            </p>
          )}
        </div>

        {/* Contact */}
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '8px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: ACCENT, marginBottom: '8px' }}>
            Contact
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {[
              { label: p.email },
              { label: p.phone },
              { label: p.location },
              { label: p.linkedin },
              { label: p.github },
            ].filter(c => c.label).map(({ label }, i) => (
              <p key={i} style={{ fontSize: '7.5px', color: SIDEBAR_TEXT, lineHeight: '1.4', wordBreak: 'break-all' }}>{label}</p>
            ))}
          </div>
        </div>

        {/* Skills with progress bars */}
        {skills.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '8px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: ACCENT, marginBottom: '10px' }}>
              Skills
            </p>
            {skills.map((group) => (
              <div key={group.id} style={{ marginBottom: '10px' }}>
                {group.category && (
                  <p style={{ fontSize: '7.5px', fontWeight: '700', color: SIDEBAR_MUTED, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {group.category}
                  </p>
                )}
                {group.skills.map((skill, i) => (
                  <SkillBar key={i} skill={skill} level={skillLevel(skill, i)} />
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Education in sidebar */}
        {education.length > 0 && (
          <div>
            <p style={{ fontSize: '8px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: ACCENT, marginBottom: '8px' }}>
              Education
            </p>
            {education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: '10px' }}>
                <p style={{ fontSize: '8.5px', fontWeight: '700', color: '#FFFFFF', lineHeight: '1.3' }}>{edu.institution}</p>
                <p style={{ fontSize: '7.5px', color: SIDEBAR_TEXT, lineHeight: '1.4' }}>
                  {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                </p>
                <p style={{ fontSize: '7px', color: SIDEBAR_MUTED }}>
                  {edu.startDate}{edu.startDate && edu.endDate ? ' – ' : ''}{edu.endDate}
                </p>
                {edu.gpa && <p style={{ fontSize: '7px', color: SIDEBAR_MUTED }}>GPA: {edu.gpa}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Right main column ── */}
      <div style={{ flex: 1, padding: '32px 28px' }}>

        {/* Summary */}
        {summary && (
          <div style={{ marginBottom: '20px' }}>
            <RightSectionTitle>Profile</RightSectionTitle>
            <p style={{ fontSize: '9px', lineHeight: '1.7', color: BODY_CLR, paddingLeft: '12px' }}>{summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <RightSectionTitle>Work Experience</RightSectionTitle>
            {experience.map((exp, idx) => (
              <div key={exp.id} style={{
                paddingLeft: '12px',
                marginBottom: idx < experience.length - 1 ? '14px' : 0,
                paddingBottom: idx < experience.length - 1 ? '14px' : 0,
                borderBottom: idx < experience.length - 1 ? '1px dashed #E2E8F0' : 'none',
              }}>
                {/* Position + dates */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1px' }}>
                  <p style={{ fontWeight: '800', fontSize: '10px', color: HEADING_CLR }}>{exp.position}</p>
                  <span style={{
                    fontSize: '7.5px',
                    background: '#EBF8FF',
                    color: ACCENT_DIM,
                    padding: '2px 6px',
                    borderRadius: '10px',
                    fontWeight: '600',
                    flexShrink: 0,
                    marginLeft: '6px',
                  }}>
                    {exp.startDate}{exp.startDate ? ' – ' : ''}{exp.current ? 'Now' : exp.endDate}
                  </span>
                </div>
                <p style={{ fontSize: '8.5px', color: ACCENT, fontWeight: '600', marginBottom: '6px' }}>{exp.company}</p>
                <ul style={{ margin: 0, paddingLeft: '14px' }}>
                  {exp.bullets.filter(b => b.trim()).map((b, i) => (
                    <li key={i} style={{ fontSize: '8.5px', lineHeight: '1.65', marginBottom: '2px', color: BODY_CLR }}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <RightSectionTitle>Projects</RightSectionTitle>
            {projects.map((proj, idx) => (
              <div key={proj.id} style={{
                paddingLeft: '12px',
                marginBottom: idx < projects.length - 1 ? '12px' : 0,
              }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '6px', marginBottom: '3px' }}>
                  <p style={{ fontWeight: '800', fontSize: '9.5px', color: HEADING_CLR }}>{proj.name}</p>
                  {proj.technologies.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                      {proj.technologies.map((tech, i) => (
                        <span key={i} style={{
                          fontSize: '7px',
                          background: '#E8F8FC',
                          color: ACCENT_DIM,
                          padding: '1px 5px',
                          borderRadius: '8px',
                          fontWeight: '600',
                        }}>{tech}</span>
                      ))}
                    </div>
                  )}
                </div>
                <p style={{ fontSize: '8.5px', color: BODY_CLR, lineHeight: '1.6' }}>{proj.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div>
            <RightSectionTitle>Certifications</RightSectionTitle>
            {certifications.map((cert) => (
              <div key={cert.id} style={{ paddingLeft: '12px', marginBottom: '8px' }}>
                <p style={{ fontWeight: '700', fontSize: '9px', color: HEADING_CLR }}>{cert.name}</p>
                {(cert.issuer || cert.date) && (
                  <p style={{ fontSize: '7.5px', color: ACCENT, fontWeight: '500' }}>{cert.issuer}{cert.issuer && cert.date ? ' · ' : ''}{cert.date}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
