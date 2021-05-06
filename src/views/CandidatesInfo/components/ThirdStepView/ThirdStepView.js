import React, { useEffect, useState } from 'react';
import {
	Grid, FormControl, FormControlLabel, Radio, RadioGroup, FormLabel, Typography
} from '@material-ui/core';
import { SingleSelect } from 'components';
import { withRouter } from 'react-router-dom';
import useStyles from './style';
import { Alert } from 'components';
import {
	KeyboardDatePicker, MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { pl } from 'date-fns/locale';
import DateFnsUtils from '@date-io/date-fns';
import ReactQuill, { Quill } from 'react-quill'
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
				<Grid item md={3} xs={12}>
					<Typography variant="h2" className={classes.form_title}>
						Decyzja komisji
				</Typography>
				</Grid>
				<Grid item md={9} xs={12}>
					<Grid container spacing={3}>
						<Grid item xs={12}>
							<FormControl component="fieldset" disabled={stage != 3}>
								<FormLabel>Decyzja komisji centralnej</FormLabel>
								<RadioGroup aria-label="decision_central_commision" name="decision_central_commision" value={parseInt(decision_central_commision)} onChange={(e) => setDecisionCentralCommision(parseInt(e.target.value))} row>
									<FormControlLabel value={1} control={<Radio />} label='TAK' />
									<FormControlLabel value={2} control={<Radio />} label='NIE' />
								</RadioGroup>
							</FormControl>
						</Grid>
						<Grid item xs={12}>
							<div className={classes.label_content}><label htmlFor="date_central_commision">Data wydania decyzji</label></div>
							<KeyboardDatePicker
								disableToolbar
								className={classes.date_picker}
								variant="inline"
								format="dd.MM.yyyy"
								aria-label="Data wydania decyzji - Format wprowadzania daty DD.MM.RRRR"
								margin="normal"
								id="date_central_commision"
								value={date_central_commision}
								onChange={(value) => setDateCentralCommision(handleDate(value))}
								KeyboardButtonProps={{
									'aria-label': 'Zmień datę',
								}}
								disabled={stage != 3}
							/>
						</Grid>

						<Grid item xs={12}>
							<div className={classes.label_content}><label htmlFor="general_remark">Uwagi ogólne</label></div>
							<textArea
								id="general_remark"
								rows={6}
								onChange={setGeneralRemark}
								value={general_remark}
								className={classes.qlClass}
								disabled={stage != 3}
							/>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</MuiPickersUtilsProvider>
	);
};

export default withRouter(ThirdStepView);
