import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import PageMeta from '../components/PageMeta';

export default function NotFoundPage() {
  return (
    <div className="bg-[#F7FAFC] min-h-[60vh] flex items-center justify-center py-20 px-4">
      <PageMeta
        title="Page Not Found"
        description="The requested page could not be found. Return to Valora Healthcare home."
      />

      <div className="text-center max-w-md space-y-6 bg-white p-10 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="text-4xl font-extrabold text-[#087F8C] font-mono">
          404
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-[#16324F]">
            Page Not Found
          </h1>
          <p className="text-sm text-[#526273]">
            The healthcare staffing page or resource you are looking for doesn't exist or has moved.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#087F8C] hover:bg-[#076f7a] rounded-xl shadow-xs transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
          <Link
            to="/staffing-services"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-[#16324F] bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>View Services</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
