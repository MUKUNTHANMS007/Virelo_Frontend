import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronRight, 
  Copy, 
  Terminal, 
  Check, 
  BookOpen, 
  Cpu, 
  Zap, 
  Settings,
  Shield,
  Code as CodeIcon,
  Search,
  Menu,
  X
} from 'lucide-react';

const CodeBlock = ({ code, language = 'bash' }: { code: string; language?: string }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-6">
      <div className="absolute -inset-y-px -inset-x-px bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 shadow-2xl">
        <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800 bg-neutral-900/50">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
            <div className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
            <div className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{language}</span>
            <button 
              onClick={copyToClipboard}
              className="p-1 hover:bg-neutral-800 rounded-md transition-colors text-neutral-400 hover:text-white"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            </button>
          </div>
        </div>
        <div className="p-5 font-mono text-sm leading-relaxed overflow-x-auto">
          <pre className="text-neutral-300">
            {code.split('\n').map((line, i) => (
              <div key={i} className="flex gap-4">
                <span className="text-neutral-600 select-none w-4 text-right">{i + 1}</span>
                <span>
                  {line.startsWith('npm') || line.startsWith('npx') ? (
                    <span className="text-indigo-400">{line}</span>
                  ) : line.startsWith('//') ? (
                    <span className="text-neutral-500">{line}</span>
                  ) : (
                    <span>{line}</span>
                  )}
                </span>
              </div>
            ))}
          </pre>
        </div>
      </div>
    </div>
  );
};

const Step = ({ number, title, children }: { number: string; title: string; children: React.ReactNode }) => (
  <div className="relative pl-12 pb-12 last:pb-0">
    <div className="absolute left-4 top-0 bottom-0 w-px bg-neutral-200" />
    <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-white border-2 border-indigo-500 flex items-center justify-center text-sm font-bold text-indigo-600 shadow-sm z-10">
      {number}
    </div>
    <div className="pt-0.5">
      <h3 className="text-lg font-bold text-neutral-900 mb-4">{title}</h3>
      <div className="text-neutral-600 space-y-4">
        {children}
      </div>
    </div>
  </div>
);

