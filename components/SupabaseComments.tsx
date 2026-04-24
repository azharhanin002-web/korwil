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

  // --- AMBIL DATA KOMENTAR ---
  const fetchComments = useCallback(async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', String(postId))
      .order('created_at', { ascending: true });
    
    if (!error) {
      setComments(data || []);
    }
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

  // --- HANDLER LOGIN ---
  const handleLogin = async () => {
    const currentPath = window.location.pathname; 
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { 
        redirectTo: `${window.location.origin}/auth/callback?next=${currentPath}#diskusikegiatan` 
      }
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.reload();
  };

  // --- SUBMIT KOMENTAR ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;
    setIsLoading(true);

    const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture || '';

    const payload = {
      post_id: String(postId),
      user_name: user.user_metadata?.full_name || 'Pembaca',
      user_avatar: avatarUrl,
      content: newComment.trim(),
      parent_id: replyTo?.id || null,
      level: replyTo ? replyTo.level + 1 : 0
    };

    const { error } = await supabase.from('comments').insert([payload]);

    if (!error) {
      setNewComment('');
      setReplyTo(null);
      await fetchComments(); 
    }
    setIsLoading(false);
  };

  // --- RENDER RECURSIVE (3 LEVEL) ---
  const renderComments = (parentId: string | null = null) => {
    return comments
      .filter(c => c.parent_id === parentId)
      .map(comment => (
        <div key={comment.id} className={`${parentId ? 'ml-6 md:ml-12 mt-4 relative border-l-2 border-slate-100 pl-4' : 'mt-10'}`}>
          <div className="flex gap-3 md:gap-4 items-start group">
            {/* AVATAR BULAT KOMENTAR */}
            <div className="w-9 h-9 md:w-11 md:h-11 rounded-full border border-slate-100 shadow-sm overflow-hidden bg-slate-50 flex-shrink-0">
              {comment.user_avatar ? (
                <img 
                  src={comment.user_avatar} 
                  referrerPolicy="no-referrer" 
                  className="w-full h-full object-cover" 
                  alt={comment.user_name} 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                  <UserIcon size={18} />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-1">
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm group-hover:shadow-md transition-all">
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-[#002040] text-[10px] uppercase tracking-wide">{comment.user_name}</span>
                    {comment.level > 0 && <ShieldCheck size={10} className="text-blue-500" />}
                  </div>
                  <span className="text-[8px] font-bold text-slate-300 uppercase italic">
                    {new Date(comment.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
                <p className="text-slate-600 text-[13px] leading-relaxed font-medium">{comment.content}</p>
              </div>

              {user && comment.level < 2 && (
                <button 
                  onClick={() => {
                    setReplyTo({ id: comment.id, name: comment.user_name, level: comment.level });
                    document.getElementById('diskusikegiatan')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2 text-[8px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors ml-1"
                >
                  <Reply size={10} className="rotate-180" /> Balas
                </button>
              )}
            </div>
          </div>
          {renderComments(comment.id)}
        </div>
      ));
  };

  return (
    <div id="diskusikegiatan" className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 mt-16 shadow-sm">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-slate-50 pb-6">
        <div className="flex items-center gap-4">
          <div className="bg-[#002040] p-3 rounded-2xl text-white shadow-lg">
            <MessageSquare size={22} />
          </div>
          <div>
            <h4 className="font-black text-[#002040] uppercase tracking-tighter text-xl leading-none italic">Kolom Interaksi</h4>
            <div className="flex items-center gap-2 mt-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Aktivitas Diskusi Publik</p>
            </div>
          </div>
        </div>

        {user && (
          <div className="flex items-center gap-3 bg-slate-50 p-1.5 pr-4 rounded-full border border-slate-100">
             {/* AVATAR BULAT HEADER */}
             <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow-sm bg-white">
                <img 
                  src={user.user_metadata?.avatar_url || user.user_metadata?.picture} 
                  referrerPolicy="no-referrer" 
                  className="w-full h-full object-cover" 
                  alt="" 
                />
             </div>
             <div className="flex flex-col">
               <span className="text-[10px] font-black text-slate-800 uppercase leading-none">{user.user_metadata?.full_name?.split(' ')[0]}</span>
               <span className="text-[7px] font-bold text-blue-500 uppercase tracking-widest">Online</span>
             </div>
             <button onClick={handleLogout} className="ml-2 text-slate-300 hover:text-red-500 transition-all" title="Keluar"><LogOut size={16} /></button>
          </div>
        )}
      </div>

      {/* INPUT AREA */}
      <div className="mb-12">
        {user ? (
          <form onSubmit={handleSubmit} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-inner">
            {replyTo && (
              <div className="mb-4 flex items-center justify-between bg-[#002040] p-3 px-4 rounded-xl text-white shadow-md">
                <div className="flex items-center gap-2">
                  <CornerDownRight size={14} className="text-blue-300" />
                  <p className="text-[9px] font-black uppercase tracking-widest">Balas Pesan: <span className="text-blue-200">@{replyTo.name}</span></p>
                </div>
                <button type="button" onClick={() => setReplyTo(null)} className="hover:text-red-400"><X size={16} /></button>
              </div>
            )}
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={replyTo ? `Tulis balasan untuk ${replyTo.name}...` : "Berikan tanggapan atau apresiasi Anda..."}
              className="w-full p-0 bg-transparent border-none focus:ring-0 outline-none text-sm font-semibold text-slate-700 placeholder:text-slate-300 min-h-[90px] resize-none"
            />
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 mt-4">
              <span className="text-[8px] font-bold text-slate-300 uppercase tracking-[0.2em] italic">Gunakan bahasa yang edukatif</span>
              <button 
                disabled={isLoading || !newComment.trim()} 
                type="submit" 
                className="bg-[#002040] text-white px-10 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-900 transition-all active:scale-95 disabled:opacity-50"
              >
                {isLoading ? 'Mengirim...' : 'Kirim'}
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-slate-50 p-12 rounded-3xl text-center border border-dashed border-slate-200">
            <h5 className="font-black text-[#002040] uppercase tracking-tighter text-lg mb-2">Partisipasi Komunitas</h5>
            <p className="text-slate-400 text-[10px] font-bold mb-8 uppercase tracking-widest leading-relaxed">Masuk dengan akun Google untuk ikut berdiskusi</p>
            <button onClick={handleLogin} className="inline-flex items-center gap-4 bg-white border-2 border-slate-200 px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:border-[#002040] hover:text-[#002040] transition-all shadow-sm">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="" />
              Masuk dengan Google
            </button>
          </div>
        )}
      </div>

      {/* LIST */}
      <div className="space-y-2">
        {comments.length > 0 ? renderComments(null) : (
          <p className="text-center py-16 text-slate-200 text-[10px] font-black uppercase tracking-[0.4em] italic leading-relaxed">Belum ada tanggapan publik</p>
        )}
      </div>
    </div>
  );
}