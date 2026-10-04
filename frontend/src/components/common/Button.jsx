import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

/**
 * Exact Sparkle SVG from Uiverse.io reference
 */
export const SparkleIcon = ({ className = 'btn-svg' }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
    />
  </svg>
);

/**
 * Predefined actions for theme hues and text pairs
 */
export const BUTTON_ACTIONS = {
  generate: { text: 'Generate', activeText: 'Generating', hue: 270 },
  login: { text: 'Sign In', activeText: 'Signing In', hue: 260 },
  signup: { text: 'Create Account', activeText: 'Creating Account', hue: 160 },
  getStarted: { text: 'Get Started', activeText: 'Getting Started', hue: 160 },
  startFree: { text: 'Start for Free', activeText: 'Starting Free', hue: 160 },
  createFreeAccount: { text: 'Create Free Account', activeText: 'Creating Account', hue: 160 },
  alreadyAccount: { text: 'Already have an account?', activeText: 'Signing In', hue: 260, variant: 'secondary' },
  save: { text: 'Save', activeText: 'Saving', hue: 150 },
  addIncome: { text: 'Add Income', activeText: 'Adding Income', hue: 145 },
  addExpense: { text: 'Add Expense', activeText: 'Adding Expense', hue: 350 },
  delete: { text: 'Delete', activeText: 'Deleting', hue: 355, variant: 'danger' },
  upload: { text: 'Upload', activeText: 'Uploading', hue: 195 },
  download: { text: 'Download', activeText: 'Downloading', hue: 195 },
  search: { text: 'Search', activeText: 'Searching', hue: 220 },
  filter: { text: 'Filter', activeText: 'Filtering', hue: 260 },
  export: { text: 'Export', activeText: 'Exporting', hue: 210 },
  markAsPaid: { text: 'Mark as Paid', activeText: 'Processing...', hue: 142 },
  lend: { text: 'Lend Money', activeText: 'Lending Money', hue: 155 },
  borrow: { text: 'Borrow Money', activeText: 'Borrowing...', hue: 275 },
  extendDate: { text: 'Extend Date', activeText: 'Updating...', hue: 38 },
  generateReport: { text: 'Generate Report', activeText: 'Generating...', hue: 265 },
  logout: { text: 'Logout', activeText: 'Logging Out', hue: 350, variant: 'ghost' },
};

/**
 * Extracts plain text from React children
 */
function extractText(node) {
  if (node === null || node === undefined || typeof node === 'boolean') return '';
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (typeof node === 'object' && node.props && node.props.children) {
    return extractText(node.props.children);
  }
  return '';
}

/**
 * Intelligently computes the base button name and progressive active name
 * "take a button name as per button name"
 */
export function getButtonPair(name, customLoadingText) {
  if (!name || typeof name !== 'string') {
    return {
      text1: 'Submit',
      text2: customLoadingText || 'Submitting...',
    };
  }

  const trimmed = name.trim();
  if (customLoadingText) {
    return { text1: trimmed, text2: customLoadingText };
  }

  const exactMap = {
    'Generate': 'Generating',
    'Generate Report': 'Generating Report',
    'Sign In': 'Signing In',
    'Sign In to Montra': 'Signing In...',
    'Sign in to Montra': 'Signing In...',
    'Create Account': 'Creating Account',
    'Get Started': 'Getting Started',
    'Get Started Free': 'Getting Started',
    'Start for Free': 'Starting Free',
    'Start for free': 'Starting Free',
    'Start For Free': 'Starting Free',
    'Create Free Account': 'Creating Account',
    'Create free account': 'Creating Account',
    'Already have an account?': 'Signing In',
    'Already have an account': 'Signing In',
    'Already Have an Account': 'Signing In',
    'Save': 'Saving',
    'Save Changes': 'Saving Changes',
    'Save Expense': 'Saving Expense',
    'Save Income': 'Saving Income',
    'Save Budget': 'Saving Budget',
    'Add Income': 'Adding Income',
    'Add Expense': 'Adding Expense',
    'Add Transaction': 'Adding Transaction',
    'Add Budget': 'Adding Budget',
    'Add Staff': 'Adding Staff',
    'Add Staff Member': 'Adding Staff',
    'Add Category': 'Adding Category',
    'Create Budget': 'Creating Budget',
    'New Transaction': 'Creating...',
    'Record First Transaction': 'Recording...',
    'Add First Budget': 'Creating...',
    'Delete': 'Deleting',
    'Delete Account': 'Deleting Account',
    'Delete Category': 'Deleting Category',
    'Remove': 'Removing',
    'Filter': 'Filtering',
    'Apply Filters': 'Applying Filters',
    'Reset Filters': 'Resetting Filters',
    'Clear Filters': 'Clearing...',
    'Search': 'Searching',
    'Export': 'Exporting',
    'Export CSV': 'Exporting CSV',
    'Export Report': 'Exporting Report',
    'Download': 'Downloading',
    'Download PDF': 'Downloading PDF',
    'Upload': 'Uploading',
    'Quick Demo Login': 'Logging In',
    'Demo Login': 'Logging In',
    'Logout': 'Logging Out',
    'Sign Out': 'Signing Out',
    'Send': 'Sending',
    'Send Reset Link': 'Sending Link',
    'Reset Password': 'Resetting...',
    'Update Password': 'Updating...',
    'Mark as Paid': 'Marking Paid',
    'Mark all as read': 'Marking All Read',
    'Mark as read': 'Marking Read',
    'Mark all read': 'Marking Read',
    'Lend Money': 'Lending Money',
    'Borrow Money': 'Borrowing...',
    'Extend Date': 'Extending Date',
    'Process Payroll': 'Processing Payroll',
    'Pay All Staff': 'Processing Pay',
    'Pay Now': 'Paying...',
    'Confirm': 'Confirming',
    'Cancel': 'Canceling',
    'Submit': 'Submitting',
    'Update': 'Updating',
    'Close': 'Closing',
  };

  if (exactMap[trimmed]) {
    return { text1: trimmed, text2: exactMap[trimmed] };
  }

  // Fallback: derive gerund from first word
  const words = trimmed.split(' ');
  const first = words[0];
  const rest = words.slice(1).join(' ');
  const lower = first.toLowerCase();

  let gerund = '';
  if (lower.endsWith('e') && !lower.endsWith('ee')) {
    gerund = first.slice(0, -1) + 'ing';
  } else if (lower.endsWith('y')) {
    gerund = first + 'ing';
  } else if (/[bcdfghjklmnpqrstvwxyz][aeiou][bcdfghjklmnpqrstvwxyz]$/i.test(first) && !['w', 'x', 'y'].includes(lower.slice(-1))) {
    gerund = first + first.slice(-1) + 'ing';
  } else {
    gerund = first + 'ing';
  }

  const derived = rest ? `${gerund} ${rest}` : `${gerund}...`;
  return { text1: trimmed, text2: derived };
}

