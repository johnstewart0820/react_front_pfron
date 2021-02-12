import React, { useState, useEffect } from 'react';
import useStyles from './style';
import {
  Button, Grid, Card, TextField, CircularProgress, TextareaAutosize 
} from '@material-ui/core';
import { useToasts } from 'react-toast-notifications'
import { Autocomplete } from '@material-ui/lab';

import { Breadcrumb, SingleSelect, MultiSelect } from 'components';
import candidate from '../../apis/candidate';
import {
  KeyboardDatePicker, MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

import PictureAsPdfOutlinedIcon from '@material-ui/icons/PictureAsPdfOutlined';
import FindInPageOutlinedIcon from '@material-ui/icons/FindInPageOutlined';
import DeleteIcon from '@material-ui/icons/Delete';

const CandidatesAdd = props => {
  const { children } = props;
  const { history } = props;
  const classes = useStyles();
  const { addToast } = useToasts()
  const breadcrumbs = [{ active: true, label: 'Kandydaci', href: '/candidates' }, { active: false, label: 'Dodaj kandydata' }];
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [person_id, setPersonId] = useState('');
  const [date_of_birth, setDateOfBirth] = useState(new Date());
  const [place_of_birth, setPlaceOfBirth] = useState('');
  const [street, setStreet] = useState('');
  const [house_number, setHouseNumber] = useState('');
  const [apartment_number, setApartmentNumber] = useState('');
  const [post_code, setPostCode] = useState('');
  const [post_office, setPostOffice] = useState('');
  const [city, setCity] = useState('');
  const [stage, setStage] = useState(0);
  const [stageList, setStageList] = useState([]);
  const [qualification_point, setQualificationPoint] = useState(0);
  const [qualificationPointList, setQualificationPointList] = useState([]);
  const [comment, setComment] = useState('');

  const [progressStatus, setProgressStatus] = useState(false);

  useEffect(() => {
    candidate.getInfo()
      .then(response => {
        if (response.code === 401) {
          history.push('/login');
        } else {
          setStageList(response.data.stage);
          setQualificationPointList(response.data.qualification_point);
        }
      })

    let _date = new Date();
    setDateOfBirth(_date.getFullYear() + '-' + (_date.getMonth() + 1) + '-' + (_date.getDate()));
  }, []);

  const handleBack = () => {
    history.push('/candidates');
  }

  function validatepesel(pesel) {
    var reg = /^[0-9]{11}$/;
    if(reg.test(pesel) == false) 
        return false;
    else
    {
        var digits = (""+pesel).split("");
        if ((parseInt(pesel.substring( 4, 6)) > 31)||(parseInt(pesel.substring( 2, 4)) > 12))
            return false;
         
        var checksum = (1*parseInt(digits[0]) + 3*parseInt(digits[1]) + 7*parseInt(digits[2]) + 9*parseInt(digits[3]) + 1*parseInt(digits[4]) + 3*parseInt(digits[5]) + 7*parseInt(digits[6]) + 9*parseInt(digits[7]) + 1*parseInt(digits[8]) + 3*parseInt(digits[9]))%10;
        if(checksum==0) checksum = 10;
            checksum = 10 - checksum;
 
        return (parseInt(digits[10])==checksum);
    }
  }

  const handleSave = () => {
    if (name.length === 0 || surname.length === 0 || person_id.length === 0 || date_of_birth.length === 0 || place_of_birth.length === 0 
    || street.length === 0 || house_number.length === 0 || apartment_number.length === 0 || post_code.length === 0 || post_office.length === 0 
    || city.length === 0 || parseInt(stage) === 0 || comment.length === 0) {
      addToast('Proszę wpisać wszystkie pola.', { appearance: 'error', autoDismissTimeout: 3000, autoDismiss: true })
    } else if (!validatepesel(person_id)) {
      addToast('Proszę wpisać poprawny PESEL.', { appearance: 'error', autoDismissTimeout: 3000, autoDismiss: true })
    } else {
      setProgressStatus(true);

      candidate.create(name, surname, person_id, date_of_birth, place_of_birth, street, house_number, apartment_number, post_code, post_office, city, stage, comment)
      .then(response => {
        if (response.code === 401) {
          history.push('/login');
        } else {
          addToast(response.message, { appearance: response.code === 200 ? 'success' : 'error', autoDismissTimeout: response.code === 200 ? 1000 : 3000, autoDismiss: true})
          if (response.code === 200) {
            setTimeout(function(){history.push('/candidates');}, 1000);
          }
          setProgressStatus(false);
        }
      })
    }
  }

  const handleChangeDateOfBirth = (value) => {
    let _date = new Date(value);
    setDateOfBirth(_date.getFullYear() + '-' + (_date.getMonth() + 1) + '-' + (_date.getDate()));
  }

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
    <div className={classes.public}>
      <div className={classes.controlBlock}>
        <Breadcrumb list={breadcrumbs} />
        <Button variant="outlined" color="secondary" className={classes.btnBack} onClick={handleBack}>
          Wróć do listy kandydatow
        </Button>
      </div>
      <Grid container spacing={3} className={classes.formBlock}>
        <Grid item xs={9}>
          <Card className={classes.form}>
            <Grid container spacing={3}>
              <Grid item xs={3} className={classes.form_title}>
                Dane kandydata
              </Grid>
              <Grid item xs={9}>
                <div className={classes.top_label} htmlFor="name">Imię(Imiona)</div>
                <input className={classes.input_box} type="name" value={name} name="name" onChange={(e) => setName(e.target.value)} />
                <div className={classes.input_box_label} htmlFor="name">Nazwisko</div>
                <input className={classes.input_box} type="name" value={surname} name="name" onChange={(e) => setSurname(e.target.value)} />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <div className={classes.input_box_label} htmlFor="name">PESEL</div>
                    <input className={classes.input_box} type="name" value={person_id} name="name" onChange={(e) => setPersonId(e.target.value)} />
                  </Grid>
                  <Grid item xs={6}>
                    <div className={classes.input_box_label} htmlFor="name">Data urodzenia</div>
                    <KeyboardDatePicker
                      disableToolbar
                      className={classes.date_picker}
                      variant="inline"
                      format="dd.MM.yyyy"
                      margin="normal"
                      id="date-picker-inline"
                      value={date_of_birth}
                      onChange={(value) => handleChangeDateOfBirth(value)}
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                    />
                  </Grid>
                </Grid>
                <div className={classes.input_box_label} htmlFor="type">Miejsce urodzenia</div>
                <input className={classes.input_box} type="name" value={place_of_birth} name="name" onChange={(e) => setPlaceOfBirth(e.target.value)} />
              </Grid>
            </Grid>
            <div className={classes.divide}/>
            <Grid container spacing={3}>
              <Grid item xs={3} className={classes.form_title}>
                Adres zameldowania
              </Grid>
              <Grid item xs={9}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <div className={classes.top_label} htmlFor="name">Ulica</div>
                    <input className={classes.input_box} type="name" value={street} name="name" onChange={(e) => setStreet(e.target.value)} />
                  </Grid>
                  <Grid item xs={3}>
                    <div className={classes.top_label} htmlFor="name">nr domu</div>
                    <input className={classes.input_box} type="name" value={house_number} name="name" onChange={(e) => setHouseNumber(e.target.value)} />
                  </Grid>
                  <Grid item xs={3}>
                    <div className={classes.top_label} htmlFor="name">mieszkanie</div>
                    <input className={classes.input_box} type="name" value={apartment_number} name="name" onChange={(e) => setApartmentNumber(e.target.value)} />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={3}>
                    <div className={classes.input_box_label} htmlFor="name">Kod pocztowy</div>
                    <input className={classes.input_box} type="name" value={post_code} name="name" onChange={(e) => setPostCode(e.target.value)} />
                  </Grid>
                  <Grid item xs={5}>
                    <div className={classes.input_box_label} htmlFor="name">Poczta</div>
                    <input className={classes.input_box} type="name" value={post_office} name="name" onChange={(e) => setPostOffice(e.target.value)} />
                  </Grid>
                  <Grid item xs={4}>
                    <div className={classes.input_box_label} htmlFor="name">Miejscowość</div>
                    <input className={classes.input_box} type="name" value={city} name="name" onChange={(e) => setCity(e.target.value)} />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card className={classes.form}>
                <Grid container spacing={2}>
                  <div className={classes.form_title}>
                    Karty informacyjne
                  </div>
                  <Grid item xs={12}>
                    <Button variant="outlined" color="secondary" className={classes.btnOption} onClick={handleSave}>
                      Załoź kartę informacyjną
                    </Button>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card className={classes.form}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <div className={classes.top_label} htmlFor="name">Etap</div>
                    <SingleSelect value={stage} handleChange={setStage} list={stageList} />
                    <div className={classes.input_box_label} htmlFor="name">Komentarz dotyczący edycji(max 100 znków)</div>
                    <TextareaAutosize value={comment} rowsMin={10} onChange={(e) => setComment(e.target.value)} placeholder="Utworzenie profilu uczestnika" className={classes.textArea}/>
                    {/* <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Button variant="outlined" color="secondary" className={classes.btnDelete} onClick={handleExportPdf}>
                          <PictureAsPdfOutlinedIcon/>
                        </Button>
                      </Grid>
                      <Grid item xs={4}>
                        <Button variant="outlined" color="secondary" className={classes.btnDelete} onClick={handlePreview}>
                          <FindInPageOutlinedIcon/>
                        </Button>
                      </Grid>
                      <Grid item xs={4}>
                        <Button variant="outlined" color="secondary" className={classes.btnDelete} onClick={handleDelete}>
                          <DeleteIcon/>
                        </Button>
                      </Grid>
                    </Grid> */}
                    <Button variant="outlined" color="secondary" className={classes.btnSave} onClick={handleSave}>
                      Zapisz
                    </Button>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>
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
    </MuiPickersUtilsProvider>
  );
};

export default CandidatesAdd;
