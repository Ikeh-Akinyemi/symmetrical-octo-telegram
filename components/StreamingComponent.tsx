'use client';
import { useCompletion } from '@ai-sdk/react';

export default function StreamingComponent() {
  const { completion, input, handleInputChange, handleSubmit, isLoading } = useCompletion({
    api: '/api/completion',
  });

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Text Completion</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="prompt"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter your prompt..."
          className="w-full p-3 border border-gray-300 rounded-md"
        />
        <button 
          type="submit" 
          disabled={isLoading}
          className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
        >
          {isLoading ? 'Generating...' : 'Submit'}
        </button>
        
        {completion && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Generated Text:</h3>
            <div>{completion}</div>
          </div>
        )}
      </form>
    </div>
  );
}