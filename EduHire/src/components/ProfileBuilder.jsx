import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  GraduationCap,
  Briefcase,
  Code,
  Award,
  Globe,
  Plus,
  Save,
  ArrowLeft,
  BookOpen,
  Calendar,
  MapPin,
  Star,
  Trash2,
  Camera
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { getCurrentUser, updateUserProfile } from '../utils/userData';
import Button from './ui/Button';

const ProfileBuilder = ({ onSectionChange }) => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('personal');
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    personal: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: '',
      linkedinUrl: '',
      githubUrl: '',
      portfolioUrl: '',
      avatar: ''
    },
    education: [],
    internships: [],
    projects: [],
    skills: {
      programming: [],
      frameworks: [],
      databases: [],
      tools: [],
      technical: [],
      languages: [],
      soft: []
    }
  });

  // Load existing user data on component mount
  // Load existing user data on component mount
  // Load existing user data on component mount
  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      if (currentUser && currentUser.profile) {
        // Split experience into jobs and internships
        const allExperience = currentUser.profile.experience || [];
        const internships = allExperience
          .filter(item => item.type === 'Internship')
          .map(item => ({ ...item, title: item.role })); // Map role back to title for UI
        const jobs = allExperience.filter(item => item.type !== 'Internship');

        // Map projects from backend schema to frontend state
        const projects = (currentUser.profile.projects || []).map(p => ({
          ...p,
          technologies: Array.isArray(p.techStack) ? p.techStack.join(', ') : (p.techStack || ''),
          liveUrl: p.link,
          github: p.githubLink
        }));

        // Safely extract skills
        const backendSkills = currentUser.profile.skills || {};
        const safeSkills = {
          programming: backendSkills.programming || [],
          frameworks: backendSkills.frameworks || [],
          databases: backendSkills.databases || [],
          tools: backendSkills.tools || [],
          technical: backendSkills.technical || [],
          languages: backendSkills.languages || [],
          soft: backendSkills.soft || []
        };

        // Ensure skills object is properly structured
        const profileData = {
          ...currentUser.profile,
          personal: {
            ...currentUser.profile.personal,
            email: currentUser.email || currentUser.profile.personal?.email
          },
          experience: jobs,
          internships: internships,
          projects: projects,
          skills: safeSkills
        };
        setFormData(profileData);
      }
    };
    fetchUser();
  }, []);

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'internships', label: 'Internships', icon: Briefcase },
    { id: 'projects', label: 'Projects', icon: Code },
    { id: 'skills', label: 'Skills', icon: Award }
  ];

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const addItem = (section) => {
    let newItem;

    switch (section) {
      case 'education':
        newItem = {
          id: Date.now(),
          degree: '',
          institution: '',
          location: '',
          startDate: '',
          endDate: '',
          gpa: '',
          description: ''
        };
        break;
      case 'internships':
        newItem = {
          id: Date.now(),
          title: '',
          company: '',
          location: '',
          startDate: '',
          endDate: '',
          description: '',
          technologies: []
        };
        break;
      case 'projects':
        newItem = {
          id: Date.now(),
          title: '',
          description: '',
          technologies: '',
          github: '',
          liveUrl: ''
        };
        break;
      default:
        newItem = {
          id: Date.now(),
          title: '',
          description: '',
          startDate: '',
          endDate: ''
        };
    }

    setFormData(prev => ({
      ...prev,
      [section]: [...prev[section], newItem]
    }));
  };

  const removeItem = (section, id) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].filter(item => item.id !== id)
    }));
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

  // New state for skill inputs
  const [skillInputs, setSkillInputs] = useState({
    programming: '',
    frameworks: '',
    databases: '',
    tools: ''
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Auto-add pending skills
      const updatedSkills = { ...formData.skills };
      Object.keys(skillInputs).forEach(category => {
        if (skillInputs[category] && skillInputs[category].trim()) {
          updatedSkills[category] = [...(updatedSkills[category] || []), skillInputs[category].trim()];
          // Clear input
          setSkillInputs(prev => ({ ...prev, [category]: '' }));
        }
      });

      const currentUser = await getCurrentUser();
      if (currentUser) {
        // Map frontend data to backend schema structure for Projects
        const mappedData = {
          ...formData,
          skills: updatedSkills, // Use the version with auto-added skills
          projects: formData.projects.map(p => ({
            ...p,
            techStack: typeof p.technologies === 'string' ? p.technologies.split(',').map(t => t.trim()) : p.technologies,
            link: p.liveUrl,
            githubLink: p.github
          }))
        };

        const success = await updateUserProfile(currentUser.email, mappedData);
        if (success) {
          // Update local state to show the auto-added skills
          setFormData(prev => ({ ...prev, skills: updatedSkills }));
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

  const handleArrayChange = (section, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addSkill = (category, skill) => {
    if (skill.trim()) {
      setFormData(prev => {
        const currentSkills = prev.skills || {};
        return {
          ...prev,
          skills: {
            // Default structure to ensure all arrays exist
            programming: [],
            frameworks: [],
            databases: [],
            tools: [],
            technical: [],
            languages: [],
            soft: [],
            // Overwrite with existing data
            ...currentSkills,
            // Update specific category
            [category]: [...(currentSkills[category] || []), skill.trim()]
          }
        };
      });
    }
  };

  const removeSkill = (category, index) => {
    setFormData(prev => {
      const currentSkills = prev.skills || {};
      return {
        ...prev,
        skills: {
          // Default structure
          programming: [],
          frameworks: [],
          databases: [],
          tools: [],
          technical: [],
          languages: [],
          soft: [],
          // Overwrite with existing data
          ...currentSkills,
          // Update specific category
          [category]: (currentSkills[category] || []).filter((_, i) => i !== index)
        }
      };
    });
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onSectionChange('dashboard')}
                className="p-2 text-[#2C5F34] hover:text-[#FFD700] hover:bg-white rounded-lg transition-all duration-200"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-3xl font-bold text-[#1E293B]">Profile Builder</h1>
            </div>
            <Button onClick={handleSave} disabled={isSaving} leftIcon={<Save size={16} />}>
              {isSaving ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
          <p className="text-gray-600">Complete your profile to showcase your skills and experience to potential employers.</p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-card p-2 mb-8 border border-gray-100"
        >
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${activeTab === tab.id
                  ? 'bg-[#2C5F34] text-white shadow-md transform scale-105'
                  : 'text-gray-600 hover:text-[#2C5F34] hover:bg-green-50'
                  }`}
              >
                <tab.icon size={18} />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-8"
        >
          {activeTab === 'personal' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-[#1E293B] mb-6">Personal Information</h2>

              <div className="flex justify-center mb-8">
                <div className="relative w-32 h-32">
                  <img
                    src={formData.personal.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.personal.firstName + ' ' + formData.personal.lastName)}&background=random`}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover border-4 border-[#2C5F34] shadow-lg"
                  />
                  <div className="absolute bottom-0 right-0 flex space-x-2">
                    <label className="p-2 bg-[#2C5F34] text-white rounded-full cursor-pointer hover:bg-[#FFD700] hover:text-[#1E293B] transition-all shadow-lg hover:scale-110">
                      <Camera size={16} />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                    <button
                      onClick={handleRemovePhoto}
                      className="p-2 bg-red-500 text-white rounded-full cursor-pointer hover:bg-red-600 transition-all shadow-lg hover:scale-110"
                      title="Remove Photo"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    value={formData.personal.firstName}
                    onChange={(e) => handleInputChange('personal', 'firstName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C5F34] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={formData.personal.lastName}
                    onChange={(e) => handleInputChange('personal', 'lastName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C5F34] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.personal.email}
                    onChange={(e) => handleInputChange('personal', 'email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C5F34] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.personal.phone}
                    onChange={(e) => handleInputChange('personal', 'phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C5F34] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.personal.location}
                    onChange={(e) => handleInputChange('personal', 'location', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C5F34] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                  <input
                    type="url"
                    value={formData.personal.linkedinUrl || ''}
                    onChange={(e) => handleInputChange('personal', 'linkedinUrl', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C5F34] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
                  <input
                    type="url"
                    value={formData.personal.githubUrl || ''}
                    onChange={(e) => handleInputChange('personal', 'githubUrl', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C5F34] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio</label>
                  <input
                    type="url"
                    value={formData.personal.portfolioUrl || ''}
                    onChange={(e) => handleInputChange('personal', 'portfolioUrl', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C5F34] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'education' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-[#1E293B]">Education</h2>
                <button
                  onClick={() => addItem('education')}
                  className="flex items-center space-x-2 bg-[#2C5F34] text-white px-4 py-2 rounded-lg hover:bg-[#FFD700] hover:text-[#1E293B] transition-all duration-200"
                >
                  <Plus size={18} />
                  <span>Add Education</span>
                </button>
              </div>
              {(formData.education || []).map((edu, index) => (
                <div key={edu.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-[#1E293B]">Education {index + 1}</h3>
                    <button
                      onClick={() => removeItem('education', edu.id)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Degree</label>
                      <input
                        type="text"
                        value={edu.degree || ''}
                        onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C5F34] focus:border-transparent"
                        placeholder="e.g., Bachelor of Science in Computer Science"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Institution</label>
                      <input
                        type="text"
                        value={edu.institution || ''}
                        onChange={(e) => handleArrayChange('education', index, 'institution', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C5F34] focus:border-transparent"
                        placeholder="e.g., Stanford University"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <input
                        type="text"
                        value={edu.location || ''}
                        onChange={(e) => handleArrayChange('education', index, 'location', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C5F34] focus:border-transparent"
                        placeholder="e.g., Stanford, CA"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                      <input
                        type="month"
                        min="1990-01"
                        max="2035-12"
                        value={edu.startDate || ''}
                        onChange={(e) => handleArrayChange('education', index, 'startDate', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C5F34] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                      <input
                        type="month"
                        min="1990-01"
                        max="2035-12"
                        value={edu.endDate || ''}
                        onChange={(e) => handleArrayChange('education', index, 'endDate', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C5F34] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">GPA</label>
                      <input
                        type="text"
                        value={edu.gpa || ''}
                        onChange={(e) => handleArrayChange('education', index, 'gpa', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C5F34] focus:border-transparent"
                        placeholder="e.g., 3.8/4.0"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={edu.description || ''}
                        onChange={(e) => handleArrayChange('education', index, 'description', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C5F34] focus:border-transparent"
                        placeholder="Additional details about your education..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'internships' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-[#1E293B]">Internships & Work Experience</h2>
                <button
                  onClick={() => addItem('internships')}
                  className="flex items-center space-x-2 bg-[#2C5F34] text-white px-4 py-2 rounded-lg hover:bg-[#FFD700] hover:text-[#1E293B] transition-all duration-200"
                >
                  <Plus size={18} />
                  <span>Add Internship</span>
                </button>
              </div>
              {(formData.internships || []).map((internship, index) => (
                <div key={internship.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-[#1E293B]">Internship {index + 1}</h3>
                    <button
                      onClick={() => removeItem('internships', internship.id)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                      <input
                        type="text"
                        value={internship.title || ''}
                        onChange={(e) => handleArrayChange('internships', index, 'title', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C5F34] focus:border-transparent"
                        placeholder="e.g., Software Engineering Intern"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                      <input
                        type="text"
                        value={internship.company || ''}
                        onChange={(e) => handleArrayChange('internships', index, 'company', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C5F34] focus:border-transparent"
                        placeholder="e.g., Google"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <input
                        type="text"
                        value={internship.location || ''}
                        onChange={(e) => handleArrayChange('internships', index, 'location', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C5F34] focus:border-transparent"
                        placeholder="e.g., Mountain View, CA"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                      <input
                        type="month"
                        min="1990-01"
                        max="2035-12"
                        value={internship.startDate || ''}
                        onChange={(e) => handleArrayChange('internships', index, 'startDate', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C5F34] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                      <input
                        type="month"
                        min="1990-01"
                        max="2035-12"
                        value={internship.endDate || ''}
                        onChange={(e) => handleArrayChange('internships', index, 'endDate', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C5F34] focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={internship.description || ''}
                        onChange={(e) => handleArrayChange('internships', index, 'description', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C5F34] focus:border-transparent"
                        placeholder="Describe your role, responsibilities, and achievements..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-[#1E293B]">Projects</h2>
                <button
                  onClick={() => addItem('projects')}
                  className="flex items-center space-x-2 bg-[#2C5F34] text-white px-4 py-2 rounded-lg hover:bg-[#FFD700] hover:text-[#1E293B] transition-all duration-200"
                >
                  <Plus size={18} />
                  <span>Add Project</span>
                </button>
              </div>
              {(formData.projects || []).map((project, index) => (
                <div key={project.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-[#1E293B]">Project {index + 1}</h3>
                    <button
                      onClick={() => removeItem('projects', project.id)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
                      <input
                        type="text"
                        value={project.title || ''}
                        onChange={(e) => handleArrayChange('projects', index, 'title', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C5F34] focus:border-transparent"
                        placeholder="e.g., AI-Powered Resume Parser"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Technologies Used</label>
                      <input
                        type="text"
                        value={project.technologies || ''}
                        onChange={(e) => handleArrayChange('projects', index, 'technologies', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C5F34] focus:border-transparent"
                        placeholder="e.g., React, Node.js, Python, TensorFlow"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={project.description || ''}
                        onChange={(e) => handleArrayChange('projects', index, 'description', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C5F34] focus:border-transparent"
                        placeholder="Describe your project, its features, and your role..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">GitHub URL</label>
                      <input
                        type="url"
                        value={project.github || ''}
                        onChange={(e) => handleArrayChange('projects', index, 'github', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C5F34] focus:border-transparent"
                        placeholder="https://github.com/username/project"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Live Demo URL</label>
                      <input
                        type="url"
                        value={project.liveUrl || ''}
                        onChange={(e) => handleArrayChange('projects', index, 'liveUrl', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C5F34] focus:border-transparent"
                        placeholder="https://project-demo.vercel.app"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-[#1E293B]">Skills & Technologies</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Programming Languages */}
                <div>
                  <h3 className="text-lg font-medium text-[#1E293B] mb-4">Programming Languages</h3>
                  <div className="space-y-2">
                    {(formData.skills?.programming || []).map((skill, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-[#FFD700]" />
                        <span className="text-gray-700 flex-1">{skill}</span>
                        <button onClick={() => removeSkill('programming', index)} className="p-1 text-red-500 hover:text-red-700">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Add programming language"
                        value={skillInputs.programming}
                        onChange={(e) => setSkillInputs(prev => ({ ...prev, programming: e.target.value }))}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addSkill('programming', skillInputs.programming);
                            setSkillInputs(prev => ({ ...prev, programming: '' }));
                          }
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C5F34] focus:border-transparent"
                      />
                      <button
                        onClick={() => {
                          addSkill('programming', skillInputs.programming);
                          setSkillInputs(prev => ({ ...prev, programming: '' }));
                        }}
                        className="p-2 bg-[#2C5F34] text-white rounded-lg hover:bg-[#FFD700] hover:text-[#1E293B] transition-all duration-200"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Frameworks */}
                <div>
                  <h3 className="text-lg font-medium text-[#1E293B] mb-4">Frameworks & Libraries</h3>
                  <div className="space-y-2">
                    {(formData.skills?.frameworks || []).map((skill, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Code className="w-4 h-4 text-[#2C5F34]" />
                        <span className="text-gray-700 flex-1">{skill}</span>
                        <button onClick={() => removeSkill('frameworks', index)} className="p-1 text-red-500 hover:text-red-700">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Add framework/library"
                        value={skillInputs.frameworks}
                        onChange={(e) => setSkillInputs(prev => ({ ...prev, frameworks: e.target.value }))}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addSkill('frameworks', skillInputs.frameworks);
                            setSkillInputs(prev => ({ ...prev, frameworks: '' }));
                          }
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C5F34] focus:border-transparent"
                      />
                      <button
                        onClick={() => {
                          addSkill('frameworks', skillInputs.frameworks);
                          setSkillInputs(prev => ({ ...prev, frameworks: '' }));
                        }}
                        className="p-2 bg-[#2C5F34] text-white rounded-lg hover:bg-[#FFD700] hover:text-[#1E293B] transition-all duration-200"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Databases */}
                <div>
                  <h3 className="text-lg font-medium text-[#1E293B] mb-4">Databases</h3>
                  <div className="space-y-2">
                    {(formData.skills?.databases || []).map((skill, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <BookOpen className="w-4 h-4 text-blue-500" />
                        <span className="text-gray-700 flex-1">{skill}</span>
                        <button onClick={() => removeSkill('databases', index)} className="p-1 text-red-500 hover:text-red-700">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Add database"
                        value={skillInputs.databases}
                        onChange={(e) => setSkillInputs(prev => ({ ...prev, databases: e.target.value }))}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addSkill('databases', skillInputs.databases);
                            setSkillInputs(prev => ({ ...prev, databases: '' }));
                          }
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C5F34] focus:border-transparent"
                      />
                      <button
                        onClick={() => {
                          addSkill('databases', skillInputs.databases);
                          setSkillInputs(prev => ({ ...prev, databases: '' }));
                        }}
                        className="p-2 bg-[#2C5F34] text-white rounded-lg hover:bg-[#FFD700] hover:text-[#1E293B] transition-all duration-200"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tools */}
                <div>
                  <h3 className="text-lg font-medium text-[#1E293B] mb-4">Tools & Platforms</h3>
                  <div className="space-y-2">
                    {(formData.skills?.tools || []).map((skill, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Award className="w-4 h-4 text-purple-500" />
                        <span className="text-gray-700 flex-1">{skill}</span>
                        <button onClick={() => removeSkill('tools', index)} className="p-1 text-red-500 hover:text-red-700">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Add tool/platform"
                        value={skillInputs.tools}
                        onChange={(e) => setSkillInputs(prev => ({ ...prev, tools: e.target.value }))}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addSkill('tools', skillInputs.tools);
                            setSkillInputs(prev => ({ ...prev, tools: '' }));
                          }
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C5F34] focus:border-transparent"
                      />
                      <button
                        onClick={() => {
                          addSkill('tools', skillInputs.tools);
                          setSkillInputs(prev => ({ ...prev, tools: '' }));
                        }}
                        className="p-2 bg-[#2C5F34] text-white rounded-lg hover:bg-[#FFD700] hover:text-[#1E293B] transition-all duration-200"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileBuilder; 