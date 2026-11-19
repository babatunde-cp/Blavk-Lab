import type { Metadata } from 'next'
import { LabExperience } from '@/components/lab/lab-experience'

export const metadata: Metadata = {
  title: 'Deep Dive — BLAVK DATA LAB',
  description: 'Enter the interactive BLAVK DATA LAB experience.',
}

export default function DeepDivePage() {
  return <LabExperience />
}
