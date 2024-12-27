import React, { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { setCookie } from "@/utils/cookie";

interface ThemeToggleProps {
  initialDark?: boolean;
}
export const ThemeToggle = (props: ThemeToggleProps) => {
  const [dark, setDark] = useState(props.initialDark ?? false);
  return (
    <>
      <button
        onClick={() => {
          if (dark) {
            document.documentElement.classList.remove("dark");
            setCookie("theme", "light");
          } else {
            document.documentElement.classList.add("dark");
            setCookie("theme", "dark");
          }
          setDark(!dark);
        }}
      >
        {dark ? <Sun size={16} /> : <Moon size={16} />}
      </button>
    </>
  );
};
