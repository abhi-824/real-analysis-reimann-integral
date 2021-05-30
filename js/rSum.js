window.onload = function(){
	//Scale button
	var scale = document.getElementById("scale");
	//Prep canvas element
	var graph = document.getElementById("graph");
	var ctx = graph.getContext("2d");
	ctx.lineWidth = "1";
	ctx.fillStyle = "#0cd6e4";
	ctx.strokeStyle = "#000";
	//Store total area of rectangles
	var area = 0;
	//Max distance from the x axis (used for scaling)
	var maxDis = 0;
	//Var's to be passed between Calculate and Scale
	var mathExp,a,b,n,ep,upv,width,step;
    document.getElementById("calc").onclick = function(){
		//Clear graph
		ctx.clearRect(0,0,700,350);
		//Clear net area
		area = 0;
		//Reset max distance
		maxDis = 0;
		//Get user input
		mathExp = new func(document.getElementById("function").value);
		mathExp.prep(); //Eventually put in a try catch block
		console.log(mathExp.funcStr);
        a = parseInt(document.getElementById("a").value);
        b = parseInt(document.getElementById("b").value);
        n = parseInt(document.getElementById("n").value);
		ep = document.getElementById("endpoint").value;
		//Canvas units per numerical value
		upv = 700/(b-a);
		//Rectangle width on graph
		width = 700/n;
		//How often to evaluate function
		step = (b-a)/n;
		//Sort values for max distance from x axis
		function compare(h){
			h = Math.abs(h);
			if(h>175){
				if(h>maxDis){
					maxDis = h;
				}
			}
		}
		//Draws a rectangle based on an iteration value
		function drawRect(val,i){
			var height = mathExp.exec(val)*upv; //height on graph
			var x = width * i; //x offset
			var y = 175-height; //y offset
			ctx.fillRect(x,y,width,height);
			ctx.strokeRect(x,y,width,height);
			rectArea = mathExp.exec(val)*step
			if(!isNaN(rectArea)){ //keep track of area
				area += rectArea;
			}
			compare(height); //Keep track of max distance
		}
		//Draw rectangles onto canvas
		if(ep === "left"){
			for(var i=0; i<n; i++){
				var val = a+(step*i); //funtion value
				drawRect(val,i); //draw next rectangle
			}
		}
		else if(ep === "mid"){
			for(var i=0; i<n; i++){
				var val = a+(step*(i+0.5)); //funtion value
				drawRect(val,i); //draw next rectangle
			}
		}
		else if(ep === "right"){
			for(var i=0; i<n; i++){
				var val = a+(step*(i+1)); //funtion value
				drawRect(val,i); //draw next rectangle
			}
		}
		//Save context for unscaling
		ctx.save();
		//Display net area (rounded)
		area = +area.toFixed(5); //arithmetic operator + converts area from str back to num, thus removing extra 0's
		document.getElementById("area").innerHTML = "<strong>Net Area</strong>:<br>" + area;
		//Activate or deactivate scale to fit button
		if(maxDis){
			scale.style.opacity = "1";
			scale.style.cursor = "pointer";
		}
		else{
			scale.style.opacity = "0.5";
			scale.style.cursor = "text";
		}
    }
	//Scale graph to fit canvas element
	scale.onclick = function(){
		if(scale.style.opacity === "1"){
			//Clear graph
			ctx.clearRect(0,0,700,350);
			//Scale the canvas
			ctx.scale(175/maxDis,175/maxDis);
			//Center graph vertically
			var shift = maxDis-175;
			ctx.translate(0,shift);
			//Redraw original graph
			function redrawRect(val,i){
				var height = mathExp.exec(val)*upv; //height on graph
				var x = width * i; //x offset
				var y = 175-height; //y offset
				ctx.fillRect(x,y,width,height);
				ctx.strokeRect(x,y,width,height);
			}
			if(ep === "left"){
				for(var j=0; j<n; j++){
					var val = a+(step*j); //funtion value
					redrawRect(val,j); //draw next rectangle
				}
			}
			else if(ep === "mid"){
				for(var j=0; j<n; j++){
					var val = a+(step*(j+0.5)); //funtion value
					redrawRect(val,j); //draw next rectangle
				}
			}
			else if(ep === "right"){
				for(var j=0; j<n; j++){
					var val = a+(step*(j+1)); //funtion value
					redrawRect(val,j); //draw next rectangle
				}
			}
			//Unscale graph
			ctx.restore();
			//Deactivate button
			scale.style.opacity = "0.5";
			scale.style.cursor = "text";
		}
	}
}