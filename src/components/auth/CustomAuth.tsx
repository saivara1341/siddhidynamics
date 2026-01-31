import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const CustomAuth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                navigate("/portal");
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/#/portal`,
                    },
                });
                if (error) throw error;
                toast.success("Check your email for the confirmation link!");
            }
        } catch (error: any) {
            toast.error(error.message || "Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full space-y-6">
            <div className="flex gap-4 mb-8 p-1 bg-white/5 rounded-xl border border-white/10">
                <button
                    onClick={() => setIsLogin(true)}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${isLogin ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"
                        }`}
                >
                    Login
                </button>
                <button
                    onClick={() => setIsLogin(false)}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${!isLogin ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"
                        }`}
                >
                    Sign Up
                </button>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1.5 text-foreground/80">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                            className="input-premium pl-11"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1.5 text-foreground/80">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="input-premium pl-11 pr-12"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="btn-primary w-full py-3.5 mt-2 flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        isLogin ? "Sign In" : "Create Account"
                    )}
                </motion.button>
            </form>
        </div>
    );
};
