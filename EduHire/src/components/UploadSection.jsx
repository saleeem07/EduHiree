import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  Download, 
  ArrowLeft, 
  CheckCircle,
  X,
  Eye,
  Trash2
} from 'lucide-react';

const UploadSection = ({ onSectionChange }) => {
  const [uploadedFiles, setUploadedFiles] = useState([
    {
      id: 1,
      name: 'Sarah_Johnson_Resume.pdf',
      type: 'resume',
      size: '245 KB',
      uploadDate: '2024-01-15',
      status: 'uploaded'
    },
    {
      id: 2,
      name: 'Sarah_Johnson_CV.pdf',
      type: 'cv',
      size: '1.2 MB',
      uploadDate: '2024-01-10',
      status: 'uploaded'
    },
    {
      id: 3,
      name: 'AWS_Certification.pdf',
      type: 'certificate',
      size: '890 KB',
      uploadDate: '2024-01-05',
      status: 'uploaded'
    }
  ]);

  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files) => {
    Array.from(files).forEach(file => {
      const newFile = {
        id: Date.now() + Math.random(),
        name: file.name,
        type: getFileType(file.name),
        size: formatFileSize(file.size),
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'uploading'
      };
      
      setUploadedFiles(prev => [...prev, newFile]);
      
      // Simulate upload
      setTimeout(() => {
        setUploadedFiles(prev => 
          prev.map(f => f.id === newFile.id ? { ...f, status: 'uploaded' } : f)
        );
      }, 2000);
    });
  };

  const getFileType = (fileName) => {
    const lowerName = fileName.toLowerCase();
    if (lowerName.includes('resume')) return 'resume';
    if (lowerName.includes('cv')) return 'cv';
    if (lowerName.includes('cert') || lowerName.includes('certificate')) return 'certificate';
    return 'other';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const removeFile = (id) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'resume':
        return <FileText className="w-8 h-8 text-blue-500" />;
      case 'cv':
        return <FileText className="w-8 h-8 text-green-500" />;
      case 'certificate':
        return <FileText className="w-8 h-8 text-purple-500" />;
      default:
        return <FileText className="w-8 h-8 text-gray-500" />;
    }
  };

  const getFileTypeLabel = (type) => {
    switch (type) {
      case 'resume':
        return 'Resume';
      case 'cv':
        return 'CV';
      case 'certificate':
        return 'Certificate';
      default:
        return 'Document';
    }
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
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={() => onSectionChange('dashboard')}
              className="p-2 text-[#2C5F34] hover:text-[#FFD700] hover:bg-white rounded-lg transition-all duration-200"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-3xl font-bold text-[#1E293B]">Document Upload</h1>
          </div>
          <p className="text-gray-600">Upload your resumes, CVs, certificates, and other important documents for your profile.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Area */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Upload Zone */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-xl font-semibold text-[#1E293B] mb-6">Upload Documents</h2>
              
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                  dragActive 
                    ? 'border-[#2C5F34] bg-[#F3F4F6]' 
                    : 'border-gray-300 hover:border-[#2C5F34]'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-[#1E293B] mb-2">
                  Drop files here or click to upload
                </h3>
                <p className="text-gray-600 mb-4">
                  Upload your resume, CV, certificates, and other documents
                </p>
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleFiles(e.target.files)}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.txt"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center space-x-2 bg-[#2C5F34] text-white px-6 py-3 rounded-lg hover:bg-[#FFD700] hover:text-[#1E293B] transition-all duration-200 cursor-pointer"
                >
                  <Upload size={18} />
                  <span>Choose Files</span>
                </label>
                <p className="text-sm text-gray-500 mt-2">
                  Supported formats: PDF, DOC, DOCX, TXT (Max 10MB per file)
                </p>
              </div>
            </div>

            {/* Upload Guidelines */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-[#1E293B] mb-4">Upload Guidelines</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-[#2C5F34] mt-0.5 flex-shrink-0" />
                  <span>Use clear, descriptive filenames (e.g., "Sarah_Johnson_Resume_2024.pdf")</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-[#2C5F34] mt-0.5 flex-shrink-0" />
                  <span>Ensure documents are up-to-date and error-free</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-[#2C5F34] mt-0.5 flex-shrink-0" />
                  <span>Keep file sizes under 10MB for faster uploads</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-[#2C5F34] mt-0.5 flex-shrink-0" />
                  <span>PDF format is recommended for best compatibility</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Uploaded Files */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <h2 className="text-xl font-semibold text-[#1E293B] mb-6">Uploaded Documents</h2>
            
            {uploadedFiles.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No documents uploaded yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getFileIcon(file.type)}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium text-[#1E293B]">{file.name}</h3>
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              {getFileTypeLabel(file.type)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {file.size} • Uploaded {file.uploadDate}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {file.status === 'uploading' && (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#2C5F34]"></div>
                        )}
                        {file.status === 'uploaded' && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                        <button
                          onClick={() => removeFile(file.id)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UploadSection; 