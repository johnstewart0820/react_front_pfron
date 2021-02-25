import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Drawer, Button } from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import ImageIcon from '@material-ui/icons/Image';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import SettingsIcon from '@material-ui/icons/Settings';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined';
import storage from '../../../../utils/storage';
import { SidebarNav } from './components';
import { withRouter } from 'react-router-dom';
import useStyles from './style';

const Sidebar = props => {
	const { open, variant, history, onClose, className, ...rest } = props;
	const [pages, setPages] = useState([]);
	const classes = useStyles();
	const items = [
		[
			{
				title: 'Kokpit',
				href: '/cockpit',
				icon: <DashboardIcon />
			},
			{
				title: 'Kandydaci',
				href: '/candidates',
				icon: <PeopleIcon />
			},
			{
				title: 'Punkty kwalifikacyjne',
				href: '/qualification_points',
				icon: <ShoppingBasketIcon />
			},
			{
				title: 'Specjaliści',
				href: '/specialists',
				icon: <LockOpenIcon />
			},
			{
				label: 'UCZESTNICY'
			},
			{
				title: 'Uczestnicy',
				href: '/participants',
				icon: <TextFieldsIcon />
			},
			{
				title: 'Zespół ORK',
				href: '/ork_teams',
				icon: <ImageIcon />
			},
			{
				title: 'Lista IPR',
				href: '/ipr_list',
				icon: <AccountBoxIcon />
			},
			{
				label: 'USŁUGI'
			},
			{
				title: 'Lista usług',
				href: '/service_list',
				icon: <HelpOutlineOutlinedIcon />
			},
			{
				title: 'Warsztaty/szkolenia',
				href: '/workingshop',
				icon: <HelpOutlineOutlinedIcon />
			},
			{
				title: 'Powiadomienia',
				href: '/notifications',
				icon: <HelpOutlineOutlinedIcon />
			},
			{
				label: 'FINANSE'
			},
			{
				title: 'Lista ORK',
				href: '/ork_list',
				icon: <HelpOutlineOutlinedIcon />
			},
			{
				title: 'Zdefiniowane koszty usług',
				href: '/payments',
				icon: <HelpOutlineOutlinedIcon />
			},
			{
				title: 'Raporty',
				href: '/reports',
				icon: <HelpOutlineOutlinedIcon />
			},
			{
				label: 'USTAWIENIA SYSTEMOWE'
			},
			{
				title: 'Uźytkownicy systemu',
				href: '/users',
				icon: <HelpOutlineOutlinedIcon />
			},
			{
				title: 'Log zdarzeń',
				href: '/logs',
				icon: <HelpOutlineOutlinedIcon />
			},
		],
		[
			{
				title: 'Kokpit',
				href: '/cockpit',
				icon: <DashboardIcon />
			},
			{
				title: 'Kandydaci',
				href: '/candidates',
				icon: <PeopleIcon />
			},
			{
				title: 'Punkty kwalifikacyjne',
				href: '/qualification_points',
				icon: <ShoppingBasketIcon />
			},
			{
				title: 'Specjaliści',
				href: '/specialists',
				icon: <LockOpenIcon />
			},
			{
				label: 'UCZESTNICY'
			},
			{
				title: 'Uczestnicy',
				href: '/participants',
				icon: <TextFieldsIcon />
			},
			{
				title: 'Zespół ORK',
				href: '/ork_teams',
				icon: <ImageIcon />
			},
			{
				title: 'Lista IPR',
				href: '/ipr_list',
				icon: <AccountBoxIcon />
			},
			{
				label: 'USŁUGI'
			},
			{
				title: 'Lista usług',
				href: '/service_list',
				icon: <HelpOutlineOutlinedIcon />
			},
			{
				title: 'Warsztaty/szkolenia',
				href: '/workingshop',
				icon: <HelpOutlineOutlinedIcon />
			},
			{
				label: 'FINANSE'
			},
			{
				title: 'Lista ORK',
				href: '/ork_list',
				icon: <HelpOutlineOutlinedIcon />
			},
			{
				title: 'Zdefiniowane koszty usług',
				href: '/payments',
				icon: <HelpOutlineOutlinedIcon />
			},
			{
				title: 'Raporty',
				href: '/reports',
				icon: <HelpOutlineOutlinedIcon />
			},
		],
		[
			{
				title: 'Kokpit',
				href: '/cockpit',
				icon: <DashboardIcon />
			},
			{
				title: 'Kandydaci',
				href: '/candidates',
				icon: <PeopleIcon />
			},
		]
	];
	useEffect(() => {
		let roleList = localStorage.getItem('role').split(',');
		let role = 3;
		for (let i = 0; i < roleList.length; i ++) {
			if (parseInt(roleList[i]) < role) {
				role = parseInt(roleList[i]);
			}
		}
		setPages(items[role - 1]);
	}, []);


	return (
		<Drawer
			anchor="left"
			classes={{ paper: classes.drawer }}
			onClose={onClose}
			open={open}
			variant={variant}
		>
			<div
				{...rest}
				className={clsx(classes.root, className)}
			>
				<div className={classes.logoBlock}>
					<img src="/images/logos/logo.png" className={classes.main_logo} />
				</div>
				<SidebarNav
					className={classes.nav}
					pages={pages}
				/>
			</div>
		</Drawer>
	);
};

Sidebar.propTypes = {
	className: PropTypes.string,
	onClose: PropTypes.func,
	open: PropTypes.bool.isRequired,
	variant: PropTypes.string.isRequired
};

export default withRouter(Sidebar);
