"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import clsx from "clsx";

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const themes = [
    { id: 'light', icon: <Sun size={16} /> },
    { id: 'system', icon: <Monitor size={16} /> },
    { id: 'dark', icon: <Moon size={16} /> },
  ];

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setTheme(savedTheme);
  }, [setTheme]);

  if (!mounted) return null;

  return (
    <div className="flex items-center gap-1 p-1 rounded-full bg-black/10 dark:bg-white/10">
      {themes.map((t) => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id)}
          className={clsx(`size-7 cursor-pointer p-1 flex items-center justify-center rounded-full transition-colors`,
            {
               'bg-foreground text-background ' : (theme === t.id && t.id === 'dark') || (theme === t.id && t.id === 'system'),
               'bg-background text-foreground' : theme === t.id && t.id === 'light',
             }
           )}
           aria-label={`${t.id} theme`}
         >
           {t.icon}
         </button>
       ))}
     </div>
  );
}
