'use client';

import { createBrowserClient } from '@supabase/ssr';
import { useEffect, useState, useCallback } from 'react';
import { 
  Send, 
  MessageSquare, 
  Reply, 
  LogOut, 
  User as UserIcon, 
  CornerDownRight,
  X,
  Clock
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

  // --- AMBIL DATA KOMENTAR ---
  const fetchComments = useCallback(async () => {
    const { data } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', String(postId))
      .order('created_at', { ascending: true });
    setComments(data || []);
  }, [postId, supabase]);

  useEffect(() => {
    fetchComments();
    
    // Cek User
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    // --- REALTIME SUBSCRIPTION (BIAR AUTO-MUNCUL) ---
    const channel = supabase
      .channel('realtime_comments')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'comments',
        filter: `post_id=eq.${postId}` 
      }, () => {
        fetchComments();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId, supabase, fetchComments]);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.reload();
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
      // fetchComments() sudah dihandle oleh Realtime Channel
    }
    setIsLoading(false);
  };

  // --- RENDER RECURSIVE ---
  const renderComments = (parentId: string | null = null) => {
    return comments
      .filter(c => c.parent_id === parentId)
      .map(comment => (
        <div key={comment.id} className={`${parentId ? 'ml-6 md:ml-12 mt-6 border-l-2 border-slate-100 pl-4 md:pl-6' : 'mt-10'}`}>
          <div className="flex gap-4 items-start group">
            <div className="relative flex-shrink-0">
               <img 
                 src={comment.user_avatar || 'https://via.placeholder.com/100'} 
                 className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white shadow-sm ring-1 ring-slate-100 object-cover" 
                 alt="" 
               />
               {parentId && (
                 <div className="absolute -left-6 md:-left-10 top-5 w-4 md:w-8 h-0.5 bg-slate-100"></div>
               )}
            </div>
            <div className="flex-1">
              <div className="bg-white p-5 rounded-2xl group-hover:bg-slate-50 transition-all border border-slate-100 shadow-sm group-hover:shadow-md">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-black text-slate-900 text-[11px] uppercase tracking-tight">
                    {comment.user_name}
                  </span>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Clock size={10} />
                    <span className="text-[9px] font-bold uppercase italic">
                      {new Date(comment.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                <p className="text-slate-600 text-[13px] leading-relaxed font-medium">
                  {comment.content}
                </p>
                
                {user && comment.level < 2 && (
                  <button 
                    onClick={() => {
                      setReplyTo({ id: comment.id, name: comment.user_name, level: comment.level });
                      document.getElementById('comment-form')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="mt-3 flex items-center gap-2 text-[9px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-800 transition-colors"
                  >
                    <Reply size={12} className="rotate-180" /> Balas Pesan
                  </button>
                )}
              </div>
            </div>
          </div>
          {renderComments(comment.id)}
        </div>
      ));
  };

  return (
    <div className="bg-[#F8FAFC] p-4 md:p-10 rounded-[2.5rem] border border-slate-100 mt-16 shadow-inner">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-3.5 rounded-2xl text-white shadow-xl shadow-blue-200">
            <MessageSquare size={24} />
          </div>
          <div>
            <h4 className="font-black text-slate-900 uppercase tracking-tighter text-2xl leading-none italic">Diskusi Publik</h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1.5">Satu Ikatan Seribu Kreasi</p>
          </div>
        </div>

        {user ? (
          <div className="flex items-center gap-3 bg-white p-2 pr-5 rounded-2xl border border-slate-200 shadow-sm self-start md:self-center">
             <img 
               src={user.user_metadata?.avatar_url} 
               className="w-10 h-10 rounded-xl border border-slate-100 object-cover shadow-sm" 
               alt="Avatar" 
             />
             <div className="flex flex-col">
               <span className="text-[8px] font-black text-blue-600 uppercase leading-none mb-1">Terhubung sebagai</span>
               <span className="text-[11px] font-black text-slate-700 truncate max-w-[140px] uppercase">
                 {user.user_metadata?.full_name}
               </span>
             </div>
             <button 
               onClick={handleLogout}
               className="ml-4 p-2.5 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
               title="Keluar"
             >
               <LogOut size={16} />
             </button>
          </div>
        ) : (
           <div className="bg-blue-50 px-5 py-2 rounded-xl border border-blue-100">
              <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest animate-pulse">Mode Tamu - Login untuk membalas</span>
           </div>
        )}
      </div>

      {/* INPUT AREA */}
      <div id="comment-form" className="mb-16">
        {user ? (
          <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100">
            {replyTo && (
              <div className="mb-6 flex items-center justify-between bg-orange-50 p-3 px-5 rounded-xl border border-orange-100">
                <div className="flex items-center gap-3">
                  <CornerDownRight size={16} className="text-orange-600" />
                  <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">
                    Membalas Tanggapan <span className="text-orange-800 underline">{replyTo.name}</span>
                  </p>
                </div>
                <button 
                  type="button"
                  onClick={() => setReplyTo(null)} 
                  className="p-1.5 hover:bg-orange-200/50 rounded-full text-orange-600 transition-all"
                >
                  <X size={16} />
                </button>
              </div>
            )}
            
            <div className="relative">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={replyTo ? `Tulis balasan untuk ${replyTo.name}...` : "Apa pendapat Anda mengenai kegiatan ini?"}
                className="w-full p-0 border-none focus:ring-0 outline-none text-sm font-medium text-slate-700 placeholder:text-slate-300 min-h-[100px] resize-none"
              />
              <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-4">
                <div className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter italic">
                  Gunakan bahasa yang sopan & mendidik
                </div>
                <button 
                  disabled={isLoading || !newComment.trim()} 
                  type="submit" 
                  className="bg-blue-600 text-white px-8 py-3 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3"
                >
                  {isLoading ? 'Memproses...' : <><Send size={14} /> Kirim Pesan</>}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="bg-white p-12 rounded-[3rem] text-center shadow-sm border border-slate-100">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100">
               <UserIcon size={32} className="text-slate-200" />
            </div>
            <h5 className="font-black text-slate-800 uppercase tracking-tighter text-lg mb-3 italic">Buktikan Kreasi Anda!</h5>
            <p className="text-slate-400 text-[11px] font-medium mb-10 max-w-[300px] mx-auto leading-relaxed uppercase tracking-widest">
              Silakan masuk menggunakan akun Google untuk bergabung dalam diskusi.
            </p>
            <button 
              onClick={handleLogin} 
              className="inline-flex items-center gap-4 bg-white border-2 border-slate-100 px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:border-blue-500 hover:shadow-2xl hover:text-blue-600 transition-all active:scale-95"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
              Masuk dengan Akun Google
            </button>
          </div>
        )}
      </div>

      {/* COMMENTS LIST */}
      <div className="space-y-4">
        {comments.length > 0 ? renderComments(null) : (
          <div className="text-center py-20">
            <MessageSquare size={48} className="mx-auto text-slate-100 mb-5 opacity-50" />
            <p className="text-slate-300 text-[11px] font-black uppercase tracking-[0.3em] italic">Mari menjadi yang pertama berdiskusi...</p>
          </div>
        )}
      </div>
    </div>
  );
}