import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DiscussionBoard = () => {
  const [activeTab, setActiveTab] = React.useState('notes'); // 'notes' or 'qna'

  return (
    <div className="viet-card border-none shadow-none bg-transparent">
      {/* Tabs Header */}
      <div className="flex bg-[#76c034] p-1.5 rounded-[20px] mb-6">
        <button
          onClick={() => setActiveTab('notes')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[15px] transition-all text-[14px] font-bold ${
            activeTab === 'notes' ? 'bg-[#98d65a]/30 text-white border border-[#ffffff]/20 shadow-inner' : 'text-white/70 hover:text-white'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Ghi chú
        </button>
        <button
          onClick={() => setActiveTab('qna')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[15px] transition-all text-[14px] font-bold ${
            activeTab === 'qna' ? 'bg-white text-[#76c034] shadow-lg' : 'text-white/70 hover:text-white'
          }`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
          </svg>
          Hỏi đáp
        </button>
      </div>

      {/* Input Area */}
      <div className="viet-card p-4 border-[#fff9ec] bg-[#fdfcfb] mb-6">
        <div className="flex bg-[#fffbf0] border border-[#f0ede4] rounded-full px-5 py-3 items-center gap-3">
          <input
            type="text"
            placeholder="Nhập bình luận ..."
            className="flex-1 bg-transparent border-none outline-none text-[14px] text-viet-text placeholder:text-[#b4bac2]"
          />
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-full bg-[#76c034] flex items-center justify-center text-white shadow-sm shadow-viet-green/20">
              <svg className="w-4 h-4 translate-x-[1px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2z" />
              </svg>
            </button>
            <button className="w-8 h-8 rounded-full bg-[#f9b800] flex items-center justify-center text-white shadow-sm shadow-[#f9b800]/20">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-2 px-2">
           <span className="text-[12px] font-bold text-viet-text-light uppercase">Tất cả 9 Bình luận</span>
        </div>
        
        {/* Sample Comment */}
        <div className="viet-card p-5 border-[#faefd4] bg-[#fffbf0]/50 relative overflow-visible">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-[12px] bg-[#f8f9fa] border border-viet-border overflow-hidden shrink-0">
               <img src="https://ui-avatars.com/api/?name=Quynh&background=random" alt="User" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-[14px] font-bold text-viet-text">Quynh</h4>
                <span className="text-[11px] text-viet-text-light font-medium">gửi bình luận lúc 10 ngày trước</span>
              </div>
              <p className="text-[12px] text-viet-text-light font-medium mb-3">Học sinh • Trường Tiểu học</p>
              
              <div className="bg-white border border-[#f0ede4] rounded-[15px] p-4 text-[14px] text-viet-text mb-3 shadow-sm italic">
                 Nhớ học bài nha các em
              </div>

              <div className="flex items-center justify-between">
                <button className="flex items-center gap-1 text-[11px] font-bold text-[#f9b800]">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  <span>4</span>
                </button>
                <div className="flex items-center gap-4">
                   <button className="flex items-center gap-1 text-[11px] font-bold text-viet-text-light hover:text-viet-green">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      Thích
                   </button>
                   <button className="flex items-center gap-1 text-[11px] font-bold text-viet-text-light hover:text-viet-green">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                      </svg>
                      Trả lời
                   </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Reply indicator */}
          <div className="absolute -bottom-3 left-8">
            <button className="bg-white border border-[#f0ede4] rounded-full px-3 py-1 flex items-center gap-1 shadow-sm text-[10px] font-bold text-viet-green">
               <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path d="M19 9l-7 7-7-7" />
               </svg>
               2 phản hồi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscussionBoard;