const Docs = () => {
  const [activeSection, setActiveSection] = useState('Installation');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigation = [
    {
      title: 'Getting Started',
      items: ['Introduction', 'Installation', 'Quick Start', 'Core Concepts']
    },
    {
      title: 'Temporal Engine',
      items: ['Motion Synthesis', 'Interpolation', 'Upscaling', 'Coherence']
    },
    {
      title: 'API Reference',
      items: ['Authentication', 'Endpoints', 'Webhooks', 'SDKs']
    },
    {
      title: 'Community',
      items: ['Showcase', 'Contributing', 'License']
    }
  ];

  return (
    <div className="w-full bg-white text-neutral-900 min-h-screen">
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="w-14 h-14 rounded-full bg-neutral-900 text-white flex items-center justify-center shadow-2xl"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="max-w-8xl mx-auto px-6 flex">
        {/* Sidebar */}
        <aside className={`
          fixed md:sticky top-24 h-[calc(100vh-6rem)] w-64 overflow-y-auto pr-8 py-8 border-r border-neutral-100 bg-white
          transition-transform duration-300 z-40
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <div className="relative mb-8">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search size={14} className="text-neutral-400" />
            </div>
            <input 
              type="text" 
              placeholder="Quick search..."
              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg py-2 pl-9 pr-4 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <nav className="space-y-8">
            {navigation.map((group) => (
              <div key={group.title}>
                <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-4">
                  {group.title}
                </h4>
                <ul className="space-y-2">
                  {group.items.map((item) => (
                    <li key={item}>
                      <button
                        onClick={() => {
                          setActiveSection(item);
                          setIsSidebarOpen(false);
                        }}
                        className={`
                          group flex items-center gap-3 w-full text-sm font-medium transition-colors
                          ${activeSection === item ? 'text-indigo-600' : 'text-neutral-500 hover:text-neutral-900'}
                        `}
                      >
                        <div className={`
                          w-1.5 h-1.5 rounded-full transition-all
                          ${activeSection === item ? 'bg-indigo-600 scale-100' : 'bg-transparent scale-0 group-hover:bg-neutral-300 group-hover:scale-100'}
                        `} />
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 py-16 md:pl-12">
          <div className="max-w-3xl">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs font-medium text-neutral-400 mb-8">
              <span>Docs</span>
              <ChevronRight size={12} />
              <span>Getting Started</span>
              <ChevronRight size={12} />
              <span className="text-indigo-600">{activeSection}</span>
            </div>

            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                {activeSection === 'Installation' ? 'Installing TemporalAI' : activeSection}
              </h1>
              <p className="text-xl text-neutral-600 mb-12 leading-relaxed">
                {activeSection === 'Installation' 
                  ? "Get up and running with the world's most advanced temporal engine. Integrate high-fidelity motion synthesis into your workflow in minutes."
                  : `Learn more about ${activeSection} and how to leverage it in your animation projects.`
                }
              </p>

              {activeSection === 'Installation' && (
                <div className="space-y-2">
                  <Step number="1" title="Create your project">
                    <p>Start by creating a new directory for your animation project and initialize it with your favorite package manager.</p>
                    <CodeBlock code="mkdir my-temporal-project\ncd my-temporal-project\nnpm init -y" />
                  </Step>

                  <Step number="2" title="Install the Temporal SDK">
                    <p>Install the core SDK and the motion-engine plugin to get started with frame interpolation.</p>
                    <CodeBlock code="npm install @temporal-ai/sdk @temporal-ai/motion-engine" />
                  </Step>

                  <Step number="3" title="Initialize the engine">
                    <p>Create a basic configuration file to authenticate with our temporal servers and set your default output resolution.</p>
                    <CodeBlock 
                      language="javascript"
                      code="// temporal.config.js\nimport { defineConfig } from '@temporal-ai/sdk';\n\nexport default defineConfig({\n  apiKey: process.env.TEMPORAL_API_KEY,\n  resolution: '4K',\n  engine: 'v2-quantum'\n});" 
                    />
                  </Step>

                  <Step number="4" title="Verify Installation">
                    <p>Run the temporal doctor command to ensure your environment is correctly configured for GPU acceleration.</p>
                    <CodeBlock code="npx temporal doctor" />
                  </Step>
                </div>
              )}

              {activeSection !== 'Installation' && (
                <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-8 text-center border-dashed">
                  <BookOpen className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                  <p className="text-neutral-500 font-medium">This section ({activeSection}) is currently under review and will be published shortly.</p>
                  <button className="mt-4 text-sm font-bold text-indigo-600 hover:text-indigo-700">Request early access →</button>
                </div>
              )}

              {/* Related Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-24 pt-12 border-t border-neutral-100">
                <button className="flex items-center gap-4 p-6 rounded-2xl border border-neutral-200 hover:border-indigo-500 hover:bg-indigo-50/30 transition-all text-left group">
                  <div className="p-3 rounded-xl bg-neutral-100 group-hover:bg-white text-neutral-600 group-hover:text-indigo-600 transition-colors">
                    <Zap size={20} />
                  </div>
                  <div>
                    <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Previous</span>
                    <h4 className="font-bold">Introduction</h4>
                  </div>
                </button>
                <button className="flex items-center flex-row-reverse gap-4 p-6 rounded-2xl border border-neutral-200 hover:border-indigo-500 hover:bg-indigo-50/30 transition-all text-right group">
                  <div className="p-3 rounded-xl bg-neutral-100 group-hover:bg-white text-neutral-600 group-hover:text-indigo-600 transition-colors">
                    <Cpu size={20} />
                  </div>
                  <div>
                    <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Next</span>
                    <h4 className="font-bold">Quick Start</h4>
                  </div>
                </button>
              </div>
            </motion.div>
          </div>
          
          {/* Table of Contents - Hidden on small screens */}
          <div className="hidden xl:block fixed top-24 right-0 w-64 h-[calc(100vh-6rem)] py-8 px-8">
            <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-4">
              On this page
            </h4>
            <ul className="space-y-4 border-l border-neutral-100">
              <li className="pl-4 text-sm font-medium text-neutral-500 hover:text-neutral-900 border-l-2 border-transparent hover:border-indigo-500 -ml-px transition-all cursor-pointer">
                Overview
              </li>
              <li className="pl-4 text-sm font-medium text-neutral-500 hover:text-neutral-900 border-l-2 border-transparent hover:border-indigo-500 -ml-px transition-all cursor-pointer">
                Quick Start guide
              </li>
              <li className="pl-4 text-sm font-medium text-neutral-500 hover:text-neutral-900 border-l-2 border-transparent hover:border-indigo-500 -ml-px transition-all cursor-pointer">
                Common issues
              </li>
              <li className="pl-4 text-sm font-medium text-neutral-500 hover:text-neutral-900 border-l-2 border-transparent hover:border-indigo-500 -ml-px transition-all cursor-pointer">
                Further resources
              </li>
            </ul>

            <div className="mt-12 p-6 rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-200">
               <Shield className="w-6 h-6 mb-4 opacity-80" />
               <h5 className="font-bold mb-2">Need help?</h5>
               <p className="text-xs text-indigo-100 mb-4 leading-relaxed">Our engineering team is available 24/7 for enterprise support.</p>
               <button className="text-[10px] font-bold uppercase tracking-widest transition-transform hover:translate-x-1">Contact Us →</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Docs;