const s = [5, 7, 2];
function editInPlace() {
  // Only change code below this line

  // Using s = [2, 5, 7] would be invalid
  let i = s[0];
  let j = s[1];
  s[0] = s[2];
  s[1] = i;
  s[2] = j;

  // Only change code above this line
}
editInPlace();