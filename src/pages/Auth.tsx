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

    // Inject password visibility toggle
    const interval = setInterval(() => {
      const passwordInputs = document.querySelectorAll('input[type="password"]');
      passwordInputs.forEach(input => {
        if (input.parentElement && !input.parentElement.querySelector('.password-toggle')) {
          input.parentElement.style.position = 'relative';
          const toggle = document.createElement('button');
          toggle.type = 'button';
          toggle.className = 'password-toggle absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors';
          toggle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="eye-icon"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
          toggle.onclick = (e) => {
            e.preventDefault();
            const isPassword = input.getAttribute('type') === 'password';
            input.setAttribute('type', isPassword ? 'text' : 'password');
            toggle.innerHTML = isPassword
              ? `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="eye-off-icon"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" y1="2" x2="22" y2="22"></line></svg>`
              : `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="eye-icon"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
          };
          input.parentElement.appendChild(toggle);
        }
      });
    }, 500);

    return () => {
      subscription.unsubscribe();
      clearInterval(interval);
    };
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
