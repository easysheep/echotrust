import { register, collectDefaultMetrics,Counter } from 'prom-client';

// Enable collection of default metrics (e.g., CPU, memory usage)
collectDefaultMetrics();

// Define a custom metric (e.g., a counter for API requests)
const requestCounter = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
});

export async function GET(req) {
  try {
    // Increment the request counter
    requestCounter.inc({ method: req.method, route: req.url, status: 200 });

    // Return all metrics in the Prometheus exposition format
    const metrics = await register.metrics();
    return new Response(metrics, {
      headers: { 'Content-Type': register.contentType },
    });
  } catch (error) {
    console.error('Error generating metrics:', error);
    return new Response('Error generating metrics', { status: 500 });
  }
}