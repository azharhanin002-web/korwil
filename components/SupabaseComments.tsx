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
  Clock,
  ShieldCheck
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
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const channel = supabase
      .channel(`comments-${postId}`)
      .on('postgres_changes', { 
        event: '*', 
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
    }
    setIsLoading(false);
  };

  const renderComments = (parentId: string | null = null) => {
    return comments
      .filter(c => c.parent_id === parentId)
      .map(comment => (
        <div key={comment.id} className={`${parentId ? 'ml-6 md:ml-12 mt-6 relative' : 'mt-10'}`}>
          {parentId && (
            <div className="absolute -left-4 md:-left-8 top-0 bottom-0 w-px bg-slate-100 group-hover:bg-blue-200 transition-colors">
              <div className="absolute top-6 left-0 w-4 md:w-8 h-px bg-slate-100"></div>
            </div>
          )}

          <div className="flex gap-4 items-start group relative">
            <div className="relative flex-shrink-0 z-10">
               <img 
                 src={comment.user_avatar || 'https://via.placeholder.com/100'} 
                 className="w-10 h-10 md:w-12 md:h-12 rounded-xl border-2 border-white shadow-sm ring-1 ring-slate-100 object-cover bg-white" 
                 alt="" 
               />
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm group-hover:shadow-md transition-all duration-300">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-[#002040] text-[11px] uppercase tracking-wider">
                      {comment.user_name}
                    </span>
                    {comment.level > 0 && (
                      <div className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                         <ShieldCheck size={10} className="text-blue-500" />
                         <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Verifikasi</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Clock size={10} />
                    <span className="text-[9px] font-bold uppercase">
                      {new Date(comment.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </div>
                
                <p className="text-slate-600 text-[13px] leading-relaxed font-medium">
                  {comment.content}
                </p>
              </div>

              {user && comment.level < 2 && (
                <button 
                  onClick={() => {
                    setReplyTo({ id: comment.id, name: comment.user_name, level: comment.level });
                    document.getElementById('comment-form-container')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors ml-2"
                >
                  <Reply size={12} className="rotate-180" /> Tanggapi
                </button>
              )}
            </div>
          </div>
          {renderComments(comment.id)}
        </div>
      ));
  };

  return (
    <div className="bg-white p-6 md:p-12 rounded-[2.5rem] border border-slate-100 mt-20 shadow-sm">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
        <div className="flex items-center gap-5">
          <div className="bg-[#002040] p-4 rounded-3xl text-white shadow-xl shadow-slate-200">
            <MessageSquare size={26} />
          </div>
          <div>
            <h4 className="font-black text-[#002040] uppercase tracking-tighter text-2xl leading-none italic">Kolom Diskusi</h4>
            <div className="flex items-center gap-2 mt-2">
               <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Interaksi Publik Aktif</p>
            </div>
          </div>
        </div>

        {user ? (
          <div className="flex items-center gap-4 bg-slate-50 p-2 pr-6 rounded-2xl border border-slate-200">
             <img 
               src={user.user_metadata?.avatar_url} 
               className="w-10 h-10 rounded-xl object-cover shadow-sm border-2 border-white" 
               alt="" 
             />
             <div className="flex flex-col">
               <span className="text-[11px] font-black text-slate-800 uppercase leading-none mb-1">
                 {user.user_metadata?.full_name}
               </span>
               <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                 Hak Akses Terverifikasi
               </span>
             </div>
             <button 
               onClick={handleLogout}
               className="ml-4 p-2 text-slate-300 hover:text-red-500 transition-all"
               title="Log Out"
             >
               <LogOut size={18} />
             </button>
          </div>
        ) : (
           <div className="inline-flex items-center gap-3 bg-slate-50 px-5 py-2.5 rounded-2xl border border-slate-200">
              <UserIcon size={14} className="text-slate-400" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Sesi Tamu</span>
           </div>
        )}
      </div>

      {/* --- INPUT AREA --- */}
      <div id="comment-form-container" className="mb-20">
        {user ? (
          <form onSubmit={handleSubmit} className="bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100 shadow-inner">
            {replyTo && (
              <div className="mb-6 flex items-center justify-between bg-[#002040] p-4 px-6 rounded-2xl shadow-lg">
                <div className="flex items-center gap-3 text-white">
                  <CornerDownRight size={18} className="text-blue-300" />
                  <p className="text-[10px] font-black uppercase tracking-[0.2em]">
                    Menanggapi Pesan <span className="text-blue-300">@ {replyTo.name}</span>
                  </p>
                </div>
                <button 
                  type="button"
                  onClick={() => setReplyTo(null)} 
                  className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
                >
                  <X size={16} />
                </button>
              </div>
            )}
            
            <div className="relative">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={replyTo ? `Tulis tanggapan Anda untuk ${replyTo.name}...` : "Sampaikan pendapat atau apresiasi Anda di sini..."}
                className="w-full p-2 bg-transparent border-none focus:ring-0 outline-none text-base font-semibold text-slate-700 placeholder:text-slate-300 min-h-[100px] resize-none"
              />
              <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-slate-200 mt-6 gap-4">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">
                  * Mohon gunakan bahasa yang bijak & edukatif
                </p>
                <button 
                  disabled={isLoading || !newComment.trim()} 
                  type="submit" 
                  className="w-full md:w-auto bg-[#002040] text-white px-12 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-blue-900 shadow-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4 group"
                >
                  {isLoading ? 'Mengirim...' : <>Kirim Tanggapan <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="bg-slate-50 p-14 rounded-[3.5rem] text-center border border-dashed border-slate-200">
            <div className="bg-white w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm border border-slate-100">
               <MessageSquare size={32} className="text-slate-200" />
            </div>
            <h5 className="font-black text-[#002040] uppercase tracking-tighter text-xl mb-3 italic">Ikuti Diskusi</h5>
            <p className="text-slate-400 text-[11px] font-bold mb-10 max-w-[320px] mx-auto leading-relaxed uppercase tracking-[0.15em]">
              Silakan masuk menggunakan akun Google Anda untuk memberikan tanggapan secara resmi.
            </p>
            <button 
              onClick={handleLogin} 
              className="inline-flex items-center gap-5 bg-white border-2 border-slate-200 px-12 py-5 rounded-3xl font-black text-[12px] uppercase tracking-widest hover:border-[#002040] hover:text-[#002040] transition-all active:scale-95 shadow-sm"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
              Masuk dengan Google
            </button>
          </div>
        )}
      </div>

      {/* --- LIST --- */}
      <div className="space-y-6">
        {comments.length > 0 ? renderComments(null) : (
          <div className="text-center py-20 opacity-30 grayscale">
            <MessageSquare size={48} className="mx-auto text-slate-300 mb-5" />
            <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.4em] italic leading-relaxed">
              Belum ada tanggapan publik.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}