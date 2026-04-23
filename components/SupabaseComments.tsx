'use client';

import { createBrowserClient } from '@supabase/ssr';
import { useEffect, useState } from 'react';
import { 
  Send, 
  MessageSquare, 
  Reply, 
  LogOut, 
  User as UserIcon, 
  CornerDownRight,
  X
} from 'lucide-react';

export default function SupabaseComments({ postId }: { postId: string }) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [user, setUser] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<{ id: string, name: string, level: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchComments();
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [postId]);

  const fetchComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', String(postId))
      .order('created_at', { ascending: true });
    setComments(data || []);
  };

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.reload(); // Refresh untuk membersihkan state
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;
    setIsLoading(true);

    const payload = {
      post_id: String(postId),
      user_name: user.user_metadata?.full_name || 'Pembaca',
      user_avatar: user.user_metadata?.avatar_url || '',
      content: newComment.trim(),
      parent_id: replyTo?.id || null,
      level: replyTo ? replyTo.level + 1 : 0
    };

    const { error } = await supabase.from('comments').insert([payload]);

    if (!error) {
      setNewComment('');
      setReplyTo(null);
      fetchComments();
    }
    setIsLoading(false);
  };

  const renderComments = (parentId: string | null = null, currentLevel = 0) => {
    return comments
      .filter(c => c.parent_id === parentId)
      .map(comment => (
        <div key={comment.id} className={`${parentId ? 'ml-6 md:ml-12 mt-6 border-l-2 border-slate-100 pl-4' : 'mt-10'}`}>
          <div className="flex gap-4 items-start group">
            <div className="relative flex-shrink-0">
               <img 
                 src={comment.user_avatar || 'https://via.placeholder.com/100'} 
                 className="w-10 h-10 rounded-full border-2 border-white shadow-sm ring-1 ring-slate-100 object-cover" 
                 alt="" 
               />
               {parentId && (
                 <div className="absolute -left-6 top-5 w-4 h-0.5 bg-slate-100"></div>
               )}
            </div>
            <div className="flex-1">
              <div className="bg-slate-50/80 p-5 rounded-2xl group-hover:bg-slate-50 transition-all border border-transparent group-hover:border-slate-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-black text-slate-900 text-[11px] uppercase tracking-tight leading-none">
                    {comment.user_name}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase italic">
                    {new Date(comment.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
                <p className="text-slate-600 text-[13px] leading-relaxed font-medium">
                  {comment.content}
                </p>
                
                {user && comment.level < 2 && (
                  <button 
                    onClick={() => {
                      setReplyTo({ id: comment.id, name: comment.user_name, level: comment.level });
                      document.getElementById('comment-input')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="mt-3 flex items-center gap-1.5 text-[9px] font-black text-blue-600 uppercase tracking-[0.1em] hover:text-blue-800 transition-colors"
                  >
                    <Reply size={12} className="rotate-180" /> Balas Tanggapan
                  </button>
                )}
              </div>
            </div>
          </div>
          {renderComments(comment.id, currentLevel + 1)}
        </div>
      ));
  };

  return (
    <div className="bg-white p-6 md:p-10 rounded-[2rem] shadow-sm border border-slate-100 mt-12 overflow-hidden">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 border-b border-slate-50 pb-8">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-xl shadow-blue-100">
            <MessageSquare size={22} />
          </div>
          <div>
            <h4 className="font-black text-slate-900 uppercase tracking-tighter text-xl leading-none">Ruang Diskusi</h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Berbagi Inspirasi & Apresiasi</p>
          </div>
        </div>

        {user && (
          <div className="flex items-center gap-3 bg-slate-50 p-2 pr-4 rounded-2xl border border-slate-100">
             <img 
               src={user.user_metadata?.avatar_url} 
               className="w-8 h-8 rounded-full border-2 border-white shadow-sm" 
               alt="User" 
             />
             <div className="flex flex-col">
               <span className="text-[9px] font-black text-slate-400 uppercase leading-none">Login sebagai</span>
               <span className="text-[11px] font-black text-slate-700 truncate max-w-[120px] uppercase tracking-tight">
                 {user.user_metadata?.full_name?.split(' ')[0]}
               </span>
             </div>
             <button 
               onClick={handleLogout}
               className="ml-2 p-2 text-slate-400 hover:text-red-500 transition-colors"
               title="Keluar"
             >
               <LogOut size={16} />
             </button>
          </div>
        )}
      </div>

      {/* INPUT AREA */}
      <div id="comment-input">
        {user ? (
          <form onSubmit={handleSubmit} className="mb-12">
            {replyTo && (
              <div className="mb-4 flex items-center justify-between bg-blue-50/50 p-3 px-4 rounded-xl border border-blue-100 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center gap-2">
                  <CornerDownRight size={14} className="text-blue-600" />
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-wide">
                    Membalas pesan <span className="text-blue-800">{replyTo.name}</span>
                  </p>
                </div>
                <button 
                  type="button"
                  onClick={() => setReplyTo(null)} 
                  className="p-1 hover:bg-blue-100 rounded-full text-blue-600 transition-all"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            <div className="relative group">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={replyTo ? `Tulis balasan untuk ${replyTo.name}...` : "Tulis pendapat Anda di sini..."}
                className="w-full p-5 md:p-6 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-50 focus:border-blue-400 outline-none transition-all text-sm min-h-[130px] bg-slate-50/30 placeholder:text-slate-400 font-medium resize-none"
              />
              <div className="flex justify-end mt-4">
                <button 
                  disabled={isLoading || !newComment.trim()} 
                  type="submit" 
                  className="group bg-blue-600 text-white px-10 py-3 rounded-xl font-black text-[11px] uppercase tracking-[0.15em] hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <><Send size={14} className="group-hover:translate-x-1 transition-transform" /> Kirim Komentar</>
                  )}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="bg-slate-50 p-10 rounded-[2.5rem] text-center mb-12 border border-dashed border-slate-200 group">
            <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform duration-500">
               <UserIcon size={28} className="text-slate-300" />
            </div>
            <h5 className="font-black text-slate-800 uppercase tracking-tighter text-sm mb-2">Ingin ikut berdiskusi?</h5>
            <p className="text-slate-500 text-xs font-medium mb-8 max-w-[240px] mx-auto leading-relaxed">
              Gunakan akun Google Anda untuk memberikan apresiasi atau tanggapan.
            </p>
            <button 
              onClick={handleLogin} 
              className="inline-flex items-center gap-4 bg-white border border-slate-200 px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:shadow-2xl hover:border-blue-200 transition-all active:scale-95 shadow-sm"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
              Masuk dengan Google
            </button>
          </div>
        )}
      </div>

      {/* LIST SECTION */}
      <div className="space-y-2">
        {comments.length > 0 ? renderComments(null) : (
          <div className="text-center py-20 bg-slate-50/30 rounded-[2rem] border border-dashed border-slate-100">
            <MessageSquare size={40} className="mx-auto text-slate-100 mb-4" />
            <p className="text-slate-300 text-[10px] font-black uppercase tracking-[0.2em] italic">Belum ada tanggapan di sini...</p>
          </div>
        )}
      </div>
    </div>
  );
}