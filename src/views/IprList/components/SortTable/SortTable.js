import React, { useEffect } from 'react';
import {
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
	TableFooter,
	TableSortLabel,
	IconButton
} from '@material-ui/core';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import { SingleSelect } from 'components';
import { withRouter } from 'react-router-dom';
import useStyles from './style';
import { Alert } from 'components';

import {
	KeyboardDatePicker, MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { pl } from 'date-fns/locale';
import DateFnsUtils from '@date-io/date-fns';

const SortTable = (props) => {
	const classes = useStyles();
	const { history } = props;
	const { sortBy, sortOrder, requestSort, rows, searchId, setSearchId, searchName, setSearchName, searchIprType, setSearchIprType, iprTypeList, searchNumber, setSearchNumber, searchCreatedAt, setSearchCreatedAt, searchScheduleDate, setSearchScheduleDate, handleDelete, handleDuplicate } = props;
	useEffect(() => {
	}, []);

	const getDate = (value) => {
		let _date = new Date(value);
		let month = (_date.getMonth() + 1);
		let date = _date.getDate();
		if (month < 10) {
			month = '0' + month;
		}
		if (date < 10) {
			date = '0' + date;
		}
		return _date.getFullYear() + '-' + month + '-' + date;
	}

	const handleEdit = (item) => {
		history.push(parseInt(item.ipr_type) !== 1 ? `/ipr_list/plan/edit/${item.id}` : `/ipr_list/balance/edit/${item.id}`);
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
									Imię i nazwisko uczestnika
								</label>
            </TableSortLabel>
						</TableCell>
						<TableCell>
							<TableSortLabel
								active={sortBy === 2}
								direction={sortOrder}
								onClick={() => requestSort(2)}
							>
								<label htmlFor="ipr_type">
									Typ IPR
								</label>
            </TableSortLabel>
						</TableCell>
						<TableCell className={classes.cell_removable}>
							<TableSortLabel
								active={sortBy === 3}
								direction={sortOrder}
								onClick={() => requestSort(3)}
							>
								<label htmlFor="number">
									Numer
								</label>
            </TableSortLabel>
						</TableCell>
						<TableCell className={classes.cell_removable}>
							<TableSortLabel
								active={sortBy === 4}
								direction={sortOrder}
								onClick={() => requestSort(4)}
							>
								<label htmlFor="start_date">
									Data powstania- DD.MM.RRRR
								</label>
            </TableSortLabel>
						</TableCell>
						<TableCell className={classes.cell_removable}>
							<TableSortLabel
								active={sortBy === 5}
								direction={sortOrder}
								onClick={() => requestSort(5)}
							>
								<label htmlFor="end_date">
									Data wypełnienia - DD.MM.RRRR
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
						<TableCell><SingleSelect value={searchIprType} handleChange={setSearchIprType} list={iprTypeList} /> </TableCell>
						<TableCell className={classes.cell_removable}><input className={classes.input_box} id="number" type="name" value={searchNumber} name="searchId" onChange={(e) => setSearchNumber(e.target.value)} /></TableCell>
						<TableCell className={classes.cell_removable}>
							<KeyboardDatePicker
								disableToolbar
								variant="inline"
								format="dd.MM.yyyy"
								aria-label="utworzono datę wyszukiwania specjalnych iprs - Format wprowadzania daty DD.MM.RRRR"
								margin="normal"
								id="start_date"
								value={searchCreatedAt}
								onChange={(e) => setSearchCreatedAt(getDate(e))}
								KeyboardButtonProps={{
									'aria-label': 'Zmień datę',
								}}
								className={classes.date_picker}
							/>
						</TableCell>
						<TableCell className={classes.cell_removable}>
							<KeyboardDatePicker
								disableToolbar
								variant="inline"
								format="dd.MM.yyyy"
								aria-label="zaplanuj datę wyszukiwania specjalnych iprs - Format wprowadzania daty DD.MM.RRRR"
								margin="normal"
								id="end_date"
								value={searchScheduleDate}
								onChange={(e) => setSearchScheduleDate(getDate(e))}
								KeyboardButtonProps={{
									'aria-label': 'Zmień datę',
								}}
								className={classes.date_picker}
							/>
						</TableCell>
						<TableCell></TableCell>
					</TableRow>
					{rows.map((item, indx) => {
						return (
							<TableRow key={indx} className={classes.root}>
								<TableCell onClick={() => handleEdit(item)}>{item.id}</TableCell>
								<TableCell onClick={() => handleEdit(item)}>{item.name}</TableCell>
								<TableCell onClick={() => handleEdit(item)}>{iprTypeList && iprTypeList.length > 0 && iprTypeList[item.ipr_type - 1].name}</TableCell>
								<TableCell onClick={() => handleEdit(item)} className={classes.cell_removable}>{item.number}</TableCell>
								<TableCell onClick={() => handleEdit(item)} className={classes.cell_removable}>{getDate(item.created_at)}</TableCell>
								<TableCell onClick={() => handleEdit(item)} className={classes.cell_removable}>{getDate(item.schedule_date)}</TableCell>
								<TableCell>
									<IconButton aria-label={`Edytuj IPR ${item.name}`} component="span" className={classes.iconButton} 
										onClick={() => handleEdit(item)
									}>
										<EditOutlinedIcon className={classes.icon} />
									</IconButton>
									<IconButton variant="outlined" aria-label={`Zduplikuj IPR ${item.name}`} component="span" className={classes.iconButton} onClick={() => handleDuplicate(item.id)}>
										<FileCopyOutlinedIcon className={classes.icon} />
									</IconButton>
									<IconButton variant="outlined" aria-label={`Usuń IPR ${item.name}`} component="span" className={classes.iconButton} onClick={() => handleDelete(item.id)}>
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
