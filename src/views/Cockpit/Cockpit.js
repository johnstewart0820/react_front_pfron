import React, { useState, useEffect } from 'react';
import useStyles from './style';
import { Alert } from 'components';
import {
	Button, Grid, Card, CircularProgress, IconButton
} from '@material-ui/core';


import { Breadcrumb } from 'components';
import { DeleteModal } from './components';

import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import FindInPageOutlinedIcon from '@material-ui/icons/FindInPageOutlined';

import dashboard from '../../apis/dashboard';

const Cockpit = props => {
	const { history } = props;
	const classes = useStyles();
	const breadcrumbs = [{ active: false, label: 'Kokpit' }];

	const [candidateList, setCandidateList] = useState([]);
	const [participantList, setParticipantList] = useState([]);
	const [openModal, setOpenModal] = useState(false);
	const [selectedItem, setSelectedItem] = useState(-1);

		const [hasAlert, setHasAlert] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [message, setMessage] = useState('');
        const [progressStatus, setProgressStatus] = useState(false);

	useEffect(() => {
		getList();
	}, []);

	const getList = () => {
		dashboard.getList()
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					setCandidateList(response.data.candidates);
					setParticipantList(response.data.participants);
				}
			})
	}

	const handleSelectedItem = (id) => {
		setSelectedItem(id);
		setOpenModal(true);
	}

	const handleView = (id) => {

	}

	const handleCloseModal = () => {
		setOpenModal(false);
	}

	const checkAmbassador = () => {
		let role = localStorage.getItem('role');
		return role === '3';
	}

	const handleDelete = () => {
		setProgressStatus(true);
		dashboard
			.delete(selectedItem)
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					if (response.code === 200) {
						setHasAlert(true);
						setMessage(response.message);
						setIsSuccess(response.code === 200);
						getList();
					}
					setProgressStatus(false);
				}
			})
	}

	return (
		<>
			<div className={classes.public}>
				<div className={classes.controlBlock}>
					<Breadcrumb list={breadcrumbs} />
				</div>
				<Alert 
					hasAlert={hasAlert}
					setHasAlert={setHasAlert}
					isSuccess={isSuccess}
					message={message}
				/>
				<Grid container spacing={3} className={classes.formBlock}>
					<Grid item xs={12}>
						<Card className={classes.form}>
							<Grid container spacing={3}>
								<Grid item md={2} sm={1} xs={0} className={classes.margin_block}></Grid>
								<Grid item md={8} sm={10} xs={12}>
									<Grid container spacing={3}>
										<Grid item md={1} sm={0} xs={0} className={classes.title_block}></Grid>
										<Grid item md={10} sm={12} xs={12}>
											<div className={classes.title}>
												Wypracowanie i pilotażowe wdrożenie modelu kompleksowej rehabilitacji umożliwiającej podjęcie lub powrót do pracy
											</div>
										</Grid>
										<Grid item md={1} sm={0} xs={0} className={classes.title_block}></Grid>
									</Grid>
									<Grid container spacing={3}>
										<Grid item md={checkAmbassador() ? 12 : 6} xs={12}>
											<Button variant="outlined" aria-label="Pokaż listę kandydatów" color="secondary" id="main" className={classes.btnFull} onClick={() => history.push(`/candidates`)}>
												Kandydaci
											</Button>
										</Grid>
										{
											!checkAmbassador() ?
												<>
												<Grid item md={6} xs={12}>
													<Button variant="outlined" aria-label="Pokaż listę uczestników" color="secondary" className={classes.btnFull} onClick={() => history.push(`/participants`)}>
														Uczestnicy
													</Button>
												</Grid>
												<Grid item md={6} xs={12}>
													<Button variant="outlined" color="secondary" aria-label="Pokaż ośrodki rehabilitacyjne" className={classes.btnFull} onClick={() => history.push(`/ork_list`)}>
														Ośrodki
													</Button>
												</Grid>
												<Grid item md={6} xs={12}>
													<Button variant="outlined" color="secondary" aria-label="Pokaż finanse" className={classes.btnFull} onClick={() => history.push('/payments')}>
														Finanse
													</Button>
												</Grid>
												</>
												:
												<></>
										}
									</Grid>
								</Grid>
								<Grid md={2} sm={1} xs={0} className={classes.margin_block}></Grid>
							</Grid>
						</Card>
					</Grid>
					<Grid item md={checkAmbassador() ? 12 : 5} xs={12}>
						<Card className={classes.table}>
							<div className={classes.table_header}>
								Ostatnio dodani kandydaci
							</div>
							<div className={classes.table_content}>
								<div className={classes.table_body}>
									{
										candidateList.map((item, index) => (
											<Grid container spacing={0} className={classes.table_item}>
												<Grid item xs={6}>
													{item.name + ' ' + item.surname}
												</Grid>
												<Grid item xs={6}>
													<Grid container justify="flex-end">
														<IconButton aria-label={`Edytuj kandydata ${item.name + ' ' + item.surname}`} component="span" className={classes.iconButton} onClick={() => history.push(`/candidates/edit/${item.id}`)}>
															<EditOutlinedIcon className={classes.icon} />
														</IconButton>
														<IconButton aria-label={`Pokaż profil kandydata ${item.name + ' ' + item.surname}`} variant="outlined" component="span" className={classes.iconButton} onClick={() => history.push(`/candidates/profile/${item.id}`)}>
															<FindInPageOutlinedIcon className={classes.icon} />
														</IconButton>
														<IconButton aria-label={`Usuń kandydata ${item.name + ' ' + item.surname}`} variant="outlined" component="span" className={classes.iconButton} onClick={() => handleSelectedItem(item.id)}>
															<DeleteOutlineOutlinedIcon className={classes.icon} />
														</IconButton>
													</Grid>
												</Grid>
											</Grid>
										))
									}
								</div>
								<div className={classes.table_footer}>
									<Button variant="outlined" aria-label="Pokaż listę kandydatów" color="secondary" className={classes.btnOutline} onClick={() => history.push(`/candidates`)}>
										Zobacz wszystkich
							</Button>
								</div>
							</div>
						</Card>
					</Grid>
					{
						!checkAmbassador() ?
						<Grid item md={7} xs={12}>
						<Card className={classes.table}>
							<div className={classes.table_header}>
								Ostatnio zakwalifikowani uczestnicy
							</div>
							<div className={classes.table_content}>
								<div className={classes.table_body}>
									{
										participantList.map((item, index) => (
											<Grid container spacing={0} className={classes.table_item}>
												<Grid item xs={4}>
													{item.name + ' ' + item.surname}
												</Grid>
												<Grid item xs={4}>
													{item.rehabitation_center_name}
												</Grid>
												<Grid item xs={4}>
													<Grid container justify="flex-end">
														<IconButton aria-label={`Edytuj uczestnik ${item.name + ' ' + item.surname}`} component="span" className={classes.iconButton} onClick={() => history.push(`/participants/edit/${item.id_candidate}`)}>
															<EditOutlinedIcon className={classes.icon} />
														</IconButton>
														<IconButton variant="outlined" aria-label={`Pokaż profil uczestnik ${item.name + ' ' + item.surname}`} component="span" className={classes.iconButton} onClick={() => history.push(`/participants/profile/${item.id_candidate}`)}>
															<FindInPageOutlinedIcon className={classes.icon} />
														</IconButton>
														<IconButton variant="outlined" aria-label={`Usuń uczestnik ${item.name + ' ' + item.surname}`} component="span" className={classes.iconButton} onClick={() => handleSelectedItem(item.id_candidate)}>
															<DeleteOutlineOutlinedIcon className={classes.icon} />
														</IconButton>
													</Grid>
												</Grid>
											</Grid>
										))
									}
								</div>
								<div className={classes.table_footer}>
									<Button variant="outlined" aria-label="Pokaż listę uczestników" color="secondary" className={classes.btnOutline} onClick={() => history.push(`/participants`)}>
										Zobacz wszystkich
							</Button>
								</div>
							</div>
						</Card>
					</Grid>
					:
					<></>
					}
					
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
			<DeleteModal
				openModal={openModal}
				handleClose={handleCloseModal}
				handleDelete={handleDelete}
				selectedIndex={selectedItem}
			/>
		</>
	);
};

export default Cockpit;
