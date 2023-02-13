import appConfig from '~src/../app.config.json';

export function getFeatures() {
  return appConfig.features;
}

function useFeatures() {
  const features = appConfig.features;

  return features;
}

export default useFeatures;
