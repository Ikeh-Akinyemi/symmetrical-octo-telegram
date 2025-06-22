'use client';
import { useChat } from '@ai-sdk/react';

export default function ChatComponent() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();
  
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">AI Chat Assistant</h1>
      
      <div className="space-y-4 mb-4">
        {messages.map(message => (
          <div key={message.id} className={`p-3 rounded-lg ${
            message.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'
          }`}>
            <div className="font-semibold">
              {message.role === 'user' ? 'User: ' : 'AI: '}
            </div>
            <div>{message.content}</div>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input 
          value={input} 
          onChange={handleInputChange} 
          disabled={isLoading}
          placeholder="Type a message..."
          className="flex-1 p-2 border border-gray-300 rounded-md"
        />
        <button 
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Send
        </button>
      </form>
    </div>
  );
}