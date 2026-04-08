"use client";

import { useState, useRef, useEffect } from "react";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  label: string;
  id: string;
}

export function CustomSelect({ options, value, onChange, label, id }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? value;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") setIsOpen(false);
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen((o) => !o);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</span>
      <div ref={ref} className="relative">
        <button
          id={id}
          type="button"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={`${id}-listbox`}
          onClick={() => setIsOpen((o) => !o)}
          onKeyDown={handleKeyDown}
          className="inline-flex items-center gap-2 h-9 pl-3 pr-2 rounded-xl
            border border-gray-200 bg-white/80 backdrop-blur-sm
            text-sm text-gray-700 font-medium
            hover:border-purple-300 hover:bg-purple-50/50
            focus:outline-none focus:ring-2 focus:ring-purple-500
            dark:bg-gray-800/80 dark:border-gray-700 dark:text-gray-300
            dark:hover:border-purple-600 dark:hover:bg-purple-900/20
            transition-all cursor-pointer"
        >
          {selectedLabel}
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div
            id={`${id}-listbox`}
            role="listbox"
            className="absolute top-full left-0 mt-1.5 min-w-[140px] py-1.5
              rounded-xl border border-gray-200 bg-white shadow-xl shadow-gray-200/50
              dark:bg-gray-800 dark:border-gray-700 dark:shadow-black/30
              z-[100] overflow-hidden"
            style={{ animation: "fade-in-up 0.15s ease-out" }}
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={opt.value === value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm transition-colors cursor-pointer
                  flex items-center gap-2
                  ${opt.value === value
                    ? "bg-purple-50 text-purple-700 font-medium dark:bg-purple-900/30 dark:text-purple-300"
                    : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50"
                  }`}
              >
                {opt.value === value && (
                  <svg className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {opt.value !== value && <span className="w-3.5 shrink-0" />}
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
