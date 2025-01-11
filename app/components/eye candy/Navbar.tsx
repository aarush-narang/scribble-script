import React from 'react';
import { useMantineTheme, ColorScheme } from '@mantine/core';
import Link from 'next/link';

interface NavbarProps {
  colorScheme: ColorScheme;
}

const Navbar: React.FC<NavbarProps> = ({ children, colorScheme }) => {
  const theme = useMantineTheme();

  return (
    <nav style={{ 
      width: '100%', 
      padding: '10px', 
      backgroundColor: colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.white, 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      borderBottom: `1px solid ${colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]}` 
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link href="/" style={{ margin: 0, padding: '10px', textDecoration: 'none', color: 'inherit', fontFamily: 'inherit' }}>
          <h1 className="home-link">ScribbleScript</h1>
        </Link>
        <a href="https://github.com/aarush-narang/ScribbleScript" target="_blank" rel="noopener noreferrer" style={{ margin: '10px', textDecoration: 'none', color: 'inherit', fontFamily: 'inherit' }}>
          GitHub
        </a>
        {children}
      </div>
    </nav>
  );
};

export default Navbar;
