import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  User,
  GraduationCap,
  Briefcase,
  Code,
  Award,
  Globe,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Edit3,
  Download,
  Save,
  X,
  Plus,
  Trash2,
  Camera
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { getCurrentUser, updateUserProfile } from '../utils/userData';

// --- Helper Components ---

const InfoRow = ({ icon: Icon, label, value, isEditing, onChange, type = "text", isLink = false }) => (
  <div className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
    <div className="mt-1 text-[#2C5F34] bg-green-50 p-2 rounded-full">
      <Icon size={16} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">{label}</p>
      {isEditing ? (
        <input
          type={type}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border-b border-gray-300 focus:border-[#2C5F34] outline-none py-0.5 bg-transparent text-gray-800 text-sm"
          placeholder={`Enter ${label}`}
        />
      ) : (
        <div className="text-sm font-medium text-gray-900 truncate">
          {value ? (
            isLink ? (
              <a href={value.startsWith('http') ? value : `https://${value}`} target="_blank" rel="noopener noreferrer" className="text-[#2C5F34] hover:underline">
                {value.replace(/^https?:\/\//, '')}
              </a>
            ) : value
          ) : (
            <span className="text-gray-400 italic">Not provided</span>
          )}
        </div>
      )}
    </div>
  </div>
);

const SkillGroup = ({ title, skills = [], isEditing, onRemove, onAdd }) => {
  const [newSkill, setNewSkill] = useState('');

  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider border-b border-gray-100 pb-1">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#f0f9f4] text-[#1b4332] border border-[#2C5F34]/20"
          >
            {skill}
            {isEditing && (
              <button onClick={() => onRemove(index)} className="ml-2 text-red-400 hover:text-red-600">
                <X size={12} />
              </button>
            )}
          </span>
        ))}
        {skills.length === 0 && !isEditing && <span className="text-gray-400 text-xs italic">No {title.toLowerCase()} added</span>}
      </div>

      {isEditing && (
        <div className="mt-2 flex items-center space-x-2">
          <input
            type="text"
            placeholder={`Add ${title}...`}
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && newSkill.trim()) {
                onAdd(newSkill.trim());
                setNewSkill('');
              }
            }}
            className="text-xs border border-gray-300 rounded px-2 py-1 outline-none focus:border-[#2C5F34]"
          />
          <button
            onClick={() => {
              if (newSkill.trim()) {
                onAdd(newSkill.trim());
                setNewSkill('');
              }
            }}
            className="p-1 bg-[#2C5F34] text-white rounded hover:bg-[#1E4323]"
          >
            <Plus size={14} />
          </button>
        </div>
      )}
    </div>
  );
};


