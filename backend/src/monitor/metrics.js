export const metrics = {
  startedAt: new Date(),
  inFlight: 0,
  totalRequests: 0,
  requestTimestamps: [], // unix ms
  statusCounts: {},
  totalErrors: 0,
  lastError: null,
  socketsConnected: 0,
};

export const metricsMiddleware = (_req, res, next) => {
  metrics.inFlight += 1;
  metrics.totalRequests += 1;
  metrics.requestTimestamps.push(Date.now());

  res.on('finish', () => {
    metrics.inFlight = Math.max(0, metrics.inFlight - 1);
    const code = res.statusCode;
    metrics.statusCounts[code] = (metrics.statusCounts[code] || 0) + 1;
    // trim timestamps older than 60s to keep memory bounded
    const cutoff = Date.now() - 60_000;
    if (metrics.requestTimestamps.length > 600) {
      metrics.requestTimestamps = metrics.requestTimestamps.filter((ts) => ts >= cutoff);
    }
  });

  return next();
};

export const recordError = (err) => {
  metrics.totalErrors += 1;
  metrics.lastError = { message: err?.message || 'Unknown error', time: new Date() };
};

export const getRequestsPerMinute = () => {
  const cutoff = Date.now() - 60_000;
  return metrics.requestTimestamps.filter((ts) => ts >= cutoff).length;
};


