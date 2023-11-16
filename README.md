# ember-runtime-env

ember-runtime-env allows making environment variables from the host's context available at runtime.

This add-on is particularly useful for deployment pipelines like Heroku, where environment variables may change between environments. With ember-runtime-env, there's no need to rebuild the application when moving it into a new environment. Instead, the environment variables from the host's context are made available at runtime, allowing for a more efficient and flexible deployment process.

## Compatibility

- Ember.js v4.8 or above
- Ember CLI v4.8 or above
- Node.js v18 or above

## Requirements

This add-on requires the application to be running within [Fastboot](https://ember-fastboot.com)

## Installation

```
ember install ember-runtime-env
```

#### pass environment variables into fastboot scope

```ts
// config/fastboot.js
const dotenv = require("dotenv");
dotenv.config();

const processEnvVars = require("ember-runtime-env");

const envVars = ["PORT", "API_HOST"];

module.exports = function () {
  return {
    buildSandboxGlobals(defaultGlobals) {
      return Object.assign({}, defaultGlobals, {
        ENV: processEnvVars(envVars),
      });
    },
  };
};
```

```ts
// fastboot-server.mjs
import FastBootAppServer from "fastboot-app-server";
import { processEnvVars } from "ember-runtime-env";
import dotenv from "dotenv";
dotenv.config();

export const envVars = ["PORT", "API_HOST"];

const vars = processEnvVars(envVars);

const server = new FastBootAppServer({
  distPath: "dist",
  gzip: true,
  host: "0.0.0.0",
  port: vars.port ?? 4200,
  workerCount: 1,
  buildSandboxGlobals(globals) {
    return Object.assign({}, globals, { ENV: vars });
  },
});

server.start();
```

#### initialize the env service

This should typically be done in the application route by calling `initialize` in the beforeModel. This makes sure that the env loads no matter the incoming request. If you only want the environment loaded on specific routes, initialize the service accordingly.

```ts
import { type EnvService } from "ember-runtime-env";
import Route from "@ember/routing/route";
import { inject as service, type Registry as Services } from "@ember/service";

export default class ApplicationRoute extends Route {
  @service env!: EnvService;

  async beforeModel() {
    await this.env.initialize();
  }
}
```

## Usage

To use the env service, inject it and then call `getEnvVar`. Note that your `ENV_VARS` have been converted to `camelCase`.

Here is an example where we're making an apiHost variable accessible in the application controller.

```ts
import Controller from "@ember/controller";
import { inject as service, type Registry as Services } from "@ember/service";

export default class ApplicationController extends Controller {
  @service env!: Services["env"];

  get apiHost(): string | undefined {
    return this.env.getEnvVar("apiHost");
  }
}
```

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [MIT License](LICENSE.md).
