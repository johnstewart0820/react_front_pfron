import React, { useState, useEffect } from 'react';
import useStyles from './style';
import {
  Button, Grid, Card, CircularProgress, IconButton
} from '@material-ui/core';
import {
  KeyboardDatePicker, MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { pl } from 'date-fns/locale';
import { useToasts } from 'react-toast-notifications'

import { Breadcrumb } from 'components';
import rehabitation_center from '../../apis/rehabitation-center';
import ControlPointIcon from '@material-ui/icons/ControlPoint';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

const OrkListEdit = props => {
  const { history } = props;
  const id = props.match.params.id;
  const classes = useStyles();
  const { addToast } = useToasts()
  const breadcrumbs = [{ active: true, label: 'Finanse', href: '/' }, { active: true, label: 'Lista Ośrodków Rehabilitacji Kompleksowej', href: '/ork_list' }, { active: false, label: 'Dodaj ośrodek' }];
  const [rehabitationCenter, setRehabitationCenter] = useState({});
  const [quaterList, setQuaterList] = useState('[]');
  const [partners, setPartners] = useState('[]');
  const [partnerErrors, setPartnerErrors] = useState('[]');
  const [rehabitationCenterError, setRehabitationCenterError] = useState({});
  const [firstLogin, setFirstLogin] = useState(false);
  const [progressStatus, setProgressStatus] = useState(false);
  useEffect(() => {
    rehabitation_center.get(id)
      .then(response => {
        if (response.code === 401) {
          history.push('/login');
        } else {
          setRehabitationCenter(response.data.rehabitation_center);
          setQuaterList(JSON.stringify(response.data.quaters));
          setPartners(JSON.stringify(response.data.partners));
        }
      })
  }, []);

  const handleBack = () => {
    history.push('/ork_list');
  }

  const handleSave = () => {
    setFirstLogin(true);
    if (rehabitationCenterError.leader_nip_number !== true || rehabitationCenterError.leader_regon_number !== true || rehabitationCenterError.email !== true) {
      addToast(<label>Proszę wypełnić wszystkie wymagane pola.</label>, { appearance: 'error', autoDismissTimeout: 3000, autoDismiss: true })
      return;
    }
    let arr = JSON.parse(partnerErrors);
    for (let i = 0; i < arr.length; i ++) {
      if (arr[i].nip !== true || arr[i].regon !== true) {
        addToast(<label>Proszę wypełnić wszystkie wymagane pola.</label>, { appearance: 'error', autoDismissTimeout: 3000, autoDismiss: true })
        return;
      }
    }
    setProgressStatus(true);

    rehabitation_center.update(JSON.parse(quaterList), JSON.parse(partners), rehabitationCenter, id)
    .then(response => {
      if (response.code === 401) {
        history.push('/login');
      } else {
        addToast(<label>{response.message}</label>, { appearance: response.code === 200 ? 'success' : 'error', autoDismissTimeout: response.code === 200 ? 1000 : 3000, autoDismiss: true})
        if (response.code === 200) {
          setTimeout(function(){history.push('/ork_list');}, 1000);
        }
        setProgressStatus(false);
      }
    })
  }

  const handleDateChange = (date, index, flag) => {
    let arr = JSON.parse(quaterList);
    let _date = new Date(date);
    if (flag === 'from') {
      arr[index].start_date = _date.getFullYear() + '-' + (_date.getMonth() + 1) + '-' + (_date.getDate());
    } else {
      arr[index].end_date = _date.getFullYear() + '-' + (_date.getMonth() + 1) + '-' + (_date.getDate());
    }
    setQuaterList(JSON.stringify(arr));
  }

  const handleAddQuater = () => {
    let arr = JSON.parse(quaterList);
    let date = new Date();
    arr[arr.length] = { 'start_date': date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(), 'end_date': date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() };
    setQuaterList(JSON.stringify(arr));
  }

  const handleDeleteQuater = (index) => {
    let arr = JSON.parse(quaterList);
    let arr_res = [];
    arr.map((item, i) => {
      if (i !== index) {
        arr_res.push(item);
      }
    });
    setQuaterList(JSON.stringify(arr_res));
  }

  function validateregon9(regon) {
    var reg = /^[0-9]{9}$/;
    if(!reg.test(regon)) 
        return false;
    else
    {
        var digits = (""+regon).split("");
        var checksum = (8*parseInt(digits[0]) + 9*parseInt(digits[1]) + 2*parseInt(digits[2]) + 3*parseInt(digits[3]) + 4*parseInt(digits[4]) + 5*parseInt(digits[5]) + 6*parseInt(digits[6]) + 7*parseInt(digits[7]))%11;
        if(checksum == 10) 
            checksum = 0;
         
        return (parseInt(digits[8])==checksum);
    }
  }
  
  function validatenip(nip) {
    var nipWithoutDashes = nip.replace(/-/g,"");
    var reg = /^[0-9]{10}$/;
    if(reg.test(nipWithoutDashes) == false) {
        return false;}
    else
    {
        var digits = (""+nipWithoutDashes).split("");
        var checksum = (6*parseInt(digits[0]) + 5*parseInt(digits[1]) + 7*parseInt(digits[2]) + 2*parseInt(digits[3]) + 3*parseInt(digits[4]) + 4*parseInt(digits[5]) + 5*parseInt(digits[6]) + 6*parseInt(digits[7]) + 7*parseInt(digits[8]))%11;
         
        return (parseInt(digits[9])==checksum);
    }
}

  const handleChange = (event) => {
    let arr = JSON.parse(JSON.stringify(rehabitationCenter));
    let arr_err = JSON.parse(JSON.stringify(rehabitationCenterError));
    arr[event.target.name] = event.target.value;
    if (event.target.name === 'leader_regon_number') {
      arr_err[event.target.name] = validateregon9(event.target.value);
    } else if (event.target.name === 'leader_nip_number') {
      arr_err[event.target.name] = validatenip(event.target.value);
    } else if (event.target.name === 'email') {
      var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
      arr_err[event.target.name] = pattern.test(event.target.value);
    }
    setRehabitationCenter(arr);
    setRehabitationCenterError(arr_err);
  } 

  const handleChangePartnerCount = (event) => {
    let count = parseInt(event.target.value);
    if (isNaN(count))
      count = 0;
    if (count < 0 ) 
      count = 0;
    if (count > 10)
      count = 10;
    let arr = JSON.parse(partners);
    let arr_res = JSON.parse(JSON.stringify(arr));
    let arr_err = JSON.parse(partnerErrors);
    let arr_err_res = JSON.parse(JSON.stringify(arr_err));
    if (arr.length > count) {
      for (let i = 0; i <  arr.length - count; i ++) {
        arr_res.pop();
        arr_err_res.pop();
      }
    } else {
      for (let i = 0; i < count - arr.length ; i ++) {
        arr_res.push({'name' : '', 'regon' : '', 'nip' : ''});
        arr_err_res.push({'regon' : false, 'nip' : false});
      }
    }
    setPartnerErrors(JSON.stringify(arr_err_res));
    setPartners(JSON.stringify(arr_res));
  }

  const handlePartnerChange = (value, index, type) => {
    let arr = JSON.parse(partners);
    let error_arr = JSON.parse(partnerErrors);
    arr[index][type] = value;
    if (type === 'regon') {
        error_arr[index][type] = validateregon9(value);
    } else if (type == 'nip') {
      error_arr[index][type] = validatenip(value);
    }
    setPartnerErrors(JSON.stringify(error_arr));
    setPartners(JSON.stringify(arr)); 
  }

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={pl}>
      <div className={classes.public}>
        <div className={classes.controlBlock}>
          <Breadcrumb list={breadcrumbs} />
          <Button variant="outlined" color="secondary" className={classes.btnBack} onClick={handleBack}>
            Wróć do listy ośrodków
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
                  <div className={classes.top_label} htmlFor="name">Nazwa ORK</div>
                  <div className={classes.name}>{rehabitationCenter.name}</div>
                </Grid>
                <div className={classes.divide} />
                <Grid item xs={3} className={classes.form_title}>
                  Kwartały
              </Grid>
              <Grid item xs={9}>
                <Grid container spacing={2}>
                  {
                    JSON.parse(quaterList).map((item, index) => (
                      <Grid item xs={6} className={classes.quater}>
                        <div className={classes.quater_title}>
                          Kwartał {index + 1}
                        </div>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <div className={classes.title}>
															<label htmlFor={`start_date${index}`}>
																Data rozpocęcia
															</label>
                          	</div>
                            <Grid item xs={12}>
                              <KeyboardDatePicker
                                className={classes.date_picker}
                                disableToolbar
                                variant="inline"
                                format="dd.MM.yyyy"
                                margin="normal"
                                id={`start_date${index}`}
                                value={item.start_date}
                                onChange={(e) => handleDateChange(e, index, "from")}
                                KeyboardButtonProps={{
                                  'aria-label': 'change date',
                                }}
                              />
                            </Grid>
                          </Grid>
                          <Grid item xs={6}>
                            <div className={classes.title}>
															<label htmlFor={`end_date${index}`}>
																Data zakończenia
															</label>
                            </div>
                            <Grid item xs={12}>
                              <KeyboardDatePicker
                                className={classes.date_picker}
                                disableToolbar
                                variant="inline"
                                format="dd.MM.yyyy"
                                margin="normal"
                                id={`end_date${index}`}
                                value={item.end_date}
                                onChange={(e) => handleDateChange(e, index, "to")}
                                KeyboardButtonProps={{
                                  'aria-label': 'change date',
                                }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <div className={classes.deleteButton}>
                          <IconButton aria-label="delete" onClick={() => { handleDeleteQuater(index) }}>
                            <HighlightOffIcon color="error" fontSize="small" />
                          </IconButton>
                        </div>
                      </Grid>
                    ))
                  }
                  <Grid item xs={6} justify="center" className={classes.addContainer}>
                    <IconButton aria-label="add" onClick={handleAddQuater}>
                      <ControlPointIcon className={classes.addIcon} fontSize="large" />
                    </IconButton>
                  </Grid>
                </Grid>
              </Grid>
              <div className={classes.divide}/>
              <Grid item xs={3} className={classes.form_title}>
                Dane o liderze
              </Grid>
              <Grid item xs={9}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <div className={classes.top_label} ><label htmlFor="leader_name">Nazwa podmiotu</label></div>
                    <input className={classes.input_box} type="text" value={rehabitationCenter.leader_name} name="leader_name" id="leader_name" onChange={handleChange} />
                  </Grid>
                  <Grid item xs={4}>
                    <div className={classes.top_label} ><label htmlFor="leader_regon_number">Regon</label></div>
                    <input className={classes.input_box} type="text" value={rehabitationCenter.leader_regon_number} name="leader_regon_number" id="leader_regon_number" onChange={handleChange} />
                    <div className={classes.error} style={{display: !firstLogin || rehabitationCenterError.leader_regon_number ? 'none' : 'block'}}>Wpisz prawidłowy numer.</div>
                  </Grid>
                  <Grid item xs={5}>
                    <div className={classes.top_label}><label htmlFor="leader_nip_number">NIP</label></div>
                    <input className={classes.input_box} type="text" value={rehabitationCenter.leader_nip_number} name="leader_nip_number" id="leader_nip_number" onChange={handleChange} />
                    <div className={classes.error} style={{display: !firstLogin || rehabitationCenterError.leader_nip_number ? 'none' : 'block'}}>Wpisz prawidłowy numer.</div>
                  </Grid>
                  <Grid item xs={3}>
                    <div className={classes.top_label} ><label htmlFor="macroregion_number">nr makroregionu</label></div>
                    <input className={classes.input_box} type="text" value={rehabitationCenter.macroregion_number} name="macroregion_number" id="macroregion_number" onChange={handleChange} />
                  </Grid>
                </Grid>
              </Grid>
              <div className={classes.divide}/>
              <Grid item xs={3} className={classes.form_title}>
                Partnerstwo
              </Grid>
              <Grid item xs={9}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <div className={classes.top_label}><label htmlFor="partner_count">Liczba partnerów</label></div>
                    <input className={classes.input_box} type="text" value={JSON.parse(partners).length} id="partner_count" name="partner_count" onChange={handleChangePartnerCount} />
                  </Grid>
                  {
                    JSON.parse(partners).map((item, index) => (
                      <>
                        <Grid item xs={10}>
                          <div className={classes.top_label} style={{fontWeight: '500', marginBottom: '15px'}}>Dane o partnerze {index + 1}.:</div>
                          <div className={classes.top_label}><label  htmlFor="name">Nazwa podmiotu</label></div>
                          <input className={classes.input_box} type="text" value={item.name} name="name" id="name" onChange={(e) => handlePartnerChange(e.target.value, index, 'name')} />
                        </Grid>
                        <Grid item xs={4}>
                          <div className={classes.top_label}><label htmlFor="regon">REGON</label></div>
                          <input className={classes.input_box} type="text" value={item.regon} name="regon" id="regon" onChange={(e) => handlePartnerChange(e.target.value, index, 'regon')} />
                          <div className={classes.error} style={{display: !firstLogin || JSON.parse(partnerErrors)[index].regon ? 'none' : 'block'}}>Wpisz prawidłowy numer.</div>
                        </Grid>
                        <Grid item xs={6}>
                          <div className={classes.top_label}><label htmlFor="nip">NIP</label></div>
                          <input className={classes.input_box} type="text" value={item.nip} name="nip" id="nip" onChange={(e) => handlePartnerChange(e.target.value, index, 'nip')} />
                          <div className={classes.error} style={{display: !firstLogin || JSON.parse(partnerErrors)[index].nip ? 'none' : 'block'}}>Wpisz prawidłowy numer.</div>
                        </Grid>
                      </>
                    ))
                  }
                </Grid>
              </Grid>
              <div className={classes.divide}/>
              <Grid item xs={3} className={classes.form_title}>
                Osoba do kontaku (odpowiedzialna za zbieranie danych)
              </Grid>
              <Grid item xs={9}>
                <Grid container spacing={2}>
                  <Grid item xs={7}>
                    <div className={classes.top_label}><label  htmlFor="contact_person">Imię i nazwiko</label></div>
                    <input className={classes.input_box} type="text" value={rehabitationCenter.contact} name="contact" id="contact_person" onChange={handleChange} />
                  </Grid>
                  <Grid item xs={5}>
                    <div className={classes.top_label}><label htmlFor="position_person">funkcja</label></div>
                    <input className={classes.input_box} type="text" value={rehabitationCenter.position} name="position" id="position_person" onChange={handleChange} />
                  </Grid>
                  <Grid item xs={7}>
                    <div className={classes.top_label}><label  htmlFor="phone_number">Numer telefonu</label></div>
                    <input className={classes.input_box} type="text" value={rehabitationCenter.phone} id="phone_number" name="phone" onChange={handleChange} />
                  </Grid>
                  <Grid item xs={5}>
                    <div className={classes.top_label}><label htmlFor="email">E-mail</label></div>
                    <input className={classes.input_box} type="email" value={rehabitationCenter.email} name="email" id="email" onChange={handleChange} />
                    <div className={classes.error} style={{display: !firstLogin || rehabitationCenterError.email ? 'none' : 'block'}}>Wpisz prawidłowy adres e-mail.</div>
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
              <CircularProgress className={classes.progress} />
            </div>
          </>
          :
          <></>
      }
    </MuiPickersUtilsProvider>
  );
};

export default OrkListEdit;
