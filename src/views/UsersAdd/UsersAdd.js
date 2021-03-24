import React, { useState, useEffect } from 'react';
import useStyles from './style';
import {
	Button, Grid, Card, TextField, CircularProgress, FormControlLabel, Checkbox
} from '@material-ui/core';
import { useToasts } from 'react-toast-notifications'

import { Breadcrumb, SingleSelect, MultiSelect } from 'components';
import users from '../../apis/users';
import { Autocomplete } from '@material-ui/lab';

const UsersAdd = props => {
	const { children } = props;
	const { history } = props;
	const classes = useStyles();
	const { addToast } = useToasts()
	const breadcrumbs = [{ active: true, href: '/', label: 'Ustawienia systemowe' }, { active: true, href: '/users', label: 'Użytkownicy systemu' }, { active: false, label: 'Dodawanie użytkownika' }];
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [role, setRole] = useState([]);
	const [roleList, setRoleList] = useState([]);
	const [activateStatus, setActivateStatus] = useState(false);
	const [progressStatus, setProgressStatus] = useState(false);

	useEffect(() => {
		users.getInfo()
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					setRoleList(response.data.role);
				}
			})
	}, []);

	const handleBack = () => {
		history.push('/users');
	}

	const handleSave = () => {
		if (name.length === 0 || email.length === 0 || role.length === 0) {
			addToast(<label>Proszę wypełnić wszystkie wymagane pola.</label>, { appearance: 'error', autoDismissTimeout: 3000, autoDismiss: true })
		} else {
			setProgressStatus(true);
			let role_arr = [];
			role.map((item, index) => {
				role_arr.push(item.id);
			})

			users.create(name, email, role_arr, activateStatus)
				.then(response => {
					if (response.code === 401) {
						history.push('/login');
					} else {
						addToast(<label>{response.message}</label>, { appearance: response.code === 200 ? 'success' : 'error', autoDismissTimeout: response.code === 200 ? 1000 : 3000, autoDismiss: true })
						if (response.code === 200) {
							setTimeout(function () { history.push('/users'); }, 1000);
						}
						setProgressStatus(false);
					}
				})
		}
	}

	return (
		<>
			<div className={classes.public}>
				<div className={classes.controlBlock}>
					<Breadcrumb list={breadcrumbs} />
					<Button variant="outlined" color="secondary" className={classes.btnBack} onClick={handleBack}>
						Wróć do listy uźytkowników
        </Button>
				</div>
				<Grid container spacing={3} className={classes.formBlock}>
					<Grid item xs={9}>
						<Card className={classes.form}>
							<Grid container spacing={3}>
								<Grid item xs={3} className={classes.form_title}>
									Uźytkownik
              </Grid>
								<Grid item xs={9}>
									<div className={classes.top_label}><label htmlFor="name">Nazwa użytkownika</label></div>
									<input className={classes.input_box} id="name" type="name" value={name} name="name" onChange={(e) => setName(e.target.value)} />
									<div className={classes.input_box_label} htmlFor="type"><label htmlFor="email">E-mail</label></div>
									<input className={classes.input_box} type="name" value={email} id="email" name="name" onChange={(e) => setEmail(e.target.value)} />
									<div className={classes.input_box_label}><label htmlFor="role">Rola</label></div>
									<Autocomplete
										multiple
										id="role"
										className={classes.name_select_box}
										onChange={(event, value) => setRole(value ? value : [])}
										value={role}
										options={roleList}
										getOptionLabel={(option) => roleList && option && option.name}
										renderInput={(params) => <TextField {...params} variant="outlined" InputLabelProps={{ shrink: false }} />}
									/>
									<FormControlLabel
										className={classes.rememberMe}
										control={
											<Checkbox
												onChange={() => setActivateStatus(!activateStatus)}
											/>
										}
										label="Aktywny"
									/>
								</Grid>
							</Grid>
						</Card>
					</Grid>
					<Grid item xs={3}>
						<Card className={classes.form}>
							<Grid container spacing={3}>
								<Grid item xs={12}>
									<Button variant="outlined" color="secondary" className={classes.btnSave} onClick={handleSave}>
										Zapisz
                </Button>
								</Grid>
							</Grid>
						</Card>
					</Grid>
				</Grid>
			</div>
			{
				progressStatus ?
					<>
						<div className={classes.progressContainer}>
							<CircularProgress className={classes.progress} />
						</div>
					</>
					:
					<></>
			}
		</>
	);
};

export default UsersAdd;
