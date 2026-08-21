import React from 'react';
import { Card } from '../components/ui/Card';

export const OnboardingPage: React.FC = () => (
  <div className="space-y-4">
    <h1 className="text-2xl font-bold text-zinc-100 font-sans">Citizen Profile Onboarding</h1>
    <Card><p className="text-xs text-zinc-400">Onboarding form ready for Phase 2 implementation.</p></Card>
  </div>
);

export const DashboardPage: React.FC = () => (
  <div className="space-y-4">
    <h1 className="text-2xl font-bold text-zinc-100 font-sans">Citizen Dashboard</h1>
    <Card><p className="text-xs text-zinc-400">Dashboard views ready for Phase 2 implementation.</p></Card>
  </div>
);

export const DiscoveryPage: React.FC = () => (
  <div className="space-y-4">
    <h1 className="text-2xl font-bold text-zinc-100 font-sans">Scheme Discovery</h1>
    <Card><p className="text-xs text-zinc-400">Discovery filters & search ready for Phase 2 implementation.</p></Card>
  </div>
);

export const SchemeDetailPage: React.FC = () => (
  <div className="space-y-4">
    <h1 className="text-2xl font-bold text-zinc-100 font-sans">Scheme Detail</h1>
    <Card><p className="text-xs text-zinc-400">Split official info vs AI explanation ready for Phase 3 implementation.</p></Card>
  </div>
);

export const EligibilityPage: React.FC = () => (
  <div className="space-y-4">
    <h1 className="text-2xl font-bold text-zinc-100 font-sans">Eligibility Analysis (Hero Demo)</h1>
    <Card><p className="text-xs text-zinc-400">Deterministic AST rule evaluator centerpiece ready for Phase 3 implementation.</p></Card>
  </div>
);

export const DocumentsPage: React.FC = () => (
  <div className="space-y-4">
    <h1 className="text-2xl font-bold text-zinc-100 font-sans">Document Intelligence</h1>
    <Card><p className="text-xs text-zinc-400">OCR & extracted evidence inspector ready for Phase 4 implementation.</p></Card>
  </div>
);

export const VerificationPage: React.FC = () => (
  <div className="space-y-4">
    <h1 className="text-2xl font-bold text-zinc-100 font-sans">Verification Timeline</h1>
    <Card><p className="text-xs text-zinc-400">DigiLocker mock provider & verification timeline ready for Phase 4 implementation.</p></Card>
  </div>
);

export const ReadinessPage: React.FC = () => (
  <div className="space-y-4">
    <h1 className="text-2xl font-bold text-zinc-100 font-sans">Application Readiness</h1>
    <Card><p className="text-xs text-zinc-400">Checklist & official portal links ready for Phase 5 implementation.</p></Card>
  </div>
);
