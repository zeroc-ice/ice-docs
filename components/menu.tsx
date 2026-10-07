// Copyright (c) ZeroC, Inc.

'use client';

import {
  type MouseEvent,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState
} from 'react';
import Link from 'next/link';
import { clsx } from 'clsx';
import { Check } from 'lucide-react';

const itemSelector = '[role="menuitem"], [role="menuitemradio"]';

// A button that opens a list of choices, after the WAI-ARIA menu button
// pattern (https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/). The list is
// positioned in the page under the button, so it scrolls with the page.
export function Menu({
  trigger,
  triggerClassName,
  align,
  children
}: {
  /** The button's content. */
  trigger: ReactNode;
  triggerClassName: string;
  /** The edge of the button the list lines up with. */
  align: 'left' | 'right';
  /** The `MenuItem` and `MenuSeparator` elements. */
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const buttonId = useId();

  const closeToButton = () => {
    setOpen(false);
    button.current!.focus();
  };

  useEffect(() => {
    if (!open) return;

    // Start on the current choice, or on the first. Opening the list does not
    // scroll the page; only moving through it with the keyboard does. A list
    // cut short by the viewport scrolls itself to show that choice.
    const start =
      list.current!.querySelector<HTMLElement>('[aria-checked="true"]') ??
      list.current!.querySelector<HTMLElement>(itemSelector)!;
    start.focus({ preventScroll: true });
    list.current!.scrollTop = Math.max(
      0,
      start.offsetTop + start.offsetHeight - list.current!.clientHeight
    );

    // A press anywhere else closes the list and does nothing more, as in a
    // native menu: the click it would make is dropped. A press that makes no
    // click, such as one on the scrollbar, leaves the drop to the next press.
    const onPointerDown = (event: PointerEvent) => {
      if (root.current!.contains(event.target as Node)) return;
      setOpen(false);
      const dropClick = (click: Event) => {
        click.preventDefault();
        click.stopPropagation();
      };
      document.addEventListener('click', dropClick, {
        capture: true,
        once: true
      });
      document.addEventListener(
        'pointerdown',
        () =>
          document.removeEventListener('click', dropClick, { capture: true }),
        { capture: true, once: true }
      );
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  return (
    <div ref={root} className="relative flex min-w-0">
      <button
        ref={button}
        id={buttonId}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        // Enter and Space open the list by clicking the button.
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown') {
            event.preventDefault();
            setOpen(true);
          }
        }}
        className={triggerClassName}
      >
        {trigger}
      </button>
      {open && (
        <div
          ref={list}
          role="menu"
          aria-labelledby={buttonId}
          tabIndex={-1}
          onKeyDown={(event) => {
            const items = Array.from(
              event.currentTarget.querySelectorAll<HTMLElement>(itemSelector)
            );
            const index = items.indexOf(event.target as HTMLElement);
            switch (event.key) {
              case 'ArrowDown':
                items[(index + 1) % items.length].focus();
                break;
              case 'ArrowUp':
                items[(index <= 0 ? items.length : index) - 1].focus();
                break;
              case 'Home':
                items[0].focus();
                break;
              case 'End':
                items[items.length - 1].focus();
                break;
              case 'Enter':
              case ' ':
                // A link does not answer Space, so the list clicks the item
                // for either key.
                items[index]?.click();
                break;
              case 'Escape':
                closeToButton();
                break;
              case 'Tab':
                // Focus moves on from the button, as if the list had never
                // been open.
                closeToButton();
                return;
              default: {
                // A printable character moves to the next item whose label
                // begins with it.
                if (
                  event.key.length !== 1 ||
                  event.metaKey ||
                  event.ctrlKey ||
                  event.altKey
                )
                  return;
                const typed = event.key.toLowerCase();
                const after = [
                  ...items.slice(index + 1),
                  ...items.slice(0, index + 1)
                ];
                after
                  .find((item) =>
                    item.textContent.trim().toLowerCase().startsWith(typed)
                  )
                  ?.focus();
              }
            }
            event.preventDefault();
          }}
          onClick={(event) => {
            if ((event.target as Element).closest(itemSelector)) {
              closeToButton();
            }
          }}
          // The pointer moves the focus too, so only one item is ever
          // highlighted.
          onMouseMove={(event) => {
            (event.target as Element)
              .closest<HTMLElement>(itemSelector)
              ?.focus({ preventScroll: true });
          }}
          // A list in the sticky header does not move when the page scrolls, so
          // it keeps within the viewport and scrolls itself.
          className={clsx(
            'absolute top-full z-30 mt-1 max-h-[calc(100dvh-4rem)] w-max min-w-[max(100%,8rem)] overflow-y-auto rounded-md border border-hairline bg-surface p-1 text-ink shadow-lg outline-hidden',
            align === 'left' ? 'left-0' : 'right-0'
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

// A choice in a `Menu`: a link when it has an `href`, otherwise a button that
// calls `onSelect`. Choosing it closes the menu; choosing the current choice
// does nothing else.
export function MenuItem({
  href,
  onSelect,
  checked,
  children
}: {
  href?: string;
  onSelect?: () => void;
  /** Whether it is the current choice, for an item among alternatives. */
  checked?: boolean;
  children: ReactNode;
}) {
  const props = {
    role: checked === undefined ? 'menuitem' : 'menuitemradio',
    'aria-checked': checked,
    tabIndex: -1,
    onClick: (event: MouseEvent) => {
      if (checked) event.preventDefault();
      else onSelect?.();
    },
    className:
      'focus:bg-surface-sunken flex w-full items-center justify-between gap-3 rounded-sm px-2.5 py-1.5 text-sm outline-hidden transition-colors select-none'
  };
  const content = (
    <>
      {children}
      {checked && (
        <Check aria-hidden="true" className="size-4 shrink-0 text-link" />
      )}
    </>
  );
  return href ? (
    <Link href={href} {...props}>
      {content}
    </Link>
  ) : (
    <button type="button" {...props}>
      {content}
    </button>
  );
}

export function MenuSeparator() {
  return <div role="separator" className="-mx-1 my-1 h-px bg-hairline" />;
}
