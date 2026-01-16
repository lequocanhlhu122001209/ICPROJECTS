import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Survey from './pages/Survey';
import PostureCheck from './pages/PostureCheck';
import Results from './pages/Results';
import Chatbot from './pages/Chatbot';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="survey" element={<Survey />} />
          <Route path="posture" element={<PostureCheck />} />
          <Route path="results" element={<Results />} />
          <Route path="chat" element={<Chatbot />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
