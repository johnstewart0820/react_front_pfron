import React, { useState, useEffect } from 'react';
import useStyles from './style';
import { Alert } from 'components';
import {
	Button, Grid, Card, CircularProgress, Typography
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';


import { Breadcrumb, SingleSelect } from 'components';
import { DeleteModal } from '../Specialists/components';
import specialist from '../../apis/specialist';
import clsx from 'clsx';

const SpecialistsEdit = props => {
	const { history } = props;
	const id = props.match.params.id;
	const classes = useStyles();

	const breadcrumbs = [{ active: true, label: 'Specjaliści', href: '/specialists' }, { active: false, label: 'Edytuj specjalistę' }];
	const [name, setName] = useState('');
	const [qualification, setQualification] = useState(0);
	const [qualificationList, setQualificationList] = useState([]);
	const [specialty, setSpecialty] = useState(0);
	const [specialtyList, setSpecialtyList] = useState([]);
	const [hasAlert, setHasAlert] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [message, setMessage] = useState('');
	const [progressStatus, setProgressStatus] = useState(false);
	const [error, setError] = useState({});
	const [openModal, setOpenModal] = useState(false);

	useEffect(() => {
		specialist.getInfo()
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					setSpecialtyList(response.data.specialty);
					setQualificationList(response.data.qualification);
				}
			})
	}, []);

	useEffect(() => {
		specialist.get(id)
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					setName(response.data.specialist.name);
					setQualification(response.data.specialist.qualification_point);
					setSpecialty(response.data.specialist.specialty);
				}
			})
	}, [qualificationList]);

	const handleError = () => {
		let _error = {}
		_error.name = (name.length === 0);
		_error.qualification = (parseInt(qualification) === 0);
		_error.specialty = (parseInt(specialty) === 0);
		setError(_error);
	};

	const handleChangeName = (value) => {
		setName(value);
		let _error = JSON.parse(JSON.stringify(error));
		_error.name = (value.length === 0);
		setError(_error);
	}

	const handleChangeQualification = (value) => {
		setQualification(value);
		let _error = JSON.parse(JSON.stringify(error));
		_error.qualification = (parseInt(value) === 0);
		setError(_error);
	}

	const handleChangeSpecialty = (value) => {
		setSpecialty(value);
		let _error = JSON.parse(JSON.stringify(error));
		_error.specialty = (parseInt(value) === 0);
		setError(_error);
	}

	const checkError = () => {
		return name.length === 0 || parseInt(qualification) === 0 || parseInt(specialty) === 0;
	}

	const handleBack = () => {
		history.push('/specialists');
	}

	const handleSave = () => {


		if (checkError()) {
			setHasAlert(true);
			setMessage('Proszę wypełnić wszystkie wymagane pola.');
			setIsSuccess(false);
			handleError();
		} else {
			setProgressStatus(true);

			specialist.update(name, specialty, qualification, id)
				.then(response => {
					if (response.code === 401) {
						history.push('/login');
					} else {
						setHasAlert(true);
						setMessage(response.message);
						setIsSuccess(response.code === 200);
						if (response.code === 200) {
							setTimeout(function () { history.push('/specialists'); }, 1000);
						}
						setProgressStatus(false);
					}
				})
		}
	}

	const handleDelete = () => {

		setProgressStatus(true);
		specialist
			.delete(id)
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					setHasAlert(true);
					setMessage(response.message);
					setIsSuccess(response.code === 200);
					if (response.code === 200) {
						setTimeout(function () { history.push('/specialists'); }, 1000);
					}
					setProgressStatus(false);
				}
			})
	}

	const handleCloseModal = () => {
		setOpenModal(false);
	}

	return (
		<>
			<div className={classes.public}>
				<div className={classes.controlBlock}>
					<Breadcrumb list={breadcrumbs} />
					<Button variant="outlined" color="secondary" id="main" className={classes.btnBack} onClick={handleBack}>          Wróć do listy specjalistów
        </Button>
				</div>
				<Alert
					hasAlert={hasAlert}
					setHasAlert={setHasAlert}
					isSuccess={isSuccess}
					message={message}
				/>
				<Grid container spacing={3} className={classes.formBlock}>
					<Grid item md={9} xs={12}>
						<Card className={classes.form}>
							<Grid container spacing={3}>
								<Grid item md={3} xs={12}>
									<Typography variant="h2" className={classes.form_title}>
										Dane podstawowe
									</Typography>
              	</Grid>
								<Grid item md={9} xs={12}>
									<div className={classes.top_label} ><label htmlFor="name">Tytuł, imię i nazwisko specjalisty</label></div>
									<input className={clsx({ [classes.input_box]: true, [classes.error]: error.name })} id="name" type="name" value={name} name="name" onChange={(e) => handleChangeName(e.target.value)} />
									<div className={classes.input_box_label}><label htmlFor="qualification_point">Wybierz punkt kwalifikacyjny</label></div>
									<SingleSelect value={qualification} handleChange={(value) => handleChangeQualification(value)} list={qualificationList} error={error.qualification} id="qualification_point"/>
									<div className={classes.input_box_label}><label htmlFor="specialty">Specjalność</label></div>
									<SingleSelect value={specialty} handleChange={(value) => handleChangeSpecialty(value)} list={specialtyList} error={error.specialty} id="specialty"/>
								</Grid>
							</Grid>
						</Card>
					</Grid>
					<Grid item md={3} xs={12}>
						<Card className={classes.form}>
							<Grid container spacing={3}>
								<Grid item xs={6}>
									<Button variant="outlined" color="secondary" className={classes.btnSave} onClick={handleSave}>
										Zapisz
                </Button>
								</Grid>
								<Grid item xs={6}>
									<Button variant="outlined" color="secondary" className={classes.btnDelete} onClick={() => setOpenModal(true)} aria-label="usuń">
										<DeleteIcon />
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
			<DeleteModal
				openModal={openModal}
				handleClose={handleCloseModal}
				handleDelete={handleDelete}
				selectedIndex={id}
			/>
		</>
	);
};

export default SpecialistsEdit;
