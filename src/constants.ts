export interface PropertyTier {
  id: string;
  title: string;
  min: number;
  max: number;
  yield: string;
  icon: string;
}

export const PROPERTY_TIERS: PropertyTier[] = [
  { id: 'apt', title: 'Premium Apartment', min: 30000000, max: 80000000, yield: '₦2.5M - ₦5M', icon: 'Building2' },
  { id: 'duplex', title: 'Luxury Duplex', min: 80000000, max: 250000000, yield: '₦3M - ₦10M+', icon: 'Home' },
  { id: 'detached', title: 'Signature Mansion', min: 250000000, max: 1000000000, yield: '₦10M+', icon: 'Castle' }
];

export const FX_RATE = 1610;
