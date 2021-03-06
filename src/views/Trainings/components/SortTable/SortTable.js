import React, { useEffect } from 'react';
import {
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
	TableFooter,
	TableSortLabel,
	IconButton,
	TextField
} from '@material-ui/core';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import { SingleSelect } from 'components';
import { withRouter } from 'react-router-dom';
import useStyles from './style';
import { Alert } from 'components';

import {
	KeyboardDatePicker, MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { pl } from 'date-fns/locale'
import { Autocomplete } from '@material-ui/lab';

const SortTable = (props) => {
	const classes = useStyles();
	const { history } = props;
	const {
		sortBy, sortOrder, requestSort, total, rows, page, selectedCount,
		searchId,
		setSearchId,
		searchName,
		setSearchName,
		searchParticipant,
		setSearchParticipant,
		participantList,
		searchTrainingStatus,
		setSearchTrainingStatus,
		trainingStatusList,
		searchScheduleDate,
		setSearchScheduleDate,
		handleDelete
	} = props;
	useEffect(() => {
	}, []);

	const getParticipantStr = (str) => {
		if (str == null) {
			str = '';
		}
		if (!participantList || participantList.length == 0)
			return '';
		let list = str.split(',');
		let res_list = [];
		list.map((item, index) => {
			for (let i = 0; i < participantList.length; i++) {
				if (parseInt(item) === parseInt(participantList[i].id)) {
					res_list.push(participantList[i].name);
				}
			}

		});
		return res_list.join(', ');
	}

	return (
		<MuiPickersUtilsProvider utils={DateFnsUtils} locale={pl}>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>
							<TableSortLabel
								active={sortBy === 0}
								direction={sortOrder}
								onClick={() => requestSort(0)}
							>
								<label htmlFor="id">
									ID
								</label>
            </TableSortLabel>
						</TableCell>
						<TableCell>
							<TableSortLabel
								active={sortBy === 1}
								direction={sortOrder}
								onClick={() => requestSort(1)}
							>
								<label htmlFor="name">
									Nazwa
								</label>
            </TableSortLabel>
						</TableCell>
						<TableCell>
							<TableSortLabel
								active={sortBy === 2}
								direction={sortOrder}
								onClick={() => requestSort(2)}
							>
								Zapisani uczestnicy
            </TableSortLabel>
						</TableCell>
						<TableCell>
							<TableSortLabel
								active={sortBy === 3}
								direction={sortOrder}
								onClick={() => requestSort(3)}
							>
								Zaakceptowane
            </TableSortLabel>
						</TableCell>
						<TableCell className={classes.cell_removable}>
							<TableSortLabel
								active={sortBy === 4}
								direction={sortOrder}
								onClick={() => requestSort(4)}
							>
								<label htmlFor="date">
									Data rozpocz??cia - DD.MM.RRRR
								</label>
            </TableSortLabel>
						</TableCell>
						<TableCell>
							<TableSortLabel align="right">
								Akcje
            </TableSortLabel>
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					<TableRow>
						<TableCell><input className={classes.input_box} type="id" id="id" value={searchId} name="searchId" onChange={(e) => setSearchId(e.target.value)} /></TableCell>
						<TableCell><input className={classes.input_box} type="name" id="name" value={searchName} name="searchId" onChange={(e) => setSearchName(e.target.value)} /></TableCell>
						<TableCell>
							<Autocomplete
								className={classes.name_select_box}
								id="number"
								onChange={(event, value) => setSearchParticipant(value)}
								value={searchParticipant}
								options={participantList}
								getOptionLabel={(option) => participantList && option && option.name}
								renderInput={(params) => <TextField {...params} variant="outlined" InputLabelProps={{ shrink: false }} />}
							/>
						</TableCell>
						<TableCell><SingleSelect value={searchTrainingStatus} handleChange={setSearchTrainingStatus} list={trainingStatusList} /></TableCell>
						<TableCell className={classes.cell_removable}>
							<KeyboardDatePicker
								disableToolbar
								id="date"
								variant="inline"
								format="dd.MM.yyyy"
								aria-label="uczestnik planuje termin szkolenia - Format wprowadzania daty DD.MM.RRRR"
								margin="normal"
								value={searchScheduleDate}
								onChange={setSearchScheduleDate}
								KeyboardButtonProps={{
									'aria-label': 'Zmie?? dat??',
								}}
								className={classes.date_picker}
							/>
						</TableCell>
						<TableCell></TableCell>
					</TableRow>
					{rows.map((item, indx) => {
						return (
							<TableRow key={indx} className={classes.root}>
								<TableCell onClick={() => history.push(`/trainings/edit/${item.id}`)}>{item.id}</TableCell>
								<TableCell onClick={() => history.push(`/trainings/edit/${item.id}`)}>{item.name}</TableCell>
								<TableCell onClick={() => history.push(`/trainings/edit/${item.id}`)}>{getParticipantStr(item.participant)}</TableCell>
								<TableCell onClick={() => history.push(`/trainings/edit/${item.id}`)}>{trainingStatusList && trainingStatusList.length > 0 && trainingStatusList[item.training_status - 1].name}</TableCell>
								<TableCell onClick={() => history.push(`/trainings/edit/${item.id}`)} className={classes.cell_removable}>{item.date}</TableCell>
								<TableCell>
									<IconButton aria-label={`Edytuj szkolenie ${item.name}`} component="span" className={classes.iconButton} onClick={() => history.push(`/trainings/edit/${item.id}`)}>
										<EditOutlinedIcon className={classes.icon} />
									</IconButton>
									<IconButton variant="outlined" aria-label={`Usu?? szkolenie ${item.name}`} component="span" className={classes.iconButton} onClick={() => handleDelete(item.id)}>
										<DeleteOutlineOutlinedIcon className={classes.icon} />
									</IconButton>
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</MuiPickersUtilsProvider>
	);
};

export default withRouter(SortTable);
