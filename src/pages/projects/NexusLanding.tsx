
import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { FooterSection } from '@/components/sections/FooterSection';
import { WaitlistModal } from '@/components/WaitlistModal';
import {
    ArrowLeft,
    CheckCircle2,
    Target,
    Users,
    Building2,
    GraduationCap,
    BrainCircuit,
    ShieldCheck,
    LayoutDashboard,
    Sparkles,
    ChevronRight
} from 'lucide-react';

const NexusLanding = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { scrollYProgress } = useScroll();
    const [activeTab, setActiveTab] = useState<'student' | 'admin' | 'company'>('student');
    const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

    const tabs = [
        { id: 'student', label: t('nexus_landing.segments.student.title'), icon: GraduationCap, color: 'text-accent', border: 'border-accent' },
        { id: 'admin', label: t('nexus_landing.segments.admin.title'), icon: ShieldCheck, color: 'text-primary', border: 'border-primary' },
        { id: 'company', label: t('nexus_landing.segments.company.title'), icon: Building2, color: 'text-orange-400', border: 'border-orange-400' },
    ] as const;

    const currentSegment = t(`nexus_landing.segments.${activeTab}`, { returnObjects: true }) as any;
    const currentFeatures = t(`nexus_landing.features.${activeTab}`, { returnObjects: true }) as any;

    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-accent/30">
            <Navbar />

            {/* Scroll Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary origin-left z-50"
                style={{ scaleX }}
            />

            <main className="pt-20">
                {/* Hero Section */}
                <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
                    {/* Background Effects */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] animate-pulse-glow" />
                        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
                        <div className="absolute inset-0 grid-pattern opacity-20" />
                    </div>

                    <div className="container mx-auto px-6 relative z-10 text-center">
                        <motion.button
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            onClick={() => navigate('/')}
                            className="absolute top-0 left-6 md:left-12 flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            {t('nexus_landing.hero.back')}
                        </motion.button>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="max-w-4xl mx-auto mt-12"
                        >
                            <span className="inline-block py-1 px-3 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold tracking-widest uppercase mb-6">
                                {t('nexus_landing.hero.subtitle')}
                            </span>
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 font-display tracking-tight">
                                {t('nexus_landing.hero.title')}
                            </h1>
                            <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed max-w-2xl mx-auto">
                                {t('nexus_landing.hero.tagline')}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsWaitlistOpen(true)}
                                    className="px-8 py-4 rounded-xl bg-gradient-to-r from-accent to-lime-500 text-black font-bold text-lg shadow-[0_0_30px_rgba(132,204,22,0.3)] hover:shadow-[0_0_50px_rgba(132,204,22,0.5)] transition-all"
                                >
                                    {t('nexus_landing.hero.cta')}
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="py-24 relative">
                    <div className="container mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="glass-card p-12 max-w-5xl mx-auto text-center border-primary/20"
                        >
                            <div className="w-16 h-16 mx-auto bg-primary/20 rounded-2xl flex items-center justify-center mb-6">
                                <Target className="w-8 h-8 text-primary" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-display">
                                {t('nexus_landing.hero.mission.title')}
                            </h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                {t('nexus_landing.hero.mission.description')}
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* User Segments */}
                <section className="py-24 bg-black/20">
                    <div className="container mx-auto px-6 max-w-6xl">
                        {/* Tabs */}
                        <div className="flex flex-wrap justify-center gap-4 mb-16">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-6 py-3 rounded-full border transition-all duration-300 flex items-center gap-2 ${activeTab === tab.id
                                            ? `bg-${tab.color.split('-')[1]}/10 ${tab.color} ${tab.border}`
                                            : 'border-white/10 text-muted-foreground hover:border-white/20'
                                        }`}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    <span className="font-bold">{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="grid md:grid-cols-2 gap-12 items-center"
                            >
                                {/* Problem */}
                                <div className="glass-card p-8 border-red-500/20 bg-red-950/5">
                                    <h3 className="text-xl font-bold mb-4 text-red-400 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-red-500" />
                                        The Problem
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {currentSegment.problem}
                                    </p>
                                </div>

                                {/* Solution */}
                                <div className={`glass-card p-8 bg-green-950/5 ${activeTab === 'student' ? 'border-accent/20' :
                                        activeTab === 'admin' ? 'border-primary/20' :
                                            'border-orange-400/20'
                                    }`}>
                                    <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${activeTab === 'student' ? 'text-accent' :
                                            activeTab === 'admin' ? 'text-primary' :
                                                'text-orange-400'
                                        }`}>
                                        <Sparkles className="w-5 h-5" />
                                        The Nexus Solution
                                    </h3>
                                    <ul className="space-y-4">
                                        {Object.entries(currentSegment.solution).map(([key, value]: any) => (
                                            <li key={key} className="flex gap-3">
                                                <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${activeTab === 'student' ? 'text-accent' :
                                                        activeTab === 'admin' ? 'text-primary' :
                                                            'text-orange-400'
                                                    }`} />
                                                <span className="text-sm text-foreground/90">{value}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </section>

                {/* Feature Grid */}
                <section className="py-24">
                    <div className="container mx-auto px-6 max-w-6xl">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6 font-display">
                                {currentFeatures.title}
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {currentFeatures.items.map((item: string, i: number) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.05 }}
                                    className="glass-card p-6 border-white/5 hover:border-accent/20 transition-colors group"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-accent/10 transition-colors">
                                            <LayoutDashboard className="w-4 h-4 text-muted-foreground group-hover:text-accent" />
                                        </div>
                                        <p className="text-sm font-medium text-foreground/80 group-hover:text-foreground">
                                            {item}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Platform Wide Features */}
                <section className="py-24 border-t border-white/5">
                    <div className="container mx-auto px-6 max-w-4xl">
                        <div className="text-center mb-12">
                            <span className="text-primary text-sm font-bold tracking-widest uppercase mb-4 block">Core Architecture</span>
                            <h2 className="text-3xl font-bold font-display">{t('nexus_landing.features.platform.title')}</h2>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {(t('nexus_landing.features.platform.items', { returnObjects: true }) as string[]).map((item, i) => (
                                <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                                    <BrainCircuit className="w-5 h-5 text-primary" />
                                    <span className="text-sm font-medium">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-32 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-accent/5 to-transparent pointer-events-none" />
                    <div className="container mx-auto px-6 text-center relative z-10">
                        <h2 className="text-4xl md:text-6xl font-bold mb-8 font-display">
                            Ready to modernize your campus?
                        </h2>
                        <p className="text-xl text-muted-foreground mb-12">
                            Join the waitlist to get early access to the Institutional Command Engine.
                        </p>
                        <button
                            onClick={() => setIsWaitlistOpen(true)}
                            className="px-10 py-5 rounded-xl bg-accent text-black font-bold text-xl shadow-lg hover:shadow-accent/50 transition-all hover:scale-105"
                        >
                            Join Waitlist
                        </button>
                    </div>
                </section>
            </main>

            <FooterSection />

            <WaitlistModal
                isOpen={isWaitlistOpen}
                onClose={() => setIsWaitlistOpen(false)}
                projectId="nexus"
                projectName="Nexus Careers"
                accentColor="accent"
            />
        </div>
    );
};

export default NexusLanding;
