import { motion, useInView, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { GraduationCap, Heart, Home, Landmark, LucideIcon, Sparkles, ExternalLink, Bell } from 'lucide-react';
import archplanLogo from '@/assets/archplan-logo.jpeg';
import { WaitlistModal } from '@/components/WaitlistModal';

const cardVariants = {
  hidden: { opacity: 0, y: 80, rotateX: -15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.8,
      delay: i * 0.12,
      ease: [0.25, 0.1, 0.25, 1]
    }
  })
};

const featureVariants = {
  hidden: { opacity: 0, scale: 0.8, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      duration: 0.4,
      delay: 0.4 + i * 0.05,
      ease: "easeOut"
    }
  })
};

export const projects: Array<{
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon?: LucideIcon;
  image?: string;
  features: string[];
  gradient: string;
  accentColor: string;
  url?: string;
  status: 'Researching' | 'Prototyping' | 'Building' | 'Scaling';
  progress: number;
}> = [
    {
      id: 'archplan',
      name: '🏗️ ArchPlan',
      tagline: 'AI-Native Plan Generation, Cost Estimation & Cinematic 3D Renders',
      description: 'A comprehensive AI platform for Vastu-compliant architectural planning, instant engineering cost estimation, and cinematic 16K photorealistic rendering. Digitizing the entire building journey for homeowners and construction professionals.',
      image: archplanLogo,
      features: ['AI 2D/3D Plans', 'Vastu Compliance', 'BOQ Generation', 'Cost Estimation', 'Material Marketplace', 'Project Management'],
      gradient: 'from-primary to-orange-400',
      accentColor: 'primary',
      url: 'https://archplan.lovable.app',
      status: 'Scaling',
      progress: 92,
    },
    {
      id: 'nexus',
      name: 'Nexus Careers',
      tagline: 'AI-Driven University Placement and Employability Platform',
      description: 'An AI-native campus operating system and recruitment ERP designed to bridge the gap between academia and industry. Providing students with AI-powered mock interviews, skill-gap analysis, and personalized career roadmaps.',
      icon: GraduationCap,
      features: ['AI Mock Interviews', 'Skill-Gap Detection', 'Institutional ERP', 'Recruiter Portal', 'Gamified Learning', 'Career Analytics'],
      gradient: 'from-accent to-lime-400',
      accentColor: 'accent',
      status: 'Prototyping',
      progress: 65,
    },
    {
      id: 'nilayam',
      name: '🏡 Nilaya',
      tagline: 'Property and Tenant Management System',
      description: 'A modern SaaS platform designed to simplify and automate the entire rental and property management lifecycle.',
      icon: Home,
      features: ['AI Lease Generation', 'Financial Analytics', 'Tenant Portal', 'Maintenance AI', 'Marketing Automation', 'Community Hub'],
      gradient: 'from-accent to-emerald-400',
      accentColor: 'accent',
      status: 'Building',
      progress: 42,
    },
    {
      id: 'letusknow',
      name: '🏙️ LetUsKnow',
      tagline: 'Hyperlocal Civic Intelligence & Public Information Platform',
      description: 'A revolutionary citizen-centric digital governance platform designed to simplify how people access government services, understand procedures, and resolve public and personal issues.',
      icon: Landmark,
      features: ['GPS-Based Location', 'Political Representatives Info', 'Government Services Guide', 'Department Directory', 'Development Projects', 'Tourism Promotion'],
      gradient: 'from-cyan-500 to-blue-600',
      accentColor: 'accent',
      status: 'Researching',
      progress: 15,
    },
  ];

