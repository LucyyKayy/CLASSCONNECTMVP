import axios from 'axios';
import { useState, useRef } from 'react';
import { BookOpen, FileText, Brain, Download, MessageSquare, Mic, Volume2, Upload, LogOut, Award, Clock, CheckCircle } from 'lucide-react';

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('translation');
  const [nativeText, setNativeText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [nativeLang, setNativeLang] = useState('english');
  const [translatedLang, setTranslatedLang] = useState('spanish');
  const [isRecording, setIsRecording] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const translatedAudioBlobRef = useRef(null);

  const recognitionRef = useRef(null);

  const handleStartExercise = (exerciseId) => {
    const exercise = exercises.find((ex) => ex.id === exerciseId);
    setSelectedExercise(exercise);
    setIsStartModalOpen(true);
    setIsReviewModalOpen(false);
  };

  const handleReviewExercise = (exerciseId) => {
    const exercise = exercises.find((ex) => ex.id === exerciseId);
    setSelectedExercise(exercise);
    setIsReviewModalOpen(true);
    setIsStartModalOpen(false);
  };

  const languages = [
    'English', 'German', 'French', 'Spanish', 'Arabic', 'Portuguese',
    'Italian', 'Dutch', 'Polish', 'Ukrainian', 'Russian', 'Turkish',
    'Swahili', 'Chinese', 'Hindi'
  ];

  const assignments = [
    { id: 1, title: 'Essay: My Cultural Heritage', dueDate: '2025-10-25', status: 'pending', grade: null, filename: 'essay_cultural_heritage.pdf' },
    { id: 2, title: 'Vocabulary Quiz Chapter 3', dueDate: '2025-10-22', status: 'submitted', grade: 'A', filename: 'vocab_quiz_ch3.pdf' },
    { id: 3, title: 'Translation Practice', dueDate: '2025-10-28', status: 'pending', grade: null, filename: 'translation_practice.pdf' }
  ];

  const exercises = [
    { id: 1, type: 'Multiple Choice', title: 'Basic Greetings', questions: 10, completed: true, filename: 'basic_greetings.json', data: { title: 'Basic Greetings', questions: [ /* example */ {q: 'Hello', choices: ['Hola','Bonjour'], a: 0} ] } },
    { id: 2, type: 'Fill in the Blanks', title: 'Common Phrases', questions: 15, completed: false, filename: 'common_phrases.json', data: { title: 'Common Phrases', questions: [] } },
    { id: 3, type: 'Vocabulary', title: 'Food & Dining', questions: 20, completed: false, filename: 'food_dining.json', data: { title: 'Food & Dining', questions: [] } }
  ];

  const summaries = [
    { id: 1, title: 'Introduction to Spanish Culture', type: 'Lesson Summary', date: '2025-10-15', filename: 'spanish_culture.pdf' },
    { id: 2, title: 'French Verb Conjugations', type: 'Flashcards', date: '2025-10-18', filename: 'french_verbs.pdf' },
    { id: 3, title: 'German Grammar Basics', type: 'Lesson Summary', date: '2025-10-20', filename: 'german_grammar.pdf' }
  ];

  // ----------------------------
  // Language code maps
  // ----------------------------
  const libreLangMap = {
    english: 'en',
    german: 'de',
    french: 'fr',
    spanish: 'es',
    arabic: 'ar',
    portuguese: 'pt',
    italian: 'it',
    dutch: 'nl',
    polish: 'pl',
    ukrainian: 'uk',
    russian: 'ru',
    turkish: 'tr',
    swahili: 'sw',
    chinese: 'zh',
    hindi: 'hi'
  };

  // speechSynthesis voices mapping (best-effort)
  const ttsLangMap = {
    english: 'en-US',
    german: 'de-DE',
    french: 'fr-FR',
    spanish: 'es-ES',
    arabic: 'ar-SA',
    portuguese: 'pt-PT',
    italian: 'it-IT',
    dutch: 'nl-NL',
    polish: 'pl-PL',
    ukrainian: 'uk-UA',
    russian: 'ru-RU',
    turkish: 'tr-TR',
    swahili: 'sw-KE',
    chinese: 'zh-CN',
    hindi: 'hi-IN'
  };

  // Helper to create and download a blob file in the browser
  const createAndDownloadBlob = (content, filename, mime = 'application/octet-stream') => {
    try {
      const blob = new Blob([content], { type: mime });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('createAndDownloadBlob error', err);
      alert('❌ Download failed (browser).');
    }
  };

  // ----------------------------
  // Translation: LibreTranslate
  // ----------------------------
  const handleTranslate = async () => {
    if (!nativeText || nativeText.trim() === '') {
      alert('Please type or speak something to translate.');
      return;
    }

    const sourceCode = libreLangMap[nativeLang.toLowerCase()] || 'auto';
    const targetCode = libreLangMap[translatedLang.toLowerCase()] || 'en';

    try {
      // Try LibreTranslate public instance (subject to rate limits / availability)
      const res = await axios.post('https://libretranslate.com/translate', {
        q: nativeText,
        source: sourceCode,
        target: targetCode,
        format: 'text'
      }, {
        headers: { 'accept': 'application/json', 'Content-Type': 'application/json' }
      });

      if (res.data && (res.data.translatedText || res.data.translation)) {
        // different instances return different keys
        const translated = res.data.translatedText || res.data.translation;
        setTranslatedText(translated);
      } else {
        // Fallback: simple label
        setTranslatedText(`(No translation returned) from ${nativeLang} → ${translatedLang}`);
      }
    } catch (err) {
      console.error('LibreTranslate failed', err);
      // fallback: placeholder "best-effort" translation text
      setTranslatedText(`Translated from ${nativeLang} to ${translatedLang}: ${nativeText}`);
      alert('⚠️ Translation service failed (LibreTranslate). Using fallback text. Check network or LibreTranslate availability.');
    }
  };

  // ----------------------------
  // Voice: SpeechRecognition and speechSynthesis
  // ----------------------------
  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return null;
    }
    const recog = new SpeechRecognition();
    recog.lang = ttsLangMap[nativeLang.toLowerCase()] || 'en-US';
    recog.interimResults = false;
    recog.maxAlternatives = 1;
    recognitionRef.current = recog;

    recog.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setNativeText(prev => (prev ? prev + ' ' + transcript : transcript));
      // auto-translate after capturing
      setTimeout(() => handleTranslate(), 200);
    };

    recog.onerror = (e) => {
      console.error('SpeechRecognition error', e);
      alert('Speech recognition error: ' + (e.error || 'unknown'));
      setIsRecording(false);
    };

    recog.onend = () => {
      setIsRecording(false);
    };

    recog.start();
    setIsRecording(true);
    return recog;
  };

  const stopSpeechRecognition = () => {
    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    } catch (err) {
      console.warn('stopSpeechRecognition', err);
    } finally {
      setIsRecording(false);
    }
  };

  // Toggle voice input: recognition -> set nativeText -> auto-translate -> then auto speak translated if available
  const handleVoiceInput = () => {
    if (isRecording) {
      stopSpeechRecognition();
      return;
    }

    const recog = startSpeechRecognition();
    if (!recog) return;

    // when recognition ends and translatedText is set, we can trigger speak automatically if desired
    // here we attach a short onend to perform speak after translation finishes (translation call sets translatedText)
    recog.onend = async () => {
      setIsRecording(false);
      // Wait briefly for translation to complete (handleTranslate called in onresult)
      setTimeout(() => {
        if (translatedText && translatedText.trim() !== '') {
          playTranslatedAudio();
        } else {
          // If translation hasn't populated yet, call translate once more
          handleTranslate().then(() => {
            if (translatedText && translatedText.trim() !== '') playTranslatedAudio();
          });
        }
      }, 500);
    };
  };

  // Play translated text using speechSynthesis
  const playTranslatedAudio = () => {
    if (!translatedText || translatedText.trim() === '') {
      alert('No translated text to play.');
      return;
    }

    if (!window.speechSynthesis) {
      alert('SpeechSynthesis not supported in this browser.');
      return;
    }

    // Cancel any existing utterances
    try {
      window.speechSynthesis.cancel();
    } catch (err) {
      // ignore
    }

    const utter = new SpeechSynthesisUtterance(translatedText);
    // Use language hint if possible
    const langHint = ttsLangMap[translatedLang.toLowerCase()] || libreLangMap[translatedLang.toLowerCase()] || 'en-US';
    utter.lang = langHint;

    // Optional: try to pick a voice that matches language
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const candidate = voices.find(v => (v.lang || '').toLowerCase().startsWith((utter.lang || '').split('-')[0]));
      if (candidate) utter.voice = candidate;
    }

    utter.onerror = (e) => {
      console.error('TTS error', e);
      alert('Speech error: ' + (e.error || 'unknown'));
    };

    window.speechSynthesis.speak(utter);
  };

  // ----------------------------
  // File upload (unchanged)
  // ----------------------------
  const handleFileUpload = async (assignmentId) => {
    const assignment = assignments.find(a => a.id === assignmentId);
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
          alert(`✅ Uploaded "${file.name}" successfully!`);
          console.log('File saved at:', response.data.filePath);
        }
      } catch (error) {
        console.error('Upload failed:', error);
        alert('❌ Upload failed, please try again.');
      }
    };

    input.click();
  };

  // ----------------------------
  // File download (try backend first — fallback to frontend generation)
  // ----------------------------
  const handleDownloadFile = async (fileType, fileName) => {
    // Try backend download first (if server exists)
    try {
      const response = await axios.get(`http://localhost:5000/api/download/${fileType}/${fileName}`, {
        responseType: 'blob',
        timeout: 7000
      });

      // If we got a blob, download it
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      return;
    } catch (err) {
      console.warn('Backend download failed or not available, falling back to frontend generation.', err?.message || err);
      // continue to frontend fallback
    }

    // Frontend fallback: generate content depending on fileType and filename
    try {
      if (fileType === 'exercises') {
        // single exercise file or "completed_exercises.zip"
        if (fileName === 'completed_exercises.zip' || fileName === 'completed_exercises.json') {
          const completed = exercises.filter(e => e.completed).map(e => ({ id: e.id, title: e.title, questions: e.questions, data: e.data || null }));
          createAndDownloadBlob(JSON.stringify(completed, null, 2), fileName.replace('.zip', '.json'), 'application/json');
          return;
        }

        // find specific exercise by filename
        const ex = exercises.find(e => e.filename === fileName);
        if (ex) {
          // if it's a .json exercise, download the JSON; if you want to simulate PDF, we keep JSON
          if (fileName.toLowerCase().endsWith('.json')) {
            createAndDownloadBlob(JSON.stringify(ex.data || ex, null, 2), fileName, 'application/json');
            return;
          } else {
            // generic fallback
            createAndDownloadBlob(JSON.stringify(ex, null, 2), fileName, 'application/json');
            return;
          }
        }
      }

      if (fileType === 'assignments') {
        if (fileName === 'all_assignments.zip' || fileName === 'all_assignments.json') {
          createAndDownloadBlob(JSON.stringify(assignments, null, 2), fileName.replace('.zip', '.json'), 'application/json');
          return;
        }

        const a = assignments.find(as => as.filename === fileName);
        if (a) {
          // we likely don't have the actual PDF bytes in the frontend; create a small JSON manifest or placeholder
          const placeholder = {
            note: 'This is a frontend-generated placeholder for the assignment file.',
            assignment: a
          };
          createAndDownloadBlob(JSON.stringify(placeholder, null, 2), fileName.replace('.pdf', '.json'), 'application/json');
          return;
        }
      }

      if (fileType === 'summaries') {
        if (fileName === 'ai_summaries.zip' || fileName === 'ai_summaries.json') {
          createAndDownloadBlob(JSON.stringify(summaries, null, 2), fileName.replace('.zip', '.json'), 'application/json');
          return;
        }
        const s = summaries.find(ss => ss.filename === fileName);
        if (s) {
          const placeholder = {
            note: 'Frontend-generated placeholder for summary file',
            summary: s
          };
          createAndDownloadBlob(JSON.stringify(placeholder, null, 2), fileName.replace('.pdf', '.json'), 'application/json');
          return;
        }
      }

      // Generic fallback: create a text file with basic info
      const fallback = `File requested: ${fileType}/${fileName}\n\nNo backend file available. This is a frontend-generated fallback.`;
      createAndDownloadBlob(fallback, fileName.replace('.zip', '.txt'), 'text/plain');
    } catch (err) {
      console.error('Frontend fallback download failed', err);
      alert('❌ Download failed.');
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500">
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
              <p className="text-sm text-gray-500">Welcome back,</p>
              <p className="font-bold text-gray-800">John Doe</p>
              <p className="text-xs text-gray-500">Class 10A</p>
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
            onClick={() => setActiveTab('translation')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
              activeTab === 'translation'
                ? 'bg-linear-to-r from-blue-500 to-cyan-500 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <MessageSquare size={20} />
            Live Translation
          </button>
          <button
            onClick={() => setActiveTab('assignments')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
              activeTab === 'assignments'
                ? 'bg-linear-to-r from-green-500 to-teal-500 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FileText size={20} />
            Assignments
          </button>
          <button
            onClick={() => setActiveTab('exercises')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
              activeTab === 'exercises'
                ? 'bg-linear-to-r from-orange-500 to-red-500 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Brain size={20} />
            Exercises
          </button>
          <button
            onClick={() => setActiveTab('summaries')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
              activeTab === 'summaries'
                ? 'bg-linear-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Brain size={20} />
            AI Summaries
          </button>
          <button
            onClick={() => setActiveTab('downloads')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
              activeTab === 'downloads'
                ? 'bg-linear-to-r from-yellow-500 to-orange-500 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Download size={20} />
            Downloads
          </button>
        </div>

        {/* ---------- Translation Tab ---------- */}
        {activeTab === 'translation' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Native Language Panel */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-blue-600">Native Language</h3>
                <select
                  value={nativeLang}
                  onChange={(e) => setNativeLang(e.target.value)}
                  className="px-4 py-2 border-2 border-blue-300 rounded-lg font-semibold text-blue-600"
                >
                  {languages.map(lang => (
                    <option key={lang} value={lang.toLowerCase()}>{lang}</option>
                  ))}
                </select>
              </div>
              <textarea
                value={nativeText}
                onChange={(e) => setNativeText(e.target.value)}
                placeholder="Type or speak your text here..."
                className="w-full h-64 p-4 border-2 border-gray-300 rounded-xl resize-none focus:border-blue-500 focus:outline-none text-lg"
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleVoiceInput}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-all ${
                    isRecording
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  <Mic size={20} />
                  {isRecording ? 'Recording...' : 'Voice Input'}
                </button>
                <button
                  onClick={handleTranslate}
                  className="flex-1 bg-linear-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all"
                >
                  Translate →
                </button>
              </div>
            </div>

            {/* Translated Language Panel */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-green-600">Translated</h3>
                <select
                  value={translatedLang}
                  onChange={(e) => setTranslatedLang(e.target.value)}
                  className="px-4 py-2 border-2 border-green-300 rounded-lg font-semibold text-green-600"
                >
                  {languages.map(lang => (
                    <option key={lang} value={lang.toLowerCase()}>{lang}</option>
                  ))}
                </select>
              </div>
              <div className="w-full h-64 p-4 bg-gray-50 border-2 border-gray-300 rounded-xl text-lg overflow-y-auto">
                {translatedText || 'Translation will appear here...'}
              </div>
              <button
                onClick={playTranslatedAudio}
                className="w-full mt-4 flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-lg font-bold hover:bg-green-600 transition-all"
              >
                <Volume2 size={20} />
                Play Audio
              </button>
            </div>
          </div>
        )}

        {/* ---------- Assignments Tab ---------- */}
        {activeTab === 'assignments' && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-3xl font-bold text-green-600 mb-6">My Assignments</h2>
            <div className="space-y-4">
              {assignments.map(assignment => (
                <div key={assignment.id} className="border-2 border-gray-200 rounded-xl p-6 hover:border-green-500 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800">{assignment.title}</h3>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1 text-gray-600">
                          <Clock size={16} />
                          Due: {assignment.dueDate}
                        </span>
                        {assignment.status === 'submitted' ? (
                          <span className="flex items-center gap-1 text-green-600 font-semibold">
                            <CheckCircle size={16} />
                            Submitted
                          </span>
                        ) : (
                          <span className="text-orange-600 font-semibold">Pending</span>
                        )}
                        {assignment.grade && (
                          <span className="flex items-center gap-1 text-purple-600 font-bold">
                            <Award size={16} />
                            Grade: {assignment.grade}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {assignment.status === 'pending' && (
                        <button
                          onClick={() => handleFileUpload(assignment.id)}
                          className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-green-500 to-teal-500 text-white rounded-lg font-bold hover:shadow-lg transition-all"
                        >
                          <Upload size={20} />
                          Submit
                        </button>
                      )}
                      {assignment.status === 'submitted' && (
                        <button
                          onClick={() => handleDownloadFile('assignments', assignment.filename)}
                          className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-green-500 to-teal-500 text-white rounded-lg font-bold hover:shadow-lg transition-all"
                        >
                          <Download size={20} />
                          Download
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------- Exercises Tab ---------- */}
        {activeTab === 'exercises' && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-3xl font-bold text-orange-600 mb-6">Practice Exercises</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {exercises.map(exercise => (
                <div key={exercise.id} className="border-2 border-gray-200 rounded-xl p-6 hover:border-orange-500 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-bold">
                      {exercise.type}
                    </span>
                    {exercise.completed && (
                      <CheckCircle size={20} className="text-green-500" />
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{exercise.title}</h3>
                  <p className="text-gray-600 mb-4">{exercise.questions} Questions</p>

                  <button
                    onClick={() =>
                      exercise.completed
                        ? handleReviewExercise(exercise.id)
                        : handleStartExercise(exercise.id)
                    }
                    className="w-full py-2 bg-linear-to-r from-orange-500 to-red-500 text-white rounded-lg font-bold hover:shadow-lg transition-all"
                  >
                    {exercise.completed ? 'Review' : 'Start Exercise'}
                  </button>

                  {exercise.completed && (
                    <button
                      onClick={() => handleDownloadFile('exercises', exercise.filename)}
                      className="w-full mt-2 py-2 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition-all"
                    >
                      Download Exercise
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------- AI Summaries Tab ---------- */}
        {activeTab === 'summaries' && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-3xl font-bold text-purple-600 mb-6">AI Summaries & Flashcards</h2>
            <div className="space-y-4">
              {summaries.map(summary => (
                <div key={summary.id} className="border-2 border-gray-200 rounded-xl p-6 hover:border-purple-500 transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{summary.title}</h3>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-bold">
                          {summary.type}
                        </span>
                        <span className="text-gray-600 text-sm">{summary.date}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownloadFile('summaries', summary.filename)}
                      className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-lg font-bold hover:shadow-lg transition-all"
                    >
                      <Download size={20} />
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------- Downloads Tab ---------- */}
        {activeTab === 'downloads' && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-3xl font-bold text-yellow-600 mb-6">Available Downloads</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border-2 border-gray-200 rounded-xl p-6 text-center hover:border-yellow-500 transition-all">
                <FileText size={48} className="mx-auto text-green-500 mb-3" />
                <h3 className="text-lg font-bold text-gray-800 mb-2">Assignments</h3>
                <p className="text-gray-600 text-sm mb-4">Download all submitted assignments</p>
                <button
                  onClick={() => handleDownloadFile('assignments', 'all_assignments.zip')}
                  className="w-full py-2 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition-all"
                >
                  Download All
                </button>
              </div>
              <div className="border-2 border-gray-200 rounded-xl p-6 text-center hover:border-yellow-500 transition-all">
                <Brain size={48} className="mx-auto text-orange-500 mb-3" />
                <h3 className="text-lg font-bold text-gray-800 mb-2">Exercises</h3>
                <p className="text-gray-600 text-sm mb-4">Download completed exercises</p>
                <button
                  onClick={() => handleDownloadFile('exercises', 'completed_exercises.zip')}
                  className="w-full py-2 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition-all"
                >
                  Download All
                </button>
              </div>
              <div className="border-2 border-gray-200 rounded-xl p-6 text-center hover:border-yellow-500 transition-all">
                <BookOpen size={48} className="mx-auto text-purple-500 mb-3" />
                <h3 className="text-lg font-bold text-gray-800 mb-2">AI Summaries</h3>
                <p className="text-gray-600 text-sm mb-4">Download lesson summaries & flashcards</p>
                <button
                  onClick={() => handleDownloadFile('summaries', 'ai_summaries.zip')}
                  className="w-full py-2 bg-purple-500 text-white rounded-lg font-bold hover:bg-purple-600 transition-all"
                >
                  Download All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
