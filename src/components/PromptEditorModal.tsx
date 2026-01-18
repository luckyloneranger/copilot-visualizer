'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { X, RotateCcw } from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import { DEFAULT_PROMPTS } from '@/prompts/defaultPrompts';
import { PromptOverrides } from '@/types';

interface PromptEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const promptFields: Array<{ key: keyof PromptOverrides; label: string; helper: string; usage: string }> = [
    {
        key: 'systemPrompt',
        label: 'System Prompt (Chat)',
        helper: 'Base instructions for every chat response before persona or inline anchor logic is applied.',
        usage: 'Applied to every chat turn as the system message before persona/anchor logic.'
    },
    {
        key: 'anchorPrompt',
        label: 'Anchor Prompt',
        helper: 'Rules for injecting __ANCHOR__ tokens into responses to power inline pivots.',
        usage: 'Injects __ANCHOR__ tokens into replies; used when anchors are enabled.'
    },
    {
        key: 'suggestionPrompt',
        label: 'Suggestion Pills Prompt',
        helper: 'Controls how follow-up buttons are generated after a reply.',
        usage: 'Shapes post-reply suggestion chips shown under each message.'
    },
    {
        key: 'inlineSuggestionPrompt',
        label: 'Inline Hydration Prompt',
        helper: 'Guides the questions generated for each inline anchor.',
        usage: 'Builds inline Q&A follow-ups for each anchor token.'
    },
    {
        key: 'homePrompt',
        label: 'Conversational Hooks Prompt',
        helper: 'Used by the contextual journeys endpoint to propose “Rich Tiles” on the home screen.',
        usage: 'Drives home-screen “Rich Tiles” from recent conversation history.'
    }
];

const PromptEditorModal: React.FC<PromptEditorModalProps> = ({ isOpen, onClose }) => {
    const { promptOverrides, updatePromptOverrides, resetPromptOverrides } = useChat();
    const [localPrompts, setLocalPrompts] = useState<PromptOverrides>(promptOverrides);
    const [selectedPrompt, setSelectedPrompt] = useState<keyof PromptOverrides>(promptFields[0].key);
    const [errors, setErrors] = useState<Record<keyof PromptOverrides, string | null>>({
        systemPrompt: null,
        anchorPrompt: null,
        suggestionPrompt: null,
        inlineSuggestionPrompt: null,
        homePrompt: null
    });

    const validateField = (key: keyof PromptOverrides, value: string) => {
        if (!value.trim()) return 'Prompt cannot be empty.';
        if (key === 'anchorPrompt' && !value.includes('__ANCHOR__')) {
            return 'Include at least one __ANCHOR__ token.';
        }
        return null;
    };

    const validateAll = (prompts: PromptOverrides) => {
        const nextErrors: Record<keyof PromptOverrides, string | null> = { ...errors };
        promptFields.forEach(({ key }) => {
            nextErrors[key] = validateField(key, prompts[key]);
        });
        return nextErrors;
    };

    const isDirty = useMemo(() => JSON.stringify(localPrompts) !== JSON.stringify(promptOverrides), [localPrompts, promptOverrides]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLocalPrompts(promptOverrides);
        setSelectedPrompt(promptFields[0].key);
        setErrors(validateAll(promptOverrides));
    }, [promptOverrides, isOpen]);

    if (!isOpen) return null;

    const handleSave = () => {
        const nextErrors = validateAll(localPrompts);
        setErrors(nextErrors);
        const hasErrors = Object.values(nextErrors).some(Boolean);
        if (hasErrors) return;
        updatePromptOverrides(localPrompts);
        onClose();
    };

    const handleChange = (key: keyof PromptOverrides, value: string) => {
        setLocalPrompts(prev => ({ ...prev, [key]: value }));
        setErrors(prev => ({ ...prev, [key]: validateField(key, value) }));
    };

    const handleResetPrompt = (key: keyof PromptOverrides) => {
        const shouldReset = window.confirm('Reset this prompt to its default?');
        if (!shouldReset) return;
        setLocalPrompts(prev => ({ ...prev, [key]: DEFAULT_PROMPTS[key] }));
        setErrors(prev => ({ ...prev, [key]: null }));
    };

    const handleResetAll = () => {
        resetPromptOverrides();
        setLocalPrompts({ ...DEFAULT_PROMPTS });
        setErrors(validateAll(DEFAULT_PROMPTS));
    };

    const handleClose = () => {
        if (isDirty) {
            const confirmClose = window.confirm('Discard unsaved changes?');
            if (!confirmClose) return;
        }
        onClose();
    };

    const visibleFields = promptFields.filter((field) => field.key === selectedPrompt);

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white rounded-xl w-[900px] shadow-2xl p-6 relative text-gray-900 max-h-[90vh] overflow-hidden flex flex-col">
                <button 
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <X size={20} className="text-gray-500" />
                </button>

                <div className="flex items-start justify-between gap-4 pr-8">
                    <div>
                        <h2 className="text-xl font-semibold mb-1 text-gray-900">Prompt Lab</h2>
                        <p className="text-sm text-gray-500">Edit runtime prompts and test changes instantly without redeploying.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <label className="text-xs text-gray-500" htmlFor="prompt-filter">Select prompt</label>
                        <select
                            id="prompt-filter"
                            className="border border-gray-200 rounded-lg px-2 py-1 text-sm text-gray-700 bg-white focus:outline-none focus:border-blue-500"
                            value={selectedPrompt}
                            onChange={(e) => setSelectedPrompt(e.target.value as keyof PromptOverrides)}
                        >
                            {promptFields.map((field) => (
                                <option key={field.key} value={field.key}>{field.label}</option>
                            ))}
                        </select>
                        <button
                            onClick={handleResetAll}
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Restore all prompts to their default definitions"
                        >
                            <RotateCcw size={16} />
                            <span>Restore Defaults</span>
                        </button>
                    </div>
                </div>

                <div className="mt-4 flex-1 overflow-y-auto pr-2 space-y-4">
                    {visibleFields.map(field => (
                        <div key={field.key} className="border border-gray-200 rounded-lg p-4 bg-gray-50/60">
                            <div className="flex items-start justify-between gap-3 mb-2">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-800">{field.label}</h3>
                                    <p className="text-xs text-gray-500 leading-relaxed">{field.helper}</p>
                                    <p className="text-xs text-gray-400 leading-relaxed mt-1">Usage: {field.usage}</p>
                                </div>
                                <button
                                    onClick={() => handleResetPrompt(field.key)}
                                    className="text-xs text-blue-600 hover:text-blue-700 font-medium px-2 py-1 rounded transition-colors"
                                >
                                    Reset
                                </button>
                            </div>
                            <textarea
                                value={localPrompts[field.key]}
                                onChange={e => handleChange(field.key, e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono text-gray-800 h-40 focus:outline-none focus:border-blue-500 shadow-inner bg-white"
                            />
                            {errors[field.key] && (
                                <p className="text-xs text-red-600 mt-1">{errors[field.key]}</p>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button 
                        onClick={handleClose}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PromptEditorModal;
