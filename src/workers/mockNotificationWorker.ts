/**
 * Mock Notification Worker Setup & Fallback Client Interceptor
 *
 * Ensures simulated email delivery via `/api/notifications/dispatch-email`
 * succeeds in all browser environments (direct window or iframe sandbox).
 */

export interface MockWorkerStatus {
  isServiceWorkerRegistered: boolean;
  isClientInterceptorActive: boolean;
  mode: 'service_worker' | 'client_interceptor' | 'dual';
  totalIntercepted: number;
  lastInterceptedAt: string | null;
}

let isInitialized = false;
let swRegistration: ServiceWorkerRegistration | null = null;
let totalInterceptedCount = 0;
let lastInterceptedTimestamp: string | null = null;

type WorkerEventListener = (status: MockWorkerStatus) => void;
const listeners = new Set<WorkerEventListener>();

function notifyListeners() {
  const status = getMockWorkerStatus();
  listeners.forEach((fn) => {
    try {
      fn(status);
    } catch {
      // Ignore listener error
    }
  });
}

export function subscribeWorkerStatus(listener: WorkerEventListener): () => void {
  listeners.add(listener);
  listener(getMockWorkerStatus());
  return () => {
    listeners.delete(listener);
  };
}

export function getMockWorkerStatus(): MockWorkerStatus {
  const isSW = Boolean(swRegistration && swRegistration.active);
  return {
    isServiceWorkerRegistered: isSW,
    isClientInterceptorActive: true,
    mode: isSW ? 'dual' : 'client_interceptor',
    totalIntercepted: totalInterceptedCount,
    lastInterceptedAt: lastInterceptedTimestamp
  };
}

/**
 * Initializes the Mock Service Worker and client-side fallback interceptor.
 */
export async function initMockNotificationWorker(): Promise<void> {
  if (isInitialized) return;
  isInitialized = true;

  // 1. Attempt Service Worker registration if available
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    try {
      swRegistration = await navigator.serviceWorker.register('/mockServiceWorker.js', {
        scope: '/'
      });
      console.log('[MockServiceWorker] Registered successfully:', swRegistration.scope);
      notifyListeners();
    } catch (err) {
      console.warn('[MockServiceWorker] Native Service Worker registration bypassed (likely iframe sandbox), using client-side fallback interceptor:', err);
    }
  }

  // 2. Install bulletproof client-side fetch interceptor for /api/notifications/*
  // This guarantees 100% reliability in restricted iframes and instant preview
  if (typeof window !== 'undefined') {
    const originalFetch = window.fetch;
    window.fetch = async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
      const urlString = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;

      if (urlString.includes('/api/notifications/')) {
        totalInterceptedCount++;
        lastInterceptedTimestamp = new Date().toISOString();
        notifyListeners();

        // Simulate network delay
        await new Promise((r) => setTimeout(r, 280));

        if (urlString.includes('/dispatch-email') || urlString.includes('/send-email')) {
          try {
            let bodyData: any = {};
            if (init && init.body) {
              bodyData = typeof init.body === 'string' ? JSON.parse(init.body) : init.body;
            }

            const messageId = 'msg_msw_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 8);
            const nowIso = new Date().toISOString();

            const simulatedResponse = {
              success: true,
              status: 'delivered',
              messageId,
              provider: 'MockServiceWorker SMTP Relay v2.4 (Simulated Daemon)',
              dispatchedAt: nowIso,
              deliveredAt: nowIso,
              recipient: bodyData.recipientEmail || 'compliance@apextech.co.in',
              subject: bodyData.subject || 'Statutory Deadline Alert',
              noticeId: bodyData.noticeId,
              referenceNumber: bodyData.referenceNumber,
              urgency: bodyData.urgency || 'urgent',
              daysRemaining: bodyData.daysRemaining,
              milestone: bodyData.milestone || 'scheduled_scan',
              latencyMs: 280,
              smtpResponseCode: '250 2.0.0 OK: queued as ' + messageId,
              headers: {
                'X-Mailer': 'NiyamSetu Automated Compliance Dispatcher v2.4',
                'X-Priority': bodyData.urgency === 'urgent' || bodyData.urgency === 'overdue' ? '1 (Highest)' : '3 (Normal)',
                'X-Mock-Service-Worker': 'Active-ClientInterceptor',
                'Content-Type': 'application/json'
              }
            };

            return new Response(JSON.stringify(simulatedResponse), {
              status: 200,
              statusText: 'OK',
              headers: {
                'Content-Type': 'application/json',
                'X-Intercepted-By': 'MockNotificationWorker'
              }
            });
          } catch (e: any) {
            return new Response(
              JSON.stringify({ success: false, error: e?.message || 'Failed to dispatch email' }),
              { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
          }
        }

        if (urlString.includes('/status')) {
          return new Response(
            JSON.stringify({
              active: true,
              version: '2.4.0',
              engine: 'MockNotificationWorker Interceptor',
              timestamp: new Date().toISOString()
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          );
        }
      }

      return originalFetch.apply(this, [input, init]);
    };
  }
}
