import * as migration_20260922_061141_initial from './20260922_061141_initial';
import * as migration_20261006_062902_localized_content from './20261006_062902_localized_content';

export const migrations = [
  {
    up: migration_20260922_061141_initial.up,
    down: migration_20260922_061141_initial.down,
    name: '20260922_061141_initial',
  },
  {
    up: migration_20261006_062902_localized_content.up,
    down: migration_20261006_062902_localized_content.down,
    name: '20261006_062902_localized_content'
  },
];
