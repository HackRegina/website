import type { Metadata } from 'next';
import { BattlesnakeRegistrationScene } from '@/scenes/BattlesnakeRegistrationScene/BattlesnakeRegistrationScene';

export const metadata: Metadata = { title: 'Battlesnake Registration - HackRegina' };

export default function BattlesnakePage() {
  return <BattlesnakeRegistrationScene />;
}
