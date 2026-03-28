// src/components/GotoNav.tsx
import React from 'react';
import VerticalNav, { NavLink } from './VerticalNav';

const GotoNav: React.FC = () => {
  const gotoLinks: NavLink[] = [
    { label: 'About', url: '/about' },
    { label: 'Projects', url: '/projects' },
    { label: 'Thoughts', url: '/thoughts' },
    { label: 'Contact', url: '/contact' },
  ];

  return <VerticalNav header="Goto" links={gotoLinks} />;
};

export default GotoNav;
