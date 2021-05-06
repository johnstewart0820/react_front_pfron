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
		is_participant,
		stage
  } = props;
  const handleDate = (value) => {
    let _date = new Date(value);
    return _date.getFullYear() + '-' + (_date.getMonth() + 1) + '-' + _date.getDate();
  }

  return (
	<MuiPickersUtilsProvider utils={DateFnsUtils} locale={pl}>
    <Grid container spacing={3} className={classes.form}>
      <Grid item md={3} xs={12}>
				<Typography variant="h2" className={classes.form_title}>
        	Przypisanie do ORK
				</Typography>
      </Grid>
      <Grid item md={9} xs={12}>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <div className={classes.label_content}><label htmlFor="date_referal">Data skierowania do ORK</label></div>
            <KeyboardDatePicker
              disableToolbar
              className={classes.date_picker}
              variant="inline"
              format="dd.MM.yyyy"
							aria-label="Data skierowania do ORK - Format wprowadzania daty DD.MM.RRRR"
              margin="normal"
              id="date_referal"
              value={date_referal}
              onChange={(value) => setDateReferal(handleDate(value))}
              KeyboardButtonProps={{
                'aria-label': 'Zmień datę',
              }}
							disabled={is_participant == 1}
            />
          </Grid>
          <Grid item xs={8}>
            <div className={classes.label_content} htmlFor="name">Skierowanie do ORK</div>
            <SingleSelect value={rehabitation_center} handleChange={setRehabitationCenter} list={rehabitationCenterList} disabled={is_participant == 1}/>
          </Grid>
          <Grid item xs={4}>
            <div className={classes.label_content}><label htmlFor="participant_number">Numer uczestnika</label></div>
            <input className={classes.input_box} type="name" value={participant_number} name="name" id="participant_number" onChange={(e) => setParticipantNumber(e.target.value)} disabled={is_participant == 1}/>
          </Grid>
          <Grid item xs={4}>
            <div className={classes.label_content}><label htmlFor="date_rehabitation_center">Data wejścia do ORK</label></div>
            <KeyboardDatePicker
              disableToolbar
              className={classes.date_picker}
              variant="inline"
              format="dd.MM.yyyy"
							aria-label="Data wejścia do ORK - Format wprowadzania daty DD.MM.RRRR"
              margin="normal"
              id="date_rehabitation_center"
              value={date_rehabitation_center}
              onChange={(value) => setDateRehabitationCenter(handleDate(value))}
              KeyboardButtonProps={{
                'aria-label': 'Zmień datę',
              }}
							disabled={is_participant == 1}
            />
          </Grid>
          <Grid item xs={8}>
            <div className={classes.label_content} htmlFor="name"><label htmlFor="type_to_stay">Tryb pobytu uczestnika</label></div>
            <SingleSelect value={type_to_stay} handleChange={setTypeToStay} list={typeToStayList} id="type_to_stay" disabled={is_participant == 1}/>
          </Grid>
          <Grid item xs={12}>
            <div className={classes.label_content}><label htmlFor="participant_remark">Uwagi dotyczące uczestnika</label></div>
            <textArea
							id="participant_remark"
							rows={6}
              onChange={setParticipantRemark}
              value={participant_remark}
              className={classes.qlClass}
							disabled={is_participant == 1}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
	</MuiPickersUtilsProvider>
  );
};

export default withRouter(FourthStepView);
