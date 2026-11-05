export const professionalProfile = {
  id: 'BK001',
  name: 'Babatunde Kareem',
  professionalFocus: 'Data Analytics & Data Engineering',
  coreTools: 'Excel, SQL, Power BI',
  engineeringJourney: 'Python, Apache & Data Systems',
  about: [
    'I build dependable data workflows and delivering actionable insights that help organizations make better-informed decisions.',
  ],
} as const

export const profileRows = [
  { field: 'Name', value: professionalProfile.name },
  { field: 'Professional Focus', value: professionalProfile.professionalFocus },
  { field: 'Core Tools', value: professionalProfile.coreTools },
  { field: 'Engineering Journey', value: professionalProfile.engineeringJourney },
] as const

export const profileQuery = `-- BLAVK DATA LAB
-- Retrieving professional profile...

SELECT
    full_name,
    professional_focus,
    industry_experience,
    career_direction
FROM lab_profile
WHERE profile_id = '${professionalProfile.id}';`
