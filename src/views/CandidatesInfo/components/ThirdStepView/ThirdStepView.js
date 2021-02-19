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
import ReactQuill, {Quill} from 'react-quill'
import 'react-quill/dist/quill.snow.css';

const ThirdStepView = (props) => {
  const classes = useStyles();
  const { 
    decision_central_commision,
    setDecisionCentralCommision,
    date_central_commision,
    setDateCentralCommision,
    general_remark,
    setGeneralRemark,
    history } = props;

    const handleDate = (value) => {
      let _date = new Date(value);
      return _date.getFullYear() + '-' + (_date.getMonth() + 1) + '-' + _date.getDate();
    }

  return (
    <Grid container spacing={3} className={classes.form}>
      <Grid item xs={3} className={classes.form_title}>
        Decyzja komisji
      </Grid>
      <Grid item xs={9}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel>Decyzja komisji centralnej</FormLabel>
              <RadioGroup aria-label="decision_central_commision" name="decision_central_commision" value={parseInt(decision_central_commision)} onChange={(e) => setDecisionCentralCommision(parseInt(e.target.value))} row>
                <FormControlLabel value={1} control={<Radio />} label='TAK' />
                <FormControlLabel value={2} control={<Radio />} label='NIE' />
              </RadioGroup>
            </FormControl>
          </Grid>
          {
            decision_central_commision === 1 ?
            <>
              <Grid item xs={12}>
                <div className={classes.label_content}>Data wydania decyzji</div>
                <KeyboardDatePicker
                  disableToolbar
                  className={classes.date_picker}
                  variant="inline"
                  format="dd.MM.yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  value={date_central_commision}
                  onChange={(value) => setDateCentralCommision(handleDate(value))}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </Grid>
            
              <Grid item xs={12}>
                <div className={classes.label_content}>Uwagi ogolne</div>
                <ReactQuill 
                  onChange={setGeneralRemark}
                  value={general_remark}
                  placeholder="Write Something..."
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
  );
};

export default withRouter(ThirdStepView);