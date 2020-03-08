import { AuthenticationModule, SuperAdminAuthenticationModule } from '@ulmax/authentication';
import { CardnodeModule, UlmaxCardInternalModule } from '@ulmax/cardnode';
import { DataAccessRecordsModule } from '@ulmax/data-access-records';
import { EHRDataControllerModule, EHRMedicalClaimModule, EHRpersonnelModule } from '@ulmax/ehr';
import { EHRHistoryModule, ReferralDataLayerModule } from '@ulmax/ehr-intercom';
import { GeneralPublicDataControllerModule, GeneralPublicModule } from '@ulmax/general-public';
import { MessagingModule } from '@ulmax/messaging';
import { SuperUsersAdmininistrationModule, UsersAdmininistrationModule } from '@ulmax/users-admininistration';
import { Routes } from 'nest-router';

export const internalRoutes: Routes = [
  {
    path: 'security',
    children: [
      { path: 'client', module: AuthenticationModule },
      { path: 'superadmin', module: SuperAdminAuthenticationModule },
    ],
  },
  { path: 'useradmin', module: UsersAdmininistrationModule },
  { path: 'messaging', module: MessagingModule },
  // { path: 'sip', module: SipAdminModule },
  { path: 'accessrecord', module: DataAccessRecordsModule },
  { path: 'users', module: SuperUsersAdmininistrationModule },
  {
    path: 'ehr',
    module: EHRDataControllerModule,
  },
  {
    path: 'generalpublic',
    module: GeneralPublicDataControllerModule,
  },
  {
    path: 'referral',
    module: ReferralDataLayerModule,
  },
  {
    path: 'cardnode',
    module: UlmaxCardInternalModule,
  },
];

// { path: 'sip', module: SipModule },
export const externalRoutes: Routes = [
  {
    path: 'ehr',
    children: [
      { path: 'medicalclaims', module: EHRMedicalClaimModule },
      { path: 'history', module: EHRHistoryModule },
      // { path: 'intercomm', module: SipModule },
      { path: 'personnel', module: EHRpersonnelModule },
    ],
  },
  { path: 'generalpublic', module: GeneralPublicModule },
  { path: 'cardnode', module: CardnodeModule },
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
