import React from 'react';
import { Switch, Redirect } from 'react-router-dom';

import { RouteWithLayout } from './components';
import { Main as MainLayout, Minimal as MinimalLayout } from './layouts';

import {
  Cockpit as CockpitView,
  Candidates as CandidatesView,
  CandidatesAdd as CandidatesAddView,
  CandidatesEdit as CandidatesEditView,
  CandidatesFirstStep as CandidatesFirstStepView,
  CandidatesSecondStep as CandidatesSecondStepView,
  CandidatesThirdStep as CandidatesThirdStepView,
  CandidatesFourthStep as CandidatesFourthStepView,
  QualificationPoints as QualificationPointsView,
  QualificationPointsAdd as QualificationPointsAddView,
  QualificationPointsEdit as QualificationPointsEditView,
  Specialists as SpecialistsView,
  SpecialistsAdd as SpecialistsAddView,
  SpecialistsEdit as SpecialistsEditView,
  Participants as ParticipantsView,
  OrkTeams as OrkTeamsView,
  OrkTeamsAdd as OrkTeamsAddView,
  OrkTeamsEdit as OrkTeamsEditView,
  IprList as IprListView,
  ServiceList as ServiceListView,
  ServiceListAdd as ServiceListAddView,
  ServiceListEdit as ServiceListEditView,
  WorkingShop as WorkingShopView,
  Notifications as NotificationsView,
  OrkList as OrkListView,
  OrkListEdit as OrkListEditView,
  Payments as PaymentsView,
  PaymentsAdd as PaymentsAddView,
  PaymentsEdit as PaymentsEditView,
  Reports as ReportsView,
  Users as UsersView,
  UsersAdd as UsersAddView,
  UsersEdit as UsersEditView,
  Profile as ProfileView,
  Logs as LogsView,
  SignIn as SignInView,
  Forgot as ForgotView,
  ResetPassword as ResetPasswordView,
  NotFound as NotFoundView
} from './views';

