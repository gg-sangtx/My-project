export function getPrice(value) {
  String.prototype.splice = function(idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
  };
  let result = value;
  if(String(result).length < 3) {
    return result
  } else {
    for (let j = Number(String(result).length); j > 0;) {
      j = j - 3;
      if(j > 0) {
        result = String(result).splice(j, 0, ",");
      }
    }
    return result
  }
}