const ProjectCard = ({
  project,
  index,
  onWaitlistClick
}: {
  project: typeof projects[0];
  index: number;
  onWaitlistClick: (projectId: string, projectName: string, accentColor: 'primary' | 'accent') => void;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseYSpring = useSpring(y, { stiffness: 500, damping: 100 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['6deg', '-6deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-6deg', '6deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const handleCardClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (project.url) {
      window.open(project.url, '_blank', 'noopener,noreferrer');
    } else {
      onWaitlistClick(project.id, project.name, project.accentColor as 'primary' | 'accent');
    }
  };

  const isPrimary = project.accentColor === 'primary';
  const IconComponent = project.icon;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative group perspective-1000"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="glass-card p-8 h-full overflow-hidden relative"
      >
        {/* Electric border on hover */}
        <motion.div
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 rounded-2xl pointer-events-none electric-border"
          style={{
            padding: '2px',
            background: `linear-gradient(135deg, ${isPrimary ? 'hsl(25 85% 55%)' : 'hsl(85 70% 45%)'} 0%, ${isPrimary ? 'hsl(85 70% 45%)' : 'hsl(25 85% 55%)'} 100%)`,
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />

        {/* Glow effect */}
        <motion.div
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{
            background: isPrimary
              ? 'radial-gradient(circle at 50% 0%, hsl(25 85% 55% / 0.25) 0%, transparent 60%)'
              : 'radial-gradient(circle at 50% 0%, hsl(85 70% 45% / 0.25) 0%, transparent 60%)',
          }}
        />

        {/* Shimmer effect */}
        <motion.div
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 shimmer pointer-events-none rounded-2xl"
        />

        {/* Clickable Area for Expansion */}
        <div onClick={handleCardClick} className="cursor-pointer">
          {/* Header with Icon and Title */}
          <div className="flex items-start gap-5 mb-6">
            <motion.div
              animate={{
                scale: isHovered ? 1.15 : 1,
                rotate: isHovered ? 8 : 0,
                y: isHovered ? -5 : 0
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className={`w-16 h-16 flex items-center justify-center shrink-0 transition-all duration-500 relative z-20 ${!project.image && (isPrimary
                ? 'text-primary'
                : 'text-accent')
                }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />

              {project.image ? (
                <img
                  src={project.image}
                  alt={`${project.name} logo`}
                  className="w-full h-full object-contain filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)] transform-gpu"
                />
              ) : (
                IconComponent && <IconComponent className="w-10 h-10 filter drop-shadow-[0_5px_10px_rgba(0,0,0,0.4)]" strokeWidth={1.5} />
              )}
            </motion.div>

            <div className="flex-1 min-w-0">
              <h3 className="text-2xl font-bold mb-1 text-foreground font-display">
                {project.name}
              </h3>
              <div className="flex justify-between items-center mt-2">
                <p className={`text-sm font-semibold ${isPrimary ? 'text-primary' : 'text-accent'}`}>
                  {project.tagline}
                </p>
                <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${isPrimary ? 'border-primary/30 text-primary bg-primary/5' : 'border-accent/30 text-accent bg-accent/5'}`}>
                  {project.status}
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6 space-y-2">
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
              <span>Development Progress</span>
              <span className={isPrimary ? 'text-primary' : 'text-accent'}>{project.progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${project.progress}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                className={`h-full bg-gradient-to-r ${project.gradient}`}
              />
            </div>
          </div>

          {/* Description */}
          <motion.p
            className="text-muted-foreground text-sm leading-relaxed mb-6"
            animate={{
              height: isExpanded ? 'auto' : '4.5rem',
            }}
            style={{
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: isExpanded ? 'unset' : 3,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {project.description}
          </motion.p>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.features.map((feature, featureIndex) => (
            <motion.span
              key={feature}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + featureIndex * 0.05 }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 border ${isPrimary
                ? 'bg-primary/10 text-primary border-primary/20 group-hover:bg-primary/20 group-hover:border-primary/40'
                : 'bg-accent/10 text-accent border-accent/20 group-hover:bg-accent/20 group-hover:border-accent/40'
                }`}
            >
              {feature}
            </motion.span>
          ))}
        </div>

        {/* Action Buttons Container */}
        <div className="relative z-[30] space-y-4">
          {/* Read More Indicator */}
          <motion.button
            className={`text-xs font-medium ${isPrimary ? 'text-primary' : 'text-accent'} hover:underline block`}
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? 'Show Less ↑' : 'Read More ↓'}
          </motion.button>

          {/* Action Button */}
          <div className="pt-4 border-t border-border/30">
            <motion.button
              onClick={handleActionClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-3 px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 pointer-events-auto ${project.url
                ? 'bg-gradient-to-r from-primary to-orange-400 text-primary-foreground hover:shadow-[0_0_20px_hsl(25_85%_55%/0.4)]'
                : isPrimary
                  ? 'bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 hover:border-primary/50'
                  : 'bg-accent/10 text-accent border border-accent/30 hover:bg-accent/20 hover:border-accent/50'
                }`}
            >
              {project.url ? (
                <>
                  <ExternalLink className="w-4 h-4" />
                  Access Platform
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4" />
                  Join Waitlist
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div >
  );
};

export const ProjectsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [waitlistModal, setWaitlistModal] = useState<{
    isOpen: boolean;
    projectId: string;
    projectName: string;
    accentColor: 'primary' | 'accent';
  }>({
    isOpen: false,
    projectId: '',
    projectName: '',
    accentColor: 'primary',
  });

  const handleWaitlistClick = (projectId: string, projectName: string, accentColor: 'primary' | 'accent') => {
    setWaitlistModal({
      isOpen: true,
      projectId,
      projectName,
      accentColor,
    });
  };

  const handleCloseModal = () => {
    setWaitlistModal(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <>
      <section id="projects" className="py-32 relative overflow-hidden">
        {/* Enhanced animated background */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]"
            animate={{
              x: [0, 30, 0],
              y: [0, -20, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px]"
            animate={{
              x: [0, -30, 0],
              y: [0, 20, 0],
              scale: [1, 1.15, 1]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
          {/* Floating particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-primary/30"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 0.7, 0.3],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3
              }}
            />
          ))}
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 grid-pattern opacity-20" />

        <div className="container mx-auto px-6 relative z-10" ref={ref}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-center mb-20"
          >
            <motion.span
              className="inline-block text-accent font-medium text-sm tracking-[0.3em] uppercase mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Our Products
            </motion.span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 font-display">
              Building the{' '}
              <span className="gradient-text-reverse glow-text-accent">Future</span>
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto">
              Explore our portfolio of production-ready AI platforms transforming construction,
              education, property management, and personal automation.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 gap-8 lg:gap-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                custom={index}
                variants={cardVariants}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
                className="relative"
              >
                {/* Spotlight effect on hover */}
                <AnimatePresence>
                  {hoveredIndex === index && (
                    <motion.div
                      className="absolute -inset-4 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-3xl blur-2xl -z-10"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </AnimatePresence>
                <ProjectCard
                  project={project}
                  index={index}
                  onWaitlistClick={handleWaitlistClick}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Waitlist Modal */}
      <WaitlistModal
        isOpen={waitlistModal.isOpen}
        onClose={handleCloseModal}
        projectId={waitlistModal.projectId}
        projectName={waitlistModal.projectName}
        accentColor={waitlistModal.accentColor}
      />
    </>
  );
};
