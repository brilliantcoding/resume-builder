import { Document, Page, Text, View } from '@react-pdf/renderer'
import { ReactElement } from 'react'
import { ResumeData, TemplateId } from '@/types/resume'

type ExtraTemplate = Extract<TemplateId, 'minimal' | 'creative' | 'altacv' | 'jakes' | 'sixtyseconds' | 'berlin' | 'vienna'>
type SectionName = 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications'
type HeaderStyle = 'rule' | 'marker' | 'sidebar' | 'compact' | 'elegant'
type SkillStyle = 'chips' | 'plain' | 'bars' | 'dots'

interface Theme {
  accent: string
  dark: string
  body: string
  muted: string
  rule: string
  heading: HeaderStyle
  skillStyle?: SkillStyle
  serif?: boolean
  compact?: boolean
}

const themes: Record<ExtraTemplate, Theme> = {
  minimal: { accent: '#0D9488', dark: '#0F172A', body: '#475569', muted: '#64748B', rule: '#E2E8F0', heading: 'compact', skillStyle: 'plain' },
  creative: { accent: '#E11D48', dark: '#1A1A2E', body: '#4B5563', muted: '#9CA3AF', rule: '#FECDD3', heading: 'marker', skillStyle: 'chips' },
  altacv: { accent: '#8B3333', dark: '#2C1A1A', body: '#4A4A4A', muted: '#888888', rule: '#C8A882', heading: 'compact', skillStyle: 'dots' },
  jakes: { accent: '#111111', dark: '#111111', body: '#222222', muted: '#555555', rule: '#111111', heading: 'rule', skillStyle: 'plain', serif: true, compact: true },
  sixtyseconds: { accent: '#00B4D8', dark: '#1B2A3B', body: '#2D3748', muted: '#7FA0BB', rule: '#E2E8F0', heading: 'marker', skillStyle: 'bars' },
  berlin: { accent: '#7EB8D4', dark: '#2B3240', body: '#374151', muted: '#6B7F8E', rule: '#E0E6EA', heading: 'marker', skillStyle: 'chips' },
  vienna: { accent: '#9B3A52', dark: '#1C1215', body: '#3D2D32', muted: '#8A7079', rule: '#EEE5E7', heading: 'elegant', skillStyle: 'chips', serif: true },
}

