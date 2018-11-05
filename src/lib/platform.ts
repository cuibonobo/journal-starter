
/*
From https://stackoverflow.com/questions/19275776/node-js-how-to-get-the-os-platforms-user-data-folder#26227660

The expected result is:
  * OS X: '~/Library/Preferences'
  * Windows 8: 'C:\Users\User\AppData\Roaming'
  * Windows XP: 'C:\Documents and Settings\User\Application Data'
  * Linux: '~/.config'
*/
export const userDataDir = process.env.APPDATA || (process.platform === 'darwin' ? process.env.HOME + 'Library/Preferences' : `/home/${process.env.USER}/.config`);
