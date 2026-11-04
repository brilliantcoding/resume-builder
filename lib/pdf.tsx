import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'
import { ResumeData, TemplateId } from '@/types/resume'

const styles = StyleSheet.create({
  page: { padding: 36, fontFamily: 'Helvetica', fontSize: 9, color: '#1a1a1a', lineHeight: 1.4 },
  headerModern: { backgroundColor: '#4f46e5', color: 'white', padding: 24, marginBottom: 0 },
  name: { fontSize: 20, fontFamily: 'Helvetica-Bold', marginBottom: 4 },
  jobTitle: { fontSize: 10, marginTop: 0, marginBottom: 0 },
  sectionTitle: { fontSize: 10, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 1, borderBottomWidth: 1, borderBottomColor: '#4f46e5', paddingBottom: 3, marginBottom: 8, marginTop: 14, color: '#4f46e5' },
  sectionTitleClassic: { fontSize: 10, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 1, borderBottomWidth: 2, borderBottomColor: '#1a1a1a', paddingBottom: 3, marginBottom: 8, marginTop: 14 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  bold: { fontFamily: 'Helvetica-Bold' },
  muted: { color: '#6b7280', fontSize: 8 },
  bullet: { marginBottom: 2 },
  contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, fontSize: 8, marginTop: 6 },
  chip: { backgroundColor: '#eef2ff', color: '#4f46e5', paddingTop: 2, paddingBottom: 2, paddingLeft: 6, paddingRight: 6, borderRadius: 10, fontSize: 8, marginRight: 4, marginBottom: 4 },
})

