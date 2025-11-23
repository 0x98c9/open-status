import type { APIRoute } from 'astro';

interface ServiceCheck {
    name: string;
    url: string;
    status: 'operational' | 'degraded' | 'outage';
    responseTime?: number;
    description: string;
}

// Define the services to check
const SERVICES_TO_CHECK = [
    {
        name: 'Website',
        url: 'https://open-status.pages.dev/',
        description: 'Main landing page and documentation'
    },
    {
        name: 'API',
        url: 'https://jsonplaceholder.typicode.com/posts/1',
        description: 'Core API services'
    },
    {
        name: 'Database',
        url: 'https://httpstat.us/200',
        description: 'Primary database cluster'
    },
    {
        name: 'CDN',
        url: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js',
        description: 'Content delivery network'
    },
];

async function checkService(service: { name: string; url: string; description: string }): Promise<ServiceCheck> {
    const startTime = Date.now();

    try {
        const response = await fetch(service.url, {
            method: 'HEAD',
            signal: AbortSignal.timeout(5000), // 5 second timeout
        });

        const responseTime = Date.now() - startTime;

        if (response.ok) {
            return {
                name: service.name,
                url: service.url,
                description: service.description,
                status: responseTime > 2000 ? 'degraded' : 'operational',
                responseTime,
            };
        } else {
            return {
                name: service.name,
                url: service.url,
                description: service.description,
                status: 'outage',
                responseTime,
            };
        }
    } catch (error) {
        return {
            name: service.name,
            url: service.url,
            description: service.description,
            status: 'outage',
            responseTime: Date.now() - startTime,
        };
    }
}

export async function getStatusData() {
    // Check all services in parallel
    const checks = await Promise.all(
        SERVICES_TO_CHECK.map(service => checkService(service))
    );

    // Determine overall status
    const hasOutage = checks.some(check => check.status === 'outage');
    const hasDegraded = checks.some(check => check.status === 'degraded');

    let overallStatus: 'operational' | 'degraded' | 'outage' = 'operational';
    if (hasOutage) {
        overallStatus = 'outage';
    } else if (hasDegraded) {
        overallStatus = 'degraded';
    }

    return {
        title: 'Open Status',
        description: 'Real-time service status',
        repo_url: 'https://github.com/0x98c9/open-status',
        version: 'v1.0.0',
        overall_status: overallStatus,
        services: checks,
        incidents: [
            {
                date: '2023-10-27',
                title: 'Database Latency',
                status: 'resolved',
                body: 'We are investigating reports of elevated latency.'
            }
        ],
        timestamp: new Date().toISOString(),
    };
}

export const GET: APIRoute = async ({ request }) => {
    // Get Cloudflare-specific headers (only available when deployed to Cloudflare)
    const city = request.headers.get('cf-ipcity') || 'Unknown';
    const country = request.headers.get('cf-ipcountry') || 'Unknown';
    const colo = request.headers.get('cf-ray')?.split('-')[1] || 'Unknown';

    const data = await getStatusData();

    return new Response(
        JSON.stringify({
            ...data,
            checked_from: {
                city,
                country,
                datacenter: colo,
            },
        }),
        {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=60', // Cache for 1 minute
            },
        }
    );
};
