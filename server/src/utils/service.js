export function atbashCipher(str) {
  return str
    .split("")
    .map((ch) => {
      const code = ch.charCodeAt(0);
      // Uppercase A-Z
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(65 + (90 - code));
      }
      // Lowercase a-z
      if (code >= 97 && code <= 122) {
        return String.fromCharCode(97 + (122 - code));
      }
      return ch; // leave digits, spaces, punctuation unchanged
    })
    .join("");
}