const StudentProfile = ({ onSectionChange }) => {
  const { addToast } = useToast();

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString + '-01'); // Append day to make it parseable
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userData, setUserData] = useState({
    personal: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: '',
      location: '',
      linkedinUrl: '',
      githubUrl: '',
      portfolioUrl: '',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    education: [],
    experience: [],
    projects: [],
    skills: {
      technical: [],
      languages: [],
      soft: []
    },
    certifications: [],
    achievements: []
  });

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      if (currentUser && currentUser.profile) {
        // Split experience into jobs and internships
        const allExperience = currentUser.profile.experience || [];
        const internships = allExperience.filter(item => item.type === 'Internship');
        const jobs = allExperience.filter(item => item.type !== 'Internship');

        setUserData({
          ...currentUser.profile,
          personal: {
            ...currentUser.profile.personal,
            email: currentUser.email || currentUser.profile?.personal?.email
          },
          experience: jobs,
          internships: internships
        });
      }
    };
    fetchUser();
  }, []);

  const handleInputChange = (section, field, value) => {
    setUserData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleArrayChange = (section, index, field, value) => {
    setUserData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addArrayItem = (section, template) => {
    setUserData(prev => ({
      ...prev,
      [section]: [...prev[section], template]
    }));
  };

  const removeArrayItem = (section, index) => {
    setUserData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const addSkill = (category, skill) => {
    if (skill.trim()) {
      setUserData(prev => ({
        ...prev,
        skills: {
          ...prev.skills,
          [category]: [...(prev.skills[category] || []), skill.trim()]
        }
      }));
    }
  };

  const removeSkill = (category, index) => {
    setUserData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: (prev.skills[category] || []).filter((_, i) => i !== index)
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        const success = await updateUserProfile(currentUser.email, userData);
        if (success) {
          setIsEditing(false);
          addToast('Profile saved successfully!', 'success');
        } else {
          addToast('Failed to save profile. Please try again.', 'error');
        }
      }
    } catch (error) {
      addToast('Error saving profile. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = async () => {
    const currentUser = await getCurrentUser();
    if (currentUser && currentUser.profile) {
      setUserData(currentUser.profile);
    }
    setIsEditing(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        addToast('Image size should be less than 5MB', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        handleInputChange('personal', 'avatar', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    // Default avatar
    const defaultAvatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face';
    handleInputChange('personal', 'avatar', defaultAvatar);
    addToast('Profile photo removed', 'info');
  };

  const handleExportPDF = async () => {
    const input = document.getElementById('student-profile-content');
    if (!input) {
      addToast('Profile content not found', 'error');
      return;
    }

    try {
      addToast('Generating PDF... Please wait.', 'info');

      // Dynamic Script Loading Helper
      const loadScript = (src) => {
        return new Promise((resolve, reject) => {
          if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
          }
          const script = document.createElement('script');
          script.src = src;
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      };

      // Ensure libraries are loaded
      if (!window.html2canvas || !window.jspdf) {
        await Promise.all([
          loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'),
          loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js')
        ]);

        // Wait for scripts to initialize
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const html2canvas = window.html2canvas;
      const jspdf = window.jspdf;

      if (!html2canvas || !jspdf) {
        throw new Error('PDF libraries failed to load');
      }

      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#F3F4F6'
      });

      const imgData = canvas.toDataURL('image/png');
      const { jsPDF } = jspdf;
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Calculate height based on ratio to fit width
      const imgH = canvas.height * (pdfWidth / canvas.width);

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgH);
      pdf.save(`${userData?.personal?.firstName || 'Student'}_Profile.pdf`);
      addToast('PDF downloaded successfully!', 'success');
    } catch (error) {
      console.error(error);
      addToast('Failed to generate PDF. Please try again.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Top Decoration Banner */}
      <div className="h-48 bg-gradient-to-r from-[#1b4332] to-[#2d6a4f] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>

        {/* Navigation / Header Actions */}
        <div className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-start relative z-10">
          <button
            onClick={() => onSectionChange('dashboard')}
            className="flex items-center space-x-2 text-white/90 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm transition-all"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </button>

          <div className="flex items-center space-x-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 backdrop-blur-md transition-all border border-white/10"
                >
                  <X size={18} />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center space-x-2 bg-[#FFD700] text-[#1E293B] px-4 py-2 rounded-lg hover:bg-[#FCD34D] shadow-lg shadow-orange-500/20 transition-all font-semibold"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 backdrop-blur-md transition-all border border-white/20"
                >
                  <Edit3 size={18} />
                  <span>Edit Profile</span>
                </button>
                <button
                  onClick={handleExportPDF}
                  className="flex items-center space-x-2 bg-white text-[#2C5F34] px-4 py-2 rounded-lg hover:bg-gray-100 shadow-lg transition-all font-medium"
                >
                  <Download size={18} />
                  <span>Export PDF</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-12 -mt-20 relative z-20" id="student-profile-content">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column - Personal Info (Floating Card) */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
            >
              <div className="p-6 text-center border-b border-gray-50">
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full p-1 bg-white shadow-lg mx-auto mb-4 relative z-10">
                    <img
                      src={userData.personal.avatar}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  {isEditing && (
                    <div className="absolute bottom-4 right-0 z-20 flex space-x-1">
                      <label className="p-2 bg-[#2C5F34] text-white rounded-full cursor-pointer hover:bg-[#1E4323] transition-colors shadow-md">
                        <Camera size={14} />
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                      </label>
                      <button onClick={handleRemovePhoto} className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors shadow-md">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-2 max-w-xs mx-auto">
                    <input
                      type="text"
                      value={userData.personal.firstName}
                      onChange={(e) => handleInputChange('personal', 'firstName', e.target.value)}
                      className="w-full text-center text-xl font-bold border-b border-gray-300 focus:border-[#2C5F34] outline-none py-1 bg-transparent placeholder-gray-400"
                      placeholder="First Name"
                    />
                    <input
                      type="text"
                      value={userData.personal.lastName}
                      onChange={(e) => handleInputChange('personal', 'lastName', e.target.value)}
                      className="w-full text-center text-xl font-bold border-b border-gray-300 focus:border-[#2C5F34] outline-none py-1 bg-transparent placeholder-gray-400"
                      placeholder="Last Name"
                    />
                    <input
                      type="text"
                      value={userData.personal.headline || ''}
                      onChange={(e) => handleInputChange('personal', 'headline', e.target.value)}
                      className="w-full text-center text-sm text-gray-500 border-b border-gray-200 focus:border-[#2C5F34] outline-none py-1"
                      placeholder="Add a headline (e.g. CS Student)"
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {userData.personal.firstName} {userData.personal.lastName}
                    </h2>
                    <p className="text-[#2C5F34] font-medium">{userData.personal.headline || 'Student'}</p>
                  </>
                )}
              </div>

              <div className="p-6 space-y-5">
                <div className="space-y-4">
                  <InfoRow
                    icon={Mail}
                    label="Email"
                    value={userData.personal.email}
                    isEditing={isEditing}
                    onChange={(val) => handleInputChange('personal', 'email', val)}
                    type="email"
                  />
                  <InfoRow
                    icon={Phone}
                    label="Phone"
                    value={userData.personal.phone}
                    isEditing={isEditing}
                    onChange={(val) => handleInputChange('personal', 'phone', val)}
                    type="tel"
                  />
                  <InfoRow
                    icon={MapPin}
                    label="Location"
                    value={userData.personal.location}
                    isEditing={isEditing}
                    onChange={(val) => handleInputChange('personal', 'location', val)}
                  />
                  <InfoRow
                    icon={ExternalLink}
                    label="LinkedIn"
                    value={userData.personal.linkedinUrl}
                    isEditing={isEditing}
                    onChange={(val) => handleInputChange('personal', 'linkedinUrl', val)}
                    isLink
                  />
                  <InfoRow
                    icon={Code}
                    label="GitHub"
                    value={userData.personal.githubUrl}
                    isEditing={isEditing}
                    onChange={(val) => handleInputChange('personal', 'githubUrl', val)}
                    isLink
                  />
                  <InfoRow
                    icon={Globe}
                    label="Portfolio"
                    value={userData.personal.portfolioUrl}
                    isEditing={isEditing}
                    onChange={(val) => handleInputChange('personal', 'portfolioUrl', val)}
                    isLink
                  />
                </div>
              </div>
            </motion.div>

            {/* Skills Card (Moved to Left Col) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
            >
              <h3 className="text-lg font-bold text-[#1E293B] mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-[#2C5F34]" />
                Technical Skills
              </h3>

              {/* Consolidate All Skills here for better Sidebar view */}
              <div className="space-y-6">
                <SkillGroup
                  title="Languages"
                  skills={userData.skills.programming}
                  isEditing={isEditing}
                  onRemove={(idx) => removeSkill('programming', idx)}
                  onAdd={(val) => addSkill('programming', val)}
                />
                <SkillGroup
                  title="Frameworks"
                  skills={userData.skills.frameworks}
                  isEditing={isEditing}
                  onRemove={(idx) => removeSkill('frameworks', idx)}
                  onAdd={(val) => addSkill('frameworks', val)}
                />
                <SkillGroup
                  title="Databases"
                  skills={userData.skills.databases}
                  isEditing={isEditing}
                  onRemove={(idx) => removeSkill('databases', idx)}
                  onAdd={(val) => addSkill('databases', val)}
                />
                <SkillGroup
                  title="Tools"
                  skills={userData.skills.tools}
                  isEditing={isEditing}
                  onRemove={(idx) => removeSkill('tools', idx)}
                  onAdd={(val) => addSkill('tools', val)}
                />
              </div>

            </motion.div>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Education */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#1E293B] flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <GraduationCap size={24} />
                  </div>
                  <span>Education</span>
                </h2>
                {isEditing && (
                  <button
                    onClick={() => addArrayItem('education', {
                      degree: '',
                      institution: '',
                      location: '',
                      gpa: '',
                      startDate: '',
                      endDate: '',
                      description: ''
                    })}
                    className="flex items-center space-x-2 text-[#2C5F34] hover:text-[#FFD700] text-sm font-medium bg-[#f0f9f4] px-3 py-1.5 rounded-lg transition-colors border border-[#2C5F34]/20"
                  >
                    <Plus size={16} />
                    <span>Add Education</span>
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {userData.education.length > 0 ? (
                  userData.education.map((edu, index) => (
                    <div key={index} className="relative pl-6 border-l-2 border-gray-100 last:border-0 pb-6 last:pb-0">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-blue-100"></div>
                      {isEditing ? (
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                          <div className="flex justify-between">
                            <h4 className="text-sm font-semibold text-gray-500 uppercase">Entry {index + 1}</h4>
                            <button onClick={() => removeArrayItem('education', index)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                              type="text"
                              placeholder="Degree (e.g. B.Tech)"
                              value={edu.degree}
                              onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)}
                              className="input-field-sm"
                            />
                            <input
                              type="text"
                              placeholder="Institution"
                              value={edu.institution}
                              onChange={(e) => handleArrayChange('education', index, 'institution', e.target.value)}
                              className="input-field-sm"
                            />
                            <input
                              type="text"
                              placeholder="Location"
                              value={edu.location}
                              onChange={(e) => handleArrayChange('education', index, 'location', e.target.value)}
                              className="input-field-sm"
                            />
                            <input
                              type="text"
                              placeholder="GPA"
                              value={edu.gpa}
                              onChange={(e) => handleArrayChange('education', index, 'gpa', e.target.value)}
                              className="input-field-sm"
                            />
                            <div className="flex space-x-2">
                              <input
                                type="month"
                                value={edu.startDate}
                                onChange={(e) => handleArrayChange('education', index, 'startDate', e.target.value)}
                                className="input-field-sm w-1/2"
                              />
                              <input
                                type="month"
                                value={edu.endDate}
                                onChange={(e) => handleArrayChange('education', index, 'endDate', e.target.value)}
                                className="input-field-sm w-1/2"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="group">
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#2C5F34] transition-colors">{edu.institution}</h3>
                          <p className="text-gray-700 font-medium">{edu.degree}</p>
                          <p className="text-sm text-gray-500 mt-1 flex items-center space-x-2">
                            <span>{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</span>
                            {edu.gpa && (
                              <>
                                <span>•</span>
                                <span className="text-gray-600">GPA: {edu.gpa}</span>
                              </>
                            )}
                            {edu.location && (
                              <>
                                <span>•</span>
                                <span>{edu.location}</span>
                              </>
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  !isEditing && <EmptyState icon={GraduationCap} text="No education details added yet." />
                )}
              </div>
            </motion.div>

            {/* Internships */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#1E293B] flex items-center space-x-3">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                    <Briefcase size={24} />
                  </div>
                  <span>Internships & Experience</span>
                </h2>
                {isEditing && (
                  <button
                    onClick={() => addArrayItem('internships', {
                      company: '',
                      role: '',
                      location: '',
                      startDate: '',
                      endDate: '',
                      description: '',
                      type: 'Internship'
                    })}
                    className="flex items-center space-x-2 text-[#2C5F34] hover:text-[#FFD700] text-sm font-medium bg-[#f0f9f4] px-3 py-1.5 rounded-lg transition-colors border border-[#2C5F34]/20"
                  >
                    <Plus size={16} />
                    <span>Add Experience</span>
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {userData.internships && userData.internships.length > 0 ? (
                  userData.internships.map((job, index) => (
                    <div key={index} className="relative pl-6 border-l-2 border-gray-100 last:border-0 pb-6 last:pb-0">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-purple-100"></div>
                      {isEditing ? (
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                          <div className="flex justify-between">
                            <h4 className="text-sm font-semibold text-gray-500 uppercase">Role {index + 1}</h4>
                            <button onClick={() => removeArrayItem('internships', index)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input type="text" placeholder="Company" value={job.company} onChange={(e) => handleArrayChange('internships', index, 'company', e.target.value)} className="input-field-sm" />
                            <input type="text" placeholder="Role/Title" value={job.role} onChange={(e) => handleArrayChange('internships', index, 'role', e.target.value)} className="input-field-sm" />
                            <input type="text" placeholder="Location" value={job.location} onChange={(e) => handleArrayChange('internships', index, 'location', e.target.value)} className="input-field-sm" />
                            <div className="flex space-x-2">
                              <input type="month" value={job.startDate} onChange={(e) => handleArrayChange('internships', index, 'startDate', e.target.value)} className="input-field-sm w-1/2" />
                              <input type="month" value={job.endDate} onChange={(e) => handleArrayChange('internships', index, 'endDate', e.target.value)} className="input-field-sm w-1/2" />
                            </div>
                            <textarea
                              placeholder="Description..."
                              value={job.description}
                              onChange={(e) => handleArrayChange('internships', index, 'description', e.target.value)}
                              className="input-field-sm col-span-2 h-20 resize-none"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="group">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-700 transition-colors">{job.role}</h3>
                              <p className="text-gray-700 font-medium">{job.company}</p>
                            </div>
                            <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full uppercase tracking-wider font-semibold">
                              {job.type || 'Internship'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1 flex items-center space-x-2">
                            <span>{formatDate(job.startDate)} - {formatDate(job.endDate)}</span>
                            {job.location && (
                              <>
                                <span>•</span>
                                <span>{job.location}</span>
                              </>
                            )}
                          </p>
                          {job.description && (
                            <p className="mt-3 text-gray-600 text-sm leading-relaxed bg-gray-50/50 p-3 rounded-lg border border-gray-100">
                              {job.description}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  !isEditing && <EmptyState icon={Briefcase} text="No internships or experience added." />
                )}
              </div>
            </motion.div>

            {/* Projects */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#1E293B] flex items-center space-x-3">
                  <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                    <Code size={24} />
                  </div>
                  <span>Projects</span>
                </h2>
                {isEditing && (
                  <button
                    onClick={() => addArrayItem('projects', {
                      title: '',
                      description: '',
                      technologies: '',
                      link: '',
                      githubLink: ''
                    })}
                    className="flex items-center space-x-2 text-[#2C5F34] hover:text-[#FFD700] text-sm font-medium bg-[#f0f9f4] px-3 py-1.5 rounded-lg transition-colors border border-[#2C5F34]/20"
                  >
                    <Plus size={16} />
                    <span>Add Project</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-6">
                {userData.projects.length > 0 ? (
                  userData.projects.map((project, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                      {isEditing ? (
                        <div className="p-4 space-y-3 bg-gray-50">
                          <div className="flex justify-between">
                            <h4 className="text-sm font-semibold text-gray-500 uppercase">Project {index + 1}</h4>
                            <button onClick={() => removeArrayItem('projects', index)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input type="text" placeholder="Project Title" value={project.title} onChange={(e) => handleArrayChange('projects', index, 'title', e.target.value)} className="input-field-sm col-span-2" />
                            <input type="text" placeholder="Tech Stack (comma separated)" value={Array.isArray(project.techStack) ? project.techStack.join(', ') : (project.techStack || '')} onChange={(e) => handleArrayChange('projects', index, 'techStack', e.target.value.split(',').map(t => t.trim()))} className="input-field-sm col-span-2" />
                            <input type="url" placeholder="Live Link" value={project.link} onChange={(e) => handleArrayChange('projects', index, 'link', e.target.value)} className="input-field-sm" />
                            <input type="url" placeholder="Github" value={project.githubLink} onChange={(e) => handleArrayChange('projects', index, 'githubLink', e.target.value)} className="input-field-sm" />
                            <textarea placeholder="Description" value={project.description} onChange={(e) => handleArrayChange('projects', index, 'description', e.target.value)} className="input-field-sm col-span-2 h-20 resize-none" />
                          </div>
                        </div>
                      ) : (
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{project.title}</h3>
                            <div className="flex space-x-2">
                              {project.githubLink && (
                                <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-800 transition-colors">
                                  <Code size={18} />
                                </a>
                              )}
                              {project.link && (
                                <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#2C5F34] transition-colors">
                                  <ExternalLink size={18} />
                                </a>
                              )}
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {(Array.isArray(project.techStack) ? project.techStack : (typeof project.techStack === 'string' ? project.techStack.split(',') : [])).map((tech, i) => (
                              <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium border border-gray-200">
                                {typeof tech === 'string' ? tech.trim() : tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  !isEditing && <EmptyState icon={Code} text="No projects added yet." />
                )}
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
};

// --- Helper Functions & Styles ---
const EmptyState = ({ icon: Icon, text }) => (
  <div className="flex flex-col items-center justify-center py-8 text-center text-gray-400 dashed-border rounded-xl">
    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
      <Icon size={24} className="opacity-50" />
    </div>
    <p>{text}</p>
  </div>
);

export default StudentProfile;