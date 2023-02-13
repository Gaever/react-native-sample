import packageJson from '~src/../package.json';

export default function getAppVersion() {
  return packageJson.version;
}
