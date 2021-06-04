const urlParams = new URLSearchParams(window.location.search);
initVar = {
  f: urlParams.get("fun"), //integrand
  l: parseInt(urlParams.get("min")), //lower bound
  u: parseInt(urlParams.get("max")), //upper bound
  i: parseInt(urlParams.get("time")), //intervals
};
function evaluate (x) {
  var e = initVar.f.replace("x", x);
  e = e.replace("pow", "Math.pow");
  e = e.replace("sin", "Math.sin");
  e = e.replace("cos", "Math.cos");
  e = e.replace("tan", "Math.tan");
  e = e.replace("arctan", "Math.atan");
  e = e.replace("arcsin", "Math.asin");
  e = e.replace("arccos", "Math.acos");
  console.log(e);
  return eval(e);
};	

number = 0;
width = (initVar.u - initVar.l) / initVar.i; //interval width : (lower bound - upper bound) / # of intervals
counter = initVar.i;
for (var i = initVar.l; i < initVar.u; i += width) {
  //this loop start the variable i at the lower bound, and repeats while adding the interval width to i
  if (counter > 0) {
    //this counter makes sure the amount of rectangles added are the same as the interval number
    number = number + evaluate(i); //adds left hand rectangle height to the sum
    counter--;
  }
}
document.querySelector("#left").innerHTML =
  "Left Hand Sum Value: " + (number * width).toFixed(2);

number = 0;
width = (initVar.u - initVar.l) / initVar.i; //interval width : (lower bound - upper bound) / # of intervals
counter = initVar.i;
for (var i = initVar.l; i < initVar.u; i += width) {
  //this loop start the variable i at the lower bound, and repeats while adding the interval width to i
  if (counter > 0) {
    //this counter makes sure the amount of rectangles added are the same as the interval number
    number = number + evaluate(i + width); //adds right hand rectangle height to the sum
    counter--;
  }
}
document.querySelector("#right").innerHTML =
  "Right Hand Sum Value: " + (number * width).toFixed(2);

number = 0;
width = (initVar.u - initVar.l) / initVar.i; //interval width : (lower bound - upper bound) / # of intervals
counter = initVar.i;
for (var i = initVar.l; i < initVar.u; i += width) {
  //this loop start the variable i at the lower bound, and repeats while adding the interval width to i
  if (counter > 0) {
    //this counter makes sure the amount of rectangles added are the same as the interval number
    number = number + evaluate(i + width / 2); //uses height between the left and right hand points
    counter--;
  }
}
document.querySelector("#mid").innerHTML =
  "Midpoint Hand Sum Value: " + (number * width).toFixed(2);
