var gpRecortador  =  function (objeto, callback) {
	var colorFondo = "#e0e0e0";
	var nImagen = new Image ();
	var imagenRecortada = new Image();
	var centroX, centroY, alto, ancho, escala, movX, movY;
	escala = 1.2;
	movX=0;
	movY=0;
	var pixelesMov = 5; 
	var intervalo ;
	var toqueX, toqueY;
	var botoneraRecortador = document.getElementById("botoneraRecortador");
	var recortador =  document.getElementById("recortador");

	if (objeto){
		if (objeto.colorFondo){
			var colorFondo = objeto.colorFondo;
		}
		if (objeto.escala){
			var escala = objeto.escala;
		}
		if (objeto.pixelesMov){
			var escala = objeto.pixelesMov;
		}
		if(objeto.botonera){
			botoneraRecortador = document.getElementById(objeto.botonera);
		}
		if(objeto.recortador){
			recortador = document.getElementById(objeto.recortador);
		}
		if(objeto.redondo){
			recortador.className += " redondo" 
		}

	}


	botoneraRecortador.innerHTML= '<a id ="botonAddImage" class="btn-floating btn-small waves-effect waves-light right"><i class="material-icons">camera_alt</i></a>';
	botoneraRecortador.innerHTML += '<a id ="botonCutImage" class="btn-floating btn-small waves-effect waves-light left hide"><i class="material-icons">crop</i></a>' ;
	botoneraRecortador.innerHTML += ' <input type="file" class="hide" id ="fileAddImagen">' ;
	var fileAddImagen= document.getElementById("fileAddImagen");
	recortador.innerHTML = '<canvas id = "myCanvas"></canvas>';
	canvas = document.getElementById("myCanvas");
	if (canvas.getContext("2d")){
		var context = canvas.getContext("2d");
		var dim= getComputedStyle(recortador); 
		canvas.width = dim.width.split("px")[0];
		canvas.height = dim.width.split("px")[0];
		context.fillStyle=colorFondo;
		context.fillRect(0,0, canvas.width, canvas.height);
		var botonAddImage = document.getElementById("botonAddImage");
		botonAddImage.addEventListener("click", function(e) {
			e.preventDefault();
			fileAddImagen.click();
			fileAddImagen.addEventListener("change", verImagen, undefined);
	    });

	    var verImagen = function (e){
	    	e.preventDefault();
	    	nImagen.src=URL.createObjectURL(e.target.files[0]);
	    	nImagen.onload = function (){
	    		alto = nImagen.height;
	    		ancho=nImagen.width;
	    		if (ancho > canvas.width || alto > canvas.height ){
	    			ancho/=1.30;
	    			alto/=1.30;
	    			console.log("escalado");
	    		}
	    	
	    		canvas.addEventListener("mousewheel", escalarImagen, undefined);
	    		canvas.addEventListener("mousedown", moverImagen, undefined);
	    		canvas.addEventListener("mouseup", pararMovimiento, undefined);
	    		canvas.addEventListener("mouseout", pararMovimiento, undefined);
	    		canvas.addEventListener("touchmove", moverImagenTouch);
	    		canvas.addEventListener("touchstart", initToque);
	    		canvas.addEventListener("touchend", function (){var toqueX, toqueY; });

				var botonCutImage = document.getElementById('botonCutImage');
				botonCutImage.className = botonCutImage.className.replace("hide", "");
				recortador.className += " recortable";
				botonCutImage.addEventListener("click", cortarImagen, undefined);
				dibujarImagen()
	    		
	    	}
	    }

	    var dibujarImagen = function (){
	    	context.fillStyle=colorFondo;
			centroX=(canvas.width/2) - (ancho/2) + (movX) ;
			centroY=(canvas.height/2) - (alto/2) + (movY);
	    	context.fillRect(0,0, canvas.width, canvas.height);
	    	context.drawImage(nImagen, centroX, centroY, ancho, alto);

	    }
	    var escalarImagen = function (e){
	    	e.preventDefault();
	    
	    	if (e.deltaY < 0 ){
	    		ancho *= escala;
	    		alto *= escala;
	    	}
	    	if (e.deltaY > 0 ){
	    		ancho /= escala;
	    		alto /= escala;
	    	}
	    	dibujarImagen();
	    }
		var moverImagen = function (e){
			e.preventDefault();
			console.log("hi i am here ")
			intervalo = setInterval(() => {
		 		if (e.x > (canvas.width/2)){
					movX+= +pixelesMov;
				}
				if (e.x < (canvas.width/2)){
					movX += -pixelesMov;
				}

				if (e.y > (canvas.height/2)){
					movY += +pixelesMov;
				}
				if (e.y < (canvas.height/2)){
					movY += -pixelesMov;
				}
				dibujarImagen();
			}, 200);
		}
		var moverImagenTouch = function (e) {

			if (toqueX < e.changedTouches[0].clientX){
				movX+= +pixelesMov;
			}
			if (toqueX > e.changedTouches[0].clientX){
				movX+= -pixelesMov;
			}		
			if (toqueY < e.changedTouches[0].clientY){
				movY+= +pixelesMov;
			}
			if (toqueY > e.changedTouches[0].clientY){
				movY+= -pixelesMov;
			}
			dibujarImagen();

		}
		var initToque = function (e){
			toqueX= e.changedTouches[0].clientX;
			toqueY=e.changedTouches[0].clientY;	
		}
		var pararMovimiento = function (e){
			clearInterval(intervalo);
		}
		var cortarImagen = function (e){
			imagenRecortada.src = canvas.toDataURL();
			imagenRecortada.onload =  function (){
				botonCutImage.className +=" hide";
				recortador.className = recortador.className.replace("recortable", "") ;
				if(typeof callback == 'function'){
					callback({estado: true, recorte: imagenRecortada});	
				}else{
					console.log("IMAGEN RECORTADA: " )
				}

				
			}
		
		}


	}

}