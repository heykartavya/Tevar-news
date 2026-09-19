import React, { useState } from 'react';
import { PostBlock } from '../types';
import { ArrowUp, ArrowDown, Trash2, Image as ImageIcon, Type, Video, Plus, Facebook, Instagram, Youtube } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { ImageUploader } from './ImageUploader';
import { getYouTubeEmbedUrl, getFacebookEmbedUrl, isFacebookReel, getInstagramEmbedUrl } from '../lib/utils';

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
      <div className="flex flex-wrap gap-2 mb-4 bg-gray-50 p-2.5 rounded-lg border border-gray-200">
        <button type="button" onClick={() => addBlock('text')} className="flex items-center gap-1.5 px-3 py-2 bg-white text-gray-700 text-sm font-medium rounded border border-gray-300 hover:bg-gray-100 transition-colors shadow-xs">
          <Type size={16} className="text-gray-600" /> Add Text
        </button>
        <button type="button" onClick={() => addBlock('image')} className="flex items-center gap-1.5 px-3 py-2 bg-white text-gray-700 text-sm font-medium rounded border border-gray-300 hover:bg-gray-100 transition-colors shadow-xs">
          <ImageIcon size={16} className="text-emerald-600" /> Add Image
        </button>
        <button type="button" onClick={() => addBlock('youtube')} className="flex items-center gap-1.5 px-3 py-2 bg-white text-gray-700 text-sm font-medium rounded border border-gray-300 hover:bg-red-50 transition-colors shadow-xs">
          <Youtube size={16} className="text-red-600" /> Add YouTube
        </button>
        <button type="button" onClick={() => addBlock('facebook')} className="flex items-center gap-1.5 px-3 py-2 bg-white text-gray-700 text-sm font-medium rounded border border-gray-300 hover:bg-blue-50 transition-colors shadow-xs">
          <Facebook size={16} className="text-blue-600" /> Add Facebook Video / Reel
        </button>
        <button type="button" onClick={() => addBlock('instagram')} className="flex items-center gap-1.5 px-3 py-2 bg-white text-gray-700 text-sm font-medium rounded border border-gray-300 hover:bg-pink-50 transition-colors shadow-xs">
          <Instagram size={16} className="text-pink-600" /> Add Instagram Video / Reel
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
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-gray-700 uppercase flex items-center gap-1.5">
                      <Youtube size={14} className="text-red-600" /> YouTube Video / Shorts
                    </label>
                  </div>
                  <input 
                    type="url" 
                    placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                    value={block.content || ''}
                    onChange={(e) => updateBlock(block.id, e.target.value)}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  {block.content && getYouTubeEmbedUrl(block.content) && (
                    <div className="mt-4 aspect-video rounded-md overflow-hidden bg-black shadow-sm">
                      <iframe 
                        width="100%" 
                        height="100%" 
                        src={getYouTubeEmbedUrl(block.content)!} 
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                      />
                    </div>
                  )}
                </div>
              )}

              {block.type === 'facebook' && (() => {
                const fbEmbedUrl = block.content ? getFacebookEmbedUrl(block.content) : null;
                const isReel = block.content ? isFacebookReel(block.content) : false;
                return (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-gray-700 uppercase flex items-center gap-1.5">
                        <Facebook size={14} className="text-blue-600" /> Facebook Video / Reel Link
                      </label>
                      <span className="text-[11px] text-gray-500">Supports facebook.com/reel, watch, and video links</span>
                    </div>
                    <input 
                      type="url" 
                      placeholder="https://www.facebook.com/reel/... or https://www.facebook.com/watch/?v=..."
                      value={block.content || ''}
                      onChange={(e) => updateBlock(block.id, e.target.value)}
                      className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {fbEmbedUrl ? (
                      <div className="mt-4 flex flex-col items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="text-xs text-gray-500 mb-2 font-medium">Facebook Player Preview:</div>
                        <div className={`overflow-hidden rounded-lg shadow-sm bg-black ${isReel ? 'w-[340px] max-w-full h-[540px]' : 'w-full aspect-video'}`}>
                          <iframe 
                            src={fbEmbedUrl}
                            className="w-full h-full border-0"
                            style={{ border: 'none', overflow: 'hidden' }} 
                            scrolling="no" 
                            frameBorder="0" 
                            allowFullScreen={true} 
                            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                            title="Facebook video player preview"
                          />
                        </div>
                      </div>
                    ) : block.content ? (
                      <p className="text-xs text-amber-600 mt-2">
                        Please enter a valid public Facebook video or reel URL (e.g., https://www.facebook.com/reel/123456789)
                      </p>
                    ) : null}
                  </div>
                );
              })()}

              {block.type === 'instagram' && (() => {
                const igEmbedUrl = block.content ? getInstagramEmbedUrl(block.content) : null;
                return (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-gray-700 uppercase flex items-center gap-1.5">
                        <Instagram size={14} className="text-pink-600" /> Instagram Reel / Video Link
                      </label>
                      <span className="text-[11px] text-gray-500">Supports instagram.com/reel and instagram.com/p links</span>
                    </div>
                    <input 
                      type="url" 
                      placeholder="https://www.instagram.com/reel/... or https://www.instagram.com/p/..."
                      value={block.content || ''}
                      onChange={(e) => updateBlock(block.id, e.target.value)}
                      className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                    {igEmbedUrl ? (
                      <div className="mt-4 flex flex-col items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="text-xs text-gray-500 mb-2 font-medium">Instagram Player Preview:</div>
                        <div className="w-[360px] max-w-full h-[540px] overflow-hidden rounded-lg shadow-sm border border-gray-200 bg-white">
                          <iframe 
                            src={igEmbedUrl}
                            className="w-full h-full border-0"
                            frameBorder="0" 
                            scrolling="no" 
                            allowTransparency={true}
                            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
                            title="Instagram player preview"
                          />
                        </div>
                      </div>
                    ) : block.content ? (
                      <p className="text-xs text-amber-600 mt-2">
                        Please enter a valid Instagram reel or post URL (e.g., https://www.instagram.com/reel/C8qX-zsvPqQ/)
                      </p>
                    ) : null}
                  </div>
                );
              })()}
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
