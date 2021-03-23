import React, { useEffect, useState } from 'react';
import {
	Grid, FormControl, FormControlLabel, Radio, RadioGroup, FormLabel
} from '@material-ui/core';
import { SingleSelect, WeekSelect } from 'components';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import useStyles from './style';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './tab.css';
import MaskedInput from 'react-text-mask';
import ipr from '../../../../apis/ipr';
import clsx from 'clsx';

const ScheduleView = (props) => {
	const classes = useStyles();
	const { scheduleDate, handleGetScheduleData, scheduleData, setScheduleData, week, setWeek, weeks, setWeeks, status, setStatus, dateList, setDateList, selectedItem, setSelectedItem, id, history } = props;
	const [statusList, setStatusList] = useState([{ id: 1, name: 'Zaakceptowany' }, { id: 2, name: 'Niezaakpceptowany' }]);

	const _date_arr = [
		'PONIEDZIAŁEK',
		'WTOREK',
		'ŚRODA',
		'CZWARTEK',
		'PIĄTEK',
		'SOBOTA',
		'NIEDZIELA'
	];
	useEffect(() => {
		let _date = new Date(scheduleDate);
		let moment_date = moment([_date.getFullYear(), _date.getMonth(), _date.getDate()]);
		let start_date = getDay(moment_date, 0);
		let last_date = getDay(moment(), 6);
		let diff = Math.ceil(last_date.diff(start_date, 'days') / 7);
		let _arr = [];
		for (let i = 0; i < diff; i++) {
			let default_start_date = JSON.parse(JSON.stringify(start_date));
			let s_date = moment(default_start_date).add(i * 7, 'days');
			let f_date = moment(default_start_date).add((i + 1) * 7 - 1, 'days');
			let item = {
				id: i + 1,
				from: s_date,
				to: f_date,
				name: `tydzien ${i + 1} | 
			${s_date.get('date')}.${s_date.get('month') + 1}.${s_date.get('year')}-${f_date.get('date')}.${f_date.get('month') + 1}.${f_date.get('year')}`
			}
			_arr.push(item);
		}
		setWeeks(_arr);
	}, [scheduleDate]);

	useEffect(() => {
		if (weeks.length > 0)
			setWeek(0);
	}, [weeks]);

	useEffect(() => {
		if (weeks.length !== 0) {
			let _week = weeks[week];
			let _start_date = _week.from;
			let _to_date = _week.to;

			let _arr = [];
			let index = 0;
			for (let i = 0; i < 7; i++) {
				let default_start_date = JSON.parse(JSON.stringify(_start_date));
				let date = moment(default_start_date).add(i, 'days');
				if (index === 0 && parseInt(week) === 0 && date.diff(moment(scheduleDate), 'days') == 0) {
					index = i;
				}
				_arr.push({ name: `${date.get('date')}.${date.get('month') + 1}.${date.get('year')}`, date: date, id: i });
			}
			setDateList(_arr);
			handleGetWeekStatus(weeks[week]);
			handleGetScheduleData(_arr[index].date);
			setSelectedItem(index);
		}
	}, [week]);

	useEffect(() => {
		if (dateList.length > 0)
			handleGetScheduleData(dateList[selectedItem].date);
	}, [selectedItem]);

	const handleGetWeekStatus = (temp) => {
		ipr.getWeekStatus(temp.from, temp.to, id)
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					setStatus(response.data.status);
				}
			})
	}

	const getDay = (moment_date, days) => {
		let default_date = moment().set({ 'year': 2020, 'month': 0, 'date': 6 });
		let diff = moment_date.diff(default_date, 'days');
		let diff_final = Math.floor((diff + 1) / 7) * 7 + days;
		return default_date.add(diff_final, 'days');
	}

	const handleChangeScheduleFrom = (value, index_module, index_service) => {
		let _schedule_data = JSON.parse(JSON.stringify(scheduleData));
		if (!_schedule_data[index_module].service_list[index_service].schedule) {
			_schedule_data[index_module].service_list[index_service].schedule = {start_time: '00:00', end_time: '00:00'}
		}
		_schedule_data[index_module].service_list[index_service].schedule.start_time = value;
		let end_time = _schedule_data[index_module].service_list[index_service].schedule.end_time;
		let total_time = 0;
		if (!end_time) {
			end_time = '00:00';
		}
		total_time = parseInt(value.split(':')[0]) * 60 + parseInt(value.split(':')[1]) - parseInt(end_time.split(':')[0])*60 - parseInt(end_time.split(':')[1]);
		_schedule_data[index_module].service_list[index_service].schedule.total_time = total_time * -1 / 60;
		setScheduleData(_schedule_data);
		checkOverlap(_schedule_data);
	}

	const handleChangeScheduleTo = (value, index_module, index_service) => {
		let _schedule_data = JSON.parse(JSON.stringify(scheduleData));
		if (!_schedule_data[index_module].service_list[index_service].schedule) {
			_schedule_data[index_module].service_list[index_service].schedule = {start_time: '00:00', end_time: '00:00'}
		}
		_schedule_data[index_module].service_list[index_service].schedule.end_time = value;
		let start_time = _schedule_data[index_module].service_list[index_service].schedule.start_time;
		if (!start_time) {
			start_time = '00:00';
		}
		let total_time = 0;
		total_time = parseInt(start_time.split(':')[0]) * 60 + parseInt(start_time.split(':')[1]) - parseInt(value.split(':')[0])*60 - parseInt(value.split(':')[1]);
		_schedule_data[index_module].service_list[index_service].schedule.total_time = total_time * -1 / 60;
		setScheduleData(_schedule_data);
		checkOverlap(_schedule_data);
	}

	const checkOverlap = (_schedule_data) => {
		// let _schedule_data = JSON.parse(JSON.stringify(scheduleData));
		let _arr = [];
		for (let i = 0; i < _schedule_data.length; i ++) {
			for (let j = 0; j < _schedule_data[i].service_list.length; j ++) {
				if (!_schedule_data[i].service_list[j].schedule)
					continue;
				_arr.push({index_module: i, index_service: j, start_time: _schedule_data[i].service_list[j].schedule.start_time, end_time: _schedule_data[i].service_list[j].schedule.end_time, check: true});
			}
		}
		_arr.sort((item1, item2) => {
			if (item1.start_time < item2.start_time)
				return -1;
			return 1;
		});
		for (let i = 0; i < _arr.length - 1; i++) {
			const currentEndTime = _arr[i].end_time;
			const nextStartTime = _arr[i + 1].start_time;
			let index_module = _arr[i].index_module;
			let index_service = _arr[i].index_service;
			if (currentEndTime > nextStartTime) {
				_arr[i].check = false;
				_schedule_data[index_module].service_list[index_service].schedule.error = true;
			} else {
				_arr[i].check = true;
				_schedule_data[index_module].service_list[index_service].schedule.error = false;
			}
		}
		setScheduleData(_schedule_data);
	};

	const handleChangeScheduleBreak = (value, index_module, index_service) => {
		let _schedule_data = JSON.parse(JSON.stringify(scheduleData));
		if (!_schedule_data[index_module].service_list[index_service].schedule) {
			_schedule_data[index_module].service_list[index_service].schedule = {start_time: '00:00', end_time: '00:00'}
		}
		_schedule_data[index_module].service_list[index_service].schedule.break_time = value;
		setScheduleData(_schedule_data);
	}

	const handleChangeScheduleTotalTime = (value, index_module, index_service) => {
	}

	const handleChangeTotalAmount = (value, index_module, index_service) => {
		let _schedule_data = JSON.parse(JSON.stringify(scheduleData));
		if (!_schedule_data[index_module].service_list[index_service].schedule) {
			_schedule_data[index_module].service_list[index_service].schedule = {start_time: '00:00', end_time: '00:00'}
		}
		_schedule_data[index_module].service_list[index_service].schedule.total_amount = value;
		let total_unit_amount = 0;
		for (let i = 0; i < _schedule_data[index_module].service_list.length; i++) {
				total_unit_amount += parseInt(_schedule_data[index_module].service_list[i].schedule ? _schedule_data[index_module].service_list[i].schedule.total_amount : 0);
		}
		_schedule_data[index_module].total_unit_amount = total_unit_amount;
		if (_schedule_data[index_module].service_list[index_service].amount === null) {
			_schedule_data[index_module].service_list[index_service].amount = 0;
		}

		if (_schedule_data[index_module].service_list[index_service].amount !== undefined && _schedule_data[index_module].service_list[index_service].current_amount + parseInt(value) > parseInt(_schedule_data[index_module].service_list[index_service].amount))
			_schedule_data[index_module].service_list[index_service].error_amount = true;
		else
			_schedule_data[index_module].service_list[index_service].error_amount = false;
		setScheduleData(_schedule_data);
	}
	
	return (
		<>
			<Grid container spacing={3} className={classes.form}>
				<Grid item xs={3}>
					<div className={classes.form_title}>
						Tydzien
					</div>
				</Grid>
				<Grid item xs={5}>
					<div className={classes.top_label_content}>Wybierz tydzien</div>
					<WeekSelect value={week} handleChange={setWeek} list={weeks} />
				</Grid>
				<Grid item xs={4}>
					<div className={classes.top_label_content}>Status</div>
					<SingleSelect value={status} handleChange={setStatus} list={statusList} />
				</Grid>
			</Grid>
			<Tabs selectedIndex={selectedItem} onSelect={setSelectedItem} style={{ width: '100%', marginTop: '50px' }}>
				<TabList>
					{
						dateList.map((item, index) => (
							<Tab style={{ width: '14%' }} disabled={index > 4 || moment(item.date) < moment(scheduleDate) || moment(item.date) > moment()}>
								<div style={{ display: 'block', paddingTop: '10px' }}>
									<div>
										{_date_arr[item.id]}
									</div>
									<div>
										{item.name}
									</div>
								</div>
							</Tab>
						))
					}
				</TabList>
				{
					dateList.map((item, index) => (
						<TabPanel>
							<Grid container spacing={3} className={classes.grid}>
								{
									scheduleData.map((module, index_module) => (
										<>
											<Grid item xs={3} className={classes.form_title} >
												<div>
													Procedury
												</div>
												<div className={classes.small_title}>
													{module.name}
												</div>
											</Grid>
											<Grid item xs={9}>
												<Grid container spacing={2}>
													{
														index_module == 0 ?
														<>
														<Grid item xs={5}/>
														<Grid item xs={7}>
															<Grid container spacing={2} style={{alignItems: 'end'}}>
																<Grid item xs>od</Grid>
																<Grid item xs>do</Grid>
																<Grid item xs>
																	przerwy
																	<div>(w min)</div>
																</Grid>
																<Grid item xs>
																	łącznie
																	<div>(w godz)</div>
																</Grid>
																<Grid item xs>
																	łącznie
																	<div>(w jednostce)</div>
																</Grid>
															</Grid>
														</Grid>
														</>
														:
														<></>
													}
														
														{
														module.service_list.map((service, index_service) => (
															<>
																<Grid item xs={5}>
																	{service.name}
																</Grid>
																<Grid item xs={7}>
																	<Grid container spacing={2}>
																		<Grid item xs>
																			<MaskedInput
																				className={clsx({[classes.input_box] : true, [classes.input_error] : scheduleData[index_module].service_list[index_service].schedule && scheduleData[index_module].service_list[index_service].schedule.error === true})}
																				mask={[/\d/, /\d/, ':', /\d/, /\d/]}
																				value={scheduleData[index_module].service_list[index_service].schedule ? scheduleData[index_module].service_list[index_service].schedule.start_time : '00:00' }
																				defaultValue='00:00'
																				onChange={(e) => handleChangeScheduleFrom(e.target.value, index_module, index_service)}
																			/>
																		</Grid>
																		<Grid item xs>
																			<MaskedInput
																				className={clsx({[classes.input_box] : true, [classes.input_error] : scheduleData[index_module].service_list[index_service].schedule && scheduleData[index_module].service_list[index_service].schedule.error === true})}
																				mask={[/\d/, /\d/, ':', /\d/, /\d/]}
																				defaultValue='00:00'
																				value={scheduleData[index_module].service_list[index_service].schedule ? scheduleData[index_module].service_list[index_service].schedule.end_time : '00:00'}
																				onChange={(e) => handleChangeScheduleTo(e.target.value, index_module, index_service)}
																			/>
																		</Grid>
																		<Grid item xs>
																			<input className={classes.input_box} type="name" 
																			value={scheduleData[index_module].service_list[index_service].schedule ? scheduleData[index_module].service_list[index_service].schedule.break_time : ''} name="name" 
																			onChange={
																				(e) => handleChangeScheduleBreak(e.target.value, index_module, index_service)
																			}
																		/>
																		</Grid>
																		<Grid item xs>
																			<input className={classes.input_box} type="name" 
																			value={scheduleData[index_module].service_list[index_service].schedule ? scheduleData[index_module].service_list[index_service].schedule.total_time : ''} name="name" 
																			readOnly
																		/>
																		</Grid>
																		<Grid item xs>
																			<input className={clsx({[classes.input_box] : true, [classes.input_error] : scheduleData[index_module].service_list[index_service] && scheduleData[index_module].service_list[index_service].error_amount === true})} 
																			type="name" 
																			value={scheduleData[index_module].service_list[index_service].schedule ? scheduleData[index_module].service_list[index_service].schedule.total_amount : ''} name="name" 
																			onChange={
																				(e) => handleChangeTotalAmount(e.target.value, index_module, index_service)
																			}
																		/>
																		</Grid>
																	</Grid>
																</Grid>
															</>
														))
													}
												</Grid>
											</Grid>
											<Grid container spacing={0} style={{display: 'flex', justifyContent:'flex-end', padding: '15px'}}>
												<Grid item xs={3} className={classes.sum_title}>
													<div>
														łącznie (w danym module)
													</div>
												</Grid>
												<Grid item xs={2}>
													<input className={classes.input_box} type="name" 
														value={scheduleData[index_module].total_unit_amount ? scheduleData[index_module].total_unit_amount : 0} name="name" 
														readOnly
													/>
												</Grid>
											</Grid>
										</>
									))
								}

							</Grid>
						</TabPanel>
					))
				}
				<TabPanel>

				</TabPanel>
				<TabPanel>

				</TabPanel>
			</Tabs>
		</>

	);
};

export default withRouter(ScheduleView);
