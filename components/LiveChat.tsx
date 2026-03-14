"use client";

import { useEffect } from "react";

type Provider = "tawk" | "crisp";

type LiveChatProps = {
  provider?: Provider;
};

// Simple client-side loader for Tawk.to or Crisp scripts.
export function LiveChat({ provider = "tawk" }: LiveChatProps) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (provider === "tawk") {
      const propertyId = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID;
      const widgetId = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID;
      if (!propertyId || !widgetId) return;

      const s1 = document.createElement("script");
      s1.async = true;
      s1.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
      s1.charset = "UTF-8";
      s1.setAttribute("crossorigin", "*");
      document.body.appendChild(s1);
      return () => {
        document.body.removeChild(s1);
      };
    }

    if (provider === "crisp") {
      const websiteId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID;
      if (!websiteId) return;

      (window as any).$crisp = [];
      (window as any).CRISP_WEBSITE_ID = websiteId;
      const d = document;
      const s = d.createElement("script");
      s.src = "https://client.crisp.chat/l.js";
      s.async = true;
      d.getElementsByTagName("head")[0].appendChild(s);
      return () => {
        d.getElementsByTagName("head")[0].removeChild(s);
      };
    }
  }, [provider]);

  return null;
}

