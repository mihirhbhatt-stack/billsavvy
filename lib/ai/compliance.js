const FORBIDDEN = [
  /\byou should\b/i,
  /\bwe recommend\b/i,
  /\bbest for you\b/i,
  /\bswitch to\b/i,
  /\bmove to\b/i,
  /\bwe\s+guarantee\b/i,
  /\bguarantee(d|s)?\s+(you|your|saving|savings|to\s+save|results?)\b/i,
  /\byou must\b/i,
  /\brefinance now\b/i,
  /\bchoose (this|that) provider\b/i,
];

export function complianceViolations(text) {
  return FORBIDDEN.filter((re) => re.test(text)).map((re) => re.source);
}
