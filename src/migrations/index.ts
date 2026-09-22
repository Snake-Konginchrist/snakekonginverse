import * as migration_20260922_061141_initial from './20260922_061141_initial';

export const migrations = [
  {
    up: migration_20260922_061141_initial.up,
    down: migration_20260922_061141_initial.down,
    name: '20260922_061141_initial'
  },
];
