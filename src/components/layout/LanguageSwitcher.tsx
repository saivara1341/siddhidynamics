import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Globe, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'fr', name: 'French', native: 'Français' },
    { code: 'es', name: 'Spanish', native: 'Español' },
    { code: 'de', name: 'German', native: 'Deutsch' },
    { code: 'ja', name: 'Japanese', native: '日本語' },
];

export function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const [open, setOpen] = useState(false);

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        setOpen(false);
    };

    const currentLanguage = languages.find(l => l.code === i18n.language) || languages[0];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-foreground group px-4 py-2 rounded-full glass-card border border-white/5 transition-all duration-300">
                    <Globe className="h-4 w-4 text-primary group-hover:rotate-12 transition-transform" />
                    <span className="font-medium">{currentLanguage.native}</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-background/95 backdrop-blur-2xl border-white/10 p-8 rounded-3xl overflow-hidden">
                <DialogHeader className="mb-6">
                    <DialogTitle className="text-2xl font-bold gradient-text text-center">Select Language</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    {languages.map((lang, index) => (
                        <motion.button
                            key={lang.code}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => changeLanguage(lang.code)}
                            className={`flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-300 relative group overflow-hidden ${i18n.language === lang.code
                                    ? 'bg-primary/10 border-primary shadow-lg shadow-primary/20'
                                    : 'bg-white/5 border-white/5 hover:border-primary/50 hover:bg-white/10'
                                }`}
                        >
                            <span className={`text-lg font-bold mb-1 ${i18n.language === lang.code ? 'text-primary' : 'text-foreground'}`}>
                                {lang.native}
                            </span>
                            <span className="text-xs text-muted-foreground uppercase tracking-widest">{lang.name}</span>

                            {i18n.language === lang.code && (
                                <motion.div
                                    layoutId="active-check"
                                    className="absolute top-3 right-3"
                                >
                                    <Check className="h-4 w-4 text-primary" />
                                </motion.div>
                            )}

                            {/* Decorative element */}
                            <div className={`absolute -bottom-4 -right-4 w-12 h-12 bg-primary/10 rounded-full blur-xl transition-opacity duration-300 ${i18n.language === lang.code ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                        </motion.button>
                    ))}
                </div>
                <div className="mt-8 pt-6 border-t border-white/5 text-center">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-bold">Engineering Global Intelligence • SIDDHI Dynamics</p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
