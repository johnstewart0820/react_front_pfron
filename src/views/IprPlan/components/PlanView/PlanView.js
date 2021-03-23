import React, { useEffect, useState } from 'react';
import {
  Grid, FormControl,FormControlLabel, Radio, RadioGroup, FormLabel, Checkbox, TextField, Button, IconButton
} from '@material-ui/core';
import { SingleSelect} from 'components';
import { withRouter } from 'react-router-dom';
import useStyles from './style';
import { Autocomplete } from '@material-ui/lab';
import {
	KeyboardDatePicker, MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { pl } from 'date-fns/locale'
import DeleteIcon from '@material-ui/icons/Delete';
import { useTheme } from '@material-ui/styles';

const PlanView = (props) => {
  const classes = useStyles();
	const theme = useTheme();
  const { moduleList, setModuleList } = props;

  const handleChangeApplicable = (index, index_module) => {
	let _module_list = JSON.parse(JSON.stringify(moduleList));
	_module_list[index_module].plan[index].disable_status = _module_list[index_module].plan[index].disable_status ? !_module_list[index_module].plan[index].disable_status : true
	setModuleList(_module_list);
  }

  const handleChangeAmount = (value, index, index_module) => {
	let _module_list = JSON.parse(JSON.stringify(moduleList));
	_module_list[index_module].plan[index].amount = value;
	setModuleList(_module_list);
  }

  const handleChangeStartDate = (value, index, index_module) => {
	let _module_list = JSON.parse(JSON.stringify(moduleList));
	let _date = new Date(value);

	_module_list[index_module].plan[index].start_date = _date.getFullYear() + '-' + (_date.getMonth() + 1) + '-' + _date.getDate();
	setModuleList(_module_list);
  }

  const handleChangeOrkPerson = (value, index, index_module) => {
	let _module_list = JSON.parse(JSON.stringify(moduleList));
	_module_list[index_module].plan[index].id_ork_person = value;
	setModuleList(_module_list);
  }

  const getOrkPerson = (module, id_ork, index_module) => {
	  if (isNaN(id_ork))
	  	return id_ork;
	  for (let i = 0; i < module.ork_team.length; i ++) {
		  if (module.ork_team[i].id === id_ork) {
			  return module.ork_team[i];
		  }
	  }
	  return null;
  }

  const handleChangeRoomNumber = (value, index, index_module) => {
	let _module_list = JSON.parse(JSON.stringify(moduleList));
	_module_list[index_module].plan[index].room_number = value;
	setModuleList(_module_list);
  }

  const handleChangeRemarks = (value, index, index_module) => {
	let _module_list = JSON.parse(JSON.stringify(moduleList));
	_module_list[index_module].plan[index].remarks = value;
	setModuleList(_module_list);
  }

  const handleCreatePlan = (index_module) => {
	let _module_list = JSON.parse(JSON.stringify(moduleList));
	_module_list[index_module].plan.push({'new': true});
	setModuleList(_module_list);
  }

  const handleChangePlan = (value, index, index_module) => {
	let _module_list = JSON.parse(JSON.stringify(moduleList));
	_module_list[index_module].plan[index].id_service = value;
	for (let i = 0; i < _module_list[index_module].service_list.length; i ++) {
		if (_module_list[index_module].service_list[i].id === value.id)
			_module_list[index_module].plan[index].unit = _module_list[index_module].service_list[i].unit;
	}

	setModuleList(_module_list);
  }

  const handleDeletePlan = (index, index_module) => {
	let _module_list = JSON.parse(JSON.stringify(moduleList));
	_module_list[index_module].plan.splice(index, 1);
	setModuleList(_module_list);
  }

  const renderService = (module, index_module) => {
	let order = 1;
	return module.plan.map((service, index) => (							
			<Grid container spacing={3} key={index}>
				<Grid item xs={1}>
					{order ++}.
				</Grid>
				<Grid item xs={11}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<div className={classes.normal_font}>
								Nazwa procedury
							</div>
						</Grid>
						<Grid item xs={12}>
							<Grid container spacing={2}>
								{
									service.new === true ?
									<>
									<Grid item xs={10}>
										<Autocomplete
											disabled={service.disable_status}
											className={classes.name_select_box}
											onChange={(event, value) => handleChangePlan(value, index, index_module)}
											options={module.service_list}
											getOptionLabel={(option) => module.service_list && option && option.name}
											renderInput={(params) => <TextField {...params} variant="outlined" InputLabelProps={{ shrink: false }} />}
										/>
									</Grid>
									<Grid item xs={2} style={{display: 'flex', alignItems: 'center'}}>
										<IconButton color="primary" aria-label={`Usuń plan`} component="span" onClick={() => handleDeletePlan(index, index_module)}>
											<DeleteIcon/>
										</IconButton>
									</Grid>
									</>
									:
									<Grid item xs={9}>
										<div className={classes.normal_font}>
											{service.name}
										</div>
									</Grid>
								}
								
								{
									service.not_applicable === 1 && service.new !== true ?
									<Grid item xs={3}>
										<FormControl component="fieldset">
											<FormControlLabel
												className={classes.rememberMe}
												control={
													<Checkbox
														onChange={() => handleChangeApplicable(index, index_module)}
													/>
												}
												label='Nie dotyczy'
											/>
										</FormControl>
									</Grid>
									:
									<></>
								}
							</Grid>
						</Grid>
						<Grid item xs={12}>
							<Grid container spacing={2}>
								<Grid item xs={2}>
									<div className={classes.top_label}><label htmlFor="amount">Wymiar</label></div>
									<input aria-lebel="a" className={classes.input_box} type="name" value={service.amount} name="name" id="amount" onChange={(e) => handleChangeAmount(e.target.value, index, index_module)} disabled={service.disable_status}/>
								</Grid>
								<Grid item xs={10}>
									<div className={classes.top_label} htmlFor="name">Jednostka</div>
									<div className={classes.name}>{service.unit}</div>
								</Grid>
							</Grid>
						</Grid>
						<Grid item xs={12}>
							<Grid container spacing={2}>
								<Grid item xs={4}>
									<div className={classes.top_label}><label htmlFor="start_date">Data rozpoczęcia</label></div>
									<KeyboardDatePicker
										disableToolbar
										disabled={service.disable_status}
										id="start_date"
										variant="inline"
										format="dd.MM.yyyy"
										margin="normal"
										value={service.start_date}
										onChange={(value) => handleChangeStartDate(value, index, index_module)}
										KeyboardButtonProps={{
										'aria-label': 'change date',
										}}
									/>
								</Grid>
								<Grid item xs={6}>
									<div className={classes.top_label}><label htmlFor="ork_person">Osoba realizująca (Rehabilitant powadzacy)</label></div>
									<Autocomplete
										disabled={service.disable_status}
										id="ork_person"
										className={classes.name_select_box}
										onChange={(event, value) => handleChangeOrkPerson(value, index, index_module)}
										value={getOrkPerson(module, service.id_ork_person, index_module)}
										options={module.ork_team}
										getOptionLabel={(option) => module.ork_team && option && option.name}
										renderInput={(params) => <TextField {...params} variant="outlined" InputLabelProps={{ shrink: false }} />}
									/>
								</Grid>
								<Grid item xs={2}>
									<div className={classes.top_label}><label htmlFor="room_number">Sala</label></div>
									<input className={classes.input_box} type="name" value={service.room_number} id="room_number" name="name" onChange={(e) => handleChangeRoomNumber(e.target.value, index, index_module)} disabled={service.disable_status}/>
								</Grid>
							</Grid>
						</Grid>
						<Grid item xs={12}>
							<div className={classes.top_label}><label htmlFor="remark">Uwagi/suma wymiaru</label></div>
							<input className={classes.input_box} type="name" value={service.remarks} name="name" id="remark" onChange={(e) => handleChangeRemarks(e.target.value, index, index_module)} disabled={service.disable_status}/>
						</Grid>
					</Grid>
				</Grid>
				{
					index == module.plan.length - 1 ?
					<Grid item xs={12}>
					<div style={{display: 'flex', justifyContent: 'flex-end', width: '100%'}}>
						<Button variant="outlined" color="secondary" className={classes.btnCreate} onClick={() => handleCreatePlan(index_module)}>
							Dodaj kolejna procedure
						</Button>
					</div>
					</Grid>
					:
					<></>
				}
				<div className={classes.divide}/>
			</Grid>
	))
  }
  return (
    <Grid container spacing={3} className={classes.form}  style={{backgroundColor: theme.palette.black_white, margin: '0px', width: '100%'}}>
		{
			moduleList.map((module, index) => (
				<>
					<Grid item xs={3} className={classes.form_title}>
						<div>
							Procedury/Usługi
						</div>
						<div className={classes.small_title}>
							{module.name}
						</div>
					</Grid>
					<Grid item xs={9}>
					{
						renderService(module, index)
					}
					</Grid>
					{
						module.plan.length === 0 ?
						<>
							<Grid item xs={12}>
							<div style={{display: 'flex', justifyContent: 'flex-end', width: '100%'}}>
								<Button variant="outlined" color="secondary" className={classes.btnCreate} onClick={() => handleCreatePlan(index)}>
									Dodaj kolejna procedure
								</Button>
							</div>
							</Grid>
							<div className={classes.divide_big}/>
						</>
						:
						<></>
					}
				</>
			))
		}
    </Grid>
  );
};

export default withRouter(PlanView);
