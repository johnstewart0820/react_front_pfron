import React, { useState, useEffect } from 'react';
import useStyles from './style';
import {
  Button, Grid, Card, TextField, CircularProgress, FormControlLabel, Checkbox
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { useToasts } from 'react-toast-notifications'

import { Breadcrumb, SingleSelect, MultiSelect } from 'components';
import users from '../../apis/users';

const UsersEdit = props => {
  const { children } = props;
  const { history } = props;
  const id = props.match.params.id;
  const classes = useStyles();
  const { addToast } = useToasts()
  const breadcrumbs = [{active: true, href: '/', label: 'Ustawienia systemowe'}, {active: true, href: '/users', label: 'Użytkownicy systemu'}, {active: false, label: 'Dodawanie użytkownika'}];
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState(0);
  const [roleList, setRoleList] = useState([]);
  const [activateStatus, setActivateStatus] = useState(false);
  const [progressStatus, setProgressStatus] = useState(false);

  useEffect(() => {
    users.getInfo()
      .then(response => {
        if (response.code === 401) {
          history.push('/login');
        } else {
          setRoleList(response.data.role);
        }
      })
  }, []);

  useEffect(() => {
    users.get(id)
    .then(response => {
      if (response.code === 401) {
        history.push('/login');
      } else {
        setName(response.data.user.name);
        setEmail(response.data.user.email);
        setActivateStatus(response.data.user.activate_status === '1' ? true : false);
        setRole(response.data.user.id_role);
      }
    })
  }, [roleList]);

  const handleBack = () => {
    history.push('/users');
  }

  const handleSave = () => {
    if (name.length === 0 || email.length === 0 || parseInt(role) === 0) {
      addToast('Proszę wpisać wszystkie pola.', { appearance: 'error', autoDismissTimeout: 3000, autoDismiss: true })
    } else {
      setProgressStatus(true);

      users.update(name, email, role, activateStatus, id)
      .then(response => {
        if (response.code === 401) {
          history.push('/login');
        } else {
          addToast(response.message, { appearance: response.code === 200 ? 'success' : 'error', autoDismissTimeout: response.code === 200 ? 1000 : 3000, autoDismiss: true})
          if (response.code === 200) {
            setTimeout(function(){history.push('/users');}, 1000);
          }
          setProgressStatus(false);
        }
      })
    }
  }

  const handleDelete = () => {
    setProgressStatus(true);
    users
      .delete(id)
      .then(response => {
        if (response.code === 401) {
          history.push('/login');
        } else {
          addToast(response.message, { appearance: response.code === 200 ? 'success' : 'error', autoDismissTimeout: response.code === 200 ? 1000 : 3000, autoDismiss: true})
          if (response.code === 200) {
            setTimeout(function(){history.push('/users');}, 1000);
          }
          setProgressStatus(false);
        }
      })
      
  }

  return (
    <>
    <div className={classes.public}>
      <div className={classes.controlBlock}>
        <Breadcrumb list={breadcrumbs} />
        <Button variant="outlined" color="secondary" className={classes.btnBack} onClick={handleBack}>
          Wróć do listy uźytkowników
        </Button>
      </div>
      <Grid container spacing={3} className={classes.formBlock}>
        <Grid item xs={9}>
          <Card className={classes.form}>
            <Grid container spacing={3}>
              <Grid item xs={3} className={classes.form_title}>
                Uźytkownik
              </Grid>
              <Grid item xs={9}>
                <div className={classes.top_label} htmlFor="name">Nazwa użytkownika</div>
                <input className={classes.input_box} type="name" value={name} name="name" onChange={(e) => setName(e.target.value)} />
                <div className={classes.input_box_label} htmlFor="type">E-mail</div>
                <input className={classes.input_box} type="name" value={email} name="name" onChange={(e) => setEmail(e.target.value)} />
                <div className={classes.input_box_label} htmlFor="type">Rola</div>
                <SingleSelect value={role} handleChange={setRole} list={roleList} />
                <FormControlLabel
                  className={classes.rememberMe}
                  control={
                    <Checkbox
                      checked={activateStatus}
                      onChange={() => setActivateStatus(!activateStatus)}
                    />
                  }
                  label="Aktywny"
                />
              </Grid>
            </Grid>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card className={classes.form}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Button variant="outlined" color="secondary" className={classes.btnSave} onClick={handleSave}>
                  Zapisz
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button variant="outlined" color="secondary" className={classes.btnDelete} onClick={handleDelete}>
                  <DeleteIcon/>
                </Button>
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

export default UsersEdit;
