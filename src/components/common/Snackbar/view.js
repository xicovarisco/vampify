import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';

const SnackbarComponent = (props) => {
    const { onClose, open, message } = props;
    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            open={open}
            autoHideDuration={3000}
            onClose={onClose}
            message={message}
        />
    );
};

export default SnackbarComponent;
