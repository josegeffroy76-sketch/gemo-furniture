"use client";

import { useEffect, useRef } from "react";

export type ParsedAddress = {
  street1: string;
  city: string;
  state: string;
  zip: string;
};

type AddressComponent = { longText: string; shortText: string; types: string[] };

// The Google Maps JS API attaches itself to `window.google`; there's no
// first-party TypeScript package for the (still fairly new) Places UI Kit
// web components, so we type only the handful of members we actually touch
// and isolate the `any`s to this one loader function.
/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    google?: any;
  }
}

function loadGoogleMapsScript(apiKey: string): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google?.maps?.importLibrary) return Promise.resolve();
  if ((window as any).__gemoGoogleMapsLoading) return (window as any).__gemoGoogleMapsLoading;

  const loading = new Promise<void>((resolve, reject) => {
    // Google's official dynamic library-import bootstrap loader.
    // https://developers.google.com/maps/documentation/javascript/load-maps-js-api
    (g => {
      let h: Promise<void> | undefined, a: HTMLScriptElement;
      const c = "google", l = "importLibrary", q = "__ib__", m = document, b = window as any;
      b[c] = b[c] || {};
      const d = (b[c].maps = b[c].maps || {});
      const r = new Set<string>();
      const e = new URLSearchParams();
      const u = () =>
        h ||
        (h = new Promise<void>((f, n) => {
          a = m.createElement("script");
          e.set("libraries", [...r].join(","));
          for (const k in g) e.set(k.replace(/[A-Z]/g, (t: string) => "_" + t[0].toLowerCase()), (g as any)[k]);
          e.set("callback", c + ".maps." + q);
          a.src = `https://maps.${c}apis.com/maps/api/js?` + e.toString();
          d[q] = f;
          a.onerror = () => (h = n(new Error("The Google Maps JavaScript API could not load.")) as any);
          a.nonce = (m.querySelector("script[nonce]") as HTMLScriptElement | null)?.nonce || "";
          m.head.append(a);
        }));
      if (d[l]) {
        console.warn("The Google Maps JavaScript API only loads once. Ignoring:", g);
      } else {
        d[l] = (f: string, ...n: any[]) => r.add(f) && u().then(() => d[l](f, ...n));
      }
    })({ key: apiKey, v: "weekly" });

    function poll() {
      if (window.google?.maps?.importLibrary) resolve();
      else if (document.querySelector('script[src*="maps.googleapis.com"]')) setTimeout(poll, 100);
      else reject(new Error("Google Maps script failed to initialize."));
    }
    poll();
  });

  (window as any).__gemoGoogleMapsLoading = loading;
  return loading;
}

function findComponent(components: AddressComponent[], type: string, useShort = false) {
  const match = components.find((c) => c.types.includes(type));
  if (!match) return "";
  return useShort ? match.shortText : match.longText;
}

/**
 * Google Places address autocomplete for the checkout shipping form.
 * Renders nothing (falls back silently) if no API key is configured, so
 * the plain manual address fields keep working without this feature.
 */
export default function AddressAutocomplete({
  apiKey,
  onSelect,
  placeholder = "Start typing your street address…",
}: {
  apiKey: string;
  onSelect: (address: ParsedAddress) => void;
  placeholder?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onSelectRef = useRef(onSelect);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    if (!apiKey) return;
    let cancelled = false;
    let element: any = null;
    const container = containerRef.current;

    async function init() {
      try {
        await loadGoogleMapsScript(apiKey);
        if (cancelled || !container) return;
        const { PlaceAutocompleteElement } = await window.google.maps.importLibrary("places");
        if (cancelled || !container) return;

        element = new PlaceAutocompleteElement();
        element.includedRegionCodes = ["us"];
        element.placeholder = placeholder;
        container.innerHTML = "";
        container.appendChild(element);

        element.addEventListener("gmp-select", async (event: any) => {
          try {
            const place = event.placePrediction.toPlace();
            await place.fetchFields({ fields: ["addressComponents", "formattedAddress"] });
            const components: AddressComponent[] = place.addressComponents ?? [];
            const streetNumber = findComponent(components, "street_number");
            const route = findComponent(components, "route");
            onSelectRef.current({
              street1: [streetNumber, route].filter(Boolean).join(" "),
              city:
                findComponent(components, "locality") ||
                findComponent(components, "sublocality") ||
                findComponent(components, "postal_town"),
              state: findComponent(components, "administrative_area_level_1", true),
              zip: findComponent(components, "postal_code"),
            });
          } catch (err) {
            console.error("Couldn't parse the selected address:", err);
          }
        });
      } catch (err) {
        console.error("Google address autocomplete failed to load:", err);
      }
    }

    void init();

    return () => {
      cancelled = true;
      if (element && container?.contains(element)) container.removeChild(element);
    };
  }, [apiKey, placeholder]);

  if (!apiKey) return null;

  return <div ref={containerRef} className="gemo-address-autocomplete" />;
}
/* eslint-enable @typescript-eslint/no-explicit-any */
