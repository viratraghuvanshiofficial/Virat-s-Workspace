import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Star, ShieldCheck, MessageSquare } from 'lucide-react';
import { Professor } from '../types';

interface Props {
  professor: Professor;
  onClose: () => void;
}

export const AddReviewModal: React.FC<Props> = ({ professor, onClose }) => {
  const { addReview } = useApp();

  const [studentName, setStudentName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [courseTaken, setCourseTaken] = useState(professor.courses[0] || 'General Course');
  const [term, setTerm] = useState('Fall 2025');
  const [overallRating, setOverallRating] = useState(5);
  const [clarity, setClarity] = useState(5);
  const [engagement, setEngagement] = useState(5);
  const [fairness, setFairness] = useState(5);
  const [helpfulness, setHelpfulness] = useState(5);
  const [gradeReceived, setGradeReceived] = useState('A');
  const [reviewText, setReviewText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Clear Explanations']);

  const SUGGESTED_TAGS = [
    'Clear Explanations',
    'Generous Office Hours',
    'Challenging Problem Sets',
    'Inspiring Mentor',
    'Fair Grader',
    'High Energy Lectures',
    'Heavy Reading',
    'Tough Exams',
    'Hands-on Projects',
    'Caring & Patient',
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;

    addReview({
      professorId: professor.id,
      studentName: isAnonymous ? 'Verified Student' : studentName.trim() || 'Verified Student',
      isAnonymous,
      courseTaken,
      term,
      rating: overallRating,
      criteria: {
        clarity,
        engagement,
        fairness,
        helpfulness,
      },
      gradeReceived,
      reviewText: reviewText.trim(),
      tags: selectedTags,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Write Real Feedback for {professor.name}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {professor.institution} · {professor.department}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Identity & Anonymous Toggle */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Verified Student Identity
              </span>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                Post Anonymously
              </label>
            </div>

            {!isAnonymous && (
              <div>
                <input
                  type="text"
                  placeholder="Your Name (e.g. Jordan Vance)"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}
          </div>

          {/* Course Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Course Taken
              </label>
              <input
                type="text"
                value={courseTaken}
                onChange={(e) => setCourseTaken(e.target.value)}
                placeholder="e.g. CS 161"
                className="w-full text-xs px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Term / Year
              </label>
              <select
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Fall 2026">Fall 2026</option>
                <option value="Spring 2026">Spring 2026</option>
                <option value="Fall 2025">Fall 2025</option>
                <option value="Spring 2025">Spring 2025</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Grade (Optional)
              </label>
              <select
                value={gradeReceived}
                onChange={(e) => setGradeReceived(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="A+">A+</option>
                <option value="A">A</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B">B</option>
                <option value="B-">B-</option>
                <option value="C+">C+</option>
                <option value="Pass">Pass</option>
              </select>
            </div>
          </div>

          {/* Overall Rating Star Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Overall Teaching Experience: {overallRating} / 5
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setOverallRating(star)}
                  className="p-1 text-slate-300 hover:text-amber-400 focus:outline-none transition-colors"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= overallRating
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-300 dark:text-slate-600'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Granular Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                <span>Clarity of Explanations</span>
                <span className="font-mono">{clarity} / 5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={clarity}
                onChange={(e) => setClarity(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                <span>Lecture Engagement</span>
                <span className="font-mono">{engagement} / 5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={engagement}
                onChange={(e) => setEngagement(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                <span>Fairness in Grading</span>
                <span className="font-mono">{fairness} / 5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={fairness}
                onChange={(e) => setFairness(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                <span>Office Hours & Helpfulness</span>
                <span className="font-mono">{helpfulness} / 5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={helpfulness}
                onChange={(e) => setHelpfulness(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Written Feedback Textarea */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Your Real Feedback & Advice for Future Students *
            </label>
            <textarea
              required
              rows={4}
              placeholder="What makes this professor exceptional? How are their problem sets, exam questions, and lectures? What specific advice would you give to someone taking this course?"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none leading-relaxed"
            />
          </div>

          {/* Quick Tags Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Select Highlights
            </label>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 text-white font-medium'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Submit Verified Feedback</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