function PDFModern({ data }: { data: ResumeData }) {
  const { personalInfo: p, summary, experience, education, skills, projects, certifications } = data
  return (
    <Document>
      <Page size="A4" style={[styles.page, { padding: 0 }]}>
        {/* Header — explicit padding, no shorthand strings, no opacity */}
        <View style={{ backgroundColor: '#4f46e5', flexDirection: 'column', paddingTop: 20, paddingBottom: 16, paddingLeft: 36, paddingRight: 36 }}>
          <Text style={{ fontSize: 20, fontFamily: 'Helvetica-Bold', color: 'white', marginBottom: 4 }}>{p.fullName || 'Your Name'}</Text>
          {p.jobTitle ? <Text style={{ fontSize: 10, color: '#c4b5fd', marginBottom: 0 }}>{p.jobTitle}</Text> : null}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8, gap: 10 }}>
            {p.email && <Text style={{ color: '#e0e7ff', fontSize: 8 }}>{p.email}</Text>}
            {p.phone && <Text style={{ color: '#e0e7ff', fontSize: 8 }}>{p.phone}</Text>}
            {p.location && <Text style={{ color: '#e0e7ff', fontSize: 8 }}>{p.location}</Text>}
            {p.linkedin && <Text style={{ color: '#e0e7ff', fontSize: 8 }}>{p.linkedin}</Text>}
          </View>
        </View>

        <View style={{ paddingTop: 20, paddingBottom: 36, paddingLeft: 36, paddingRight: 36 }}>
          {summary ? <View><Text style={styles.sectionTitle}>Summary</Text><Text style={{ fontSize: 9, lineHeight: 1.6 }}>{summary}</Text></View> : null}

          {experience.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>Experience</Text>
              {experience.map((exp, i) => (
                <View key={i} style={{ marginBottom: 10 }}>
                  <View style={styles.row}>
                    <Text style={styles.bold}>{exp.position}</Text>
                    <Text style={styles.muted}>{exp.startDate}{exp.startDate ? ' – ' : ''}{exp.current ? 'Present' : exp.endDate}</Text>
                  </View>
                  <Text style={{ color: '#4f46e5', fontSize: 8, marginBottom: 4 }}>{exp.company}</Text>
                  {exp.bullets.filter(b => b.trim()).map((b, j) => (
                    <Text key={j} style={[styles.bullet, { paddingLeft: 8, fontSize: 8.5 }]}>• {b}</Text>
                  ))}
                </View>
              ))}
            </View>
          )}

          {education.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>Education</Text>
              {education.map((edu, i) => (
                <View key={i} style={{ marginBottom: 8 }}>
                  <View style={styles.row}>
                    <Text style={styles.bold}>{edu.institution}</Text>
                    <Text style={styles.muted}>{edu.startDate}{edu.startDate && edu.endDate ? ' – ' : ''}{edu.endDate}</Text>
                  </View>
                  <Text style={{ fontSize: 8 }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}{edu.gpa ? ` · GPA ${edu.gpa}` : ''}</Text>
                </View>
              ))}
            </View>
          )}

          {skills.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>Skills</Text>
              {skills.map((group, i) => (
                <View key={i} style={{ marginBottom: 6 }}>
                  {group.category && <Text style={[styles.bold, { fontSize: 8.5, marginBottom: 3 }]}>{group.category}</Text>}
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    {group.skills.map((skill, j) => <Text key={j} style={styles.chip}>{skill}</Text>)}
                  </View>
                </View>
              ))}
            </View>
          )}

          {projects.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>Projects</Text>
              {projects.map((proj, i) => (
                <View key={i} style={{ marginBottom: 8 }}>
                  <View style={styles.row}>
                    <Text style={styles.bold}>{proj.name}</Text>
                    {proj.technologies.length > 0 && <Text style={styles.muted}>{proj.technologies.join(', ')}</Text>}
                  </View>
                  <Text style={{ fontSize: 8.5 }}>{proj.description}</Text>
                </View>
              ))}
            </View>
          )}

          {certifications.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>Certifications</Text>
              {certifications.map((cert, i) => (
                <Text key={i} style={{ paddingLeft: 8, fontSize: 8.5, marginBottom: 2 }}>
                  • {cert.name}{cert.issuer ? ` (${cert.issuer})` : ''}
                </Text>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  )
}

function PDFClassic({ data }: { data: ResumeData }) {
  const { personalInfo: p, summary, experience, education, skills, projects, certifications } = data
  return (
    <Document>
      <Page size="A4" style={[styles.page, { fontFamily: 'Times-Roman' }]}>
        <View style={{ flexDirection: 'column', alignItems: 'center', marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#ccc', paddingBottom: 12 }}>
          <Text style={{ fontSize: 22, fontFamily: 'Times-Bold', textAlign: 'center', marginBottom: 2 }}>{p.fullName || 'Your Name'}</Text>
          {p.jobTitle ? <Text style={{ fontSize: 10, color: '#555', fontFamily: 'Times-Italic', textAlign: 'center', marginBottom: 4 }}>{p.jobTitle}</Text> : null}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginTop: 4 }}>
            {[p.email, p.phone, p.location, p.linkedin].filter(Boolean).map((v, i) => (
              <Text key={i} style={{ fontSize: 8, color: '#555' }}>{v}</Text>
            ))}
          </View>
        </View>
        {summary && <View><Text style={styles.sectionTitleClassic}>Summary</Text><Text style={{ fontSize: 9 }}>{summary}</Text></View>}
        {experience.length > 0 && <View><Text style={styles.sectionTitleClassic}>Professional Experience</Text>{experience.map((exp, i) => (<View key={i} style={{ marginBottom: 10 }}><View style={styles.row}><Text style={{ fontFamily: 'Times-Bold', fontSize: 10 }}>{exp.position} — {exp.company}</Text><Text style={styles.muted}>{exp.startDate}{exp.startDate ? '–' : ''}{exp.current ? 'Present' : exp.endDate}</Text></View>{exp.bullets.filter(b => b.trim()).map((b, j) => (<Text key={j} style={{ paddingLeft: 10, fontSize: 8.5, marginBottom: 2 }}>• {b}</Text>))}</View>))}</View>}
        {education.length > 0 && <View><Text style={styles.sectionTitleClassic}>Education</Text>{education.map((edu, i) => (<View key={i} style={[styles.row, { marginBottom: 8 }]}><View><Text style={{ fontFamily: 'Times-Bold', fontSize: 10 }}>{edu.institution}</Text><Text style={{ fontSize: 8.5 }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</Text></View><Text style={styles.muted}>{edu.startDate}{edu.startDate && edu.endDate ? '–' : ''}{edu.endDate}</Text></View>))}</View>}
        {skills.length > 0 && <View><Text style={styles.sectionTitleClassic}>Skills</Text>{skills.map((g, i) => (<View key={i} style={{ flexDirection: 'row', marginBottom: 4 }}>{g.category && <Text style={{ fontFamily: 'Times-Bold', fontSize: 8.5, width: 90 }}>{g.category}: </Text>}<Text style={{ fontSize: 8.5 }}>{g.skills.join(', ')}</Text></View>))}</View>}
        {certifications.length > 0 && <View><Text style={styles.sectionTitleClassic}>Certifications / Accomplishments</Text>{certifications.map((cert, i) => (<Text key={i} style={{ paddingLeft: 10, fontSize: 8.5, marginBottom: 2 }}>• {cert.name}{cert.issuer ? ` (${cert.issuer})` : ''}</Text>))}</View>}
      </Page>
    </Document>
  )
}

function PDFProfessional({ data }: { data: ResumeData }) {
  const { personalInfo: p, summary, experience, education, skills, projects, certifications } = data
  const contactParts = [p.phone, p.email, p.linkedin, p.github, p.website].filter(Boolean) as string[]
  const hasCategories = skills.some(g => g.category && g.category.trim())
  const allSkills = skills.flatMap(g => g.skills)

  return (
    <Document>
      <Page size="A4" style={[styles.page, { fontFamily: 'Times-Roman', padding: 36 }]}>
        {/* Header */}
        <View style={{ flexDirection: 'column', alignItems: 'center', marginBottom: 10 }}>
          <Text style={{ fontSize: 24, fontFamily: 'Times-Bold', letterSpacing: 2, textAlign: 'center', marginBottom: 2 }}>{p.fullName || 'Your Name'}</Text>
          {p.jobTitle ? <Text style={{ fontSize: 10, fontFamily: 'Times-Italic', textAlign: 'center', marginBottom: 2 }}>{p.jobTitle}</Text> : null}
          {p.location ? <Text style={{ fontSize: 9, textAlign: 'center', marginBottom: 2 }}>{p.location}</Text> : null}
          {contactParts.length > 0 ? <Text style={{ fontSize: 8, color: '#333', textAlign: 'center' }}>{contactParts.join('  •  ')}</Text> : null}
        </View>

        {summary ? (
          <View>
            <Text style={styles.sectionTitleClassic}>Summary</Text>
            <Text style={{ fontSize: 9, lineHeight: 1.6, marginTop: 4 }}>{summary}</Text>
          </View>
        ) : null}

        {allSkills.length > 0 && !hasCategories && (
          <View>
            <Text style={styles.sectionTitleClassic}>Key Skills</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 }}>
              {allSkills.map((skill, i) => (
                <Text key={i} style={{ fontSize: 8.5, width: '25%', marginBottom: 2 }}>• {skill}</Text>
              ))}
            </View>
          </View>
        )}

        {experience.length > 0 && (
          <View>
            <Text style={styles.sectionTitleClassic}>Experience</Text>
            {experience.map((exp, i) => (
              <View key={i} style={{ marginTop: 8 }}>
                <View style={styles.row}>
                  <Text style={{ fontFamily: 'Times-Bold', fontSize: 10 }}>{exp.company}</Text>
                  <Text style={styles.muted}>{exp.startDate}{exp.startDate ? ' – ' : ''}{exp.current ? 'Present' : exp.endDate}</Text>
                </View>
                <Text style={{ fontFamily: 'Times-Italic', fontSize: 9, marginBottom: 3 }}>{exp.position}</Text>
                {exp.bullets.filter(b => b.trim()).map((b, j) => (
                  <Text key={j} style={{ paddingLeft: 10, fontSize: 8.5, marginBottom: 2 }}>• {b}</Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {hasCategories && (
          <View>
            <Text style={styles.sectionTitleClassic}>Technical Skills</Text>
            {skills.map((g, i) => (
              <View key={i} style={{ flexDirection: 'row', marginBottom: 2 }}>
                {g.category && <Text style={{ fontFamily: 'Times-Bold', fontSize: 8.5 }}>{g.category}: </Text>}
                <Text style={{ fontSize: 8.5, flex: 1 }}>{g.skills.join(', ')}</Text>
              </View>
            ))}
          </View>
        )}

        {certifications.length > 0 && (
          <View>
            <Text style={styles.sectionTitleClassic}>Certifications / Accomplishments</Text>
            {certifications.map((cert, i) => (
              <Text key={i} style={{ paddingLeft: 10, fontSize: 8.5, marginBottom: 2 }}>
                • {cert.name}{cert.issuer ? ` (${cert.issuer})` : ''}
              </Text>
            ))}
          </View>
        )}

        {projects.length > 0 && (
          <View>
            <Text style={styles.sectionTitleClassic}>Projects</Text>
            {projects.map((proj, i) => (
              <View key={i} style={{ marginTop: 6 }}>
                <View style={styles.row}>
                  <Text style={{ fontFamily: 'Times-Bold', fontSize: 10 }}>{proj.name}</Text>
                  {proj.technologies.length > 0 && <Text style={styles.muted}>{proj.technologies.join(', ')}</Text>}
                </View>
                <Text style={{ fontSize: 8.5 }}>{proj.description}</Text>
              </View>
            ))}
          </View>
        )}

        {education.length > 0 && (
          <View>
            <Text style={styles.sectionTitleClassic}>Education</Text>
            {education.map((edu, i) => (
              <View key={i} style={{ marginTop: 8 }}>
                <View style={styles.row}>
                  <Text style={{ fontFamily: 'Times-Bold', fontSize: 10 }}>{edu.institution}</Text>
                  <Text style={styles.muted}>{edu.startDate}{edu.startDate && edu.endDate ? ' – ' : ''}{edu.endDate}</Text>
                </View>
                <Text style={{ fontFamily: 'Times-Italic', fontSize: 9 }}>
                  {edu.degree}{edu.field ? ` in ${edu.field}` : ''}{edu.honors ? `, ${edu.honors}` : ''}{edu.gpa ? `  GPA: ${edu.gpa}` : ''}
                </Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  )
}

function PDFExecutive({ data }: { data: ResumeData }) {
  const { personalInfo: p, summary, experience, education, skills, projects, certifications } = data
  const NAVY = '#1e3558'
  const ACCENT = '#4f8ef7'
  return (
    <Document>
      <Page size="A4" style={[styles.page, { padding: 0, flexDirection: 'row' }]}>
        {/* Sidebar */}
        <View style={{ width: 150, backgroundColor: NAVY, padding: 20, minHeight: '100%' }}>
          <Text style={{ fontSize: 14, fontFamily: 'Helvetica-Bold', color: 'white', marginBottom: 2 }}>{p.fullName || 'Your Name'}</Text>
          {p.jobTitle ? <Text style={{ fontSize: 8, color: 'rgba(255,255,255,0.7)', fontFamily: 'Helvetica-Oblique', marginBottom: 10 }}>{p.jobTitle}</Text> : null}
          <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', color: ACCENT, letterSpacing: 1, marginBottom: 5, marginTop: 8 }}>CONTACT</Text>
          {[p.location, p.phone, p.email, p.linkedin, p.github].filter(Boolean).map((v, i) => (
            <Text key={i} style={{ fontSize: 7, color: 'rgba(255,255,255,0.8)', marginBottom: 3 }}>{v}</Text>
          ))}
          {skills.length > 0 ? <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', color: ACCENT, letterSpacing: 1, marginBottom: 5, marginTop: 12 }}>SKILLS</Text> : null}
          {skills.map((g, i) => (
            <View key={i} style={{ marginBottom: 6 }}>
              {g.category ? <Text style={{ fontSize: 6.5, color: 'rgba(255,255,255,0.5)', fontFamily: 'Helvetica-Bold', marginBottom: 2 }}>{g.category.toUpperCase()}</Text> : null}
              {g.skills.map((s, j) => <Text key={j} style={{ fontSize: 7, color: 'rgba(255,255,255,0.82)', marginBottom: 1.5 }}>• {s}</Text>)}
            </View>
          ))}
          {certifications.length > 0 ? <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', color: ACCENT, letterSpacing: 1, marginBottom: 5, marginTop: 12 }}>CERTIFICATIONS</Text> : null}
          {certifications.map((c, i) => (
            <View key={i} style={{ marginBottom: 6 }}>
              <Text style={{ fontSize: 7, color: 'rgba(255,255,255,0.9)', fontFamily: 'Helvetica-Bold' }}>{c.name}</Text>
              <Text style={{ fontSize: 6.5, color: 'rgba(255,255,255,0.55)' }}>{c.issuer}{c.date ? ` · ${c.date}` : ''}</Text>
            </View>
          ))}
        </View>
        {/* Main */}
        <View style={{ flex: 1, paddingTop: 24, paddingBottom: 24, paddingLeft: 22, paddingRight: 22 }}>
          {summary ? <View><Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', color: NAVY, letterSpacing: 1, borderBottomWidth: 1.5, borderBottomColor: ACCENT, paddingBottom: 2, marginBottom: 6 }}>Professional Summary</Text><Text style={{ fontSize: 8.5, lineHeight: 1.7, color: '#444', marginBottom: 14 }}>{summary}</Text></View> : null}
          {experience.length > 0 ? <View><Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', color: NAVY, letterSpacing: 1, borderBottomWidth: 1.5, borderBottomColor: ACCENT, paddingBottom: 2, marginBottom: 8 }}>Experience</Text>{experience.map((exp, i) => (<View key={i} style={{ marginBottom: 10, paddingLeft: 8, borderLeftWidth: 2, borderLeftColor: '#e5e7eb' }}><View style={styles.row}><Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 9.5 }}>{exp.position}</Text><Text style={styles.muted}>{exp.startDate}{exp.startDate ? ' – ' : ''}{exp.current ? 'Present' : exp.endDate}</Text></View><Text style={{ fontSize: 8, color: ACCENT, fontFamily: 'Helvetica-Bold', marginBottom: 3 }}>{exp.company}</Text>{exp.bullets.filter(b => b.trim()).map((b, j) => <Text key={j} style={{ fontSize: 8, paddingLeft: 6, marginBottom: 1.5, color: '#444' }}>• {b}</Text>)}</View>))}</View> : null}
          {education.length > 0 ? <View><Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', color: NAVY, letterSpacing: 1, borderBottomWidth: 1.5, borderBottomColor: ACCENT, paddingBottom: 2, marginBottom: 8, marginTop: 12 }}>Education</Text>{education.map((edu, i) => (<View key={i} style={{ marginBottom: 8, paddingLeft: 8, borderLeftWidth: 2, borderLeftColor: '#e5e7eb' }}><View style={styles.row}><Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 9.5 }}>{edu.institution}</Text><Text style={styles.muted}>{edu.startDate}{edu.startDate && edu.endDate ? ' – ' : ''}{edu.endDate}</Text></View><Text style={{ fontSize: 8 }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</Text></View>))}</View> : null}
        </View>
      </Page>
    </Document>
  )
}

function PDFTimeline({ data }: { data: ResumeData }) {
  const { personalInfo: p, summary, experience, education, skills, projects, certifications } = data
  const TEAL = '#0d9488'
  return (
    <Document>
      <Page size="A4" style={[styles.page, { fontFamily: 'Helvetica' }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', borderBottomWidth: 2.5, borderBottomColor: TEAL, paddingBottom: 10, marginBottom: 12 }}>
          <View>
            <Text style={{ fontSize: 22, fontFamily: 'Helvetica-Bold', color: '#111', marginBottom: 2 }}>{p.fullName || 'Your Name'}</Text>
            {p.jobTitle ? <Text style={{ fontSize: 10, color: TEAL, fontFamily: 'Helvetica-Bold' }}>{p.jobTitle}</Text> : null}
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            {[p.email, p.phone, p.location, p.linkedin].filter(Boolean).map((v, i) => (
              <Text key={i} style={{ fontSize: 7.5, color: '#555', marginBottom: 1.5 }}>{v}</Text>
            ))}
          </View>
        </View>
        {summary ? <View style={{ marginBottom: 12 }}><Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: TEAL, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 5 }}>Summary</Text><Text style={{ fontSize: 8.5, lineHeight: 1.7, color: '#444', marginLeft: 18 }}>{summary}</Text></View> : null}
        {experience.length > 0 ? <View><Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: TEAL, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>Experience</Text>{experience.map((exp, i) => (<View key={i} style={{ flexDirection: 'row', marginBottom: 10 }}><View style={{ width: 10, alignItems: 'center', marginRight: 8 }}><View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: TEAL, marginTop: 3 }} /><View style={{ width: 1.5, flex: 1, backgroundColor: '#ccfbf1', marginTop: 2 }} /></View><View style={{ flex: 1 }}><View style={styles.row}><Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 9.5 }}>{exp.position}</Text><Text style={styles.muted}>{exp.startDate}{exp.startDate ? ' – ' : ''}{exp.current ? 'Present' : exp.endDate}</Text></View><Text style={{ fontSize: 8, color: TEAL, fontFamily: 'Helvetica-Bold', marginBottom: 3 }}>{exp.company}</Text>{exp.bullets.filter(b => b.trim()).map((b, j) => <Text key={j} style={{ fontSize: 8, paddingLeft: 4, marginBottom: 1.5, color: '#444' }}>• {b}</Text>)}</View></View>))}</View> : null}
        {education.length > 0 ? <View style={{ marginTop: 8 }}><Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: TEAL, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>Education</Text>{education.map((edu, i) => (<View key={i} style={{ flexDirection: 'row', marginBottom: 8 }}><View style={{ width: 10, alignItems: 'center', marginRight: 8 }}><View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: TEAL }} /></View><View style={{ flex: 1 }}><View style={styles.row}><Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 9.5 }}>{edu.institution}</Text><Text style={styles.muted}>{edu.startDate}{edu.startDate && edu.endDate ? ' – ' : ''}{edu.endDate}</Text></View><Text style={{ fontSize: 8 }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</Text></View></View>))}</View> : null}
        {skills.length > 0 ? <View style={{ marginTop: 10 }}><Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: TEAL, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 }}>Skills</Text>{skills.map((g, i) => (<View key={i} style={{ marginBottom: 5, marginLeft: 18 }}>{g.category ? <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 8, marginBottom: 2 }}>{g.category}</Text> : null}<Text style={{ fontSize: 8 }}>{g.skills.join('  ·  ')}</Text></View>))}</View> : null}
      </Page>
    </Document>
  )
}

function PDFElegant({ data }: { data: ResumeData }) {
  const { personalInfo: p, summary, experience, education, skills, projects, certifications } = data
  const GOLD = '#92712a'
  return (
    <Document>
      <Page size="A4" style={[styles.page, { fontFamily: 'Times-Roman', padding: 46 }]}>
        <View style={{ alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ fontSize: 26, fontFamily: 'Times-Bold', letterSpacing: 4, marginBottom: 4 }}>{p.fullName || 'Your Name'}</Text>
          {p.jobTitle ? <Text style={{ fontSize: 9, color: GOLD, letterSpacing: 2, marginBottom: 8 }}>{p.jobTitle.toUpperCase()}</Text> : null}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 14 }}>
            {[p.phone, p.email, p.location, p.linkedin].filter(Boolean).map((v, i) => (
              <Text key={i} style={{ fontSize: 7.5, color: '#666' }}>{v}</Text>
            ))}
          </View>
          <View style={{ width: 50, height: 1.5, backgroundColor: GOLD, marginTop: 12 }} />
        </View>
        {summary ? <View style={{ marginBottom: 12 }}><View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}><View style={{ flex: 1, height: 0.5, backgroundColor: GOLD, opacity: 0.4 }} /><Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2.5, marginHorizontal: 8 }}>PROFILE</Text><View style={{ flex: 1, height: 0.5, backgroundColor: GOLD, opacity: 0.4 }} /></View><Text style={{ fontSize: 8.5, lineHeight: 1.85, color: '#444' }}>{summary}</Text></View> : null}
        {experience.length > 0 ? <View><View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, marginTop: 14 }}><View style={{ flex: 1, height: 0.5, backgroundColor: GOLD, opacity: 0.4 }} /><Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2.5, marginHorizontal: 8 }}>EXPERIENCE</Text><View style={{ flex: 1, height: 0.5, backgroundColor: GOLD, opacity: 0.4 }} /></View>{experience.map((exp, i) => (<View key={i} style={{ marginBottom: 12 }}><View style={styles.row}><Text style={{ fontFamily: 'Times-Bold', fontSize: 10 }}>{exp.position}</Text><Text style={{ fontSize: 8, color: '#888', fontFamily: 'Times-Italic' }}>{exp.startDate}{exp.startDate ? ' – ' : ''}{exp.current ? 'Present' : exp.endDate}</Text></View><Text style={{ fontSize: 8.5, color: GOLD, fontFamily: 'Times-Italic', marginBottom: 4 }}>{exp.company}</Text>{exp.bullets.filter(b => b.trim()).map((b, j) => <Text key={j} style={{ fontSize: 8, paddingLeft: 10, marginBottom: 2, color: '#444' }}>— {b}</Text>)}</View>))}</View> : null}
        {education.length > 0 ? <View><View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, marginTop: 14 }}><View style={{ flex: 1, height: 0.5, backgroundColor: GOLD, opacity: 0.4 }} /><Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2.5, marginHorizontal: 8 }}>EDUCATION</Text><View style={{ flex: 1, height: 0.5, backgroundColor: GOLD, opacity: 0.4 }} /></View>{education.map((edu, i) => (<View key={i} style={[styles.row, { marginBottom: 8 }]}><View><Text style={{ fontFamily: 'Times-Bold', fontSize: 10 }}>{edu.institution}</Text><Text style={{ fontSize: 8.5, fontFamily: 'Times-Italic', color: '#666' }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</Text></View><Text style={{ fontSize: 8, color: '#888', fontFamily: 'Times-Italic' }}>{edu.startDate}{edu.startDate && edu.endDate ? ' – ' : ''}{edu.endDate}</Text></View>))}</View> : null}
        {skills.length > 0 ? <View style={{ marginTop: 14 }}><View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}><View style={{ flex: 1, height: 0.5, backgroundColor: GOLD, opacity: 0.4 }} /><Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2.5, marginHorizontal: 8 }}>SKILLS</Text><View style={{ flex: 1, height: 0.5, backgroundColor: GOLD, opacity: 0.4 }} /></View>{skills.map((g, i) => (<View key={i} style={{ flexDirection: 'row', marginBottom: 4 }}>{g.category ? <Text style={{ fontFamily: 'Times-Italic', fontSize: 8.5, color: GOLD, width: 100 }}>{g.category}: </Text> : null}<Text style={{ fontSize: 8.5, flex: 1 }}>{g.skills.join('  ·  ')}</Text></View>))}</View> : null}
        {certifications.length > 0 ? <View style={{ marginTop: 14 }}><View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}><View style={{ flex: 1, height: 0.5, backgroundColor: GOLD, opacity: 0.4 }} /><Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2.5, marginHorizontal: 8 }}>CERTIFICATIONS</Text><View style={{ flex: 1, height: 0.5, backgroundColor: GOLD, opacity: 0.4 }} /></View>{certifications.map((c, i) => (<View key={i} style={[styles.row, { marginBottom: 5 }]}><Text style={{ fontFamily: 'Times-Bold', fontSize: 9 }}>{c.name}{c.issuer ? <Text style={{ fontFamily: 'Times-Italic', color: '#888' }}> — {c.issuer}</Text> : null}</Text>{c.date ? <Text style={{ fontSize: 8, color: '#888', fontFamily: 'Times-Italic' }}>{c.date}</Text> : null}</View>))}</View> : null}
      </Page>
    </Document>
  )
}

