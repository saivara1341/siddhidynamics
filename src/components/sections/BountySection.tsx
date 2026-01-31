import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Target, Users, ArrowUpRight, ShieldCheck, Globe, Zap, Bell } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

import { projects } from './ProjectsSection';

interface BountyProposal {
    id: string;
    inquiry_type: string;
    message: string;
    status: string;
    created_at: string;
    progress: number;
}

export const BountySection = () => {
    const [bounties, setBounties] = useState<BountyProposal[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Map our actual projects to the bounty format
        const projectBounties: BountyProposal[] = projects.map(p => ({
            id: p.id,
            inquiry_type: p.id === 'archplan' ? 'Construction' :
                p.id === 'nexus' ? 'Education' :
                    p.id === 'nilayam' ? 'Real Estate' :
                        p.id === 'wish0' ? 'Automation' : 'Governance',
            message: p.tagline,
            status: p.status,
            progress: p.progress,
            created_at: new Date().toISOString()
        }));

        setBounties(projectBounties);
        setLoading(false);
    }, []);

    return (
        <section id="bounties" className="py-32 relative overflow-hidden bg-white/[0.02]">
            <div className="absolute inset-0 grid-pattern opacity-10" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6"
                    >
                        <Target className="w-3 h-3" />
                        Problem Bounty Board
                    </motion.div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 font-display">
                        Challenges We Are <span className="gradient-text glow-text">Solving</span>
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        A public list of real-world problems submitted by our community.
                        Follow the progress, contribute ideas, or join the waitlist for the solutions.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {bounties.map((bounty, index) => (
                        <motion.div
                            key={bounty.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-card p-6 border border-white/10 hover:border-primary/30 transition-all group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-primary/20 text-primary p-2 rounded-lg">
                                    <Zap className="w-4 h-4" />
                                </div>
                                <div className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-border bg-black/40 text-muted-foreground">
                                    {bounty.inquiry_type}
                                </div>
                            </div>

                            <h3 className="text-lg font-bold mb-3 leading-tight group-hover:text-primary transition-colors">
                                {bounty.message}
                            </h3>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
                                    <span>Progress</span>
                                    <span className="text-primary">{bounty.progress}%</span>
                                </div>
                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${bounty.progress}%` }}
                                        className="h-full bg-primary shadow-[0_0_10px_hsl(25_85%_55%/0.5)]"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Users className="w-3 h-3" />
                                    <span>12 Followers</span>
                                </div>
                                <button
                                    onClick={() => toast.success("You're now following this challenge!")}
                                    className="p-2 rounded-lg bg-white/5 hover:bg-primary/20 hover:text-primary transition-all"
                                    title="Follow Challenge"
                                >
                                    <Bell className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}

                    {/* Call to action card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="glass-card p-6 border border-dashed border-white/20 flex flex-col items-center justify-center text-center group hover:border-primary/50 transition-all cursor-pointer"
                        onClick={() => document.getElementById('submit')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all">
                            <ArrowUpRight className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="font-bold mb-2">Have a Challenge?</h3>
                        <p className="text-xs text-muted-foreground mb-4">
                            Submit your problem and get it listed on the bounty board to accelerate its solution.
                        </p>
                        <span className="text-xs font-bold text-primary uppercase tracking-widest">Submit Now →</span>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
