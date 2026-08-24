import React, { useState } from 'react';
import { PostBlock } from '../types';
import { ArrowUp, ArrowDown, Trash2, Image as ImageIcon, Type, Video, Plus } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { ImageUploader } from './ImageUploader';

interface BlockEditorProps {
  blocks: PostBlock[];
  onChange: (blocks: PostBlock[]) => void;
}

export const BlockEditor: React.FC<BlockEditorProps> = ({ blocks, onChange }) => {
  const addBlock = (type: PostBlock['type']) => {
    const newBlock: PostBlock = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content: ''
    };
    onChange([...blocks, newBlock]);
  };

  const updateBlock = (id: string, content: string) => {
    onChange(blocks.map(b => b.id === id ? { ...b, content } : b));
  };

  const removeBlock = (id: string) => {
    onChange(blocks.filter(b => b.id !== id));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === blocks.length - 1)) return;
    
    const newBlocks = [...blocks];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[swapIndex]] = [newBlocks[swapIndex], newBlocks[index]];
    onChange(newBlocks);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4 bg-gray-50 p-2 rounded-lg border border-gray-200">
        <button type="button" onClick={() => addBlock('text')} className="flex items-center gap-1 px-3 py-2 bg-white text-gray-700 text-sm font-medium rounded border border-gray-300 hover:bg-gray-100 transition-colors">
          <Type size={16} /> Add Text
        </button>
        <button type="button" onClick={() => addBlock('image')} className="flex items-center gap-1 px-3 py-2 bg-white text-gray-700 text-sm font-medium rounded border border-gray-300 hover:bg-gray-100 transition-colors">
          <ImageIcon size={16} /> Add Image
        </button>
        <button type="button" onClick={() => addBlock('youtube')} className="flex items-center gap-1 px-3 py-2 bg-white text-gray-700 text-sm font-medium rounded border border-gray-300 hover:bg-gray-100 transition-colors">
          <Video size={16} /> Add YouTube
        </button>
      </div>

      <div className="space-y-6">
        {blocks.map((block, index) => (
          <div key={block.id} className="relative bg-white border border-gray-200 rounded-lg shadow-sm p-4 group">
            <div className="absolute -left-3 top-4 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button type="button" onClick={() => moveBlock(index, 'up')} className="p-1 bg-white border border-gray-300 rounded-full text-gray-600 hover:text-gray-900 shadow-sm" disabled={index === 0}>
                <ArrowUp size={14} />
              </button>
              <button type="button" onClick={() => moveBlock(index, 'down')} className="p-1 bg-white border border-gray-300 rounded-full text-gray-600 hover:text-gray-900 shadow-sm" disabled={index === blocks.length - 1}>
                <ArrowDown size={14} />
              </button>
            </div>
            
            <div className="absolute right-4 top-4 z-10">
              <button type="button" onClick={() => removeBlock(block.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors bg-white shadow-sm border border-gray-200">
                <Trash2 size={16} />
              </button>
            </div>

            <div className="pl-4 pr-10">
              {block.type === 'text' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Rich Text Block</label>
                  <ReactQuill 
                    theme="snow" 
                    value={block.content || ''} 
                    onChange={(val) => updateBlock(block.id, val)} 
                    className="bg-white"
                  />
                </div>
              )}

              {block.type === 'image' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Image Block (Cloudinary)</label>
                  <ImageUploader 
                    defaultImage={block.content}
                    onUploadSuccess={(url) => updateBlock(block.id, url)}
                    onUploadError={(err) => alert(`Upload failed: ${err}`)}
                  />
                </div>
              )}

              {block.type === 'youtube' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">YouTube Video</label>
                  <input 
                    type="url" 
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={block.content || ''}
                    onChange={(e) => updateBlock(block.id, e.target.value)}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  {block.content && block.content.includes('youtube.com/watch?v=') && (
                    <div className="mt-4 aspect-video rounded-md overflow-hidden bg-gray-100">
                      <iframe 
                        width="100%" 
                        height="100%" 
                        src={`https://www.youtube.com/embed/${new URL(block.content).searchParams.get('v')}`} 
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                      ></iframe>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {blocks.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
            <p className="text-gray-500 text-sm">No blocks added yet. Click the buttons above to start building your post.</p>
          </div>
        )}
      </div>
    </div>
  );
};
