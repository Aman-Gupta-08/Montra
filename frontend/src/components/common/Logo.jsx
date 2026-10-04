import React from 'react';

/**
 * MontraLogo – SVG logo mark + wordmark
 */
export function MontraLogo({ size = 'md', className = '', textColor = '' }) {
  const sizes = {
    sm: { icon: 24, text: 'text-lg' },
    md: { icon: 32, text: 'text-2xl' },
    lg: { icon: 40, text: 'text-3xl' },
  };
  const { icon, text } = sizes[size] || sizes.md;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect width="40" height="40" rx="12" fill="url(#logoGrad)" />
        <path
          d="M10 28V14l10 8 10-8v14"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="20" cy="20" r="3" fill="white" opacity="0.85" />
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#7C5CFC" />
            <stop offset="1" stopColor="#10B981" />
          </linearGradient>
        </defs>
      </svg>
      <span className={`font-bold tracking-tight ${text} ${textColor || 'text-gray-900 dark:text-white'}`}>
        Montra
      </span>
    </div>
  );
}

export default MontraLogo;
