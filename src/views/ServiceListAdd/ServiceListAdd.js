import React, { useState, useEffect } from 'react';
import useStyles from './style';
import {
  Button, Grid, Card, TextField, CircularProgress, FormControlLabel, Checkbox
} from '@material-ui/core';
import { useToasts } from 'react-toast-notifications'
import { Autocomplete } from '@material-ui/lab';

import { Breadcrumb, SingleSelect, MultiSelect } from 'components';
import service_list from '../../apis/service-list';

const ServiceListAdd = props => {
  const { children } = props;
  const { history } = props;
  const classes = useStyles();
  const { addToast } = useToasts()
  const breadcrumbs = [{active: true, href: '/', label: 'Usługi'}, {active: true, label: 'Lista dostępnych usług', href: '/service_list'}, {active:false, label: 'Dodaj Usługę'}];
  const [number, setNumber] = useState('');
  const [name, setName] = useState('');
  const [module, setModule] = useState(0);
  const [moduleList, setModuleList] = useState([]);
  const [amount_usage, setAmountUsage] = useState('');
  const [unit, setUnit] = useState(0);
  const [unitList, setUnitList] = useState([]);
  const [amount_takes, setAmountTakes] = useState('');
  const [is_required, setIsRequired] = useState(false);
  const [not_applicable, setNotApplicable] = useState(false); 
  const [progressStatus, setProgressStatus] = useState(false);

  useEffect(() => {
    service_list.getInfo()
      .then(response => {
        if (response.code === 401) {
          history.push('/login');
        } else {
          setUnitList(response.data.units);
          setModuleList(response.data.modules);
        }
      })
  }, []);

  const handleBack = () => {
    history.push('/service_list');
  }

  const handleSave = () => {
    if (name.length === 0 || number.length === 0 || parseInt(module) === 0 || amount_usage.length === 0 || parseInt(unit) === 0 || amount_takes.length === 0) {
      addToast('Proszę wpisać wszystkie pola.', { appearance: 'error', autoDismissTimeout: 3000, autoDismiss: true })
    } else {
      setProgressStatus(true);

      service_list.create(number, name, module, amount_usage, unit, amount_takes, is_required, not_applicable)
      .then(response => {
        if (response.code === 401) {
          history.push('/login');
        } else {
          addToast(response.message, { appearance: response.code === 200 ? 'success' : 'error', autoDismissTimeout: response.code === 200 ? 1000 : 3000, autoDismiss: true})
          if (response.code === 200) {
            setTimeout(function(){history.push('/service_list');}, 1000);
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
          Wróć do listy specjalistów
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
                <Grid container spacing={1}>
                  <Grid item xs={3}>
                    <div className={classes.top_label} htmlFor="name">Numer</div>
                    <input className={classes.input_box} type="name" value={number} name="name" onChange={(e) => setNumber(e.target.value)} />
                  </Grid>
                  <Grid item xs={9}>
                    <div className={classes.top_label} htmlFor="name">Nazwa usługi</div>
                    <input className={classes.input_box} type="name" value={name} name="name" onChange={(e) => setName(e.target.value)} />
                  </Grid>
                  <Grid item xs={12}>
                    <div className={classes.input_box_label} htmlFor="type">Moduł</div>
                    <SingleSelect value={module} handleChange={setModule} list={moduleList} />
                    <div className={classes.label}>Minimalny zakres usługi</div>
                  </Grid>
                  <Grid item xs={3}>
                    <div className={classes.input_box_label}>Liczba</div>
                    <input className={classes.input_box} type="name" value={amount_usage} name="name" onChange={(e) => setAmountUsage(e.target.value)} />
                  </Grid>
                  <Grid item xs={5}>
                    <div className={classes.input_box_label}>Jednostka</div>
                    <SingleSelect value={unit} handleChange={setUnit} list={unitList} />
                  </Grid>
                  <Grid item xs={4}>
                    <div className={classes.input_box_label}>Czas trwania (w minutach)</div>
                    <input className={classes.input_box} type="name" value={amount_takes} name="name" onChange={(e) => setAmountTakes(e.target.value)} />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      className={classes.rememberMe}
                      control={
                        <Checkbox
                          onChange={() => setIsRequired(!is_required)}
                        />
                      }
                      label="Usluga obowiazkowa"
                    />  
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      className={classes.rememberMe}
                      control={
                        <Checkbox
                          onChange={() => setNotApplicable(!not_applicable)}
                        />
                      }
                      label='Zezwalaj na "Nie dotyczy"'
                    />
                  </Grid>
                </Grid>
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

export default ServiceListAdd;
