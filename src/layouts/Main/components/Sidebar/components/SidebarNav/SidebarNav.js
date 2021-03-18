/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React, { forwardRef } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { List, ListItem, Button, Typography } from '@material-ui/core';
import SvgIcon from '@material-ui/core/SvgIcon';

const useStyles = makeStyles(theme => ({
  root: {},
  item: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0
  },
  label: {
    padding: '16px 32px',
    justifyContent: 'flex-start',
    color: theme.palette.sidebar_title_color,
    fontFamily: 'roboto',
    fontSize: '0.8125em'
  },
  button: {
    padding: '16px 32px',
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%',
    fontWeight: 400,
    fontSize: '0.8750em',
    color: theme.palette.sidebar_color,
    lineHeight: '1em',
		'& path': {
			fill: theme.palette.sidebar_title_color,
		},
    '&:hover': {
      backgroundColor: theme.palette.green,
      color: theme.palette.sidebar_hover_color,
      fontWeight: 400,
      borderRadius: '0px',
			
      '& $icon': {
        color: theme.palette.sidebar_hover_color,
				'& path': {
					fill: theme.palette.sidebar_hover_color,
				}
      },
    },
  },
  icon: {
    color: theme.palette.sidebar_color,
    width: 20,
    height: 20,
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(3),
		backgroundRepeat: 'no-repeat',
		
    '&:hover': {
      color: theme.palette.sidebar_hover_color,
			'& path': {
				fill: theme.palette.sidebar_hover_color,
			}
    },
  },
  active: {
    fontWeight: 400,
		'& path': {
			fill: theme.palette.sidebar_hover_color,
		},
    '& $icon': {
      color: theme.palette.sidebar_hover_color,
    },
    backgroundColor: theme.palette.green,
    color: theme.palette.sidebar_hover_color,
    borderRadius: '0px'
  }
}));

const CustomRouterLink = forwardRef((props, ref) => (
  <div
    ref={ref}
    style={{ flexGrow: 1 }}
  >
    <RouterLink {...props} />
  </div>
));

const SidebarNav = props => {
  const { pages, className, ...rest } = props;

  const classes = useStyles();

  return (
    <List
      {...rest}
      className={clsx(classes.root, className)}
    >
      {pages.map(page => (
        page.main_label ?
        <Typography variant="h2" className={classes.label}>
          {page.main_label}
        </Typography>
				:
				page.label ?
				<Typography variant="h3" className={classes.label}>
					{page.label}
				</Typography>
        :
        <ListItem
          className={classes.item}
          disableGutters
          key={page.title}
        >
          <Button
            activeClassName={classes.active}
            className={classes.button}
            component={CustomRouterLink}
            to={page.href}
          >
						<SvgIcon className={classes.icon}>
							{page.icon}
						</SvgIcon>
            {/* <div  style={{backgroundImage: `url("${page.icon}")`,backgroundColor: 'transparent'}}></div> */}
            {page.title}
          </Button>
        </ListItem>
      ))}
    </List>
  );
};

SidebarNav.propTypes = {
  className: PropTypes.string,
  pages: PropTypes.array.isRequired
};

export default SidebarNav;
