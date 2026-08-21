import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Compass, FileCheck, Layers, Sparkles, Database } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-blue-600/30">
      {/* Navbar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between border-b border-zinc-800/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="font-semibold text-lg text-zinc-100 tracking-tight">CBIP</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/discover">
            <Button variant="ghost" size="sm">
              Explore Schemes
            </Button>
          </Link>
          <Link to="/onboarding">
            <Button variant="primary" size="sm">
              Check Your Eligibility
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-16 md:py-24 flex flex-col items-center text-center">
        <Badge variant="ai" className="mb-6 px-3 py-1 text-xs gap-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Smart India Hackathon 2026 Prototype — Team ARHA</span>
        </Badge>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-zinc-100 max-w-4xl leading-tight">
          Citizen Benefits Intelligence Platform
        </h1>

        <p className="mt-6 text-lg md:text-xl text-zinc-400 max-w-2xl font-normal leading-relaxed">
          Understand the schemes you&apos;re eligible for. Know what evidence you need. Stay application-ready.
        </p>

        {/* Tagline */}
        <div className="mt-8 px-4 py-2 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-300 font-mono-code text-xs md:text-sm tracking-wider">
          Discover → Understand → Verify → Stay Ready
        </div>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <Link to="/onboarding">
            <Button variant="primary" size="lg" className="gap-2 shadow-lg shadow-blue-900/20">
              <span>Check Your Eligibility</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>

          <Link to="/discover">
            <Button variant="outline" size="lg" className="gap-2">
              <Compass className="w-4 h-4" />
              <span>Explore How It Works</span>
            </Button>
          </Link>
        </div>

        {/* Spatial System Flow Representation */}
        <div className="mt-20 w-full max-w-4xl bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 md:p-8 backdrop-blur-md">
          <div className="text-xs uppercase font-mono-code text-zinc-500 tracking-widest mb-6">
            System Separation Architecture
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="text-left bg-zinc-950/80 border-zinc-800/80">
              <div className="text-blue-400 mb-2 font-mono-code text-xs font-semibold">01. PROFILE</div>
              <h4 className="font-medium text-sm text-zinc-200">Citizen Profile</h4>
              <p className="text-xs text-zinc-400 mt-1">Verified demographics, location, and economic attributes.</p>
            </Card>

            <Card className="text-left bg-zinc-950/80 border-zinc-800/80">
              <div className="text-indigo-400 mb-2 font-mono-code text-xs font-semibold">02. AI RAG</div>
              <h4 className="font-medium text-sm text-zinc-200">AI Context & NLU</h4>
              <p className="text-xs text-zinc-400 mt-1">Grounded explanations backed by gazette citations.</p>
            </Card>

            <Card className="text-left bg-zinc-950/80 border-zinc-800/80">
              <div className="text-emerald-400 mb-2 font-mono-code text-xs font-semibold">03. ENGINE</div>
              <h4 className="font-medium text-sm text-zinc-200">Eligibility Engine</h4>
              <p className="text-xs text-zinc-400 mt-1">Deterministic AST rule evaluation into 4 explicit states.</p>
            </Card>

            <Card className="text-left bg-zinc-950/80 border-zinc-800/80">
              <div className="text-amber-400 mb-2 font-mono-code text-xs font-semibold">04. VERIFY</div>
              <h4 className="font-medium text-sm text-zinc-200">Evidence Trust</h4>
              <p className="text-xs text-zinc-400 mt-1">Document verification lifecycle & expiration alerts.</p>
            </Card>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left w-full">
          <Card>
            <Database className="w-5 h-5 text-blue-400 mb-3" />
            <h3 className="font-semibold text-zinc-200 text-base mb-1">Deterministic Rule Evaluation</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Rules are evaluated deterministically using Pydantic AST models. LLMs never invent eligibility outcomes.
            </p>
          </Card>

          <Card>
            <FileCheck className="w-5 h-5 text-emerald-400 mb-3" />
            <h3 className="font-semibold text-zinc-200 text-base mb-1">Document Intelligence</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Differentiates extracted OCR metadata from verified document authority trust states.
            </p>
          </Card>

          <Card>
            <Layers className="w-5 h-5 text-indigo-400 mb-3" />
            <h3 className="font-semibold text-zinc-200 text-base mb-1">Application Readiness</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Provides checklists, missing evidence warnings, and links to official government application channels.
            </p>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-800/60 py-6 text-center text-xs text-zinc-500">
        CBIP Prototype — Smart India Hackathon 2026 — Team ARHA
      </footer>
    </div>
  );
};
