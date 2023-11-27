export const formatPrice = (x: number) => {
  let str = x.toString();
  var afterPoint = "";
  if (str.indexOf(".") > 0)
    afterPoint = str.substring(str.indexOf("."), str.length);
  x = Math.floor(x);
  str = x.toString();
  var lastThree = str.substring(str.length - 3);
  var otherNumbers = str.substring(0, str.length - 3);
  if (otherNumbers != "") lastThree = "," + lastThree;
  return (
    otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint
  );
};
