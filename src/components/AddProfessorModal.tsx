import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, GraduationCap, Building2, BookOpen, Clock, Tag, Sparkles } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const AddProfessorModal: React.FC<Props> = ({ onClose }) => {
  const { addProfessor } = useApp();

  const [name, setName] = useState('');
  const [title, setTitle] = useState('Associate Professor');
  const [institution, setInstitution] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [bio, setBio] = useState('');
  const [coursesInput, setCoursesInput] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [officeHoursDay, setOfficeHoursDay] = useState('Mon & Wed');
  const [officeHoursTime, setOfficeHoursTime] = useState('2:00 PM – 4:00 PM');
  const [officeHoursLocation, setOfficeHoursLocation] = useState('Campus Hall 201 / Virtual Room');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !institution.trim()) return;

    const courses = coursesInput
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    addProfessor({
      name: name.trim(),
      title: title.trim(),
      institution: institution.trim(),
      department: department.trim(),
      bio: bio.trim() || 'Educator committed to academic excellence and student mentorship.',
      courses: courses.length > 0 ? courses : ['Introductory Lecture Series'],
      tags: tags.length > 0 ? tags : ['Approachable', 'Interactive Teaching'],
      isClaimed: false,
      ratingsBreakdown: {
        clarity: 4.8,
        engagement: 4.7,
        fairness: 4.8,
        helpfulness: 4.9,
        workload: 3.2,
      },
      officeHours: [
        {
          day: officeHoursDay,
          time: officeHoursTime,
          location: officeHoursLocation,
          meetLinkAvailable: true,
        },
      ],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Upload Educator Profile
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Create a space for honest student feedback, office hours & duels
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Robert Vance"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-sm px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Academic Title
              </label>
              <input
                type="text"
                placeholder="e.g. Professor of Neuroscience"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-sm px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                University or College *
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Stanford University"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full text-sm pl-9 pr-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full text-sm px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Literature & Humanities">Literature & Humanities</option>
                <option value="Bioengineering">Bioengineering</option>
                <option value="Economics">Economics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Psychology">Psychology</option>
                <option value="Engineering">Engineering</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Courses Taught (comma separated)
            </label>
            <div className="relative">
              <BookOpen className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. CS 101, CS 229 Machine Learning"
                value={coursesInput}
                onChange={(e) => setCoursesInput(e.target.value)}
                className="w-full text-sm pl-9 pr-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Teaching Philosophy / Short Bio
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Focuses on intuitive demonstrations, collaborative student problem sets, and practical applications..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full text-sm px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Office Hours Day
              </label>
              <input
                type="text"
                placeholder="e.g. Tue & Thu"
                value={officeHoursDay}
                onChange={(e) => setOfficeHoursDay(e.target.value)}
                className="w-full text-sm px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Time Window
              </label>
              <input
                type="text"
                placeholder="e.g. 3:00 - 5:00 PM"
                value={officeHoursTime}
                onChange={(e) => setOfficeHoursTime(e.target.value)}
                className="w-full text-sm px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Location / Room
              </label>
              <input
                type="text"
                placeholder="e.g. Room 302 / Virtual"
                value={officeHoursLocation}
                onChange={(e) => setOfficeHoursLocation(e.target.value)}
                className="w-full text-sm px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Descriptive Teaching Tags (comma separated)
            </label>
            <div className="relative">
              <Tag className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. Clear Proofs, Engaging Lectures, Fair Exams, Generous Office Hours"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full text-sm pl-9 pr-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

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
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all"
            >
              Publish Educator Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
