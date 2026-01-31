import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { toast } from "sonner";
import {
    ClipboardList,
    MessageSquare,
    Clock,
    CheckCircle2,
    Circle,
    Send,
    LogOut,
    ChevronRight,
    ChevronDown
} from "lucide-react";

const Portal = () => {
    const [user, setUser] = useState<any>(null);
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [waitlistEntries, setWaitlistEntries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'submissions' | 'waitlist'>('submissions');
    const [selectedSub, setSelectedSub] = useState<any | null>(null);
    const [newComment, setNewComment] = useState("");
    const [comments, setComments] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate("/auth");
            } else {
                setUser(user);
                fetchData(user);
            }
            setLoading(false);
        };
        checkUser();
    }, [navigate]);

    const fetchData = async (user: any) => {
        // Fetch submissions
        const { data: subData } = await supabase
            .from('contact_submissions')
            .select('*')
            .eq('email', user.email)
            .order('created_at', { ascending: false });

        if (subData) setSubmissions(subData);

        // Fetch waitlist entries
        const { data: waitData } = await supabase
            .from('project_waitlist')
            .select('*')
            .eq('email', user.email)
            .order('created_at', { ascending: false });

        if (waitData) setWaitlistEntries(waitData);
    };

    const fetchComments = async (submissionId: string) => {
        const { data } = await supabase
            .from('submission_comments')
            .select('*')
            .eq('submission_id', submissionId)
            .order('created_at', { ascending: true });

        if (data) setComments(data);
    };

    const handleAddComment = async () => {
        if (!newComment.trim() || !selectedSub) return;

        const { error } = await supabase
            .from('submission_comments')
            .insert({
                submission_id: selectedSub.id,
                user_id: user.id,
                content: newComment.trim()
            });

        if (error) {
            toast.error("Failed to add comment.");
        } else {
            setNewComment("");
            fetchComments(selectedSub.id);
            toast.success("Comment added!");
        }
    };

    const logout = async () => {
        await supabase.auth.signOut();
        navigate("/auth");
    };

    if (loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
            <Navbar />

            {/* Background decorations */}
            <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/3 rounded-full blur-[120px] pointer-events-none" />

            <main className="flex-grow container mx-auto px-6 pt-32 pb-20 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-bold gradient-text glow-text mb-2">Collab</h1>
                        <p className="text-muted-foreground">Welcome back, {user?.email}</p>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass-card border border-border/50 hover:bg-destructive/10 hover:border-destructive/30 transition-all text-sm font-medium"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Sidebar Tabs */}
                    <div className="lg:col-span-3 space-y-3">
                        <button
                            onClick={() => setActiveTab('submissions')}
                            className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all duration-300 ${activeTab === 'submissions'
                                ? 'bg-primary/10 border border-primary/30 text-primary shadow-lg shadow-primary/10'
                                : 'hover:bg-card/50 border border-transparent text-muted-foreground'
                                }`}
                        >
                            <ClipboardList className="w-5 h-5" />
                            <span className="font-semibold">Submissions</span>
                            <span className="ml-auto bg-primary/20 text-xs px-2 py-1 rounded-md">{submissions.length}</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('waitlist')}
                            className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all duration-300 ${activeTab === 'waitlist'
                                ? 'bg-primary/10 border border-primary/30 text-primary shadow-lg shadow-primary/10'
                                : 'hover:bg-card/50 border border-transparent text-muted-foreground'
                                }`}
                        >
                            <Clock className="w-5 h-5" />
                            <span className="font-semibold">Waitlist</span>
                            <span className="ml-auto bg-primary/20 text-xs px-2 py-1 rounded-md">{waitlistEntries.length}</span>
                        </button>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-9">
                        {activeTab === 'submissions' ? (
                            <div className="space-y-4">
                                {submissions.length === 0 ? (
                                    <div className="glass-card p-12 text-center">
                                        <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                                        <p className="text-muted-foreground">No submissions found. Shared your first problem with us!</p>
                                    </div>
                                ) : (
                                    submissions.map((sub) => (
                                        <div key={sub.id} className="glass-card overflow-hidden group">
                                            <div
                                                onClick={() => {
                                                    setSelectedSub(selectedSub?.id === sub.id ? null : sub);
                                                    if (selectedSub?.id !== sub.id) fetchComments(sub.id);
                                                }}
                                                className="p-6 cursor-pointer flex items-center justify-between hover:bg-primary/5 transition-colors"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${sub.status === 'Resolved' ? 'bg-green-500/20 text-green-500' : 'bg-primary/20 text-primary'
                                                        }`}>
                                                        <MessageSquare className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-foreground capitalize">{sub.inquiry_type} Solution Tracking</h3>
                                                        <p className="text-sm text-muted-foreground">{new Date(sub.created_at).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className={`text-xs px-3 py-1 rounded-full border ${sub.status === 'Resolved'
                                                        ? 'border-green-500/30 bg-green-500/10 text-green-500'
                                                        : 'border-primary/30 bg-primary/10 text-primary'
                                                        }`}>
                                                        {sub.status || 'Analyzing'}
                                                    </span>
                                                    {selectedSub?.id === sub.id ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                                                </div>
                                            </div>

                                            <AnimatePresence>
                                                {selectedSub?.id === sub.id && (
                                                    <motion.div
                                                        initial={{ height: 0 }}
                                                        animate={{ height: "auto" }}
                                                        exit={{ height: 0 }}
                                                        className="overflow-hidden border-t border-border/30 bg-black/20"
                                                    >
                                                        <div className="p-8 space-y-8">
                                                            {/* Details */}
                                                            <div className="grid md:grid-cols-2 gap-8">
                                                                <div className="space-y-4">
                                                                    <h4 className="text-sm font-bold uppercase tracking-widest text-primary/70">Original Message</h4>
                                                                    <p className="text-sm text-foreground/90 leading-relaxed bg-white/5 p-4 rounded-xl italic">
                                                                        "{sub.message}"
                                                                    </p>
                                                                </div>
                                                                <div className="space-y-4">
                                                                    <h4 className="text-sm font-bold uppercase tracking-widest text-accent/70">Our Reply</h4>
                                                                    <p className="text-sm text-foreground/90 leading-relaxed bg-accent/5 p-4 rounded-xl">
                                                                        {sub.response || "Our AI agents are currently analyzing your problem statement. We will provide a technical roadmap shortly."}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {/* Milestones */}
                                                            <div className="space-y-6">
                                                                <h4 className="text-sm font-bold uppercase tracking-widest text-primary/70">Development Roadmap</h4>
                                                                <div className="space-y-4">
                                                                    {(sub.milestones || [
                                                                        { title: "Initial Analysis", completed: true },
                                                                        { title: "Technical Feasibility Study", completed: sub.status !== 'Analyzing' },
                                                                        { title: "Prototype Development", completed: sub.status === 'In Progress' || sub.status === 'Resolved' },
                                                                        { title: "Solution Launch", completed: sub.status === 'Resolved' }
                                                                    ]).map((milestone: any, i: number) => (
                                                                        <div key={i} className="flex items-center gap-4">
                                                                            {milestone.completed ? (
                                                                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                                            ) : (
                                                                                <Circle className="w-5 h-5 text-muted-foreground" />
                                                                            )}
                                                                            <span className={milestone.completed ? 'text-foreground font-medium' : 'text-muted-foreground italic'}>
                                                                                {milestone.title}
                                                                            </span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            {/* Comment System */}
                                                            <div className="space-y-6 pt-6 border-t border-border/30">
                                                                <h4 className="text-sm font-bold uppercase tracking-widest text-primary/70 flex items-center gap-2">
                                                                    <MessageSquare className="w-4 h-4" /> Discussion
                                                                </h4>

                                                                <div className="space-y-4 max-h-60 overflow-y-auto pr-4 scrollbar-thin">
                                                                    {comments.length === 0 ? (
                                                                        <p className="text-xs text-muted-foreground italic text-center">No discussion yet. Start the conversation!</p>
                                                                    ) : (
                                                                        comments.map((c) => (
                                                                            <div key={c.id} className={`flex flex-col ${c.user_id === user.id ? 'items-end' : 'items-start'}`}>
                                                                                <div className={`max-w-[80%] p-3 rounded-xl text-sm ${c.user_id === user.id
                                                                                    ? 'bg-primary/20 text-foreground border border-primary/20'
                                                                                    : 'bg-card border border-border/50 text-foreground'
                                                                                    }`}>
                                                                                    {c.content}
                                                                                </div>
                                                                                <span className="text-[10px] text-muted-foreground mt-1 px-1">
                                                                                    {new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                                </span>
                                                                            </div>
                                                                        ))
                                                                    )}
                                                                </div>

                                                                <div className="relative flex gap-2">
                                                                    <input
                                                                        value={newComment}
                                                                        onChange={(e) => setNewComment(e.target.value)}
                                                                        placeholder="Add feedback or ask a question..."
                                                                        className="input-premium py-3 pl-4 pr-12 text-sm"
                                                                        onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                                                                    />
                                                                    <button
                                                                        onClick={handleAddComment}
                                                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:text-accent transition-colors"
                                                                    >
                                                                        <Send className="w-5 h-5" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ))
                                )}
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 gap-6">
                                {waitlistEntries.length === 0 ? (
                                    <div className="col-span-full glass-card p-12 text-center">
                                        <Clock className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                                        <p className="text-muted-foreground">You haven't joined any waitlists yet.</p>
                                    </div>
                                ) : (
                                    waitlistEntries.map((entry) => (
                                        <div key={entry.id} className="glass-card p-6 flex flex-col gap-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-xl font-bold font-display text-primary">{entry.project_name}</h3>
                                                    <p className="text-sm text-muted-foreground">Joined: {new Date(entry.created_at).toLocaleDateString()}</p>
                                                </div>
                                                <div className="bg-primary/10 px-3 py-1 rounded-full text-[10px] font-bold text-primary uppercase border border-primary/20">
                                                    Active
                                                </div>
                                            </div>

                                            {entry.comment && (
                                                <div className="bg-white/5 p-4 rounded-xl border border-border/30">
                                                    <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">Your Feedback</span>
                                                    <p className="text-sm italic">"{entry.comment}"</p>
                                                </div>
                                            )}

                                            <div className="mt-auto pt-4 border-t border-border/30 flex items-center gap-2 text-xs text-muted-foreground">
                                                <CheckCircle2 className="w-4 h-4 text-accent" />
                                                We will notify you at launch
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Footer Branding */}
            <footer className="py-8 border-t border-border/10 text-center">
                <p className="text-xs text-muted-foreground/50 uppercase tracking-[0.3em]">
                    Engineering Agentic Intelligence • Siddhi Dynamics Collab
                </p>
            </footer>
        </div>
    );
};

export default Portal;
