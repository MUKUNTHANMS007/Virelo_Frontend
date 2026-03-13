import { ImageCarouselHero } from '../components/ai-image-generator-hero';

const Home = () => {
  const images = [
    { id: '1', src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600', alt: 'Temporal Transition 1', rotation: -5 },
    { id: '2', src: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=600', alt: 'Motion Synth', rotation: 8 },
    { id: '3', src: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=600', alt: 'Temporal AI', rotation: -3 },
    { id: '4', src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600', alt: 'Coherence', rotation: 5 },
    { id: '5', src: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600', alt: 'Tech', rotation: -2 },
  ];

  return (
    <div className="w-full">
      <ImageCarouselHero 
        title="Unleash the Power of Temporal AI"
        subtitle="Next-Gen Motion Synthesis"
        description="Transform static frames into breathtaking cinematic transitions with the world's most advanced AI motion engine."
        ctaText="Explore the Workspace"
        images={images}
        features={[
          { title: "Quantum Motion", description: "Zero-artifact frame interpolation at 4K resolution" },
          { title: "Style Coherence", description: "Maintain visual identity across complex scene morphs" },
          { title: "Real-time Synthesis", description: "Generate production-ready video in seconds" }
        ]}
      />
    </div>
  );
};

// This line is what Vite is looking for!
export default Home;