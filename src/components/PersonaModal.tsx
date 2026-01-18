'use client';

import React, { useEffect, useState } from 'react';
import { X, Plus } from 'lucide-react';
import { UserPersona } from '@/types';

interface PersonaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (persona: Omit<UserPersona, 'id'>) => void;
}

const PersonaModal: React.FC<PersonaModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [context, setContext] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setName('');
      setRole('');
      setContext('');
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!name.trim() || !context.trim()) {
      setError('Name and context are required.');
      return;
    }
    onAdd({ name: name.trim(), role: role.trim() || 'User', context: context.trim() });
    setName('');
    setRole('');
    setContext('');
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl w-[640px] max-h-[90vh] shadow-2xl p-6 flex flex-col text-gray-900">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">Add Persona</h2>
            <p className="text-sm text-gray-500">Define a new persona with goals and context.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="space-y-3 mb-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600">Name *</label>
            <input
              className="w-full text-sm p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              placeholder="e.g. Student, PM, Analyst"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600">Role (optional)</label>
            <input
              className="w-full text-sm p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              placeholder="e.g. Learner, Developer"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600">Context / Preferences *</label>
            <textarea
              className="w-full text-sm p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
              placeholder="Goals, constraints, tone preferences"
              rows={5}
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm flex items-center gap-2"
          >
            <Plus size={16} />
            <span>Add Persona</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonaModal;
