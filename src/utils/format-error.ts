import i18n from '~src/i18n';

export default function formatError(error: any): {error: any} | undefined {
  if (!error) return undefined;
  if (typeof error === 'string') return {error};
  if (error instanceof Error) return {error: error.message};
  if (Array.isArray(error) && typeof error?.[0] === 'string') {
    return {error: error[0]};
  }
  if (typeof error?.error === 'string') {
    return {error: error?.error};
  }
  return {error: i18n.t('generic-error')};
  // return {error};
}
