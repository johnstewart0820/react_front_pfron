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
import {SingleSelect} from 'components';
import { withRouter } from 'react-router-dom';
import useStyles from './style';

const SortTable = (props) => {
  const classes = useStyles();
  const {history} = props;
  const { sortBy, sortOrder, requestSort, total, rows, page, selectedCount,searchId, setSearchId, searchName, setSearchName, searchRole, setSearchRole, roleList, searchEmail, setSearchEmail, searchActivateStatus, setSearchActivateStatus, activateStatusList, handleDelete } = props;
  useEffect(() => {
  }, []);

  const getRoleName = (id) => {
    let name = '';
	let arr = id.split(',');
	let _name_arr = [];
    if (!roleList || roleList.length === 0)
      return name;
	for (let i = 0; i < arr.length; i ++) {
		_name_arr.push(roleList[arr[i] - 1].name);
	}
	name = _name_arr.join(', ');
    return name;
  }

  const getActivateStatusName = (id) => {
    let name = '';
    if (!activateStatusList || activateStatusList.length === 0)
      return name;
    name = activateStatusList.map((item, index) => {
      if (parseInt(item.id) === parseInt(id) + 1) {
        return item.name;
      }
    })
    return name;
  }

  return (
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
              Nazwa użytkownika (login)
							</label>
            </TableSortLabel>
          </TableCell>
          <TableCell>
            <TableSortLabel
              active={sortBy === 2}
              direction={sortOrder}
              onClick={() => requestSort(2)}
            >
              Rola
            </TableSortLabel>
          </TableCell>
          <TableCell>
            <TableSortLabel
              active={sortBy === 3}
              direction={sortOrder}
              onClick={() => requestSort(3)}
            >
							<label htmlFor="email">
              E-mail
							</label>
            </TableSortLabel>
          </TableCell>
          <TableCell>
            <TableSortLabel
              active={sortBy === 4}
              direction={sortOrder}
              onClick={() => requestSort(4)}
            >
              Aktywny
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
          <TableCell><input className={classes.input_box} type="id" value={searchId} id="id" name="searchId" onChange={(e) => setSearchId(e.target.value)} /></TableCell>
          <TableCell><input className={classes.input_box} type="name" value={searchName} id="name" name="searchId" onChange={(e) => setSearchName(e.target.value)} /></TableCell>
          <TableCell><SingleSelect value={searchRole} handleChange={setSearchRole} list={roleList} /> </TableCell>
          <TableCell><input className={classes.input_box} type="name" value={searchEmail} id="email" name="searchEmail" onChange={(e) => setSearchEmail(e.target.value)} /></TableCell>
          <TableCell><SingleSelect value={searchActivateStatus} handleChange={setSearchActivateStatus} list={activateStatusList} /></TableCell>
          <TableCell></TableCell>
        </TableRow>
        {rows.map((item, indx) => {
          return (
            <TableRow key={indx} className={classes.root}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{getRoleName(item.id_role)}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>{getActivateStatusName(item.activate_status)}</TableCell>
              <TableCell>
                <IconButton  aria-label={`Edytuj użytkownik systemu ${item.name}`} component="span" className={classes.iconButton} onClick={() => history.push(`/users/edit/${item.id}`)}>
                  <EditOutlinedIcon className={classes.icon}/>
                </IconButton>
                <IconButton variant="outlined" aria-label={`Usuń użytkownik systemu ${item.name}`} component="span" className={classes.iconButton} onClick={() => handleDelete(item.id)}>
                  <DeleteOutlineOutlinedIcon className={classes.icon}/>
                </IconButton>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default withRouter(SortTable);
