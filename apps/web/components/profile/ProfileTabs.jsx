"use client";

import { cn } from "@/lib/utils";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "anime", label: "Anime List" },
  { id: "manga", label: "Manga List" },
  { id: "reviews", label: "Reviews" },
  { id: "history", label: "History" },
];

/**
 * ProfileTabs — Tab navigasi horizontal pada halaman profil.
 */
export default function ProfileTabs({ activeTab, onChangeTab }) {
  return (
    <nav
      aria-label="Navigasi tab profil"
      className="mt-6 border-b border-border"
    >
      <div className="flex items-center gap-0.5 overflow-x-auto px-1 no-scrollbar">
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChangeTab(tab.id)}
              className={cn(
                "relative whitespace-nowrap px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer select-none",
                active
                  ? "text-primary"
                  : "text-text-2 hover:text-text"
              )}
            >
              {tab.label}
              {active && (
                <span className="absolute inset-x-0 -bottom-px h-[2px] bg-primary rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
