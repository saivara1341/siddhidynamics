import { useState, useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";

const AuthPage = () => {
    const [session, setSession] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) navigate("/portal");
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) navigate("/portal");
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            <Navbar />

            {/* Background patterns */}
            <div className="absolute inset-0 grid-pattern opacity-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px]" />

            <div className="container relative z-10 mx-auto px-6 pt-32 pb-20 flex justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md glass-card p-8 electric-border"
                >
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold gradient-text glow-text mb-2">Join Siddhi Dynamics</h1>
                        <p className="text-muted-foreground">Log in to track your submissions and collaborate with us.</p>
                    </div>

                    <Auth
                        supabaseClient={supabase}
                        appearance={{
                            theme: ThemeSupa,
                            variables: {
                                default: {
                                    colors: {
                                        brand: 'hsl(25 85% 55%)',
                                        brandAccent: 'hsl(25 85% 65%)',
                                        inputBackground: 'hsl(20 15% 6%)',
                                        inputText: 'white',
                                        inputPlaceholder: 'hsl(30 10% 55%)',
                                        inputBorder: 'hsl(25 50% 30% / 0.3)',
                                        inputBorderFocus: 'hsl(25 85% 55% / 0.6)',
                                        dividerBackground: 'hsl(25 30% 20%)',
                                    },
                                },
                            },
                            className: {
                                container: 'auth-container',
                                button: 'btn-primary-auth',
                                input: 'input-premium-auth',
                            }
                        }}
                        providers={[]}
                        theme="dark"
                    />
                </motion.div>
            </div>

            <style>{`
        .auth-container {
          font-family: 'Inter', sans-serif;
        }
        .btn-primary-auth {
          background: linear-gradient(135deg, hsl(25 85% 55%) 0%, hsl(30 90% 50%) 100%) !important;
          border-radius: 0.75rem !important;
          font-weight: 600 !important;
          color: white !important;
          padding: 0.75rem !important;
          transition: all 0.3s ease !important;
        }
        .btn-primary-auth:hover {
          transform: scale(1.02) !important;
          box-shadow: 0 0 20px hsl(25 85% 55% / 0.4) !important;
        }
        .input-premium-auth {
          border-radius: 0.75rem !important;
          background: hsl(20 15% 6%) !important;
          border: 1px solid hsl(25 50% 30% / 0.3) !important;
          color: white !important;
        }
        .input-premium-auth:focus {
          border-color: hsl(25 85% 55% / 0.6) !important;
          box-shadow: 0 0 15px hsl(25 85% 55% / 0.1) !important;
        }
      `}</style>
        </div>
    );
};

export default AuthPage;
