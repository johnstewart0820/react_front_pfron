import React, { useState, useEffect } from 'react';
import useStyles from './style';
import {
  Button, Grid, Card, TextField, CircularProgress
} from '@material-ui/core';
import { useToasts } from 'react-toast-notifications'
import { Breadcrumb, SingleSelect } from 'components';
import payment from '../../apis/payment';

const PaymentsAdd = props => {
  const { children } = props;
  const { history } = props;
  const classes = useStyles();
  const { addToast } = useToasts()
  const breadcrumbs = [{ active: true, label: 'Finanse', href: '/' },{ active: true, label: 'Zdefiniowane koszty usług', href: '/payments' }, { active: false, label: 'Dodaj koszt' }];
  const [value, setValue] = useState('');
  const [rehabitationCenter, setRehabitationCenter] = useState(0);
  const [rehabitationCenterList, setRehabitationCenterList] = useState([]);
  const [service, setService] = useState(0);
  const [serviceList, setServiceList] = useState([]);
  const [progressStatus, setProgressStatus] = useState(false);

  useEffect(() => {
    payment.getInfo()
      .then(response => {
        if (response.code === 401) {
          history.push('/login');
        } else {
          setRehabitationCenterList(response.data.rehabitation_center);
          setServiceList(response.data.service);
        }
      })
  }, []);

  const handleBack = () => {
    history.push('/payments');
  }

  const handleSave = () => {
    if (isNaN(value) || parseInt(rehabitationCenter) === 0 || parseInt(service) === 0) {
      addToast(<label>Proszę wypełnić wszystkie wymagane pola.</label>, { appearance: 'error', autoDismissTimeout: 3000, autoDismiss: true })
    } else {
      setProgressStatus(true);

      payment.create(value, rehabitationCenter, service)
      .then(response => {
        if (response.code === 401) {
          history.push('/login');
        } else {
          addToast(<label>{response.message}</label>, { appearance: response.code === 200 ? 'success' : 'error', autoDismissTimeout: response.code === 200 ? 1000 : 3000, autoDismiss: true})
          if (response.code === 200) {
            setTimeout(function(){history.push('/payments');}, 1000);
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
                <div className={classes.top_label}><label  htmlFor="value">Wysokość kosztu</label></div>
                <input className={classes.input_box} type="name" id="value" value={value} name="name" onChange={(e) => setValue(e.target.value)} />
                <div className={classes.input_box_label} htmlFor="type">Wybierz ORK</div>
                <SingleSelect value={rehabitationCenter} handleChange={setRehabitationCenter} list={rehabitationCenterList} />
                <div className={classes.input_box_label} htmlFor="ambassador">Wybierz usługę</div>
                <SingleSelect value={service} handleChange={setService} list={serviceList} />
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

export default PaymentsAdd;
