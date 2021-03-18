import React, { useEffect, useState } from 'react';
import {
  Grid, FormControl,FormControlLabel, Radio, RadioGroup, FormLabel
} from '@material-ui/core';
import { SingleSelect} from 'components';
import { withRouter } from 'react-router-dom';
import useStyles from './style';
import {
  KeyboardDatePicker, MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { pl } from 'date-fns/locale';
import DateFnsUtils from '@date-io/date-fns';
import ReactQuill, {Quill} from 'react-quill'
import 'react-quill/dist/quill.snow.css';

const SecondStepView = (props) => {
  const classes = useStyles();
  const { 
    admission,
    setAdmission,
    doctor_recommendation,
    setDoctorRecommendation,
    doctor_date,
    setDoctorDate,
    doctor,
    setDoctor,
    doctor_remark,
    setDoctorRemark,
    psycology_recommendation,
    setPsycologyRecommendation,
    psycology_date,
    setPsycologyDate,
    psycology,
    setPsycology,
    psycology_remark,
    setPsycologyRemark, 
    doctorList,
    psycologyList,
    history } = props;
  
    const handleDate = (value) => {
      let _date = new Date(value);
      return _date.getFullYear() + '-' + (_date.getMonth() + 1) + '-' + _date.getDate();
    }

  return (
	<MuiPickersUtilsProvider utils={DateFnsUtils} locale={pl}>
    <Grid container spacing={3} className={classes.form}>
      <Grid item xs={3} className={classes.form_title}>
        Dane kandydata
      </Grid>
      <Grid item xs={9}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel>Dopuszczenie do kwalifikacji</FormLabel>
              <RadioGroup aria-label="admission" name="admission" value={admission} onChange={(e) => setAdmission(parseInt(e.target.value))} row>
                <FormControlLabel value={1} control={<Radio />} label='TAK' />
                <FormControlLabel value={2} control={<Radio />} label='NIE' />
              </RadioGroup>
            </FormControl>
          </Grid>
          {
            admission === 1 ?
            <>
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <FormLabel>Rekomendacja lekarza</FormLabel>
                  <RadioGroup aria-label="gender" name="education" value={doctor_recommendation} onChange={(e) => setDoctorRecommendation(parseInt(e.target.value))} row>
                    <FormControlLabel value={1} control={<Radio />} label='TAK' />
                    <FormControlLabel value={2} control={<Radio />} label='NIE' />
                    <FormControlLabel value={3} control={<Radio />} label='NIE MOŻNA STWIERDZIĆ' />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <div className={classes.label_content}>Orzeczenie o kwalifikacji z dnia</div>
                <KeyboardDatePicker
                  disableToolbar
                  className={classes.date_picker}
                  variant="inline"
                  format="dd.MM.yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  value={doctor_date}
                  onChange={(value) => setDoctorDate(handleDate(value))}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <div className={classes.label_content} htmlFor="name">Imię i nazwisko lekarza</div>
                <SingleSelect value={doctor} handleChange={setDoctor} list={doctorList}/>
              </Grid>
              <Grid item xs={12}>
                <div className={classes.label_content}>Uwagi od lekarza</div>
                <ReactQuill 
                  onChange={setDoctorRemark}
                  value={doctor_remark}
                  className={classes.qlClass}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <FormLabel>Rekomendacja psychologa</FormLabel>
                  <RadioGroup aria-label="gender" name="education" value={psycology_recommendation} onChange={(e) => setPsycologyRecommendation(parseInt(e.target.value))} row>
                    <FormControlLabel value={1} control={<Radio />} label='TAK' />
                    <FormControlLabel value={2} control={<Radio />} label='NIE' />
                    <FormControlLabel value={3} control={<Radio />} label='NIE MOŻNA STWIERDZIĆ' />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <div className={classes.label_content}>Orzeczenie o kwalifikacji z dnia</div>
                <KeyboardDatePicker
                  disableToolbar
                  className={classes.date_picker}
                  variant="inline"
                  format="dd.MM.yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  value={psycology_date}
                  onChange={(value) => setPsycologyDate(handleDate(value))}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <div className={classes.label_content} htmlFor="name">Imię i nazwisko psychologa</div>
                <SingleSelect value={psycology} handleChange={setPsycology} list={psycologyList}/>
              </Grid>
              <Grid item xs={12}>
                <div className={classes.label_content}>Uwagi od psychologa</div>
                <ReactQuill 
                  onChange={setPsycologyRemark}
                  value={psycology_remark}
                  className={classes.qlClass}
                />
              </Grid>
            </>
            :
            <></>
          }
          
          
        </Grid>
      </Grid>
    </Grid>
	</MuiPickersUtilsProvider>
  );
};

export default withRouter(SecondStepView);
