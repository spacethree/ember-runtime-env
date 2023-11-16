import EnvService from './services/env';
import camelCase from 'camelcase';

/**
 *
 * @param envVars a string array of environment variables to process
 * @returns an object with the keys of the input string array, with the values of the environment variables
 */
export function processEnvVars(envVars: string[]): {
  [key: string]: string | undefined;
} {
  const result = {};
  envVars.forEach((varName) => {
    const camelCasedVarName = camelCase(varName);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    result[camelCasedVarName] = process.env[varName];
  });
  return result;
}

export { EnvService };
