# Dynamic Status Page - Implementation Details

## 🎯 What Changed

The index page is now **fully dynamic** with **Server-Side Rendering (SSR)**. Every time someone visits the page, it performs live health checks on all services.

## 🔄 Before vs After

### Before (Static)
```astro
---
import statusData from "../data/status.json";  // ❌ Static file
const { services } = statusData;
---
```
- Status was hardcoded in JSON
- Required manual updates
- No real-time checks

### After (Dynamic SSR)
```astro
---
import { getStatusData } from "./api/status";  // ✅ Live function
const statusData = await getStatusData();      // ✅ Checks on every request
const { services } = statusData;
---
```
- Status checked live on every page load
- Automatic updates
- Real-time health monitoring

## 🏗️ Architecture

### Request Flow

```
User visits page
    ↓
Cloudflare Edge receives request
    ↓
Astro SSR executes getStatusData()
    ↓
Parallel health checks to all services
    ↓
Response times measured
    ↓
Overall status calculated
    ↓
HTML rendered with live data
    ↓
Sent to user (cached for 60s)
    ↓
Client-side script continues updating
```

### Key Components

**1. API Function** (`src/pages/api/status.ts`)
```typescript
export async function getStatusData() {
  // Checks all services in parallel
  const checks = await Promise.all(
    SERVICES_TO_CHECK.map(service => checkService(service))
  );
  
  // Returns live status data
  return {
    overall_status: calculateStatus(checks),
    services: checks,
    timestamp: new Date().toISOString()
  };
}
```

**2. Index Page** (`src/pages/index.astro`)
```astro
---
// Runs on EVERY page load (SSR)
const statusData = await getStatusData();
---
```

**3. API Endpoint** (`/api/status`)
- Same function, exposed as JSON endpoint
- Used by client-side auto-refresh
- Includes geo-location headers

## ⚡ Performance Optimizations

### 1. Parallel Checks
All services checked simultaneously:
```typescript
await Promise.all([
  checkService(website),
  checkService(api),
  checkService(database),
  checkService(cdn)
]);
```
Total time = slowest service (not sum of all)

### 2. Timeout Protection
```typescript
signal: AbortSignal.timeout(5000)  // Max 5 seconds per check
```

### 3. Edge Caching
```typescript
'Cache-Control': 'public, max-age=60'  // Cache for 1 minute
```

### 4. Smart Status Detection
```typescript
if (responseTime > 2000) return 'degraded';
if (!response.ok) return 'outage';
return 'operational';
```

## 🌍 Edge Deployment Benefits

### Why SSR on Cloudflare Edge?

**Traditional Server (Vercel/Netlify)**:
- Single region (e.g., US-East-1)
- User in Mumbai → 200ms to US → check → 200ms back
- Total: ~400ms + check time

**Cloudflare Edge**:
- 300+ locations worldwide
- User in Mumbai → 20ms to Mumbai datacenter → check → 20ms back
- Total: ~40ms + check time

### Geo-Location Detection

Cloudflare automatically adds headers:
```typescript
const city = request.headers.get('cf-ipcity');      // "Mumbai"
const country = request.headers.get('cf-ipcountry'); // "IN"
const colo = request.headers.get('cf-ray');          // "BOM"
```

## 📊 Status Determination Logic

```typescript
// Check each service
const checks = await Promise.all(services.map(checkService));

// Determine overall status
if (checks.some(c => c.status === 'outage')) {
  overall_status = 'outage';      // Any outage = overall outage
} else if (checks.some(c => c.status === 'degraded')) {
  overall_status = 'degraded';    // Any degraded = overall degraded
} else {
  overall_status = 'operational'; // All good = operational
}
```

## 🔧 Customization Guide

### Add New Services

Edit `src/pages/api/status.ts`:

```typescript
const SERVICES_TO_CHECK = [
  { 
    name: 'Your Service',
    url: 'https://your-service.com/health',
    description: 'Your service description'
  },
  // ... more services
];
```

### Adjust Thresholds

```typescript
// Change degraded threshold (default: 2000ms)
status: responseTime > 3000 ? 'degraded' : 'operational'

// Change timeout (default: 5000ms)
signal: AbortSignal.timeout(10000)
```

### Modify Cache Duration

```typescript
// Change from 60s to 30s
'Cache-Control': 'public, max-age=30'
```

## 🎯 Real-World Example

### Service Configuration
```typescript
{
  name: 'Website',
  url: 'https://open-status.pages.dev/',
  description: 'Main landing page'
}
```

### Check Process
1. **Start**: Record timestamp
2. **Request**: `fetch(url, { method: 'HEAD' })`
3. **Measure**: `responseTime = now - start`
4. **Evaluate**:
   - `response.ok` && `responseTime < 2000ms` → ✅ Operational
   - `response.ok` && `responseTime > 2000ms` → ⚠️ Degraded
   - `!response.ok` or timeout → ❌ Outage

### Response
```json
{
  "name": "Website",
  "url": "https://open-status.pages.dev/",
  "description": "Main landing page",
  "status": "operational",
  "responseTime": 145
}
```

## 🚀 Deployment Considerations

### Environment Variables (Optional)

You can add these to Cloudflare Pages:

```bash
# Custom timeout
STATUS_CHECK_TIMEOUT=5000

# Custom cache duration
STATUS_CACHE_DURATION=60
```

Then use in code:
```typescript
const timeout = parseInt(import.meta.env.STATUS_CHECK_TIMEOUT || '5000');
```

### Monitoring Your Monitor

Since the status page checks services on every load:
- **Low traffic**: Checks happen infrequently
- **High traffic**: Checks happen constantly
- **Solution**: Cloudflare's edge cache reduces redundant checks

## 📈 Future Enhancements

1. **Historical Data**: Store checks in Cloudflare KV
2. **Alerts**: Webhook notifications on status changes
3. **Custom Checks**: POST requests, authentication, custom logic
4. **Uptime Percentage**: Calculate from historical data
5. **Incident Management**: Auto-create incidents on outages

## ✅ Testing

### Local Testing
```bash
npm run dev
# Visit http://localhost:4321
# Each refresh = new health check
```

### API Testing
```bash
curl http://localhost:4321/api/status
```

### Production Testing
```bash
curl https://open-status.pages.dev/api/status
```

## 🎉 Summary

Your status page is now:
- ✅ **Fully Dynamic** - Live checks on every request
- ✅ **Edge-Powered** - Runs globally on Cloudflare
- ✅ **Real-Time** - No manual updates needed
- ✅ **Fast** - Parallel checks with timeouts
- ✅ **Accurate** - Checks from user's nearest datacenter
- ✅ **Scalable** - Edge caching handles traffic spikes

**No more static JSON files. Everything is live!** 🚀
