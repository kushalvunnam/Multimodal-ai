import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { 
  User, Briefcase, GraduationCap, MapPin, UserCheck, 
  Edit, Save, X, Settings as SettingsIcon, AlertCircle, Wrench, FileText
} from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const defaultProfile = {
    name: user?.name || 'User',
    role: 'User',
    education: 'B.Tech — Malla Reddy Vishwavidyapeeth',
    location: '',
    experience: '',
    skills: '',
    summary: ''
  };

  const [profile, setProfile] = useState(defaultProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(defaultProfile);
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('omnisense_profile_' + (user?.id || 'default'));
    if (saved) {
      try {
        setProfile(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse profile data");
      }
    }
  }, []);

  const handleEditClick = () => {
    setEditForm(profile);
    setError('');
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditForm(profile);
    setError('');
    setIsEditing(false);
  };

  const handleSave = () => {
    if (!editForm.name.trim() || !editForm.role.trim()) {
      setError('Name and Role are required.');
      return;
    }
    setProfile(editForm);
    localStorage.setItem('omnisense_profile_' + (user?.id || 'default'), JSON.stringify(editForm));
    setError('');
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const skillsList = profile.skills.split(',').map(s => s.trim()).filter(s => s.length > 0);

  return (
    <div className="space-y-8 max-w-5xl pb-16">
      <div>
        <h1 className="text-3xl font-extrabold text-text-main">Settings</h1>
        <p className="text-text-muted mt-1">Manage your OmniSense workspace settings and personal profile.</p>
      </div>
      
      {/* Existing Workspace / AI Status Card */}
      <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-2 h-full bg-indigo-500"></div>
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div><p className="font-bold text-text-main flex items-center"><SettingsIcon className="w-4 h-4 mr-2 text-indigo-500"/> Workspace</p><p className="text-sm text-text-muted">OmniSense Pro</p></div>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold border border-emerald-100">Active</span>
        </div>
        <div className="flex items-center justify-between">
          <div><p className="font-bold text-text-main flex items-center"><UserCheck className="w-4 h-4 mr-2 text-indigo-500"/> AI Status</p><p className="text-sm text-text-muted">Backend-connected analysis services</p></div>
          <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold border border-indigo-100">Ready</span>
        </div>
      </div>

      {/* Profile Details Card */}
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden relative">
        <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Profile Details</h2>
            <p className="text-sm text-slate-500 font-medium mt-1">Manage your personal and professional information.</p>
          </div>
          {!isEditing && (
            <button 
              onClick={handleEditClick} 
              className="bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:shadow-md transition-all flex items-center shrink-0 ml-4"
            >
              <Edit className="w-4 h-4 mr-2" /> Edit Profile
            </button>
          )}
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center text-sm font-bold text-rose-600">
              <AlertCircle className="w-4 h-4 mr-2" /> {error}
            </div>
          )}

          {!isEditing ? (
            <div className="space-y-8">
              {/* Grid 2-columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-start">
                  <div className="bg-indigo-50 p-2.5 rounded-xl mr-4"><User className="w-5 h-5 text-indigo-600" /></div>
                  <div><p className="text-xs font-black tracking-widest text-slate-400 uppercase mb-1">Full Name</p><p className="font-bold text-slate-800 text-base">{profile.name}</p></div>
                </div>
                <div className="flex items-start">
                  <div className="bg-indigo-50 p-2.5 rounded-xl mr-4"><Briefcase className="w-5 h-5 text-indigo-600" /></div>
                  <div><p className="text-xs font-black tracking-widest text-slate-400 uppercase mb-1">Role</p><p className="font-bold text-slate-800 text-base">{profile.role}</p></div>
                </div>
                <div className="flex items-start">
                  <div className="bg-indigo-50 p-2.5 rounded-xl mr-4"><GraduationCap className="w-5 h-5 text-indigo-600" /></div>
                  <div><p className="text-xs font-black tracking-widest text-slate-400 uppercase mb-1">Education</p><p className="font-bold text-slate-800 text-base">{profile.education}</p></div>
                </div>
                <div className="flex items-start">
                  <div className="bg-indigo-50 p-2.5 rounded-xl mr-4"><MapPin className="w-5 h-5 text-indigo-600" /></div>
                  <div><p className="text-xs font-black tracking-widest text-slate-400 uppercase mb-1">Location</p><p className="font-bold text-slate-800 text-base">{profile.location}</p></div>
                </div>
                <div className="flex items-start">
                  <div className="bg-indigo-50 p-2.5 rounded-xl mr-4"><UserCheck className="w-5 h-5 text-indigo-600" /></div>
                  <div><p className="text-xs font-black tracking-widest text-slate-400 uppercase mb-1">Experience</p><p className="font-bold text-slate-800 text-base">{profile.experience}</p></div>
                </div>
              </div>

              {/* Skills */}
              <div className="border-t border-slate-100 pt-6">
                <div className="flex items-center mb-4"><Wrench className="w-4 h-4 mr-2 text-indigo-400" /><h3 className="text-sm font-black tracking-widest text-slate-400 uppercase">Skills</h3></div>
                <div className="flex flex-wrap gap-2">
                  {skillsList.map((skill, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold shadow-sm">
                      {skill}
                    </span>
                  ))}
                  {skillsList.length === 0 && <span className="text-sm text-slate-400 italic">No skills listed.</span>}
                </div>
              </div>

              {/* Profile Summary */}
              <div className="border-t border-slate-100 pt-6">
                <div className="flex items-center mb-4"><FileText className="w-4 h-4 mr-2 text-indigo-400" /><h3 className="text-sm font-black tracking-widest text-slate-400 uppercase">Profile Summary</h3></div>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 shadow-inner">
                  <p className="text-slate-700 leading-relaxed font-medium text-sm whitespace-pre-wrap">{profile.summary || "No summary provided."}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Edit Mode */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Full Name <span className="text-rose-500">*</span></label>
                  <input type="text" name="name" value={editForm.name} onChange={handleChange} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all bg-slate-50 focus:bg-white" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Role <span className="text-rose-500">*</span></label>
                  <input type="text" name="role" value={editForm.role} onChange={handleChange} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all bg-slate-50 focus:bg-white" placeholder="Frontend Developer" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Education</label>
                  <input type="text" name="education" value={editForm.education} onChange={handleChange} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all bg-slate-50 focus:bg-white" placeholder="B.Tech..." />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Location</label>
                  <input type="text" name="location" value={editForm.location} onChange={handleChange} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all bg-slate-50 focus:bg-white" placeholder="City, Country" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Experience</label>
                  <input type="text" name="experience" value={editForm.experience} onChange={handleChange} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all bg-slate-50 focus:bg-white" placeholder="Fresher / 5 Years" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Skills (comma separated)</label>
                  <input type="text" name="skills" value={editForm.skills} onChange={handleChange} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all bg-slate-50 focus:bg-white" placeholder="React.js, Node.js..." />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Profile Summary</label>
                  <textarea name="summary" value={editForm.summary} onChange={handleChange} rows="4" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all bg-slate-50 focus:bg-white resize-none" placeholder="Brief summary about yourself..."></textarea>
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button onClick={handleCancel} className="px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors flex items-center text-sm">
                  <X className="w-4 h-4 mr-2" /> Cancel
                </button>
                <button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center text-sm">
                  <Save className="w-4 h-4 mr-2" /> Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}







