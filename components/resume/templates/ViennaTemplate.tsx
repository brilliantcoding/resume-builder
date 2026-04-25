/**
 * Vienna — resume.io inspired
 * Striking full-width colored header with large name, then two-column body.
 * Left col: Skills, Education, Contact. Right col: Summary + Experience + Projects.
 * Rich burgundy/wine accent. Elegant feel.
 */
import { ResumeData } from '@/types/resume'

interface Props { data: ResumeData; scale?: number }

const HEADER_BG = '#6B2737'   // deep burgundy header
const ACCENT    = '#9B3A52'   // mid burgundy for accents
const LIGHT_ACC = '#C96B82'   // lighter burgundy for labels
const LEFT_BG   = '#F9F4F5'   // warm blush for left column
const DARK      = '#1C1215'   // near-black for headings
const BODY      = '#3D2D32'   // warm dark body text
const MUTED     = '#8A7079'   // muted warm text

function LeftSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '18px' }}>
      <p style={{
        fontSize: '8px',
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: '2px',
        color: HEADER_BG,
        marginBottom: '6px',
      }}>{title}</p>
      <div style={{ height: '1.5px', background: LIGHT_ACC, opacity: 0.4, marginBottom: '8px' }} />
      {children}
    </div>
  )
}

function RightSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <div style={{ width: '14px', height: '2px', background: HEADER_BG, borderRadius: '1px', flexShrink: 0 }} />
        <h2 style={{
          fontSize: '10.5px',
          fontWeight: '800',
          textTransform: 'uppercase',
          letterSpacing: '1.2px',
          color: DARK,
        }}>{title}</h2>
      </div>
      {children}
    </div>
  )
}

