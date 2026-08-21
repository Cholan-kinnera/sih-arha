import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, FileText, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { StatCard } from '../components/shared/StatCard';
import { StatusBadge } from '../components/shared/StatusBadge';
import { useCitizenProfile } from '../hooks/useCitizenProfile';
import { useSchemes } from '../hooks/useSchemes';
import { useDocuments } from '../hooks/useDocuments';
import { useReadiness } from '../hooks/useReadiness';

export const DashboardPage: React.FC = () => {
  const { profile, isLoading: isProfileLoading } = useCitizenProfile();
  const { data: schemes, isLoading: isSchemesLoading } = useSchemes();
  const { documents, isLoading: isDocsLoading } = useDocuments();
  const { data: readinessList, isLoading: isReadinessLoading } = useReadiness();

  if (isProfileLoading || isSchemesLoading || isDocsLoading || isReadinessLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-zinc-400 space-y-3">
        <Sparkles className="w-8 h-8 text-blue-500 animate-pulse" />
        <p className="text-sm font-mono-code">Loading citizen intelligence dashboard...</p>
      </div>
    );
  }

  const verifiedDocsCount = documents.filter((d) => d.status === 'VERIFIED').length;
  const pendingDocsCount = documents.filter((d) => d.status === 'PROCESSING' || d.status === 'UPLOADED').length;
  const primaryReadiness = readinessList && readinessList.length > 0 ? readinessList[0] : null;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Welcome, {profile?.fullName || 'Citizen'}</h1>
          <p className="text-xs text-zinc-400 mt-1">
            {profile?.occupation} • {profile?.district}, {profile?.state} • Annual Income: ₹{profile?.annualFamilyIncome.toLocaleString('en-IN')}
          </p>
        </div>

        <Link to="/onboarding">
          <Button variant="outline" size="sm" className="gap-2 text-xs">
            <span>Update Profile</span>
          </Button>
        </Link>
      </div>

      {/* Primary Recommended Next Action Banner */}
      <Card className="bg-gradient-to-r from-blue-950/40 via-zinc-900 to-zinc-900 border-blue-500/30 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Badge variant="warning" className="text-[11px]">RECOMMENDED ACTION</Badge>
              <span className="text-xs font-mono-code text-zinc-400">Target: SHEFAS 2026</span>
            </div>
            <h2 className="text-lg font-bold text-zinc-100">
              Verify Annual Income Certificate to unlock ₹40,000 grant eligibility
            </h2>
            <p className="text-xs text-zinc-400 max-w-xl">
              Your age and Karnataka domicile are verified. Complete income certificate verification to reach full application readiness.
            </p>
          </div>

          <Link to="/verification">
            <Button variant="primary" size="md" className="gap-2 shadow-lg shadow-blue-900/30 shrink-0">
              <span>Inspect Verification</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </Card>

      {/* Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Matched Schemes"
          value={schemes?.length || 0}
          subtext="Personalized to your profile"
          icon={Compass}
          variant="blue"
        />
        <StatCard
          label="Verified Evidence"
          value={verifiedDocsCount}
          subtext="Official documents on file"
          icon={CheckCircle2}
          variant="emerald"
        />
        <StatCard
          label="Pending Evidence"
          value={pendingDocsCount}
          subtext="Under inspection"
          icon={AlertCircle}
          variant="amber"
        />
        <StatCard
          label="Application Readiness"
          value={primaryReadiness?.status === 'PARTIALLY_READY' ? 'Partially Ready' : 'Ready'}
          subtext="1 pending document"
          icon={ShieldCheck}
          variant="blue"
        />
      </div>

      {/* Main Content Grid: Schemes vs Readiness */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Scheme Matches */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-base text-zinc-200">Personalized Scheme Opportunities</h3>
            <Link to="/discover" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
              View All Schemes →
            </Link>
          </div>

          <div className="space-y-4">
            {schemes?.map((scheme) => (
              <Card key={scheme.id} className="space-y-4 hover:border-zinc-700 transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono-code text-blue-400 font-medium">{scheme.code}</span>
                      <Badge variant="neutral" className="text-[10px]">{scheme.category}</Badge>
                    </div>
                    <h4 className="font-bold text-base text-zinc-100 mt-1">{scheme.name}</h4>
                  </div>
                  <StatusBadge state="POTENTIALLY_ELIGIBLE" />
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed">{scheme.description}</p>

                {scheme.matchReason && (
                  <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-lg p-3 text-xs text-zinc-300">
                    <span className="font-semibold text-blue-400">Why matched: </span>
                    {scheme.matchReason}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60">
                  <div className="text-xs font-medium text-emerald-400">
                    Grant: ₹{scheme.benefits[0]?.amountMin?.toLocaleString('en-IN')} / year
                  </div>

                  <Link to={`/schemes/${scheme.id}`}>
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                      <span>View Analysis & Rules</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Col: Evidence & Verification Checklist */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-base text-zinc-200">Evidence Status</h3>
            <Link to="/documents" className="text-xs text-blue-400 hover:text-blue-300">
              Manage Docs →
            </Link>
          </div>

          <Card className="space-y-4">
            <div className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono-code">
              Document Checklist
            </div>

            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-start justify-between gap-3 text-xs p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/60">
                  <div className="space-y-0.5">
                    <div className="font-medium text-zinc-200">{doc.documentName}</div>
                    <div className="text-[11px] text-zinc-500 font-mono-code">{doc.documentType}</div>
                  </div>

                  <Badge variant={doc.status === 'VERIFIED' ? 'success' : 'warning'} className="text-[10px]">
                    {doc.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
