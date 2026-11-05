export type ProjectTool = 'Excel' | 'Power BI' | 'SQL'
export type ArchiveProject = {
  id: string
  title: string
  category: 'Analytics' | 'Engineering'
  tool: ProjectTool | 'Engineering'
  status: 'Completed' | 'In Progress' | 'Planned'
  details: string
  businessQuestion: string
  approach: string
  tools: readonly string[]
  publishedScope?: string
  projectUrl?: string
  image?: string
  imageAlt?: string
  preview: 'bars' | 'line' | 'network' | 'campaign' | 'schema'
}

export const archiveProjects: readonly ArchiveProject[] = [
  {
    id: 'fastship-logistics', title: 'FastShip Logistics', category: 'Analytics', tool: 'Excel', status: 'Completed',
    details: 'A full analytics pipeline for a logistics company, raw shipment data transformed into a polished, two-page, decision-ready dashboard using custom DAX measures.',
    businessQuestion: 'How can shipment data be turned into a clear performance view for logistics decisions?',
    approach: 'Transform raw shipment records into a two-page dashboard with custom DAX measures.',
    tools: ['Excel', 'Power Query', 'Power Pivot', 'DAX'], publishedScope: '2,000+ shipment records analyzed',
    projectUrl: 'https://github.com/babatunde-cp/FastShip-Logistics-Performance-Analysis', image: '/images/projects/fastship-logistics.png', imageAlt: 'FastShip Logistics executive dashboard showing shipment volume, delivery rate, carrier performance, and shipping costs', preview: 'bars',
  },
  {
    id: 'social-media-campaign-analysis', title: 'Social Media Campaign Analysis', category: 'Analytics', tool: 'Excel', status: 'Completed',
    details: 'A two page Excel dashboard analyzing social media performance across platforms, campaigns, and content types. Layered in a strategic insights panel highlighting top-performing platforms, content formats, and optimal posting times to guide future campaign decisions.',
    businessQuestion: 'Which platforms, campaigns, content types, and posting times merit closer attention?',
    approach: 'Combine interactive slicers, PivotTable-driven visuals, and a strategic insights panel.',
    tools: ['Excel', 'Power Pivot', 'DAX'], publishedScope: '13.1M+ impressions across four platforms',
    projectUrl: 'https://github.com/babatunde-cp/social-media-analytics-project---2025-2026-', image: '/images/projects/social-media-campaign.png', imageAlt: 'Social Media Analytics performance dashboard with platform and campaign filters, engagement trends, and content performance', preview: 'campaign',
  },
  {
    id: 'operation-clearwater', title: 'Operation Clearwater', category: 'Analytics', tool: 'Power BI', status: 'Completed',
    details: "A 6-page fraud risk intelligence dashboard combining custom DAX with hand-built SVG/HTML visuals to surface suspicious transaction patterns for a bank's risk team.",
    businessQuestion: 'How can suspicious transaction patterns be surfaced for a bank risk team to review?',
    approach: 'Build a six-page intelligence dashboard with custom DAX and hand-built SVG/HTML visuals.',
    tools: ['Power BI', 'DAX', 'SVG/HTML'], publishedScope: '195,276 transactions analyzed',
    projectUrl: 'https://github.com/babatunde-cp/operation-clearwater-fraud-risk-analysis', image: '/images/projects/operation-clearwater.png', imageAlt: 'North Axis Bank customer risk dashboard showing flagged customers and customer segment risk exposure', preview: 'line',
  },
  {
    id: 'athletex-sport-injury-analysis', title: 'AthleteX Sport Injury Analysis', category: 'Analytics', tool: 'Power BI', status: 'Completed',
    details: 'A centralized dashboard giving a sports medical team full visibility into injury intelligence, from executive KPIs down to individual athlete-level records.',
    businessQuestion: 'How can a sports medical team move from executive indicators to athlete-level injury records?',
    approach: 'Model injury data in a dashboard that connects executive KPIs to individual athlete detail.',
    tools: ['Power BI', 'DAX', 'Data Modeling'],
    projectUrl: 'https://github.com/babatunde-cp/AthleteX-Sport-Injury-analysis', image: '/images/projects/athletex-sport-injury.png', imageAlt: 'AthleteX Care medical dashboard showing injury counts, recovery time, injury types, and sports event breakdowns', preview: 'network',
  },
  {
    id: 'grandstay-hotels-database', title: 'GrandStay Hotels & Resorts', category: 'Analytics', tool: 'SQL', status: 'Completed',
    details: 'A SQL Server relational database for a hotel and resort chain. Multi-table schema, DDL/DML scripts, and validation queries demonstrate structured hospitality data management.',
    businessQuestion: 'How should hotel and resort data be structured across related entities and validated?',
    approach: 'Create a multi-table schema with SQL Server T-SQL scripts and validation queries.',
    tools: ['SQL Server', 'T-SQL', 'Database Design'],
    projectUrl: 'https://github.com/babatunde-cp/grandstay-hotels-database-creation-sql', image: '/images/projects/grandstay-hotels.jpg', imageAlt: 'GrandStay Hotels relational database diagram linking guest, room, hotel, booking, payment, and service charge tables', preview: 'schema',
  },
]

export const archiveToolGroups = [
  { tool: 'Excel', description: 'Spreadsheet analysis, reporting, and business performance insights.' },
  { tool: 'Power BI', description: 'Interactive dashboards that turn business data into actionable insights.' },
  { tool: 'SQL', description: 'Querying, cleaning, and investigating data to answer business questions.' },
] as const

export const engineeringProjects: readonly ArchiveProject[] = [
  {
    id: 'shopsphere-data-warehouse', title: 'ShopSphere Data Warehouse & Analytics', category: 'Engineering', tool: 'Engineering', status: 'Completed',
    details: 'A SQL Server Medallion warehouse unifies 77K+ e-commerce records from website and mobile sources. Bronze ingestion, Silver cleaning, and a Gold star schema support RFM, basket, and promotion analyses, including a documented $500K ad-spend recommendation.',
    businessQuestion: 'How can e-commerce data from web and mobile channels be unified for analysis?',
    approach: 'Ingest source records into Bronze, clean and standardize through Silver, then model a Gold star schema for downstream analysis.',
    tools: ['SQL Server', 'T-SQL', 'Medallion Architecture', 'ETL', 'Data Warehousing'], publishedScope: '77K+ e-commerce records unified · $500K ad-spend recommendation',
    projectUrl: 'https://github.com/babatunde-cp/ShopSphere-Data-Warehouse-and-Analytics-Project', image: '/images/projects/shopsphere-warehouse.gif', imageAlt: 'ShopSphere data warehouse pipeline diagram showing website and mobile sources flowing through Bronze, Silver, and Gold layers to analysis', preview: 'schema',
  },
]
