import { useState } from 'react';
import axios from 'axios';
import { BookOpen, MessageSquare, FileText, LogOut, Send, Paperclip, Calendar, Award, TrendingUp, Clock } from 'lucide-react';

export default function ParentDashboard() {
  const [activeTab, setActiveTab] = useState('communication');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [emailMessage, setEmailMessage] = useState('');
  const [selectedChild, setSelectedChild] = useState('1');
  const [uploadedFileName, setUploadedFileName] = useState('');

  const languages = [
    'English', 'German', 'French', 'Spanish', 'Arabic', 'Portuguese',
    'Italian', 'Dutch', 'Polish', 'Ukrainian', 'Russian', 'Turkish',
    'Swahili', 'Chinese', 'Hindi'
  ];

  const children = [
    { id: '1', name: 'Alice Johnson', class: '10A', teacher: 'Mrs. Anderson' },
    { id: '2', name: 'Tom Johnson', class: '8B', teacher: 'Mr. Williams' }
  ];

  const conversations = [
    { from: 'teacher', text: 'Alice is doing excellent in class! She participated actively in today\'s Spanish conversation practice.', date: '2025-10-20', time: '2:30 PM', read: true },
    { from: 'parent', text: 'Thank you for the update! We\'re very proud of her progress.', date: '2025-10-20', time: '6:45 PM', read: true },
    { from: 'teacher', text: 'Just a reminder that the Cultural Heritage essay is due this Friday.', date: '2025-10-22', time: '10:15 AM', read: false }
  ];

  const attendanceData = [
    { month: 'August', present: 20, absent: 2, late: 1 },
    { month: 'September', present: 22, absent: 0, late: 0 },
    { month: 'October', present: 18, absent: 1, late: 2 }
  ];

  const grades = [
    { subject: 'Spanish Language', assignment: 'Vocabulary Quiz Chapter 3', grade: 'A', score: '95%', date: '2025-10-18' },
    { subject: 'French Language', assignment: 'Translation Practice', grade: 'B+', score: '88%', date: '2025-10-15' },
    { subject: 'Spanish Language', assignment: 'Essay: My Cultural Heritage', grade: 'A-', score: '92%', date: '2025-10-20' },
    { subject: 'German Language', assignment: 'Grammar Exercises', grade: 'A', score: '96%', date: '2025-10-12' }
  ];

  const getSelectedChild = () => children.find(c => c.id === selectedChild);

  const handleSendMessage = () => {
    if (emailMessage || uploadedFileName) {
      alert('Message sent to teacher!');
      setEmailMessage('');
      setUploadedFileName('');
    } else {
      alert('Please write a message or attach a file');
    }
  };

  const handleAttachFile = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.jpg,.png';

    input.onchange = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post('http://localhost:5000/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (response.data.filePath) {
          alert(`✅ File uploaded: ${file.name}`);
          setUploadedFileName(file.name);
          console.log('File path on server:', response.data.filePath);
        }
      } catch (err) {
        console.error('Upload failed:', err);
        alert('❌ Upload failed, please try again.');
      }
    };

    input.click();
  };

  const calculateAttendancePercentage = () => {
    const total = attendanceData.reduce((acc, month) => acc + month.present + month.absent, 0);
    const present = attendanceData.reduce((acc, month) => acc + month.present, 0);
    return ((present / total) * 100).toFixed(1);
  };

  const calculateAverageGrade = () => {
    const total = grades.reduce((acc, grade) => acc + parseFloat(grade.score), 0);
    return (total / grades.length).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-400 via-teal-500 to-cyan-600">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen size={32} className="text-purple-600" />
            <h1 className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              CLASSCONNECT
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm text-gray-500">Parent Account</p>
              <p className="font-bold text-gray-800">Mr. & Mrs. Johnson</p>
              <p className="text-xs text-gray-500">{children.length} {children.length === 1 ? 'Child' : 'Children'}</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all">
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Child Selector */}
      {children.length > 1 && (
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="bg-white rounded-xl shadow-md p-4">
            <label className="block text-gray-700 font-bold mb-2">Select Child:</label>
            <select
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              className="w-full md:w-auto px-6 py-3 border-2 border-teal-300 rounded-lg font-semibold text-teal-600 focus:outline-none focus:border-teal-500"
            >
              {children.map(child => (
                <option key={child.id} value={child.id}>
                  {child.name} - Class {child.class} (Teacher: {child.teacher})
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-3 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('communication')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
              activeTab === 'communication'
                ? 'bg-linear-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <MessageSquare size={20} />
            Communication
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
              activeTab === 'reports'
                ? 'bg-linear-to-r from-blue-500 to-cyan-500 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FileText size={20} />
            Reports & Grades
          </button>
        </div>

        {/* Communication Tab */}
        {activeTab === 'communication' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-purple-600">Communication with Teacher</h2>
                <p className="text-gray-600 mt-1">
                  Teacher: {getSelectedChild()?.teacher} - Class {getSelectedChild()?.class}
                </p>
              </div>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-4 py-2 border-2 border-purple-300 rounded-lg font-semibold text-purple-600"
              >
                {languages.map(lang => (
                  <option key={lang} value={lang.toLowerCase()}>{lang}</option>
                ))}
              </select>
            </div>

            {/* Message History */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6 max-h-96 overflow-y-auto">
              <div className="space-y-4">
                {conversations.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.from === 'parent' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-2xl ${msg.from === 'parent' ? 'ml-12' : 'mr-12'}`}>
                      <div className={`p-4 rounded-xl ${
                        msg.from === 'teacher' 
                          ? 'bg-white border-2 border-purple-200' 
                          : 'bg-linear-to-r from-purple-500 to-pink-500 text-white'
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-bold">
                            {msg.from === 'teacher' ? getSelectedChild()?.teacher : 'You'}
                          </span>
                          {!msg.read && msg.from === 'teacher' && (
                            <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">New</span>
                          )}
                        </div>
                        <p className="mb-2">{msg.text}</p>
                        <p className={`text-xs ${msg.from === 'parent' ? 'text-white/70' : 'text-gray-500'}`}>
                          {msg.date} at {msg.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <div className="space-y-3">
              <textarea
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                placeholder="Type your message to the teacher..."
                className="w-full h-32 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none resize-none text-lg"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleAttachFile}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-semibold"
                >
                  <Paperclip size={18} />
                  Attach File
                </button>
                <button
                  onClick={handleSendMessage}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-lg font-bold hover:shadow-lg transition-all"
                >
                  <Send size={18} />
                  Send Message
                </button>
              </div>
              {uploadedFileName && (
                <p className="mt-2 text-green-600 font-semibold">Uploaded: {uploadedFileName}</p>
              )}
            </div>
          </div>
        )}

        {/* Reports & Grades Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            {/* Language Selector */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-blue-600">Academic Reports</h2>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="px-4 py-2 border-2 border-blue-300 rounded-lg font-semibold text-blue-600"
                >
                  {languages.map(lang => (
                    <option key={lang} value={lang.toLowerCase()}>{lang}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-linear-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <Calendar size={32} />
                  <span className="text-4xl font-bold">{calculateAttendancePercentage()}%</span>
                </div>
                <h3 className="text-xl font-bold mb-1">Attendance Rate</h3>
                <p className="text-sm opacity-90">Overall attendance this term</p>
              </div>

              <div className="bg-linear-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <Award size={32} />
                  <span className="text-4xl font-bold">{calculateAverageGrade()}%</span>
                </div>
                <h3 className="text-xl font-bold mb-1">Average Grade</h3>
                <p className="text-sm opacity-90">Across all subjects</p>
              </div>

              <div className="bg-linear-to-br from-purple-500 to-pink-600 rounded-2xl shadow-xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp size={32} />
                  <span className="text-4xl font-bold">A-</span>
                </div>
                <h3 className="text-xl font-bold mb-1">Current Grade</h3>
                <p className="text-sm opacity-90">Overall performance</p>
              </div>
            </div>

            {/* Attendance Report */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-green-600 mb-6">Attendance Report</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-linear-to-r from-green-500 to-emerald-600 text-white">
                      <th className="px-6 py-4 text-left font-bold">Month</th>
                      <th className="px-6 py-4 text-center font-bold">Present</th>
                      <th className="px-6 py-4 text-center font-bold">Absent</th>
                      <th className="px-6 py-4 text-center font-bold">Late</th>
                      <th className="px-6 py-4 text-center font-bold">Attendance %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceData.map((month, idx) => {
                      const total = month.present + month.absent;
                      const percentage = ((month.present / total) * 100).toFixed(1);
                      return (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="px-6 py-4 font-semibold">{month.month}</td>
                          <td className="px-6 py-4 text-center">
                            <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full font-bold">{month.present}</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full font-bold">{month.absent}</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full font-bold">{month.late}</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="font-bold text-lg">{percentage}%</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Grades Report */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-blue-600 mb-6">Recent Grades</h3>
              <div className="space-y-4">
                {grades.map((grade, idx) => (
                  <div key={idx} className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full font-bold text-sm">{grade.subject}</span>
                          <span className="px-4 py-1 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold text-lg">{grade.grade}</span>
                        </div>
                        <h4 className="text-lg font-bold text-gray-800">{grade.assignment}</h4>
                        <p className="text-gray-600 mt-1 flex items-center gap-2"><Clock size={16} />{grade.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-blue-600">{grade.score}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
