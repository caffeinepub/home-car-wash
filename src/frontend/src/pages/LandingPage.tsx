import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  ArrowRight,
  Car,
  CheckCircle2,
  Clock,
  Droplets,
  Shield,
  Sparkles,
  Star,
} from "lucide-react";
import { motion } from "motion/react";

const features = [
  {
    icon: Clock,
    title: "Book in Minutes",
    desc: "Schedule your home car wash in under 2 minutes. Pick your date, time, and we come to you.",
  },
  {
    icon: Shield,
    title: "Fully Insured",
    desc: "All our technicians are vetted, bonded, and carry full liability insurance for your peace of mind.",
  },
  {
    icon: Sparkles,
    title: "Pro Results",
    desc: "Professional-grade equipment and eco-friendly soaps that leave your car spotless and gleaming.",
  },
];

const packages = [
  {
    name: "Basic",
    price: "$15",
    desc: "Exterior rinse & dry",
    features: ["Exterior pre-rinse", "Hand wash", "Wheel clean", "Hand dry"],
    popular: false,
  },
  {
    name: "Standard",
    price: "$30",
    desc: "Exterior wash + interior vacuum",
    features: [
      "Everything in Basic",
      "Interior vacuum",
      "Dashboard wipe-down",
      "Window clean",
    ],
    popular: true,
  },
  {
    name: "Premium",
    price: "$55",
    desc: "Full detail, wax & deep clean",
    features: [
      "Everything in Standard",
      "Hand wax & polish",
      "Leather conditioning",
      "Engine bay clean",
    ],
    popular: false,
  },
];

const reviews = [
  {
    name: "Sarah M.",
    rating: 5,
    text: "Incredible service! My Tesla looks like it just rolled off the lot. Worth every penny.",
  },
  {
    name: "James K.",
    rating: 5,
    text: "Super convenient — they came to my office parking lot while I was in meetings. Game changer.",
  },
  {
    name: "Priya R.",
    rating: 5,
    text: "The premium detail made my 8-year-old car look brand new. Highly recommend!",
  },
];

export function LandingPage() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-16">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(/assets/generated/hero-carwash.dim_1200x700.jpg)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="relative container mx-auto px-4 py-24">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6"
            >
              <Droplets className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium text-primary">
                Professional Home Car Wash Service
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6"
            >
              Your Car, <span className="gradient-text">Perfectly Clean</span>
              <br />
              At Your Door
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-muted-foreground mb-10 leading-relaxed max-w-xl"
            >
              Professional car washing brought to your driveway. Schedule,
              track, and manage all your wash appointments in one place — no
              waiting, no hassle.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                size="lg"
                onClick={login}
                disabled={isLoggingIn}
                data-ocid="landing.signin.primary_button"
                className="bg-primary text-primary-foreground hover:opacity-90 glow-cyan text-base px-8 py-6 h-auto font-semibold"
              >
                {isLoggingIn ? (
                  <>
                    <span className="w-4 h-4 mr-2 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin inline-block" />
                    Signing In...
                  </>
                ) : (
                  <>
                    Get Started Free
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border/60 text-foreground hover:bg-muted/30 text-base px-8 py-6 h-auto"
                onClick={() => {
                  document
                    .getElementById("packages")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                data-ocid="landing.packages.secondary_button"
              >
                View Packages
              </Button>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex items-center gap-4 mt-10"
            >
              <div className="flex -space-x-2">
                {["JD", "AM", "KL", "SR"].map((init) => (
                  <div
                    key={init}
                    className="w-8 h-8 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-xs font-semibold text-primary"
                  >
                    {init}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-0.5">
                  {["s1", "s2", "s3", "s4", "s5"].map((k) => (
                    <Star
                      key={k}
                      className="w-3.5 h-3.5 fill-wash-warning text-wash-warning"
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  4.9/5 from 2,400+ washes
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-muted/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Why Choose ShineDrop?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              We take the hassle out of keeping your vehicle immaculate.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-card rounded-xl p-6 group hover:border-primary/30 transition-all shadow-card"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feat.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">
                  {feat.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feat.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section id="packages" className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              No hidden fees. Just a sparkling clean car delivered to your
              address.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {packages.map((pkg, i) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative rounded-xl p-6 flex flex-col transition-all shadow-card ${
                  pkg.popular
                    ? "bg-primary/10 border-2 border-primary/40 glow-cyan"
                    : "glass-card hover:border-primary/20"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="mb-4">
                  <h3 className="font-display font-bold text-xl mb-1">
                    {pkg.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">{pkg.desc}</p>
                </div>
                <div className="mb-6">
                  <span className="font-display text-4xl font-extrabold text-foreground">
                    {pkg.price}
                  </span>
                  <span className="text-muted-foreground text-sm ml-1">
                    / wash
                  </span>
                </div>
                <ul className="flex-1 space-y-2.5 mb-6">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-foreground/80">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={login}
                  disabled={isLoggingIn}
                  data-ocid={`landing.package.${pkg.name.toLowerCase()}.button`}
                  className={
                    pkg.popular
                      ? "w-full bg-primary text-primary-foreground hover:opacity-90"
                      : "w-full variant-outline border-border/60 hover:bg-muted/30"
                  }
                  variant={pkg.popular ? "default" : "outline"}
                >
                  Book {pkg.name}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-24 bg-muted/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Customers Love It
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {reviews.map((review, i) => (
              <motion.div
                key={review.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-card rounded-xl p-6 shadow-card"
              >
                <div className="flex items-center gap-0.5 mb-3">
                  {Array.from({ length: review.rating }, (_, idx) => idx).map(
                    (idx) => (
                      <Star
                        key={`${review.name}-star-${idx}`}
                        className="w-4 h-4 fill-wash-warning text-wash-warning"
                      />
                    ),
                  )}
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed mb-4">
                  "{review.text}"
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                    {review.name[0]}
                  </div>
                  <span className="text-sm font-medium">{review.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto glass-card rounded-2xl p-12 glow-cyan shadow-card"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto mb-6">
              <Car className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Ready for a <span className="gradient-text">spotless ride?</span>
            </h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of car owners who trust ShineDrop for their car
              care needs. Sign in to book your first wash today.
            </p>
            <Button
              size="lg"
              onClick={login}
              disabled={isLoggingIn}
              data-ocid="landing.cta.primary_button"
              className="bg-primary text-primary-foreground hover:opacity-90 glow-cyan text-base px-8 py-6 h-auto font-semibold"
            >
              {isLoggingIn ? "Signing In..." : "Book Your First Wash"}
              {!isLoggingIn && <ArrowRight className="ml-2 w-4 h-4" />}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()}.{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              Built with ❤️ using caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
