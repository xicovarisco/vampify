import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import MusicIcon from '@material-ui/icons/LibraryMusic';
import Toolbar from '@material-ui/core/Toolbar';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import _ from 'lodash';

// Styles
import './view.scss';

const Header = (props) => {
    const onChangeSearch = _.debounce((event) => {
        if (props.onSearchPlaylist) props.onSearchPlaylist(event);
    }, 1000);

    return (
        <AppBar className="header">
            <Toolbar className="toolbar">
                <div className="leftContainer">
                    <MusicIcon className="mright15" />
                    <h2>Vampify</h2>
                </div>
                <div className="rightContainer">
                    <div className="searchComponent">
                        <div className="searchIconComponent">
                            <SearchIcon style={{ color: '#6C2EFF' }} />
                        </div>
                        <InputBase
                            placeholder="Search…"
                            classes={{
                                root: 'inputRoot',
                                input: 'inputNormal',
                            }}
                            inputProps={{ 'aria-label': 'search' }}
                            onChange={(event) => onChangeSearch(event.target.value)}
                        />
                    </div>
                </div>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
