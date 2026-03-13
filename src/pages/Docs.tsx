import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  Box, 
  Sun, 
  Move, 
  Download,
  Search,
  Menu,
  X,
  Hammer,
  BookOpen
} from 'lucide-react';

const ImagePlaceholder = ({ src, alt, caption }: { src: string; alt: string; caption?: string }) => (
  <figure className="my-10">
    <div className="relative rounded-2xl overflow-hidden border border-neutral-200/60 bg-neutral-50 shadow-sm aspect-video flex items-center justify-center group transition-all duration-300 hover:shadow-md hover:border-neutral-300">
      {/* Pattern Background */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />
      
      <img 
        src={src} 
        alt={alt} 
        className="absolute inset-0 w-full h-full object-cover object-center z-10 transition-transform duration-700 ease-out group-hover:scale-[1.02]"
        onError={(e) => {
          // If image fails to load, hide it and show placeholder
          e.currentTarget.style.display = 'none';
        }}
      />
      
      {/* Placeholder content underneath the image */}
      <div className="text-center z-0 p-6">
        <div className="w-14 h-14 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto mb-4 border border-indigo-100/50">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-neutral-700 font-semibold mb-1">Image Required</h3>
        <p className="text-sm text-neutral-500 max-w-sm mx-auto leading-relaxed">
          Please take a screenshot of the editor and save it as <br/>
          <code className="bg-white px-2 py-1 rounded-md border border-neutral-200 mt-2 inline-block font-mono text-xs text-indigo-600 shadow-sm">
            public{src}
          </code>
        </p>
      </div>
    </div>
    {caption && (
      <figcaption className="text-center text-sm text-neutral-500 mt-4 font-medium flex items-center justify-center gap-2">
        <span className="w-4 h-px bg-neutral-300"></span>
        {caption}
        <span className="w-4 h-px bg-neutral-300"></span>
      </figcaption>
    )}
  </figure>
);

const Docs = () => {
  const [activeSection, setActiveSection] = useState('Introduction');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Scroll to top when section changes on mobile
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeSection]);

  const navigation = [
    {
      title: 'Getting Started',
      items: ['Introduction']
    },
    {
      title: 'Core Features',
      items: ['Object Spawning', 'Transform Controls', 'Lighting']
    },
    {
      title: 'Advanced',
      items: ['Sculpting Tool']
    },
    {
      title: 'Exporting',
      items: ['Export to GLTF']
    }
  ];

  // Helper to get previous and next sections for pagination
  const allItems = navigation.flatMap(group => group.items);
  const currentIndex = allItems.indexOf(activeSection);
  const prevSection = currentIndex > 0 ? allItems[currentIndex - 1] : null;
  const nextSection = currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null;

  const renderContent = () => {
    switch (activeSection) {
      case 'Introduction':
        return (
          <div className="space-y-6">
            <p className="text-lg text-neutral-600 leading-relaxed">
              Welcome to the <strong>3D Animation Editor</strong>. This platform allows you to create fully realized 3D scenes directly in your browser without any prior installation or heavy software.
            </p>
            <p className="text-lg text-neutral-600 leading-relaxed">
              You can spawn primitive shapes, move them around the scene, adjust the lighting environment to cast accurate shadows, sculpt meshes organically, and export your final creation to be used anywhere.
            </p>
            <ImagePlaceholder 
              src="/docs/editor-overview.png" 
              alt="Overview of the 3D Editor interface" 
              caption="The main editor interface featuring the canvas, sidebars, and top navigation"
            />
          </div>
        );
      case 'Object Spawning':
        return (
          <div className="space-y-6">
            <p className="text-lg text-neutral-600 leading-relaxed">
              Add basic 3D shapes to your scene to start building your composition. We provide several primitive types to choose from.
            </p>
            <ul className="space-y-4 my-8">
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">1</div>
                <div>
                  <strong className="text-neutral-900 block mb-1">Locate the Sidebar</strong>
                  <span className="text-neutral-600">Find the Elements Panel on the left side of the editor interface.</span>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">2</div>
                <div>
                  <strong className="text-neutral-900 block mb-1">Choose a Primitive</strong>
                  <span className="text-neutral-600">Click on any of the icons (Cube, Sphere, Cylinder, Torus, Cone) to spawn it.</span>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">3</div>
                <div>
                  <strong className="text-neutral-900 block mb-1">Auto-selection</strong>
                  <span className="text-neutral-600">The newly spawned object will appear at the center of the scene grid and will be automatically selected for immediate manipulation.</span>
                </div>
              </li>
            </ul>
            <ImagePlaceholder 
              src="/docs/object-spawning.png" 
              alt="Spawning objects from the sidebar" 
              caption="Clicking an element from the sidebar spawns it directly into the 3D scene"
            />
          </div>
        );
      case 'Transform Controls':
        return (
          <div className="space-y-6">
            <p className="text-lg text-neutral-600 leading-relaxed">
              Position, rotate, and scale your objects to compose your scene perfectly using our intuitive 3D gizmos.
            </p>
            <ul className="space-y-4 my-8">
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">1</div>
                <div>
                  <strong className="text-neutral-900 block mb-1">Select an Object</strong>
                  <span className="text-neutral-600">Left-click any object in the scene. A bounding box and a transform gizmo will appear.</span>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">2</div>
                <div>
                  <strong className="text-neutral-900 block mb-1">Choose Transformation Mode</strong>
                  <span className="text-neutral-600">In the top toolbar, select your desired mode: Translation (Move), Rotation, or Scaling.</span>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">3</div>
                <div>
                  <strong className="text-neutral-900 block mb-1">Manipulate the Gizmo</strong>
                  <span className="text-neutral-600">Drag the colored handles (Red for X, Green for Y, Blue for Z) to apply transformations precisely along specific axes.</span>
                </div>
              </li>
            </ul>
            <ImagePlaceholder 
              src="/docs/transform-controls.png" 
              alt="Using the Transform Controls" 
              caption="The translation gizmo allows precise positioning of selected objects"
            />
          </div>
        );
      case 'Lighting':
        return (
          <div className="space-y-6">
            <p className="text-lg text-neutral-600 leading-relaxed">
              Set the perfect mood and atmosphere for your scene by adjusting the primary directional light source (the Sun).
            </p>
            <ul className="space-y-4 my-8">
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">1</div>
                <div>
                  <strong className="text-neutral-900 block mb-1">Locate Lighting Panel</strong>
                  <span className="text-neutral-600">Find the Lighting & Environment controls in the right sidebar.</span>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">2</div>
                <div>
                  <strong className="text-neutral-900 block mb-1">Adjust Sun Direction</strong>
                  <span className="text-neutral-600">Use the X, Y, and Z coordinate sliders to change where the light is coming from. Notice how the shadows dynamically update.</span>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">3</div>
                <div>
                  <strong className="text-neutral-900 block mb-1">Intensity & Color</strong>
                  <span className="text-neutral-600">Tweak the Intensity slider to make the scene brighter or softer, and use the Color Picker to apply stylized hues to your illumination.</span>
                </div>
              </li>
            </ul>
            <ImagePlaceholder 
              src="/docs/lighting-controls.png" 
              alt="Adjusting sun position and color" 
              caption="Experiment with different lighting colors and directions to change the atmosphere"
            />
          </div>
        );
      case 'Sculpting Tool':
        return (
          <div className="space-y-6">
            <p className="text-lg text-neutral-600 leading-relaxed">
              Deform basic shapes organically using our built-in sculpting brush. This allows for the creation of soft, custom shapes.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 my-6 flex gap-3 text-amber-800">
              <span className="font-bold flex-shrink-0">Pro Tip:</span> 
              <p className="text-sm">For the best sculpting results, use objects with high segment counts (like a Sphere rather than a simple Cube). More vertices mean smoother deformations.</p>
            </div>
            <ul className="space-y-4 my-8">
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">1</div>
                <div>
                  <strong className="text-neutral-900 block mb-1">Enable Sculpting Mode</strong>
                  <span className="text-neutral-600">With an object selected, toggle the Sculpt Mode (Hammer icon) in the toolbar.</span>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">2</div>
                <div>
                  <strong className="text-neutral-900 block mb-1">Adjust Brush Settings</strong>
                  <span className="text-neutral-600">In the right panel, configure your Brush Size and Brush Strength to control how much the geometry is affected.</span>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">3</div>
                <div>
                  <strong className="text-neutral-900 block mb-1">Deform the Mesh</strong>
                  <span className="text-neutral-600">Click and drag over the surface of the object in the 3D viewport to pull the vertices toward your cursor.</span>
                </div>
              </li>
            </ul>
            <ImagePlaceholder 
              src="/docs/sculpting-tool.png" 
              alt="Sculpting a sphere" 
              caption="Using the sculpting brush to organically deform a mesh"
            />
          </div>
        );
      case 'Export to GLTF':
        return (
          <div className="space-y-6">
            <p className="text-lg text-neutral-600 leading-relaxed">
              Once your masterpiece is complete, export the entire scene as a standard `.gltf` file. This format is widely supported by other 3D software (Blender, Unity, Unreal) and web viewers.
            </p>
            <ul className="space-y-4 my-8">
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">1</div>
                <div>
                  <strong className="text-neutral-900 block mb-1">Finalize the Scene</strong>
                  <span className="text-neutral-600">Ensure all objects are positioned and colored exactly as you want them. Helpers and grids are automatically excluded from the final export.</span>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">2</div>
                <div>
                  <strong className="text-neutral-900 block mb-1">Click Export</strong>
                  <span className="text-neutral-600">Locate the Download/Export button in the top right of the navigation bar.</span>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">3</div>
                <div>
                  <strong className="text-neutral-900 block mb-1">Save File</strong>
                  <span className="text-neutral-600">The browser will instantly compile the scene data and prompt you to download the `temporal-scene.gltf` file locally.</span>
                </div>
              </li>
            </ul>
            <ImagePlaceholder 
              src="/docs/export-gltf.png" 
              alt="Exporting the scene" 
              caption="Clicking the Export button bundles your composition into an optimized file instantly"
            />
          </div>
        );
      default:
        return (
          <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-12 text-center border-dashed my-8">
            <BookOpen className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-neutral-900 mb-2">Coming Soon</h3>
            <p className="text-neutral-500 font-medium">This section ({activeSection}) is currently under review and will be published shortly.</p>
          </div>
        );
    }
  };

  return (
    <div className="w-full bg-white text-neutral-900 min-h-screen">
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-colors"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div 
        className={`md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <div className="max-w-8xl mx-auto px-6 flex relative">
        {/* Sidebar */}
        <aside className={`
          fixed md:sticky top-20 h-[calc(100vh-5rem)] w-72 overflow-y-auto pl-2 pr-8 py-10 border-r border-neutral-100 bg-white
          transition-transform duration-300 ease-in-out z-40
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          left-0 md:left-auto
        `}>
          <div className="relative mb-10 pl-4">
            <div className="absolute inset-y-0 left-7 flex items-center pointer-events-none">
              <Search size={14} className="text-neutral-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search documentation..."
              className="w-full bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-neutral-400"
            />
          </div>

          <nav className="space-y-10 pl-4">
            {navigation.map((group) => (
              <div key={group.title}>
                <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-widest mb-4">
                  {group.title}
                </h4>
                <ul className="space-y-1.5 border-l-2 border-neutral-100 ml-1">
                  {group.items.map((item) => (
                    <li key={item}>
                      <button
                        onClick={() => {
                          setActiveSection(item);
                          setIsSidebarOpen(false);
                        }}
                        className={`
                          group flex items-center gap-3 w-full text-sm font-medium transition-all px-4 py-2 -ml-[2px] border-l-2
                          ${activeSection === item 
                            ? 'text-indigo-600 border-indigo-600 bg-indigo-50/50 rounded-r-lg' 
                            : 'text-neutral-500 border-transparent hover:text-neutral-900 hover:border-neutral-300'
                          }
                        `}
                      >
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
        <main className="flex-1 min-w-0 py-10 md:py-16 md:px-12 lg:px-20">
          <div className="max-w-3xl mx-auto xl:mx-0">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm font-medium text-neutral-500 mb-8 bg-neutral-50 w-fit px-4 py-1.5 rounded-full border border-neutral-100">
              <span className="text-neutral-400">Documentation</span>
              <ChevronRight size={14} className="text-neutral-300" />
              <span>{navigation.find(g => g.items.includes(activeSection))?.title}</span>
              <ChevronRight size={14} className="text-neutral-300" />
              <span className="text-indigo-600 font-semibold">{activeSection}</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <div className="mb-10">
                  <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 mb-4">
                    {activeSection}
                  </h1>
                  <div className="h-1 w-20 bg-indigo-600 rounded-full" />
                </div>

                <article className="prose prose-neutral prose-lg max-w-none prose-headings:font-bold prose-p:text-neutral-600 prose-img:rounded-2xl prose-img:border prose-img:border-neutral-200 prose-a:text-indigo-600">
                  {renderContent()}
                </article>

                {/* Pagination / Related Links */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-20 pt-10 border-t border-neutral-200/60">
                  {prevSection ? (
                    <button 
                      onClick={() => setActiveSection(prevSection)}
                      className="flex items-center gap-4 p-6 rounded-2xl border border-neutral-200 hover:border-indigo-400 hover:bg-neutral-50 transition-all text-left group"
                    >
                      <div className="p-3 rounded-xl bg-white border border-neutral-100 shadow-sm group-hover:scale-110 group-hover:text-indigo-600 transition-all">
                        <ChevronRight size={20} className="rotate-180" />
                      </div>
                      <div>
                        <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider block mb-1">Previous</span>
                        <h4 className="font-bold text-neutral-900 group-hover:text-indigo-600 transition-colors">{prevSection}</h4>
                      </div>
                    </button>
                  ) : <div />}
                  
                  {nextSection ? (
                    <button 
                      onClick={() => setActiveSection(nextSection)}
                      className="flex items-center flex-row-reverse gap-4 p-6 rounded-2xl border border-neutral-200 hover:border-indigo-400 hover:bg-neutral-50 transition-all text-right group"
                    >
                      <div className="p-3 rounded-xl bg-white border border-neutral-100 shadow-sm group-hover:scale-110 group-hover:text-indigo-600 transition-all">
                        <ChevronRight size={20} />
                      </div>
                      <div>
                        <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider block mb-1">Next</span>
                        <h4 className="font-bold text-neutral-900 group-hover:text-indigo-600 transition-colors">{nextSection}</h4>
                      </div>
                    </button>
                  ) : <div />}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Docs;