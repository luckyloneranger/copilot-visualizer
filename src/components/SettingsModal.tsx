import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { useChat } from '@/context/ChatContext';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const { apiConfig, updateApiConfig } = useChat();
    const [config, setConfig] = useState(apiConfig);
    const [showApiKey, setShowApiKey] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setConfig(apiConfig);
    }, [apiConfig, isOpen]);

    if (!isOpen) return null;

    const handleSave = () => {
        updateApiConfig(config);
        onClose();
    };
    
    // Config fields definition for easier maintenance
    const fields = [
        { 
            label: "Azure OpenAI Endpoint", 
            key: "endpoint" as const,
            placeholder: "https://your-resource.openai.azure.com/",
            type: "text",
            fullWidth: true
        },
        { 
            label: "API Key", 
            key: "apiKey" as const,
            placeholder: "sk-...",
            type: showApiKey ? "text" : "password",
            fullWidth: true,
            isSecure: true
        },
        { 
            label: "Deployment Name", 
            key: "deployment" as const,
            placeholder: "gpt-4",
            type: "text",
            fullWidth: false
        },
        { 
            label: "API Version", 
            key: "apiVersion" as const,
            placeholder: "2024-02-15-preview",
            type: "text",
            fullWidth: false
        }
    ];

    const handleChange = (key: keyof typeof config, value: string) => {
        setConfig(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white rounded-xl w-[500px] shadow-2xl p-6 relative text-gray-900 flex flex-col max-h-[90vh]">
                 <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <X size={20} className="text-gray-500" />
                </button>

                <h2 className="text-xl font-semibold mb-2 text-gray-900">Azure OpenAI Configuration</h2>
                <p className="text-sm text-gray-500 mb-6">Enter your credentials to use the chat features. These are stored locally in your browser.</p>

                <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Current Active Persona
                        </label>
                         <p className="text-xs text-gray-400 mb-2">
                            Configurations will be used for all personas.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {fields.map((field) => (
                            <div key={field.key} className={field.fullWidth ? "col-span-2" : "col-span-1"}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {field.label}
                                </label>
                                <div className="relative">
                                    <input 
                                        type={field.type} 
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 font-mono text-gray-700 transition-colors" 
                                        placeholder={field.placeholder}
                                        value={config[field.key]}
                                        onChange={e => handleChange(field.key, e.target.value)}
                                    />
                                    {field.isSecure && (
                                        <button
                                            type="button"
                                            onClick={() => setShowApiKey(!showApiKey)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
                    >
                        Save Configuration
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
