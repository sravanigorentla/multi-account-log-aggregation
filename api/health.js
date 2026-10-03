export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  return res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'CloudTrail Multi-Account Log Aggregator Auth Backend',
    version: '1.0.0'
  });
}
