import * as migration_20260922_061141_initial from './20260922_061141_initial';
import * as migration_20261006_062902_localized_content from './20261006_062902_localized_content';
import * as migration_20261006_082543 from './20261006_082543';
import * as migration_20261006_120655_localized_settings from './20261006_120655_localized_settings';
import * as migration_20261006_120907_localized_defaults from './20261006_120907_localized_defaults';
import * as migration_20261006_122433_research_section from './20261006_122433_research_section';
import * as migration_20261006_220000_common_locales from './20261006_220000_common_locales';
import * as migration_20261104_172842 from './20261104_172842';
import * as migration_20261104_185055_novel_publication_dates from './20261104_185055_novel_publication_dates';
import * as migration_20261104_194515_novel_views from './20261104_194515_novel_views';

export const migrations = [
  {
    up: migration_20260922_061141_initial.up,
    down: migration_20260922_061141_initial.down,
    name: '20260922_061141_initial',
  },
  {
    up: migration_20261006_062902_localized_content.up,
    down: migration_20261006_062902_localized_content.down,
    name: '20261006_062902_localized_content',
  },
  {
    up: migration_20261006_082543.up,
    down: migration_20261006_082543.down,
    name: '20261006_082543',
  },
  {
    up: migration_20261006_120655_localized_settings.up,
    down: migration_20261006_120655_localized_settings.down,
    name: '20261006_120655_localized_settings',
  },
  {
    up: migration_20261006_120907_localized_defaults.up,
    down: migration_20261006_120907_localized_defaults.down,
    name: '20261006_120907_localized_defaults',
  },
  {
    up: migration_20261006_122433_research_section.up,
    down: migration_20261006_122433_research_section.down,
    name: '20261006_122433_research_section',
  },
  {
    up: migration_20261006_220000_common_locales.up,
    down: migration_20261006_220000_common_locales.down,
    name: '20261006_220000_common_locales',
  },
  {
    up: migration_20261104_172842.up,
    down: migration_20261104_172842.down,
    name: '20261104_172842',
  },
  {
    up: migration_20261104_185055_novel_publication_dates.up,
    down: migration_20261104_185055_novel_publication_dates.down,
    name: '20261104_185055_novel_publication_dates',
  },
  {
    up: migration_20261104_194515_novel_views.up,
    down: migration_20261104_194515_novel_views.down,
    name: '20261104_194515_novel_views'
  },
];
