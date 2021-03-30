import React, { useState, useEffect } from 'react';
import useStyles from './style';
import {
  Button, Grid, Card, TextField, CircularProgress
} from '@material-ui/core';
import { useToasts } from 'react-toast-notifications'
import { Breadcrumb, SingleSelect } from 'components';
import DeleteIcon from '@material-ui/icons/Delete';
import payment from '../../apis/payment';

const PaymentsEdit = props => {
  const { children } = props;
  const id = props.match.params.id;
  const { history } = props;
  const classes = useStyles();
  const { addToast, removeAllToasts } = useToasts()
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

  useEffect(() => {
    payment.get(id)
    .then(response => {
      if (response.code === 401) {
        history.push('/login');
      } else {
        setValue(response.data.payment.value);
        setRehabitationCenter(response.data.payment.rehabitation_center);
        setService(response.data.payment.service);
      }
    })
  }, [serviceList]);

  const handleBack = () => {
    history.push('/payments');
  }

  const handleSave = () => {
     removeAllToasts();
       removeAllToasts();
    if (isNaN(value) || parseInt(rehabitationCenter) === 0 || parseInt(service) === 0) {
      addToast(<label>Proszę wypełnić wszystkie wymagane pola.</label>, { appearance: 'error', autoDismissTimeout: 3000, autoDismiss: false })
    } else {
      setProgressStatus(true);

      payment.update(value, rehabitationCenter, service, id)
      .then(response => {
        if (response.code === 401) {
          history.push('/login');
        } else {
          addToast(<label>{response.message}</label>, { appearance: response.code === 200 ? 'success' : 'error', autoDismissTimeout: response.code === 200 ? 1000 : 3000, autoDismiss: response.code === 200 ? true : false})
          if (response.code === 200) {
            setTimeout(function(){history.push('/payments');}, 1000);
          }
          setProgressStatus(false);
        }
      })
    }
  }

  const handleDelete = () => {
    removeAllToasts();
    setProgressStatus(true);
    payment
      .delete(id)
      .then(response => {
        if (response.code === 401) {
          history.push('/login');
        } else {
          addToast(<label>{response.message}</label>, { appearance: response.code === 200 ? 'success' : 'error', autoDismissTimeout: response.code === 200 ? 1000 : 3000, autoDismiss: response.code === 200 ? true : false})
          if (response.code === 200) {
            setTimeout(function(){history.push('/payments');}, 1000);
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
        <Grid item md={9} xs={12}>
          <Card className={classes.form}>
            <Grid container spacing={3}>
              <Grid item md={3} xs={12} className={classes.form_title}>
                Dane podstawowe
              </Grid>
              <Grid item md={9} xs={12}>
                <div className={classes.top_label}><label htmlFor="value">Wysokość kosztu</label></div>
                <input className={classes.input_box} type="name" value={value} id="value" name="name" onChange={(e) => setValue(e.target.value)} />
                <div className={classes.input_box_label} htmlFor="type">Wybierz ORK</div>
                <SingleSelect value={rehabitationCenter} handleChange={setRehabitationCenter} list={rehabitationCenterList} />
                <div className={classes.input_box_label} htmlFor="ambassador">Wybierz usługę</div>
                <SingleSelect value={service} handleChange={setService} list={serviceList} />
              </Grid>
            </Grid>
          </Card>
        </Grid>
        <Grid item md={3} xs={12}>
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

export default PaymentsEdit;
