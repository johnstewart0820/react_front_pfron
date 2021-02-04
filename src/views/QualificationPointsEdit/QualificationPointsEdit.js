import React, { useState, useEffect } from 'react';
import useStyles from './style';
import {
  Button, Grid, Card, TextField, CircularProgress
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { useToasts } from 'react-toast-notifications'
import { Autocomplete } from '@material-ui/lab';

import { Breadcrumb, SingleSelect, MultiSelect } from 'components';
import qualification from '../../apis/qualification';

const QualificationPointsEdit = props => {
  const { children } = props;
  const { history } = props;
  const id = props.match.params.id;
  const classes = useStyles();
  const { addToast } = useToasts()
  const breadcrumbs = [{ active: true, label: 'Punkty kwalifikacyjne', href: '/qualification_points' }, { active: false, label: 'Dodaj Punkt' }];
  const [name, setName] = useState('');
  const [type, setType] = useState(0);
  const [typeList, setTypeList] = useState([]);
  const [ambassador, setAmbassador] = useState([]);
  const [ambassadorList, setAmbassadorList] = useState([]);
  const [progressStatus, setProgressStatus] = useState(false);

  useEffect(() => {
    qualification.getInfo()
      .then(response => {
        if (response.code === 401) {
          history.push('/login');
        } else {
          setTypeList(response.data.type);
          setAmbassadorList(response.data.ambassadors);
        }
      })
  }, []);

  useEffect(() => {
    qualification.get(id)
    .then(response => {
      if (response.code === 401) {
        history.push('/login');
      } else {
        setName(response.data.qualification_point.name);
        setType(response.data.qualification_point.type);
        let list = response.data.qualification_point.ambassador.split(',');
        let ambass_list = [];
        ambassadorList.map((item, index) => {
          for (let i = 0; i < list.length; i ++) {
            if (parseInt(list[i]) === parseInt(item.id)) {
              ambass_list.push(item);
            }
          }
        })
        setAmbassador(ambass_list);
      }
    })
  }, [ambassadorList]);

  const handleBack = () => {
    history.push('/qualification_points');
  }

  const handleSave = () => {
    if (name.length === 0 || parseInt(type) === 0 || ambassador.length === 0) {
      addToast('Proszę wpisać wszystkie pola.', { appearance: 'error', autoDismissTimeout: 3000, autoDismiss: true })
    } else {
      setProgressStatus(true);
      let ambassador_arr = [];
      ambassador.map((item, index) => {
        ambassador_arr.push(item.id);
      })

      qualification.update(name, type, ambassador_arr, id)
      .then(response => {
        if (response.code === 401) {
          history.push('/login');
        } else {
          addToast(response.message, { appearance: response.code === 200 ? 'success' : 'error', autoDismissTimeout: response.code === 200 ? 1000 : 3000, autoDismiss: true})
          if (response.code === 200) {
            setTimeout(function(){history.push('/qualification_points');}, 1000);
          }
          setProgressStatus(false);
        }
      })
    }
  }

  const handleDelete = () => {
    setProgressStatus(true);
    qualification
      .delete(id)
      .then(response => {
        if (response.code === 401) {
          history.push('/login');
        } else {
          addToast(response.message, { appearance: response.code === 200 ? 'success' : 'error', autoDismissTimeout: response.code === 200 ? 1000 : 3000, autoDismiss: true})
          if (response.code === 200) {
            setTimeout(function(){history.push('/qualification_points');}, 1000);
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
          Wróć do listy punktów
        </Button>
      </div>
      <Grid container spacing={3} className={classes.formBlock}>
        <Grid item xs={9}>
          <Card className={classes.form}>
            <Grid container spacing={3}>
              <Grid item xs={3} className={classes.form_title}>
                Dane podstawowe
              </Grid>
              <Grid item xs={9}>
                <div className={classes.top_label} htmlFor="name">Nazwa punktu</div>
                <input className={classes.input_box} type="name" value={name} name="name" onChange={(e) => setName(e.target.value)} />
                <div className={classes.input_box_label} htmlFor="type">Typ punktu</div>
                <SingleSelect value={type} handleChange={setType} list={typeList} />
                <div className={classes.input_box_label} htmlFor="ambassador">Ambasadorzy</div>
                <Autocomplete
                  multiple
                  className={classes.name_select_box}
                  value={ambassador}
                  onChange={(event, value) => setAmbassador(value ? value : [])}
                  options={ambassadorList}
                  getOptionLabel={(option) => ambassadorList && option && option.name}
                  renderInput={(params) => <TextField {...params} variant="outlined" InputLabelProps={{ shrink: false }} />}
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

export default QualificationPointsEdit;
