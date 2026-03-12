import { motion } from 'framer-motion';
import { UploadCloud, Image as ImageIcon, Sparkles, Layers, Minimize, Scaling } from 'lucide-react';

export default function Products() {
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
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            Workspace Active
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            The <span className="gradient-text">Workspace</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto mb-12">
            Upload your start and end frames. Our temporal engine handles everything between.
          </p>
          
          <button className="bg-neutral-900 text-white px-8 py-3 rounded-full font-medium hover:bg-neutral-800 transition-colors mb-16 shadow-md">
            Sign in for full access
          </button>

          {/* Upload Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Start Frame */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="glass-card gradient-border-glow p-8 flex flex-col items-center justify-center min-h-[300px] cursor-pointer group bg-white shadow-sm"
            >
              <div className="w-16 h-16 rounded-full bg-neutral-50 border border-neutral-200 flex items-center justify-center mb-6 group-hover:bg-indigo-50 group-hover:border-indigo-200 transition-all">
                <UploadCloud className="w-8 h-8 text-neutral-400 group-hover:text-indigo-500" />
              </div>
              <p className="text-neutral-900 font-medium mb-2">Click or drag & drop</p>
              <p className="text-sm text-neutral-500">PNG, JPG, WEBP up to 20MB</p>
              <div className="mt-8 text-xs font-semibold uppercase tracking-wider text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full">Start Frame</div>
            </motion.div>

            {/* End Frame */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="glass-card gradient-border-glow p-8 flex flex-col items-center justify-center min-h-[300px] cursor-pointer group relative overflow-hidden bg-white shadow-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 z-0" />
              <div className="z-10 w-16 h-16 rounded-full bg-neutral-50 border border-neutral-200 flex items-center justify-center mb-6 group-hover:bg-purple-50 group-hover:border-purple-200 transition-all">
                <ImageIcon className="w-8 h-8 text-neutral-400 group-hover:text-purple-500" />
              </div>
              <p className="text-neutral-900 font-medium mb-2 z-10">Click or drag & drop</p>
              <p className="text-sm text-neutral-500 z-10">PNG, JPG, WEBP up to 20MB</p>
              <div className="mt-8 text-xs font-semibold uppercase tracking-wider text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full z-10">End Frame</div>
            </motion.div>
          </div>
          
          <div className="mt-8 flex items-center justify-center text-sm text-neutral-400 gap-2">
             <span className="w-4 h-px bg-neutral-200" />
             → Upload both frames to enable generation
             <span className="w-4 h-px bg-neutral-200" />
          </div>
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