import React, { useEffect, useState } from 'react';
import {
  Grid, FormControl,FormControlLabel, Radio, RadioGroup, FormLabel
} from '@material-ui/core';
import { SingleSelect} from 'components';
import { withRouter } from 'react-router-dom';
import useStyles from './style';

const FirstStepView = (props) => {
  const classes = useStyles();
  const { name, surname, person_id, 
    qualification_point, setQualificationPoint, qualificationPointList,
    gender, setGender, history } = props;
  
  return (
    <Grid container spacing={3} className={classes.form}>
      <Grid item xs={3} className={classes.form_title}>
        Dane kandydata
      </Grid>
      <Grid item xs={6}>
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
            <FormControl component="fieldset">
              <FormLabel>Płeć</FormLabel>
              <RadioGroup aria-label="gender" name="education" value={gender} onChange={(e) => setGender(parseInt(e.target.value))} row>
                <FormControlLabel value={1} control={<Radio />} label='kobieta' />
                <FormControlLabel value={2} control={<Radio />} label='męźczyzna' />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <div className={classes.label_content} htmlFor="name">Punkt kwalifikacyjny</div>
            <SingleSelect value={qualification_point} handleChange={setQualificationPoint} list={qualificationPointList}/>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default withRouter(FirstStepView);
