import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useChat } from '@/context/ChatContext';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const { apiConfig, updateApiConfig } = useChat();
    const [config, setConfig] = useState(apiConfig);

    useEffect(() => {
        setConfig(apiConfig);
    }, [apiConfig, isOpen]);

    if (!isOpen) return null;

    const handleSave = () => {
        updateApiConfig(config);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl w-[500px] shadow-2xl p-6 relative text-gray-900">
                 <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100"
                >
                    <X size={20} className="text-gray-500" />
                </button>

                <h2 className="text-xl font-semibold mb-2 text-gray-900">Azure OpenAI Configuration</h2>
                <p className="text-sm text-gray-500 mb-6">Enter your credentials to use the chat features. These are stored locally in your browser.</p>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Current Active Persona
                        </label>
                         <p className="text-xs text-gray-400 mb-2">
                            Configurations will be used for all personas.
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Azure OpenAI Endpoint
                        </label>
                        <input 
                            type="text" 
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 font-mono text-gray-700" 
                            placeholder="https://your-resource.openai.azure.com/"
                            value={config.endpoint}
                            onChange={e => setConfig({...config, endpoint: e.target.value})}
                        />
                    </div>

                    <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">
                            API Key
                        </label>
                        <input 
                            type="password" 
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 font-mono text-gray-700" 
                            placeholder="sk-..."
                            value={config.apiKey}
                            onChange={e => setConfig({...config, apiKey: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Deployment Name
                            </label>
                            <input 
                                type="text" 
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 font-mono text-gray-700" 
                                placeholder="gpt-4"
                                value={config.deployment}
                                onChange={e => setConfig({...config, deployment: e.target.value})}
                            />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1">
                                API Version
                            </label>
                            <input 
                                type="text" 
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 font-mono text-gray-700" 
                                placeholder="2024-02-15-preview"
                                value={config.apiVersion}
                                onChange={e => setConfig({...config, apiVersion: e.target.value})}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                    >
                        Save Configuration
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
