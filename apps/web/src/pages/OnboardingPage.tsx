import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const OnboardingPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Citizen Profile Onboarding</h1>
        <p className="text-sm text-zinc-400 mt-1">Configure demographic and socio-economic attributes for eligibility evaluation.</p>
      </div>

      <Card>
        <p className="text-xs text-zinc-400">Onboarding form ready for Phase 2 implementation.</p>
      </Card>
    </div>
  );
};
