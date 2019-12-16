import { Routes } from 'nest-router';
import {
  AuthenticationModule,
  SuperAdminAuthenticationModule,
} from '@eagle/authentication';
import { DataAccessRecordsModule } from '@eagle/data-access-records';
import { UsersAdmininistrationModule, SuperUsersAdmininistrationModule } from '@eagle/users-admininistration';
import { MessagingModule } from '@eagle/messaging';
import { SipModule, SipAdminModule } from '@eagle/sip';

export const internalRoutes: Routes = [
  {
    path: 'security',
    module: SuperAdminAuthenticationModule,
  },
  { path: 'useradmin', module: UsersAdmininistrationModule },
  {
    path: 'accessrecord',
    module: DataAccessRecordsModule,
  },
  { path: 'messaging', module: MessagingModule },
  { path: 'sip', module: SipAdminModule },
  { path: 'accessrecord', module: DataAccessRecordsModule },
  { path: 'users', module: SuperUsersAdmininistrationModule },
  {
    path: 'security',
    module: AuthenticationModule,
  },
];

export const externalRoutes: Routes = [
  { path: 'sip', module: SipModule },
];

export const routes: Routes = [
  {
    path: 'api',
    children: [
      { path: 'external', children: externalRoutes },
      { path: 'internal', children: internalRoutes },
    ],
  },
];
