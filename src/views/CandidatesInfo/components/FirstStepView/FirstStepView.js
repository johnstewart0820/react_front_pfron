import React, { useEffect, useState } from 'react';
import {
  Grid, FormControl,FormControlLabel, Radio, RadioGroup, FormLabel, Typography
} from '@material-ui/core';
import { SingleSelect} from 'components';
import { withRouter } from 'react-router-dom';
import useStyles from './style';
import { Alert } from 'components';

const FirstStepView = (props) => {
  const classes = useStyles();
  const { name, surname, person_id, 
    qualification_point, setQualificationPoint, qualificationPointList,
    gender, setGender, stage, history } = props;
  
  return (
    <Grid container spacing={3} className={classes.form}>
      <Grid item md={3} xs={12}>
				<Typography variant="h2" className={classes.form_title}>
        	Dane kandydata
				</Typography>
      </Grid>
      <Grid item md={6} xs={12}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <div className={classes.top_label}>Imię(Imiona)</div>
          </Grid>
          <Grid item xs={6}>
            <div className={classes.top_label_content}>{name}</div>
          </Grid>
          <Grid item xs={6}>
            <div className={classes.top_label}>Nazwisko</div>
          </Grid>
          <Grid item xs={6}>
            <div className={classes.top_label_content}>{surname}</div>
          </Grid>
          <Grid item xs={6}>
            <div className={classes.top_label}>PESEL</div>
          </Grid>
          <Grid item xs={6}>
            <div className={classes.top_label_content}>{person_id}</div>
          </Grid>
          <Grid item xs={12}>
            <FormControl component="fieldset" disabled={stage != 1}>
              <FormLabel>Płeć</FormLabel>
              <RadioGroup aria-label="Płeć" name="education" value={gender} onChange={(e) => setGender(parseInt(e.target.value))} row>
                <FormControlLabel value={1} control={<Radio />} label='kobieta' />
                <FormControlLabel value={2} control={<Radio />} label='mężczyzna' />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <div className={classes.label_content}><label htmlFor="qualification_point">Punkt kwalifikacyjny</label></div>
            <SingleSelect value={qualification_point} handleChange={setQualificationPoint} list={qualificationPointList} id="qualification_point" disabled={stage != 1}/>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default withRouter(FirstStepView);
