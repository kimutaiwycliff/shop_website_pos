import * as migration_20250902_190146 from './20250902_190146';

export const migrations = [
  {
    up: migration_20250902_190146.up,
    down: migration_20250902_190146.down,
    name: '20250902_190146'
  },
];
