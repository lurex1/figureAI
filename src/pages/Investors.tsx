import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { 
  Rocket, 
  TrendingUp, 
  Users, 
  Printer, 
  Brain, 
  Globe, 
  CheckCircle,
  ArrowRight,
  Mail
} from "lucide-react";
import { Link } from "react-router-dom";

const technologies = [
  { name: "React + TypeScript", description: "Nowoczesny frontend" },
  { name: "Supabase", description: "Backend & baza danych" },
  { name: "AI/ML Models", description: "Generowanie modeli 3D" },
  { name: "Three.js", description: "Podgląd 3D w przeglądarce" },
  { name: "Stripe", description: "Płatności online" },
  { name: "Cloud Infrastructure", description: "Skalowalna infrastruktura" },
];

const marketStats = [
  { value: "$12.1B", label: "Wartość rynku druku 3D (2024)", growth: "+20% rocznie" },
  { value: "$5.8B", label: "Rynek personalizowanych produktów", growth: "+15% rocznie" },
  { value: "500M+", label: "Użytkowników drukarek 3D", growth: "rosnąca baza" },
];

const advantages = [
  "Działający prototyp (MVP) gotowy do testów",
  "Unikalna technologia AI do konwersji zdjęć na modele 3D",
  "4 style artystyczne (Realistic, Anime, LEGO, Fortnite)",
  "Zintegrowany system płatności i subskrypcji",
  "Skalowalna architektura cloud-native",
  "Potencjał B2B i B2C",
];

const useCases = [
  {
    title: "Konsumenci (B2C)",
    description: "Personalizowane figurki z własnych zdjęć na prezent, pamiątki, kolekcje",
    icon: Users,
  },
  {
    title: "Firmy (B2B)",
    description: "Maskotki firmowe, gadżety promocyjne, produkty brandowane",
    icon: Globe,
  },
  {
    title: "E-commerce",
    description: "Integracja z platformami sprzedażowymi, white-label dla sklepów",
    icon: TrendingUp,
  },
];

export default function Investors() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="container px-4 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Rocket className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Dla Inwestorów</span>
            </div>
            
            <h1 className="font-mono text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              FigureAI - Przyszłość{" "}
              <span className="gradient-text">Personalizacji 3D</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Rewolucjonizujemy sposób tworzenia spersonalizowanych figurek 3D. 
              Nasza platforma AI przekształca zwykłe zdjęcia w gotowe do druku modele 3D 
              w ciągu minut, nie godzin.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" asChild>
                <a href="mailto:kontakt@figureai.pl">
                  <Mail className="w-5 h-5" />
                  Skontaktuj się
                </a>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="/create">
                  Zobacz Demo
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Market Stats */}
        <section className="container px-4 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h2 className="font-mono text-2xl md:text-3xl font-bold text-center mb-12">
              Potencjał Rynkowy
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {marketStats.map((stat, index) => (
                <GlassCard key={index} className="p-6 text-center">
                  <div className="text-3xl md:text-4xl font-mono font-bold gradient-text mb-2">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground mb-2">{stat.label}</div>
                  <div className="inline-flex items-center gap-1 text-sm text-green-500">
                    <TrendingUp className="w-4 h-4" />
                    {stat.growth}
                  </div>
                </GlassCard>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Problem & Solution */}
        <section className="container px-4 mb-20">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <GlassCard className="p-8 h-full border-red-500/20">
                <h3 className="font-mono text-xl font-bold mb-4 text-red-400">Problem</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li>• Tworzenie modeli 3D wymaga specjalistycznych umiejętności</li>
                  <li>• Profesjonalne modelowanie kosztuje setki/tysiące złotych</li>
                  <li>• Proces trwa dni lub tygodnie</li>
                  <li>• Brak prostych narzędzi dla zwykłych użytkowników</li>
                  <li>• Wysoka bariera wejścia dla druku 3D</li>
                </ul>
              </GlassCard>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <GlassCard className="p-8 h-full border-green-500/20">
                <h3 className="font-mono text-xl font-bold mb-4 text-green-400">Rozwiązanie</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li>• Wystarczy jedno zdjęcie - AI robi resztę</li>
                  <li>• Przystępne ceny od kilkunastu złotych</li>
                  <li>• Model gotowy w minuty, nie dni</li>
                  <li>• Intuicyjny interfejs dla każdego</li>
                  <li>• Gotowe pliki STL do druku</li>
                </ul>
              </GlassCard>
            </motion.div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="container px-4 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <h2 className="font-mono text-2xl md:text-3xl font-bold text-center mb-12">
              Zastosowania
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {useCases.map((useCase, index) => (
                <GlassCard key={index} className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <useCase.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-mono text-lg font-bold mb-2">{useCase.title}</h3>
                  <p className="text-muted-foreground text-sm">{useCase.description}</p>
                </GlassCard>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Technology Stack */}
        <section className="container px-4 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <h2 className="font-mono text-2xl md:text-3xl font-bold text-center mb-4">
              Stos Technologiczny
            </h2>
            <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              Zbudowane na nowoczesnych, skalowalnych technologiach
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {technologies.map((tech, index) => (
                <GlassCard key={index} className="p-4 text-center">
                  <div className="font-mono text-sm font-bold mb-1">{tech.name}</div>
                  <div className="text-xs text-muted-foreground">{tech.description}</div>
                </GlassCard>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Competitive Advantages */}
        <section className="container px-4 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <h2 className="font-mono text-2xl md:text-3xl font-bold text-center mb-12">
              Przewagi Konkurencyjne
            </h2>
            <GlassCard className="p-8 max-w-3xl mx-auto">
              <div className="grid md:grid-cols-2 gap-4">
                {advantages.map((advantage, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{advantage}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </section>

        {/* Business Model */}
        <section className="container px-4 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <h2 className="font-mono text-2xl md:text-3xl font-bold text-center mb-12">
              Model Biznesowy
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <GlassCard className="p-6">
                <Printer className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-mono text-lg font-bold mb-2">Pay-per-Model</h3>
                <p className="text-muted-foreground text-sm">
                  Jednorazowe opłaty za wygenerowane modele. Idealne dla okazjonalnych użytkowników.
                </p>
              </GlassCard>
              
              <GlassCard className="p-6 border-primary/30">
                <Brain className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-mono text-lg font-bold mb-2">Subskrypcja Pro</h3>
                <p className="text-muted-foreground text-sm">
                  Miesięczny abonament z limitem modeli. Dla aktywnych twórców i małych firm.
                </p>
              </GlassCard>
              
              <GlassCard className="p-6">
                <Globe className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-mono text-lg font-bold mb-2">Enterprise API</h3>
                <p className="text-muted-foreground text-sm">
                  White-label i integracje API dla dużych klientów B2B.
                </p>
              </GlassCard>
            </div>
          </motion.div>
        </section>

        {/* CTA */}
        <section className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <GlassCard className="p-12 text-center bg-gradient-to-br from-primary/10 to-accent/10">
              <h2 className="font-mono text-2xl md:text-3xl font-bold mb-4">
                Zainteresowany współpracą?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Szukamy partnerów inwestycyjnych oraz firm deweloperskich 
                do dalszego rozwoju platformy. Skontaktuj się z nami.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="xl" asChild>
                  <a href="mailto:kontakt@figureai.pl">
                    <Mail className="w-5 h-5" />
                    kontakt@figureai.pl
                  </a>
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
