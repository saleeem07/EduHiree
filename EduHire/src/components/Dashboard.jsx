import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  GraduationCap,
  Briefcase,
  FileText,
  Upload,
  TrendingUp,
  Eye,
  Calendar,
  Award,
  BookOpen,
  Code,
  Globe,
  ArrowRight
} from 'lucide-react';
import { getCurrentUser } from '../utils/userData';

const QuickActionCard = ({ title, description, icon: Icon, onClick, color, delay }) => (
  <motion.button
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ scale: 1.02, y: -5 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="glass-card text-left p-6 rounded-2xl relative overflow-hidden group w-full"
  >
    <div className={`absolute top-0 right-0 p-24 opacity-5 rounded-full blur-3xl -mr-12 -mt-12 transition-colors duration-500 ${color}`}></div>
    <div className="relative z-10">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-lg ${color.replace('bg-', 'bg-opacity-10 text-')}`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-brand-green transition-colors">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </div>
    <div className="absolute bottom-4 right-4 opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
      <ArrowRight className="w-5 h-5 text-gray-400" />
    </div>
  </motion.button>
);

const StatCard = ({ label, value, icon: Icon, change, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 + (index * 0.1) }}
    whileHover={{ y: -5 }}
    className="glass-card p-6 rounded-2xl"
  >
    <div className="flex items-center space-x-4">
      <div className={`p-4 rounded-xl ${index === 0 ? 'bg-blue-50 text-blue-600' : index === 1 ? 'bg-purple-50 text-purple-600' : index === 2 ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-gray-500 text-sm font-medium">{label}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
    </div>
    <div className="mt-4 flex items-center text-sm">
      <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium">{change}</span>
      <span className="text-gray-400 ml-2">from last month</span>
    </div>
  </motion.div>
);

const Dashboard = ({ onSectionChange }) => {
  const [userData, setUserData] = useState(null);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [showAllActivity, setShowAllActivity] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUserData(currentUser);
        // Calculate profile completion
        const profile = currentUser.profile || {};
        let completedFields = 0;
        let totalFields = 0;

        // Personal info
        if (profile.personal) {
          const personalFields = ['firstName', 'lastName', 'email', 'phone', 'location'];
          personalFields.forEach(field => {
            totalFields++;
            if (profile.personal[field]) completedFields++;
          });
        } else {
          totalFields += 5;
        }

        // Sections
        ['education', 'experience', 'projects', 'internships'].forEach(section => {
          totalFields++;
          if (profile[section] && profile[section].length > 0) completedFields++;
        });

        // Skills
        totalFields++;
        if (profile.skills && (
          profile.skills.technical?.length > 0 ||
          profile.skills.languages?.length > 0 ||
          profile.skills.programming?.length > 0 ||
          profile.skills.frameworks?.length > 0 ||
          profile.skills.databases?.length > 0 ||
          profile.skills.tools?.length > 0 ||
          profile.skills.soft?.length > 0
        )) {
          completedFields++;
        }

        setProfileCompletion(Math.round((completedFields / totalFields) * 100));
      }
    };
    fetchUser();
  }, []);

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  const studentData = userData ? {
    name: userData.profile?.personal?.firstName && userData.profile?.personal?.lastName
      ? `${userData.profile.personal.firstName} ${userData.profile.personal.lastName}`
      : "Student",
    email: userData.profile?.personal?.email || userData.email || "",
    major: userData.profile?.education?.[0]?.field || "Major not set",
    graduationYear: userData.profile?.education?.[0]?.endDate ? new Date(userData.profile.education[0].endDate).getFullYear() : "N/A",
    gpa: userData.profile?.education?.[0]?.gpa || "",
    internships: userData.profile?.experience?.filter(e => e.type === 'Internship').length || userData.profile?.experience?.length || 0,
    projects: userData.profile?.projects?.length || 0,
    skills: userData.profile?.skills || [],
    recentActivity: userData.activityLog?.slice(0, showAllActivity ? undefined : 3).map(log => ({
      ...log,
      time: formatDate(log.time)
    })) || []
  } : null;

  // Handle skills being object in frontend vs string array in backend model
  // We'll trust the frontend structure (ProfileBuilder) for now and adapt:
  const technicalSkills = studentData?.skills?.technical || [];
  const skillsCount =
    (studentData?.skills?.technical?.length || 0) +
    (studentData?.skills?.languages?.length || 0) +
    (studentData?.skills?.frameworks?.length || 0) +
    (studentData?.skills?.tools?.length || 0) +
    (studentData?.skills?.databases?.length || 0) +
    (studentData?.skills?.programing?.length || 0) +
    (studentData?.skills?.soft?.length || 0);


  const quickActions = [
    {
      title: "Complete Profile",
      description: "Add missing information to your profile",
      icon: User,
      action: () => onSectionChange('profile'),
      color: "bg-blue-500"
    },
    {
      title: "AI Resume Builder",
      description: "Create a professional resume with AI",
      icon: FileText,
      action: () => onSectionChange('resume-ai'),
      color: "bg-[#2C5F34]"
    },
    {
      title: "AI CV Builder",
      description: "Generate a comprehensive CV",
      icon: FileText,
      action: () => onSectionChange('cv-ai'),
      color: "bg-purple-500"
    },
    {
      title: "Upload Documents",
      description: "Upload resume, CV, and certificates",
      icon: Upload,
      action: () => onSectionChange('upload'),
      color: "bg-orange-500"
    }
  ];

  const stats = [
    { label: "Profile Views", value: userData?.dashboardStats?.profileViews || 0, icon: Eye, change: "+12%" }, // Change logic can be added later
    { label: "Applications", value: userData?.dashboardStats?.applications || 0, icon: Briefcase, change: "+3" },
    { label: "Interviews", value: userData?.dashboardStats?.interviews || 0, icon: Calendar, change: "+1" },
    { label: "Skills", value: skillsCount, icon: Award, change: "+2" }
  ];

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 -mt-20 pt-28">
      <div className="site-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-extrabold text-[#1E293B] mb-2 tracking-tight">
            Welcome back, <span className="text-gradient hover:scale-105 inline-block transition-transform cursor-default">{studentData.name}</span>!
          </h1>
          <p className="text-gray-600 text-lg">Here's what's happening with your profile today.</p>
        </motion.div>

        {/* Profile Completion Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          whileHover={{ y: -5 }}
          className="glass-card p-8 mb-8 relative overflow-hidden group"
        >
          <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-brand-green to-brand-gold"></div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Completion</h2>
              <p className="text-gray-500 mb-6">Complete your profile to unlock all features and increase your visibility to recruiters.</p>

              <div className="w-full bg-gray-100 rounded-full h-3 mb-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${profileCompletion}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="bg-gradient-to-r from-brand-green to-brand-light h-full rounded-full relative"
                >
                  <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                </motion.div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#2C5F34] font-medium flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  {profileCompletion < 100 ? 'Keep going!' : 'Excellent work!'}
                </span>
                <span className="font-bold text-gray-900">{profileCompletion}%</span>
              </div>
            </div>

            <div className="flex-shrink-0 relative">
              <div className="w-24 h-24 rounded-full border-4 border-brand-green/20 flex items-center justify-center relative">
                <span className="text-2xl font-bold text-brand-green">{profileCompletion}%</span>
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50" cy="50" r="46"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-brand-green/10"
                  />
                  <motion.circle
                    cx="50" cy="50" r="46"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray="289"
                    strokeDashoffset={289 - (289 * profileCompletion) / 100}
                    className="text-brand-green text-opacity-100"
                    initial={{ strokeDashoffset: 289 }}
                    animate={{ strokeDashoffset: 289 - (289 * profileCompletion) / 100 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} index={index} />
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="bg-brand-green/10 p-2 rounded-lg mr-3 text-brand-green"><Code size={20} /></span>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <QuickActionCard
                key={index}
                {...action}
                onClick={() => action.action ? action.action() : onSectionChange(action.section)}
                delay={0.3 + (index * 0.1)}
              />
            ))}
          </div>
        </div>

        {/* Recent Activity & Profile Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6 rounded-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
              {userData?.activityLog?.length > 3 && (
                <button
                  onClick={() => setShowAllActivity(!showAllActivity)}
                  className="text-sm text-brand-green font-medium hover:text-brand-gold transition-colors"
                >
                  {showAllActivity ? 'Show Less' : 'View All'}
                </button>
              )}
            </div>
            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {studentData.recentActivity.length > 0 ? (
                studentData.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-4 group">
                    <div className="relative mt-1.5">
                      <div className="w-3 h-3 bg-brand-green rounded-full ring-4 ring-green-50 group-hover:ring-green-100 transition-all"></div>
                      {index !== studentData.recentActivity.length - 1 && (
                        <div className="absolute top-3 left-1.5 w-0.5 h-full bg-gray-100 -mb-6"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-2">
                      <p className="text-gray-900 font-medium group-hover:text-brand-green transition-colors">{activity.action}</p>
                      <p className="text-gray-400 text-sm mt-0.5 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No recent activity</p>
              )}
            </div>
          </motion.div>

          {/* Profile Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-6 rounded-2xl"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Overview</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-3 hover:bg-white/50 rounded-xl transition-colors">
                <div className="bg-brand-green/10 p-2.5 rounded-lg text-brand-green">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-gray-900 font-medium">{studentData.major}</p>
                  <p className="text-gray-500 text-sm">Graduating {studentData.graduationYear}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-3 hover:bg-white/50 rounded-xl transition-colors">
                <div className="bg-brand-green/10 p-2.5 rounded-lg text-brand-green">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-gray-900 font-medium">{studentData.internships} Internships</p>
                  <p className="text-gray-500 text-sm">Professional experience</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-3 hover:bg-white/50 rounded-xl transition-colors">
                <div className="bg-brand-green/10 p-2.5 rounded-lg text-brand-green">
                  <Code className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-gray-900 font-medium">{studentData.projects} Projects</p>
                  <p className="text-gray-500 text-sm">Portfolio items</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-3 hover:bg-white/50 rounded-xl transition-colors">
                <div className="bg-brand-green/10 p-2.5 rounded-lg text-brand-green">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-gray-900 font-medium">GPA: {studentData.gpa}</p>
                  <p className="text-gray-500 text-sm">Academic performance</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;