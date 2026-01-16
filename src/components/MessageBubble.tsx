import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message } from '@/types';

interface MessageBubbleProps {
    message: Message;
    onSuggestionClick: (text: string) => void;
}

const preprocessContent = (content: string) => {
    if (!content) return '';
    
    // Cleanup: Remove "Anchor:" labels and bullet points if they precede a link/anchor
    // This fixes issues where the LLM breaks flow by listing anchors explicitly
    let processed = content.replace(/(?:\r\n|\r|\n|^)\s*[\*\-]?\s*Anchor:\s*(?=\[)/gi, '\n');
    
    // Hide anchor markers during streaming/before hydration
    processed = processed.replace(/\[([^\]]*)\]\(__ANCHOR__\)/g, '$1'); 
    
    // Fix broken suggestion links (handle nested parentheses and encoding)
    // We manually parse to handle balanced parentheses which regex struggles with
    let result = '';
    let cursor = 0;
    const suggestionMarker = '](suggestion:';

    while (cursor < processed.length) {
        const markerIndex = processed.indexOf(suggestionMarker, cursor);
        if (markerIndex === -1) {
            result += processed.slice(cursor);
            break;
        }

        // Search backwards for the opening '['
        let bracketCount = 0;
        let startBracketIndex = -1;
        
        for (let i = markerIndex - 1; i >= cursor; i--) {
            if (processed[i] === ']') bracketCount++;
            else if (processed[i] === '[') {
                if (bracketCount === 0) {
                    startBracketIndex = i;
                    break;
                }
                bracketCount--;
            }
        }

        if (startBracketIndex === -1) {
            // No matching '[' found, treat as plain text
            result += processed.slice(cursor, markerIndex + 13);
            cursor = markerIndex + 13;
            continue;
        }

        // Append text before the link
        result += processed.slice(cursor, startBracketIndex);

        // Find the closing ')'
        const urlStartIndex = markerIndex + 13; // Length of '](suggestion:'
        let parenCount = 1;
        let urlEndIndex = -1;

        for (let i = urlStartIndex; i < processed.length; i++) {
            if (processed[i] === '(') parenCount++;
            else if (processed[i] === ')') parenCount--;
            
            if (parenCount === 0) {
                urlEndIndex = i;
                break;
            }
        }

        if (urlEndIndex === -1) {
            // Unclosed parenthesis, treat as plain text
            result += processed.slice(startBracketIndex, urlStartIndex);
            cursor = urlStartIndex;
            continue;
        }

        // Extract and process
        const text = processed.slice(startBracketIndex + 1, markerIndex);
        const rawSuggestion = processed.slice(urlStartIndex, urlEndIndex);
        
        let encodedSuggestion = rawSuggestion;
        try {
            // Normalize encoding: decode first to avoid double-encoding, then encode
            encodedSuggestion = encodeURIComponent(decodeURIComponent(rawSuggestion));
        } catch (e) {
            encodedSuggestion = encodeURIComponent(rawSuggestion);
        }

        result += `[${text}](suggestion:${encodedSuggestion})`;
        cursor = urlEndIndex + 1;
    }

    return result;
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onSuggestionClick }) => {
    const isAssistant = message.role === 'assistant';

    return (
        <div className={`flex gap-4 ${isAssistant ? '' : 'justify-end'}`}>
            {isAssistant && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex-shrink-0 mt-1" />
            )}
            <div className={`text-gray-800 leading-relaxed ${!isAssistant ? 'bg-[#ffe8d6] px-5 py-3 rounded-2xl max-w-[80%]' : 'flex-1'}`}>
                {isAssistant ? (
                    <div className="markdown-body">
                        <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            urlTransform={(value: string) => value}
                            components={{
                                h1: ({node, ...props}) => <h1 className="text-2xl font-bold mb-4 mt-6 text-gray-900" {...props} />,
                                h2: ({node, ...props}) => <h2 className="text-xl font-bold mb-3 mt-5 text-gray-900" {...props} />,
                                h3: ({node, ...props}) => <h3 className="text-lg font-bold mb-2 mt-4 text-gray-900 flex items-center gap-2" {...props} />,
                                p: ({node, ...props}) => <p className="mb-4 leading-7 text-gray-800" {...props} />,
                                ul: ({node, ...props}) => <ul className="mb-4 space-y-2 list-disc pl-5" {...props} />,
                                ol: ({node, ...props}) => <ol className="mb-4 space-y-2 list-decimal pl-5" {...props} />,
                                li: ({node, ...props}) => <li className="pl-1" {...props} />,
                                strong: ({node, ...props}) => <strong className="font-semibold text-gray-900" {...props} />,
                                a: ({node, href, children, ...props}) => {
                                    if (href?.startsWith('suggestion:')) {
                                        const suggestionText = decodeURIComponent(href.replace('suggestion:', ''));
                                        return (
                                            <button 
                                                onClick={() => onSuggestionClick(suggestionText)}
                                                className="group relative inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                            >
                                                <span className="border-b border-blue-300 group-hover:border-blue-600 border-dashed">{children}</span>
                                                <span className="ml-0.5 text-[10px] text-blue-400 opacity-50 group-hover:opacity-100">✨</span>
                                                
                                                {/* Tooltip */}
                                                <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 w-max max-w-[280px] -translate-x-1/2 rounded-xl bg-[#0f172a] px-4 py-3 text-sm font-medium text-white opacity-0 shadow-2xl transition-all duration-200 group-hover:opacity-100 group-hover:-translate-y-1 z-50 text-center leading-relaxed">
                                                    {suggestionText}
                                                    {/* Arrow */}
                                                    <span className="absolute left-1/2 top-full -translate-x-1/2 -mt-1.5 h-3 w-3 rotate-45 bg-[#0f172a]"></span>
                                                </span>
                                            </button>
                                        )
                                    }
                                    return <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline" {...props}>{children}</a>
                                }
                            }}
                        >
                            {preprocessContent(message.content)}
                        </ReactMarkdown>
                    </div>
                ) : (
                    <div>{message.content}</div>
                )}
                {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {message.suggestions.map((sug, i) => (
                            <button 
                                key={i}
                                onClick={() => onSuggestionClick(sug)}
                                className="text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-100 transition-colors text-left"
                            >
                                {sug}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
