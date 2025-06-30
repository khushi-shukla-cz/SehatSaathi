function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  // Remove HTML tags
  let clean = str.replace(/<[^>]*>?/gm, '');
  // Remove dangerous characters (basic)
  clean = clean.replace(/[\$'"`]/g, '');
  return clean.trim();
}

module.exports = { sanitizeInput }; 