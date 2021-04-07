import React, { useState, useEffect } from 'react';
import useStyles from './style';
import { Alert } from 'components';
import {
  Button, Grid, Card, TextField, CircularProgress
} from '@material-ui/core';

import { Breadcrumb, SingleSelect } from 'components';
import payment from '../../apis/payment';

const PaymentsAdd = props => {
  const { children } = props;
  const { history } = props;
  const classes = useStyles();
  
  const breadcrumbs = [{ active: true, label: 'Finanse', href: '/payments' },{ active: true, label: 'Zdefiniowane koszty usług', href: '/payments' }, { active: false, label: 'Dodaj koszt' }];
  const [value, setValue] = useState('');
  const [rehabitationCenter, setRehabitationCenter] = useState(0);
  const [rehabitationCenterList, setRehabitationCenterList] = useState([]);
  const [service, setService] = useState(0);
  const [serviceList, setServiceList] = useState([]);
  	const [hasAlert, setHasAlert] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [message, setMessage] = useState('');
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
      			setHasAlert(true);
			setMessage('Proszę wypełnić wszystkie wymagane pola.');
			setIsSuccess(false);
    } else {
      setProgressStatus(true);

      payment.create(value, rehabitationCenter, service)
      .then(response => {
        if (response.code === 401) {
          history.push('/login');
        } else {
          				setHasAlert(true);
				setMessage(response.message);
				setIsSuccess(response.code === 200);
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
        <Button variant="outlined" color="secondary" id="main"  className={classes.btnBack} onClick={handleBack}>          Wróć do listy punktów
        </Button>
      </div>
			<Alert 
					hasAlert={hasAlert}
					setHasAlert={setHasAlert}
					isSuccess={isSuccess}
					message={message}
				/>
      <Grid container spacing={3} className={classes.formBlock}>
        <Grid item md={9} xs={12}>
          <Card className={classes.form}>
            <Grid container spacing={3}>
              <Grid item md={3} xs={12} className={classes.form_title}>
                Dane podstawowe
              </Grid>
              <Grid item md={9} xs={12}>
                <div className={classes.top_label}><label  htmlFor="value">Cena jednostkowa</label></div>
                <input className={classes.input_box} type="name" id="value" value={value} name="name" onChange={(e) => setValue(e.target.value)} />
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
