export interface InspectorOption {
  id: string;
  name: string;
  username: string;
}

export const KNOWN_INSPECTORS: InspectorOption[] = [
  {
    id: '0b56a41d-0bef-43b9-931e-bb4d0723b608',
    name: 'Иван Иванов',
    username: 'test-inspector',
  },
];

export function getInspectorName(id: string | null | undefined): string | null {
  if (!id) return null;
  const found = KNOWN_INSPECTORS.find((i) => i.id === id);
  if (found) {
    return `${found.name} (@${found.username})`;
  }
  return `${id.slice(0, 8)}…`;
}
