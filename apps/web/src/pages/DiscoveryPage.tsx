import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ArrowRight, AlertTriangle, CheckCircle2, Building, Sparkles } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { StatusBadge } from '../components/shared/StatusBadge';
import { SourceCitation } from '../components/shared/SourceCitation';
import { useSchemes } from '../hooks/useSchemes';

export const DiscoveryPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const { data: schemes, isLoading, isError } = useSchemes({
    query: searchQuery,
    category: selectedCategory === 'ALL' ? undefined : selectedCategory,
  });

  const categories = [
    { key: 'ALL', label: 'All Schemes' },
    { key: 'SCHOLARSHIP', label: 'Scholarships' },
    { key: 'EDUCATION', label: 'Skill & Education' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Personalized Scheme Discovery</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Explore government welfare schemes matched against your verified profile attributes and eligibility criteria.
        </p>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="space-y-4">
        <div className="relative">
          <Input
            placeholder="Search by scheme name, keyword, or ministry..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 text-sm"
          />
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Filter className="w-4 h-4 text-zinc-500 shrink-0 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                selectedCategory === cat.key
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40'
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="text-xs font-mono-code text-zinc-400">
        Found {schemes?.length || 0} matched scheme{schemes?.length === 1 ? '' : 's'}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16 text-zinc-400 space-y-3">
          <Sparkles className="w-6 h-6 text-blue-500 animate-spin" />
          <p className="text-xs font-mono-code">Searching scheme knowledge base...</p>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <Card className="border-red-500/30 bg-red-950/20 p-6 text-center text-red-400 text-xs">
          Unable to fetch scheme data. Please ensure the mock service registry is online.
        </Card>
      )}

      {/* Empty State */}
      {!isLoading && schemes?.length === 0 && (
        <Card className="p-12 text-center space-y-3">
          <p className="text-sm font-semibold text-zinc-300">No schemes matched your search criteria.</p>
          <p className="text-xs text-zinc-500">Try adjusting your category filter or search keywords.</p>
          <Button variant="outline" size="sm" onClick={() => { setSearchQuery(''); setSelectedCategory('ALL'); }}>
            Reset Filters
          </Button>
        </Card>
      )}

      {/* Scheme Cards Grid */}
      <div className="space-y-6">
        {schemes?.map((scheme) => (
          <Card key={scheme.id} className="p-6 space-y-5 hover:border-zinc-700 transition-all">
            {/* Card Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono-code text-blue-400 font-semibold">{scheme.code}</span>
                  <Badge variant="neutral" className="text-[10px]">{scheme.category}</Badge>
                </div>
                <h2 className="text-lg font-bold text-zinc-100">{scheme.name}</h2>
                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <Building className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{scheme.ministry} • {scheme.department}</span>
                </div>
              </div>

              <StatusBadge state="POTENTIALLY_ELIGIBLE" />
            </div>

            {/* Description & Objective */}
            <p className="text-xs text-zinc-300 leading-relaxed">{scheme.description}</p>

            {/* Explainable Match Reason */}
            <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-4 space-y-2 text-xs">
              <div className="font-semibold text-zinc-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Explainable Match Evaluation</span>
              </div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                {scheme.matchReason}
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-zinc-400">
                <span className="text-emerald-400 font-medium">✓ Age Range (17-25)</span>
                <span>•</span>
                <span className="text-emerald-400 font-medium">✓ Domicile (Karnataka)</span>
                <span>•</span>
                <span className="text-amber-400 font-medium">⚠ Income Evidence Pending</span>
              </div>
            </div>

            {/* Footer Row: Benefit Amount, Source Citation, & CTA */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-zinc-800">
              <div className="space-y-1">
                <div className="text-[11px] text-zinc-400 uppercase tracking-wider font-mono-code">Benefit Value</div>
                <div className="text-sm font-bold text-emerald-400">
                  ₹{scheme.benefits[0]?.amountMin?.toLocaleString('en-IN')} / {scheme.benefits[0]?.frequency.toLowerCase()}
                </div>
              </div>

              {scheme.sources[0] && <SourceCitation source={scheme.sources[0]} />}

              <Link to={`/schemes/${scheme.id}`}>
                <Button variant="primary" size="sm" className="gap-2 text-xs shrink-0">
                  <span>Inspect Scheme Analysis</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
