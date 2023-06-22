const mapping: Record<string, string> = {
  companies: 'company',
  'construction-tools': 'construction_tool',
  customers: 'customer',
  outlets: 'outlet',
  'rental-agreements': 'rental_agreement',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
