function createSlug(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-") // replace spaces & special chars with -
    .replace(/^-+|-+$/g, ""); // remove starting/ending -
}

module.exports = {createSlug};