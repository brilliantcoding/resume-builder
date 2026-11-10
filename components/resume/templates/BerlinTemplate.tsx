/**
 * Berlin — resume.io inspired
 * Dark charcoal left sidebar with circular avatar, white right column.
 * Accent: slate-blue highlights, subtle left-border section markers on right.
 */
import { ResumeData } from '@/types/resume'

interface Props { data: ResumeData; scale?: number }

const SIDEBAR_BG  = '#2B3240'   // dark blue-charcoal
const SIDEBAR_ACC = '#7EB8D4'   // steel blue accent for sidebar headings
const SIDEBAR_TXT = '#C8D6E0'   // light text on dark sidebar
const SIDEBAR_MUT = '#6B7F8E'   // muted sidebar text
const RIGHT_ACC   = '#2B3240'   // same dark for right-side heading text
const RULE_CLR    = '#E0E6EA'   // light rule on right side
const BODY_TXT    = '#374151'   // right side body text

function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ marginBottom: '8px' }}>
        <p style={{ fontSize: '8.5px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.8px', color: SIDEBAR_ACC }}>
          {title}
        </p>
        <div style={{ height: '1px', background: 'rgba(126,184,212,0.3)', marginTop: '4px' }} />
      </div>
      {children}
    </div>
  )
}

function RightSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <div style={{ width: '3px', height: '14px', background: SIDEBAR_BG, borderRadius: '2px', flexShrink: 0 }} />
        <h2 style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.2px', color: RIGHT_ACC }}>
          {title}
        </h2>
      </div>
      <div style={{ height: '1px', background: RULE_CLR, marginBottom: '10px' }} />
      {children}
    </div>
  )
}

