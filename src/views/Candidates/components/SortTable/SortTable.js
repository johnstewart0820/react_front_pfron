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
  Grid
} from '@material-ui/core';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import SpeakerNotesOutlinedIcon from '@material-ui/icons/SpeakerNotesOutlined';
import { SingleSelect } from 'components';
import { withRouter } from 'react-router-dom';
import useStyles from './style';
import {
  KeyboardDatePicker, MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { pl } from 'date-fns/locale'
import qualification from 'apis/qualification';

const SortTable = (props) => {
  const classes = useStyles();
  const { history } = props;
  const { sortBy, sortOrder, requestSort, rows, searchId, setSearchId, searchName, setSearchName, searchSurname, setSearchSurname, searchQualificationPoint, setSearchQualificationPoint, qualificationPointList, searchStage, setSearchStage, stageList, searchStatus, setSearchStatus, statusList, searchDateModified, setSearchDateModified, handleDelete } = props;
  useEffect(() => {
  }, []);

  const handleChangeDate = (value, flag) => {
    let _date = new Date(value);
    let _temp = JSON.parse(JSON.stringify(searchDateModified));
    if (flag === 'from')
      _temp.from = value;
    else
      _temp.to = value;
    setSearchDateModified(_temp);
  }

	const getZeroValue = (value) => {
		if (value < 10) 
			return '0' + value;
		return value;
	}

  const getDateTime = (value) => {
    let _date = new Date(value);
		
    return _date.getFullYear() + '.' + getZeroValue(_date.getMonth() + 1) + '.' + getZeroValue(_date.getDate()) + ' ' + getZeroValue(_date.getHours()) + ':' + getZeroValue(_date.getMinutes());
  }

  const getQualificationPointName = (qualification_point_id) => {
	if (parseInt(qualification_point_id) < 1) 
		return '';
	if (! qualificationPointList.length > 0)
		return '';
	for (let i = 0; i < qualificationPointList.length ; i ++) {
		if (parseInt(qualificationPointList[i].id) === parseInt(qualification_point_id))
			return qualificationPointList[i].name;
	}
	return '';
  }
  const goCandidateStep = (id, id_stage) => {
		history.push(`/candidates/info/step${id_stage}/${id}`)
  }
	const handlePreview = (id) => {
		history.push(`/candidates/profile/${id}`)
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
								<label htmlFor="id_candidate">
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
								<label htmlFor="candidate_firstname">
									Imię kandydata
								</label>
            </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 2}
                direction={sortOrder}
                onClick={() => requestSort(2)}
              >
								<label htmlFor="candidate_lastname">
									Nazwisko kandydata
								</label>
            </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 3}
                direction={sortOrder}
                onClick={() => requestSort(3)}
              >
                Punkt kwalifikacyjny
            </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 4}
                direction={sortOrder}
                onClick={() => requestSort(4)}
              >
                Etap rekutacji
            </TableSortLabel>
            </TableCell>
						<TableCell>
              <TableSortLabel
                active={sortBy === 5}
                direction={sortOrder}
                onClick={() => requestSort(5)}
              >
                Status
						</TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 6}
                direction={sortOrder}
                onClick={() => requestSort(6)}
              >
								<label htmlFor="date">
									Data modyfikacji
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
            <TableCell><input className={classes.input_box} type="id" value={searchId} name="searchId" id="id_candidate" onChange={(e) => setSearchId(e.target.value)} /></TableCell>
            <TableCell><input className={classes.input_box} type="name" value={searchName} name="searchId" id="candidate_firstname" onChange={(e) => setSearchName(e.target.value)} /></TableCell>
            <TableCell><input className={classes.input_box} type="name" value={searchSurname} name="searchId" id="candidate_lastname" onChange={(e) => setSearchSurname(e.target.value)} /></TableCell>
            <TableCell><SingleSelect value={searchQualificationPoint} handleChange={setSearchQualificationPoint} list={qualificationPointList} /></TableCell>
            <TableCell><SingleSelect value={searchStage} handleChange={setSearchStage} list={stageList} /></TableCell>
						<TableCell><SingleSelect value={searchStatus} handleChange={setSearchStatus} list={statusList} /></TableCell>
            <TableCell>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="dd.MM.yyyy"
                    margin="normal"
                    id="date"
                    value={searchDateModified.from}
                    onChange={(e) => handleChangeDate(e, 'from')}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
										className={classes.date_picker}
                  />
                </Grid>
                <Grid item xs={6}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="dd.MM.yyyy"
                    margin="normal"
                    id="date"
                    value={searchDateModified.to}
                    onChange={(e) => handleChangeDate(e, 'to')}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
										className={classes.date_picker}
                  />
                </Grid>
              </Grid>
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
          {rows.map((item, indx) => {
            return (
              <TableRow key={indx} className={classes.root}>
                <TableCell onClick={() => handlePreview(item.id)}>{item.id}</TableCell>
                <TableCell onClick={() => handlePreview(item.id)}>{item.name}</TableCell>
                <TableCell onClick={() => handlePreview(item.id)}>{item.surname}</TableCell>
                <TableCell onClick={() => handlePreview(item.id)}>{getQualificationPointName(item.qualification_point)}</TableCell>
                <TableCell onClick={() => handlePreview(item.id)}>{stageList && stageList.length > 0 && stageList[item.stage - 1].name}</TableCell>
								<TableCell onClick={() => handlePreview(item.id)}>{statusList && statusList.length > 0 && statusList[item.id_status - 1].name}</TableCell>
                <TableCell onClick={() => handlePreview(item.id)}>{getDateTime(item.updated_at)}</TableCell>
                <TableCell>
                  <IconButton aria-label={`Edytuj kandydata ${item.name + ' ' + item.surname}`} component="span" className={classes.iconButton} onClick={() => history.push(`/candidates/edit/${item.id}`)}>
                    <EditOutlinedIcon className={classes.icon} />
                  </IconButton>
                  <IconButton variant="outlined" aria-label={`Pokaż informacje o kandydacie ${item.name + ' ' + item.surname}`} component="span" className={classes.iconButton} onClick={() => goCandidateStep(item.id, item.stage)}>
                    <SpeakerNotesOutlinedIcon className={classes.icon} />
                  </IconButton>
                  <IconButton variant="outlined" aria-label={`Usuń kandydata ${item.name + ' ' + item.surname}`} component="span" className={classes.iconButton} onClick={() => handleDelete(item.id)}>
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
