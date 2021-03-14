import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Drawer, Button, SvgIcon } from '@material-ui/core';
import kandydaci from './svg/kandydaci.svg';
import kokpit from './svg/kokpit.svg';
import listaIPR from './svg/listaipr.svg';
import listaORK from './svg/listaOrk.svg';
import listaUslug from './svg/listauslug.svg';
import logZdarzen from './svg/logzdarzen.svg';
import powiadomienia from './svg/powiadomienia.svg';
import punktyKwalifikacyjne from './svg/punktykwalifikacyjne.svg';
import raporty from './svg/raporty.svg';
import specjalisci from './svg/specjalisci.svg';
import szkolenia from './svg/szkolenia.svg';
import uczestnicy from './svg/uczestnicy.svg';
import uzytkownicySystemu from './svg/uzytkownicy.svg';
import costs from './svg/costs.svg';
import zespolOrk from './svg/zespolork.svg';
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
				icon: kokpit
			},
			{
				title: 'Kandydaci',
				href: '/candidates',
				icon: kandydaci
			},
			{
				title: 'Punkty kwalifikacyjne',
				href: '/qualification_points',
				icon: punktyKwalifikacyjne
			},
			{
				title: 'Specjaliści',
				href: '/specialists',
				icon: specjalisci
			},
			{
				label: 'UCZESTNICY'
			},
			{
				title: 'Uczestnicy',
				href: '/participants',
				icon: uczestnicy
			},
			{
				title: 'Zespół ORK',
				href: '/ork_teams',
				icon: zespolOrk
			},
			{
				title: 'Lista IPR',
				href: '/ipr_list',
				icon: listaIPR
			},
			{
				label: 'USŁUGI'
			},
			{
				title: 'Lista usług',
				href: '/service_list',
				icon: listaUslug
			},
			{
				title: 'Szkolenia',
				href: '/trainings',
				icon: szkolenia
			},
			{
				title: 'Powiadomienia',
				href: '/notifications',
				icon: powiadomienia
			},
			{
				label: 'FINANSE'
			},
			{
				title: 'Lista ORK',
				href: '/ork_list',
				icon: listaORK
			},
			{
				title: 'Zdefiniowane koszty usług',
				href: '/payments',
				icon: costs
			},
			{
				title: 'Raporty',
				href: '/reports',
				icon: raporty
			},
			{
				label: 'USTAWIENIA SYSTEMOWE'
			},
			{
				title: 'Uźytkownicy systemu',
				href: '/users',
				icon: uzytkownicySystemu
			},
			{
				title: 'Log zdarzeń',
				href: '/logs',
				icon: logZdarzen
			},
		],
		[
			{
				title: 'Kokpit',
				href: '/cockpit',
				icon: kokpit
			},
			{
				title: 'Kandydaci',
				href: '/candidates',
				icon: kandydaci
			},
			{
				title: 'Punkty kwalifikacyjne',
				href: '/qualification_points',
				icon: punktyKwalifikacyjne
			},
			{
				title: 'Specjaliści',
				href: '/specialists',
				icon: specjalisci
			},
			{
				label: 'UCZESTNICY'
			},
			{
				title: 'Uczestnicy',
				href: '/participants',
				icon: uczestnicy
			},
			{
				title: 'Zespół ORK',
				href: '/ork_teams',
				icon: zespolOrk
			},
			{
				title: 'Lista IPR',
				href: '/ipr_list',
				icon: listaIPR
			},
			{
				label: 'USŁUGI'
			},
			{
				title: 'Lista usług',
				href: '/service_list',
				icon: listaUslug
			},
			{
				title: 'Szkolenia',
				href: '/trainings',
				icon: szkolenia
			},
			{
				label: 'FINANSE'
			},
			{
				title: 'Lista ORK',
				href: '/ork_list',
				icon: listaORK
			},
			{
				title: 'Zdefiniowane koszty usług',
				href: '/payments',
				icon: costs
			},
			{
				title: 'Raporty',
				href: '/reports',
				icon: raporty
			},
		],
		[
			{
				title: 'Kokpit',
				href: '/cockpit',
				icon: kokpit
			},
			{
				title: 'Kandydaci',
				href: '/candidates',
				icon: kandydaci
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
