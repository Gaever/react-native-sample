function truncate(str: string, n: number) {
  return str.length > n ? str.slice(0, n - 1) + '...' : str;
}

export function truncatePush(str: string) {
  return truncate(str, 170);
}

export default truncate;
