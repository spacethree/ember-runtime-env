/** global ENV */
import Service from '@ember/service';
import { inject as service } from '@ember/service';

import { type LoggerService } from 'ember-logging';

export default class EnvService extends Service {
  @service fastboot!: {
    isFastBoot: boolean;
    shoebox: {
      retrieve: (tag: string) => unknown;
      put: (tag: string, value: unknown) => void;
    };
  };

  @service logger!: LoggerService;

  vars: Record<string, string | undefined> = {};

  async initialize(): Promise<void> {
    this.vars = (await this.shget('runtime-env', async () => {
      return ENV;
    })) as Record<string, string | undefined>;
    this.logger.debug('runtime-env: variables loaded', this.vars);
  }

  getEnvVar(name: string): string | undefined {
    return this.vars[name];
  }

  /**
   * shget (shoebox get) is a helper function to get a value from the shoebox
   * if it is not in the shoebox, it will call the callback function to get the value
   * and then put it in the shoebox
   *
   * @param tag name of cache key in shoebox
   * @param callback function to call to get the value if it is not in the shoebox
   * @returns value from shoebox or callback
   */
  async shget(
    tag: string,
    callback?: () => Promise<unknown>,
  ): Promise<unknown> {
    let result = this.fastboot.shoebox.retrieve(tag);
    if (!result && callback && typeof callback === 'function') {
      result = await callback();
      if (this.fastboot.isFastBoot) {
        this.fastboot.shoebox.put(tag, result);
      }
    }
    return result;
  }
}

declare module '@ember/service' {
  interface Registry {
    env: EnvService;
  }
}
