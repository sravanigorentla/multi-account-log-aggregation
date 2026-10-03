export const eventVolumeByHour = [
  { hour: '00:00', events: 2100, errors: 45 },
  { hour: '01:00', events: 1800, errors: 32 },
  { hour: '02:00', events: 1500, errors: 28 },
  { hour: '03:00', events: 1200, errors: 15 },
  { hour: '04:00', events: 1400, errors: 22 },
  { hour: '05:00', events: 1900, errors: 38 },
  { hour: '06:00', events: 3200, errors: 55 },
  { hour: '07:00', events: 5100, errors: 78 },
  { hour: '08:00', events: 8400, errors: 120 },
  { hour: '09:00', events: 12500, errors: 185 },
  { hour: '10:00', events: 14200, errors: 210 },
  { hour: '11:00', events: 13800, errors: 195 },
  { hour: '12:00', events: 11500, errors: 165 },
  { hour: '13:00', events: 13100, errors: 178 },
  { hour: '14:00', events: 14800, errors: 225 },
  { hour: '15:00', events: 13500, errors: 190 },
  { hour: '16:00', events: 12200, errors: 175 },
  { hour: '17:00', events: 9800, errors: 140 },
  { hour: '18:00', events: 6500, errors: 95 },
  { hour: '19:00', events: 4800, errors: 72 },
  { hour: '20:00', events: 3900, errors: 58 },
  { hour: '21:00', events: 3200, errors: 48 },
  { hour: '22:00', events: 2800, errors: 42 },
  { hour: '23:00', events: 2400, errors: 38 },
];

export const eventsByService = [
  { name: 'S3', value: 28, color: '#06b6d4' },
  { name: 'EC2', value: 18, color: '#3b82f6' },
  { name: 'IAM', value: 15, color: '#8b5cf6' },
  { name: 'Lambda', value: 12, color: '#10b981' },
  { name: 'STS', value: 10, color: '#f59e0b' },
  { name: 'DynamoDB', value: 8, color: '#ef4444' },
  { name: 'Others', value: 9, color: '#6b7280' },
];

export const eventsByAccount = [
  { account: 'Prod US-East', events: 14820, errors: 340 },
  { account: 'Prod EU-West', events: 9740, errors: 220 },
  { account: 'Security', events: 8200, errors: 45 },
  { account: 'Shared Svc', events: 6780, errors: 180 },
  { account: 'Staging', events: 5230, errors: 150 },
  { account: 'Analytics', events: 4560, errors: 90 },
  { account: 'Dev Backend', events: 3410, errors: 120 },
  { account: 'QA', events: 2910, errors: 85 },
  { account: 'Dev Frontend', events: 1890, errors: 60 },
];

export const weeklyTrend = [
  { day: 'Mon', events: 85400, alerts: 12 },
  { day: 'Tue', events: 92100, alerts: 8 },
  { day: 'Wed', events: 88700, alerts: 15 },
  { day: 'Thu', events: 95300, alerts: 10 },
  { day: 'Fri', events: 91200, alerts: 18 },
  { day: 'Sat', events: 42100, alerts: 4 },
  { day: 'Sun', events: 38900, alerts: 3 },
];

export const dashboardStats = {
  totalAccounts: 10,
  activeAccounts: 9,
  totalEvents: 703942,
  eventsToday: 156200,
  logsCollected: '2.4 TB',
  securityAlerts: 10,
  openAlerts: 4,
  criticalAlerts: 2,
  trailsActive: 9,
  trailsTotal: 10,
  complianceScore: 87,
};
