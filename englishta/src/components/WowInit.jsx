"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function WowInit() {
  const pathname = usePathname();

  useEffect(() => {
    let attempts = 0;
    let timer;

    const bootWow = () => {
      attempts += 1;

      if (typeof window !== "undefined" && window.WOW) {
        if (!window.__englishtaWow) {
          window.__englishtaWow = new window.WOW({
            boxClass: "wow",
            animateClass: "animated",
            offset: 70,
            mobile: true,
            live: true,
          });
          window.__englishtaWow.init();
        } else if (window.__englishtaWow.sync) {
          window.__englishtaWow.sync();
        }

        return;
      }

      if (attempts < 20) {
        timer = window.setTimeout(bootWow, 150);
      }
    };

    timer = window.setTimeout(bootWow, 150);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  return null;
}
