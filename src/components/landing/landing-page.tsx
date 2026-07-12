import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BarChart3,
  Check,
  Globe,
  Layers,
  MessageCircle,
  Palette,
  Smartphone,
  Sparkles,
  Star,
  Store,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LandingNav from "./landing-nav";

const placeholderImages = {
  hero: "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=1200&h=900&fit=crop&q=80",
  storeLogo: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=80&h=80&fit=crop&q=80",
  products: [
    {
      name: "Silk Wrap Dress",
      price: "₹2,499",
      src: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop&q=80",
    },
    {
      name: "Linen Blazer",
      price: "₹3,199",
      src: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop&q=80",
    },
    {
      name: "Pearl Earrings",
      price: "₹899",
      src: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop&q=80",
    },
    {
      name: "Canvas Tote",
      price: "₹1,299",
      src: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop&q=80",
    },
  ],
  steps: [
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1611162617474-5b21e939e113?w=600&h=400&fit=crop&q=80",
  ],
  showcase: [
    "https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&h=650&fit=crop&q=80",
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500&h=650&fit=crop&q=80",
    "https://images.unsplash.com/photo-1483985988350-763728e3685b?w=500&h=650&fit=crop&q=80",
  ],
};

const features = [
  {
    icon: Store,
    title: "Instant storefront",
    description: "Launch a branded catalogue at your own URL in minutes — no code required.",
  },
  {
    icon: Palette,
    title: "Full brand control",
    description: "Custom colors, fonts, logos, and layout. Make every catalogue feel uniquely yours.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp checkout",
    description: "Customers order directly via WhatsApp. No payment gateway setup needed.",
  },
  {
    icon: Smartphone,
    title: "Mobile-first design",
    description: "Catalogues look stunning on every device — where your customers actually browse.",
  },
  {
    icon: Layers,
    title: "Categories & products",
    description: "Organize inventory with categories, images, prices, and descriptions effortlessly.",
  },
  {
    icon: BarChart3,
    title: "Seller dashboard",
    description: "Manage products, track views, and update your store from one clean dashboard.",
  },
];

const steps = [
  {
    step: "01",
    title: "Create your account",
    description: "Sign up with email or Google. Add your business name and store URL.",
  },
  {
    step: "02",
    title: "Add your products",
    description: "Upload photos, set prices, and organize into categories in minutes.",
  },
  {
    step: "03",
    title: "Share & sell",
    description: "Share your catalogue link. Customers browse and order via WhatsApp.",
  },
];

const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "forever",
    description: "Perfect for small businesses getting started.",
    features: ["1 store", "Unlimited products", "WhatsApp orders", "Custom branding", "Mobile catalogue"],
    cta: "Start free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "₹499",
    period: "/month",
    description: "For growing sellers who need more power.",
    features: [
      "Everything in Starter",
      "Custom domain",
      "Analytics dashboard",
      "Priority support",
      "Remove branding",
    ],
    cta: "Coming soon",
    highlighted: true,
  },
  {
    name: "Business",
    price: "₹1,499",
    period: "/month",
    description: "For teams and high-volume sellers.",
    features: [
      "Everything in Pro",
      "Multiple stores",
      "Team members",
      "API access",
      "Dedicated support",
    ],
    cta: "Contact us",
    highlighted: false,
  },
];

const testimonials = [
  {
    quote: "I set up my jewellery catalogue in 20 minutes. My customers love ordering on WhatsApp.",
    name: "Priya Sharma",
    role: "Jewellery seller, Mumbai",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face&q=80",
  },
  {
    quote: "Finally a catalogue tool that actually looks premium. My conversion rate doubled.",
    name: "Rahul Mehta",
    role: "Electronics retailer, Delhi",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face&q=80",
  },
  {
    quote: "The dashboard is so clean. I manage 200+ products without any hassle.",
    name: "Ananya Reddy",
    role: "Fashion boutique, Hyderabad",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face&q=80",
  },
];

