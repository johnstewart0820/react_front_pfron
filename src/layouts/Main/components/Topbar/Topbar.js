import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { AppBar, Button, IconButton, Menu, MenuItem } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import MenuIcon from '@material-ui/icons/Menu';
import useStyles from './style';
import { useHistory } from "react-router-dom";
import storage from '../../../../utils/storage';

const Topbar = props => {
  const { className, title, onSidebarOpen, onSidebarClose, ...rest } = props;
  const [ open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [avatarOpen, setAvatarOpen] = useState(Boolean(anchorEl));
  const classes = useStyles();
  let history = useHistory();

  const onMaxTopbar = () => {
    if (open === true)
      onSidebarOpen();
    else 
      onSidebarClose();
    setOpen(!open);
  }

  const handleClose = () => {
    setAnchorEl(null);
    setAvatarOpen(false);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
    setAvatarOpen(true);
  };

  const handleLogout = () => {
    handleClose();
    storage.removeStorage('token');
    history.push('/login');
  }

  return (
    <AppBar
      {...rest}
      className={clsx(classes.root, className)}
    >
      <div className={classes.toolbar}>
        <div className={classes.titlebar}>
          <Button className={classes.close_drawer_icon} onClick={onMaxTopbar}>
            <MenuIcon color="white"/>
          </Button>
        </div>
        <div className={classes.avatar}>
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
          >
            <AccountCircle className={classes.avataricon}/>
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={avatarOpen}
            onClose={handleClose}
          >
            <MenuItem onClick={handleLogout}>Wyloguj</MenuItem>
          </Menu>
        </div>
        <div className={classes.title}>
          {title}
        </div>
      </div>
    </AppBar>
  );
};

Topbar.propTypes = {
  className: PropTypes.string,
  onSidebarOpen: PropTypes.func
};

export default Topbar;
