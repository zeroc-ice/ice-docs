// Copyright (c) ZeroC, Inc.

'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Menu, MenuItem } from '@/components/menu';
import { Theme } from '@/types';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Menu
      align="right"
      triggerClassName="dark:hover:bg-dark-accent flex size-10 items-center justify-center rounded-md transition-colors hover:bg-zinc-100"
      trigger={
        <>
          <Sun className="size-[1.2rem] scale-100 rotate-0 ring-0 ring-offset-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute size-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0 dark:text-white" />
          <span className="sr-only">Toggle theme</span>
        </>
      }
    >
      <MenuItem
        checked={theme === Theme.Light}
        onSelect={() => setTheme(Theme.Light)}
      >
        Light
      </MenuItem>
      <MenuItem
        checked={theme === Theme.Dark}
        onSelect={() => setTheme(Theme.Dark)}
      >
        Dark
      </MenuItem>
      <MenuItem
        checked={theme === Theme.System}
        onSelect={() => setTheme(Theme.System)}
      >
        System
      </MenuItem>
    </Menu>
  );
}