const faqs = [
  {
    q: "Is Catalogger really free to start?",
    a: "Yes. The Starter plan is free forever with unlimited products, WhatsApp ordering, and full branding customization.",
  },
  {
    q: "Do I need a website or technical skills?",
    a: "No. Catalogger gives you a ready-made storefront URL. Just add products and share the link.",
  },
  {
    q: "How do customers place orders?",
    a: "Customers browse your catalogue and tap WhatsApp to send their order directly to you. No payment gateway needed.",
  },
  {
    q: "Can I customize my store's look?",
    a: "Absolutely. Choose your theme color, fonts, logo, card style, and layout — all from the dashboard.",
  },
  {
    q: "Can I use my own domain?",
    a: "Custom domains are coming soon on the Pro plan. For now, you get a clean catalogger.com/store/your-name URL.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNav />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/[0.04] blur-3xl" />
          <div className="absolute top-20 right-0 h-[300px] w-[300px] rounded-full bg-primary/[0.03] blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="text-center lg:text-left">
              <Badge variant="secondary" className="mb-6 gap-1.5 px-3 py-1">
                <Sparkles className="h-3 w-3" />
                Launch your store in minutes
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
                Beautiful product catalogues that{" "}
                <span className="text-primary">convert</span>
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground sm:text-base lg:mx-0">
                Create a stunning online catalogue, share it anywhere, and let customers order via
                WhatsApp — no coding, no complexity.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
                <Link href="/signup" className={cn(buttonVariants({ size: "lg" }))}>
                  Start for free
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="#demo" className={cn(buttonVariants({ size: "lg", variant: "outline" }))}>
                  See demo
                </Link>
              </div>
              <p className="mt-4 text-[12px] text-muted-foreground">
                No credit card required · Free forever plan · Setup in under 5 minutes
              </p>
            </div>

            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              <div className="absolute -inset-4 rounded-3xl bg-primary/5 blur-2xl" />
              <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
                <Image
                  src={placeholderImages.hero}
                  alt="Seller managing an online product catalogue on mobile"
                  width={1200}
                  height={900}
                  priority
                  className="h-auto w-full object-cover"
                />
                <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-border/80 bg-background/90 p-3 backdrop-blur-sm shadow-lg">
                  <div className="flex items-center gap-3">
                    <Image
                      src={placeholderImages.storeLogo}
                      alt="Store logo"
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                    <div>
                      <p className="text-[13px] font-semibold text-foreground">Bloom Boutique</p>
                      <p className="text-[11px] text-muted-foreground">12 products · Live now</p>
                    </div>
                    <Badge variant="success" className="ml-auto">Online</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo */}
      <section id="demo" className="border-b border-border/60 bg-muted/30 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <Badge variant="outline" className="mb-4">Live preview</Badge>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Your store, beautifully presented
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-[13px] text-muted-foreground sm:text-sm">
              Every catalogue is mobile-optimized, brand-customized, and ready to share.
            </p>
          </div>

          <div className="mx-auto max-w-4xl">
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
              <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                </div>
                <div className="mx-auto flex h-6 flex-1 max-w-sm items-center justify-center rounded-md bg-background px-3 text-[11px] text-muted-foreground font-mono">
                  catalogger.com/store/bloom-boutique
                </div>
              </div>
              <div className="p-6 sm:p-8">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Image
                      src={placeholderImages.storeLogo}
                      alt="Bloom Boutique logo"
                      width={36}
                      height={36}
                      className="h-9 w-9 rounded-lg object-cover"
                    />
                    <div>
                      <p className="text-lg font-bold text-foreground">Bloom Boutique</p>
                      <p className="text-[12px] text-muted-foreground">Handcrafted fashion & accessories</p>
                    </div>
                  </div>
                </div>
                <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
                  {["All", "Dresses", "Accessories", "New arrivals"].map((cat, i) => (
                    <span
                      key={cat}
                      className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-medium ${
                        i === 0
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {cat}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                  {placeholderImages.products.map((product) => (
                    <div
                      key={product.name}
                      className="overflow-hidden rounded-xl border border-border bg-background"
                    >
                      <div className="relative aspect-square">
                        <Image
                          src={product.src}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 50vw, 25vw"
                          className="object-cover"
                        />
                      </div>
                      <div className="p-2.5">
                        <p className="truncate text-[11px] font-semibold text-foreground">
                          {product.name}
                        </p>
                        <p className="text-[11px] font-bold text-primary">{product.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex justify-center">
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-[12px] font-medium text-emerald-700 border border-emerald-200">
                    <MessageCircle className="h-3.5 w-3.5" />
                    Order via WhatsApp
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase strip */}
      <section className="border-b border-border/60 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {placeholderImages.showcase.map((src, i) => (
              <div
                key={src}
                className={`relative overflow-hidden rounded-2xl border border-border shadow-sm ${
                  i === 1 ? "sm:-mt-4" : ""
                }`}
              >
                <Image
                  src={src}
                  alt={`Catalogue showcase ${i + 1}`}
                  width={500}
                  height={650}
                  className="h-48 w-full object-cover sm:h-64 lg:h-72"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <Badge variant="outline" className="mb-4">Features</Badge>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Everything you need to sell online
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-[13px] text-muted-foreground sm:text-sm">
              Built for Indian sellers who want a professional presence without the overhead.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-primary/5">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription className="text-[13px]">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="border-y border-border/60 bg-muted/30 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <Badge variant="outline" className="mb-4">How it works</Badge>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Up and running in three steps
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((item, index) => (
              <div key={item.step} className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                <div className="relative h-40 w-full">
                  <Image
                    src={placeholderImages.steps[index]}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <span className="text-3xl font-bold text-primary/20">{item.step}</span>
                  <h3 className="mt-3 text-[15px] font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <Badge variant="outline" className="mb-4">Pricing</Badge>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Simple, transparent pricing
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-[13px] text-muted-foreground sm:text-sm">
              Start free. Upgrade when you&apos;re ready to grow.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={
                  plan.highlighted
                    ? "relative border-primary shadow-lg ring-1 ring-primary/20"
                    : ""
                }
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge>Most popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-3">
                    <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-[13px] text-muted-foreground">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2.5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-[13px] text-foreground">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  {plan.cta === "Start free" ? (
                    <Link href="/signup" className={cn(buttonVariants(), "w-full")}>
                      {plan.cta}
                    </Link>
                  ) : (
                    <Button className="w-full" variant="outline" disabled>
                      {plan.cta}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-y border-border/60 bg-muted/30 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <Badge variant="outline" className="mb-4">Testimonials</Badge>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Loved by sellers across India
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.name}>
                <CardContent className="pt-5">
                  <div className="mb-3 flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-[13px] leading-relaxed text-foreground">&ldquo;{t.quote}&rdquo;</p>
                  <div className="mt-5 flex items-center gap-3">
                    <Image
                      src={t.avatar}
                      alt={t.name}
                      width={36}
                      height={36}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-[13px] font-semibold text-foreground">{t.name}</p>
                      <p className="text-[11px] text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <Badge variant="outline" className="mb-4">FAQ</Badge>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Frequently asked questions
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-xl border border-border bg-card px-5 py-4 shadow-sm"
              >
                <summary className="cursor-pointer list-none text-[14px] font-semibold text-foreground marker:hidden [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-4">
                    {faq.q}
                    <span className="text-muted-foreground transition-transform group-open:rotate-45 text-lg leading-none">
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-primary px-6 py-14 text-center sm:px-12">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_50%)]" />
            <div className="relative">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                <Zap className="h-6 w-6 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-primary-foreground sm:text-3xl">
                Ready to launch your catalogue?
              </h2>
              <p className="mx-auto mt-3 max-w-md text-[14px] text-primary-foreground/80">
                Join thousands of sellers building beautiful storefronts with Catalogger.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/signup"
                  className={cn(
                    buttonVariants({ size: "lg", variant: "secondary" }),
                    "bg-white text-primary hover:bg-white/90"
                  )}
                >
                  Get started free
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/login"
                  className={cn(
                    buttonVariants({ size: "lg", variant: "outline" }),
                    "border-white/30 bg-transparent text-primary-foreground hover:bg-white/10"
                  )}
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card">
                  <Store className="h-4 w-4 text-primary" />
                </div>
                <span className="font-semibold text-foreground">Catalogger</span>
              </Link>
              <p className="mt-3 max-w-xs text-[12px] leading-relaxed text-muted-foreground">
                The simplest way to create beautiful product catalogues and sell via WhatsApp.
              </p>
            </div>
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-wider text-foreground">
                Product
              </p>
              <ul className="mt-3 space-y-2">
                <li>
                  <a href="#features" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#demo" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">
                    Demo
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-wider text-foreground">
                Account
              </p>
              <ul className="mt-3 space-y-2">
                <li>
                  <Link href="/signup" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">
                    Sign up
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">
                    Sign in
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-wider text-foreground">
                Legal
              </p>
              <ul className="mt-3 space-y-2">
                {["Privacy", "Terms"].map((item) => (
                  <li key={item}>
                    <span className="text-[13px] text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
            <p className="text-[12px] text-muted-foreground">
              © {new Date().getFullYear()} Catalogger. All rights reserved.
            </p>
            <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
              <Globe className="h-3.5 w-3.5" />
              Built for sellers in India
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
