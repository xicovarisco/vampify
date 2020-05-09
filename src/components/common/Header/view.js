import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import MusicIcon from '@material-ui/icons/LibraryMusic';
import Toolbar from '@material-ui/core/Toolbar';

const Header = () => {
    return (
        <AppBar className="header">
            <Toolbar>
                <MusicIcon className="mright15" />
                <h2>Vampify</h2>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
