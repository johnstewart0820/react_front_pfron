import React, { useEffect, useState } from 'react';
import {
  Grid, FormControl,FormControlLabel, Radio, RadioGroup, FormLabel, Typography
} from '@material-ui/core';
import { SingleSelect} from 'components';
import { withRouter } from 'react-router-dom';
import useStyles from './style';
import { Alert } from 'components';
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
		stage,
    history } = props;
  
    const handleDate = (value) => {
      let _date = new Date(value);
      return _date.getFullYear() + '-' + (_date.getMonth() + 1) + '-' + _date.getDate();
    }

  return (
	<MuiPickersUtilsProvider utils={DateFnsUtils} locale={pl}>
    <Grid container spacing={3} className={classes.form}>
      <Grid item md={3} xs={12}>
				<Typography variant="h2" className={classes.form_title}>
					Dane kandydata
				</Typography>
      </Grid>
      <Grid item md={9} xs={12}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl component="fieldset" disabled={stage != 2}>
              <FormLabel>Dopuszczenie do kwalifikacji</FormLabel>
              <RadioGroup aria-label="admission" name="admission" value={admission} onChange={(e) => setAdmission(parseInt(e.target.value))} row>
                <FormControlLabel value={1} control={<Radio />} label='TAK' />
                <FormControlLabel value={2} control={<Radio />} label='NIE' />
              </RadioGroup>
            </FormControl>
          </Grid>
					<>
						<Grid item xs={12}>
							<FormControl component="fieldset" disabled={stage != 2}>
								<FormLabel>Rekomendacja lekarza</FormLabel>
								<RadioGroup aria-label="Rekomendacja lekarza" name="education" value={doctor_recommendation} onChange={(e) => setDoctorRecommendation(parseInt(e.target.value))} row>
									<FormControlLabel value={1} control={<Radio />} label='TAK' />
									<FormControlLabel value={2} control={<Radio />} label='NIE' />
									<FormControlLabel value={3} control={<Radio />} label='NIE MOŻNA STWIERDZIĆ' />
								</RadioGroup>
							</FormControl>
						</Grid>
						<Grid item xs={12}>
							<div className={classes.label_content}><label htmlFor="doctor_date">Orzeczenie o kwalifikacji z dnia</label></div>
							<KeyboardDatePicker
								disableToolbar
								className={classes.date_picker}
								variant="inline"
								format="dd.MM.yyyy"
								aria-label="Orzeczenie o kwalifikacji z dnia - Format wprowadzania daty DD.MM.RRRR"
								margin="normal"
								id="doctor_date"
								value={doctor_date}
								onChange={(value) => setDoctorDate(handleDate(value))}
								KeyboardButtonProps={{
									'aria-label': 'Zmień datę',
								}}
								disabled={stage != 2}
							/>
						</Grid>
						
						<Grid item xs={12}>
							<div className={classes.label_content}><label htmlFor="doctor">Imię i nazwisko lekarza</label></div>
							<SingleSelect value={doctor} handleChange={setDoctor} list={doctorList} id="doctor" disabled={stage != 2}/>
						</Grid>
						<Grid item xs={12}>
							<div className={classes.label_content}><label htmlFor="doctor_remark">Uwagi od lekarza</label></div>
							<textArea
								id="doctor_remark"
								rows={6}
								onChange={setDoctorRemark}
								value={doctor_remark}
								className={classes.qlClass}
								disabled={stage != 2}
							/>
						</Grid>

						<Grid item xs={12}>
							<FormControl component="fieldset" disabled={stage != 2}>
								<FormLabel>Rekomendacja psychologa</FormLabel>
								<RadioGroup aria-label="Rekomendacja psychologa" name="education" value={psycology_recommendation} onChange={(e) => setPsycologyRecommendation(parseInt(e.target.value))} row>
									<FormControlLabel value={1} control={<Radio />} label='TAK' />
									<FormControlLabel value={2} control={<Radio />} label='NIE' />
									<FormControlLabel value={3} control={<Radio />} label='NIE MOŻNA STWIERDZIĆ' />
								</RadioGroup>
							</FormControl>
						</Grid>
						<Grid item xs={12}>
							<div className={classes.label_content}><label htmlFor="psycology_date">Orzeczenie o kwalifikacji z dnia</label></div>
							<KeyboardDatePicker
								disableToolbar
								className={classes.date_picker}
								variant="inline"
								format="dd.MM.yyyy"
								aria-label="Orzeczenie o kwalifikacji z dnia - Format wprowadzania daty DD.MM.RRRR"
								margin="normal"
								id="psycology_date"
								value={psycology_date}
								onChange={(value) => setPsycologyDate(handleDate(value))}
								KeyboardButtonProps={{
									'aria-label': 'Zmień datę',
								}}
								disabled={stage != 2}
							/>
						</Grid>
						
						<Grid item xs={12}>
							<div className={classes.label_content}><label htmlFor="psycology">Imię i nazwisko psychologa</label></div>
							<SingleSelect value={psycology} handleChange={setPsycology} list={psycologyList} id="psycology" disabled={stage != 2}/>
						</Grid>
						<Grid item xs={12}>
							<div className={classes.label_content}><label htmlFor="psycology_remark">Uwagi od psychologa</label></div>
							<textArea
								id="psycology_remark"
								rows={6}
								onChange={setPsycologyRemark}
								value={psycology_remark}
								className={classes.qlClass}
								disabled={stage != 2}
							/>
						</Grid>
					</>
        </Grid>
      </Grid>
    </Grid>
	</MuiPickersUtilsProvider>
  );
};

export default withRouter(SecondStepView);
