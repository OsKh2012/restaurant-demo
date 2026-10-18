import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, MapPin, Clock, ArrowRight, Instagram, Facebook, Utensils, ShoppingBag, Plus, Minus, X, Star, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

// Yemeni-inspired imagery selected for the demo. Food photography is from Pexels
// (free-to-use); the Sana'a architecture image is from Wikimedia Commons (CC BY-SA 2.0).
const heroBg = "https://images.pexels.com/photos/17139829/pexels-photo-17139829.jpeg?auto=compress&cs=tinysrgb&w=1800";
const dish1 = "https://images.pexels.com/photos/17650195/pexels-photo-17650195.jpeg?auto=compress&cs=tinysrgb&w=1200";
const dish2 = "https://images.pexels.com/photos/7426867/pexels-photo-7426867.jpeg?auto=compress&cs=tinysrgb&w=1200";
const dish3 = "https://images.pexels.com/photos/27359375/pexels-photo-27359375.jpeg?auto=compress&cs=tinysrgb&w=1200";
const orderBg = "https://upload.wikimedia.org/wikipedia/commons/6/63/Houses_in_Sanaa%2C_Yemen_%2810205293626%29_%28edited%29.jpg";

const DEMO_RESTAURANT = {
  name: "Restaurant",
  cuisine: "Yemeni Kitchen · Your City",
  tagline: "Fragrant mandi, slow-cooked meats, and the warmth of a Yemeni table.",
  address: "Address",
  phone: "(619) 555-0147",
  phoneHref: "tel:1234567890",
  hours: [["Mon – Sun", "11am – 10pm"]],
};

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } }
};

const STAGGER = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const EYEBROW = "text-primary uppercase tracking-[0.2em] text-xs font-semibold mb-4 block font-sans";
const RULE = "w-10 h-px bg-primary mb-6 mx-auto";

const MENU_SECTIONS = [
  {
    id: "starters",
    label: "Yemeni Starters",
    items: [
      { name: "Sambosa", desc: "Crisp pastries filled with seasoned beef and aromatic spices.", price: "$9" },
      { name: "Shafout", desc: "Cool, tangy Yemeni bread layered with herbed yogurt and fresh greens.", price: "$10" },
      { name: "Mutabbaq", desc: "Golden folded pastry with a savory spiced filling.", price: "$11" },
      { name: "Sahawiq & Bread", desc: "Fresh chopped chili-tomato sauce served with warm bread.", price: "$7" },
    ]
  },
  {
    id: "mains",
    label: "Mandi & Mains",
    items: [
      { name: "Lamb Mandi", desc: "Slow-roasted lamb over fragrant basmati rice with Yemeni spices.", price: "$28" },
      { name: "Chicken Mandi", desc: "Tender roasted chicken served over saffron-tinted mandi rice.", price: "$22" },
      { name: "Haneeth", desc: "Fall-apart slow-cooked lamb with rich spices and rice.", price: "$29" },
      { name: "Fahsa", desc: "Yemeni-style shredded beef stew finished with fenugreek and herbs.", price: "$20" },
    ]
  },
  {
    id: "sides",
    label: "Sides",
    items: [
      { name: "Saltah", desc: "A bubbling Yemeni stew finished tableside with fenugreek foam.", price: "$12" },
      { name: "Sahawiq", desc: "Fresh Yemeni tomato, chili, cilantro, and lime relish.", price: "$5" },
      { name: "Mandi Rice", desc: "Fragrant long-grain rice with warm Yemeni spices.", price: "$7" },
    ]
  },
  {
    id: "desserts",
    label: "Desserts",
    items: [
      { name: "Bint Al-Sahn", desc: "Honey-glazed Yemeni bread topped with sesame and nigella.", price: "$9" },
      { name: "Masoub", desc: "Warm layered bread with banana, cream, and honey.", price: "$10" },
      { name: "Honey & Cream", desc: "A simple Yemeni-inspired sweet finish.", price: "$7" },
    ]
  },
  {
    id: "drinks",
    label: "Tea & Drinks",
    items: [
      { name: "Adeni Tea", desc: "Black tea simmered with milk and warming spices.", price: "$5" },
      { name: "Yemeni Coffee", desc: "Dark, spiced coffee inspired by traditional Yemeni brewing.", price: "$5" },
      { name: "Mint Tea", desc: "Fresh mint and black tea served hot.", price: "$4" },
    ]
  },
];

