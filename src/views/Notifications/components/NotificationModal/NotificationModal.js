import React, { useEffect, useState } from 'react';
import {
	Modal,
	Backdrop,
	Fade,
	Grid,
	Card,
	Button,
	Typography
} from '@material-ui/core';
import { withRouter, useHistory } from 'react-router-dom';
import useStyles from './style';
import { Alert } from 'components';

const NotificationModal = (props) => {
	const { openModal, handleClose, notification } = props;
	const classes = useStyles();
	const history = useHistory();

	useEffect(() => {
	}, []);

	const handleClick = () => {
		if (notification.id_service) {
			history.push(`/service_list/edit/${notification.id_service}`);
		} else if (notification.id_candidate) {
			history.push(`/participants/profile/${notification.id_candidate}`);
		}
	}

	return (
		<Modal
			aria-labelledby="transition-modal-title"
			aria-describedby="transition-modal-description"
			className={classes.modal}
			open={openModal}
			onClose={handleClose}
			closeAfterTransition
			BackdropComponent={Backdrop}
			BackdropProps={{
				timeout: 500,
			}}
		>
			<Fade in={openModal}>
				<Card className={classes.paper}>
					<Grid container spacing={3} justify="center">
						<div className={classes.title}>
							<Typography variant="h2" className={classes.form_title}>
								{notification.title}
							</Typography>
						</div>
						<div className={classes.description}>
							<Typography variant="h2" className={classes.form_title}>
								{notification.description}
							</Typography>
						</div>
						<Grid item xs={12}>
							<Grid container justify="space-around">
								<div className={classes.relation} onClick={handleClick}>
									{notification.id_candidate ? 'Zobacz profil uczestnika' : 'Zobacz usługę'}
								</div>
								<Button variant="contained" color="secondary" className={classes.btnClose} onClick={() => { handleClose(); }}>
									OK
								</Button>
							</Grid>
						</Grid>
					</Grid>
				</Card>
			</Fade>
		</Modal>
	);
};

export default withRouter(NotificationModal);
