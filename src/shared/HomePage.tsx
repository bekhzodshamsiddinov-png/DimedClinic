import { useEffect, useState } from "react";
import {
  Activity, ArrowRight, CalendarCheck, Check, ChevronDown, Clock, FlaskConical, HeartPulse, Menu,
  MessageCircle, Microscope, Phone, PhoneCall, ShieldCheck, Sparkles, Stethoscope, Timer, Waves, Wind, X,
  Zap, Hand, BadgeCheck, Building2, Send, Instagram, Facebook, CheckCircle2, ScanLine, UserRound,
} from "lucide-react";
import { CLINIC, DICT, SERVICE_IDS, type Lang, type ServiceId } from "./content";
import { ChatWidget } from "./ChatWidget";
import { API_BASE, img } from "./config";

const SERVICE_ICONS: Record<ServiceId, typeof Activity> = {
  uzi: ScanLine, lab: FlaskConical, physio: Zap, consult: Stethoscope, massage: Hand, inhalation: Wind,
};
const TRUST_ICONS = [Microscope, BadgeCheck, Timer, ShieldCheck];
const PHYSIO_ICONS = [Zap, Activity, Wind, Waves, Hand];

export default function HomePage({ initialLang = "uz" as Lang }: { initialLang?: Lang }) {
  const [lang, setLang] = useState<Lang>(initialLang);
  const [chatOpen, setChatOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [service, setService] = useState<string>("");
  const t = DICT[lang];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const go = (id: string) => {
    setMenu(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const book = (s?: ServiceId) => {
    if (s) setService(s);
    go("booking");
  };

  const nav: [string, string][] = [
    ["services", t.nav.services], ["lab", t.nav.lab], ["physio", t.nav.physio], ["about", t.nav.about], ["contact", t.nav.contact],
  ];

  return (
    <div className="min-h-full overflow-x-clip bg-white font-body text-[#111] antialiased selection:bg-[#E30613] selection:text-white">
      {/* ============ HEADER ============ */}
      <header className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? "bg-white/90 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.15)] backdrop-blur-xl" : "bg-white"}`}>
        <div className="hidden md:block bg-[#111] text-white/80 text-xs">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-[#FF3B47]" />{t.hoursVal}</span>
              <span className="flex items-center gap-2"><Sparkles className="h-3.5 w-3.5 text-[#FF3B47]" />{t.hero.badge}</span>
            </div>
            <div className="flex items-center gap-5">
              {CLINIC.phones.map((p) => (
                <a key={p.href} href={p.href} className="hover:text-white transition">{p.label}</a>
              ))}
            </div>
          </div>
        </div>
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 sm:px-6 py-3">
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="shrink-0" aria-label="DiMed Clinic">
            <img src={img("logo.webp")} alt="DiMed Clinic" className="h-9 sm:h-10 w-auto" />
          </button>
          <nav className="hidden lg:flex flex-1 items-center justify-center gap-1">
            {nav.map(([id, label]) => (
              <button key={id} onClick={() => go(id)} className="relative rounded-full px-4 py-2 text-[14px] font-medium text-neutral-700 transition hover:bg-neutral-100 hover:text-[#111]">
                {label}
              </button>
            ))}
          </nav>
          <div className="ml-auto lg:ml-0 flex items-center gap-2 sm:gap-3">
            <LangSwitch lang={lang} setLang={setLang} />
            <a href={CLINIC.phones[0].href} className="hidden xl:flex items-center gap-2 text-sm font-semibold">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[#E30613]/10 text-[#E30613]"><Phone className="h-4 w-4" /></span>
              {CLINIC.phones[0].label}
            </a>
            <button onClick={() => book()} className="hidden sm:inline-flex btn-red h-11 px-5 text-sm">
              <CalendarCheck className="h-4 w-4" /> {t.cta}
            </button>
            <button onClick={() => setMenu(!menu)} className="lg:hidden grid h-11 w-11 place-items-center rounded-xl bg-neutral-100" aria-label="Menu">
              {menu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {menu && (
          <div className="lg:hidden border-t border-neutral-100 bg-white px-4 pb-5 pt-2">
            {nav.map(([id, label]) => (
              <button key={id} onClick={() => go(id)} className="flex w-full items-center justify-between border-b border-neutral-100 py-3.5 text-left font-medium">
                {label} <ArrowRight className="h-4 w-4 text-[#E30613]" />
              </button>
            ))}
            <button onClick={() => book()} className="btn-red mt-4 h-12 w-full">
              <CalendarCheck className="h-4 w-4" /> {t.cta}
            </button>
          </div>
        )}
      </header>

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden bg-[#EFEFF0]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-[10%] -top-24 h-56 w-[130%] -rotate-[8deg] bg-gradient-to-r from-[#E30613] via-[#C00410] to-[#7A0008] opacity-95" />
          <div className="absolute -left-[10%] top-24 h-10 w-[130%] -rotate-[8deg] bg-gradient-to-r from-[#7A0008]/70 to-transparent" />
          <div className="absolute -right-[20%] -bottom-32 h-48 w-[90%] -rotate-[8deg] bg-gradient-to-l from-[#E30613] to-[#7A0008]" />
          <div className="absolute inset-x-6 sm:inset-x-10 top-10 bottom-10 border border-[#111]/80 hidden md:block" />
        </div>
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 pb-24 pt-28 sm:pt-36 lg:grid-cols-[1.05fr_1fr] lg:pb-32">
          <div className="reveal">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#B5040F] shadow-sm ring-1 ring-black/5">
              <HeartPulse className="h-4 w-4" /> {t.hero.badge}
            </span>
            <h1 className="font-display mt-6 text-[40px] leading-[1.05] font-bold tracking-tight sm:text-6xl lg:text-[68px]">
              {t.hero.title1}
              <br />
              <span className="text-gradient-red">{t.hero.title2}</span>
            </h1>
            <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-neutral-600">{t.hero.text}</p>
            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              <button onClick={() => book()} className="btn-red h-14 px-8 text-base">
                <CalendarCheck className="h-5 w-5" /> {t.cta}
              </button>
              <button onClick={() => setChatOpen(true)} className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl border-2 border-[#111] bg-white/70 px-7 font-semibold transition hover:bg-[#111] hover:text-white">
                <MessageCircle className="h-5 w-5" /> {t.askAi}
              </button>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-neutral-600">
              {CLINIC.phones.map((p) => (
                <a key={p.href} href={p.href} className="flex items-center gap-2 font-semibold text-[#111] hover:text-[#E30613] transition">
                  <PhoneCall className="h-4 w-4 text-[#E30613]" /> {p.label}
                </a>
              ))}
            </div>
          </div>

          <div className="relative reveal" style={{ animationDelay: ".15s" }}>
            <div className="relative overflow-hidden rounded-[32px] shadow-[0_40px_80px_-20px_rgba(17,17,17,0.45)] ring-8 ring-white">
              <img src={img("room.webp")} alt="DiMed Clinic" className="aspect-[4/3.4] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
            <div className="float-card absolute -left-4 sm:-left-10 top-8 flex items-center gap-3 rounded-2xl bg-white p-3.5 pr-5 shadow-xl">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#E30613] text-white"><ScanLine className="h-5 w-5" /></span>
              <span className="text-sm font-semibold leading-tight max-w-[150px]">{t.hero.stat1}</span>
            </div>
            <div className="float-card absolute -right-2 sm:-right-8 top-1/2 rounded-2xl bg-[#111] p-4 text-white shadow-xl" style={{ animationDelay: "1s" }}>
              <p className="font-display text-3xl font-bold text-[#FF3B47]">40+</p>
              <p className="text-xs text-white/70 max-w-[130px]">{t.hero.stat2}</p>
            </div>
            <div className="float-card absolute -bottom-6 left-6 sm:left-14 flex items-center gap-3 rounded-2xl bg-white p-3.5 pr-5 shadow-xl" style={{ animationDelay: "2s" }}>
              <div className="flex -space-x-2">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="grid h-9 w-9 place-items-center rounded-full bg-neutral-100 ring-2 ring-white"><UserRound className="h-4 w-4 text-neutral-500" /></span>
                ))}
              </div>
              <span className="text-sm font-semibold leading-tight max-w-[150px]">{t.hero.stat3}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ TRUST ============ */}
      <section className="relative z-10 -mt-12 px-4 sm:px-6">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px overflow-hidden rounded-3xl bg-neutral-200 shadow-[0_30px_60px_-30px_rgba(17,17,17,0.35)] lg:grid-cols-4">
          {t.trust.map((x, i) => {
            const Icon = TRUST_ICONS[i];
            return (
              <div key={x.t} className="group bg-white p-5 sm:p-7 transition hover:bg-[#111]">
                <Icon className="h-7 w-7 text-[#E30613]" />
                <p className="mt-4 font-semibold group-hover:text-white transition">{x.t}</p>
                <p className="mt-1 text-sm text-neutral-500 group-hover:text-white/60 transition">{x.d}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============ SERVICES ============ */}
      <section id="services" className="scroll-mt-24 px-4 sm:px-6 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <SectionHead kicker={t.nav.services} title={t.servicesTitle} text={t.servicesText} />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICE_IDS.map((id, i) => {
              const Icon = SERVICE_ICONS[id];
              const s = t.services[id];
              return (
                <article key={id} className="group relative overflow-hidden rounded-3xl border border-neutral-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-[0_30px_60px_-20px_rgba(227,6,19,0.35)]">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#E30613] to-[#7A0008] opacity-0 transition duration-300 group-hover:opacity-100" />
                  <div className="absolute -right-16 -top-16 h-40 w-40 rotate-12 bg-white/0 transition group-hover:bg-white/10" />
                  <div className="relative">
                    <div className="flex items-start justify-between">
                      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#E30613]/10 text-[#E30613] transition group-hover:bg-white/15 group-hover:text-white">
                        <Icon className="h-7 w-7" />
                      </span>
                      <span className="font-display text-sm font-bold text-neutral-300 transition group-hover:text-white/40">0{i + 1}</span>
                    </div>
                    <h3 className="font-display mt-6 text-xl font-semibold transition group-hover:text-white">{s.t}</h3>
                    <p className="mt-2.5 text-[15px] leading-relaxed text-neutral-600 transition group-hover:text-white/80">{s.d}</p>
                    <button onClick={() => book(id)} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#E30613] transition group-hover:text-white">
                      {t.cta} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ LAB ============ */}
      <section id="lab" className="scroll-mt-24 bg-[#F4F4F5] px-4 sm:px-6 py-24 lg:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          <div className="relative">
            <div className="absolute -left-4 -top-4 h-full w-full rounded-[36px] border-2 border-[#111]" />
            <div className="relative overflow-hidden rounded-[32px] bg-white shadow-2xl">
              <img src={img("lab.webp")} alt={t.labTitle} className="aspect-square w-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -right-2 sm:-right-6 rounded-3xl bg-gradient-to-br from-[#E30613] to-[#7A0008] p-6 text-white shadow-2xl">
              <FlaskConical className="h-8 w-8" />
              <p className="font-display mt-3 text-4xl font-bold">40+</p>
              <p className="text-sm text-white/80">{t.hero.stat2}</p>
            </div>
          </div>
          <div>
            <Kicker>{t.nav.lab}</Kicker>
            <h2 className="font-display mt-4 text-3xl sm:text-4xl font-bold leading-tight">{t.labTitle}</h2>
            <p className="mt-4 text-neutral-600">{t.labText}</p>
            <ul className="mt-8 grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {t.labList.map((x) => (
                <li key={x} className="flex gap-3 rounded-2xl bg-white p-3.5 text-sm leading-snug shadow-sm ring-1 ring-black/[0.03]">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#E30613] text-white"><Check className="h-3 w-3" strokeWidth={3} /></span>
                  {x}
                </li>
              ))}
            </ul>
            <button onClick={() => book("lab")} className="btn-red mt-9 h-13 px-7">
              {t.cta} <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ============ PHYSIO ============ */}
      <section id="physio" className="scroll-mt-24 px-4 sm:px-6 py-24 lg:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1fr_1fr]">
          <div className="order-2 lg:order-1">
            <Kicker>{t.nav.physio}</Kicker>
            <h2 className="font-display mt-4 text-3xl sm:text-4xl font-bold leading-tight">{t.physioTitle}</h2>
            <p className="mt-4 text-neutral-600">{t.physioText}</p>
            <div className="mt-8 space-y-3">
              {t.physioList.map((x, i) => {
                const Icon = PHYSIO_ICONS[i];
                return (
                  <div key={x.t} className="group flex items-center gap-4 rounded-2xl border border-neutral-200 p-4 transition hover:border-[#E30613]/40 hover:bg-[#E30613]/[0.03]">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#111] text-white transition group-hover:bg-[#E30613]"><Icon className="h-5 w-5" /></span>
                    <div>
                      <p className="font-semibold">{x.t}</p>
                      <p className="text-sm text-neutral-500">{x.d}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-6 flex gap-2 text-sm text-neutral-500"><BadgeCheck className="h-5 w-5 shrink-0 text-[#E30613]" />{t.physioNote}</p>
          </div>
          <div className="order-1 lg:order-2 relative">
            <div className="relative mx-auto aspect-square max-w-[460px]">
              <div className="absolute inset-0 rotate-6 rounded-[40px] bg-gradient-to-br from-[#E30613] to-[#7A0008]" />
              <div className="absolute inset-0 overflow-hidden rounded-[40px] bg-white shadow-2xl ring-8 ring-white">
                <img src={img("physio.webp")} alt={t.physioTitle} className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ ABOUT ============ */}
      <section id="about" className="scroll-mt-24 relative overflow-hidden bg-[#111] px-4 sm:px-6 py-24 lg:py-32 text-white">
        <div className="pointer-events-none absolute -right-40 top-0 h-full w-[60%] -skew-x-12 bg-gradient-to-b from-[#E30613]/25 to-transparent" />
        <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <Kicker dark>{t.nav.about}</Kicker>
            <h2 className="font-display mt-4 text-3xl sm:text-4xl font-bold leading-tight">{t.aboutTitle}</h2>
            <p className="mt-5 text-white/70 leading-relaxed">{t.aboutText}</p>
            <ul className="mt-8 space-y-3">
              {t.aboutPoints.map((p) => (
                <li key={p} className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-[#FF3B47]" />{p}</li>
              ))}
            </ul>
            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
              {t.counters.map((c) => (
                <div key={c.t}>
                  <p className="font-display text-3xl sm:text-4xl font-bold text-[#FF3B47]">{c.n}</p>
                  <p className="mt-1 text-sm text-white/60">{c.t}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-white/40">{t.counterNote}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src={img("room.webp")} alt="" className="col-span-2 aspect-[16/9] w-full rounded-3xl object-cover" />
            <img src={img("uzi.webp")} alt="UZI" className="aspect-square w-full rounded-3xl object-cover" />
            <div className="flex flex-col justify-between rounded-3xl bg-white p-6 text-[#111]">
              <Building2 className="h-8 w-8 text-[#E30613]" />
              <div>
                <img src={img("logo.webp")} alt="DiMed" className="h-8 w-auto" />
                <p className="mt-3 text-sm text-neutral-600">{t.footerText}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ STEPS ============ */}
      <section className="px-4 sm:px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHead kicker={t.form.title} title={t.stepsTitle} />
          <div className="relative mt-14 grid gap-6 md:grid-cols-3">
            <div className="absolute left-[16%] right-[16%] top-10 hidden h-px border-t-2 border-dashed border-[#E30613]/30 md:block" />
            {t.steps.map((s, i) => (
              <div key={s.t} className="relative text-center">
                <span className="font-display relative mx-auto grid h-20 w-20 place-items-center rounded-full bg-white text-2xl font-bold text-[#E30613] shadow-[0_15px_40px_-10px_rgba(227,6,19,0.4)] ring-1 ring-[#E30613]/15">
                  0{i + 1}
                </span>
                <h3 className="font-display mt-6 text-lg font-semibold">{s.t}</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm text-neutral-600">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ BOOKING ============ */}
      <section id="booking" className="scroll-mt-24 px-4 sm:px-6 pb-24">
        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[36px] bg-white shadow-[0_40px_100px_-30px_rgba(17,17,17,0.35)] ring-1 ring-black/5 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="relative overflow-hidden bg-gradient-to-br from-[#E30613] via-[#B5040F] to-[#6A0007] p-8 sm:p-10 text-white">
            <div className="absolute -right-24 -top-10 h-48 w-[140%] -rotate-12 bg-white/[0.07]" />
            <div className="absolute -left-10 bottom-10 h-24 w-[140%] -rotate-12 bg-black/10" />
            <div className="relative flex h-full flex-col">
              <CalendarCheck className="h-10 w-10" />
              <h2 className="font-display mt-6 text-3xl font-bold leading-tight">{t.form.title}</h2>
              <p className="mt-3 text-white/80">{t.form.text}</p>
              <div className="mt-10 lg:mt-auto space-y-3 pt-6">
                <p className="text-sm font-medium uppercase tracking-wider text-white/60">{t.form.side}</p>
                {CLINIC.phones.map((p) => (
                  <a key={p.href} href={p.href} className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3.5 ring-1 ring-white/15 transition hover:bg-white/20">
                    <Phone className="h-5 w-5" /> <span className="font-display text-lg font-semibold">{p.label}</span>
                  </a>
                ))}
                <button onClick={() => setChatOpen(true)} className="flex w-full items-center gap-3 rounded-2xl bg-[#111]/40 px-4 py-3.5 text-left ring-1 ring-white/10 transition hover:bg-[#111]/60">
                  <MessageCircle className="h-5 w-5" /> {t.askAi}
                </button>
              </div>
            </div>
          </div>
          <BookingForm lang={lang} service={service} setService={setService} />
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="bg-[#F4F4F5] px-4 sm:px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <SectionHead kicker="FAQ" title={t.faqTitle} />
          <div className="mt-12 space-y-3">
            {t.faq.map((f, i) => (
              <Faq key={f.q} q={f.q} a={f.a} defaultOpen={i === 0} />
            ))}
          </div>
          <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-3xl bg-white p-6 sm:flex-row shadow-sm">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#E30613] text-white"><Sparkles className="h-6 w-6" /></span>
              <p className="font-semibold">{lang === "uz" ? "Javob topmadingizmi? AI operatorga yozing." : "Не нашли ответ? Напишите AI-оператору."}</p>
            </div>
            <button onClick={() => setChatOpen(true)} className="btn-dark h-12 px-6">{t.askAi}</button>
          </div>
        </div>
      </section>

      {/* ============ CONTACT ============ */}
      <section id="contact" className="scroll-mt-24 px-4 sm:px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHead kicker={t.nav.contact} title={t.contactTitle} />
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            <ContactCard icon={Phone} title={t.phonesLabel}>
              {CLINIC.phones.map((p) => (
                <a key={p.href} href={p.href} className="block font-display text-xl font-semibold hover:text-[#E30613] transition">{p.label}</a>
              ))}
            </ContactCard>
            <ContactCard icon={Clock} title={t.hours}>
              <p className="font-semibold">{t.hoursVal}</p>
              <p className="text-neutral-500">{t.hoursOff}</p>
            </ContactCard>
            <ContactCard icon={MessageCircle} title={t.socialLabel}>
              <div className="flex gap-3">
                <Social href={CLINIC.socials.instagram} label="Instagram"><Instagram className="h-5 w-5" /></Social>
                <Social href={CLINIC.socials.telegram} label="Telegram"><Send className="h-5 w-5" /></Social>
                <Social href={CLINIC.socials.facebook} label="Facebook"><Facebook className="h-5 w-5" /></Social>
              </div>
            </ContactCard>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="relative bg-[#0B0B0C] px-4 sm:px-6 pt-16 pb-28 text-white/70">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#7A0008] via-[#E30613] to-[#7A0008]" />
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <img src={img("logo-white.webp")} alt="DiMed Clinic" className="h-10 w-auto" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed">{t.footerText}</p>
          </div>
          <div>
            <p className="font-display text-sm font-semibold text-white">{t.nav.services}</p>
            <ul className="mt-4 space-y-2 text-sm">
              {SERVICE_IDS.map((id) => (
                <li key={id}><button onClick={() => book(id)} className="hover:text-white transition">{t.services[id].t}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-display text-sm font-semibold text-white">{t.nav.contact}</p>
            <ul className="mt-4 space-y-2 text-sm">
              {CLINIC.phones.map((p) => (
                <li key={p.href}><a href={p.href} className="hover:text-white transition">{p.label}</a></li>
              ))}
              <li>{t.hoursVal}</li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-12 flex max-w-7xl flex-col gap-2 border-t border-white/10 pt-6 text-xs sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} DiMed Clinic. {t.rights}</p>
          <p className="text-white/40">salomatlikning yangi sifati</p>
        </div>
      </footer>

      {/* Mobile sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-neutral-200 bg-white/95 p-3 pr-24 backdrop-blur sm:hidden">
        <a href={CLINIC.phones[0].href} className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#111] text-white" aria-label="Call"><Phone className="h-5 w-5" /></a>
        <button onClick={() => book()} className="btn-red h-12 flex-1 text-sm">{t.cta}</button>
      </div>

      <ChatWidget lang={lang} open={chatOpen} setOpen={setChatOpen} />
    </div>
  );
}

/* ---------------- pieces ---------------- */

function LangSwitch({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div className="flex rounded-full bg-neutral-100 p-1 text-xs font-bold">
      {(["uz", "ru"] as Lang[]).map((l) => (
        <button key={l} onClick={() => setLang(l)} className={`rounded-full px-3 py-1.5 uppercase transition ${lang === l ? "bg-[#111] text-white shadow" : "text-neutral-500 hover:text-[#111]"}`}>
          {l}
        </button>
      ))}
    </div>
  );
}

function Kicker({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] ${dark ? "text-[#FF3B47]" : "text-[#E30613]"}`}>
      <span className="h-px w-8 bg-current" /> {children}
    </span>
  );
}

function SectionHead({ kicker, title, text }: { kicker: string; title: string; text?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <Kicker>{kicker}</Kicker>
      <h2 className="font-display mt-4 text-3xl sm:text-[42px] font-bold leading-tight">{title}</h2>
      {text && <p className="mt-4 text-neutral-600">{text}</p>}
    </div>
  );
}

function Faq({ q, a, defaultOpen }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className={`rounded-2xl bg-white transition ${open ? "shadow-lg ring-1 ring-[#E30613]/15" : "shadow-sm"}`}>
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-semibold">
        {q}
        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition ${open ? "rotate-180 bg-[#E30613] text-white" : "bg-neutral-100"}`}>
          <ChevronDown className="h-4 w-4" />
        </span>
      </button>
      <div className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <p className="px-6 pb-6 text-[15px] leading-relaxed text-neutral-600">{a}</p>
        </div>
      </div>
    </div>
  );
}

function ContactCard({ icon: Icon, title, children }: { icon: typeof Phone; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-neutral-200 p-7 transition hover:shadow-xl">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#E30613]/10 text-[#E30613]"><Icon className="h-6 w-6" /></span>
      <p className="mt-5 text-sm font-medium uppercase tracking-wider text-neutral-400">{title}</p>
      <div className="mt-2 space-y-1">{children}</div>
    </div>
  );
}

function Social({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" aria-label={label} className="grid h-12 w-12 place-items-center rounded-full bg-[#111] text-white transition hover:bg-[#E30613]">
      {children}
    </a>
  );
}

function formatPhone(raw: string) {
  const d = raw.replace(/\D/g, "").replace(/^998/, "").slice(0, 9);
  const p = [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean);
  let out = "+998";
  if (p[0]) out += ` (${p[0]}${p[0].length === 2 ? ")" : ""}`;
  if (p[1]) out += ` ${p[1]}`;
  if (p[2]) out += `-${p[2]}`;
  if (p[3]) out += `-${p[3]}`;
  return out;
}

function BookingForm({ lang, service, setService }: { lang: Lang; service: string; setService: (s: string) => void }) {
  const t = DICT[lang];
  const f = t.form;
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+998 ");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const today = new Date().toISOString().slice(0, 10);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs: typeof errors = {};
    if (name.trim().length < 2) errs.name = f.errName;
    if (phone.replace(/\D/g, "").length !== 12) errs.phone = f.errPhone;
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setState("sending");
    try {
      const r = await fetch(`${API_BASE}/api/appointment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone,
          service: service ? t.services[service as ServiceId]?.t || service : "",
          date,
          note: note.trim(),
          lang,
          website: "",
        }),
      });
      if (!r.ok) throw new Error("bad");
      setState("ok");
    } catch {
      setState("error");
    }
  }

  if (state === "ok")
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center min-h-[480px]">
        <span className="grid h-20 w-20 place-items-center rounded-full bg-emerald-50 text-emerald-500 ring-8 ring-emerald-50/50"><CheckCircle2 className="h-10 w-10" /></span>
        <h3 className="font-display mt-6 text-2xl font-bold">{f.okTitle}</h3>
        <p className="mt-2 max-w-sm text-neutral-600">{f.okText}</p>
        <button
          onClick={() => {
            setState("idle");
            setName("");
            setPhone("+998 ");
            setDate("");
            setNote("");
            setService("");
          }}
          className="mt-8 text-sm font-semibold text-[#E30613] hover:underline"
        >
          {f.again}
        </button>
      </div>
    );

  const field = "h-13 w-full rounded-2xl border border-neutral-200 bg-neutral-50/60 px-4 text-[15px] outline-none transition placeholder:text-neutral-400 focus:border-[#E30613] focus:bg-white focus:ring-4 focus:ring-[#E30613]/10";
  return (
    <form onSubmit={submit} className="grid gap-5 p-7 sm:p-10 sm:grid-cols-2" noValidate>
      <label className="sm:col-span-2">
        <span className="mb-2 block text-sm font-semibold">{f.name} *</span>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder={f.namePh} className={`${field} ${errors.name ? "border-[#E30613]" : ""}`} autoComplete="name" />
        {errors.name && <span className="mt-1.5 block text-xs text-[#E30613]">{errors.name}</span>}
      </label>
      <label>
        <span className="mb-2 block text-sm font-semibold">{f.phone} *</span>
        <input value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} inputMode="tel" className={`${field} ${errors.phone ? "border-[#E30613]" : ""}`} autoComplete="tel" />
        {errors.phone && <span className="mt-1.5 block text-xs text-[#E30613]">{errors.phone}</span>}
      </label>
      <label>
        <span className="mb-2 block text-sm font-semibold">{f.date}</span>
        <input type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} className={field} />
      </label>
      <label className="sm:col-span-2">
        <span className="mb-2 block text-sm font-semibold">{f.service}</span>
        <div className="relative">
          <select value={service} onChange={(e) => setService(e.target.value)} className={`${field} appearance-none pr-10 ${service ? "" : "text-neutral-400"}`}>
            <option value="">{f.servicePh}</option>
            {SERVICE_IDS.map((id) => (
              <option key={id} value={id} className="text-[#111]">{t.services[id].t}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        </div>
      </label>
      <label className="sm:col-span-2">
        <span className="mb-2 block text-sm font-semibold">{f.note}</span>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder={f.notePh} rows={3} maxLength={600} className={`${field} h-auto py-3 resize-none`} />
      </label>
      {state === "error" && <p className="sm:col-span-2 rounded-xl bg-[#E30613]/5 p-3 text-sm text-[#B5040F]">{f.err}</p>}
      <div className="sm:col-span-2">
        <button type="submit" disabled={state === "sending"} className="btn-red h-14 w-full text-base disabled:opacity-60">
          {state === "sending" ? f.sending : f.submit} <ArrowRight className="h-5 w-5" />
        </button>
        <p className="mt-3 flex items-center justify-center gap-2 text-xs text-neutral-400"><ShieldCheck className="h-4 w-4" />{f.privacy}</p>
      </div>
    </form>
  );
}
