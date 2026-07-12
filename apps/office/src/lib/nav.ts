import { ClipboardList, HardHat, Scale } from 'lucide-react';
import type { ComponentType } from 'react';

export interface NavItem {
  to: string;
  labelKey: string;
  icon: ComponentType<{ size?: number | string; strokeWidth?: number }>;
  roles: string[];
}

export const navItems: NavItem[] = [
  { to: '/requests', labelKey: 'nav.requests', icon: ClipboardList, roles: ['appraiser', 'admin'] },
  { to: '/inspections', labelKey: 'nav.inspections', icon: HardHat, roles: ['inspector', 'appraiser', 'admin'] },
  { to: '/appraisals', labelKey: 'nav.appraisals', icon: Scale, roles: ['appraiser', 'admin'] },
];

export function visibleNav(roles: string[]): NavItem[] {
  return navItems.filter((item) => item.roles.some((r) => roles.includes(r)));
}
