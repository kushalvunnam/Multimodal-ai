import { Link } from 'react-router-dom';

export default function Reports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-text-main">Reports</h1>
        <p className="text-text-muted mt-1">Access generated OmniSense reports and exports.</p>
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
        <p className="text-text-muted">Generated reports will appear here after an analysis is completed.</p>
        <Link to="/analysis/new" className="inline-flex mt-5 bg-primary text-white px-5 py-2.5 rounded-xl font-bold">Create Analysis</Link>
      </div>
    </div>
  );
}
