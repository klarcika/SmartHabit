import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import Header from "./pages/header.jsx";
import Habits from "./pages/Habits.jsx";



function App() {
  return (
<Router>
  <Header />
  <div style={{ marginTop: '90px' }}>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/habits" element={<Habits/>} />
    </Routes>
  </div>
</Router>
  );
}

export default App;