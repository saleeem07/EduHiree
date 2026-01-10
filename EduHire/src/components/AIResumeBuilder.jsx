import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Wand2,
  Download,
  ArrowLeft,
  Eye,
  Edit3,
  Save,
  Sparkles,
  User,
  Briefcase,
  GraduationCap,
  Award,
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Globe,
  Github,
  Plus,
  Minus
} from 'lucide-react';
import { getCurrentUser, updateUserProfile } from '../utils/userData';
import { useToast } from '../context/ToastContext';
import Button from './ui/Button';

// --- Template Components ---

const ModernTemplate = ({ data }) => (
  <div className="bg-white text-gray-800 h-full p-8 font-sans relative overflow-hidden">
    <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500 rounded-br-full opacity-20 z-0"></div>
    <div className="absolute bottom-0 right-0 w-48 h-48 bg-purple-500 rounded-tl-full opacity-10 z-0"></div>

    <div className="relative z-10 grid grid-cols-12 gap-8 h-full">
      {/* Sidebar */}
      <div className="col-span-4 border-r border-gray-100 pr-6">
        <div className="mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg mx-auto">
            {data.personalInfo.name.charAt(0)}
          </div>
          <h3 className="text-gray-900 font-bold uppercase tracking-wider text-sm border-b-2 border-blue-500 inline-block mb-4 pb-1">Contact</h3>
          <div className="space-y-3 text-sm text-gray-600">
            {data.personalInfo.email && <div className="flex items-center"><Mail size={14} className="mr-2 text-blue-500" /> <span className="truncate">{data.personalInfo.email}</span></div>}
            {data.personalInfo.phone && <div className="flex items-center"><Phone size={14} className="mr-2 text-blue-500" /> <span>{data.personalInfo.phone}</span></div>}
            {data.personalInfo.location && <div className="flex items-center"><MapPin size={14} className="mr-2 text-blue-500" /> <span>{data.personalInfo.location}</span></div>}
            {data.personalInfo.linkedin && <div className="flex items-center"><Linkedin size={14} className="mr-2 text-blue-500" /> <span className="truncate">{data.personalInfo.linkedin.replace(/^https?:\/\//, '')}</span></div>}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-gray-900 font-bold uppercase tracking-wider text-sm border-b-2 border-blue-500 inline-block mb-4 pb-1">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, i) => (
              <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-semibold">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-gray-900 font-bold uppercase tracking-wider text-sm border-b-2 border-blue-500 inline-block mb-4 pb-1">Education</h3>
          <div>
            <h4 className="font-bold text-gray-800">{data.education.degree}</h4>
            <p className="text-sm text-gray-600">{data.education.institution}</p>
            <p className="text-xs text-gray-400 mt-1">{data.education.graduation}</p>
            {data.education.gpa && <p className="text-xs text-blue-600 mt-1 font-medium">CGPA: {data.education.gpa}</p>}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="col-span-8">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-[#1E293B] mb-2 tracking-tight">{data.personalInfo.name}</h1>
          <p className="text-lg text-blue-600 font-medium">Student / Professional</p>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
            <span className="w-8 h-1 bg-blue-500 mr-3 rounded-full"></span>
            Profile
          </h3>
          <p className="text-gray-600 leading-relaxed text-sm">{data.summary}</p>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <span className="w-8 h-1 bg-blue-500 mr-3 rounded-full"></span>
            Experience
          </h3>
          <div className="space-y-6">
            {data.experience.map((exp, i) => (
              <div key={i} className="relative pl-6 border-l-2 border-blue-100">
                <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-bold text-gray-800">{exp.title}</h4>
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{exp.duration}</span>
                </div>
                <p className="text-sm font-semibold text-gray-600 mb-2">{exp.company}</p>
                <p className="text-sm text-gray-600 mb-2">{exp.description}</p>
                <ul className="list-disc list-outside ml-4 text-xs text-gray-500 space-y-1">
                  {exp.achievements.map((ach, j) => <li key={j}>{ach}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <span className="w-8 h-1 bg-blue-500 mr-3 rounded-full"></span>
            Projects
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {data.projects.map((proj, i) => (
              <div key={i} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h4 className="font-bold text-gray-800 text-sm mb-1">{proj.title}</h4>
                <p className="text-xs text-gray-600 mb-2">{proj.description}</p>
                <div className="flex gap-1 flex-wrap">
                  {proj.technologies.map((tech, k) => (
                    <span key={k} className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold border border-gray-200 px-1.5 py-0.5 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ProfessionalTemplate = ({ data }) => (
  <div className="bg-white text-black h-full p-[25.4mm] font-serif max-w-full mx-auto leading-relaxed">
    {/* Header */}
    <div className="text-center mb-6">
      <h1 className="text-4xl font-normal mb-2 uppercase tracking-widest">{data.personalInfo.name}</h1>
      <div className="flex justify-center items-center flex-wrap gap-x-4 gap-y-1 text-sm text-gray-800">
        {data.personalInfo.phone && <span className="flex items-center gap-1"><Phone size={12} /> {data.personalInfo.phone}</span>}
        {data.personalInfo.email && <span className="flex items-center gap-1"><Mail size={12} /> {data.personalInfo.email}</span>}
        {data.personalInfo.linkedin && <span className="flex items-center gap-1"><Linkedin size={12} /> {data.personalInfo.linkedin.replace(/^https?:\/\//, '')}</span>}
        {data.personalInfo.github && <span className="flex items-center gap-1"><Github size={12} /> {data.personalInfo.github.replace(/^https?:\/\//, '')}</span>}
      </div>
    </div>

    {/* Summary */}
    <div className="mb-6">
      <h3 className="text-base font-bold uppercase border-b border-black mb-2">Career Summary</h3>
      <p className="text-sm text-justify leading-relaxed">{data.summary}</p>
    </div>

    {/* Education */}
    <div className="mb-6">
      <h3 className="text-base font-bold uppercase border-b border-black mb-2">Education</h3>
      <div className="flex justify-between items-baseline font-bold text-sm">
        <span>{data.education.institution}</span>
        <span>{data.education.graduation}</span>
      </div>
      <div className="flex justify-between items-center text-sm italic mb-1">
        <span>{data.education.degree}</span>
        {data.education.gpa && <span>CGPA: {data.education.gpa}</span>}
      </div>
    </div>

    {/* Achievements */}
    {data.achievements && data.achievements.length > 0 && (
      <div className="mb-6">
        <h3 className="text-base font-bold uppercase border-b border-black mb-2">Achievements</h3>
        <ul className="list-disc list-outside ml-4 text-sm space-y-0.5">
          {data.achievements.map((ach, i) => <li key={i} className="pl-1">{ach}</li>)}
        </ul>
      </div>
    )}

    {/* Experience */}
    {data.experience.length > 0 && (
      <div className="mb-6">
        <h3 className="text-base font-bold uppercase border-b border-black mb-3">Experience</h3>
        <div className="space-y-4">
          {data.experience.map((exp, i) => (
            <div key={i}>
              <div className="flex justify-between items-baseline">
                <h4 className="font-bold text-sm uppercase">{exp.title}</h4>
                <span className="text-sm font-bold">{exp.duration}</span>
              </div>
              <div className="text-sm italic mb-1">{exp.company}</div>
              <p className="text-sm text-justify mb-1">{exp.description}</p>
              {exp.achievements && exp.achievements.length > 0 && (
                <ul className="list-disc list-outside ml-4 text-sm space-y-0.5">
                  {exp.achievements.map((ach, j) => <li key={j} className="pl-1">{ach}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Internships */}
    {data.internships && data.internships.length > 0 && (
      <div className="mb-6">
        <h3 className="text-base font-bold uppercase border-b border-black mb-3">Internships</h3>
        <div className="space-y-4">
          {data.internships.map((int, i) => (
            <div key={i}>
              <div className="flex justify-between items-baseline">
                <h4 className="font-bold text-sm uppercase">{int.title}</h4>
                <span className="text-sm font-bold">{int.duration}</span>
              </div>
              <div className="text-sm italic mb-1">{int.company}</div>
              <p className="text-sm text-justify mb-1">{int.description}</p>
              {int.achievements && int.achievements.length > 0 && (
                <ul className="list-disc list-outside ml-4 text-sm space-y-0.5">
                  {int.achievements.map((ach, j) => <li key={j} className="pl-1">{ach}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Projects (Mapped to resemble 'Achievements' or 'Projects' section) */}
    {data.projects.length > 0 && (
      <div className="mb-6">
        <h3 className="text-base font-bold uppercase border-b border-black mb-3">Projects</h3>
        <div className="space-y-3">
          {data.projects.map((proj, i) => (
            <div key={i}>
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-sm">{proj.title}</span>
                {/* Tech stack as minimal tags if needed, or inline */}
              </div>
              <p className="text-sm text-justify">{proj.description}</p>
              <div className="text-xs italic text-gray-600 mt-0.5">
                Tech: {proj.technologies.join(', ')}
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Skills - Simple List */}
    <div>
      <h3 className="text-base font-bold uppercase border-b border-black mb-2">Skills</h3>
      <div className="text-sm text-justify">
        {data.skills.join(' • ')}
      </div>
    </div>
  </div>
);

const CreativeTemplate = ({ data }) => (
  <div className="bg-[#1a1a1a] text-white h-full p-0 font-sans grid grid-cols-12 min-h-[800px]">
    <div className="col-span-4 bg-[#2d2d2d] p-8 flex flex-col items-center text-center">
      <div className="w-32 h-32 rounded-lg bg-gradient-to-tr from-pink-500 to-yellow-500 mb-6 flex items-center justify-center text-4xl font-bold shadow-2xl">
        {data.personalInfo.name.charAt(0)}
      </div>
      <h2 className="text-2xl font-bold mb-6">{data.personalInfo.name}</h2>

      <div className="w-full space-y-6 text-left">
        <div>
          <h3 className="text-pink-500 font-bold uppercase tracking-widest text-xs mb-3">Contact</h3>
          <div className="space-y-2 text-sm text-gray-300">
            <p className="flex items-center gap-2"><Mail size={12} /> <span className="truncate">{data.personalInfo.email}</span></p>
            <p className="flex items-center gap-2"><Phone size={12} /> {data.personalInfo.phone}</p>
            <p className="flex items-center gap-2"><MapPin size={12} /> {data.personalInfo.location}</p>
          </div>
        </div>

        <div>
          <h3 className="text-yellow-500 font-bold uppercase tracking-widest text-xs mb-3">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, i) => (
              <span key={i} className="px-2 py-1 border border-gray-600 rounded text-xs hover:border-pink-500 transition-colors cursor-default">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-blue-500 font-bold uppercase tracking-widest text-xs mb-3">Education</h3>
          <div className="text-xs text-gray-300">
            <p className="font-bold text-white mb-1">{data.education.degree}</p>
            <p>{data.education.institution}</p>
            <p className="text-gray-500 mt-1">{data.education.graduation}</p>
          </div>
        </div>
      </div>
    </div>

    <div className="col-span-8 p-10 bg-[#1a1a1a]">
      <div className="mb-10">
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 mb-4">
          HELLO.
        </h1>
        <p className="text-lg text-gray-300 leading-relaxed font-light border-l-4 border-pink-500 pl-4">
          {data.summary}
        </p>
      </div>

      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-6 flex items-center">
          <span className="text-pink-500 mr-2">/</span> Experience
        </h3>
        <div className="space-y-8">
          {data.experience.map((exp, i) => (
            <div key={i} className="relative">
              <div className="flex justify-between items-baseline mb-2">
                <h4 className="text-xl font-bold">{exp.title}</h4>
                <span className="text-sm text-gray-500">{exp.duration}</span>
              </div>
              <p className="text-yellow-500 text-sm font-semibold mb-2">{exp.company}</p>
              <p className="text-sm text-gray-400 mb-3">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-6 flex items-center">
          <span className="text-yellow-500 mr-2">/</span> Projects
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {data.projects.map((proj, i) => (
            <div key={i} className="bg-[#252525] p-4 rounded hover:bg-[#2a2a2a] transition-colors border border-gray-800">
              <h4 className="font-bold text-pink-500 mb-1">{proj.title}</h4>
              <p className="text-xs text-gray-400 mb-2">{proj.description}</p>
              <div className="flex gap-1">
                {proj.technologies.slice(0, 3).map((t, k) => <div key={k} className="w-2 h-2 rounded-full bg-gray-600"></div>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const MinimalTemplate = ({ data }) => (
  <div className="bg-white text-gray-900 h-full p-12 font-sans max-w-full mx-auto">
    <header className="mb-12">
      <h1 className="text-5xl font-light mb-4 tracking-tight">{data.personalInfo.name}</h1>
      <div className="text-sm text-gray-500 flex gap-6 font-medium uppercase tracking-wider">
        <span>{data.personalInfo.email}</span>
        <span>{data.personalInfo.phone}</span>
        <span>{data.personalInfo.location}</span>
      </div>
    </header>

    <div className="grid grid-cols-12 gap-12">
      <div className="col-span-8 space-y-12">
        <section>
          <p className="text-lg leading-relaxed text-gray-700 font-light">{data.summary}</p>
        </section>

        <section>
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Experience</h3>
          <div className="space-y-8">
            {data.experience.map((exp, i) => (
              <div key={i} className="group">
                <div className="flex justify-between items-baseline mb-2">
                  <h4 className="text-lg font-medium group-hover:text-black transition-colors">{exp.title}</h4>
                  <span className="text-sm text-gray-400 tabular-nums">{exp.duration}</span>
                </div>
                <div className="text-sm font-medium text-gray-500 mb-2">{exp.company}</div>
                <p className="text-sm text-gray-600 leading-relaxed max-w-lg">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Projects</h3>
          <div className="space-y-6">
            {data.projects.map((proj, i) => (
              <div key={i}>
                <h4 className="text-base font-medium mb-1">{proj.title}</h4>
                <p className="text-sm text-gray-600">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="col-span-4 space-y-12 border-l border-gray-100 pl-12">
        <section>
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Education</h3>
          <div>
            <div className="text-base font-medium">{data.education.institution}</div>
            <div className="text-sm text-gray-600 mb-1">{data.education.degree}</div>
            <div className="text-sm text-gray-400">{data.education.graduation}</div>
            {data.education.gpa && <div className="text-sm text-gray-400 mt-1">CGPA: {data.education.gpa}</div>}
          </div>
        </section>

        <section>
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Skills</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            {data.skills.map((skill, i) => (
              <li key={i} className="flex items-center">
                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-3"></span>
                {skill}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Connect</h3>
          <div className="space-y-3">
            {data.personalInfo.linkedin && <a href={data.personalInfo.linkedin} className="block text-sm text-gray-600 hover:text-black hover:underline decoration-1 underline-offset-4 truncate">LinkedIn</a>}
            {data.personalInfo.github && <a href={data.personalInfo.github} className="block text-sm text-gray-600 hover:text-black hover:underline decoration-1 underline-offset-4 truncate">GitHub</a>}
            {data.personalInfo.portfolio && <a href={data.personalInfo.portfolio} className="block text-sm text-gray-600 hover:text-black hover:underline decoration-1 underline-offset-4 truncate">Portfolio</a>}
          </div>
        </section>
      </div>
    </div>
  </div>
);


const AIResumeBuilder = ({ onSectionChange }) => {
  const { addToast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [resumeData, setResumeData] = useState({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      portfolio: ''
    },
    summary: '',
    experience: [],
    education: {
      degree: '',
      institution: '',
      graduation: '',
      gpa: ''
    },
    achievements: [],
    internships: [],
    skills: [],
    projects: []
  });

  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [previewMode, setPreviewMode] = useState(false);
  const printRef = useRef();
  const [zoomLevel, setZoomLevel] = useState(1.0);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.1, 1.5));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.1, 0.4));

  // Load profile data
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!mounted || !currentUser || !currentUser.profile) return;
        const profile = currentUser.profile;

        const edu = profile.education && profile.education.length > 0 ? profile.education[0] : {};

        // Map experiences
        let experiences = [];
        if (profile.experience && profile.experience.length > 0) experiences = [...profile.experience];
        if (profile.internships && profile.internships.length > 0) {
          const internMapped = profile.internships.map(i => ({
            ...i,
            title: i.role || i.title,
            description: i.description,
            duration: `${i.startDate || ''} - ${i.endDate || ''}`,
            achievements: i.description ? [i.description] : [] // Mock achievements if not structured
          }));
          experiences = [...experiences, ...internMapped];
        }

        // Map skills
        const skills = [
          ...(profile.skills?.programming || []),
          ...(profile.skills?.frameworks || []),
          ...(profile.skills?.tools || []),
          ...(profile.skills?.languages || [])
        ];

        setResumeData({
          personalInfo: {
            name: profile.personal.firstName ? `${profile.personal.firstName} ${profile.personal.lastName}` : '',
            email: profile.personal.email || currentUser.email || '',
            phone: profile.personal.phone || '',
            location: profile.personal.location || '',
            linkedin: profile.personal.linkedinUrl || '',
            github: profile.personal.githubUrl || '',
            portfolio: profile.personal.portfolioUrl || ''
          },
          summary: profile.personal.about || profile.personal.headline || '',
          education: {
            degree: edu.degree || '',
            institution: edu.institution || '',
            graduation: edu.endDate || '',
            gpa: edu.gpa || ''
          },
          achievements: [], // User can add manually
          experience: experiences.map(e => ({
            title: e.role || e.title || '',
            company: e.company || '',
            duration: (e.startDate && e.endDate) ? `${e.startDate} - ${e.endDate}` : e.duration || '',
            description: e.description || '',
            achievements: e.description ? e.description.split('.').filter(s => s.trim().length > 5) : []
          })),
          internships: (profile.internships || []).map(i => ({
            title: i.role || i.title || '',
            company: i.company || '',
            duration: (i.startDate && i.endDate) ? `${i.startDate} - ${i.endDate}` : '',
            description: i.description || '',
            achievements: i.description ? i.description.split('.').filter(s => s.trim().length > 5) : []
          })),
          projects: (profile.projects || []).map(p => ({
            title: p.title || '',
            description: p.description || '',
            technologies: Array.isArray(p.techStack) ? p.techStack : (typeof p.techStack === 'string' ? p.techStack.split(',') : [])
          })),
          skills: skills
        });
      } catch (err) {
        console.error('Failed to load user data', err);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const containerRef = useRef();

  // Auto-fit effect to fill the right side
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        // 210mm in pixels is approx 794px. We add minimal padding.
        const resumeWidth = 794;
        const padding = 40;

        // Calculate fit scale
        const fitScale = (containerWidth - padding) / resumeWidth;

        // Set zoom to fill the width (capped reasonably)
        setZoomLevel(Math.max(0.4, Math.min(fitScale, 1.5)));
      }
    };

    // Initial delay to ensure DOM is ready
    setTimeout(handleResize, 100);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [previewMode, selectedTemplate]);

  const templates = [
    { id: 'modern', name: 'Modern', color: 'bg-gradient-to-br from-blue-500 to-purple-600', preview: null, Component: ModernTemplate },
    { id: 'professional', name: 'Professional', color: 'bg-[#2C5F34]', preview: '/professional_template.png', Component: ProfessionalTemplate },
    { id: 'creative', name: 'Creative', color: 'bg-pink-600', preview: null, Component: CreativeTemplate },
    { id: 'minimal', name: 'Minimal', color: 'bg-gray-800', preview: null, Component: MinimalTemplate }
  ];

  const handleInputChange = (section, field, value) => {
    setResumeData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {

        // Helper to parse duration string "Jan 2020 - Present" -> {startDate, endDate}
        const parseDuration = (dur) => {
          if (!dur) return { startDate: '', endDate: '' };
          const parts = dur.split('-').map(s => s.trim());
          return {
            startDate: parts[0] || '',
            endDate: parts[1] || ''
          };
        };

        const updates = {
          personal: {
            ...currentUser.profile.personal,
            firstName: resumeData.personalInfo.name.split(' ')[0] || '',
            lastName: resumeData.personalInfo.name.split(' ').slice(1).join(' ') || '',
            about: resumeData.summary,
            phone: resumeData.personalInfo.phone,
            location: resumeData.personalInfo.location,
            // Assuming email is immutable at root, but can update contact email if desired
          },
          // Map Education
          education: [{
            institution: resumeData.education.institution,
            degree: resumeData.education.degree,
            endDate: resumeData.education.graduation, // Map graduation to endDate
            gpa: resumeData.education.gpa
          }],
          // Map Experience
          experience: resumeData.experience.map(e => {
            const { startDate, endDate } = parseDuration(e.duration);
            return {
              company: e.company,
              role: e.title,
              description: e.description,
              startDate,
              endDate
            };
          }),
          // Map Internships
          internships: resumeData.internships.map(i => {
            const { startDate, endDate } = parseDuration(i.duration);
            return {
              company: i.company,
              role: i.title,
              description: i.description,
              startDate,
              endDate
            };
          }),
          // Map Achievements
          achievements: resumeData.achievements,
          // Map Projects (Keep existing if not edited, or map if we added editor)
          projects: resumeData.projects.map(p => ({
            title: p.title,
            description: p.description,
            techStack: p.technologies
          })),
          // Map Skills (Merge or Overwrite? Overwrite simple list to programming for now to persist)
          skills: {
            ...currentUser.profile.skills,
            programming: resumeData.skills // Save flat list to 'programming' bucket as fallback
          }
        };

        const success = await updateUserProfile(currentUser.email, updates);
        if (success) {
          addToast('Profile fully synced!', 'success');
          // Reload to verify? No, state is already fresh.
        } else {
          addToast('Failed to sync profile', 'error');
        }
      }
    } catch (e) {
      console.error(e);
      addToast('Error saving', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const generateAI = async () => {
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 2000));
    setResumeData(prev => ({
      ...prev,
      summary: "Highly motivated and results-oriented professional with a proven track record of success. Skilled in problem-solving, communication, and collaboration. Dedicated to continuous learning and driving organizational growth through innovative solutions."
    }));
    setIsGenerating(false);
    addToast('AI Summary Generated!', 'success');
  };

  const handleDownload = () => {
    window.print();
  };

  const CurrentTemplate = templates.find(t => t.id === selectedTemplate)?.Component || ModernTemplate;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 pb-20 print:p-0 print:bg-white">
      <div className="max-w-7xl mx-auto print:max-w-none print:mx-0">

        {/* Header - Hidden in Print */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 print:hidden"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onSectionChange('dashboard')}
                className="p-2 text-[#2C5F34] hover:text-[#FFD700] hover:bg-white rounded-lg transition-all duration-200"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-[#1E293B]">AI Resume Builder</h1>
                <p className="text-gray-500 text-sm">Design, customize, and download your ATS-friendly resume</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200 p-1 mr-2">
                <button onClick={handleZoomOut} className="p-1.5 hover:bg-gray-100 rounded text-gray-600"><Minus size={14} /></button>
                <span className="text-xs font-medium w-12 text-center text-gray-700">{Math.round(zoomLevel * 100)}%</span>
                <button onClick={handleZoomIn} className="p-1.5 hover:bg-gray-100 rounded text-gray-600"><Plus size={14} /></button>
              </div>
              <Button onClick={handleSaveProfile} disabled={isSaving} leftIcon={<Save size={16} />} variant="ghost">
                {isSaving ? 'Syncing...' : 'Sync to Profile'}
              </Button>
              <Button onClick={() => setPreviewMode(!previewMode)} leftIcon={<Eye size={16} />} variant={previewMode ? 'secondary' : 'outline'}>
                {previewMode ? 'Edit Mode' : 'Preview Mode'}
              </Button>
              <Button onClick={handleDownload} leftIcon={<Download size={16} />} className="shadow-lg shadow-green-900/20">
                Download PDF
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-8 print:block">

          {/* Editor Sidebar - Hidden in Print & Full Preview */}
          {!previewMode && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full md:w-[350px] shrink-0 space-y-6 print:hidden h-auto md:h-[calc(100vh-140px)] overflow-y-auto scrollbar-hide"
            >
              {/* Template Selector */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Select Template</h2>
                <div className="grid grid-cols-2 gap-4">
                  {templates.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTemplate(t.id)}
                      className={`relative overflow-hidden rounded-lg aspect-[210/297] transition-all duration-300 group ${selectedTemplate === t.id ? 'ring-2 ring-green-600 ring-offset-2 scale-[1.02]' : 'hover:scale-[1.02] opacity-80 hover:opacity-100'}`}
                    >
                      {t.preview ? (
                        <div className="w-full h-full p-1 bg-gray-50">
                          <img src={t.preview} alt={t.name} className="w-full h-full object-contain shadow-sm bg-white border border-gray-100" />
                        </div>
                      ) : (
                        <div className={`w-full h-full ${t.color} opacity-20 flex items-center justify-center`}>
                          <span className="text-xs font-bold opacity-50">{t.name}</span>
                        </div>
                      )}

                      {/* Overlay Label */}
                      <div className={`absolute bottom-0 left-0 right-0 p-2 bg-white/90 backdrop-blur-sm text-xs font-bold text-center border-t border-gray-100`}>
                        {t.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Data Editor */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center">
                    <User size={16} className="mr-2 text-green-600" /> Personal Info
                  </h3>
                  <div className="space-y-3">
                    <input className="input-field-sm" placeholder="Full Name" value={resumeData.personalInfo.name} onChange={e => handleInputChange('personalInfo', 'name', e.target.value)} />
                    <input className="input-field-sm" placeholder="Email" value={resumeData.personalInfo.email} onChange={e => handleInputChange('personalInfo', 'email', e.target.value)} />
                    <input className="input-field-sm" placeholder="Phone" value={resumeData.personalInfo.phone} onChange={e => handleInputChange('personalInfo', 'phone', e.target.value)} />
                    <input className="input-field-sm" placeholder="Location" value={resumeData.personalInfo.location} onChange={e => handleInputChange('personalInfo', 'location', e.target.value)} />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center justify-between">
                    <span className="flex items-center"><FileText size={16} className="mr-2 text-green-600" /> Summary</span>
                    <button onClick={generateAI} disabled={isGenerating} className="text-xs text-purple-600 font-bold hover:underline flex items-center">
                      <Wand2 size={12} className="mr-1" /> {isGenerating ? 'Writer working...' : 'AI Rewrite'}
                    </button>
                  </h3>
                  <textarea
                    className="input-field-sm min-h-[100px]"
                    placeholder="Professional summary..."
                    value={resumeData.summary}
                    onChange={e => setResumeData(p => ({ ...p, summary: e.target.value }))}
                  />
                </div>

                {/* Education Edit */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center">
                    <GraduationCap size={16} className="mr-2 text-green-600" /> Education
                  </h3>
                  <div className="space-y-3">
                    <input className="input-field-sm" placeholder="Institution Name" value={resumeData.education.institution} onChange={e => handleInputChange('education', 'institution', e.target.value)} />
                    <input className="input-field-sm" placeholder="Degree / Major" value={resumeData.education.degree} onChange={e => handleInputChange('education', 'degree', e.target.value)} />
                    <div className="grid grid-cols-2 gap-2">
                      <input className="input-field-sm" placeholder="Graduation Date" value={resumeData.education.graduation} onChange={e => handleInputChange('education', 'graduation', e.target.value)} />
                      <input className="input-field-sm" placeholder="CGPA" value={resumeData.education.gpa} onChange={e => handleInputChange('education', 'gpa', e.target.value)} />
                    </div>
                  </div>
                </div>

                {/* Achievements Edit */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center justify-between">
                    <span className="flex items-center"><Award size={16} className="mr-2 text-green-600" /> Achievements</span>
                    <button onClick={() => setResumeData(p => ({ ...p, achievements: [...p.achievements, ''] }))} className="text-xs text-green-600 font-bold hover:underline">+ Add</button>
                  </h3>
                  <div className="space-y-2">
                    {resumeData.achievements.map((ach, i) => (
                      <div key={i} className="flex gap-2">
                        <input
                          className="input-field-sm flex-1"
                          placeholder="Achievement..."
                          value={ach}
                          onChange={e => {
                            const newAch = [...resumeData.achievements];
                            newAch[i] = e.target.value;
                            setResumeData(p => ({ ...p, achievements: newAch }));
                          }}
                        />
                        <button onClick={() => setResumeData(p => ({ ...p, achievements: p.achievements.filter((_, idx) => idx !== i) }))} className="text-red-500 hover:bg-red-50 p-1 rounded"><Minus size={14} /></button>
                      </div>
                    ))}
                    {resumeData.achievements.length === 0 && <p className="text-xs text-gray-400 italic">No achievements added.</p>}
                  </div>
                </div>

                {/* Experience Edit */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center justify-between">
                    <span className="flex items-center"><Briefcase size={16} className="mr-2 text-green-600" /> Experience</span>
                    <button onClick={() => setResumeData(p => ({ ...p, experience: [...p.experience, { title: '', company: '', duration: '', description: '' }] }))} className="text-xs text-green-600 font-bold hover:underline">+ Add</button>
                  </h3>
                  <div className="space-y-4">
                    {resumeData.experience.map((exp, i) => (
                      <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-100 relative group">
                        <button onClick={() => setResumeData(p => ({ ...p, experience: p.experience.filter((_, idx) => idx !== i) }))} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Minus size={14} /></button>
                        <div className="space-y-2">
                          <input className="input-field-sm bg-white" placeholder="Job Title" value={exp.title} onChange={e => {
                            const newExp = [...resumeData.experience]; newExp[i].title = e.target.value; setResumeData(p => ({ ...p, experience: newExp }));
                          }} />
                          <input className="input-field-sm bg-white" placeholder="Company" value={exp.company} onChange={e => {
                            const newExp = [...resumeData.experience]; newExp[i].company = e.target.value; setResumeData(p => ({ ...p, experience: newExp }));
                          }} />
                          <input className="input-field-sm bg-white" placeholder="Duration (e.g. Jan 2020 - Present)" value={exp.duration} onChange={e => {
                            const newExp = [...resumeData.experience]; newExp[i].duration = e.target.value; setResumeData(p => ({ ...p, experience: newExp }));
                          }} />
                          <textarea className="input-field-sm bg-white min-h-[60px]" placeholder="Description..." value={exp.description} onChange={e => {
                            const newExp = [...resumeData.experience]; newExp[i].description = e.target.value; setResumeData(p => ({ ...p, experience: newExp }));
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Internships Edit */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center justify-between">
                    <span className="flex items-center"><Sparkles size={16} className="mr-2 text-green-600" /> Internships</span>
                    <button onClick={() => setResumeData(p => ({ ...p, internships: [...p.internships, { title: '', company: '', duration: '', description: '' }] }))} className="text-xs text-green-600 font-bold hover:underline">+ Add</button>
                  </h3>
                  <div className="space-y-4">
                    {resumeData.internships.map((int, i) => (
                      <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-100 relative group">
                        <button onClick={() => setResumeData(p => ({ ...p, internships: p.internships.filter((_, idx) => idx !== i) }))} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Minus size={14} /></button>
                        <div className="space-y-2">
                          <input className="input-field-sm bg-white" placeholder="Role" value={int.title} onChange={e => {
                            const newInt = [...resumeData.internships]; newInt[i].title = e.target.value; setResumeData(p => ({ ...p, internships: newInt }));
                          }} />
                          <input className="input-field-sm bg-white" placeholder="Company/Org" value={int.company} onChange={e => {
                            const newInt = [...resumeData.internships]; newInt[i].company = e.target.value; setResumeData(p => ({ ...p, internships: newInt }));
                          }} />
                          <input className="input-field-sm bg-white" placeholder="Duration" value={int.duration} onChange={e => {
                            const newInt = [...resumeData.internships]; newInt[i].duration = e.target.value; setResumeData(p => ({ ...p, internships: newInt }));
                          }} />
                          <textarea className="input-field-sm bg-white min-h-[60px]" placeholder="Description..." value={int.description} onChange={e => {
                            const newInt = [...resumeData.internships]; newInt[i].description = e.target.value; setResumeData(p => ({ ...p, internships: newInt }));
                          }} />
                        </div>
                      </div>
                    ))}
                    {resumeData.internships.length === 0 && <p className="text-xs text-gray-400 italic">No internships added.</p>}
                  </div>
                </div>

                {/* Quick Skills Edit */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center">
                    <Award size={16} className="mr-2 text-green-600" /> Skills (Preview)
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.skills.length > 0 ? resumeData.skills.slice(0, 8).map((s, i) => (
                      <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{s}</span>
                    )) : <span className="text-xs text-gray-400 italic">No skills loaded from profile</span>}
                    {resumeData.skills.length > 8 && <span className="text-xs text-gray-400">+{resumeData.skills.length - 8} more</span>}
                  </div>
                  <p className="text-xs text-gray-400 mt-2 italic">Edit full skills in Profile Builder</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Live Preview Area */}
          {/* Live Preview Area */}
          {/* Live Preview Area */}
          {/* Live Preview Area - Takes Remaining Space */}
          <div
            ref={containerRef}
            className="flex-1 bg-gray-500/5 rounded-2xl flex flex-col items-center p-4 md:p-8 overflow-hidden print:p-0 print:bg-white print:h-auto"
          >
            {/* Scaling Wrapper */}
            <div
              id="resume-scaling-wrapper"
              className="relative transition-transform duration-200 ease-out origin-top shadow-2xl print:shadow-none print:w-full print:h-auto print:transform-none"
              style={{
                width: '210mm',
                minHeight: '297mm',
                transform: `scale(${zoomLevel})`,
                marginBottom: `${-(297 * (1 - zoomLevel))}mm` // Correct footer margin
              }}
            >
              {/* The Resume Paper */}
              <div
                id="resume-preview-container"
                ref={printRef}
                className="bg-white w-full h-full min-h-[297mm] print:min-h-0"
              >
                <CurrentTemplate data={resumeData} />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Print Styles for clean A4 */}
      <style>{`
        @media print {
          @page { margin: 0; size: auto; }
          
          /* Hide the body content but keep layout (prevents blank pages from height collapse) */
          body {
            visibility: hidden;
          }

          /* Position the resume overlaying everything */
          #resume-preview-container {
            visibility: visible !important;
            position: absolute;
            left: 0;
            top: 0;
            width: 210mm; /* Force A4 width */
            height: auto;
            margin: 0;
            padding: 0;
            background: white;
            z-index: 99999;
          }

          /* Ensure wrapper doesn't affect layout in print */
          #resume-scaling-wrapper {
             visibility: visible !important;
             transform: none !important;
             position: absolute;
             top: 0;
             left: 0;
             margin: 0 !important;
             padding: 0 !important;
             width: 100% !important;
             height: auto !important;
          }

          /* Ensure children are visible */
          #resume-preview-container * {
            visibility: visible !important;
          }

          /* Reset any transforms checking specifically for the print class */
          .print\\:scale-100 { transform: none !important; }
        }
      `}</style>
    </div>
  );
};

export default AIResumeBuilder;