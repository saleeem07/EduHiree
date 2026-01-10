import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  ArrowLeft, 
  Eye, 
  Sparkles,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Globe,
  BookOpen,
  Languages,
  Activity
} from 'lucide-react';
import { getCurrentUser } from '../utils/userData';

const AICVBuilder = ({ onSectionChange }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [cvData, setCvData] = useState({
    personalInfo: {
      name: 'Sidharth Kumar',
      email: 'sidharth.kumar@chandigarhuniversity.edu',
      phone: '+91 98765 43210',
      location: 'Chandigarh, India',
      linkedin: 'linkedin.com/in/sidharthkumar',
      website: 'sidharthkumar.dev'
    },
    summary: 'Dedicated Computer Science student with a passion for innovation and problem-solving. Seeking opportunities to apply technical skills in software development while contributing to cutting-edge projects.',
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        institution: 'Chandigarh University',
        location: 'Chandigarh, India',
        startDate: '2020-09',
        endDate: '2024-06',
        gpa: '3.8/4.0',
        relevantCourses: ['Data Structures & Algorithms', 'Machine Learning', 'Database Systems', 'Software Engineering', 'Computer Networks'],
        thesis: 'AI-Powered Resume Analysis System',
        honors: ['Dean\'s List 2022-2024', 'Computer Science Department Award', 'Research Excellence Grant']
      }
    ],
    experience: [
      {
        title: 'Software Engineering Intern',
        company: 'Google',
        location: 'Mountain View, CA',
        startDate: '2023-06',
        endDate: '2023-09',
        description: 'Developed and maintained internal tools for data analysis and visualization. Collaborated with cross-functional teams to deliver high-quality software solutions.',
        responsibilities: [
          'Built data processing pipelines using Python and Apache Beam',
          'Developed React-based dashboard for real-time analytics',
          'Implemented automated testing reducing bugs by 60%',
          'Mentored 2 junior interns and conducted code reviews'
        ],
        technologies: ['Python', 'React', 'Google Cloud Platform', 'SQL', 'Apache Beam']
      }
    ],
    projects: [
      {
        title: 'AI-Powered Resume Parser',
        description: 'Developed a machine learning model that automatically extracts and categorizes information from resumes with 95% accuracy.',
        technologies: ['Python', 'TensorFlow', 'React', 'Node.js', 'MongoDB'],
        github: 'github.com/sarahjohnson/resume-parser',
        liveUrl: 'resume-parser-demo.vercel.app',
        impact: 'Used by 500+ recruiters, processing 10,000+ resumes monthly'
      },
      {
        title: 'E-commerce Analytics Platform',
        description: 'Built a comprehensive analytics platform for e-commerce businesses with real-time dashboards and predictive insights.',
        technologies: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'AWS'],
        github: 'github.com/sarahjohnson/ecommerce-analytics',
        liveUrl: 'analytics-demo.vercel.app',
        impact: 'Helped 50+ businesses increase revenue by 25% on average'
      }
    ],
    skills: {
      programming: ['JavaScript', 'Python', 'Java', 'C++', 'TypeScript', 'Go'],
      frameworks: ['React', 'Node.js', 'Express', 'Django', 'TensorFlow', 'PyTorch'],
      databases: ['MongoDB', 'PostgreSQL', 'Redis', 'Firebase', 'Elasticsearch'],
      tools: ['Git', 'Docker', 'AWS', 'Jenkins', 'Figma', 'Jira'],
      languages: ['English (Native)', 'Spanish (Fluent)', 'French (Intermediate)']
    },
    certifications: [
      { name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', date: '2023' },
      { name: 'Google Cloud Professional Data Engineer', issuer: 'Google Cloud', date: '2023' },
      { name: 'Certified Scrum Master', issuer: 'Scrum Alliance', date: '2022' }
    ],
    publications: [
      {
        title: 'Machine Learning Approaches to Resume Analysis',
        journal: 'IEEE Transactions on AI',
        date: '2023',
        doi: '10.1109/TAI.2023.123456'
      }
    ],
    activities: [
      'President, Computer Science Club (2023-2024)',
      'Mentor, Women in Tech Program (2022-2024)',
      'Volunteer, Code for Good Hackathon (2023)',
      'Speaker, Stanford Tech Conference (2023)'
    ]
  });

  const [selectedTemplate, setSelectedTemplate] = useState('academic');
  const [previewMode, setPreviewMode] = useState(false);

  // Load profile data and update CV data
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.profile) {
      const profile = currentUser.profile;
      
      // Update personal info from profile
      if (profile.personal) {
        setCvData(prev => ({
          ...prev,
          personalInfo: {
            name: profile.personal.firstName && profile.personal.lastName 
              ? `${profile.personal.firstName} ${profile.personal.lastName}`
              : 'Sidharth Kumar',
            email: profile.personal.email || 'sidharth.kumar@chandigarhuniversity.edu',
            phone: profile.personal.phone || '+91 98765 43210',
            location: profile.personal.location || 'Chandigarh, India',
            linkedin: profile.personal.linkedin || 'linkedin.com/in/sidharthkumar',
            website: profile.personal.portfolio || 'sidharthkumar.dev'
          }
        }));
      }

      // Update education from profile
      if (profile.education && profile.education.length > 0) {
        const educationData = profile.education.map(edu => ({
          degree: edu.degree || 'Bachelor of Science in Computer Science',
          institution: edu.institution || 'Chandigarh University',
          location: edu.location || 'Chandigarh, India',
          startDate: edu.startDate || '2020-09',
          endDate: edu.endDate || '2024-06',
          gpa: edu.gpa || '3.8/4.0',
          relevantCourses: ['Data Structures & Algorithms', 'Machine Learning', 'Database Systems', 'Software Engineering', 'Computer Networks'],
          thesis: 'AI-Powered Resume Analysis System',
          honors: ['Dean\'s List 2022-2024', 'Computer Science Department Award', 'Research Excellence Grant']
        }));
        setCvData(prev => ({ ...prev, education: educationData }));
      }

      // Update experience from profile
      if (profile.internships && profile.internships.length > 0) {
        const experienceData = profile.internships.map(internship => ({
          title: internship.title || 'Software Engineering Intern',
          company: internship.company || 'Google',
          location: internship.location || 'Mountain View, CA',
          startDate: internship.startDate || '2023-06',
          endDate: internship.endDate || '2023-09',
          description: internship.description || 'Developed and maintained internal tools for data analysis and visualization.',
          responsibilities: [
            'Built data processing pipelines using Python and Apache Beam',
            'Developed React-based dashboard for real-time analytics',
            'Implemented automated testing reducing bugs by 60%',
            'Mentored 2 junior interns and conducted code reviews'
          ],
          technologies: internship.technologies ? internship.technologies.split(',').map(t => t.trim()) : ['Python', 'React', 'Google Cloud Platform', 'SQL', 'Apache Beam']
        }));
        setCvData(prev => ({ ...prev, experience: experienceData }));
      }

      // Update projects from profile
      if (profile.projects && profile.projects.length > 0) {
        const projectsData = profile.projects.map(project => ({
          title: project.title || 'AI-Powered Resume Parser',
          description: project.description || 'Developed a machine learning model that automatically extracts and categorizes information from resumes.',
          technologies: project.technologies ? project.technologies.split(',').map(t => t.trim()) : ['Python', 'TensorFlow', 'React', 'Node.js', 'MongoDB'],
          github: project.github || 'github.com/sidharthkumar/resume-parser',
          liveUrl: project.liveUrl || 'resume-parser-demo.vercel.app',
          impact: 'Used by 500+ recruiters, processing 10,000+ resumes monthly'
        }));
        setCvData(prev => ({ ...prev, projects: projectsData }));
      }

      // Update skills from profile
      if (profile.skills) {
        const skillsData = {
          programming: profile.skills.programming || ['JavaScript', 'Python', 'Java', 'C++', 'TypeScript', 'Go'],
          frameworks: profile.skills.frameworks || ['React', 'Node.js', 'Express', 'Django', 'TensorFlow', 'PyTorch'],
          databases: profile.skills.databases || ['MongoDB', 'PostgreSQL', 'Redis', 'Firebase', 'Elasticsearch'],
          tools: profile.skills.tools || ['Git', 'Docker', 'AWS', 'Jenkins', 'Figma', 'Jira'],
          languages: ['English (Native)', 'Hindi (Fluent)', 'Punjabi (Intermediate)']
        };
        setCvData(prev => ({ ...prev, skills: skillsData }));
      }
    }
  }, []);

  const templates = [
    { id: 'academic', name: 'Academic', color: 'bg-blue-500' },
    { id: 'professional', name: 'Professional', color: 'bg-[#2C5F34]' },
    { id: 'research', name: 'Research', color: 'bg-purple-500' },
    { id: 'international', name: 'International', color: 'bg-orange-500' }
  ];

  const handleInputChange = (section, field, value) => {
    setCvData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const generateCV = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsGenerating(false);
  };

  const downloadCV = () => {
    console.log('Downloading CV...');
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] p-6">
      <div className="max-w-7xl mx-auto">
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
              <h1 className="text-3xl font-bold text-[#1E293B]">AI CV Builder</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  previewMode 
                    ? 'bg-[#2C5F34] text-white' 
                    : 'bg-white text-[#2C5F34] hover:bg-[#F3F4F6]'
                }`}
              >
                <Eye size={18} />
                <span>{previewMode ? 'Edit' : 'Preview'}</span>
              </button>
              <button
                onClick={downloadCV}
                className="flex items-center space-x-2 bg-[#FFD700] text-[#1E293B] px-4 py-2 rounded-lg hover:bg-yellow-400 transition-all duration-200"
              >
                <Download size={18} />
                <span>Download CV</span>
              </button>
            </div>
          </div>
          <p className="text-gray-600">Create a comprehensive CV with AI assistance. Perfect for academic, research, and international opportunities.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          {!previewMode && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Template Selection */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-[#1E293B] mb-4">Choose CV Template</h2>
                <div className="grid grid-cols-2 gap-4">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        selectedTemplate === template.id
                          ? 'border-[#2C5F34] bg-[#F3F4F6]'
                          : 'border-gray-200 hover:border-[#2C5F34]'
                      }`}
                    >
                      <div className={`w-full h-8 ${template.color} rounded mb-2`}></div>
                      <span className="text-sm font-medium text-[#1E293B]">{template.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Personal Information */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-[#1E293B] mb-4 flex items-center space-x-2">
                  <User size={20} />
                  <span>Personal Information</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={cvData.personalInfo.name}
                      onChange={(e) => handleInputChange('personalInfo', 'name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C5F34] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={cvData.personalInfo.email}
                      onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C5F34] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={cvData.personalInfo.phone}
                      onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C5F34] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      value={cvData.personalInfo.location}
                      onChange={(e) => handleInputChange('personalInfo', 'location', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C5F34] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Professional Summary */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-[#1E293B] mb-4">Professional Summary</h2>
                <textarea
                  value={cvData.summary}
                  onChange={(e) => setCvData(prev => ({ ...prev, summary: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C5F34] focus:border-transparent"
                  placeholder="Write a comprehensive summary of your background, skills, and career objectives..."
                />
                <button
                  onClick={generateCV}
                  disabled={isGenerating}
                  className="mt-4 flex items-center space-x-2 bg-[#2C5F34] text-white px-6 py-3 rounded-lg hover:bg-[#FFD700] hover:text-[#1E293B] transition-all duration-200 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      <span>AI Enhance Summary</span>
                    </>
                  )}
                </button>
              </div>

              {/* Skills */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-[#1E293B] mb-4 flex items-center space-x-2">
                  <Award size={20} />
                  <span>Skills & Languages</span>
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-[#1E293B] mb-2">Programming Languages</h3>
                    <div className="flex flex-wrap gap-2">
                      {cvData.skills.programming.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-[#F3F4F6] text-[#2C5F34] px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-[#1E293B] mb-2">Languages</h3>
                    <div className="flex flex-wrap gap-2">
                      {cvData.skills.languages.map((language, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {language}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Preview Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-sm p-8"
          >
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-[#1E293B] mb-2">CV Preview</h2>
              <p className="text-gray-600 text-sm">This is how your CV will look to employers and institutions</p>
            </div>

            {/* CV Content */}
            <div className="border border-gray-200 rounded-lg p-6 min-h-[800px]">
              {/* Header */}
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-[#2C5F34] mb-2">{cvData.personalInfo.name}</h1>
                <p className="text-gray-600">{cvData.personalInfo.email} • {cvData.personalInfo.phone}</p>
                <p className="text-gray-600">{cvData.personalInfo.location}</p>
                <p className="text-gray-600">{cvData.personalInfo.linkedin} • {cvData.personalInfo.website}</p>
              </div>

              {/* Summary */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-[#1E293B] mb-2 border-b border-gray-300 pb-1">Professional Summary</h2>
                <p className="text-gray-700 leading-relaxed">{cvData.summary}</p>
              </div>

              {/* Education */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-[#1E293B] mb-3 border-b border-gray-300 pb-1">Education</h2>
                {cvData.education.map((edu, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-[#2C5F34]">{edu.degree}</h3>
                      <span className="text-gray-600 text-sm">{edu.startDate} - {edu.endDate}</span>
                    </div>
                    <p className="text-gray-600 mb-2">{edu.institution}, {edu.location}</p>
                    <p className="text-gray-600 mb-2">GPA: {edu.gpa}</p>
                    <p className="text-gray-700 mb-2"><strong>Thesis:</strong> {edu.thesis}</p>
                  </div>
                ))}
              </div>

              {/* Experience */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-[#1E293B] mb-3 border-b border-gray-300 pb-1">Professional Experience</h2>
                {cvData.experience.map((exp, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-[#2C5F34]">{exp.title}</h3>
                      <span className="text-gray-600 text-sm">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <p className="text-gray-600 mb-2">{exp.company}, {exp.location}</p>
                    <p className="text-gray-700 mb-2">{exp.description}</p>
                    <ul className="list-disc list-inside text-gray-700 text-sm space-y-1 mb-2">
                      {exp.responsibilities.map((resp, idx) => (
                        <li key={idx}>{resp}</li>
                      ))}
                    </ul>
                    <p className="text-gray-600 text-sm"><strong>Technologies:</strong> {exp.technologies.join(', ')}</p>
                  </div>
                ))}
              </div>

              {/* Skills */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-[#1E293B] mb-3 border-b border-gray-300 pb-1">Skills & Languages</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-[#1E293B] mb-2">Programming Languages</h3>
                    <div className="flex flex-wrap gap-2">
                      {cvData.skills.programming.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-[#F3F4F6] text-[#2C5F34] px-2 py-1 rounded text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-[#1E293B] mb-2">Languages</h3>
                    <div className="flex flex-wrap gap-2">
                      {cvData.skills.languages.map((language, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                        >
                          {language}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Certifications */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-[#1E293B] mb-3 border-b border-gray-300 pb-1">Certifications</h2>
                {cvData.certifications.map((cert, index) => (
                  <div key={index} className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-[#2C5F34]">{cert.name}</h3>
                      <p className="text-gray-600 text-sm">{cert.issuer}</p>
                    </div>
                    <span className="text-gray-600 text-sm">{cert.date}</span>
                  </div>
                ))}
              </div>

              {/* Activities */}
              <div>
                <h2 className="text-lg font-semibold text-[#1E293B] mb-3 border-b border-gray-300 pb-1">Activities & Leadership</h2>
                <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                  {cvData.activities.map((activity, index) => (
                    <li key={index}>{activity}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AICVBuilder; 