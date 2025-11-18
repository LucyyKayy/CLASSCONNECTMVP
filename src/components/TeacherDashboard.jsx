import { useState } from 'react';
import { BookOpen, Upload, FileText, MessageSquare, Award, LogOut, Send, Paperclip, Eye, Calendar, Users, CheckCircle } from 'lucide-react';

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState('upload');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [selectedStudent, setSelectedStudent] = useState('all');
  const [emailMessage, setEmailMessage] = useState('');
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [assignmentDesc, setAssignmentDesc] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignTo, setAssignTo] = useState('all');
  const [file, setFile] = useState(null);
  const [attachedFile, setAttachedFile] = useState(null);

  const languages = [
    'English', 'German', 'French', 'Spanish', 'Arabic', 'Portuguese',
    'Italian', 'Dutch', 'Polish', 'Ukrainian', 'Russian', 'Turkish',
    'Swahili', 'Chinese', 'Hindi'
  ];

  const students = [
    { id: 1, name: 'Alice Johnson', parentEmail: 'alice.parent@email.com', class: '10A' },
    { id: 2, name: 'Bob Smith', parentEmail: 'bob.parent@email.com', class: '10A' },
    { id: 3, name: 'Carol Williams', parentEmail: 'carol.parent@email.com', class: '10A' },
    { id: 4, name: 'David Brown', parentEmail: 'david.parent@email.com', class: '10A' },
    { id: 5, name: 'Emma Davis', parentEmail: 'emma.parent@email.com', class: '10A' }
  ];

  const submissions = [
    { id: 1, studentName: 'Alice Johnson', assignment: 'Essay: My Cultural Heritage', submittedDate: '2025-10-20', status: 'submitted', grade: null },
    { id: 2, studentName: 'Bob Smith', assignment: 'Vocabulary Quiz Chapter 3', submittedDate: '2025-10-21', status: 'submitted', grade: 'A' },
    { id: 3, studentName: 'Carol Williams', assignment: 'Translation Practice', submittedDate: '2025-10-19', status: 'submitted', grade: 'B+' }
  ];

   const submissionsWithFiles = [
  {
    id: 1,
    studentName: 'Alice Johnson',
    assignment: 'Essay: My Cultural Heritage',
    submittedDate: '2025-10-20',
    status: 'submitted',
    grade: null,
    fileUrl: 'http://localhost:5000/uploads/sample1.pdf'
  },
  {
    id: 2,
    studentName: 'Bob Smith',
    assignment: 'Vocabulary Quiz Chapter 3',
    submittedDate: '2025-10-21',
    status: 'submitted',
    grade: 'A',
    fileUrl: 'http://localhost:5000/uploads/sample2.pdf'
  },
  {
    id: 3,
    studentName: 'Carol Williams',
    assignment: 'Translation Practice',
    submittedDate: '2025-10-19',
    status: 'submitted',
    grade: 'B+',
    fileUrl: null
  }
];

  const conversations = [
    { studentId: 1, messages: [
      { from: 'teacher', text: 'Alice is doing great in class!', date: '2025-10-18', read: true },
      { from: 'parent', text: 'Thank you for the update!', date: '2025-10-19', read: true }
    ]},
    { studentId: 2, messages: [
      { from: 'teacher', text: 'Bob needs to improve attendance.', date: '2025-10-15', read: true }
    ]}
  ];

  const handleUploadAssignment = async () => {
  if (!assignmentTitle || !assignmentDesc || !dueDate) {
    alert("Please fill in all fields");
    return;
  }

  const formData = new FormData();
  formData.append("title", assignmentTitle);
  formData.append("description", assignmentDesc);
  formData.append("dueDate", dueDate);
  formData.append("teacherId", "T1234"); // example teacher ID
  formData.append("className", "10A");
  formData.append("language", selectedLanguage);
  if (file) formData.append("file", file);

  try {
    const response = await fetch("http://localhost:5000/api/assignments", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (response.ok) {
      alert("✅ Assignment uploaded successfully!");
      setAssignmentTitle("");
      setAssignmentDesc("");
      setDueDate("");
      setFile(null);
    } else {
      alert(`❌ Upload failed: ${data.error || data.message}`);
    }
  } catch (error) {
    console.error("Upload error:", error);
    alert("❌ Network error while uploading.");
  }
};


  const handleSendEmail = () => {
    if (emailMessage) {
      const recipient = selectedStudent === 'all' ? 'all parents' : students.find(s => s.id === parseInt(selectedStudent))?.name;
      alert(`Email sent to ${recipient}!`);
      setEmailMessage('');
    } else {
      alert('Please write a message');
    }
  };

  const handleGradeAssignment = (submissionId) => {
    const grade = prompt('Enter grade (e.g., A, B+, 95):');
    if (grade) {
      alert(`Grade "${grade}" assigned to submission #${submissionId}`);
    }
  };

  const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setAttachedFile(file);
    alert(`File attached: ${file.name}`);
  }
};


  const getStudentConversation = (studentId) => {
    return conversations.find(c => c.studentId === studentId)?.messages || [];
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-teal-400 via-blue-500 to-purple-600">
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
              <p className="text-sm text-gray-500">Welcome,</p>
              <p className="font-bold text-gray-800">Mrs. Anderson</p>
              <p className="text-xs text-gray-500">Class 10A Teacher</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all">
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-3 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
              activeTab === 'upload'
                ? 'bg-linear-to-r from-blue-500 to-cyan-500 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Upload size={20} />
            Upload Assignment
          </button>
          <button
            onClick={() => setActiveTab('submissions')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
              activeTab === 'submissions'
                ? 'bg-linear-to-r from-green-500 to-teal-500 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FileText size={20} />
            Receive & Grade
          </button>
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
            onClick={() => setActiveTab('gradebook')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
              activeTab === 'gradebook'
                ? 'bg-linear-to-r from-orange-500 to-red-500 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Award size={20} />
            Gradebook
          </button>
        </div>

        {/* Upload Assignment Tab */}
        {activeTab === 'upload' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-blue-600">Upload New Assignment</h2>
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

            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-lg">Assignment Title</label>
                <input
                  type="text"
                  value={assignmentTitle}
                  onChange={(e) => setAssignmentTitle(e.target.value)}
                  placeholder="Enter assignment title"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2 text-lg">Description</label>
                <textarea
                  value={assignmentDesc}
                  onChange={(e) => setAssignmentDesc(e.target.value)}
                  placeholder="Describe the assignment requirements..."
                  className="w-full h-40 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-bold mb-2 text-lg">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2 text-lg">Assign To</label>
                  <select
                    value={assignTo}
                    onChange={(e) => setAssignTo(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  >
                    <option value="all">All Students</option>
                    {students.map(student => (
                      <option key={student.id} value={student.id}>{student.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2 text-lg">Attach Files</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-all cursor-pointer">
  <label className="cursor-pointer">
    <Upload size={48} className="mx-auto text-gray-400 mb-3" />
    <p className="text-gray-600">Click to upload or drag and drop</p>
    <p className="text-gray-400 text-sm">PDF, DOC, DOCX up to 10MB</p>
    <input
      type="file"
      accept=".pdf,.doc,.docx"
      className="hidden"
      onChange={(e) => setFile(e.target.files[0])}
    />
  </label>
  {file && <p className="mt-2 text-green-600 font-semibold">{file.name}</p>}
</div>
              </div>

              <button
                onClick={handleUploadAssignment}
                className="w-full py-4 bg-linear-to-r from-blue-500 to-cyan-500 text-white text-lg font-bold rounded-lg hover:shadow-lg transition-all"
              >
                Upload Assignment
              </button>
            </div>
          </div>
        )}

        {/* Submissions & Grading Tab */}
        {activeTab === 'submissions' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-green-600">Student Submissions</h2>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-4 py-2 border-2 border-green-300 rounded-lg font-semibold text-green-600"
              >
                {languages.map(lang => (
                  <option key={lang} value={lang.toLowerCase()}>{lang}</option>
                ))}
              </select>
            </div>

            <div className="space-y-4">
              {submissionsWithFiles.map(submission => (
                <div key={submission.id} className="border-2 border-gray-200 rounded-xl p-6 hover:border-green-500 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-800">{submission.studentName}</h3>
                        {submission.grade && (
                          <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full font-bold">
                            Grade: {submission.grade}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 font-semibold">{submission.assignment}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          Submitted: {submission.submittedDate}
                        </span>
                        <span className="flex items-center gap-1 text-green-600">
                          <CheckCircle size={14} />
                          {submission.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all">
                        <Eye size={18} />
                        View
                      </button>

                      <button
                        onClick={() => handleGradeAssignment(submission.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-green-500 to-teal-500 text-white rounded-lg hover:shadow-lg transition-all"
                      >
                        <Award size={18} />
                        {submission.grade ? 'Update Grade' : 'Grade'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Communication Tab */}
        {activeTab === 'communication' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Student List */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-purple-600">Students & Parents</h3>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="px-3 py-1 border-2 border-purple-300 rounded-lg text-sm font-semibold text-purple-600"
                >
                  {languages.map(lang => (
                    <option key={lang} value={lang.toLowerCase()}>{lang}</option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={() => setSelectedStudent('all')}
                className={`w-full p-4 mb-3 rounded-lg font-bold text-left transition-all ${
                  selectedStudent === 'all'
                    ? 'bg-linear-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Users size={20} />
                  All Parents
                </div>
              </button>

              <div className="space-y-2">
                {students.map(student => (
                  <button
                    key={student.id}
                    onClick={() => setSelectedStudent(student.id.toString())}
                    className={`w-full p-4 rounded-lg text-left transition-all ${
                      selectedStudent === student.id.toString()
                        ? 'bg-linear-to-r from-purple-500 to-pink-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <p className="font-bold">{student.name}</p>
                    <p className="text-sm opacity-80">{student.parentEmail}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Conversation Area */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-6 flex flex-col">
              <h3 className="text-2xl font-bold text-purple-600 mb-4">
                {selectedStudent === 'all' ? 'Message All Parents' : `Conversation with ${students.find(s => s.id === parseInt(selectedStudent))?.name || 'Student'}'s Parent`}
              </h3>

              {/* Message History */}
              {selectedStudent !== 'all' && (
                <div className="flex-1 bg-gray-50 rounded-lg p-4 mb-4 overflow-y-auto max-h-96">
                  {getStudentConversation(parseInt(selectedStudent)).length > 0 ? (
                    <div className="space-y-3">
                      {getStudentConversation(parseInt(selectedStudent)).map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.from === 'teacher' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-sm p-3 rounded-lg ${
                            msg.from === 'teacher' 
                              ? 'bg-purple-500 text-white' 
                              : 'bg-white border-2 border-gray-300'
                          }`}>
                            <p>{msg.text}</p>
                            <p className="text-xs opacity-70 mt-1">{msg.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center py-8">No conversation history</p>
                  )}
                </div>
              )}

              {/* Message Input */}
              <div className="space-y-3">
                <textarea
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="w-full h-32 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none resize-none"
                />
                <div className="flex gap-3">
                  <div className="relative">
                <input
             type="file"
            id="fileInput"
            className="hidden"
            onChange={handleFileChange}
           />
          <button
          onClick={() => document.getElementById("fileInput").click()}
         className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
      >
     <Paperclip size={18} />
     {attachedFile ? attachedFile.name : "Attach File"}
    </button>
    </div>

                  <button
                    onClick={handleSendEmail}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-lg font-bold hover:shadow-lg transition-all"
                  >
                    <Send size={18} />
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Gradebook Tab */}
        {activeTab === 'gradebook' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-orange-600">Class Gradebook</h2>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-4 py-2 border-2 border-orange-300 rounded-lg font-semibold text-orange-600"
              >
                {languages.map(lang => (
                  <option key={lang} value={lang.toLowerCase()}>{lang}</option>
                ))}
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-linear-to-r from-orange-500 to-red-500 text-white">
                    <th className="px-6 py-4 text-left font-bold">Student Name</th>
                    <th className="px-6 py-4 text-center font-bold">Essay</th>
                    <th className="px-6 py-4 text-center font-bold">Quiz Ch.3</th>
                    <th className="px-6 py-4 text-center font-bold">Translation</th>
                    <th className="px-6 py-4 text-center font-bold">Average</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, idx) => (
                    <tr key={student.id} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-6 py-4 font-semibold">{student.name}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full font-bold">A</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full font-bold">B+</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full font-bold">A-</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full font-bold">A-</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}