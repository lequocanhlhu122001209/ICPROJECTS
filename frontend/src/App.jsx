import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Survey from './pages/Survey';
import DeviceData from './pages/DeviceData';
import PostureCheck from './pages/PostureCheck';
import Results from './pages/Results';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="survey" element={<Survey />} />
          <Route path="device-data" element={<DeviceData />} />
          <Route path="posture" element={<PostureCheck />} />
          <Route path="results" element={<Results />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
