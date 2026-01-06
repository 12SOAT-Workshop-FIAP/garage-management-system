#!/usr/bin/env node
/**
 * New Relic Data Generator Script
 * 
 * This script simulates real user traffic to feed New Relic dashboards with:
 * - API Performance metrics (latency)
 * - Work Order lifecycle (create, update status, complete)
 * - Health checks
 * - Intentional errors for alerting
 * - Structured logs with correlation
 * 
 * Environment Variables:
 *   API_EMAIL    - Email for authentication (default: isaac@example.com)
 *   API_PASSWORD - Password for authentication (default: password123)
 *   BASE_URL     - API base URL (default: http://localhost:3000)
 * 
 * Usage: 
 *   node scripts/feed-new-relic.js [--duration=60] [--intensity=medium]
 *   
 *   # With custom credentials:
 *   API_EMAIL=user@test.com API_PASSWORD=mypass node scripts/feed-new-relic.js
 * 
 *   # With custom base URL:
 *   BASE_URL=http://my-api:3000 node scripts/feed-new-relic.js --duration=120
 */

// Configuration from environment variables and CLI args
const BASE_URL = process.argv.find(arg => arg.startsWith('--base-url='))?.split('=')[1] || 'http://localhost:3000';
const API_EMAIL = process.argv.find(arg => arg.startsWith('--email='))?.split('=')[1] || 'isaac@example.com';
const API_PASSWORD = process.argv.find(arg => arg.startsWith('--password='))?.split('=')[1] || 'password123';
const DURATION_SECONDS = parseInt(process.argv.find(arg => arg.startsWith('--duration='))?.split('=')[1] || '60');
const INTENSITY = process.argv.find(arg => arg.startsWith('--intensity='))?.split('=')[1] || 'medium';

const INTENSITY_CONFIG = {
  low: { delayMs: 2000, batchSize: 1 },
  medium: { delayMs: 1000, batchSize: 3 },
  high: { delayMs: 500, batchSize: 5 },
};

const config = INTENSITY_CONFIG[INTENSITY] || INTENSITY_CONFIG.medium;

// Work Order Statuses matching the enum
const WORK_ORDER_STATUSES = [
  'received',
  'diagnosis',
  'pending',
  'approved',
  'in_progress',
  'waiting_parts',
  'completed',
  'delivered',
];

// Cookies storage for authenticated requests
let cookies = '';

// Statistics
const stats = {
  requests: 0,
  success: 0,
  errors: 0,
  workOrdersCreated: 0,
  statusTransitions: 0,
  healthChecks: 0,
  startTime: Date.now(),
};

/**
 * Make HTTP request using native fetch
 */
async function request(method, path, body = null, expectError = false) {
  const url = `${BASE_URL}${path}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookies,
      'X-Correlation-ID': `feed-nr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const startTime = Date.now();
  stats.requests++;

  try {
    const response = await fetch(url, options);
    const duration = Date.now() - startTime;

    // Store cookies from response
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) {
      cookies = setCookie.split(',').map(c => c.split(';')[0]).join('; ');
    }

    const data = response.ok ? await response.json().catch(() => ({})) : null;

    if (response.ok) {
      stats.success++;
      console.log(`✅ ${method} ${path} - ${response.status} (${duration}ms)`);
    } else if (expectError) {
      stats.success++;
      console.log(`⚠️  ${method} ${path} - ${response.status} (expected error) (${duration}ms)`);
    } else {
      stats.errors++;
      console.log(`❌ ${method} ${path} - ${response.status} (${duration}ms)`);
    }

    return { ok: response.ok, status: response.status, data, duration };
  } catch (error) {
    stats.errors++;
    const duration = Date.now() - startTime;
    console.log(`❌ ${method} ${path} - ERROR: ${error.message} (${duration}ms)`);
    return { ok: false, error: error.message, duration };
  }
}

/**
 * Login to get authentication tokens
 */
async function login() {
  console.log('\n🔐 Authenticating...');
  console.log(`   Email: ${API_EMAIL}`);
  
  const result = await request('POST', '/auth/login', {
    email: API_EMAIL,
    password: API_PASSWORD,
  });
  
  if (!result.ok) {
    console.log('❌ Authentication failed! Please check your credentials.');
    console.log('   Set API_EMAIL and API_PASSWORD arguments.');
    return false;
  }
  
  console.log('✅ Authentication successful!');
  return true;
}

