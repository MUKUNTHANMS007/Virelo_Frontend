import { motion } from 'framer-motion';
import { Image as ImageIcon, Sparkles, Layers, Minimize, Scaling, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { TransitionTester } from '../components/TransitionTester';

export default function Products({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { isAuthenticated } = useAuthStore();
  const features = [
    {
      title: "Temporal Transition",
      description: "Generate seamless AI video transitions between any two frames. Upload start and end images — the engine fills every moment between them.",
      features: ["Up to 4K output", "6-second generation", "Style transfer controls"],
      icon: <Sparkles className="w-6 h-6 text-indigo-500" />
    },
    {
      title: "Motion Extend",
      description: "Take a single frame and extend its motion forward or backward in time. Perfect for creating slow-motion effects from static shots.",
      features: ["Single frame input", "Up to 10s extension", "Motion direction control"],
      icon: <Layers className="w-6 h-6 text-cyan-500" />
    },
    {
      title: "Scene Morph",
      description: "Blend two entirely different scenes together with intelligent object tracking and background replacement across the transition.",
      features: ["Multi-scene blending", "Object tracking", "Background synthesis"],
      icon: <Minimize className="w-6 h-6 text-purple-500" />
    },
    {
      title: "Temporal Upscale",
      description: "Upscale existing video transitions to 4K while preserving temporal coherence and eliminating interpolation artifacts.",
      features: ["4K upscaling", "Artifact removal", "Batch processing"],
      icon: <Scaling className="w-6 h-6 text-emerald-500" />
    }
  ];

  return (
    <div className="w-full relative overflow-hidden bg-white text-neutral-900">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Hero Section: The Workspace */}
      <section className="relative pt-20 pb-32 px-6 max-w-5xl mx-auto text-center" id="workspace">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-600 text-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Python AI Worker is Online (FastAPI)
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Test the <span className="gradient-text">Virelo Engine</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto mb-12">
            The full-stack AniDoc integration is complete. Pose in 3D, capture the structural sketch, and let the Python AI engine render the final animation.
          </p>
          
          {isAuthenticated ? (
            <button 
              onClick={() => onNavigate('editor')}
              className="bg-indigo-600 text-white px-8 py-3 rounded-full font-medium hover:bg-indigo-700 transition-colors mb-16 shadow-lg flex items-center gap-2 mx-auto ring-4 ring-indigo-600/20"
            >
              Test AI Integration in Editor <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button 
              onClick={() => onNavigate('signin')}
              className="bg-neutral-900 text-white px-8 py-3 rounded-full font-medium hover:bg-neutral-800 transition-colors mb-16 shadow-md"
            >
              Sign in to Test AI Pipeline
            </button>
          )}

          {/* Workflow Pipeline Visualization */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center max-w-4xl mx-auto">
            {/* Step 1: 3D Scene */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="glass-card gradient-border-glow p-6 flex flex-col items-center justify-center min-h-[250px] bg-white shadow-sm"
            >
              <div className="w-16 h-16 rounded-full bg-neutral-50 border border-neutral-200 flex items-center justify-center mb-6 text-neutral-400">
                <Layers className="w-8 h-8" />
              </div>
              <p className="text-neutral-900 font-medium mb-2">1. Pose in 3D Workspace</p>
              <p className="text-sm text-neutral-500">Arrange shapes and use Onion Skinning.</p>
            </motion.div>

            {/* Step 2: AI Processing */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="glass-card gradient-border-glow p-6 flex flex-col items-center justify-center min-h-[250px] relative overflow-hidden bg-white shadow-sm border-indigo-100"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 z-0" />
              <div className="z-10 w-16 h-16 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-indigo-500 animate-pulse" />
              </div>
              <p className="text-neutral-900 font-medium mb-2 z-10">2. Request Generation</p>
              <p className="text-sm text-neutral-500 z-10">FastAPI Worker interpolates via AniDoc.</p>
            </motion.div>

            {/* Step 3: Result */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="glass-card gradient-border-glow p-6 flex flex-col items-center justify-center min-h-[250px] bg-white shadow-sm"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-6 text-emerald-500">
                <ImageIcon className="w-8 h-8" />
              </div>
              <p className="text-neutral-900 font-medium mb-2">3. Animation Returned</p>
              <p className="text-sm text-neutral-500">5-second polling fetches the video.</p>
            </motion.div>
          </div>
          
          <div className="mt-8 flex items-center justify-center text-sm text-neutral-400 gap-2">
             <span className="w-4 h-px bg-neutral-200" />
             → Powered by Node.js + FastAPI + React
             <span className="w-4 h-px bg-neutral-200" />
          </div>
          <TransitionTester onNavigate={onNavigate} />
        </motion.div>
      </section>

      {/* Toolkit Section */}
      <section className="py-24 px-6 relative border-t border-neutral-100 bg-neutral-50">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-16 text-center">
            The full <span className="gradient-text">toolkit</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass-card p-8 group relative overflow-hidden bg-white"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-black/5 rounded-full blur-3xl group-hover:bg-black/10 transition-colors" />
                <div className="w-12 h-12 rounded-xl bg-white border border-neutral-200 flex items-center justify-center mb-6 group-hover:border-neutral-300 transition-colors shadow-sm">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-neutral-600 leading-relaxed mb-8">
                  {feature.description}
                </p>
                
                <ul className="flex flex-col gap-3 mb-8">
                  {feature.features.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-neutral-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 group-hover:bg-indigo-500 transition-colors" />
                      {item}
                    </li>
                  ))}
                </ul>

                <button className="text-sm font-medium text-neutral-900 flex items-center gap-2 group/btn hover:text-indigo-600 transition-colors">
                  Try it out 
                  <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}