import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const links = [
  { to: '/projects', label: 'Projects' },
  { to: '/writing', label: 'Writing' },
  { to: '/board', label: 'Board' },
];

const CenteredNav = () => (
  <header className="w-full max-w-2xl mx-auto px-6 pt-10 pb-8 text-center">
    <Link
      to="/"
      className="inline-block text-sm text-primary dark:text-secondary mb-4 hover:opacity-70 transition-opacity"
    >
      Prajwal Shah
    </Link>
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
      {links.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className="text-sm text-primary dark:text-secondary opacity-70 hover:opacity-100 transition-opacity"
        >
          {link.label}
        </Link>
      ))}
      <ThemeToggle inline />
    </div>
  </header>
);

export default CenteredNav;
