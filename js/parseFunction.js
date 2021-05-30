//Replaces trig functions with usable JS strings with proper nesting
function replaceTrig(match,p1){ //match = op(exps)r.o.s.
	//Find number of nested expressions (including outer operator)
	var nestCount = 0;
	var regP = /\(|\)/g;
	while(test = regP.exec(match)){
		if(test[0]==="("){
			nestCount += 1;
		}
		else{break;}
	}
	console.log("Nested expressions: " + nestCount);
	//Find index of outer closing parentheses
	var index = null;
	var regCP = /\)/g;
	for(var i=0; i<nestCount; i++){
		var result = regCP.exec(match);
		if(i === (nestCount-1)){
			index = result.index;
		}
	}
	console.log("Index of outer closing parentheses: " + index);
	//Split match into two strings: "op(exps)" "restOfString"
	var opExps = match.substring(0,(index+1));
	var restOfStr = match.substring(index+1);
	console.log("Operator and Expressions: " + opExps);
	console.log("Rest of String: " + restOfStr);
	//Store "exps" as its own string
	var exps = opExps.substring(4,(opExps.length-1));
	console.log("Operator: " + p1);
	console.log("Expressions: " + exps);
	//Replace operator with JS expression, reinsert nested expressions, and append rest of string
	var newOp;
	switch(p1){
		case "csc": newOp = "sin";
			break;
		case "sec": newOp = "cos";
			break;
		case "cot": newOp = "tan";
	}
	newStr = "(1/Math."+newOp+"("+exps+"))"+restOfStr;
	return newStr;
}
//Create function object constructor
function func(mathFunc) {
    //Holds prepared mathematical function expression as a string
	this.funcStr = null;
	//Prepare string for use as a javascript function
	this.prep = function(){ // returns false if constructor parameter is invalid and true otherwise
		var strExp = mathFunc;
		//Validate input
		strExp = strExp.trim();
		var regMathExp = /^(?:[x+\-*\/\d\^()\|]+|cos|sin|tan|sec|csc|cot|ln)+$/i;
		var test = regMathExp.test(strExp);
		if(test){
			//Convert to evaulatable string //add support for nested exp's ex: x^(cos(n)) and cos(x)^2 and(1-Math.pow(x,2))^(1/2)
			//Absolute Value
			strExp = strExp.replace(/\|([sincotaelx+\-*\/\d\^()]+)\|/g,"Math.abs($1)");
			//insert multiplication signs
			strExp = strExp.replace(/(x)(\w)/gi,"$1*$2"); //x*x x*op x*n (x*x*x not supported: see lastIndexOf)
			strExp = strExp.replace(/(\d)([a-z])/gi,"$1*$2"); //n*op n*x
			strExp = strExp.replace(/(\d+|x)(\()/g,"$1*$2"); //n*(exp) x*(exp)
			strExp = strExp.replace(/(\))(\w+|\()/g,"$1*$2"); //(exp)*n (exp)*x (exp)*(exp) (exp)*op
			//replace all exponential expressions with Math.pow()
			strExp = strExp.replace(/(x|\d+)\^(x|\d+)/g,"Math.pow($1,$2)"); //(x^x) (x^n) (n^x) (n^n)
			strExp = strExp.replace(/(\([x\d\+\-\*\/]+\))\^(x|\d+)/g,"Math.pow($1,$2)"); //(exp)^x (exp)^n
			strExp = strExp.replace(/(x|\d+)\^(\([x\d\+\-\*\/]+\))/g,"Math.pow($1,$2)"); //x^(exp) n^(exp) 
			strExp = strExp.replace(/(\([x\d\+\-\*\/]+\))\^(\([x\d\+\-\*\/]+\))/g,"Math.pow($1,$2)"); //(exp)^(exp)
			//Prep trig statements
			strExp = strExp.replace(/sin/g,"Math.sin");
			strExp = strExp.replace(/cos/g,"Math.cos");
			strExp = strExp.replace(/tan/g,"Math.tan");
			strExp = strExp.replace(/(csc).+/g,replaceTrig);
			strExp = strExp.replace(/(sec).+/g,replaceTrig);
			strExp = strExp.replace(/(cot).+/g,replaceTrig);
			//Natural logarithm (log base 10's support is currently experimental)
			strExp = strExp.replace(/ln/g,"Math.log");
			//Assign new string as code to exec method
			eval("this.exec = function(x){return "+strExp+";}"); //(find alternative method to eval())
			this.funcStr = strExp;
			return true;
		}
		else{return false;}
	};
	//Execute prepared mathematical function
	this.exec = function(){return null;};
}

/* KEEP FOR TECHNIQUES! (lesser equivalent of Math.pow(base,power))
//Check if a number is not an integer
function isNaI(n){
    if(n===""){return true;}
    return n%1 !== 0;
}
//Evaluates an exponential expression
function expFunc(base,power){
    if(isNaN(base) || isNaN(power) || isNaI(power)){
    	return false; //Returns false if power in not an integer
	}
	else{
		if(power >= 1){
			return base*expFunc(base,power-1);
		}
		else if(power === 0){
			return 1;
		}
		else if(power < 0){
			return 1/(base*expFunc(base,Math.abs(power)-1));
		}
	}
} */