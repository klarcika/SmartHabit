import { Link, useLocation } from 'react-router-dom';
import './Header.css';
import { useUser, SignOutButton, SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { FiLogOut } from 'react-icons/fi';

function Header() {
  const location = useLocation();
  const { user } = useUser();

  return (
    <header className="navbar">
      <div className="navbar-content">
        <div className="navbar-section navbar-left">
          <div className="logo">SmartHabit</div>
        </div>

        <nav className="navbar-section navbar-center">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Domov</Link>
          <Link to="/habits" className={location.pathname === '/habits' ? 'active' : ''}>Navade</Link>
          <Link to="/milestone" className={location.pathname === '/milestone' ? 'active' : ''}>Milestone</Link>
          <Link to="/achivements" className={location.pathname === '/achivements' ? 'active' : ''}>Dosežki</Link>
          <Link to="/leaderboard" className={location.pathname === '/leaderboard' ? 'active' : ''}>Leaderboard</Link> {/* ⬅️ Dodano */}
          <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>Profil</Link>
        </nav>

        <div className="navbar-section navbar-right">
          <SignedIn>
            <span className="greeting">Pozdravljen/a {user?.firstName}!</span>
            <Link to="/profile">
              <img
                src={user?.imageUrl}
                alt="Avatar"
                className="avatar clickable"
                title="Moj profil"
              />
            </Link>
            <SignOutButton>
              <button className="logout-button" title="Odjava">
                <FiLogOut size={20} />
              </button>
            </SignOutButton>
          </SignedIn>

          <SignedOut>
            <SignInButton>
              <button className="login-button">Prijava</button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}

export default Header;