/**
 * Renders letters as individual spans with staggered delay matching Uiverse.io
 */
export const renderLetters = (text) => {
  if (typeof text !== 'string') return text;
  return text.split('').map((char, index) => (
    <span
      key={`${char}-${index}`}
      className="btn-letter"
      style={{
        animationDelay: `${(index * 0.08).toFixed(2)}s`,
        whiteSpace: char === ' ' ? 'pre' : undefined,
      }}
    >
      {char}
    </span>
  ));
};

/**
 * AnimatedButton — Exact Uiverse.io Animated Motion Button
 */
export const AnimatedButton = React.forwardRef(({
  action,
  variant,
  size = 'md',
  loading = false,
  isLoading,
  disabled = false,
  icon: CustomIcon,
  leftIcon,
  rightIcon,
  noIcon = false,
  fullWidth = false,
  loadingText,
  activeText,
  hue,
  to,
  href,
  className,
  wrapperClassName,
  style,
  children,
  onClick,
  type = 'button',
  'aria-label': ariaLabel,
  ...props
}, ref) => {
  const isBusy = Boolean(loading || isLoading);
  const actionConfig = action ? BUTTON_ACTIONS[action] : null;

  // Resolve button label & active progressive tense
  const rawLabel = extractText(children) || actionConfig?.text || 'Submit';
  const customProgressive = loadingText || activeText || actionConfig?.activeText;
  const { text1, text2 } = useMemo(
    () => getButtonPair(rawLabel, customProgressive),
    [rawLabel, customProgressive]
  );

  const activeVariant = variant || actionConfig?.variant;
  const effectiveHue = hue !== undefined ? hue : actionConfig?.hue;

  const handleClick = (e) => {
    if (disabled || isBusy) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  // Resolve Icon
  const IconComponent = CustomIcon || leftIcon;

  // Resolve element type: Link if `to`, <a> if `href`, else <button>
  const Component = href ? 'a' : (to ? Link : 'button');

  return (
    <div className={cn('btn-wrapper', fullWidth && 'btn-block', wrapperClassName)}>
      <Component
        ref={ref}
        {...(Component === 'button' ? { type } : {})}
        {...(Component === Link ? { to } : {})}
        {...(Component === 'a' ? { href: href || to } : {})}
        disabled={Component === 'button' ? (disabled || isBusy) : undefined}
        onClick={handleClick}
        aria-label={ariaLabel || text1}
        aria-busy={isBusy}
        aria-disabled={disabled || isBusy}
        className={cn(
          'btn',
          'group',
          `btn-size-${size}`,
          activeVariant && `btn-variant-${activeVariant}`,
          isBusy && 'is-loading',
          disabled && 'is-disabled',
          className
        )}
        style={{
          ...(effectiveHue !== undefined ? { '--highlight-color-hue': `${effectiveHue}deg` } : {}),
          ...style,
        }}
        {...props}
      >
        {/* Leading Sparkle SVG or Custom Icon */}
        {!noIcon && (
          IconComponent ? (
            React.isValidElement(IconComponent) ? (
              <span className="btn-svg inline-flex items-center justify-center">
                {IconComponent}
              </span>
            ) : (
              <IconComponent className="btn-svg" />
            )
          ) : (
            <SparkleIcon />
          )
        )}

        {/* Dynamic Dual-Layer Animated Text */}
        <div className="txt-wrapper">
          <div className="txt-1">
            {renderLetters(text1)}
          </div>
          <div className="txt-2">
            {renderLetters(text2)}
          </div>
        </div>

        {/* Trailing Icon if passed */}
        {rightIcon && (
          <span className="ml-2 inline-flex items-center transition-transform group-hover:translate-x-0.5 duration-200">
            {rightIcon}
          </span>
        )}
      </Component>
    </div>
  );
});

AnimatedButton.displayName = 'AnimatedButton';

/**
 * Universal Button Export
 * All buttons in Montra use the AnimatedButton implementation
 */
export const Button = AnimatedButton;

export default Button;
