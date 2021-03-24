import React, { useState, useEffect } from 'react';
import useStyles from './style';
import {
  Button, Grid, Card, TextField, CircularProgress
} from '@material-ui/core';
import { useToasts } from 'react-toast-notifications'
import { Autocomplete } from '@material-ui/lab';

import { Breadcrumb, SingleSelect, MultiSelect } from 'components';
import qualification from '../../apis/qualification';
import clsx from 'clsx';

const QualificationPointsAdd = props => {
  const { history } = props;
  const classes = useStyles();
  const { addToast } = useToasts()
  const breadcrumbs = [{ active: true, label: 'Punkty kwalifikacyjne', href: '/qualification_points' }, { active: false, label: 'Dodaj Punkt' }];
  const [name, setName] = useState('');
  const [type, setType] = useState(0);
  const [typeList, setTypeList] = useState([]);
  const [ambassador, setAmbassador] = useState([]);
  const [ambassadorList, setAmbassadorList] = useState([]);
  const [progressStatus, setProgressStatus] = useState(false);
  const [error, setError] = useState({});

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

  const handleError = () => {
    let _error = {}
    _error.name = (name.length === 0);
    _error.type = (parseInt(type) === 0);
    setError(_error);
  };

  const handleChangeName = (value) => {
    setName(value);
    let _error = JSON.parse(JSON.stringify(error));
    _error.name = (value.length === 0);
    setError(_error);
  }

  const handleChangeType = (value) => {
    setType(value);
    let _error = JSON.parse(JSON.stringify(error));
    _error.type = (parseInt(value) === 0);
    setError(_error);
  }

  const checkError = () => {
    return name.length === 0 || parseInt(type) === 0;
  }

  const handleBack = () => {
    history.push('/qualification_points');
  }

  const handleSave = () => {
    if (checkError()) {
      addToast(<label>Proszę wypełnić wszystkie wymagane pola.</label>, { appearance: 'error', autoDismissTimeout: 3000, autoDismiss: true })
      handleError();
    } else {
      setProgressStatus(true);
      let ambassador_arr = [];
      ambassador.map((item, index) => {
        ambassador_arr.push(item.id);
      })

      qualification.create(name, type, ambassador_arr)
      .then(response => {
        if (response.code === 401) {
          history.push('/login');
        } else {
          addToast(<label>{response.message}</label>, { appearance: response.code === 200 ? 'success' : 'error', autoDismissTimeout: response.code === 200 ? 1000 : 3000, autoDismiss: true})
          if (response.code === 200) {
            setTimeout(function(){history.push('/qualification_points');}, 1000);
          }
          setProgressStatus(false);
        }
      })
    }
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
                <div className={classes.top_label} ><label htmlFor="name">Nazwa punktu</label></div>
                <input className={clsx({[classes.input_box] : true, [classes.error] : error.name})} type="name" value={name} name="name" id="name" onChange={(e) => handleChangeName(e.target.value)} />
                <div className={classes.input_box_label} htmlFor="type">Typ punktu</div>
                <SingleSelect value={type} handleChange={(value) => handleChangeType(value)} list={typeList} error={error.type} />
                <div className={classes.input_box_label} ><label htmlFor="ambassador">Ambasadorzy</label></div>
                <Autocomplete
                  multiple
                  className={classes.name_select_box}
                  onChange={(event, value) => setAmbassador(value ? value : [])}
                  options={ambassadorList}
                  getOptionLabel={(option) => ambassadorList && option && option.name}
									id="ambassador"
                  renderInput={(params) => <TextField {...params} variant="outlined" InputLabelProps={{ shrink: false }} />}
                />
              </Grid>
            </Grid>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card className={classes.form}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Button variant="outlined" color="secondary" className={classes.btnSave} onClick={handleSave}>
                  Zapisz
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

export default QualificationPointsAdd;