const DISHES = [
  { img: dish1, name: "Lamb Mandi", desc: "Slow-roasted lamb layered over fragrant Yemeni-style rice." },
  { img: dish2, name: "Chicken Mandi", desc: "Tender roasted chicken with saffron-tinted rice and fresh accompaniments." },
  { img: dish3, name: "Haneeth", desc: "Slow-cooked lamb with rich spices, herbs, and the flavors of Hadhramaut." },
];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState("starters");
  const [cart, setCart] = useState<{ name: string; price: number; quantity: number }[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderType, setOrderType] = useState<"pickup" | "delivery">("pickup");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartTax = cartTotal * 0.0775;
  const grandTotal = cartTotal + cartTax + (orderType === "delivery" && cart.length ? 4.99 : 0);
  const addToCart = (item: { name: string; price: string }) => {
    const price = Number(item.price.replace("$", ""));
    setCart((current) => {
      const existing = current.find((entry) => entry.name === item.name);
      if (existing) return current.map((entry) => entry.name === item.name ? { ...entry, quantity: entry.quantity + 1 } : entry);
      return [...current, { name: item.name, price, quantity: 1 }];
    });
    setCartOpen(true);
  };
  const changeQuantity = (name: string, delta: number) => setCart((current) => current.map((item) => item.name === name ? { ...item, quantity: item.quantity + delta } : item).filter((item) => item.quantity > 0));

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">

      {/* ── Navigation ───────────────────────────────────────────────── */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-background/96 backdrop-blur-xl border-b border-border/60 py-3 md:py-4 shadow-sm"
            : "bg-transparent py-5 md:py-7"
        }`}
      >
        <div className="container mx-auto px-5 sm:px-6 md:px-10 flex justify-between items-center">
          <a
            href="#"
            className={`inline-flex items-center gap-2.5 font-serif font-bold tracking-tight transition-all duration-300 ${
              scrolled ? "text-xl text-foreground" : "text-xl md:text-2xl text-white drop-shadow"
            }`}
            data-testid="nav-logo"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-current/35">
              <Utensils className="h-4 w-4" aria-hidden="true" />
            </span>
            {DEMO_RESTAURANT.name}
          </a>

          <div className="hidden md:flex items-center gap-10">
            {["about", "menu", "contact"].map((id) => (
              <a
                key={id}
                href={`#${id}`}
                className={`text-xs font-semibold uppercase tracking-[0.15em] transition-colors hover:text-primary ${
                  scrolled ? "text-muted-foreground" : "text-white/80"
                }`}
                data-testid={`nav-${id}`}
              >
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </a>
            ))}
            <a
              href="#order"
              className={`text-xs font-semibold uppercase tracking-[0.15em] text-primary transition-opacity hover:opacity-75 ${
                scrolled ? "" : "drop-shadow"
              }`}
              data-testid="nav-order"
            >
              Order Online
            </a>
          </div>

          {/* Mobile: call button — 44px min touch target */}
          <a
            href={DEMO_RESTAURANT.phoneHref}
            className="md:hidden flex items-center gap-1.5 bg-primary text-primary-foreground rounded-full h-11 px-5 text-xs font-semibold tracking-wide shadow-md active:scale-95 transition-transform"
            data-testid="nav-mobile-call"
          >
            <Phone className="w-3.5 h-3.5" /> Call
          </a>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative h-[100svh] min-h-[600px] w-full overflow-hidden flex flex-col yemeni-hero">

        <div className="absolute inset-0 z-0">
          <img
            src={heroBg}
            alt="A warm, welcoming neighborhood restaurant dining room"
            className="w-full h-full object-cover object-center brightness-90 saturate-110"
          />
          {/* Mobile: full uniform overlay so text is always legible */}
          <div className="absolute inset-0 md:hidden" style={{ background: "rgba(8,4,2,0.72)" }} />
          {/* Desktop: directional gradient revealing the room on the right */}
          <div
            className="absolute inset-0 hidden md:block"
            style={{ background: "linear-gradient(105deg, rgba(10,6,4,0.88) 0%, rgba(10,6,4,0.72) 38%, rgba(10,6,4,0.28) 62%, transparent 78%)" }}
          />
          {/* Both: bottom vignette */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,6,4,0.85) 0%, rgba(10,6,4,0.25) 20%, transparent 42%)" }} />
          {/* Both: top vignette */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(10,6,4,0.55) 0%, transparent 20%)" }} />
        </div>

        {/* Content — centered on mobile, left-aligned on desktop */}
        <div className="relative z-10 flex-1 flex items-center">
          <div className="w-full px-5 sm:px-8 md:px-16 lg:px-24">
            <div className="max-w-xl lg:max-w-2xl mx-auto md:mx-0">

              <motion.div
                initial="hidden"
                animate="visible"
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.13, delayChildren: 0.15 } } }}
                className="text-center md:text-left"
              >
                {/* Eyebrow */}
                <motion.div
                  variants={{ hidden: { opacity: 0, x: -16 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22,1,0.36,1] } } }}
                  className="flex items-center justify-center md:justify-start gap-4 mb-6 md:mb-8"
                  data-testid="hero-subtitle"
                >
                  <div className="w-6 md:w-8 h-px bg-primary" />
                  <span className="text-primary text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.28em] font-sans">
                    {DEMO_RESTAURANT.cuisine}
                  </span>
                </motion.div>

                {/* Title */}
                <motion.h1
                  variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.22,1,0.36,1] } } }}
                  className="font-serif font-bold text-white leading-[0.9] tracking-tight mb-2"
                  style={{ fontSize: "clamp(3.75rem, 14vw, 9rem)" }}
                  data-testid="hero-title"
                >
                  {DEMO_RESTAURANT.name}
                </motion.h1>
                <motion.div
                  variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.08 } } }}
                  className="font-arabic text-primary/90 text-2xl md:text-3xl mb-5"
                  dir="rtl"
                  lang="ar"
                >
                  مَطْعَم يَمَنِي أَصِيل
                </motion.div>
                <motion.div
                  variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.22,1,0.36,1] } } }}
                  className="flex items-baseline justify-center md:justify-start gap-4 md:gap-5 mb-6 md:mb-8"
                >
                  <div className="w-1 self-stretch bg-primary rounded-full shrink-0" style={{ minHeight: "2.5rem" }} />
                  <span
                    className="font-serif font-light text-white/60 leading-none tracking-wide italic"
                    style={{ fontSize: "clamp(1.75rem, 7vw, 4.5rem)" }}
                  >
                    Website Demo
                  </span>
                </motion.div>

                {/* Rule */}
                <motion.div
                  variants={{ hidden: { opacity: 0, scaleX: 0 }, visible: { opacity: 1, scaleX: 1, transition: { duration: 0.6, ease: "easeOut" } } }}
                  className="h-px bg-primary/40 mb-6 md:mb-8 origin-left"
                  style={{ width: "min(240px, 55%)", marginLeft: "auto", marginRight: "auto" }}
                />

                {/* Tagline */}
                <motion.p
                  variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22,1,0.36,1] } } }}
                  className="text-white/65 font-light leading-[1.75] mb-8 md:mb-12 mx-auto md:mx-0"
                  style={{ fontSize: "clamp(0.925rem, 2.2vw, 1.1rem)", maxWidth: "30rem" }}
                  data-testid="hero-tagline"
                >
                  {DEMO_RESTAURANT.tagline}
                </motion.p>

                {/* CTAs — stacked full-width on mobile, row on sm+ */}
                <motion.div
                  variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22,1,0.36,1] } } }}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <Button
                    asChild
                    size="lg"
                    className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/85 rounded-full h-14 sm:h-12 px-8 text-sm font-semibold tracking-wide shadow-xl shadow-primary/40 hover:shadow-primary/60 active:scale-[0.98] transition-all duration-300"
                    data-testid="hero-cta-order"
                  >
                    <a href="#order">Order Online</a>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto rounded-full h-14 sm:h-12 px-8 border-white/20 bg-white/8 text-white hover:bg-white/14 hover:text-white text-sm font-semibold tracking-wide backdrop-blur-sm active:scale-[0.98] transition-all duration-300"
                    data-testid="hero-cta-call"
                  >
                    <a href={DEMO_RESTAURANT.phoneHref}>
                      <Phone className="w-4 h-4 mr-2 opacity-75" /> Call Now
                    </a>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="ghost"
                    className="w-full sm:w-auto rounded-full h-14 sm:h-12 px-8 text-white/55 hover:text-white hover:bg-white/8 text-sm font-semibold tracking-wide active:scale-[0.98] transition-all duration-300"
                    data-testid="hero-cta-directions"
                  >
                    <a
                      href="#contact"
                    >
                      <MapPin className="w-4 h-4 mr-2 opacity-75" /> Visit Us
                    </a>
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Info strip — scrollable on mobile if needed */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.7, ease: [0.22,1,0.36,1] }}
          className="relative z-10 w-full border-t border-white/10 overflow-x-auto"
          style={{ background: "rgba(10,6,4,0.60)", backdropFilter: "blur(12px)" }}
        >
          <div className="px-5 sm:px-8 md:px-16 lg:px-24 py-3 sm:py-4 flex items-center justify-between gap-4 min-w-max sm:min-w-0">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="text-white/55 text-xs font-light tracking-wide whitespace-nowrap">{DEMO_RESTAURANT.address}</span>
              </div>
              <div className="w-px h-3.5 bg-white/15" />
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="text-white/55 text-xs font-light tracking-wide whitespace-nowrap">Open daily · 11am – 9pm</span>
              </div>
              <div className="w-px h-3.5 bg-white/15" />
              <a href={DEMO_RESTAURANT.phoneHref} className="flex items-center gap-2 text-white/55 text-xs font-light tracking-wide hover:text-primary transition-colors whitespace-nowrap">
                <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
                {DEMO_RESTAURANT.phone}
              </a>
            </div>
            <a
              href="#menu"
              className="flex items-center gap-1.5 text-primary text-xs font-semibold uppercase tracking-[0.18em] hover:opacity-75 transition-opacity shrink-0 pl-4"
            >
              Menu <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </motion.div>

      </section>

      {/* ── About ────────────────────────────────────────────────────── */}
      <section id="about" className="py-16 md:py-28 lg:py-40 bg-background">
        <div className="container mx-auto px-5 sm:px-6 md:px-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={FADE_UP}
            className="max-w-2xl mx-auto text-center"
          >
            <span className={EYEBROW}>Our Kitchen</span>
            <div className={RULE} />
            <h2
              className="font-serif font-bold text-foreground mb-6 md:mb-8 leading-tight"
              style={{ fontSize: "clamp(1.9rem, 5vw, 3.25rem)" }}
              data-testid="about-title"
            >
              A Taste of Yemen<br />
              <em className="not-italic text-primary/80">Made for Sharing</em>
            </h2>
            <p
              className="text-muted-foreground leading-[1.85] font-light"
              style={{ fontSize: "clamp(0.95rem, 1.8vw, 1.125rem)" }}
              data-testid="about-text"
            >
              {DEMO_RESTAURANT.name} is a sample Yemeni restaurant concept built around generous plates, bold spices, and genuine
              hospitality. Inspired by the flavors of Yemen, every meal is meant to be shared, lingered over,
              and enjoyed together.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Featured Dishes ──────────────────────────────────────────── */}
      <section className="py-14 md:py-24 lg:py-36 bg-card/40">
        <div className="container mx-auto px-5 sm:px-6 md:px-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={FADE_UP}
            className="text-center mb-10 md:mb-16 lg:mb-20"
          >
            <span className={EYEBROW}>Yemeni Favorites</span>
            <div className={RULE} />
            <h2
              className="font-serif font-bold text-foreground"
              style={{ fontSize: "clamp(1.9rem, 5vw, 3.25rem)" }}
              data-testid="featured-title"
            >
              From Yemen to Your Table
            </h2>
          </motion.div>

          {/* Landscape ratio on mobile, portrait on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-14">
            {DISHES.map((dish, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={{
                  hidden: { opacity: 0, y: 32 },
                  visible: { opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
                }}
                className="group cursor-default"
                data-testid={`featured-card-${i}`}
              >
                <div className="relative aspect-[16/10] md:aspect-[3/4] overflow-hidden rounded-2xl mb-4 md:mb-7 shadow-md">
                  <img
                    src={dish.img}
                    alt={dish.name}
                    className="w-full h-full object-cover transform group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <h3
                  className="font-serif font-bold text-foreground mb-2 md:mb-3 group-hover:text-primary transition-colors duration-300 leading-snug"
                  style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)" }}
                  data-testid={`featured-name-${i}`}
                >
                  {dish.name}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm" data-testid={`featured-desc-${i}`}>
                  {dish.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Menu ─────────────────────────────────────────────────────── */}
      <section id="menu" className="py-16 md:py-28 lg:py-40 bg-background">
        <div className="container mx-auto px-5 sm:px-6 md:px-10 max-w-5xl">

          {/* Header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={FADE_UP}
            className="text-center mb-10 md:mb-14"
          >
            <span className={EYEBROW}>What We Serve</span>
            <div className={RULE} />
            <h2
              className="font-serif font-bold text-foreground"
              style={{ fontSize: "clamp(1.9rem, 5vw, 3.25rem)" }}
              data-testid="menu-title"
            >
              The Full Menu
            </h2>
            <p className="text-muted-foreground mt-3 text-sm tracking-wide">
              Sample dishes, descriptions, and pricing — customize these for your restaurant
            </p>
          </motion.div>

          {/* Category tabs — horizontal scroll on mobile */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={FADE_UP}
            className="mb-10 md:mb-14"
          >
            <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-none -mx-5 sm:-mx-6 md:mx-0 px-5 sm:px-6 md:px-0 md:flex-wrap md:justify-center">
              {MENU_SECTIONS.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => setActiveMenu(sec.id)}
                  className={`shrink-0 rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] border transition-all duration-200 whitespace-nowrap ${
                    activeMenu === sec.id
                      ? "bg-primary text-primary-foreground border-primary shadow-md"
                      : "bg-transparent text-foreground/60 border-border hover:text-foreground hover:border-foreground/30"
                  }`}
                  data-testid={`menu-tab-${sec.id}`}
                >
                  {sec.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Menu items — animated on tab switch */}
          <AnimatePresence mode="wait">
            {MENU_SECTIONS.filter((s) => s.id === activeMenu).map((sec) => (
              <motion.div
                key={sec.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-20 gap-y-0"
                data-testid="menu-items-grid"
              >
                {sec.items.map((item, i) => (
                  <div
                    key={i}
                    className="group py-5 md:py-6 border-b border-border/40 last:border-b-0 md:last:border-b-0"
                    data-testid={`menu-item-${i}`}
                  >
                    <div className="flex items-baseline gap-2 mb-1.5">
                      <h3
                        className="font-serif font-bold text-foreground group-hover:text-primary transition-colors duration-300 leading-snug flex-1"
                        style={{ fontSize: "clamp(1rem, 2vw, 1.15rem)" }}
                        data-testid={`menu-item-name-${i}`}
                      >
                        {item.name}
                      </h3>
                      {item.price && (
                        <>
                          <div className="flex-1 border-b border-dotted border-border/50 self-center mb-1 min-w-2 max-w-10" />
                          <span
                            className="font-serif font-semibold text-primary/90 shrink-0 tabular-nums"
                            style={{ fontSize: "clamp(0.9rem, 1.4vw, 1.05rem)" }}
                            data-testid={`menu-item-price-${i}`}
                          >
                            {item.price}
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed" data-testid={`menu-item-desc-${i}`}>
                      {item.desc}
                    </p>
                    <button onClick={() => addToCart(item)} className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-primary/30 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary transition-all duration-200 hover:bg-primary hover:text-primary-foreground active:scale-95">
                      <Plus className="h-3 w-3" /> Add to Order
                    </button>
                  </div>
                ))}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Order CTA below menu */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={FADE_UP}
            className="mt-12 md:mt-16 text-center"
          >
            <p className="text-muted-foreground text-sm mb-5 tracking-wide">
              Dine in · Takeout · Delivery
            </p>
            <a
              href="#order"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-full h-12 px-8 text-sm font-semibold tracking-wide shadow-lg shadow-primary/25 hover:bg-primary/85 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              data-testid="menu-order-btn"
            >
              Order Online <ArrowRight className="w-3.5 h-3.5 opacity-75" />
            </a>
          </motion.div>

        </div>
      </section>

      {/* ── Order Online ─────────────────────────────────────────────── */}
      <section id="order" className="relative overflow-hidden" style={{ minHeight: "520px" }}>

        <div className="absolute inset-0 z-0">
          <img
            src={orderBg}
            alt="A thoughtfully set table in a welcoming restaurant"
            className="w-full h-full object-cover object-center saturate-110"
          />
          {/* Mobile: stronger center overlay */}
          <div className="absolute inset-0 md:hidden" style={{ background: "rgba(8,4,2,0.80)" }} />
          {/* Desktop: directional overlay */}
          <div
            className="absolute inset-0 hidden md:block"
            style={{ background: "linear-gradient(to right, rgba(8,4,2,0.93) 0%, rgba(8,4,2,0.82) 42%, rgba(8,4,2,0.55) 68%, rgba(8,4,2,0.30) 100%)" }}
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(8,4,2,0.45) 0%, transparent 30%, transparent 70%, rgba(8,4,2,0.55) 100%)" }} />
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={FADE_UP}
          className="relative z-10 container mx-auto px-5 sm:px-8 md:px-16 lg:px-24 py-20 md:py-28 lg:py-36"
        >
          {/* Centered on mobile, left on desktop */}
          <div className="max-w-lg mx-auto md:mx-0 text-center md:text-left">

            <div className="flex items-center justify-center md:justify-start gap-4 mb-6 md:mb-7">
              <div className="w-6 md:w-8 h-px bg-primary" />
              <span className="text-primary text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.28em] font-sans">
                Dine In · Takeout · Delivery
              </span>
            </div>

            <h2
              className="font-serif font-bold text-white leading-[1.05] tracking-tight mb-5 md:mb-6"
              style={{ fontSize: "clamp(2.2rem, 7vw, 4rem)" }}
              data-testid="order-title"
            >
              Good food,<br />
              <span className="text-primary">your way.</span>
            </h2>

            <div className="w-12 h-px bg-primary/40 mb-5 md:mb-6 mx-auto md:mx-0" />

            <p
              className="text-white/55 font-light leading-[1.8] mb-8 md:mb-10"
              style={{ fontSize: "clamp(0.875rem, 1.8vw, 1.05rem)" }}
              data-testid="order-desc"
            >
              From mandi and haneeth to Adeni tea and bint al-sahn, bring the full Yemeni table to every order. Choose your favorites, add them to your order, and preview the complete checkout experience.
            </p>

            {/* Stat badges */}
            <div className="flex items-center justify-center md:justify-start gap-3 mb-8 md:mb-10">
              {[
                { val: "Dine in", label: "Eat here" },
                { val: "Takeout", label: "Pick up" },
                { val: "Delivery", label: "Order ahead" },
              ].map(({ val, label }) => (
                <div key={label} className="flex flex-col items-center px-4 sm:px-5 py-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm flex-1 sm:flex-none sm:min-w-[82px]">
                  <span className="font-serif font-bold text-white text-lg leading-none mb-1">{val}</span>
                  <span className="text-white/40 text-[9px] sm:text-[10px] uppercase tracking-wider font-sans whitespace-nowrap">{label}</span>
                </div>
              ))}
            </div>

            {/* Full-width on mobile */}
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/85 rounded-full h-14 px-10 text-sm font-semibold tracking-wide shadow-2xl shadow-primary/35 hover:shadow-primary/55 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              data-testid="order-btn-sample"
            >
              <button onClick={() => setCartOpen(true)}>
                <ShoppingBag className="w-4 h-4 mr-2.5 opacity-80" />
                Start Your Order
                <ArrowRight className="w-4 h-4 ml-2.5 opacity-70" />
              </button>
            </Button>

          </div>
        </motion.div>
      </section>

      {/* ── Reviews ─────────────────────────────────────────────────── */}
      <section className="py-16 md:py-28 lg:py-36 bg-card/40">
        <div className="container mx-auto px-5 sm:px-6 md:px-10 max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={FADE_UP} className="text-center mb-10 md:mb-14">
            <span className={EYEBROW}>Guest Favorites</span><div className={RULE} />
            <h2 className="font-serif font-bold text-foreground" style={{ fontSize: "clamp(1.9rem, 5vw, 3.25rem)" }}>What Guests Say</h2>
            <div className="mt-5 inline-flex items-center gap-3 rounded-full border border-primary/20 bg-background/70 px-5 py-2.5">
              <div className="flex gap-0.5 text-primary">{[1,2,3,4,5].map((s) => <Star key={s} className="h-4 w-4 fill-current" />)}</div>
              <span className="font-serif text-lg font-semibold">4.9</span><span className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Demo rating</span>
            </div>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-7">
            {["The service was welcoming, attentive, and made the whole visit feel comfortable.","Such a warm atmosphere — it feels like a place you can actually relax and spend time with family.","Everything was organized, the staff were friendly, and the experience from start to finish was excellent."].map((text, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} variants={FADE_UP} className="rounded-2xl border border-border/60 bg-background p-6 md:p-7 shadow-sm">
                <div className="flex gap-0.5 text-primary mb-4">{[1,2,3,4,5].map((s) => <Star key={s} className="h-3.5 w-3.5 fill-current" />)}</div>
                <p className="font-serif text-lg leading-relaxed text-foreground/85 mb-5">“{text}”</p>
                <span className="text-[9px] uppercase tracking-[0.12em] text-muted-foreground">Sample guest review</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {cartOpen && (
          <><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCartOpen(false)} className="fixed inset-0 z-[70] bg-black/55 backdrop-blur-[2px]" />
          <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed right-0 top-0 z-[80] h-full w-full max-w-md bg-background shadow-2xl border-l border-border/60 flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-border/60"><div><span className={EYEBROW}>Online Ordering</span><h2 className="font-serif text-2xl font-bold">Your Order</h2></div><button onClick={() => setCartOpen(false)} className="h-10 w-10 rounded-full border border-border flex items-center justify-center"><X className="h-4 w-4" /></button></div>
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
              {cart.length === 0 ? <div className="h-full flex flex-col items-center justify-center text-center"><ShoppingBag className="h-8 w-8 text-primary mb-4" /><h3 className="font-serif text-2xl font-bold">Your order is empty</h3><p className="text-sm text-muted-foreground mt-2">Add dishes from the menu to begin.</p></div> : cart.map((item) => (
                <div key={item.name} className="rounded-2xl border border-border/60 bg-card/50 p-4"><div className="flex justify-between gap-4"><div><h3 className="font-serif font-bold">{item.name}</h3><p className="text-sm text-primary mt-1">${item.price.toFixed(2)} each</p></div><b>${(item.price * item.quantity).toFixed(2)}</b></div>
                  <div className="mt-3 flex justify-end"><div className="flex items-center rounded-full border border-border"><button onClick={() => changeQuantity(item.name,-1)} className="h-9 w-9 flex items-center justify-center"><Minus className="h-3.5 w-3.5" /></button><span className="w-9 text-center text-sm">{item.quantity}</span><button onClick={() => changeQuantity(item.name,1)} className="h-9 w-9 flex items-center justify-center"><Plus className="h-3.5 w-3.5" /></button></div></div>
                </div>
              ))}
            </div>
            {cart.length > 0 && <div className="border-t border-border/60 px-6 py-5 bg-card/30">
              <div className="grid grid-cols-2 gap-2 mb-5">{["pickup","delivery"].map((type) => <button key={type} onClick={() => setOrderType(type as "pickup" | "delivery")} className={orderType === type ? "rounded-xl border border-primary bg-primary/10 text-primary px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em]" : "rounded-xl border border-border text-muted-foreground px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em]"}>{type}</button>)}</div>
              <div className="space-y-2 text-sm"><div className="flex justify-between"><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div><div className="flex justify-between text-muted-foreground"><span>Estimated tax</span><span>${cartTax.toFixed(2)}</span></div>{orderType === "delivery" && <div className="flex justify-between text-muted-foreground"><span>Delivery</span><span>$4.99</span></div>}<div className="flex justify-between pt-3 border-t border-border/50 font-semibold"><span>Total</span><span className="font-serif text-primary text-lg">${grandTotal.toFixed(2)}</span></div></div>
              <button onClick={() => { setCartOpen(false); setCheckoutOpen(true); }} className="mt-5 w-full h-13 rounded-full bg-primary text-primary-foreground font-semibold text-sm shadow-lg">Continue to Checkout <ArrowRight className="inline h-4 w-4 ml-1.5" /></button>
            </div>}
          </motion.aside></>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {checkoutOpen && <><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4"><div className="relative w-full max-w-lg rounded-3xl border border-border/60 bg-background shadow-2xl p-6 md:p-8">
            <button onClick={() => setCheckoutOpen(false)} className="absolute right-5 top-5 h-10 w-10 rounded-full border border-border flex items-center justify-center"><X className="h-4 w-4" /></button>
            {!orderPlaced ? <><span className={EYEBROW}>Final Step</span><h2 className="font-serif text-3xl font-bold mb-2">Checkout</h2><p className="text-sm text-muted-foreground mb-6">Demo checkout — no payment is processed.</p>
              <div className="space-y-4"><input className="w-full h-12 rounded-xl border border-input bg-background px-4 text-sm" placeholder="Your name" /><input className="w-full h-12 rounded-xl border border-input bg-background px-4 text-sm" placeholder="Phone number" />{orderType === "delivery" && <input className="w-full h-12 rounded-xl border border-input bg-background px-4 text-sm" placeholder="Delivery address" />}<div className="rounded-xl border border-border bg-card/40 p-4 text-sm text-muted-foreground">Demo payment · No card information is collected.</div></div>
              <button onClick={() => setOrderPlaced(true)} className="mt-6 w-full h-14 rounded-full bg-primary text-primary-foreground font-semibold">Place Demo Order · ${grandTotal.toFixed(2)}</button>
            </> : <div className="py-8 text-center"><CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" /><span className={EYEBROW}>Order Received</span><h2 className="font-serif text-3xl font-bold">Thank You</h2><p className="mt-3 text-sm text-muted-foreground">This is a demo confirmation. No payment was processed.</p><button onClick={() => { setCheckoutOpen(false); setOrderPlaced(false); setCart([]); }} className="mt-6 rounded-full bg-primary px-7 h-11 text-sm font-semibold text-primary-foreground">Back to Site</button></div>}
          </div></motion.div></>}
      </AnimatePresence>
      {/* ── Contact ──────────────────────────────────────────────────── */}
      <section id="contact" className="py-16 md:py-28 lg:py-40 bg-background">
        <div className="container mx-auto px-5 sm:px-6 md:px-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={FADE_UP}
            className="text-center mb-10 md:mb-16 lg:mb-20"
          >
            <span className={EYEBROW}>Find Us</span>
            <div className={RULE} />
            <h2
              className="font-serif font-bold text-foreground"
              style={{ fontSize: "clamp(1.9rem, 5vw, 3.25rem)" }}
              data-testid="contact-title"
            >
              Visit Us
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 lg:gap-20 items-start">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={FADE_UP}
              className="space-y-7 md:space-y-10"
            >
              {[
                {
                  icon: MapPin,
                  label: "Location",
                  content: (
                    <>
                      <p className="text-foreground font-light leading-relaxed mb-3" data-testid="contact-address">
                        {DEMO_RESTAURANT.address}
                      </p>
                      <a
                        href="#contact-map"
                        className="inline-flex items-center text-primary text-sm font-semibold tracking-wide hover:opacity-75 active:opacity-60 transition-opacity min-h-[44px]"
                        data-testid="contact-directions-link"
                      >
                        Add directions link <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </a>
                    </>
                  )
                },
                {
                  icon: Clock,
                  label: "Hours",
                  content: (
                    <ul className="space-y-2 font-light" data-testid="contact-hours">
                      {DEMO_RESTAURANT.hours.map(([day, time]) => (
                        <li key={day} className="flex gap-3 text-sm">
                          <span className="text-foreground font-medium w-20 sm:w-24 shrink-0">{day}</span>
                          <span className="text-muted-foreground">{time}</span>
                        </li>
                      ))}
                    </ul>
                  )
                },
                {
                  icon: Phone,
                  label: "Reservations",
                  content: (
                    <a
                      href={DEMO_RESTAURANT.phoneHref}
                      className="text-foreground font-light hover:text-primary transition-colors inline-block min-h-[44px] leading-[44px]"
                      data-testid="contact-phone"
                    >
                      {DEMO_RESTAURANT.phone}
                    </a>
                  )
                }
              ].map(({ icon: Icon, label, content }, i) => (
                <div key={i} className="flex items-start gap-5 md:gap-6">
                  <div className="w-10 h-10 md:w-11 md:h-11 rounded-full border border-primary/25 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-3">
                      {label}
                    </h3>
                    {content}
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={FADE_UP}
              id="contact-map"
              className="relative rounded-2xl overflow-hidden shadow-xl border border-border/50 h-[260px] sm:h-[360px] lg:h-[500px] bg-[#e9e5d9]"
              data-testid="contact-map-container"
            >
              <div
                className="absolute inset-0 opacity-60"
                aria-hidden="true"
                style={{
                  backgroundImage: "repeating-linear-gradient(32deg, transparent 0 52px, rgba(106,123,94,.18) 53px 55px, transparent 56px 94px), repeating-linear-gradient(122deg, transparent 0 64px, rgba(106,123,94,.18) 65px 67px, transparent 68px 112px)",
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <div className="max-w-xs rounded-2xl border border-border/50 bg-background/95 px-7 py-6 text-center shadow-xl backdrop-blur-sm">
                  <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <p className="font-serif text-lg font-semibold text-foreground">Map preview</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    Add your restaurant’s address to show customers where to find you.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer style={{ background: "hsl(25 40% 9%)" }} className="pt-12 md:pt-16 pb-24 md:pb-10">
        <div className="container mx-auto px-5 sm:px-6 md:px-10">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 md:gap-10 mb-10 md:mb-12 pb-10 md:pb-12 border-b border-white/10">

            {/* Brand + social */}
            <div className="max-w-xs">
              <h2 className="inline-flex items-center gap-2.5 font-serif font-bold text-primary text-3xl mb-3" data-testid="footer-title">
                <Utensils className="h-6 w-6" aria-hidden="true" />
                {DEMO_RESTAURANT.name}
              </h2>
              <p className="text-white/40 text-sm leading-relaxed font-light mb-5" data-testid="footer-text">
                A modern Yemeni restaurant website concept. Replace the photos, menu, details, and links with your own.
              </p>
              {/* Social icons */}
              <div className="flex items-center gap-3 text-white/45" aria-label="Sample social media links">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15" title="Add your Instagram link">
                  <Instagram className="w-4 h-4" />
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15" title="Add your Facebook link">
                  <Facebook className="w-4 h-4" />
                </span>
                <span className="text-xs">Add your social links</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-8 md:gap-x-16 gap-y-4">
              {[
                { label: "About", href: "#about" },
                { label: "Menu", href: "#menu" },
                { label: "Order Online", href: "#order" },
                { label: "Contact", href: "#contact" },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="text-white/40 hover:text-primary text-sm font-light transition-colors min-h-[44px] flex items-center"
                >
                  {label}
                </a>
              ))}
            </div>

            <div className="hidden md:flex flex-col gap-3 items-start">
              <Button
                asChild
                className="bg-primary text-primary-foreground hover:bg-primary/85 rounded-full h-11 px-7 text-xs font-semibold tracking-wide"
              >
                <a href={DEMO_RESTAURANT.phoneHref}>
                  <Phone className="w-3.5 h-3.5 mr-2" /> Call Now
                </a>
              </Button>
              <a
                href="#menu"
                className="flex items-center gap-2 text-white/35 hover:text-primary text-xs font-light tracking-wide transition-colors"
              >
                <ArrowRight className="w-3 h-3" /> Preview Yemeni menu
              </a>
            </div>
          </div>

          <div
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-1.5 text-xs text-white/25 font-light tracking-wide"
            data-testid="footer-copyright"
          >
            <span>© {new Date().getFullYear()} {DEMO_RESTAURANT.name} · Yemeni restaurant website demo</span>
            <span>{DEMO_RESTAURANT.address}</span>
          </div>
        </div>
      <div className="text-center text-[10px] text-white/25 mt-5 px-5">
        
      </div>
      </footer>

      {/* ── Sticky Mobile CTA — above safe-area ──────────────────────── */}
      <div
        className="fixed bottom-0 left-0 w-full z-50 md:hidden"
        style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}
        data-testid="mobile-sticky-cta-container"
      >
        <div className="px-4 pt-3 pb-0" style={{ background: "linear-gradient(to top, hsl(25 40% 9%) 70%, transparent)" }}>
          <a
            href={DEMO_RESTAURANT.phoneHref}
            className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground rounded-full h-14 text-sm font-semibold tracking-wide shadow-xl shadow-primary/30 active:scale-[0.98] transition-transform"
            data-testid="mobile-sticky-cta"
          >
            <Phone className="w-4 h-4" /> Call Now
          </a>
        </div>
      </div>

    </div>
  );
}
