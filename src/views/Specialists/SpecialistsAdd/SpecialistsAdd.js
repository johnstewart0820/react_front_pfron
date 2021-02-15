import React, { useState, useEffect } from 'react';
import useStyles from './style';
import {
  Button, Grid, Card, TextField, CircularProgress
} from '@material-ui/core';
import { useToasts } from 'react-toast-notifications'
import { Autocomplete } from '@material-ui/lab';

import { Breadcrumb, SingleSelect, MultiSelect } from 'components';
import specialist from '../../apis/specialist';

const SpecialistsAdd = props => {
  const { children } = props;
  const { history } = props;
  const classes = useStyles();
  const { addToast } = useToasts()
  const breadcrumbs = [{ active: true, label: 'Specjaliści', href: '/specialists' }, { active: false, label: 'Dodaj specjalistę' }];
  const [name, setName] = useState('');
  const [qualification, setQualification] = useState(0);
  const [qualificationList, setQualificationList] = useState([]);
  const [specialty, setSpecialty] = useState(0);
  const [specialtyList, setSpecialtyList] = useState([]);
  const [progressStatus, setProgressStatus] = useState(false);

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

  const handleBack = () => {
    history.push('/specialists');
  }

  const handleSave = () => {
    if (name.length === 0 || parseInt(specialty) === 0 || parseInt(qualification) === 0) {
      addToast('Proszę wypełnić wszystkie wymagane pola.', { appearance: 'error', autoDismissTimeout: 3000, autoDismiss: true })
    } else {
      setProgressStatus(true);

      specialist.create(name, specialty, qualification)
      .then(response => {
        if (response.code === 401) {
          history.push('/login');
        } else {
          addToast(response.message, { appearance: response.code === 200 ? 'success' : 'error', autoDismissTimeout: response.code === 200 ? 1000 : 3000, autoDismiss: true})
          if (response.code === 200) {
            setTimeout(function(){history.push('/specialists');}, 1000);
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
          Wróć do listy specjalistów
        </Button>
      </div>
      <Grid container spacing={3} className={classes.formBlock}>
        <Grid item xs={9}>
          <Card className={classes.form}>
            <Grid container spacing={3}>
              <Grid item xs={3} className={classes.form_title}>
                Dane podstawowe
              </Grid>
              <Grid item xs={9}>
                <div className={classes.top_label} htmlFor="name">Tytuł, imię, i nazwisko specjalisty</div>
                <input className={classes.input_box} type="name" value={name} name="name" onChange={(e) => setName(e.target.value)} />
                <div className={classes.input_box_label} htmlFor="type">Wybierz punkt kwalifikacyjny</div>
                <SingleSelect value={qualification} handleChange={setQualification} list={qualificationList} />
                <div className={classes.input_box_label} htmlFor="ambassador">Specjalność</div>
                <SingleSelect value={specialty} handleChange={setSpecialty} list={specialtyList} />
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
        <CircularProgress className={classes.progress}/>
      </div>
      </>
      :
      <></>
    }
    </>
  );
};

export default SpecialistsAdd;
