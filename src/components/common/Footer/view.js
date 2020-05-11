import React from 'react';

// External Components
import Copyright from '../Copyright/view';

// Styles
import './view.scss';

const Footer = () => {
    return (
        <footer>
            <p className="subtitle flexCenter">
                Repo can be found <a href="https://github.com/xicovarisco/vampify" target="_blank" rel="noopener noreferrer">here</a>
            </p>
            <Copyright />
        </footer>
    );
};

export default Footer;
