import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Shield, Zap, PieChart, Bell, CreditCard,
  GraduationCap, Briefcase, Building2, ChevronRight,
  Lock, Eye, Server, CheckCircle, ArrowRight, Star,
  HandCoins, Wallet, Sparkles, CheckCheck
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { CinematicFooter } from '../components/ui/motion-footer';
import KineticGrid from '../components/ui/kinetic-grid';
import { useTheme } from '../context/ThemeContext';
import { AccountTypeShinyButton } from '../components/ui/shiny-button';
import { AnimatedButton } from '../components/common/Button';

/* ─── Animation helpers ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

function Section({ children, className = '', id, style }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.section
      ref={ref}
      id={id}
      style={style}
      variants={stagger}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* ─── Features data ─── */
const features = [
  {
    icon: PieChart,
    title: 'Smart Budgeting',
    description: 'Set monthly budgets by category and get real-time alerts when you\'re close to limits.',
    color: 'rgba(237, 235, 247, 0.7)',
    iconColor: '#7C5CFC',
  },
  {
    icon: TrendingUp,
    title: 'Expense Analytics',
    description: 'Beautiful charts and insights to understand exactly where your money goes.',
    color: 'rgba(230, 247, 246, 0.7)',
    iconColor: '#0EA5E9',
  },
  {
    icon: Bell,
    title: 'Smart Reminders',
    description: 'Never miss a bill or recurring payment with automated notifications.',
    color: 'rgba(250, 248, 235, 0.7)',
    iconColor: '#F59E0B',
  },
  {
    icon: CreditCard,
    title: 'Multi-Account',
    description: 'Link and manage all your bank accounts and cards in one unified view.',
    color: 'rgba(246, 252, 228, 0.7)',
    iconColor: '#84CC16',
  },
  {
    icon: Zap,
    title: 'Instant Sync',
    description: 'Real-time transaction sync keeps your records always up to date.',
    color: 'rgba(230, 247, 228, 0.7)',
    iconColor: '#10B981',
  },
  {
    icon: Shield,
    title: 'Bank-Grade Security',
    description: '256-bit encryption and SOC 2 compliant infrastructure keeps your data safe.',
    color: 'rgba(215, 242, 230, 0.7)',
    iconColor: '#059669',
  },
];

/* ─── Account Types data ─── */
const accountTypes = [
  {
    icon: GraduationCap,
    type: 'STUDENT',
    title: 'For Students',
    buttonLabel: 'Get Started as Student',
    tagline: 'Smart spending on a student budget',
    color: '#090b13',
    accent: '#7c3aed',
    accentSoft: '#c4b5fd',
    borderColor: 'rgba(124, 58, 237, 0.35)',
    perks: [
      'Track allowances & scholarships',
      'Split bills with classmates',
      'Set savings goals for textbooks',
      'Free tier with all essentials',
    ],
  },
  {
    icon: Briefcase,
    type: 'EMPLOYEE',
    title: 'For Employees',
    buttonLabel: 'Get Started as Employee',
    tagline: 'Grow your savings from every paycheck',
    color: '#070e17',
    accent: '#0284c7',
    accentSoft: '#7dd3fc',
    borderColor: 'rgba(2, 132, 199, 0.4)',
    featured: true,
    perks: [
      'Automated savings targets',
      'Track recurring bills & subscriptions',
      'Investment & emergency fund tracking',
      'Monthly financial health score',
    ],
  },
  {
    icon: Building2,
    type: 'BUSINESS_OWNER',
    title: 'For Business Owners',
    buttonLabel: 'Get Started as Business',
    tagline: 'Keep business & personal finances clean',
    color: '#140a05',
    accent: '#ea580c',
    accentSoft: '#fdba74',
    borderColor: 'rgba(234, 88, 12, 0.35)',
    perks: [
      'Separate personal & business expenses',
      'Track sales, staff & payroll salaries',
      'GST & tax categorization',
      'Cash flow projections',
    ],
  },
];

/* ─── Security Features ─── */
const securityFeatures = [
  { icon: Lock, title: '256-Bit AES Encryption', desc: 'All data is encrypted in transit and at rest with military-grade keys.' },
  { icon: Server, title: 'SOC 2 Type II Compliant', desc: 'Independently audited infrastructure following global best practices.' },
  { icon: Eye, title: 'Strict Privacy Controls', desc: 'We never sell your data or share your financial records with advertisers.' },
  { icon: Shield, title: 'Biometric & MFA Ready', desc: 'Secure login via hardware keys, TOTP authenticator, and biometrics.' },
];