/**
 * Health check - feeds uptime monitoring
 */
async function healthCheck() {
  stats.healthChecks++;
  return request('GET', '/health');
}

/**
 * Get all work orders - feeds API performance metrics
 */
async function getAllWorkOrders() {
  return request('GET', '/work-orders');
}

/**
 * Get work orders by status - for dashboard queries
 */
async function getWorkOrdersByStatus(status) {
  return request('GET', `/work-orders?status=${status}`);
}

/**
 * Create a new work order - feeds daily volume metrics
 */
async function createWorkOrder(customerId = 1, vehicleId = 1) {
  const descriptions = [
    'Oil change and filter replacement required for routine maintenance',
    'Brake pads worn out, need replacement on all four wheels',
    'Engine making strange noise, diagnostic needed to identify issue',
    'Air conditioning not cooling, compressor check required',
    'Transmission fluid leak detected, inspection and repair needed',
    'Battery replacement and electrical system check requested',
    'Tire rotation and wheel alignment service requested by customer',
    'Suspension system creaking, shock absorbers need inspection',
  ];

  const diagnoses = [
    'Initial inspection reveals worn brake pads requiring immediate replacement',
    'Oil analysis shows contamination, full flush recommended',
    'Compression test indicates cylinder issues, further diagnosis needed',
    'Visual inspection complete, parts ordered for repair',
    'Electronic diagnostic complete, error codes retrieved',
  ];

  const result = await request('POST', '/work-orders', {
    customerId,
    vehicleId,
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    diagnosis: diagnoses[Math.floor(Math.random() * diagnoses.length)],
    estimatedCost: Math.floor(Math.random() * 2000) + 100,
  });

  if (result.ok) {
    stats.workOrdersCreated++;
  }

  return result;
}

/**
 * Update work order status - feeds execution time by status metrics
 */
async function updateWorkOrderStatus(workOrderId, newStatus) {
  const technicianNotes = [
    'Work progressing as expected',
    'Found additional issues during inspection',
    'Waiting for customer approval on extra work',
    'Parts installed, testing in progress',
    'Quality check completed successfully',
  ];

  const result = await request('PATCH', `/work-orders/${workOrderId}`, {
    status: newStatus,
    technicianNotes: technicianNotes[Math.floor(Math.random() * technicianNotes.length)],
  });

  if (result.ok) {
    stats.statusTransitions++;
  }

  return result;
}

/**
 * Approve work order
 */
async function approveWorkOrder(workOrderId) {
  return request('POST', `/work-orders/${workOrderId}/approve`);
}

/**
 * Simulate full work order lifecycle
 */
async function simulateWorkOrderLifecycle() {
  console.log('\n📋 Simulating Work Order Lifecycle...');

  // Create work order
  const createResult = await createWorkOrder(
    Math.floor(Math.random() * 5) + 1,
    Math.floor(Math.random() * 5) + 1
  );

  if (!createResult.ok || !createResult.data?.id) {
    console.log('⚠️  Could not create work order, skipping lifecycle');
    return;
  }

  const workOrderId = createResult.data.id;
  console.log(`   Created Work Order: ${workOrderId}`);

  // Simulate status transitions with delays
  const statusFlow = ['diagnosis', 'pending', 'approved', 'in_progress', 'completed'];
  
  for (const status of statusFlow) {
    await sleep(500);
    
    if (status === 'approved') {
      await sleep(3_000);
      await approveWorkOrder(workOrderId);
    } else {
      if (status === 'in_progress') await sleep(2_000);
      if (status === 'pending') await sleep(1_500);
      if (status === 'diagnosis') await sleep(10_000);
      await updateWorkOrderStatus(workOrderId, status);
    }
  }

  console.log(`   ✅ Work Order ${workOrderId} completed lifecycle`);
}

/**
 * Generate intentional errors for alerting
 */
async function generateErrors() {
  console.log('\n🔥 Generating Errors for Alerting...');

  // Invalid work order ID
  await request('GET', '/work-orders/invalid-uuid', null, true);

  // Non-existent work order
  await request('GET', '/work-orders/00000000-0000-0000-0000-000000000000', null, true);

  // Invalid payload
  await request('POST', '/work-orders', { invalid: 'data' }, true);

  // Missing required fields
  await request('POST', '/work-orders', { customerId: 1 }, true);

  // Invalid status update
  await request('PATCH', '/work-orders/00000000-0000-0000-0000-000000000000', {
    status: 'invalid_status',
  }, true);
}

