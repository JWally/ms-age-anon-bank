// src/components/Link.tsx
import React from "react";

interface LinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Link: React.FC<LinkProps> = ({ to, children, className, onClick }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Allow new-tab or non-left clicks to work normally
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    ) {
      return;
    }

    const target = e.currentTarget as HTMLAnchorElement;
    const url = new URL(target.href, location.origin);

    // Only intercept same-origin links
    if (url.origin !== location.origin) {
      return;
    }

    e.preventDefault();

    // Execute optional onClick handler
    if (onClick) {
      onClick();
    }

    // Navigate if the path is different
    if (url.pathname !== location.pathname || url.search !== location.search) {
      window.history.pushState({}, "", url.pathname + url.search + url.hash);
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  };

  const isActive = to === window.location.pathname;

  return (
    <a
      href={to}
      onClick={handleClick}
      className={className}
      role="link"
      aria-current={isActive ? "page" : undefined}
    >
      {children}
    </a>
  );
};

export default Link;
