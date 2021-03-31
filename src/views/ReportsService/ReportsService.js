import React, { useState, useEffect } from 'react';
import useStyles from './style';
import {
  Button, Grid, Card, CircularProgress, TextField
} from '@material-ui/core';
import { useToasts } from 'react-toast-notifications'

import { Breadcrumb, SingleSelect } from 'components';
import report from '../../apis/report';
import { Autocomplete } from '@material-ui/lab';

import ReactExport from 'react-export-excel';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const ReportsService = props => {
  const { history } = props;
  const classes = useStyles();
  const { addToast, removeAllToasts } = useToasts()
  const breadcrumbs = [{ active: true, label: 'Finanse', href: '/reports_service' }, { active: true, label: 'Raporty', href: '#' }, {active: false, label: 'Zestawienie zrealizowanych usług'}];
  const [name, setName] = useState('raport');
  const [rehabitationCenter, setRehabitationCenter] = useState(0);
  const [rehabitationCenterList, setRehabitationCenterList] = useState([]);
	const [participant, setParticipant] = useState(null);
	const [participantList, setParticipantList] = useState([]);
	const [quater, setQuater] = useState([]);
	const [quaterList, setQuaterList] = useState([]);
  const [progressStatus, setProgressStatus] = useState(false);
	const [result, setResult] = useState(null);
  const [error, setError] = useState({});

  useEffect(() => {
    report.getServiceInfo()
      .then(response => {
        if (response.code === 401) {
          history.push('/login');
        } else {
          setParticipantList(response.data.participant);
          setRehabitationCenterList(response.data.rehabitation_center);
        }
      })
  }, []);

	useEffect(() => {
		if (parseInt(rehabitationCenter) != 0) {
			report.getServiceQuarter(rehabitationCenter)
				.then(response => {
					if (response.code === 401) {
						history.push('/login');
					} else {
						setQuaterList(response.data.quater);
					}
				})
		}
	}, [rehabitationCenter]);

	useEffect(() => {
		if (participant != null) {
			report.getServiceQuarter(participant.rehabitation_center)
				.then(response => {
					if (response.code === 401) {
						history.push('/login');
					} else {
						setQuaterList(response.data.quater);
					}
				})
		}
	}, [participant]);

	useEffect(() => {
		if (result != null) {
			document.getElementById('export').click();
		}
	}, [result]);

  const handleError = () => {
    let _error = {}
    _error.rehabitation_center = (parseInt(rehabitationCenter) === 0);
    setError(_error);
  };

  const handleChangeName = (value) => {
    setName(value);
  }

  const handleChangeRehabitationCenter = (value) => {
		setRehabitationCenter(value);
    let _error = JSON.parse(JSON.stringify(error));
    _error.rehabitation_center = (parseInt(value) === 0);
    setError(_error);
  }

	const handleChangeParticipant = (value) => {
		setParticipant(value);
	}

	const handleChangeQuater = (value) => {
		setQuater(value);
		let _error = JSON.parse(JSON.stringify(error));
		_error.quater_from = (value === null);
		_error.quater_to = (value === null);
		setError(_error);
	}

  const checkError = () => {
    return parseInt(rehabitationCenter) === 0
  }

  const handleGenerate = () => {
		removeAllToasts();
		if (participant === null && parseInt(rehabitationCenter) === 0)
			addToast(<label>Proszę wypełnić wszystkie wymagane pola.</label>, { appearance: 'error', autoDismissTimeout: 3000, autoDismiss: false })
		else {
			setProgressStatus(true);
			report.getServiceData(rehabitationCenter, participant === null ? 0 : participant.id)
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					handleExport(response.data.candidate);
				}
				setProgressStatus(false);
			})
		}
  }

	const handleExport = (data) => {
		let romic_number = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
		let export_data = [];
		let total_sum = ['', ''];
		let header = [
			{value : 'Lp.', style: {font: {bold: true, sz: "8"}, alignment: {wrapText: true, vertical: "top"}}},
			{value : 'Działanie', style: {font: {bold: true, sz: "8"}, alignment: {wrapText: true, vertical: "top"}}}
		];
		let total_data = [{columns: [], data: []}];
		let column = ['', ''];
		for (let i = 0; i < data.length; i ++) {
			column.push('');
			header.push({value : data[i].participant_number, style: {font: {bold: true, sz: "8"}, alignment: {wrapText: true, vertical: "top"}}});
		}
		column.push('');
		column.push('');
		column.push('');
		column.push('');
		column.push('');
		column.push('');
		column.push('');
		header.push({value : 'Liczba Uczestników w okresie sprawozdawczym', style: {font: {bold: true, sz: "8"}, alignment: {wrapText: true, vertical: "top"}}});
		header.push({value : 'Jednostka', style: {font: {bold: true, sz: "8"}, alignment: {wrapText: true, vertical: "top"}}});
		header.push({value : 'Liczba zrealizowanych jednostek na jednego Uczestnika (średnio)', style: {font: {bold: true, sz: "8"}, alignment: {wrapText: true, vertical: "top"}}});
		header.push({value : 'Liczba zrealizowanych jednostek w okresie 8.12.19-07.03.2020 (C x E)', style: {font: {bold: true, sz: "8"}, alignment: {wrapText: true, vertical: "top"}}});
		header.push({value : 'Stawka jednostkowa netto (PLN)', style: {font: {bold: true, sz: "8"}, alignment: {wrapText: true, vertical: "top"}}});
		header.push({value : 'Cena netto (F x G)', style: {font: {bold: true, sz: "8"}, alignment: {wrapText: true, vertical: "top"}}});
		header.push({value : 'Cena brutto (H x (1+J))', style: {font: {bold: true, sz: "8"}, alignment: {wrapText: true, vertical: "top"}}});
		total_data[0].columns = column;
		total_data[0].data.push(header);
		// [
		// 	{ value: "H1", style: { font: { sz: "24", bold: true } } },
		// 	{ value: "Bold", style: { font: { bold: true } } },
		// 	{
		// 		value: "Red",
		// 		style: {
		// 			fill: { patternType: "solid", fgColor: { rgb: "FFFF0000" } },
		// 		},
		// 	},
		// ],
		let sub_header = [
			{value : 'A', style: {font: {bold: true}, alignment: {wrapText: true, vertical: "top"}}},
			{value : 'B', style: {font: {bold: true}, alignment: {wrapText: true, vertical: "top"}}},
		];
		for (let i = 0; i < data.length; i ++) {
			sub_header.push('');
		}
		sub_header.push({value : 'C', style: {font: {bold: true}, alignment: {wrapText: true, vertical: "top"}}});
		sub_header.push({value : 'D', style: {font: {bold: true}, alignment: {wrapText: true, vertical: "top"}}}); 		
		sub_header.push({value : 'E', style: {font: {bold: true}, alignment: {wrapText: true, vertical: "top"}}});
		sub_header.push({value : 'F', style: {font: {bold: true}, alignment: {wrapText: true, vertical: "top"}}});		
		sub_header.push({value : 'G', style: {font: {bold: true}, alignment: {wrapText: true, vertical: "top"}}}); 		
		sub_header.push({value : 'H', style: {font: {bold: true}, alignment: {wrapText: true, vertical: "top"}}}); 		
		sub_header.push({value : 'I', style: {font: {bold: true}, alignment: {wrapText: true, vertical: "top"}}});

		total_data[0].data.push(sub_header);
		let index = 0;
		if (data.length > 0) {
			let module = data[0].module;
			for (let i = 0; i < module.length; i ++) {
				let item = [];
				item.push('');
				item.push({value : romic_number[i] +'. ' + module[i].name, style: {font: {bold: true}}});
				total_data[0].data.push(item);
				let service_list = module[i].service_lists;
				for (let j = 0; j < service_list.length; j ++) {
					let item = [];
					item.push({value: ++index +''});
					item.push(service_list[j].name);
					let count = 0;
					let sum = 0;
					for (let k = 0; k < data.length; k ++) {
						let schedule = data[k].module[i].service_lists[j].schedule;
						let value = (parseFloat(schedule.trial) + parseFloat(schedule.basic));
						
						if (!total_sum[k + 2])
							total_sum[k + 2] = 0;
						total_sum[k + 2] += value;

						if (!total_sum[2 + data.length]) 
							total_sum[2 + data.length] = 0;
						total_sum[2 + data.length] += value;

						item.push(value === 0 ? {value: ''} : {value: value + '', 					
						style: {
							fill: { patternType: "solid", fgColor: { rgb: "FF0000FF" } },
						},});
						if (value !== 0)
							count ++;
						sum += value;
					}
					let average = sum / data.length;
					
					item.push({value: count === 0 ? 'nd' : count + ''});
					item.push({value: data[0].module[i].service_lists[j].unit_name});
					item.push({value: average === 0 ? 'nd' : average.toFixed(2)});
					item.push({value: sum === 0 ? 'nd' : sum.toFixed(2), style: {
						fill: { patternType: "solid", fgColor: { rgb: "FFFFFF00" } },
					},});

					let cost = data[0].module[i].service_lists[j].cost;
					item.push({value: parseFloat(cost).toFixed(2)});
					let sum_value = (cost * sum);
					if (!total_sum[5 + data.length]) 
						total_sum[5 + data.length] = 0;
					total_sum[5 + data.length] += parseFloat(sum);
					item.push({value: sum_value === 0 ? 'nd' : sum_value.toFixed(2)});
					item.push({value: sum_value === 0 ? 'nd' : sum_value.toFixed(2)});
					total_data[0].data.push(item);
				}
			}
		}
		// export_data.push(total_sum);
		let item = [];
		item.push({value: '', style: {
			fill: {patternType: "solid", fgColor: {rgb: "FFB8CCD4"}}
		}});
		item.push({value: 'VIII. ŁĄCZNIE W KWARTALE', style: {
			font: {bold: true},
			fill: {patternType: "solid", fgColor: {rgb: "FFB8CCD4"}}
		}})
		for (let i = 1; i < data.length + 8; i ++) {
			item.push({value: '', style: {
				fill: {patternType: "solid", fgColor: {rgb: "FFB8CCD4"}}
			}});
		}
		total_data[0].data.push(item);
		let item_last = [];
		for (let i = 0; i < total_sum.length; i ++) {
			item_last.push({value: total_sum[i] === undefined ? '' : total_sum[i] + ''});
		}
		total_data[0].data.push(item_last);
		setResult(total_data);
		
	}

  return (
    <>
    <div className={classes.public}>
      <div className={classes.controlBlock}>
        <Breadcrumb list={breadcrumbs} />
      </div>
      <Grid container spacing={3} className={classes.formBlock}>
        <Grid item md={9} xs={12}>
          <Card className={classes.form}>
            <Grid container spacing={3}>
              <Grid item md={3} xs={12} className={classes.form_title}>
                Zdefiniuj dane raportu
              </Grid>
              <Grid item md={9} xs={12}>
                <div className={classes.top_label} ><label htmlFor="name">Nazwa raportu</label></div>
                <input className={classes.input_box} id="name" type="name" value={name} name="name" onChange={(e) => handleChangeName(e.target.value)} />
              </Grid>
            </Grid>
						<div className={classes.divide} />
						<Grid container spacing={3}>
              <Grid item md={3} xs={12} className={classes.form_title}>
                Okres
              </Grid>
							<Grid item md={9} xs={12}>
								<Grid container spacing={2}>
									<Grid item md={5} xs={12}>
										<div className={classes.top_label} ><label htmlFor="rehabilitation_centers">Wybierz ORK</label></div>
										<SingleSelect value={rehabitationCenter} handleChange={(value) => handleChangeRehabitationCenter(value)} list={rehabitationCenterList}/>
									</Grid>
									<Grid item md={2} xs={12} className={classes.center}>
										lub
									</Grid>
									<Grid item md={5} xs={12}>
										<div className={classes.top_label} ><label htmlFor="participants">Wybierz uczestnika</label></div>
										<Autocomplete
											className={classes.name_select_box}
											id="participants"
											onChange={(event, value) => handleChangeParticipant(value)}
											value={participant}
											options={participantList}
											getOptionLabel={(option) => participantList && option && option.name}
											renderInput={(params) => <TextField {...params} variant="outlined" InputLabelProps={{ shrink: false }} />}
										/>
									</Grid>
									<Grid item md={4} xs={12}>
										<div className={classes.top_label} ><label htmlFor="quater_from">Wybierz kwartał od</label></div>
										<Autocomplete
											className={classes.name_select_box}
											id="quater_from"
											onChange={(event, value) => handleChangeQuater(value)}
											value={quater}
											options={quaterList}
											getOptionLabel={(option) => participantList && option && option.start_date}
											renderInput={(params) => <TextField {...params} variant="outlined" InputLabelProps={{ shrink: false }} />}
										/>
									</Grid>
									<Grid item md={4} xs={12}>
										<div className={classes.top_label} ><label htmlFor="quater_to">Wybierz kwartał do</label></div>
										<Autocomplete
											className={classes.name_select_box}
											id="quater_to"
											onChange={(event, value) => handleChangeQuater(value)}
											value={quater}
											options={quaterList}
											getOptionLabel={(option) => participantList && option && option.end_date}
											renderInput={(params) => <TextField {...params} variant="outlined" InputLabelProps={{ shrink: false }} />}
										/>
									</Grid>
								</Grid>
							</Grid>
            </Grid>
          </Card>
        </Grid>
        <Grid item md={3} xs={12}>
          <Card className={classes.form}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Button variant="outlined" color="secondary" className={classes.btnSave} onClick={handleGenerate}>
                  Generuj raport
                </Button>
                <ExcelFile element={<button id="export" style={{display: 'none'}}>Download Data With Styles</button>}>
                    <ExcelSheet dataSet={result} name="Organization"/>
                </ExcelFile>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </div>
    {
      progressStatus ?
      <>
      <div className={classes.progressContainer}>
        <CircularProgress className={classes.progress}/>
      </div>
      </>
      :
      <></>
    }
    </>
  );
};

export default ReportsService;
