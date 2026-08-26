import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mb-4">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h1 className="text-xl font-bold text-slate-900 mb-1">Page Not Found</h1>
      <p className="text-xs text-slate-500 max-w-sm mb-6">
        The requested monitoring route or catchment view does not exist.
      </p>
      <Link to="/overview">
        <Button variant="primary" size="md">
          Return to Overview
        </Button>
      </Link>
    </div>
  );
};
