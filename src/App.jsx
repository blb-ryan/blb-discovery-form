import { HashRouter, Routes, Route } from 'react-router-dom';
import FormContainer from './components/FormContainer';
import './styles/global.css';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<FormContainer />} />
      </Routes>
    </HashRouter>
  );
}
