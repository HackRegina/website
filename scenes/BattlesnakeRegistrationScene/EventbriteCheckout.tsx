'use client';

import { useEffect, useId, useState } from 'react';

const WIDGET_SCRIPT = 'https://www.eventbrite.ca/static/widgets/eb_widgets.js';

interface EBWidgetsApi {
  createWidget: (options: {
    widgetType: 'checkout';
    eventId: string;
    iframeContainerId: string;
    iframeContainerHeight: number;
    promoCode?: string;
    onOrderComplete?: () => void;
  }) => void;
}

declare global {
  interface Window {
    EBWidgets?: EBWidgetsApi;
  }
}

let scriptLoading: Promise<void> | undefined;
const loadWidgetScript = () => {
  if (window.EBWidgets) return Promise.resolve();
  scriptLoading ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = WIDGET_SCRIPT;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptLoading = undefined;
      reject(new Error('Failed to load the Eventbrite checkout'));
    };
    document.body.appendChild(script);
  });
  return scriptLoading;
};

/**
 * Eventbrite's own checkout, embedded on the page with the competitor's access code
 * applied. Eventbrite asks for its required order fields (name, email and the event's
 * questions) here and saves the order, so nothing is stored on this site.
 */
export const EventbriteCheckout = ({
  eventId,
  promoCode,
  fallbackUrl,
  onOrderComplete,
}: {
  eventId: string;
  promoCode: string;
  fallbackUrl: string;
  onOrderComplete: () => void;
}) => {
  const containerId = `eventbrite-checkout-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadWidgetScript()
      .then(() => {
        if (cancelled || !window.EBWidgets) return;
        window.EBWidgets.createWidget({
          widgetType: 'checkout',
          eventId,
          iframeContainerId: containerId,
          iframeContainerHeight: 700,
          promoCode,
          onOrderComplete,
        });
      })
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, [containerId, eventId, promoCode, onOrderComplete]);

  return (
    <div>
      {failed ? (
        <p className="text-sm text-red-600 dark:text-red-400">
          The Eventbrite checkout didn't load here.{' '}
          <a className="underline" href={fallbackUrl}>
            Finish your registration on Eventbrite
          </a>
          .
        </p>
      ) : (
        <div id={containerId} className="overflow-hidden rounded-md bg-white" />
      )}
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Checkout not showing?{' '}
        <a className="underline" href={fallbackUrl}>
          Open it on Eventbrite
        </a>
        .
      </p>
    </div>
  );
};
