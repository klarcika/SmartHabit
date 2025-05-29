import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import Header from "./pages/header.jsx";
import Habits from "./pages/Habits.jsx";
import Achievements from "./pages/Achivement.jsx";
import Milestone from "./pages/Milestone.jsx";
import Leaderboard from "./pages/leaderboard.jsx";


function App() {
  return (
<Router>
  <Header />
  <div style={{ marginTop: '90px' }}>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/habits" element={<Habits/>} />
      <Route path="/milestone" element={<Milestone/>} />
      <Route path="/achivements" element={<Achievements/>} />
       <Route path="/leaderboard" element={<Leaderboard />} />
    </Routes>
  </div>
</Router>
  );
}

export default App;