export function BerlinTemplate({ data, scale = 1 }: Props) {
  const { personalInfo: p, summary, experience, education, skills, projects, certifications } = data

  const initials = (p.fullName || 'YN')
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div style={{
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      fontSize: '10px',
      lineHeight: '1.5',
      color: BODY_TXT,
      background: 'white',
      display: 'flex',
      minHeight: '297mm',
    }}>

      {/* ── Sidebar ── */}
      <div style={{ width: '32%', background: SIDEBAR_BG, padding: '32px 18px', display: 'flex', flexDirection: 'column' }}>

        {/* Avatar circle */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4A6FA5 0%, #7EB8D4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '3px solid rgba(126,184,212,0.4)',
            fontSize: '22px',
            fontWeight: '700',
            color: 'white',
            letterSpacing: '1px',
          }}>{initials}</div>
        </div>

        {/* Name + Title */}
        <div style={{ textAlign: 'center', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <h1 style={{ fontSize: '17px', fontWeight: '800', color: '#FFFFFF', lineHeight: '1.2', marginBottom: '5px', letterSpacing: '-0.3px' }}>
            {p.fullName || 'Your Name'}
          </h1>
          {p.jobTitle && (
            <p style={{ fontSize: '9px', color: SIDEBAR_ACC, fontWeight: '600', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
              {p.jobTitle}
            </p>
          )}
        </div>

        {/* Contact */}
        <SidebarSection title="Contact">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {[
              { val: p.email, prefix: '@ ' },
              { val: p.phone, prefix: '✆ ' },
              { val: p.location, prefix: '⌖ ' },
              { val: p.linkedin, prefix: 'in ' },
              { val: p.github, prefix: '⌥ ' },
              { val: p.website, prefix: '⊕ ' },
            ].filter(c => c.val).map(({ val, prefix }, i) => (
              <div key={i} style={{ display: 'flex', gap: '5px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '8px', color: SIDEBAR_ACC, minWidth: '14px', marginTop: '1px', flexShrink: 0 }}>{prefix}</span>
                <span style={{ fontSize: '8px', color: SIDEBAR_TXT, lineHeight: '1.4', wordBreak: 'break-all' }}>{val}</span>
              </div>
            ))}
          </div>
        </SidebarSection>

        {/* Skills */}
        {skills.length > 0 && (
          <SidebarSection title="Skills">
            {skills.map((group) => (
              <div key={group.id} style={{ marginBottom: '10px' }}>
                {group.category && (
                  <p style={{ fontSize: '8px', fontWeight: '700', color: SIDEBAR_ACC, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {group.category}
                  </p>
                )}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                  {group.skills.map((skill, i) => (
                    <span key={i} style={{
                      fontSize: '7.5px',
                      background: 'rgba(126,184,212,0.15)',
                      color: SIDEBAR_TXT,
                      padding: '2px 7px',
                      borderRadius: '3px',
                      border: '1px solid rgba(126,184,212,0.2)',
                    }}>{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </SidebarSection>
        )}

        {/* Education in sidebar */}
        {education.length > 0 && (
          <SidebarSection title="Education">
            {education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: '10px' }}>
                <p style={{ fontSize: '8.5px', fontWeight: '700', color: '#FFFFFF', lineHeight: '1.3' }}>
                  {edu.institution}
                </p>
                <p style={{ fontSize: '8px', color: SIDEBAR_TXT, lineHeight: '1.4' }}>
                  {edu.degree}{edu.field ? ` · ${edu.field}` : ''}
                </p>
                <p style={{ fontSize: '7.5px', color: SIDEBAR_MUT }}>
                  {edu.startDate}{edu.startDate && edu.endDate ? ' – ' : ''}{edu.endDate}
                </p>
                {edu.gpa && <p style={{ fontSize: '7.5px', color: SIDEBAR_MUT }}>GPA {edu.gpa}</p>}
                {edu.honors && <p style={{ fontSize: '7.5px', color: SIDEBAR_MUT }}>{edu.honors}</p>}
              </div>
            ))}
          </SidebarSection>
        )}
      </div>

      {/* ── Right main ── */}
      <div style={{ flex: 1, padding: '36px 28px' }}>

        {summary && (
          <RightSection title="Profile">
            <p style={{ fontSize: '9px', lineHeight: '1.75', color: BODY_TXT }}>{summary}</p>
          </RightSection>
        )}

        {experience.length > 0 && (
          <RightSection title="Experience">
            {experience.map((exp, idx) => (
              <div key={exp.id} style={{
                marginBottom: idx < experience.length - 1 ? '14px' : 0,
                paddingBottom: idx < experience.length - 1 ? '14px' : 0,
                borderBottom: idx < experience.length - 1 ? `1px solid ${RULE_CLR}` : 'none',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2px' }}>
                  <p style={{ fontWeight: '800', fontSize: '10.5px', color: RIGHT_ACC }}>{exp.position}</p>
                  <span style={{ fontSize: '7.5px', color: '#888', flexShrink: 0, marginLeft: '8px', fontStyle: 'italic' }}>
                    {exp.startDate}{exp.startDate ? ' – ' : ''}{exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <p style={{ fontSize: '9px', color: SIDEBAR_ACC, fontWeight: '700', marginBottom: '6px' }}>
                  {exp.company}
                </p>
                <ul style={{ margin: 0, paddingLeft: '14px' }}>
                  {exp.bullets.filter(b => b.trim()).map((b, i) => (
                    <li key={i} style={{ fontSize: '8.5px', lineHeight: '1.65', marginBottom: '2px', color: BODY_TXT }}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </RightSection>
        )}

        {projects.length > 0 && (
          <RightSection title="Projects">
            {projects.map((proj, idx) => (
              <div key={proj.id} style={{ marginBottom: idx < projects.length - 1 ? '10px' : 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '3px' }}>
                  <p style={{ fontWeight: '800', fontSize: '9.5px', color: RIGHT_ACC }}>{proj.name}</p>
                  {proj.technologies.length > 0 && (
                    <span style={{ fontSize: '7.5px', color: '#888', fontStyle: 'italic' }}>
                      {proj.technologies.join(', ')}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '8.5px', color: BODY_TXT, lineHeight: '1.6' }}>{proj.description}</p>
                {(proj.url || proj.github) && (
                  <p style={{ fontSize: '8px', color: SIDEBAR_ACC, marginTop: '2px' }}>{[proj.url, proj.github].filter(Boolean).join('  ·  ')}</p>
                )}
              </div>
            ))}
          </RightSection>
        )}

        {certifications.length > 0 && (
          <RightSection title="Certifications">
            {certifications.map((cert) => (
              <div key={cert.id} style={{ marginBottom: '8px' }}>
                <p style={{ fontWeight: '800', fontSize: '9px', color: RIGHT_ACC }}>{cert.name}</p>
                {(cert.issuer || cert.date) && (
                  <p style={{ fontSize: '8px', color: SIDEBAR_ACC }}>{cert.issuer}{cert.issuer && cert.date ? ' · ' : ''}{cert.date}</p>
                )}
              </div>
            ))}
          </RightSection>
        )}
      </div>
    </div>
  )
}
