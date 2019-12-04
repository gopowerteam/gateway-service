import { readSync } from 'node-yaml';
import { get } from 'lodash';
export class ConfigService {
  private readonly config;

  constructor(filePath: string) {
    this.config = readSync(filePath);
  }

  get(key: string, defaultValue?): any {
    return get(this.config, key, defaultValue);
  }
}
