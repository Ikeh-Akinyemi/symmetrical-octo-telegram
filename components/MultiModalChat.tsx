'use client';
import { useChat } from '@ai-sdk/react';
import { useState } from 'react';

interface ImagePreviewsProps {
  files: File[];
  onRemove: (files: File[]) => void;
}

export default function MultiModalChat() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  const { 
    messages, 
    input, 
    handleInputChange, 
    handleSubmit, 
    status 
  } = useChat({
    api: '/api/multi-modal',
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
  };

  const fileToDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const customSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Convert files to data URLs for API compatibility
    const attachments = await Promise.all(
      selectedFiles.map(async (file) => ({
        name: file.name,
        contentType: file.type,
        url: await fileToDataURL(file)
      }))
    );

    handleSubmit(event, {
      experimental_attachments: attachments
    });
    
    setSelectedFiles([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 text-gray-900">Multi-Modal AI Chat</h2>
      
      {/* Messages container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>Start a conversation by uploading images and asking questions!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-900 border border-gray-200'
                }`}>
                  <div className="text-sm font-medium mb-1 opacity-75">
                    {message.role === 'user' ? 'You' : 'AI Assistant'}
                  </div>
                  <div className="text-sm leading-relaxed">{message.content}</div>
                  
                  {/* Show attached images for user messages */}
                  {message.role === 'user' && message.experimental_attachments && (
                    <div className="mt-2 flex gap-2 flex-wrap">
                      {message.experimental_attachments.map((attachment, index) => (
                        <img
                          key={index}
                          src={attachment.url}
                          alt={attachment.name || 'Uploaded image'}
                          className="w-20 h-20 object-cover rounded border border-white/20"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          
          {status === 'streaming' && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 border border-gray-200 max-w-[80%] p-4 rounded-lg">
                <div className="text-sm font-medium mb-1 opacity-75">AI Assistant</div>
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="text-sm text-gray-600">Analyzing images...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={customSubmit} className="space-y-4">
          {/* File upload section */}
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-lg border border-gray-300 cursor-pointer transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              Attach Images
            </label>
            {selectedFiles.length > 0 && (
              <span className="text-sm text-gray-600 font-medium">
                {selectedFiles.length} image{selectedFiles.length > 1 ? 's' : ''} selected
              </span>
            )}
          </div>

          {/* File previews */}
          {selectedFiles.length > 0 && (
            <ImagePreviews files={selectedFiles} onRemove={setSelectedFiles} />
          )}

          {/* Input and submit */}
          <div className="flex gap-3">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Describe what you want to know about the images..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              disabled={status === 'streaming'}
            />
            <button
              type="submit"
              disabled={status === 'streaming' || (!input.trim() && selectedFiles.length === 0)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              {status === 'streaming' ? 'Analyzing...' : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ImagePreviews({ files, onRemove }: ImagePreviewsProps) {
  const removeFile = (indexToRemove: number) => {
    onRemove(files.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex gap-3 flex-wrap">
        {files.map((file, index) => (
          <div key={index} className="relative group">
            <img
              src={URL.createObjectURL(file)}
              alt={file.name}
              className="w-20 h-20 object-cover rounded-lg border border-gray-300 shadow-sm"
            />
            <button
              type="button"
              onClick={() => removeFile(index)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-medium transition-colors shadow-sm"
            >
              ×
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg truncate">
              {file.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}