function SectionHeading({ title, theme }: { title: string; theme: Theme }) {
  const font = theme.serif ? 'Times-Bold' : 'Helvetica-Bold'
  if (theme.heading === 'elegant') {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 7 }}>
        <View style={{ flex: 1, height: 0.5, backgroundColor: theme.rule }} />
        <Text style={{ color: theme.accent, fontSize: 8, fontFamily: font, letterSpacing: 1.5, marginHorizontal: 7 }}>{title.toUpperCase()}</Text>
        <View style={{ flex: 1, height: 0.5, backgroundColor: theme.rule }} />
      </View>
    )
  }
  if (theme.heading === 'sidebar') {
    return (
      <View style={{ marginBottom: 7 }}>
        <Text style={{ color: theme.accent, fontSize: 8, fontFamily: font, letterSpacing: 1.2, marginBottom: 4 }}>{title.toUpperCase()}</Text>
        <View style={{ height: 0.6, backgroundColor: theme.rule }} />
      </View>
    )
  }
  if (theme.heading === 'marker') {
    return (
      <View style={{ marginBottom: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
          <View style={{ width: 3, height: 11, backgroundColor: theme.accent, marginRight: 6 }} />
          <Text style={{ color: theme.dark, fontSize: 9, fontFamily: font, letterSpacing: 0.7 }}>{title.toUpperCase()}</Text>
        </View>
        <View style={{ height: 0.6, backgroundColor: theme.rule, marginLeft: 9 }} />
      </View>
    )
  }
  if (theme.heading === 'rule') {
    return (
      <View style={{ marginTop: 9, marginBottom: 5 }}>
        <Text style={{ color: theme.dark, fontSize: 9, fontFamily: font, letterSpacing: 0.3, marginBottom: 3 }}>{title.toUpperCase()}</Text>
        <View style={{ height: 1.2, backgroundColor: theme.rule }} />
      </View>
    )
  }
  return (
    <Text style={{ color: theme.accent, fontSize: 8, fontFamily: font, letterSpacing: 1.2, marginBottom: 7, marginTop: 10 }}>
      {title.toUpperCase()}
    </Text>
  )
}

function ContactList({ data, color, centered = false }: { data: ResumeData; color: string; centered?: boolean }) {
  const p = data.personalInfo
  const contacts = [p.email, p.phone, p.location, p.linkedin, p.github, p.website].filter(Boolean)
  return (
    <View style={{ width: '100%', alignItems: centered ? 'center' : 'flex-start' }}>
      {contacts.map((contact, index) => (
        <Text key={index} style={{ width: '100%', color, textAlign: centered ? 'center' : 'left', fontSize: 7, lineHeight: 1.35, marginBottom: 2 }}>
          {contact}
        </Text>
      ))}
    </View>
  )
}

function ResumeSections({
  data,
  names,
  theme,
  inSidebar = false,
}: {
  data: ResumeData
  names: SectionName[]
  theme: Theme
  inSidebar?: boolean
}) {
  const { summary, experience, education, skills, projects, certifications } = data
  const font = theme.serif ? 'Times-Roman' : 'Helvetica'
  const bold = theme.serif ? 'Times-Bold' : 'Helvetica-Bold'
  const headingTheme = inSidebar ? { ...theme, heading: 'sidebar' as const } : theme
  const space = theme.compact ? 7 : 10

  return (
    <>
      {names.map((name) => {
        if (name === 'summary' && summary) {
          return (
            <View key={name} style={{ marginBottom: space }}>
              {theme.heading !== 'compact' ? <SectionHeading title="Profile" theme={headingTheme} /> : null}
              <Text style={{ fontFamily: font, fontSize: 8, lineHeight: 1.55, color: theme.body }}>{summary}</Text>
            </View>
          )
        }
        if (name === 'experience' && experience.length) {
          return (
            <View key={name} style={{ marginBottom: space }}>
              <SectionHeading title="Experience" theme={headingTheme} />
              {experience.map((entry, index) => (
                <View key={entry.id || index} style={{ marginBottom: space, paddingBottom: theme.compact ? 0 : 5, borderBottomWidth: !inSidebar && index < experience.length - 1 ? 0.5 : 0, borderBottomColor: theme.rule }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Text style={{ flex: 1, fontSize: 8.5, fontFamily: bold, color: theme.dark, paddingRight: 5 }}>{entry.position}</Text>
                    <Text style={{ fontSize: 6.5, color: theme.muted, textAlign: 'right' }}>{entry.startDate}{entry.startDate ? ' – ' : ''}{entry.current ? 'Present' : entry.endDate}</Text>
                  </View>
                  <Text style={{ color: theme.accent, fontSize: 7.5, fontFamily: bold, marginTop: 2, marginBottom: 3 }}>{entry.company}</Text>
                  {entry.bullets.filter((bullet) => bullet.trim()).map((bullet, bulletIndex) => (
                    <Text key={bulletIndex} style={{ fontSize: 7.2, lineHeight: 1.45, color: theme.body, paddingLeft: 8, marginBottom: 1 }}>• {bullet}</Text>
                  ))}
                </View>
              ))}
            </View>
          )
        }
        if (name === 'education' && education.length) {
          return (
            <View key={name} style={{ marginBottom: space }}>
              <SectionHeading title="Education" theme={headingTheme} />
              {education.map((entry, index) => (
                <View key={entry.id || index} style={{ marginBottom: 7 }}>
                  <Text style={{ fontSize: 7.5, fontFamily: bold, color: inSidebar ? '#FFFFFF' : theme.dark }}>{entry.institution}</Text>
                  <Text style={{ fontSize: 7, color: inSidebar ? '#E2EAF0' : theme.accent, marginTop: 1 }}>{entry.degree}{entry.field ? ` · ${entry.field}` : ''}</Text>
                  <Text style={{ fontSize: 6.5, color: theme.muted, marginTop: 1 }}>{entry.startDate}{entry.startDate && entry.endDate ? ' – ' : ''}{entry.endDate}</Text>
                  {entry.gpa ? <Text style={{ fontSize: 6.5, color: theme.muted }}>GPA: {entry.gpa}</Text> : null}
                  {entry.honors ? <Text style={{ fontSize: 6.5, color: theme.muted }}>{entry.honors}</Text> : null}
                </View>
              ))}
            </View>
          )
        }
        if (name === 'skills' && skills.length) {
          return (
            <View key={name} style={{ marginBottom: space }}>
              <SectionHeading title="Skills" theme={headingTheme} />
              {skills.map((group, groupIndex) => (
                <View key={group.id || groupIndex} style={{ marginBottom: 6 }}>
                  {group.category ? <Text style={{ fontSize: 7, color: inSidebar ? theme.accent : theme.dark, fontFamily: bold, marginBottom: 3 }}>{group.category.toUpperCase()}</Text> : null}
                  <View style={theme.skillStyle === 'chips' ? { flexDirection: 'row', flexWrap: 'wrap' } : undefined}>
                    {group.skills.map((skill, skillIndex) => {
                      if (theme.skillStyle === 'bars' && !inSidebar) {
                        return <Text key={skillIndex} style={{ fontSize: 7, color: theme.body, marginBottom: 2 }}>{skill}</Text>
                      }
                      if (theme.skillStyle === 'dots') {
                        return (
                          <View key={skillIndex} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                            <Text style={{ flex: 1, fontSize: 7, color: theme.body, paddingRight: 4 }}>{skill}</Text>
                            <View style={{ flexDirection: 'row', gap: 2 }}>
                              {Array.from({ length: 5 }, (_, dotIndex) => (
                                <View key={dotIndex} style={{ width: 4, height: 4, borderRadius: 2, borderWidth: 0.6, borderColor: theme.accent, backgroundColor: dotIndex < Math.max(2, 4 - (skillIndex % 3)) ? theme.accent : '#FFFFFF' }} />
                              ))}
                            </View>
                          </View>
                        )
                      }
                      if (theme.skillStyle === 'bars') {
                        const level = 55 + ((skill.length * 7 + skillIndex * 13) % 40)
                        return (
                          <View key={skillIndex} style={{ marginBottom: 5 }}>
                            <Text style={{ fontSize: 7, color: '#E2EAF0', marginBottom: 2 }}>{skill}</Text>
                            <View style={{ height: 3, backgroundColor: 'rgba(255,255,255,0.15)' }}>
                              <View style={{ width: `${level}%`, height: 3, backgroundColor: theme.accent }} />
                            </View>
                          </View>
                        )
                      }
                      if (theme.skillStyle === 'chips') {
                        return (
                          <Text key={skillIndex} style={{
                            fontSize: 6.7,
                            color: inSidebar ? '#E2EAF0' : theme.accent,
                            backgroundColor: inSidebar ? 'rgba(126,184,212,0.15)' : `${theme.accent}14`,
                            paddingTop: 2,
                            paddingBottom: 2,
                            paddingLeft: 5,
                            paddingRight: 5,
                            marginRight: 3,
                            marginBottom: 3,
                            borderRadius: 2,
                          }}>{skill}</Text>
                        )
                      }
                      return <Text key={skillIndex} style={{ fontSize: 7, color: inSidebar ? '#E2EAF0' : theme.body, marginBottom: 2 }}>{skill}</Text>
                    })}
                  </View>
                </View>
              ))}
            </View>
          )
        }
        if (name === 'projects' && projects.length) {
          return (
            <View key={name} style={{ marginBottom: space }}>
              <SectionHeading title="Projects" theme={headingTheme} />
              {projects.map((entry, index) => (
                <View key={entry.id || index} style={{ marginBottom: 7 }}>
                  <Text style={{ fontSize: 8, fontFamily: bold, color: theme.dark }}>{entry.name}</Text>
                  {entry.technologies.length ? <Text style={{ fontSize: 6.5, color: theme.accent, marginTop: 1 }}>{entry.technologies.join(' · ')}</Text> : null}
                  <Text style={{ fontSize: 7, lineHeight: 1.45, color: theme.body, marginTop: 2 }}>{entry.description}</Text>
                </View>
              ))}
            </View>
          )
        }
        if (name === 'certifications' && certifications.length) {
          return (
            <View key={name} style={{ marginBottom: space }}>
              <SectionHeading title="Certifications" theme={headingTheme} />
              {certifications.map((entry, index) => (
                <View key={entry.id || index} style={{ marginBottom: 6 }}>
                  <Text style={{ fontSize: 7.3, fontFamily: bold, color: inSidebar ? '#FFFFFF' : theme.dark }}>{entry.name}</Text>
                  {entry.issuer || entry.date ? <Text style={{ fontSize: 6.5, color: theme.muted, marginTop: 1 }}>{entry.issuer}{entry.issuer && entry.date ? ' · ' : ''}{entry.date}</Text> : null}
                </View>
              ))}
            </View>
          )
        }
        return null
      })}
    </>
  )
}

function PDFMinimal({ data }: { data: ResumeData }) {
  const theme = themes.minimal
  const { personalInfo: p, summary } = data
  const contacts = [p.email, p.phone, p.location, p.linkedin, p.github].filter(Boolean)
  return (
    <Document><Page size="A4" style={{ padding: 38, fontFamily: 'Helvetica', color: theme.dark }}>
      <View style={{ marginBottom: 17 }}>
        <Text style={{ fontSize: 21, color: theme.dark, marginBottom: 3 }}>{p.fullName || 'Your Name'}</Text>
        {p.jobTitle ? <Text style={{ color: theme.accent, fontSize: 9, marginBottom: 6 }}>{p.jobTitle}</Text> : null}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {contacts.map((contact, index) => <Text key={index} style={{ fontSize: 7, color: theme.muted }}>{contact}</Text>)}
        </View>
        <View style={{ height: 1.5, backgroundColor: theme.accent, marginTop: 9 }} />
      </View>
      {summary ? <Text style={{ color: theme.body, fontSize: 8, lineHeight: 1.6, marginBottom: 9 }}>{summary}</Text> : null}
      <ResumeSections data={data} names={['experience']} theme={theme} />
      <View style={{ flexDirection: 'row', gap: 20 }}>
        <View style={{ flex: 1 }}><ResumeSections data={data} names={['education']} theme={theme} /></View>
        <View style={{ width: 150 }}><ResumeSections data={data} names={['skills']} theme={theme} /></View>
      </View>
      <ResumeSections data={data} names={['projects', 'certifications']} theme={theme} />
    </Page></Document>
  )
}

function PDFCreative({ data }: { data: ResumeData }) {
  const theme = themes.creative
  const p = data.personalInfo
  return (
    <Document><Page size="A4" style={{ padding: 0, fontFamily: 'Helvetica', color: theme.dark }}>
      <View style={{ backgroundColor: theme.accent, paddingTop: 22, paddingBottom: 17, paddingLeft: 28, paddingRight: 28 }}>
        <Text style={{ fontSize: 23, fontFamily: 'Helvetica-Bold', color: '#FFFFFF', marginBottom: 3 }}>{p.fullName || 'Your Name'}</Text>
        {p.jobTitle ? <Text style={{ fontSize: 10, color: '#FFE4E6', marginBottom: 7 }}>{p.jobTitle}</Text> : null}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {[p.email, p.phone, p.location, p.linkedin, p.github].filter(Boolean).map((value, index) => <Text key={index} style={{ color: '#FFF1F2', fontSize: 7 }}>{value}</Text>)}
        </View>
      </View>
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <View style={{ flex: 1, paddingTop: 20, paddingBottom: 20, paddingLeft: 26, paddingRight: 16 }}>
          <ResumeSections data={data} names={['summary', 'experience', 'projects']} theme={theme} />
        </View>
        <View style={{ width: 165, paddingTop: 20, paddingBottom: 20, paddingLeft: 14, paddingRight: 14, backgroundColor: '#FEF2F2', borderLeftWidth: 0.7, borderLeftColor: '#FECDD3' }}>
          <ResumeSections data={data} names={['skills', 'education', 'certifications']} theme={theme} />
        </View>
      </View>
    </Page></Document>
  )
}

function PDFAltaCV({ data }: { data: ResumeData }) {
  const theme = themes.altacv
  const p = data.personalInfo
  return (
    <Document><Page size="A4" style={{ padding: 0, fontFamily: 'Helvetica', color: theme.body }}>
      <View style={{ backgroundColor: '#FAF5F0', borderBottomWidth: 2, borderBottomColor: theme.accent, paddingTop: 22, paddingBottom: 14, paddingLeft: 26, paddingRight: 26 }}>
        <Text style={{ color: theme.dark, fontFamily: 'Helvetica-Bold', fontSize: 23 }}>{p.fullName || 'Your Name'}</Text>
        {p.jobTitle ? <Text style={{ color: '#B0522A', fontSize: 10, marginTop: 3 }}>{p.jobTitle}</Text> : null}
      </View>
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <View style={{ width: '60%', paddingTop: 20, paddingBottom: 20, paddingLeft: 26, paddingRight: 16, borderRightWidth: 0.7, borderRightColor: '#EDE0D4' }}>
          <ResumeSections data={data} names={['summary', 'experience', 'projects']} theme={theme} />
        </View>
        <View style={{ width: '40%', paddingTop: 20, paddingBottom: 20, paddingLeft: 15, paddingRight: 20 }}>
          <SectionHeading title="Contact" theme={theme} />
          <ContactList data={data} color={theme.body} />
          <ResumeSections data={data} names={['education', 'skills', 'certifications']} theme={theme} />
        </View>
      </View>
    </Page></Document>
  )
}

function PDFJakes({ data }: { data: ResumeData }) {
  const theme = themes.jakes
  const p = data.personalInfo
  return (
    <Document><Page size="A4" style={{ paddingTop: 31, paddingBottom: 30, paddingLeft: 40, paddingRight: 40, fontFamily: 'Times-Roman', color: theme.body }}>
      <View style={{ alignItems: 'center', marginBottom: 8 }}>
        <Text style={{ width: '100%', textAlign: 'center', fontFamily: 'Helvetica-Bold', color: '#000000', fontSize: 21, marginBottom: 4 }}>{p.fullName || 'Your Name'}</Text>
        <View style={{ width: '100%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 5 }}>
          {[p.location, p.phone, p.email, p.linkedin, p.github, p.website].filter(Boolean).map((value, index) => <Text key={index} style={{ fontSize: 7, color: '#333333' }}>{index > 0 ? ' | ' : ''}{value}</Text>)}
        </View>
      </View>
      <ResumeSections data={data} names={['summary', 'education', 'experience', 'projects', 'skills', 'certifications']} theme={theme} />
    </Page></Document>
  )
}

function PDFSixtySeconds({ data }: { data: ResumeData }) {
  const theme = themes.sixtyseconds
  const p = data.personalInfo
  return (
    <Document><Page size="A4" style={{ padding: 0, fontFamily: 'Helvetica', color: theme.body }}>
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <View style={{ width: 175, backgroundColor: '#1B2A3B', paddingTop: 23, paddingBottom: 20, paddingLeft: 15, paddingRight: 15 }}>
          <Text style={{ color: '#FFFFFF', fontFamily: 'Helvetica-Bold', fontSize: 14, lineHeight: 1.25, marginBottom: 4 }}>{(p.fullName || 'Your Name').split(' ').join('\n')}</Text>
          {p.jobTitle ? <Text style={{ fontSize: 7.5, color: theme.accent, marginBottom: 9 }}>{p.jobTitle}</Text> : null}
          <SectionHeading title="Contact" theme={{ ...theme, heading: 'sidebar' }} />
          <ContactList data={data} color="#E2EAF0" />
          <ResumeSections data={data} names={['skills', 'education']} theme={theme} />
        </View>
        <View style={{ flex: 1, paddingTop: 24, paddingBottom: 22, paddingLeft: 20, paddingRight: 20 }}>
          <ResumeSections data={data} names={['summary', 'experience', 'projects', 'certifications']} theme={theme} />
        </View>
      </View>
    </Page></Document>
  )
}

function PDFBerlin({ data }: { data: ResumeData }) {
  const theme = themes.berlin
  const p = data.personalInfo
  const initials = (p.fullName || 'YN').split(' ').map((word) => word[0]).join('').slice(0, 2).toUpperCase()
  return (
    <Document><Page size="A4" style={{ padding: 0, fontFamily: 'Helvetica', color: theme.body }}>
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <View style={{ width: '32%', backgroundColor: '#2B3240', paddingTop: 22, paddingBottom: 18, paddingLeft: 15, paddingRight: 15 }}>
          <View style={{ alignItems: 'center', marginBottom: 12 }}>
            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#4A6FA5', borderWidth: 2, borderColor: '#7EB8D4', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
              <Text style={{ color: '#FFFFFF', fontSize: 15, fontFamily: 'Helvetica-Bold' }}>{initials}</Text>
            </View>
            <Text style={{ color: '#FFFFFF', fontFamily: 'Helvetica-Bold', fontSize: 11, textAlign: 'center', marginBottom: 4 }}>{p.fullName || 'Your Name'}</Text>
            {p.jobTitle ? <Text style={{ color: theme.accent, fontSize: 7, textAlign: 'center' }}>{p.jobTitle}</Text> : null}
          </View>
          <SectionHeading title="Contact" theme={{ ...theme, heading: 'sidebar' }} />
          <ContactList data={data} color="#C8D6E0" />
          <ResumeSections data={data} names={['skills', 'education']} theme={theme} inSidebar />
        </View>
        <View style={{ flex: 1, paddingTop: 26, paddingBottom: 22, paddingLeft: 20, paddingRight: 20 }}>
          <ResumeSections data={data} names={['summary', 'experience', 'projects', 'certifications']} theme={theme} />
        </View>
      </View>
    </Page></Document>
  )
}

function PDFVienna({ data }: { data: ResumeData }) {
  const theme = themes.vienna
  const p = data.personalInfo
  return (
    <Document><Page size="A4" style={{ padding: 0, fontFamily: 'Times-Roman', color: theme.body }}>
      <View style={{ backgroundColor: '#6B2737', paddingTop: 23, paddingBottom: 17, paddingLeft: 28, paddingRight: 28 }}>
        <Text style={{ color: '#FFFFFF', fontFamily: 'Times-BoldItalic', fontSize: 23, marginBottom: 3 }}>{p.fullName || 'Your Name'}</Text>
        {p.jobTitle ? <Text style={{ color: '#E8B8C2', fontSize: 8, letterSpacing: 1, marginBottom: 6 }}>{p.jobTitle.toUpperCase()}</Text> : null}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 9 }}>
          {[p.email, p.phone, p.location].filter(Boolean).map((value, index) => <Text key={index} style={{ color: '#F2DDE2', fontSize: 7 }}>{value}</Text>)}
        </View>
      </View>
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <View style={{ width: '36%', backgroundColor: '#F9F4F5', paddingTop: 19, paddingBottom: 18, paddingLeft: 15, paddingRight: 13 }}>
          {(p.linkedin || p.github || p.website) ? <View style={{ marginBottom: 10 }}>
            <SectionHeading title="Links" theme={theme} />
            {[p.linkedin, p.github, p.website].filter(Boolean).map((link, index) => <Text key={index} style={{ color: theme.accent, fontSize: 6.7, marginBottom: 3 }}>{link}</Text>)}
          </View> : null}
          <ResumeSections data={data} names={['skills', 'education']} theme={theme} inSidebar />
        </View>
        <View style={{ flex: 1, paddingTop: 19, paddingBottom: 18, paddingLeft: 18, paddingRight: 20 }}>
          <ResumeSections data={data} names={['summary', 'experience', 'projects', 'certifications']} theme={theme} />
        </View>
      </View>
    </Page></Document>
  )
}

export function buildPDFVariantDocument(data: ResumeData, template: TemplateId): ReactElement | null {
  switch (template) {
    case 'minimal': return <PDFMinimal data={data} />
    case 'creative': return <PDFCreative data={data} />
    case 'altacv': return <PDFAltaCV data={data} />
    case 'jakes': return <PDFJakes data={data} />
    case 'sixtyseconds': return <PDFSixtySeconds data={data} />
    case 'berlin': return <PDFBerlin data={data} />
    case 'vienna': return <PDFVienna data={data} />
    default: return null
  }
}
