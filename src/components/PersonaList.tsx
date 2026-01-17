import React, { useState } from 'react';
import { User, Trash2, Plus } from 'lucide-react';
import { useChat } from '@/context/ChatContext';

export const PersonaList = () => {
    const { 
        personas, 
        activePersonaId, 
        setActivePersona, 
        addPersona, 
        deletePersona 
    } = useChat();

    const [showPersonas, setShowPersonas] = useState(false);
    const [isAddingPersona, setIsAddingPersona] = useState(false);
    const [newPersonaName, setNewPersonaName] = useState('');
    const [newPersonaRole, setNewPersonaRole] = useState('');
    const [newPersonaContext, setNewPersonaContext] = useState('');

    const handleAddPersona = () => {
        if (!newPersonaName || !newPersonaContext) return;
        addPersona({
            name: newPersonaName,
            role: newPersonaRole || 'User',
            context: newPersonaContext
        });
        setIsAddingPersona(false);
        setNewPersonaName('');
        setNewPersonaRole('');
        setNewPersonaContext('');
    };

    return (
        <div className="border-t border-gray-200 pt-2 mb-2">
            <button 
                onClick={() => setShowPersonas(!showPersonas)}
                className="flex items-center justify-between w-full p-2 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 mb-1"
            >
                <div className="flex items-center gap-3">
                    <User size={18} className="text-gray-600"/>
                    <span className="truncate max-w-[140px]">{personas.find(p => p.id === activePersonaId)?.name || 'Persona'}</span>
                </div>
                <div className={`transition-transform duration-200 ${showPersonas ? 'rotate-180' : ''}`}>
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
            </button>

            {showPersonas && (
                <div className="pl-2 pr-1 space-y-1 mb-3 animate-in slide-in-from-top-2 duration-200">
                    {personas.map(p => (
                        <div key={p.id} className="flex items-center group">
                            <button 
                                onClick={() => setActivePersona(p.id)}
                                className={`flex-1 text-left px-3 py-1.5 rounded-md text-xs transition-colors ${activePersonaId === p.id ? 'bg-white shadow-sm text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-200'}`}
                            >
                                {p.name}
                                <span className="block text-[10px] text-gray-400 font-normal truncate">{p.role}</span>
                            </button>
                            {p.id !== 'default' && (
                                <button 
                                    onClick={(e) => { e.stopPropagation(); deletePersona(p.id); }}
                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <Trash2 size={12}/>
                                </button>
                            )}
                        </div>
                    ))}
                    
                    {!isAddingPersona ? (
                        <button 
                            onClick={() => setIsAddingPersona(true)}
                            className="w-full text-left px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50 rounded-md font-medium flex items-center gap-1 mt-2"
                        >
                            <Plus size={12}/> New Persona
                        </button>
                    ) : (
                        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 mt-2 space-y-2 animate-in zoom-in-95 duration-200">
                            <input 
                                className="w-full text-xs p-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-gray-900 placeholder-gray-400"
                                placeholder="Name (e.g. Student)"
                                value={newPersonaName}
                                onChange={(e) => setNewPersonaName(e.target.value)}
                            />
                            <input 
                                className="w-full text-xs p-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-gray-900 placeholder-gray-400"
                                placeholder="Role (e.g. Learner)"
                                value={newPersonaRole}
                                onChange={(e) => setNewPersonaRole(e.target.value)}
                            />
                            <textarea 
                                className="w-full text-xs p-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none text-gray-900 placeholder-gray-400"
                                placeholder="Context/Preferences..."
                                rows={2}
                                value={newPersonaContext}
                                onChange={(e) => setNewPersonaContext(e.target.value)}
                            />
                            <div className="flex gap-2 pt-1">
                                <button onClick={handleAddPersona} className="flex-1 bg-blue-600 text-white text-xs py-1 rounded hover:bg-blue-700">Add</button>
                                <button onClick={() => setIsAddingPersona(false)} className="flex-1 bg-gray-100 text-gray-600 text-xs py-1 rounded hover:bg-gray-200">Cancel</button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