function PDFCompact({ data }: { data: ResumeData }) {
  const { personalInfo: p, summary, experience, education, skills, projects, certifications } = data
  const VIOLET = '#5b21b6'
  return (
    <Document>
      <Page size="A4" style={[styles.page, { padding: 0 }]}>
        {/* Header bar */}
        <View style={{ backgroundColor: VIOLET, paddingTop: 18, paddingBottom: 18, paddingLeft: 26, paddingRight: 26, flexDirection: 'column' }}>
          <Text style={{ fontSize: 20, fontFamily: 'Helvetica-Bold', color: 'white', marginBottom: 3 }}>{p.fullName || 'Your Name'}</Text>
          {p.jobTitle ? <Text style={{ fontSize: 9, color: '#ddd6fe', marginBottom: 6 }}>{p.jobTitle}</Text> : null}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {[p.phone, p.email, p.location, p.linkedin].filter(Boolean).map((v, i) => (
              <Text key={i} style={{ fontSize: 7.5, color: 'rgba(255,255,255,0.85)' }}>{v}</Text>
            ))}
          </View>
        </View>
        {/* Body */}
        <View style={{ flexDirection: 'row', flex: 1 }}>
          {/* Left col */}
          <View style={{ width: 160, backgroundColor: '#faf9ff', borderRightWidth: 1, borderRightColor: '#ede9fe', paddingTop: 14, paddingBottom: 14, paddingLeft: 12, paddingRight: 12 }}>
            {skills.length > 0 ? <View><View style={{ backgroundColor: VIOLET, paddingTop: 3, paddingBottom: 3, paddingLeft: 8, paddingRight: 8, marginBottom: 6, marginTop: 8, borderRadius: 2 }}><Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', color: 'white', letterSpacing: 1 }}>SKILLS</Text></View>{skills.map((g, i) => (<View key={i} style={{ marginBottom: 7 }}>{g.category ? <Text style={{ fontSize: 6.5, color: VIOLET, fontFamily: 'Helvetica-Bold', marginBottom: 2 }}>{g.category.toUpperCase()}</Text> : null}<Text style={{ fontSize: 7.5 }}>{g.skills.join(', ')}</Text></View>))}</View> : null}
            {education.length > 0 ? <View><View style={{ backgroundColor: VIOLET, paddingTop: 3, paddingBottom: 3, paddingLeft: 8, paddingRight: 8, marginBottom: 6, marginTop: 12, borderRadius: 2 }}><Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', color: 'white', letterSpacing: 1 }}>EDUCATION</Text></View>{education.map((edu, i) => (<View key={i} style={{ marginBottom: 8 }}><Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 8 }}>{edu.institution}</Text><Text style={{ fontSize: 7, color: '#555' }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</Text><Text style={{ fontSize: 7, color: '#888' }}>{edu.startDate}{edu.startDate && edu.endDate ? ' – ' : ''}{edu.endDate}</Text></View>))}</View> : null}
            {certifications.length > 0 ? <View><View style={{ backgroundColor: VIOLET, paddingTop: 3, paddingBottom: 3, paddingLeft: 8, paddingRight: 8, marginBottom: 6, marginTop: 12, borderRadius: 2 }}><Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', color: 'white', letterSpacing: 1 }}>CERTIFICATIONS</Text></View>{certifications.map((c, i) => (<View key={i} style={{ marginBottom: 7 }}><Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 7.5 }}>{c.name}</Text><Text style={{ fontSize: 7, color: '#888' }}>{c.issuer}{c.date ? ` · ${c.date}` : ''}</Text></View>))}</View> : null}
          </View>
          {/* Right col */}
          <View style={{ flex: 1, paddingTop: 14, paddingBottom: 14, paddingLeft: 18, paddingRight: 18 }}>
            {summary ? <View style={{ marginBottom: 12 }}><Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: VIOLET, textTransform: 'uppercase', letterSpacing: 1, borderBottomWidth: 1.5, borderBottomColor: VIOLET, paddingBottom: 2, marginBottom: 5 }}>Summary</Text><Text style={{ fontSize: 8.5, lineHeight: 1.7, color: '#444' }}>{summary}</Text></View> : null}
            {experience.length > 0 ? <View><Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: VIOLET, textTransform: 'uppercase', letterSpacing: 1, borderBottomWidth: 1.5, borderBottomColor: VIOLET, paddingBottom: 2, marginBottom: 6 }}>Experience</Text>{experience.map((exp, i) => (<View key={i} style={{ marginBottom: 10 }}><View style={styles.row}><Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 9 }}>{exp.position}</Text><Text style={styles.muted}>{exp.startDate}{exp.startDate ? ' – ' : ''}{exp.current ? 'Present' : exp.endDate}</Text></View><Text style={{ fontSize: 7.5, color: VIOLET, fontFamily: 'Helvetica-Bold', marginBottom: 2 }}>{exp.company}</Text>{exp.bullets.filter(b => b.trim()).map((b, j) => <Text key={j} style={{ fontSize: 7.5, paddingLeft: 6, marginBottom: 1, color: '#444' }}>• {b}</Text>)}</View>))}</View> : null}
            {projects.length > 0 ? <View style={{ marginTop: 10 }}><Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: VIOLET, textTransform: 'uppercase', letterSpacing: 1, borderBottomWidth: 1.5, borderBottomColor: VIOLET, paddingBottom: 2, marginBottom: 6 }}>Projects</Text>{projects.map((proj, i) => (<View key={i} style={{ marginBottom: 8 }}><View style={styles.row}><Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 9 }}>{proj.name}</Text>{proj.technologies.length > 0 ? <Text style={styles.muted}>{proj.technologies.join(', ')}</Text> : null}</View><Text style={{ fontSize: 8 }}>{proj.description}</Text></View>))}</View> : null}
          </View>
        </View>
      </Page>
    </Document>
  )
}

