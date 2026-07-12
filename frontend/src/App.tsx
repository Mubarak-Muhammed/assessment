import { Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/ui/Navbar';
import Toast from './components/ui/Toast';
import Dashboard from './pages/Dashboard';
import LogInteraction from './pages/LogInteraction';
import InteractionsList from './pages/InteractionsList';

function App() {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/log" element={<LogInteraction />} />
          <Route path="/interactions" element={<InteractionsList />} />
        </Routes>
      </main>
      <Toast />
    </div>
  );
}

export default App;
