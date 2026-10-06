export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-text-main">Settings</h1>
        <p className="text-text-muted mt-1">Manage your OmniSense workspace settings.</p>
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div><p className="font-bold text-text-main">Workspace</p><p className="text-sm text-text-muted">OmniSense Pro</p></div>
          <span className="text-sm font-semibold text-emerald-600">Active</span>
        </div>
        <div className="flex items-center justify-between">
          <div><p className="font-bold text-text-main">AI Status</p><p className="text-sm text-text-muted">Backend-connected analysis services</p></div>
          <span className="text-sm font-semibold text-primary">Ready</span>
        </div>
      </div>
    </div>
  );
}
