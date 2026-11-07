// Enum values shared by migrations (MySQL ENUM), models and Zod schemas (z.enum).
// Order matters for MySQL ENUM definitions: append new values, never reorder.
// Source: docs/modules/auth/README.md and docs/modules/auth/db.md.

const freezeAll = (rows) => Object.freeze(rows.map((row) => Object.freeze(row)));

// applications.status
export const APPLICATION_STATUSES = Object.freeze(['ACTIVE', 'DISABLED']);

// app_roles.registration_mode: OPEN = self sign-up, INVITE_ONLY = granted by an application or admin
export const REGISTRATION_MODES = Object.freeze(['OPEN', 'INVITE_ONLY']);

// users.status: ACTIVE requires a verified email (AUTH-DEC-005)
export const USER_STATUSES = Object.freeze(['PENDING', 'ACTIVE', 'SUSPENDED', 'BLOCKED']);

// user_app_roles.status: only ACTIVE grants entry (AUTH-DEC-004)
export const USER_APP_ROLE_STATUSES = Object.freeze(['PENDING', 'ACTIVE', 'REVOKED']);

// user_app_roles.granted_via
export const GRANTED_VIA = Object.freeze(['SELF_SIGNUP', 'APP', 'ADMIN', 'MIGRATION']);

// email_otps.purpose
export const OTP_PURPOSES = Object.freeze([
  'EMAIL_VERIFICATION',
  'PASSWORD_RESET',
  'ACCOUNT_SETUP',
]);

// refresh_tokens.revoked_reason
export const REVOKED_REASONS = Object.freeze([
  'LOGOUT',
  'ROTATED',
  'REUSE_DETECTED',
  'PASSWORD_CHANGED',
  'ROLE_REVOKED',
  'ADMIN',
]);

// auth_events.event
export const AUTH_EVENTS = Object.freeze([
  'REGISTERED',
  'OTP_SENT',
  'EMAIL_VERIFIED',
  'LOGIN_SUCCEEDED',
  'LOGIN_FAILED',
  'ACCOUNT_LOCKED',
  'PASSWORD_RESET',
  'PASSWORD_CHANGED',
  'LOGOUT',
  'ROLE_GRANTED',
  'ROLE_REVOKED',
  'TOKEN_REUSE_DETECTED',
]);

// Seeded configuration (docs/modules/auth/README.md, "Applications and panels").
export const SEED_APPLICATIONS = freezeAll([
  { code: 'fyinder', name: 'Fyinder' },
  { code: 'real_estate', name: 'Real Estate' },
]);

export const SEED_APP_ROLES = freezeAll([
  { applicationCode: 'fyinder', code: 'SEEKER', name: 'Seeker', registrationMode: 'OPEN' },
  { applicationCode: 'fyinder', code: 'EMPLOYER', name: 'Employer', registrationMode: 'OPEN' },
  {
    applicationCode: 'fyinder',
    code: 'HIRING_MANAGER',
    name: 'Hiring Manager',
    registrationMode: 'INVITE_ONLY',
  },
  {
    applicationCode: 'fyinder',
    code: 'COMPANY_USER',
    name: 'Company User',
    registrationMode: 'INVITE_ONLY',
  },
  {
    applicationCode: 'fyinder',
    code: 'HRMS_EMPLOYEE',
    name: 'HRMS Employee',
    registrationMode: 'INVITE_ONLY',
  },
  { applicationCode: 'fyinder', code: 'CONSULTANT', name: 'Consultant', registrationMode: 'OPEN' },
  { applicationCode: 'fyinder', code: 'UNIVERSITY', name: 'University', registrationMode: 'OPEN' },
  { applicationCode: 'fyinder', code: 'AGENT', name: 'Agent', registrationMode: 'OPEN' },
  { applicationCode: 'fyinder', code: 'ADMIN', name: 'Admin', registrationMode: 'INVITE_ONLY' },
  { applicationCode: 'real_estate', code: 'BUYER', name: 'Buyer', registrationMode: 'OPEN' },
  { applicationCode: 'real_estate', code: 'OWNER', name: 'Owner', registrationMode: 'OPEN' },
  {
    applicationCode: 'real_estate',
    code: 'DEVELOPER',
    name: 'Developer',
    registrationMode: 'OPEN',
  },
  { applicationCode: 'real_estate', code: 'AGENT', name: 'Agent', registrationMode: 'OPEN' },
  {
    applicationCode: 'real_estate',
    code: 'TENANT',
    name: 'Tenant',
    registrationMode: 'INVITE_ONLY',
  },
  {
    applicationCode: 'real_estate',
    code: 'FACILITY_ADMIN',
    name: 'Facility Admin',
    registrationMode: 'INVITE_ONLY',
  },
  {
    applicationCode: 'real_estate',
    code: 'TECHNICIAN',
    name: 'Technician',
    registrationMode: 'INVITE_ONLY',
  },
  { applicationCode: 'real_estate', code: 'STAFF', name: 'Staff', registrationMode: 'INVITE_ONLY' },
  { applicationCode: 'real_estate', code: 'ADMIN', name: 'Admin', registrationMode: 'INVITE_ONLY' },
]);