/**
 * Query work orders by different filters - for dashboard queries
 */
async function queryWorkOrders() {
  console.log('\n🔍 Querying Work Orders...');

  // Get all
  await getAllWorkOrders();

  // Query by each status
  for (const status of WORK_ORDER_STATUSES) {
    await getWorkOrdersByStatus(status);
    await sleep(200);
  }
}

/**
 * Load test the API
 */
async function loadTest(iterations = 5) {
  console.log(`\n⚡ Load Testing (${iterations} iterations)...`);

  const promises = [];
  for (let i = 0; i < iterations; i++) {
    promises.push(healthCheck());
    promises.push(getAllWorkOrders());
    promises.push(createWorkOrder(
      Math.floor(Math.random() * 5) + 1,
      Math.floor(Math.random() * 5) + 1
    ));
  }

  await Promise.all(promises);
}

/**
 * Sleep utility
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Print statistics
 */
function printStats() {
  const elapsed = Math.floor((Date.now() - stats.startTime) / 1000);
  const successRate = stats.requests > 0 ? ((stats.success / stats.requests) * 100).toFixed(1) : 0;

  console.log('\n' + '='.repeat(60));
  console.log('📊 STATISTICS');
  console.log('='.repeat(60));
  console.log(`⏱️  Duration: ${elapsed}s`);
  console.log(`📤 Total Requests: ${stats.requests}`);
  console.log(`✅ Successful: ${stats.success} (${successRate}%)`);
  console.log(`❌ Errors: ${stats.errors}`);
  console.log(`📋 Work Orders Created: ${stats.workOrdersCreated}`);
  console.log(`🔄 Status Transitions: ${stats.statusTransitions}`);
  console.log(`💚 Health Checks: ${stats.healthChecks}`);
  console.log('='.repeat(60));
}

/**
 * Main execution loop
 */
async function main() {
  console.log('='.repeat(60));
  console.log('🚀 NEW RELIC DATA GENERATOR');
  console.log('='.repeat(60));
  console.log(`📍 Base URL: ${BASE_URL}`);
  console.log(`⏱️  Duration: ${DURATION_SECONDS}s`);
  console.log(`⚡ Intensity: ${INTENSITY}`);
  console.log('='.repeat(60));

  // Initial health check
  console.log('\n💚 Initial Health Check...');
  const healthResult = await healthCheck();
  if (!healthResult.ok) {
    console.log('❌ API is not responding. Make sure the server is running.');
    console.log('   Run: kubectl port-forward -n fiap-garage svc/garage-api-service 3000:3000');
    process.exit(1);
  }

  // Authenticate
  const authenticated = await login();
  if (!authenticated) {
    console.log('\n⚠️  Continuing with limited functionality (public endpoints only)...');
  }

  const endTime = Date.now() + (DURATION_SECONDS * 1000);
  let iteration = 0;

  while (Date.now() < endTime) {
    iteration++;
    console.log(`\n${'─'.repeat(60)}`);
    console.log(`📍 ITERATION ${iteration}`);
    console.log(`${'─'.repeat(60)}`);

    // Continuous health checks
    await healthCheck();

    // Create work orders in batches
    console.log(`\n📝 Creating ${config.batchSize} Work Orders...`);
    for (let i = 0; i < config.batchSize; i++) {
      await createWorkOrder(
        Math.floor(Math.random() * 5) + 1,
        Math.floor(Math.random() * 5) + 1
      );
    }

    // Simulate full lifecycle occasionally
    if (iteration % 3 === 0) {
      await simulateWorkOrderLifecycle();
    }

    // Query work orders
    await queryWorkOrders();

    // Generate some errors occasionally
    if (iteration % 5 === 0) {
      await generateErrors();
    }

    // Load test occasionally
    if (iteration % 4 === 0) {
      await loadTest(config.batchSize);
    }

    // Wait before next iteration
    await sleep(config.delayMs);
  }

  printStats();
  console.log('\n✅ Data generation complete! Check your New Relic dashboards.');
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n⚠️  Interrupted by user');
  printStats();
  process.exit(0);
});

// Run
main().catch(console.error);