/* ─── Testimonials ─── */
const testimonials = [
  { name: 'Priya S.', role: 'Student, IIT Delhi', text: 'Montra helped me stay within my ₹8,000 monthly budget. The liquid charts are incredible!', rating: 5 },
  { name: 'Rahul M.', role: 'Software Engineer', text: 'Finally a finance app with genuine glass aesthetic that doesn\'t feel bloated. The insights are razor sharp.', rating: 5 },
  { name: 'Anjali K.', role: 'Business Owner', text: 'Separating business from personal expenses used to be a nightmare. Montra made it effortless.', rating: 5 },
];

/* ═══════════════════════════════════════════════════════════════
   LANDING PAGE (Glossy Glass / Liquid Glass Design System)
   ════════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  return (
    <KineticGrid
      className="min-h-screen overflow-x-hidden relative"
      globalColor={isDark ? "default" : "light"}
    >
      {/* Environmental Ambient Blobs: Montra Brand Palette */}
      <div
        aria-hidden="true"
        className="absolute top-10 left-1/4 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none opacity-40 dark:opacity-20 animate-ambient-pulse"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(124, 92, 252, 0.18) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(237, 235, 247, 0.9) 0%, rgba(230, 247, 246, 0.5) 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute top-[40%] right-[10%] w-[520px] h-[520px] rounded-full blur-[150px] pointer-events-none opacity-35 dark:opacity-15 animate-ambient-pulse"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(16, 185, 129, 0.14) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(230, 247, 228, 0.85) 0%, rgba(250, 248, 235, 0.5) 100%)',
        }}
      />

      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-1 text-xs font-semibold text-gray-700 dark:text-gray-300 mb-8 border border-white/80 dark:border-white/10 shadow-xs"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400" />
            <span>Now in Beta · Trusted by 10,000+ users</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-black leading-[1.08] tracking-tight mb-6 text-gray-900 dark:text-white"
          >
            Take Control of Your{' '}
            <span
              className="inline-block"
              style={{
                background: 'linear-gradient(135deg, #7C5CFC 0%, #10B981 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Money
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            className="text-base sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal"
          >
            Whether you're a student, employee, or business owner — Montra gives you
            the clarity to spend smarter, save more, and stress less.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <AnimatedButton
              id="hero-cta-primary"
              action="startFree"
              to="/register"
              size="lg"
              hue={160}
              rightIcon={<ArrowRight size={18} />}
            >
              Start for Free
            </AnimatedButton>
            <AnimatedButton
              id="hero-cta-secondary"
              action="login"
              variant="secondary"
              to="/login"
              size="lg"
              hue={260}
            >
              Sign In
            </AnimatedButton>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
            className="mt-10 flex items-center justify-center gap-3"
          >
            <div className="flex -space-x-2">
              {['#7C5CFC', '#10B981', '#F59E0B', '#EF4444', '#0EA5E9'].map((color, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center text-xs font-bold text-white shadow-xs"
                  style={{ background: color }}
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <span className="font-bold text-gray-900 dark:text-white">4.9</span>
              {' '}from{' '}
              <span className="font-bold text-gray-900 dark:text-white">2,400+</span>
              {' '}reviews
            </div>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={13} className="text-amber-400 fill-amber-400" />
              ))}
            </div>
          </motion.div>

          {/* ── FLOATING GLASS FINANCIAL HERO CARDS ─────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="mt-16 max-w-4xl mx-auto relative"
          >
            {/* Ambient Refraction Glow beneath the cards */}
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 via-emerald-500/15 to-cyan-500/20 rounded-[36px] blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 relative z-10">
              
              {/* Card 1: Income ₹25,000 */}
              <div className="glass-card glossy-panel rounded-3xl p-5 text-left border border-white/90 dark:border-white/15 animate-float-1">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-2xl glass-1 flex items-center justify-center bg-emerald-500/15 border border-emerald-500/25">
                    <TrendingUp size={20} className="text-emerald-500" />
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    +14.2%
                  </span>
                </div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                  Income
                </p>
                <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                  ₹25,000
                </p>
              </div>

              {/* Card 2: Expenses ₹12,400 */}
              <div className="glass-card glossy-panel rounded-3xl p-5 text-left border border-white/90 dark:border-white/15 animate-float-2">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-2xl glass-1 flex items-center justify-center bg-rose-500/15 border border-rose-500/25">
                    <TrendingDown size={20} className="text-rose-500" />
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                    On Budget
                  </span>
                </div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                  Expenses
                </p>
                <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                  ₹12,400
                </p>
              </div>

              {/* Card 3: Available Balance ₹12,600 */}
              <div className="glass-card glossy-panel rounded-3xl p-5 text-left border border-white/90 dark:border-white/15 animate-float-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-2xl glass-1 flex items-center justify-center bg-violet-500/15 border border-violet-500/25">
                    <Wallet size={20} className="text-violet-600 dark:text-violet-400" />
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
                    Active
                  </span>
                </div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                  Available Balance
                </p>
                <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                  ₹12,600
                </p>
              </div>

              {/* Card 4: Money Lent ₹4,000 */}
              <div className="glass-card glossy-panel rounded-3xl p-5 text-left border border-white/90 dark:border-white/15 animate-float-1">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-2xl glass-1 flex items-center justify-center bg-sky-500/15 border border-sky-500/25">
                    <HandCoins size={20} className="text-sky-500" />
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                    2 Loans
                  </span>
                </div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                  Money Lent
                </p>
                <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                  ₹4,000
                </p>
              </div>

            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────── */}
      <Section id="features" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-16">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold glass-1 text-gray-700 dark:text-gray-300 mb-4 border border-white/80 dark:border-white/10">
              FEATURES
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
              Everything you need to{' '}
              <span style={{
                background: 'linear-gradient(135deg, #7C5CFC, #10B981)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                master your finances
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto text-base">
              Powerful tools designed to make financial management intuitive, insightful, and transparent.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                transition={{ delay: i * 0.05 }}
                className="glass-card glossy-panel rounded-3xl p-6 group transition-all duration-300 cursor-default hover:-translate-y-1 hover:shadow-xl"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 glass-1 border"
                  style={{
                    background: feature.color,
                    borderColor: `${feature.iconColor}33`,
                  }}
                >
                  <feature.icon size={22} style={{ color: feature.iconColor }} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── ACCOUNT TYPES (SHINY BUTTONS DESIGN) ─────────────────── */}
      <Section
        id="accounts"
        className="py-24 px-4 sm:px-6 lg:px-8 relative z-10"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold glass-1 text-gray-700 dark:text-gray-300 mb-4 border border-white/80 dark:border-white/10 shadow-sm">
              <Sparkles size={14} className="text-violet-500" />
              <span>ACCOUNT TYPES</span>
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
              Built for{' '}
              <span style={{
                background: 'linear-gradient(135deg, #7c3aed, #0284c7, #ea580c)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                every life stage
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto text-base">
              Montra adapts to your financial situation — whether you're just starting out, scaling a career, or managing company payroll.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {accountTypes.map((acct, i) => (
              <motion.div
                key={acct.type}
                variants={fadeUp}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 border backdrop-blur-2xl ${
                  acct.featured
                    ? 'ring-2 ring-sky-500/50 shadow-2xl shadow-sky-500/10'
                    : 'shadow-xl hover:shadow-2xl'
                }`}
                style={{
                  backgroundColor: isDark ? `${acct.color}F2` : '#FFFFFF',
                  borderColor: acct.borderColor,
                }}
              >
                {acct.featured && (
                  <div
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white shadow-lg shadow-sky-500/30 flex items-center gap-1.5"
                    style={{ background: 'linear-gradient(135deg, #0284C7, #7C5CFC)' }}
                  >
                    <Sparkles size={12} />
                    <span>Most Popular</span>
                  </div>
                )}

                <div>
                  {/* Icon Header */}
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border shadow-inner"
                    style={{
                      background: `${acct.accent}18`,
                      borderColor: `${acct.accent}40`,
                    }}
                  >
                    <acct.icon size={28} style={{ color: acct.accent }} />
                  </div>

                  <div className="mb-2">
                    <span className="text-xs font-bold tracking-widest uppercase" style={{ color: acct.accent }}>
                      {acct.type.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1.5">
                    {acct.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                    {acct.tagline}
                  </p>

                  <ul className="flex flex-col gap-3.5 mb-8">
                    {acct.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                        <CheckCircle size={16} style={{ color: acct.accent, marginTop: 2, flexShrink: 0 }} />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Account Type Shiny Button */}
                <div className="pt-2 w-full flex justify-center">
                  <AccountTypeShinyButton
                    accountType={acct.type.toLowerCase().includes('student') ? 'student' : acct.type.toLowerCase().includes('employee') ? 'employee' : 'business'}
                    label={acct.buttonLabel}
                    onClick={() => navigate(`/register?type=${acct.type}`)}
                    className="w-full text-center text-sm sm:text-base font-bold shadow-xl"
                    fullWidth
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── SECURITY ─────────────────────────────────────────────── */}
      <Section id="security" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: text */}
            <div>
              <motion.div variants={fadeUp}>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold glass-1 text-gray-700 dark:text-gray-300 mb-4 border border-white/80 dark:border-white/10">
                  SECURITY
                </span>
                <h2 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
                  Your data, protected{' '}
                  <span style={{
                    background: 'linear-gradient(135deg, #7C5CFC, #10B981)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>
                    at every layer
                  </span>
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-10 text-base">
                  We use the same encryption standards as banks and leading fintech institutions.
                  Your financial data is never sold, never shared, and never compromised.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {securityFeatures.map((feat, i) => (
                  <motion.div
                    key={feat.title}
                    variants={fadeUp}
                    transition={{ delay: i * 0.08 }}
                    className="flex gap-4 p-4 rounded-2xl glass-1 border border-white/80 dark:border-white/10"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center flex-shrink-0 border border-emerald-500/25">
                      <feat.icon size={18} className="text-emerald-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">{feat.title}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{feat.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right: visual */}
            <motion.div variants={fadeUp} className="relative">
              <div className="glass-card glossy-panel rounded-3xl p-8 border border-white/90 dark:border-white/15 shadow-2xl relative overflow-hidden">
                <div className="flex items-center gap-3.5 mb-8">
                  <div className="w-12 h-12 rounded-2xl glass-1 bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                    <Shield size={24} className="text-emerald-500" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">Security Status</p>
                    <p className="text-xs text-emerald-500 font-semibold flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      All systems encrypted & operational
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { label: 'Data Encryption', status: '256-bit Active', color: '#10B981' },
                    { label: 'Two-Factor Auth', status: 'Enforced', color: '#10B981' },
                    { label: 'Session Monitoring', status: 'Live TLS 1.3', color: '#10B981' },
                    { label: 'Fraud Detection', status: 'Realtime Guard', color: '#10B981' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-3 px-4 rounded-xl glass-1 border border-white/60 dark:border-white/10">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                        ✓ {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────── */}
      <Section className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-12">
            <h2 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">
              Loved by thousands
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-base">Real users, real results.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                variants={fadeUp}
                transition={{ delay: i * 0.1 }}
                className="glass-card glossy-panel rounded-3xl p-6 border border-white/80 dark:border-white/10 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-6 font-medium">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md shadow-violet-500/20"
                    style={{ background: 'linear-gradient(135deg, #7C5CFC, #10B981)' }}
                  >
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{t.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <Section className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            variants={fadeUp}
            className="glass-3 glossy-panel rounded-3xl overflow-hidden p-10 sm:p-16 border border-white/95 dark:border-white/20 shadow-2xl relative"
          >
            <div aria-hidden className="absolute -top-16 -right-16 w-52 h-52 rounded-full blur-3xl opacity-30" style={{ background: '#7C5CFC' }} />
            <div aria-hidden className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full blur-3xl opacity-25" style={{ background: '#10B981' }} />

            <div className="relative z-10">
              <motion.h2 variants={fadeUp} className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
                Start your financial journey today
              </motion.h2>
              <motion.p variants={fadeUp} className="text-gray-600 dark:text-gray-300 mb-10 max-w-xl mx-auto text-base">
                Join 10,000+ users who are already making smarter money decisions with Montra.
                No credit card required.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <AnimatedButton
                  id="cta-primary-btn"
                  action="createFreeAccount"
                  to="/register"
                  size="lg"
                  hue={160}
                  rightIcon={<ArrowRight size={18} />}
                >
                  Create Free Account
                </AnimatedButton>
                <AnimatedButton
                  id="cta-secondary-btn"
                  action="alreadyAccount"
                  variant="secondary"
                  to="/login"
                  size="lg"
                  hue={260}
                >
                  Already have an account?
                </AnimatedButton>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </Section>

      <CinematicFooter />
    </KineticGrid>
  );
}
