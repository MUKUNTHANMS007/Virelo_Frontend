import { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Docs from './pages/Docs';
import News from './pages/News';
import Products from './pages/Products';

export default function App() {
  const [activePage, setActivePage] = useState('products');

  const renderContent = () => {
    switch (activePage) {
      case 'home': return <Home />;
      case 'docs': return <Docs />;
      case 'news': return <News />;
      case 'products': return <Products />;
      default: return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      {/* Pass the state setter to Navbar so it can change pages */}
      <Navbar onNavigate={setActivePage} />

      <main className="pt-24 min-h-screen">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
}