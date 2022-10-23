const util = require('util');
const exec = util.promisify(require('child_process').exec);

/**
 * This will execute system's ping command
 * @param host Host or IP address to ping
 * @param tries Number of tries
 * @returns It will return output and error
 */
export async function ping(host: string = '', tries: number = 5) {
  const { stdout, stderr } = await exec(`ping -c ${tries} ${host}`);

  return {
    output: stdout,
    error: stderr,
  };
}

/**
 * It will pause execution of program for specified seconds
 * @param seconds number of seconds to pause execution
 */
export function sleep(seconds: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, +seconds * 1000);
  });
}

/**
 * It will find and replace all occurances of string except first one
 * @param str string in which it will find
 * @param find string to find
 * @param replace string to replace
 * @returns final string after replacement
 */
export function replaceAllExceptFirst(str: string, find: string, replace: string) {
  const strs = str.split(find);
  return strs.length === 1 ? strs[0] : strs[0] + find + strs.slice(1).join(replace);
}