import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { BookOpen, Users, Clipboard } from 'lucide-react';

export default function SignupPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('student');
  const [submitted, setSubmitted] = useState(false);
  const [userType, setUserType] = useState('');

  const [studentData, setStudentData] = useState({ name: '', class: '' });
  const [parentTeacherData, setParentTeacherData] = useState({ name: '', email: '', password: '' });

  const handleStudentChange = (e) => {
    const { name, value } = e.target;
    setStudentData(prev => ({ ...prev, [name]: value }));
  };

  const handleParentTeacherChange = (e) => {
    const { name, value } = e.target;
    setParentTeacherData(prev => ({ ...prev, [name]: value }));
  };

  const handleStudentSubmit = () => {
    if (studentData.name && studentData.class) {
      setUserType('student');
      setSubmitted(true);
    } else {
      alert('Please fill in all fields');
    }
  };

  const handleParentTeacherSubmit = () => {
    if (parentTeacherData.name && parentTeacherData.email && parentTeacherData.password) {
      setUserType(activeTab);
      setSubmitted(true);
    } else {
      alert('Please fill in all fields');
    }
  };

  // 🚀 Redirect logic after success screen
  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        if (userType === 'student') navigate('/student-dashboard');
        else if (userType === 'teacher') navigate('/teacher-dashboard');
        else if (userType === 'parent') navigate('/parent-dashboard');
      }, 2000); // Wait 2 seconds before navigating
      return () => clearTimeout(timer);
    }
  }, [submitted, userType, navigate]);

  // 🎉 Success Screen
  if (submitted) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome!</h1>
          <p className="text-gray-600 mb-2 text-lg">
            Successfully logged in as a{' '}
            <span className="font-bold text-purple-600 capitalize">{userType}</span>
          </p>
          <p className="text-gray-500 mb-6">Redirecting to your dashboard...</p>
          <div className="w-12 h-12 border-4 border-purple-500 border-t-pink-500 rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  // 🧾 Main Signup UI
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen size={40} className="text-purple-600" />
            <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              CLASSCONNECT
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Bridging languages across classrooms</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('student')}
            className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all transform ${
              activeTab === 'student'
                ? 'bg-linear-to-r from-blue-500 to-cyan-500 text-white shadow-lg scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Users size={20} />
              Student
            </div>
          </button>
          <button
            onClick={() => setActiveTab('parent')}
            className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all transform ${
              activeTab === 'parent'
                ? 'bg-linear-to-r from-green-500 to-teal-500 text-white shadow-lg scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Clipboard size={20} />
              Parent
            </div>
          </button>
          <button
            onClick={() => setActiveTab('teacher')}
            className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all transform ${
              activeTab === 'teacher'
                ? 'bg-linear-to-r from-orange-500 to-red-500 text-white shadow-lg scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <BookOpen size={20} />
              Teacher
            </div>
          </button>
        </div>

        {/* Student Form */}
        {activeTab === 'student' && (
          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 font-bold mb-3 text-lg">Full Name</label>
              <input
                type="text"
                name="name"
                value={studentData.name}
                onChange={handleStudentChange}
                placeholder="Enter your name"
                className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-3 text-lg">Class</label>
              <input
                type="text"
                name="class"
                value={studentData.class}
                onChange={handleStudentChange}
                placeholder="Enter your class (e.g., 10A)"
                className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
              />
            </div>
            <button
              onClick={handleStudentSubmit}
              className="w-full py-4 bg-linear-to-r from-blue-500 to-cyan-500 text-white font-bold text-lg rounded-xl hover:shadow-lg transition-all transform hover:scale-105"
            >
              Join Class
            </button>
          </div>
        )}

        {/* Parent Form */}
        {activeTab === 'parent' && (
          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 font-bold mb-3 text-lg">Full Name</label>
              <input
                type="text"
                name="name"
                value={parentTeacherData.name}
                onChange={handleParentTeacherChange}
                placeholder="Enter your name"
                className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none text-lg"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-3 text-lg">Email Address</label>
              <input
                type="email"
                name="email"
                value={parentTeacherData.email}
                onChange={handleParentTeacherChange}
                placeholder="Enter your email"
                className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none text-lg"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-3 text-lg">Password</label>
              <input
                type="password"
                name="password"
                value={parentTeacherData.password}
                onChange={handleParentTeacherChange}
                placeholder="Create a password"
                className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none text-lg"
              />
            </div>
            <button
              onClick={handleParentTeacherSubmit}
              className="w-full py-4 bg-linear-to-r from-green-500 to-teal-500 text-white font-bold text-lg rounded-xl hover:shadow-lg transition-all transform hover:scale-105"
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Teacher Form */}
        {activeTab === 'teacher' && (
          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 font-bold mb-3 text-lg">Full Name</label>
              <input
                type="text"
                name="name"
                value={parentTeacherData.name}
                onChange={handleParentTeacherChange}
                placeholder="Enter your name"
                className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none text-lg"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-3 text-lg">Email Address</label>
              <input
                type="email"
                name="email"
                value={parentTeacherData.email}
                onChange={handleParentTeacherChange}
                placeholder="Enter your email"
                className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none text-lg"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-3 text-lg">Password</label>
              <input
                type="password"
                name="password"
                value={parentTeacherData.password}
                onChange={handleParentTeacherChange}
                placeholder="Create a password"
                className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none text-lg"
              />
            </div>
            <button
              onClick={handleParentTeacherSubmit}
              className="w-full py-4 bg-linear-to-r from-orange-500 to-red-500 text-white font-bold text-lg rounded-xl hover:shadow-lg transition-all transform hover:scale-105"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
