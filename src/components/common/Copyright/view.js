import React from 'react';

// Styles
import './view.scss';

function Copyright() {
    const date = new Date().getFullYear();
    return (
        <div className="flexCenter copyrightComponent">
            <span className="subtitle">Copyright © </span>
            <a href="https://xicovarisco.com" target="_blank" rel="noopener noreferrer">
                Xicovarisco
            </a>
            <span className="subtitle">{date}</span>
        </div>
    );
}

export default Copyright;
