import React from 'react';
import { NavLink } from 'react-router-dom';

const Navigation = () => {
    const navItems = [
        { path: '/', label: 'Dashboard', icon: '📊' },
        { path: '/journal', label: 'Journal', icon: '📝' },
        { path: '/insights', label: 'Insights', icon: '💡' },
        { path: '/calendar', label: 'Calendar', icon: '📅' },
        { path: '/profile', label: 'Profile', icon: '👤' }
    ];

    return (
        <nav className="navigation">
            <ul className="nav-list">
                {navItems.map((item) => (
                    <li key={item.path} className="nav-item">
                        <NavLink
                            to={item.path}
                            className={({ isActive }) =>
                                `nav-link ${isActive ? 'nav-link--active' : ''}`
                            }
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Navigation;