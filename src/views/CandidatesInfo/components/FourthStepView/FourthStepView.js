import React, { useEffect, useState } from 'react';
import {
  Grid, Typography
} from '@material-ui/core';
import { SingleSelect} from 'components';
import {
  KeyboardDatePicker, MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { pl } from 'date-fns/locale';
import DateFnsUtils from '@date-io/date-fns';
import ReactQuill, {Quill} from 'react-quill'
import 'react-quill/dist/quill.snow.css';
import { withRouter } from 'react-router-dom';
import useStyles from './style';
import { Alert } from 'components';

const FourthStepView = (props) => {
  const classes = useStyles();
  const {
    date_referal,
    setDateReferal,
    rehabitation_center,
    setRehabitationCenter,
    rehabitationCenterList,
    participant_number,
    setParticipantNumber,
    date_rehabitation_center,
    setDateRehabitationCenter,
    typeToStayList,
    type_to_stay,
    setTypeToStay,
    participant_remark,
    setParticipantRemark,
		stage
  } = props;
  const handleDate = (value) => {
    let _date = new Date(value);
    return _date.getFullYear() + '-' + (_date.getMonth() + 1) + '-' + _date.getDate();
  }

  return (
	<MuiPickersUtilsProvider utils={DateFnsUtils} locale={pl}>
    <Grid container spacing={3} className={classes.form}>
			{
				stage != 4 ?
				<div className={classes.wrapper}/>
				:
				<></>
			}
      <Grid item md={3} xs={12}>
				<Typography variant="h2" className={classes.form_title}>
        	Przypisanie do ORK
				</Typography>
      </Grid>
      <Grid item md={9} xs={12}>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <div className={classes.label_content}>Data skierowania do ORK</div>
            <KeyboardDatePicker
              disableToolbar
              className={classes.date_picker}
              variant="inline"
              format="dd.MM.yyyy"
							placeholder="Format wprowadzania daty DD.MM.RRRR"
              margin="normal"
              id="date-picker-inline"
              value={date_referal}
              onChange={(value) => setDateReferal(handleDate(value))}
							aria-label="Data skierowania do ORK"
              KeyboardButtonProps={{
                'aria-label': 'Zmień datę',
              }}
            />
          </Grid>
          <Grid item xs={8}>
            <div className={classes.label_content} htmlFor="name">Skierowanie do ORK</div>
            <SingleSelect value={rehabitation_center} handleChange={setRehabitationCenter} list={rehabitationCenterList}/>
          </Grid>
          <Grid item xs={4}>
            <div className={classes.label_content} htmlFor="name">Numer uczestnika</div>
            <input className={classes.input_box} type="name" value={participant_number} name="name" onChange={(e) => setParticipantNumber(e.target.value)} />
          </Grid>
          <Grid item xs={4}>
            <div className={classes.label_content}>Data wejścia do ORK</div>
            <KeyboardDatePicker
              disableToolbar
              className={classes.date_picker}
              variant="inline"
              format="dd.MM.yyyy"
							placeholder="Format wprowadzania daty DD.MM.RRRR"
              margin="normal"
              id="date-picker-inline"
              value={date_rehabitation_center}
              onChange={(value) => setDateRehabitationCenter(handleDate(value))}
							aria-label="Data wejścia do ORK"
              KeyboardButtonProps={{
                'aria-label': 'Zmień datę',
              }}
            />
          </Grid>
          <Grid item xs={8}>
            <div className={classes.label_content} htmlFor="name">Tryb pobytu uczestnika</div>
            <SingleSelect value={type_to_stay} handleChange={setTypeToStay} list={typeToStayList}/>
          </Grid>
          <Grid item xs={12}>
            <div className={classes.label_content}>Uwagi dotyczące uczestnika</div>
            <textArea
							rows={6}
              onChange={setParticipantRemark}
              value={participant_remark}
              className={classes.qlClass}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
	</MuiPickersUtilsProvider>
  );
};

export default withRouter(FourthStepView);
