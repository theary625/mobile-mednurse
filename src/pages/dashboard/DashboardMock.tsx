import { Link, useLocation } from 'react-router-dom';
import { 
  Home, Pill, AlertTriangle, Droplets, Calculator, FileText, Bell, 
  ChevronLeft, ChevronRight, Sun, Clock, LayoutGrid, Sparkles, Info,
  MoreHorizontal, RefreshCw, Mail, ClipboardList, FlaskConical
} from 'lucide-react';

// Brand Logo SVG
const BrandLogo = () => (
  <svg viewBox="0 0 64 64" className="h-8 w-8 text-white" fill="none">
    <path
      d="M12 22c6-8 18-12 28-6 10-6 22-2 28 6-4 18-22 30-28 34-6-4-24-16-28-34Z"
      fill="currentColor"
      opacity="0.95"
    />
    <path
      d="M18 34h8l3-6 4 12 3-6h10"
      stroke="#fff"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22 18h10a3 3 0 0 1 3 3v3H19v-3a3 3 0 0 1 3-3Z"
      fill="#fff"
      opacity="0.9"
    />
    <path d="M28 18v9" stroke="#d73a36" strokeWidth="3" strokeLinecap="round" />
    <path d="M23.5 22.5h9" stroke="#d73a36" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

// Avatar SVG
const AvatarSVG = ({ id = "bg" }: { id?: string }) => (
  <svg viewBox="0 0 100 100" className="h-full w-full">
    <defs>
      <linearGradient id={id} x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stopColor="#ffe7d6" />
        <stop offset="1" stopColor="#ffd1c7" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="50" fill={`url(#${id})`} />
    <circle cx="50" cy="48" r="22" fill="#f2c7a5" />
    <path d="M28 82c6-14 38-14 44 0" fill="#e9bda0" />
    <path
      d="M32 44c4-10 16-16 30-8 6 3 8 6 8 12-8-6-18-7-28-3-5 2-8 1-10-1Z"
      fill="#2b2b2b"
    />
    <path d="M28 26h44v12c0 3-2 5-5 5H33c-3 0-5-2-5-5V26Z" fill="#fff" />
    <path d="M50 26v17" stroke="#e53935" strokeWidth="4" strokeLinecap="round" />
    <path d="M42 34h16" stroke="#e53935" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

const navItems = [
  { title: 'Home', path: '/dashboard', icon: Home, active: true },
  { title: 'Medications', path: '/dashboard/medications', icon: Pill },
  { title: 'Interactions', path: '/dashboard/interactions', icon: AlertTriangle },
  { title: 'IV Reference', path: '/dashboard/iv-reference', icon: Droplets },
  { title: 'Calculate', path: '/dashboard/calculate', icon: Calculator },
  { title: 'Protocols', path: '/dashboard/protocols', icon: FileText },
  { title: 'Alerts', path: '/dashboard/alerts', icon: Bell },
];

const DashboardMock = () => {
  const location = useLocation();
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className="min-h-screen bg-[#f3f2f1]">
      <div className="mx-auto flex max-w-[1400px] gap-5 p-6">
        {/* SIDEBAR */}
        <aside className="w-[310px] shrink-0 overflow-hidden rounded-[22px] border border-black/5 bg-white shadow-[0_18px_45px_rgba(18,18,18,0.10)]">
          {/* Brand header */}
          <div className="h-[110px] bg-gradient-to-br from-[#0e1e3a] via-[#1b2e54] to-[#243b6a] px-6 pt-6">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-[16px] bg-white/10 ring-1 ring-white/15">
                <BrandLogo />
              </div>
              <div className="text-[28px] font-extrabold tracking-[0.06em] text-white">
                MEDNURSE
              </div>
            </div>
          </div>

          {/* Profile */}
          <div className="px-6 pt-5">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 overflow-hidden rounded-full ring-2 ring-black/5">
                <AvatarSVG id="avatar1" />
              </div>
              <div className="leading-tight">
                <div className="text-[16px] font-semibold text-[#1c1c1c]">Registered Nurse</div>
                <div className="mt-1 text-[13px] text-black/55">Clinical Member</div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3 rounded-full bg-[#f1f1f2] px-4 py-3">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-black/55" fill="none">
                <path
                  d="M12 3 20 7v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V7l8-4Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="text-[14px] font-medium text-black/75">Registered Nurse</div>
            </div>
          </div>

          {/* Nav */}
          <nav className="mt-6 px-4">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.title}
                  to={item.path}
                  className={`mb-2 flex items-center gap-4 rounded-[16px] px-5 py-4 text-[16px] font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#d73a36] to-[#ea4d46] text-white shadow-[0_14px_30px_rgba(215,58,54,0.35)]'
                      : 'text-black/55 hover:bg-black/5'
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${isActive ? '' : 'text-black/45'}`} />
                  {item.title}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 px-6 pb-6">
            <Link to="/" className="flex items-center gap-3 text-[13px] text-black/45 hover:text-black/65">
              <ChevronLeft className="h-4 w-4" />
              Back to Site
            </Link>
          </div>
        </aside>

        {/* MAIN */}
        <main className="min-w-0 flex-1 space-y-5">
          {/* TOP BAR */}
          <header className="flex items-center justify-between rounded-[22px] border border-black/5 bg-white/70 px-6 py-4 shadow-[0_18px_45px_rgba(18,18,18,0.08)] backdrop-blur">
            <div className="flex items-center gap-4">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/15">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
              </span>
              <div className="flex items-center gap-3">
                <div className="text-[18px] font-semibold text-black/80">MedNurse Platform</div>
                <span className="rounded-full bg-black/5 px-4 py-2 text-[13px] font-medium text-black/65">
                  Role-Based View
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Sun className="h-5 w-5 text-black/55" />
              <div className="relative">
                <Bell className="h-5 w-5 text-black/55" />
                <span className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-[#e53935] text-[11px] font-semibold text-white">
                  2
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-black/5">
                  <AvatarSVG id="avatar2" />
                </div>
                <ChevronRight className="h-5 w-5 rotate-90 text-black/45" />
              </div>
            </div>
          </header>

          {/* GRID */}
          <div className="grid grid-cols-12 gap-5">
            {/* LEFT COLUMN */}
            <section className="col-span-12 space-y-5 xl:col-span-8">
              {/* Welcome */}
              <div className="rounded-[22px] border border-black/5 bg-white/60 px-7 py-6 shadow-[0_18px_45px_rgba(18,18,18,0.08)] backdrop-blur">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="inline-flex items-center gap-2 rounded-full bg-black/5 px-4 py-2 text-[13px] font-medium text-black/70">
                      <LayoutGrid className="h-4 w-4 text-black/55" />
                      Safety Dashboard
                    </span>
                    <h1 className="mt-4 font-serif text-[44px] font-semibold leading-[1.02] text-black/85">
                      Welcome back, Theary
                    </h1>
                    <p className="mt-3 text-[18px] text-black/45">
                      Trusted bedside support for safe, efficient patient care
                    </p>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-black/5 px-4 py-3 text-[14px] font-medium text-black/70">
                    <Clock className="h-5 w-5 text-black/55" />
                    {currentDate}
                    <ChevronRight className="h-4 w-4 text-black/45" />
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div className="rounded-[22px] border border-black/5 bg-white px-6 py-5 shadow-[0_18px_45px_rgba(18,18,18,0.10)]">
                <div className="flex items-start gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-[#ffb74d]/20 ring-1 ring-[#ffb74d]/35">
                    <AlertTriangle className="h-6 w-6 text-[#f39c12]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[20px] font-semibold text-black/80">Warning Alert</div>
                    <div className="mt-1 text-[15px] leading-6 text-black/50">
                      Heparin protocol update: New weight-based dosing guidelines effective today
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <button className="group relative flex h-12 items-center justify-between gap-3 rounded-full bg-gradient-to-b from-[#355a86] to-[#244a75] px-6 text-[15px] font-semibold text-white shadow-[0_10px_22px_rgba(36,74,117,0.35)] ring-1 ring-white/15">
                        View Updated Protocol
                        <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10 ring-1 ring-white/15 transition group-hover:bg-white/15">
                          <ChevronRight className="h-4 w-4" />
                        </span>
                      </button>
                      <button className="flex h-12 items-center justify-between gap-3 rounded-full bg-[#f1f1f2] px-6 text-[15px] font-semibold text-black/70 shadow-[0_10px_22px_rgba(0,0,0,0.08)] ring-1 ring-black/5">
                        Recalculate Dose
                        <span className="grid h-9 w-9 place-items-center rounded-full bg-white ring-1 ring-black/5">
                          <ChevronRight className="h-4 w-4 text-black/45" />
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Toolkit */}
              <div className="rounded-[22px] border border-black/5 bg-white px-6 py-5 shadow-[0_18px_45px_rgba(18,18,18,0.10)]">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-black/5">
                      <Sparkles className="h-5 w-5 text-black/55" />
                    </div>
                    <div>
                      <div className="text-[18px] font-semibold text-black/80">Your Toolkit</div>
                      <div className="mt-1 text-[14px] text-black/50">
                        Up-to-date protocols, calculator used 15 mins ago
                      </div>
                    </div>
                  </div>
                  <button className="flex h-10 items-center gap-2 rounded-full bg-black/5 px-4 text-[13px] font-semibold text-black/65">
                    View All
                    <ChevronRight className="h-4 w-4 text-black/45" />
                  </button>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-[18px] bg-[#f2f3f5] p-4 ring-1 ring-black/5 shadow-[0_10px_24px_rgba(0,0,0,0.07)]">
                    <div className="flex items-start gap-3">
                      <div className="grid h-11 w-11 place-items-center rounded-[14px] bg-[#e9edf5] ring-1 ring-black/5">
                        <ClipboardList className="h-6 w-6 text-[#2b3b57]" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[16px] font-semibold leading-5 text-black/75">
                          Med <span className="font-semibold">Administration</span>
                        </div>
                        <div className="mt-2 text-[13px] text-black/45">Quick med admin checklist</div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-[18px] bg-[#f2f3f5] p-4 ring-1 ring-black/5 shadow-[0_10px_24px_rgba(0,0,0,0.07)]">
                    <div className="flex items-start gap-3">
                      <div className="grid h-11 w-11 place-items-center rounded-[14px] bg-[#e7effc] ring-1 ring-black/5">
                        <FlaskConical className="h-6 w-6 text-[#1f4f95]" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[16px] font-semibold leading-5 text-black/75">
                          IV Drip <span className="font-semibold">Rate</span>
                        </div>
                        <div className="mt-2 text-[13px] text-black/45">Calculate IV drip rates</div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-[18px] bg-[#f2f3f5] p-4 ring-1 ring-black/5 shadow-[0_10px_24px_rgba(0,0,0,0.07)]">
                    <div className="flex items-start gap-3">
                      <div className="grid h-11 w-11 place-items-center rounded-[14px] bg-[#fff1db] ring-1 ring-black/5">
                        <RefreshCw className="h-6 w-6 text-[#c07a00]" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[16px] font-semibold leading-5 text-black/75">
                          Weight- <span className="font-semibold">Based Dosing</span>
                        </div>
                        <div className="mt-2 text-[13px] text-black/45">Weight-based medication</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Safety overview */}
              <div className="rounded-[22px] border border-black/5 bg-white px-6 py-5 shadow-[0_18px_45px_rgba(18,18,18,0.10)]">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-black/5">
                      <Info className="h-5 w-5 text-black/55" />
                    </div>
                    <div>
                      <div className="text-[18px] font-semibold text-black/80">Safety Overview</div>
                      <div className="mt-1 text-[14px] text-black/50">6 Medication Checks Completed Today</div>
                    </div>
                  </div>
                  <button className="grid h-10 w-10 place-items-center rounded-full bg-black/5 text-black/55">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </div>
                <div className="mt-5 rounded-[18px] bg-[#f2f3f5] p-5 ring-1 ring-black/5">
                  <div className="flex items-start gap-4">
                    <div className="grid h-12 w-12 place-items-center rounded-[16px] bg-[#e6e8ec] ring-1 ring-black/5">
                      <ClipboardList className="h-6 w-6 text-black/65" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[16px] font-semibold text-black/75">
                        5 Medication Checks <span className="font-medium italic">Completed</span>
                        <span className="ml-2 inline-flex items-center gap-2">
                          <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-500/15">
                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-600"></span>
                          </span>
                          <span className="font-medium text-black/60">no unresolved alerts.</span>
                        </span>
                      </div>
                      <div className="mt-2 text-[14px] text-black/45">
                        You are using the latest protocols, no unresolved alerts
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* RIGHT COLUMN */}
            <aside className="col-span-12 space-y-5 xl:col-span-4">
              {/* Latest alerts */}
              <div className="rounded-[22px] border border-black/5 bg-white px-6 py-5 shadow-[0_18px_45px_rgba(18,18,18,0.10)]">
                <div className="flex items-center justify-between">
                  <div className="text-[18px] font-semibold text-black/75">Latest Alerts</div>
                  <ChevronRight className="h-5 w-5 text-black/35" />
                </div>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="grid h-11 w-11 place-items-center rounded-full bg-[#ffb74d]/20 ring-1 ring-[#ffb74d]/35">
                      <AlertTriangle className="h-5 w-5 text-[#f39c12]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[15px] font-semibold text-black/70">Heparin dosing update</div>
                      <div className="mt-1 text-[13px] text-black/40">2 hrs ago</div>
                    </div>
                  </div>
                  <div className="h-px bg-black/5"></div>
                  <div className="flex items-center gap-4">
                    <div className="grid h-11 w-11 place-items-center rounded-full bg-[#e53935]/10 ring-1 ring-[#e53935]/20">
                      <Bell className="h-5 w-5 text-[#e53935]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[15px] font-semibold text-black/70">Verify IV site</div>
                      <div className="mt-1 text-[13px] text-black/40">4 hrs ago</div>
                    </div>
                  </div>
                </div>
                <button className="mt-5 w-full rounded-full bg-black/5 py-3 text-[14px] font-semibold text-black/60 ring-1 ring-black/5">
                  View All
                </button>
              </div>

              {/* Latest alerts compact */}
              <div className="rounded-[22px] border border-black/5 bg-white px-6 py-5 shadow-[0_18px_45px_rgba(18,18,18,0.10)]">
                <div className="flex items-center justify-between">
                  <div className="text-[18px] font-semibold text-black/75">Latest Alerts</div>
                  <ChevronRight className="h-5 w-5 text-black/35" />
                </div>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-4">
                      <div className="grid h-11 w-11 place-items-center rounded-full bg-[#eef1f6] ring-1 ring-black/5">
                        <RefreshCw className="h-5 w-5 text-[#355a86]" />
                      </div>
                      <div>
                        <div className="text-[15px] font-semibold text-black/70">Heparin dosing</div>
                        <div className="mt-1 text-[13px] text-black/40">2 hrs ago</div>
                      </div>
                    </div>
                    <div className="text-[13px] font-semibold text-black/40">2 hrs</div>
                  </div>
                  <div className="h-px bg-black/5"></div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-4">
                      <div className="grid h-11 w-11 place-items-center rounded-full bg-[#eef1f6] ring-1 ring-black/5">
                        <Mail className="h-5 w-5 text-[#355a86]" />
                      </div>
                      <div>
                        <div className="text-[15px] font-semibold text-black/70">Verify IV site</div>
                        <div className="mt-1 text-[13px] text-black/40">4 hrs ago</div>
                      </div>
                    </div>
                    <div className="text-[13px] font-semibold text-black/40">4 hrs</div>
                  </div>
                </div>
              </div>

              {/* Alerts shortcut */}
              <div className="rounded-[22px] border border-black/5 bg-white px-6 py-5 shadow-[0_18px_45px_rgba(18,18,18,0.10)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-black/5">
                      <Bell className="h-5 w-5 text-black/55" />
                    </div>
                    <div className="text-[18px] font-semibold text-black/75">Alerts</div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-black/35" />
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardMock;
