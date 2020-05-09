import React from 'react';

// External Components
import Copyright from '../Copyright/view';

// Styles
import './view.scss';

const Footer = () => {
    return (
        <footer>
            <h6 className="flexCenter">
                Footer
            </h6>
            <p className="subtitle flexCenter">
                Something here to give the footer a purpose!
            </p>
            <Copyright />
        </footer>
    );
};

export default Footer;
