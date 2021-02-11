import React, { useState, useEffect } from 'react';
import useStyles from './style';
import {
  Button, Grid, Card, TextField, CircularProgress, FormControl, RadioGroup, FormControlLabel, Radio
} from '@material-ui/core';
import { useToasts } from 'react-toast-notifications'
import { Autocomplete } from '@material-ui/lab';
import {
  KeyboardDatePicker, MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { Breadcrumb, SingleSelect, MultiSelect } from 'components';
import ork_team from '../../apis/ork-team';

const OrkTeamsAdd = props => {
  const { history } = props;
  const classes = useStyles();
  const { addToast } = useToasts()
  const breadcrumbs = [{ active: true, label: 'Uczestnicy', href: '/' }, { active: true, label: 'Zespół ORK', href: '/ork_teams' }, { active: false, label: 'Dodaj osobę' }];
  const [name, setName] = useState('');
  const [rehabitationCenter, setRehabitationCenter] = useState([]);
  const [rehabitationCenterList, setRehabitationCenterList] = useState([]);
  const [specialization, setSpecialization] = useState([]);
  const [specializationList, setSpecializationList] = useState([]);
  const [is_accepted, setIsAccepted] = useState(false);
  const [date_of_acceptance, setDateOfAcceptance] = useState(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + (new Date().getDate()));
  const [progressStatus, setProgressStatus] = useState(false);

  useEffect(() => {
    ork_team.getInfo()
      .then(response => {
        if (response.code === 401) {
          history.push('/login');
        } else {
          setRehabitationCenterList(response.data.rehabitation_centers);
          setSpecializationList(response.data.specializations);
        }
      })
  }, []);

  const handleBack = () => {
    history.push('/ork_teams');
  }

  const handleSave = () => {
    if (name.length === 0 || rehabitationCenter.length === 0 || specialization.length === 0) {
      addToast('Proszę wpisać wszystkie pola.', { appearance: 'error', autoDismissTimeout: 3000, autoDismiss: true })
    } else {
      setProgressStatus(true);
      let specialization_arr = [];
      let rehabitation_arr = [];
      specialization.map((item, index) => {
        specialization_arr.push(item.id);
      })
      rehabitationCenter.map((item, index) => {
        rehabitation_arr.push(item.id);
      })

      ork_team.create(name, rehabitation_arr, specialization_arr, is_accepted === "true" ? true : false, date_of_acceptance)
      .then(response => {
        if (response.code === 401) {
          history.push('/login');
        } else {
          addToast(response.message, { appearance: response.code === 200 ? 'success' : 'error', autoDismissTimeout: response.code === 200 ? 1000 : 3000, autoDismiss: true})
          if (response.code === 200) {
            setTimeout(function(){history.push('/ork_teams');}, 1000);
          }
          setProgressStatus(false);
        }
      })
    }
  }

  const handleChangeDate = (value) => {
    let _date = new Date(value);
    setDateOfAcceptance(_date.getFullYear() + '-' + (_date.getMonth() + 1) + '-' + (_date.getDate()));
  }

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
    <div className={classes.public}>
      <div className={classes.controlBlock}>
        <Breadcrumb list={breadcrumbs} />
        <Button variant="outlined" color="secondary" className={classes.btnBack} onClick={handleBack}>
          Wróć do listy osób w zespołach
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
                <div className={classes.top_label} htmlFor="name">Tytuł, imię i nazwisko osoby w zespole</div>
                <input className={classes.input_box} type="name" value={name} name="name" onChange={(e) => setName(e.target.value)} />
                <div className={classes.input_box_label} htmlFor="type">Wybierz ORK</div>
                <Autocomplete
                  multiple
                  className={classes.name_select_box}
                  onChange={(event, value) => setRehabitationCenter(value ? value : [])}
                  options={rehabitationCenterList}
                  getOptionLabel={(option) => rehabitationCenterList && option && option.name}
                  renderInput={(params) => <TextField {...params} variant="outlined" InputLabelProps={{ shrink: false }} />}
                />
                <div className={classes.input_box_label} htmlFor="specialization">Specjallizacja</div>
                <Autocomplete
                  multiple
                  className={classes.name_select_box}
                  onChange={(event, value) => setSpecialization(value ? value : [])}
                  options={specializationList}
                  getOptionLabel={(option) => specializationList && option && option.name + '(' + option.module_type + ')'}
                  renderInput={(params) => <TextField {...params} variant="outlined" InputLabelProps={{ shrink: false }} />}
                />
                <div className={classes.input_box_label}>Zaakceptowany</div>
                <FormControl component="fieldset">
                  <RadioGroup aria-label="is_accepted" name="is_accepted" value={is_accepted} onChange={(e) => setIsAccepted(e.target.value)} row>
                    <FormControlLabel value="true" control={<Radio />} label="TAK" />
                    <FormControlLabel value="false" control={<Radio />} label="NIE" />
                  </RadioGroup>
                </FormControl>
                <div className={classes.input_box_label}>Data akceptacji</div>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="dd.MM.yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  value={date_of_acceptance}
                  onChange={(e) => handleChangeDate(e)}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
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
        <CircularProgress className={classes.progress}/>
      </div>
      </>
      :
      <></>
    }
    </MuiPickersUtilsProvider>
  );
};

export default OrkTeamsAdd;
