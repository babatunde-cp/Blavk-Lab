import type { Metadata } from 'next'
import { ProfileIntroduction } from '@/components/lab/profile-introduction'

export const metadata: Metadata = {
  title: 'About — BLAVK DATA LAB',
  description: 'Meet Babatunde Kareem: an operations-focused professional developing in data analytics and data engineering.',
}

export default function LabPage() {
  return <ProfileIntroduction />
}
