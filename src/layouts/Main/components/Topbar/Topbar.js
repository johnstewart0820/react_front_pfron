import React, { useState } from 'react';
import { SiteInfoContextConsumer } from "App";
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { AppBar, Button, IconButton, Menu, MenuItem, Typography } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import MenuIcon from '@material-ui/icons/Menu';
import useStyles from './style';
import { Alert } from 'components';
import { useHistory } from "react-router-dom";
import storage from '../../../../utils/storage';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faFont, faLink, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

const Topbar = props => {
  const { className, title, onSidebarOpen, onSidebarClose, openSidebar, ...rest } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const [avatarOpen, setAvatarOpen] = useState(Boolean(anchorEl));
  const classes = useStyles();
  let history = useHistory();

  const onMaxTopbar = () => {
    if (openSidebar === false)
      onSidebarOpen();
    else 
      onSidebarClose();
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

	const changeFontSize = type => {

    let
      body = document.body,
      fontSize = parseInt(window.getComputedStyle(body).fontSize.replace("px", ""));

    if (type === 'less' && fontSize > 10) fontSize -= 1;
    if (type === 'more' && fontSize < 22) fontSize += 1;
    if (type === 'normal') fontSize = 16;

    fontSize += "px";
    body.style.fontSize = fontSize;
  }

  const toggleUnderlineLinks = (e, handle) => {
    e.preventDefault();
    document.body.classList.toggle("links-underline");
		handle();
  }

	const toggleContrast = (e, handle) => {
		e.preventDefault(); 
		handle();
	}

	const handleProfile = () => {
		history.push('/profile');
	}

  return (
		<SiteInfoContextConsumer>
    { (props) => (
    <AppBar
      {...rest}
      className={clsx(classes.root, className)}
    >
      <div className={classes.toolbar}>
        <div className={classes.titlebar}>
          <Button className={classes.close_drawer_icon} onClick={onMaxTopbar} aria-label={!openSidebar ? 'Rozwiń menu' : 'Zwiń menu'} title={!openSidebar ? 'Rozwiń menu' : 'Zwiń menu'}>
            <MenuIcon/>
          </Button>
        </div>
				<div className={classes.rightControllerArea}>
					<div className={classes.controllerArea}>
						<div className={classes.vertical_separator}/>
						<Button title="Wczytaj domyślny rozmiar tekstu"	onClick={(e) => changeFontSize('normal')}>
							<div className={classes.helper} name="normal">
									<FontAwesomeIcon icon={faFont} size="2x"/>
							</div>
						</Button>
						<div className={classes.vertical_separator}/>
						<Button title="Pomniejsz tekst na stronie" onClick={(e) => changeFontSize('less')}>
							<div className={classes.helper} name="minus">
									<FontAwesomeIcon icon={faFont} size="2x"/>
									<FontAwesomeIcon icon={faMinus} size="1x"/>
							</div>
						</Button>
						<div className={classes.vertical_separator}/>
						<Button title="Powiększ tekst na stronie" onClick={(e) => changeFontSize('more')}>
							<div className={classes.helper} name="plus">
								<FontAwesomeIcon icon={faFont} size="2x" />
								<FontAwesomeIcon icon={faPlus} size="1x" />
							</div>
						</Button>
						<div className={classes.vertical_separator}/>
						<Button title={props.is_contrast ? "Wyłącz tryb wysokokontrastowy": "Włącz tryb wysokokontrastowy"} onClick={(e) => toggleContrast(e, props.toggleContrast)}>
							<div className={classes.helper}>
									<FontAwesomeIcon icon={faEye} size="2x"/>
							</div>
						</Button>
						<div className={classes.vertical_separator}/>
						<Button title={props.is_underline ? "Wyłącz podkreślenie linków" : "Włącz podkreślenie linków"}  onClick={(e) => toggleUnderlineLinks(e, props.toggleUnderline)}>
							<div className={classes.helper}>
									<FontAwesomeIcon icon={faLink} size="2x"/>
							</div>
						</Button>
						<div className={classes.vertical_separator}/>
					</div>
					<div className={classes.avatar}>
						<IconButton
							aria-label="Profil użytkownika"
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
							<MenuItem onClick={handleProfile} aria-label="Edytuj profil">Edytuj profil</MenuItem>
							<MenuItem onClick={handleLogout} aria-label="Wyloguj">Wyloguj</MenuItem>
						</Menu>
					</div>
				</div>
				<Typography variant="h1" className={classes.title}>
					{title}
				</Typography>
      </div>
    </AppBar>
		)}
    </SiteInfoContextConsumer>
  );
};

Topbar.propTypes = {
  className: PropTypes.string,
  onSidebarOpen: PropTypes.func
};

export default Topbar;
