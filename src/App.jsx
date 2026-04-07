import { HashRouter, Routes, Route } from 'react-router-dom';
import FormContainer from './components/FormContainer';
import './styles/global.css';

const BUILD_LABEL = (() => {
  try {
    const d = new Date(__BUILD_TIME__);
    const month = d.toLocaleDateString('en-US', { month: 'short' });
    const day = d.getDate();
    const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false });
    return `Build: ${month} ${day} ${time}`;
  } catch {
    return null;
  }
})();

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<FormContainer />} />
      </Routes>
      {BUILD_LABEL && (
        <div style={{
          position: 'fixed',
          bottom: '12px',
          right: '16px',
          fontSize: '0.625rem',
          fontFamily: 'var(--font-family)',
          color: 'var(--text-dim)',
          opacity: 0.65,
          letterSpacing: '0.04em',
          pointerEvents: 'none',
          zIndex: 9999,
          userSelect: 'none',
        }}>
          {BUILD_LABEL}
        </div>
      )}
    </HashRouter>
  );
}
