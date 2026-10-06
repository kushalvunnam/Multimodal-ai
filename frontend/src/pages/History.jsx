import { Link } from 'react-router-dom';

export default function History() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-text-main">History</h1>
        <p className="text-text-muted mt-1">View your previous OmniSense analyses.</p>
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
        <p className="text-text-muted">Your analysis history will appear here.</p>
        <Link to="/analysis/new" className="inline-flex mt-5 bg-primary text-white px-5 py-2.5 rounded-xl font-bold">New Analysis</Link>
      </div>
    </div>
  );
}
