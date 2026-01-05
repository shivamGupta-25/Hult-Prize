import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import { Teams } from './pages/TeamsPage';
import Contact from './pages/ContactUsPage';
import Footer from './components/Footer';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Nav />
        <main className="grow pt-16 md:pt-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