const Routes = (props) => {
  return (
    <Switch>
      <Redirect exact from="/" to="/login"/>
      <RouteWithLayout
        component={CockpitView}
        exact
        layout={MainLayout}
        title='Kokpit'
        path="/cockpit"
      />
      <RouteWithLayout
        component={CandidatesView}
        exact
        layout={MainLayout}
        title='Kandydaci'
        path="/candidates"
      />
      <RouteWithLayout
        component={CandidatesAddView}
        exact
        layout={MainLayout}
        title='Dodaj kandydata'
        path="/candidates/create"
      />
      <RouteWithLayout
        component={CandidatesEditView}
        exact
        layout={MainLayout}
        title='Kandydaci'
        path="/candidates/edit/:id"
      />
      <RouteWithLayout
        component={CandidatesFirstStepView}
        exact
        layout={MainLayout}
        title='Karta informacyjna kandydata'
        path="/candidates/info/step1/:id"
      />
	  <RouteWithLayout
        component={CandidatesSecondStepView}
        exact
        layout={MainLayout}
        title='Karta informacyjna kandydata'
        path="/candidates/info/step2/:id"
      />
	  <RouteWithLayout
        component={CandidatesThirdStepView}
        exact
        layout={MainLayout}
        title='Karta informacyjna kandydata'
        path="/candidates/info/step3/:id"
      />
	  <RouteWithLayout
        component={CandidatesFourthStepView}
        exact
        layout={MainLayout}
        title='Karta informacyjna kandydata'
        path="/candidates/info/step4/:id"
      />
      <RouteWithLayout
        component={QualificationPointsView}
        exact
        layout={MainLayout}
        title='Punkty kwalifikacyjne'
        path="/qualification_points"
      />
      <RouteWithLayout
        component={QualificationPointsAddView}
        layout={MainLayout}
        title='Dodawanie punktu kwalifikacyjnego'
        path="/qualification_points/create"
      />
      <RouteWithLayout
        component={QualificationPointsEditView}
        layout={MainLayout}
        title='Dodawanie punktu kwalifikacyjnego'
        path="/qualification_points/edit/:id"
      />
      <RouteWithLayout
        component={SpecialistsView}
        exact
        layout={MainLayout}
        title='Specjaliści'
        path="/specialists"
      />
      <RouteWithLayout
        component={SpecialistsAddView}
        layout={MainLayout}
        title='Dodawanie specjalisty'
        path="/specialists/create"
      />
      <RouteWithLayout
        component={SpecialistsEditView}
        layout={MainLayout}
        title='Dodawanie specjalisty'
        path="/specialists/edit/:id"
      />
      <RouteWithLayout
        component={ParticipantsView}
        exact
        layout={MainLayout}
        title='Uczestnicy'
        path="/participants"
      />
      <RouteWithLayout
        component={OrkTeamsView}
        exact
        layout={MainLayout}
        title='Zespół ORK'
        path="/ork_teams"
      />
      <RouteWithLayout
        component={OrkTeamsAddView}
        layout={MainLayout}
        title='Dodawanie osoby do zespołu ORK'
        path="/ork_teams/create"
      />
      <RouteWithLayout
        component={OrkTeamsEditView}
        layout={MainLayout}
        title='Dodawanie osoby do zespołu ORK'
        path="/ork_teams/edit/:id"
      />
      <RouteWithLayout
        component={IprListView}
        exact
        layout={MainLayout}
        title='Lista IPR'
        path="/ipr_list"
      />
      <RouteWithLayout
        component={ServiceListView}
        exact
        layout={MainLayout}
        title='Lista dostępnych usług'
        path="/service_list"
      />
      <RouteWithLayout
        component={ServiceListAddView}
        layout={MainLayout}
        title='Dodawanie usługi'
        path="/service_list/create"
      />
      <RouteWithLayout
        component={ServiceListEditView}
        layout={MainLayout}
        title='Dodawanie usługi'
        path="/service_list/edit/:id"
      />
      <RouteWithLayout
        component={WorkingShopView}
        exact
        layout={MainLayout}
        title='Warsztaty/szkolenia'
        path="/workingshop"
      />
      <RouteWithLayout
        component={NotificationsView}
        exact
        layout={MainLayout}
        title='Powiadomienia'
        path="/notifications"
      />
      <RouteWithLayout
        component={OrkListView}
        exact
        layout={MainLayout}
        title='Lista ośrodków'
        path="/ork_list"
      />
      <RouteWithLayout
        component={OrkListEditView}
        layout={MainLayout}
        title='Edytuj ośrodek'
        path="/ork_list/edit/:id"
      />
      <RouteWithLayout
        component={PaymentsView}
        exact
        layout={MainLayout}
        title='Zdefiniowane koszty usług'
        path="/payments"
      />
      <RouteWithLayout
        component={PaymentsAddView}
        exact
        layout={MainLayout}
        title='Dodaj koszt'
        path="/payments/create"
      />
      <RouteWithLayout
        component={PaymentsEditView}
        exact
        layout={MainLayout}
        title='Dodaj koszt'
        path="/payments/edit/:id"
      />
      <RouteWithLayout
        component={ReportsView}
        exact
        layout={MainLayout}
        title='Raporty'
        path="/reports"
      />
      <RouteWithLayout
        component={UsersView}
        exact
        layout={MainLayout}
        title='Uźytkownicy systemu'
        path="/users"
      />
      <RouteWithLayout
        component={UsersAddView}
        layout={MainLayout}
        title='Dodawanie Uźytkownika'
        path="/users/create"
      />
      <RouteWithLayout
        component={UsersEditView}
        layout={MainLayout}
        title='Dodawanie Uźytkownika'
        path="/users/edit/:id"
      />
      <RouteWithLayout
        component={ProfileView}
        layout={MainLayout}
        title='Edycja profilu'
        path="/profile"
      />
      <RouteWithLayout
        component={LogsView}
        exact
        layout={MainLayout}
        title='Log zdarzeń'
        path="/logs"
      />
      <RouteWithLayout
        component={SignInView}
        exact
        layout={MinimalLayout}
        path="/login"
      />
      <RouteWithLayout
        component={ForgotView}
        exact
        layout={MinimalLayout}
        path="/forgotpassword"
      />
      <RouteWithLayout
        component={ResetPasswordView}
        exact
        layout={MinimalLayout}
        path="/reset_password"
      />
      <RouteWithLayout
        component={NotFoundView}
        exact
        layout={MinimalLayout}
        path="/not-found"
      />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default Routes;
