import { useAuthStore } from '../store/authStore';
import { ImageCarouselHero } from '../components/ai-image-generator-hero';
import cinarizationArt from '../assets/cinarization_line_art.png';

const Home = ({ onNavigate }: { onNavigate?: (page: string) => void }) => {
  const { isAuthenticated } = useAuthStore();
  const images = [
    { id: '1', src: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=600', alt: '3D Character Posing', rotation: -5 },
    { id: '2', src: cinarizationArt, alt: 'Cinarization Line Art', rotation: 8 },
    { id: '3', src: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=600', alt: 'Dope Sheet Timeline', rotation: -3 },
    { id: '4', src: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&q=80&w=600', alt: 'Onion Skinning', rotation: 5 },
    { id: '5', src: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=600', alt: 'Digital Reference Sheet', rotation: -2 },
  ];

  return (
    <div className="w-full">
      <ImageCarouselHero 
        title="Evolution of Animation: 2D Soul, 3D Precision"
        subtitle="Hybrid 2D/3D Animation Pipeline"
        description="Bridge the gap between 3D modeling and hand-drawn aesthetics. Capture poses, apply Cinarization filters, and trigger AniDoc interpolation for fluid character motion."
        ctaText={isAuthenticated ? "Enter Workspace" : "Get Started Now"}
        onCtaClick={() => onNavigate?.(isAuthenticated ? 'projects' : 'signin')}
        images={images}
        features={[
          { title: "AniDoc Integration", description: "Automated correspondence matching for smooth 2D/3D hybrids." },
          { title: "Industry Formats", description: "Native .PSD and .CLIP metadata support for design layers." },
          { title: "Pro Animation Tools", description: "Real-time Onion Skinning and Dope Sheet management." }
        ]}
      />
    </div>
  );
};

// This line is what Vite is looking for!
export default Home;