export function ViennaTemplate({ data, scale = 1 }: Props) {
  const { personalInfo: p, summary, experience, education, skills, projects, certifications } = data

  return (
    <div style={{
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
      fontFamily: '"Georgia", "Times New Roman", serif',
      fontSize: '10px',
      lineHeight: '1.5',
      color: BODY,
      background: 'white',
      minHeight: '297mm',
    }}>

      {/* ── Header — full width colored block ── */}
      <div style={{
        background: HEADER_BG,
        padding: '30px 36px 22px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative corner shape */}
        <div style={{
          position: 'absolute',
          right: '-30px',
          top: '-30px',
          width: '140px',
          height: '140px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
        }} />
        <div style={{
          position: 'absolute',
          right: '20px',
          bottom: '-40px',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)',
        }} />

        <h1 style={{
          fontSize: '30px',
          fontWeight: '700',
          color: '#FFFFFF',
          letterSpacing: '-0.5px',
          marginBottom: '4px',
          fontStyle: 'italic',
          lineHeight: 1.1,
        }}>{p.fullName || 'Your Name'}</h1>

        {p.jobTitle && (
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.75)', fontWeight: '400', letterSpacing: '1.5px', textTransform: 'uppercase', fontSize: '9px', marginBottom: '12px' }}>
            {p.jobTitle}
          </p>
        )}

        {/* Contact row in header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginTop: '10px' }}>
          {[p.email, p.phone, p.location].filter(Boolean).map((val, i) => (
            <span key={i} style={{ fontSize: '8px', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              {val}
            </span>
          ))}
        </div>
      </div>

      {/* ── Two column body ── */}
      <div style={{ display: 'flex', flex: 1 }}>

        {/* Left column (36%) — blush tint, skills/education */}
        <div style={{ width: '36%', background: LEFT_BG, padding: '24px 18px', minHeight: '100%' }}>

          {/* Online Presence */}
          {(p.linkedin || p.github || p.website) && (
            <LeftSection title="Links">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {p.linkedin && <p style={{ fontSize: '8px', color: ACCENT, wordBreak: 'break-all' }}>{p.linkedin}</p>}
                {p.github && <p style={{ fontSize: '8px', color: ACCENT, wordBreak: 'break-all' }}>{p.github}</p>}
                {p.website && <p style={{ fontSize: '8px', color: ACCENT, wordBreak: 'break-all' }}>{p.website}</p>}
              </div>
            </LeftSection>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <LeftSection title="Skills">
              {skills.map((group) => (
                <div key={group.id} style={{ marginBottom: '10px' }}>
                  {group.category && (
                    <p style={{ fontSize: '8px', fontWeight: '700', color: HEADER_BG, marginBottom: '4px' }}>
                      {group.category}
                    </p>
                  )}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                    {group.skills.map((skill, i) => (
                      <span key={i} style={{
                        fontSize: '7.5px',
                        background: 'rgba(107,39,55,0.08)',
                        color: ACCENT,
                        padding: '2px 7px',
                        borderRadius: '2px',
                        border: '1px solid rgba(107,39,55,0.15)',
                        fontFamily: '"Helvetica Neue", sans-serif',
                      }}>{skill}</span>
                    ))}
                  </div>
                </div>
              ))}
            </LeftSection>
          )}

          {/* Education */}
          {education.length > 0 && (
            <LeftSection title="Education">
              {education.map((edu) => (
                <div key={edu.id} style={{ marginBottom: '12px' }}>
                  <p style={{ fontWeight: '700', fontSize: '9px', color: DARK }}>{edu.institution}</p>
                  <p style={{ fontSize: '8.5px', color: ACCENT, fontStyle: 'italic' }}>
                    {edu.degree}{edu.field ? `, ${edu.field}` : ''}
                  </p>
                  <p style={{ fontSize: '8px', color: MUTED }}>
                    {edu.startDate}{edu.startDate && edu.endDate ? '–' : ''}{edu.endDate}
                  </p>
                  {edu.gpa && <p style={{ fontSize: '7.5px', color: MUTED }}>GPA: {edu.gpa}</p>}
                </div>
              ))}
            </LeftSection>
          )}
        </div>

        {/* Right column (64%) — white, main content */}
        <div style={{ flex: 1, padding: '24px 26px' }}>

          {summary && (
            <RightSection title="Profile">
              <p style={{ fontSize: '9px', lineHeight: '1.8', color: BODY, fontStyle: 'italic' }}>{summary}</p>
              <div style={{ height: '1px', background: '#EEE5E7', marginTop: '12px' }} />
            </RightSection>
          )}

          {experience.length > 0 && (
            <RightSection title="Experience">
              {experience.map((exp, idx) => (
                <div key={exp.id} style={{ marginBottom: idx < experience.length - 1 ? '14px' : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2px' }}>
                    <p style={{ fontWeight: '700', fontSize: '10px', color: DARK, fontStyle: 'italic' }}>{exp.position}</p>
                    <span style={{ fontSize: '7.5px', color: MUTED, flexShrink: 0, marginLeft: '8px' }}>
                      {exp.startDate}{exp.startDate ? '–' : ''}{exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <p style={{ fontSize: '9px', color: ACCENT, fontWeight: '700', marginBottom: '6px', fontFamily: '"Helvetica Neue", sans-serif' }}>
                    {exp.company}
                  </p>
                  <ul style={{ margin: 0, paddingLeft: '13px' }}>
                    {exp.bullets.filter(b => b.trim()).map((b, i) => (
                      <li key={i} style={{ fontSize: '8.5px', lineHeight: '1.7', marginBottom: '2px', color: BODY }}>{b}</li>
                    ))}
                  </ul>
                  {idx < experience.length - 1 && (
                    <div style={{ height: '1px', background: '#EEE5E7', marginTop: '12px' }} />
                  )}
                </div>
              ))}
            </RightSection>
          )}

          {projects.length > 0 && (
            <RightSection title="Projects">
              {projects.map((proj, idx) => (
                <div key={proj.id} style={{ marginBottom: idx < projects.length - 1 ? '10px' : 0 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '2px' }}>
                    <p style={{ fontWeight: '700', fontSize: '9.5px', color: DARK, fontStyle: 'italic' }}>{proj.name}</p>
                    {proj.technologies.length > 0 && (
                      <span style={{ fontSize: '7.5px', color: MUTED, fontFamily: '"Helvetica Neue", sans-serif' }}>
                        {proj.technologies.join(', ')}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '8.5px', color: BODY, lineHeight: '1.65' }}>{proj.description}</p>
                </div>
              ))}
            </RightSection>
          )}

          {certifications.length > 0 && (
            <RightSection title="Certifications / Accomplishments">
              <ul style={{ paddingLeft: '13px', margin: 0 }}>
                {certifications.map((cert) => (
                  <li key={cert.id} style={{ fontSize: '8.5px', lineHeight: '1.7', marginBottom: '2px', color: BODY }}>
                    {cert.name}{cert.issuer ? ` (${cert.issuer})` : ''}
                  </li>
                ))}
              </ul>
            </RightSection>
          )}
        </div>
      </div>
    </div>
  )
}
