import React from 'react';
import { Switch, Redirect } from 'react-router-dom';

import { RouteWithLayout } from './components';
import { Main as MainLayout, Minimal as MinimalLayout } from './layouts';

import {
  Cockpit as CockpitView,
  Candidates as CandidatesView,
  QualificationPoints as QualificationPointsView,
  QualificationPointsUser as QualificationPointsUserView,
  QualificationPointsAdd as QualificationPointsAddView,
  Specialists as SpecialistsView,
  Participants as ParticipantsView,
  OrkTeams as OrkTeamsView,
  IprList as IprListView,
  ServiceList as ServiceListView,
  WorkingShop as WorkingShopView,
  Notifications as NotificationsView,
  OrkList as OrkListView,
  Payments as PaymentsView,
  Reports as ReportsView,
  Users as UsersView,
  Permissions as PermissionsView,
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
        component={props.role === 1 ? QualificationPointsView : QualificationPointsUserView}
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
        component={SpecialistsView}
        exact
        layout={MainLayout}
        title='Specjaliści'
        path="/specialists"
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
        title='Lista usług'
        path="/service_list"
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
        title='Lista ORK'
        path="/ork_list"
      />
      <RouteWithLayout
        component={PaymentsView}
        exact
        layout={MainLayout}
        title='Zdefiniowane koszty usług'
        path="/payments"
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
        component={PermissionsView}
        exact
        layout={MainLayout}
        title='Uprawnienia'
        path="/permissions"
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
