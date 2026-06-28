'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, QrCode, FormInput, ScanLine, ShieldCheck, Lock, EyeOff, FileHeart, Smartphone, Activity } from 'lucide-react'

export default function LandingContent() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="container max-w-6xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-heading mb-6 tracking-tight">
              Your Medical ID. <br />
              <span className="text-primary">In a QR Code.</span>
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
          >
            Paramedics scan. Your life-saving info appears instantly. No app. No login. Free.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/register" className="w-full sm:w-auto bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center hover:bg-primary/90 transition-colors shadow-[0_0_20px_rgba(255,45,45,0.4)]">
              Create Free MediLink <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <a href="#how-it-works" className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-lg border border-border hover:bg-secondary transition-colors">
              How It Works ↓
            </a>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-16 relative mx-auto w-64 h-64 md:w-80 md:h-80"
          >
            <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-3xl animate-pulse-slow"></div>
            <div className="relative bg-background border border-border rounded-3xl p-6 shadow-2xl flex flex-col items-center justify-center h-full">
              <QrCode className="w-full h-full text-primary opacity-80" />
            </div>
          </motion.div>
          
          <div className="mt-16 text-sm text-muted-foreground font-medium uppercase tracking-wider">
            Used by students, elderly, hikers, and travelers across India
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-20 bg-secondary/50 border-y border-border">
        <div className="container max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold font-heading text-center mb-16">
            In an emergency, every second counts.
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { stat: "16 Lakh+", text: "road accidents/year in India" },
              { stat: "75%", text: "victims are unconscious on arrival" },
              { stat: "0", text: "use for contact details on a locked phone" }
            ].map((item, i) => (
              <div key={i} className="glass-card text-center">
                <div className="text-4xl font-bold text-primary mb-2 font-heading">{item.stat}</div>
                <div className="text-muted-foreground">{item.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24">
        <div className="container max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold font-heading text-center mb-16">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-border -z-10"></div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-2xl bg-secondary border border-border flex items-center justify-center mb-6 z-10">
                <FormInput className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-heading">1. Fill your profile</h3>
              <p className="text-muted-foreground">Enter your blood group, allergies, conditions, and emergency contacts securely.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-2xl bg-secondary border border-border flex items-center justify-center mb-6 z-10">
                <QrCode className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-heading">2. Get your QR code</h3>
              <p className="text-muted-foreground">Print it, save it as your wallpaper, or order a physical ID card.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-2xl bg-secondary border border-border flex items-center justify-center mb-6 z-10">
                <ScanLine className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-heading">3. Instant scanning</h3>
              <p className="text-muted-foreground">Rescuers scan the QR and instantly see life-saving info. No app needed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-24 bg-secondary/30 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-primary/10 blur-[100px] -z-10 rounded-full"></div>
        
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <ShieldCheck className="h-16 w-16 text-primary mx-auto mb-6" />
          <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6">
            Military-Grade Security.
          </h2>
          <p className="text-xl text-muted-foreground mb-12">
            Your data is protected by AES-256 encryption, Supabase Row Level Security, dynamic tokenization, and zero third-party data sharing.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Lock, text: "AES-256 Encrypted" },
              { icon: ShieldCheck, text: "HTTPS Only" },
              { icon: EyeOff, text: "Privacy First" },
              { icon: FileHeart, text: "No Third-Party Ads" }
            ].map((Badge, i) => (
              <div key={i} className="flex flex-col items-center justify-center p-4 rounded-xl border border-border/50 bg-background/50 backdrop-blur">
                <Badge.icon className="h-8 w-8 text-muted-foreground mb-3" />
                <span className="text-sm font-medium">{Badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 relative">
        <div className="container max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold font-heading mb-8">
            Be Prepared. <br />Save a Life.
          </h2>
          <Link href="/register" className="inline-flex bg-primary text-primary-foreground px-10 py-5 rounded-2xl font-bold text-xl items-center justify-center hover:bg-primary/90 transition-colors shadow-[0_0_30px_rgba(255,45,45,0.4)] hover:scale-105 duration-200">
            Create your free MediLink <ArrowRight className="ml-3 h-6 w-6" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-muted-foreground text-sm">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Activity className="h-5 w-5 text-primary" />
            <span className="font-heading font-bold text-foreground">MediLink</span>
            <span>— Emergency Medical Identity System</span>
          </div>
          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
            <Link href="/contact" className="hover:text-foreground">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
