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

const ScheduleView = (props) => {
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
	<MuiPickersUtilsProvider utils={DateFnsUtils} locale={pl}>
    
	</MuiPickersUtilsProvider>
  );
};

export default withRouter(ScheduleView);
