// src/components/FeaturedNav.tsx
import React from 'react';
import VerticalNav, { NavLink } from './VerticalNav';

const FeaturedNav: React.FC = () => {
  const featuredLinks: NavLink[] = [
    { label: 'Project 1', url: '#project1' },
    { label: 'Project 2', url: '#project2' },
    { label: 'Project 3', url: '#project3' },
  ];

  return <VerticalNav header="Featured" links={featuredLinks} />;
};

export default FeaturedNav;
