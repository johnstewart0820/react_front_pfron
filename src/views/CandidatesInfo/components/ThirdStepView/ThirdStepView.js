import React, { useEffect, useState } from 'react';
import {
  Grid, FormControl,FormControlLabel, Radio, RadioGroup, FormLabel
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

const ThirdStepView = (props) => {
  const classes = useStyles();
  const { 
    decision_central_commision,
    setDecisionCentralCommision,
    date_central_commision,
    setDateCentralCommision,
    general_remark,
    setGeneralRemark,
		stage,
    history } = props;

    const handleDate = (value) => {
      let _date = new Date(value);
      return _date.getFullYear() + '-' + (_date.getMonth() + 1) + '-' + _date.getDate();
    }

  return (
	<MuiPickersUtilsProvider utils={DateFnsUtils} locale={pl}>
    <Grid container spacing={3} className={classes.form}>
			{
				stage != 3 ?
				<div className={classes.wrapper}/>
				:
				<></>
			}
      <Grid item md={3} xs={12} className={classes.form_title}>
        Decyzja komisji
      </Grid>
      <Grid item md={9} xs={12}>
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
                    placeholder="Format wprowadzania daty DD.MM.RRRR"
                  margin="normal"
                  id="date-picker-inline"
                  value={date_central_commision}
                  onChange={(value) => setDateCentralCommision(handleDate(value))}
									aria-label="Data wydania decyzji"
                  KeyboardButtonProps={{
                    'aria-label': 'Zmień datę',
                  }}
                />
              </Grid>
            
              <Grid item xs={12}>
                <div className={classes.label_content}>Uwagi ogólne</div>
								<textArea
									rows={6}
                  onChange={setGeneralRemark}
                  value={general_remark}
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

export default withRouter(ThirdStepView);
