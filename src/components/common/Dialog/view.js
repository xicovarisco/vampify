import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const DialogComponent = (props) => {
    const [inputValue, setInputValue] = useState('');
    const {
        open,
        onClose,
        title,
        description,
        inputPlaceholder,
        onConfirm
    } = props;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="form-dialog-title"
        >
            <DialogTitle id="form-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{description}</DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label={inputPlaceholder}
                    type="text"
                    fullWidth
                    value={inputValue}
                    onChange={(value) => setInputValue(value.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={() => onConfirm(inputValue)} color="primary">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DialogComponent;