type PDFVariantTemplate = Exclude<TemplateId, 'modern' | 'classic' | 'professional' | 'executive' | 'timeline' | 'elegant' | 'compact'>

const pdfVariants: Record<PDFVariantTemplate, {
  accent: string
  layout: 'banner' | 'centered' | 'minimal' | 'sidebar'
  serif?: boolean
  compact?: boolean
}> = {
  minimal: { accent: '#334155', layout: 'minimal', compact: true },
  creative: { accent: '#0f766e', layout: 'banner' },
  altacv: { accent: '#6d28d9', layout: 'sidebar' },
  jakes: { accent: '#111827', layout: 'centered', compact: true },
  sixtyseconds: { accent: '#047857', layout: 'sidebar', compact: true },
  berlin: { accent: '#155e75', layout: 'banner', compact: true },
  tokyo: { accent: '#be123c', layout: 'centered' },
  vienna: { accent: '#78350f', layout: 'minimal', serif: true },
}

function PDFVariant({ data, template }: { data: ResumeData; template: PDFVariantTemplate }) {
  const { personalInfo: p, summary, experience, education, skills, projects, certifications } = data
  const variant = pdfVariants[template]
  const font = variant.serif ? 'Times-Roman' : 'Helvetica'
  const boldFont = variant.serif ? 'Times-Bold' : 'Helvetica-Bold'
  const section = (name: string) => (
    <Text style={{
      fontSize: variant.compact ? 9 : 10,
      fontFamily: boldFont,
      color: variant.accent,
      textTransform: 'uppercase',
      letterSpacing: 1,
      borderBottomWidth: variant.layout === 'minimal' ? 0.5 : 1.5,
      borderBottomColor: variant.accent,
      paddingBottom: 3,
      marginBottom: 7,
      marginTop: variant.compact ? 10 : 14,
    }}>{name}</Text>
  )

  const contact = [p.email, p.phone, p.location, p.website, p.linkedin, p.github].filter(Boolean)
  const skillsSection = skills.length > 0 ? (
    <View>{section('Skills')}{skills.map((group, i) => (
      <View key={i} style={{ marginBottom: 6 }}>
        {group.category ? <Text style={{ fontFamily: boldFont, fontSize: 8, marginBottom: 2 }}>{group.category}</Text> : null}
        <Text style={{ fontSize: 8 }}>{group.skills.join(', ')}</Text>
      </View>
    ))}</View>
  ) : null
  const educationSection = education.length > 0 ? (
    <View>{section('Education')}{education.map((entry, i) => (
      <View key={i} style={{ marginBottom: 7 }}>
        <Text style={{ fontFamily: boldFont, fontSize: 8.5 }}>{entry.institution}</Text>
        <Text style={{ fontSize: 8 }}>{entry.degree}{entry.field ? ` in ${entry.field}` : ''}</Text>
        <Text style={{ fontSize: 7.5, color: '#64748b' }}>{entry.startDate}{entry.startDate && entry.endDate ? ' – ' : ''}{entry.endDate}</Text>
      </View>
    ))}</View>
  ) : null
  const certificationsSection = certifications.length > 0 ? (
    <View>{section('Certifications')}{certifications.map((entry, i) => (
      <View key={i} style={{ marginBottom: 6 }}>
        <Text style={{ fontFamily: boldFont, fontSize: 8 }}>{entry.name}</Text>
        <Text style={{ fontSize: 7.5, color: '#64748b' }}>{entry.issuer}{entry.date ? ` · ${entry.date}` : ''}</Text>
      </View>
    ))}</View>
  ) : null
  const mainContent = (
    <View style={variant.layout === 'sidebar' ? { flex: 1, padding: 22 } : { padding: 28 }}>
      {summary ? <View>{section('Profile')}<Text style={{ fontSize: 8.5, lineHeight: 1.5 }}>{summary}</Text></View> : null}
      {experience.length > 0 ? <View>{section('Experience')}{experience.map((entry, i) => (
        <View key={i} style={{ marginBottom: variant.compact ? 7 : 10 }}>
          <View style={styles.row}>
            <Text style={{ fontFamily: boldFont, fontSize: 9 }}>{entry.position}</Text>
            <Text style={styles.muted}>{entry.startDate}{entry.startDate ? ' – ' : ''}{entry.current ? 'Present' : entry.endDate}</Text>
          </View>
          <Text style={{ color: variant.accent, fontSize: 8, marginBottom: 3 }}>{entry.company}</Text>
          {entry.bullets.filter((bullet) => bullet.trim()).map((bullet, j) => (
            <Text key={j} style={{ fontSize: 8, marginBottom: 2, paddingLeft: 7 }}>• {bullet}</Text>
          ))}
        </View>
      ))}</View> : null}
      {variant.layout !== 'sidebar' ? <>{educationSection}{skillsSection}</> : null}
      {projects.length > 0 ? <View>{section('Projects')}{projects.map((entry, i) => (
        <View key={i} style={{ marginBottom: 7 }}>
          <View style={styles.row}>
            <Text style={{ fontFamily: boldFont, fontSize: 8.5 }}>{entry.name}</Text>
            {entry.technologies.length > 0 ? <Text style={styles.muted}>{entry.technologies.join(', ')}</Text> : null}
          </View>
          <Text style={{ fontSize: 8 }}>{entry.description}</Text>
        </View>
      ))}</View> : null}
      {variant.layout !== 'sidebar' ? certificationsSection : null}
    </View>
  )

  return (
    <Document>
      <Page size="A4" style={[styles.page, { padding: 0, fontFamily: font }]}>
        {variant.layout === 'sidebar' ? (
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ width: 170, padding: 18, backgroundColor: '#f1f5f9', borderRightWidth: 3, borderRightColor: variant.accent }}>
              <Text style={{ fontFamily: boldFont, fontSize: 15, color: variant.accent, marginBottom: 4 }}>{p.fullName || 'Your Name'}</Text>
              {p.jobTitle ? <Text style={{ fontSize: 8, marginBottom: 8 }}>{p.jobTitle}</Text> : null}
              {contact.map((item, i) => <Text key={i} style={{ fontSize: 7, marginBottom: 3, color: '#475569' }}>{item}</Text>)}
              {skillsSection}
              {educationSection}
              {certificationsSection}
            </View>
            {mainContent}
          </View>
        ) : (
          <>
            <View style={{
              paddingTop: variant.layout === 'banner' ? 22 : 26,
              paddingBottom: variant.layout === 'banner' ? 18 : 12,
              paddingLeft: 28,
              paddingRight: 28,
              backgroundColor: variant.layout === 'banner' ? variant.accent : 'white',
              borderBottomWidth: variant.layout === 'minimal' || variant.layout === 'centered' ? 1 : 0,
              borderBottomColor: variant.accent,
              alignItems: variant.layout === 'centered' ? 'center' : 'flex-start',
            }}>
              <Text style={{
                fontSize: variant.compact ? 18 : 21,
                fontFamily: boldFont,
                color: variant.layout === 'banner' ? 'white' : variant.accent,
                marginBottom: 3,
                textAlign: variant.layout === 'centered' ? 'center' : 'left',
              }}>{p.fullName || 'Your Name'}</Text>
              {p.jobTitle ? <Text style={{ fontSize: 9, color: variant.layout === 'banner' ? '#e2e8f0' : '#475569', textAlign: variant.layout === 'centered' ? 'center' : 'left' }}>{p.jobTitle}</Text> : null}
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginTop: 6, justifyContent: variant.layout === 'centered' ? 'center' : 'flex-start' }}>
                {contact.map((item, i) => <Text key={i} style={{ fontSize: 7.5, color: variant.layout === 'banner' ? '#f8fafc' : '#64748b' }}>{item}</Text>)}
              </View>
            </View>
            {mainContent}
          </>
        )}
      </Page>
    </Document>
  )
}

export function buildPDFDocument(data: ResumeData, template: TemplateId) {
  if (template === 'classic') return <PDFClassic data={data} />
  if (template === 'professional') return <PDFProfessional data={data} />
  if (template === 'executive') return <PDFExecutive data={data} />
  if (template === 'timeline') return <PDFTimeline data={data} />
  if (template === 'elegant') return <PDFElegant data={data} />
  if (template === 'compact') return <PDFCompact data={data} />
  if (template === 'modern') return <PDFModern data={data} />
  return <PDFVariant data={data} template={template} />
}
