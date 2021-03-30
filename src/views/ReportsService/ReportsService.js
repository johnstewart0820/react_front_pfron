import React, { useState, useEffect } from 'react';
import useStyles from './style';
import {
  Button, Grid, Card, CircularProgress, TextField
} from '@material-ui/core';
import { useToasts } from 'react-toast-notifications'

import { Breadcrumb, SingleSelect } from 'components';
import report from '../../apis/report';
import { Autocomplete } from '@material-ui/lab';
import clsx from 'clsx';

const ReportsService = props => {
  const { history } = props;
  const classes = useStyles();
  const { addToast, removeAllToasts } = useToasts()
  const breadcrumbs = [{ active: true, label: 'Finanse', href: '/reports_service' }, { active: true, label: 'Raporty', href: '#' }, {active: false, label: 'Zestawienie zrealizowanych usług'}];
  const [name, setName] = useState('');
  const [rehabitationCenter, setRehabitationCenter] = useState(0);
  const [rehabitationCenterList, setRehabitationCenterList] = useState([]);
	const [participant, setParticipant] = useState(0);
	const [participantList, setParticipantList] = useState([]);
  const [progressStatus, setProgressStatus] = useState(false);
  const [error, setError] = useState({});

  useEffect(() => {
    report.getServiceInfo()
      .then(response => {
        if (response.code === 401) {
          history.push('/login');
        } else {
          setParticipantList(response.data.participant);
          setRehabitationCenterList(response.data.rehabitation_center);
        }
      })
  }, []);

  const handleError = () => {
    let _error = {}
    _error.rehabitation_center = (parseInt(rehabitationCenter) === 0);
    _error.participant = (parseInt(participant) === 0);
    setError(_error);
  };

  const handleChangeName = (value) => {
    setName(value);
  }

  const handleChangeRehabitationCenter = (value) => {
    setRehabitationCenter(value);
    let _error = JSON.parse(JSON.stringify(error));
    _error.rehabitation_center = (parseInt(value) === 0);
    setError(_error);
  }

	const handleChangeParticipant = (value) => {
		setParticipant(value);
	}

  const checkError = () => {
    return parseInt(rehabitationCenter) === 0 || parseInt(participant) === 0;
  }

  const handleGenerate = () => {
    if (checkError()) {
      addToast(<label>Proszę wypełnić wszystkie wymagane pola.</label>, { appearance: 'error', autoDismissTimeout: 3000, autoDismiss: false })
      handleError();
    } else {
      setProgressStatus(true);
    }
  }

  return (
    <>
    <div className={classes.public}>
      <div className={classes.controlBlock}>
        <Breadcrumb list={breadcrumbs} />
      </div>
      <Grid container spacing={3} className={classes.formBlock}>
        <Grid item md={9} xs={12}>
          <Card className={classes.form}>
            <Grid container spacing={3}>
              <Grid item md={3} xs={12} className={classes.form_title}>
                Zdefiniuj dane raportu
              </Grid>
              <Grid item md={9} xs={12}>
                <div className={classes.top_label} ><label htmlFor="name">Nazwa raportu</label></div>
                <input className={classes.input_box} id="name" type="name" value={name} name="name" onChange={(e) => handleChangeName(e.target.value)} />
              </Grid>
            </Grid>
						<div className={classes.divide} />
						<Grid container spacing={3}>
              <Grid item md={3} xs={12} className={classes.form_title}>
                Okres
              </Grid>
							<Grid item md={9} xs={12}>
								<Grid container spacing={2}>
									<Grid item md={5} xs={12}>
										<div className={classes.top_label} ><label htmlFor="rehabilitation_centers">Wybierz ORK</label></div>
										<SingleSelect value={rehabitationCenter} handleChange={(value) => handleChangeRehabitationCenter(value)} list={rehabitationCenterList} error={error.rehabitation_center}/>
									</Grid>
									<Grid item md={2} xs={12} className={classes.center}>
										lub
									</Grid>
									<Grid item md={5} xs={12}>
										<div className={classes.top_label} ><label htmlFor="participants">Wybierz uczestnika</label></div>
										<Autocomplete
											className={classes.name_select_box}
											id="number"
											onChange={(event, value) => handleChangeParticipant(value)}
											value={participant}
											options={participantList}
											getOptionLabel={(option) => participantList && option && option.name}
											renderInput={(params) => <TextField {...params} variant="outlined" InputLabelProps={{ shrink: false }} />}
										/>
									</Grid>
									<Grid item md={5} xs={12}>
										<div className={classes.top_label} ><label htmlFor="participants">Wybierz uczestnika</label></div>
										<Autocomplete
											className={classes.name_select_box}
											id="number"
											onChange={(event, value) => handleChangeParticipant(value)}
											value={participant}
											options={participantList}
											getOptionLabel={(option) => participantList && option && option.name}
											renderInput={(params) => <TextField {...params} variant="outlined" InputLabelProps={{ shrink: false }} />}
										/>
									</Grid>
								</Grid>
							</Grid>
            </Grid>
          </Card>
        </Grid>
        <Grid item md={3} xs={12}>
          <Card className={classes.form}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Button variant="outlined" color="secondary" className={classes.btnSave} onClick={handleGenerate}>
                  Generuj raport
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
        <CircularProgress className={classes.progress}/>
      </div>
      </>
      :
      <></>
    }
    </>
  );
};

export default ReportsService;
