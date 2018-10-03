"use strict";
if (b4w.module_check("atlantida"))
    throw "Failed to register module: atlantida";
b4w.register("atlantida", function(exports, require) {
var m_app   = b4w.require("app");
var m_cfg   = b4w.require("config");
var m_main  = b4w.require("main");
var m_data  = b4w.require("data");
var m_input= b4w.require("input");
var m_hmd       = b4w.require("hmd");
var m_screen	  = b4w.require("screen");
var m_storage     = require("storage");
var m_version = b4w.require("version");
var m_interface = b4w.require("interface2");
var m_conf = b4w.require("game_config");  
var m_main_menu = b4w.require("main_menu");
var m_options_anims= b4w.require("options_anims");
var m_options_3_anims= b4w.require("options_3_anims");
var m_options_4_anims= b4w.require("options_4_anims");
var m_crane_excavation= b4w.require("crane_excavation","crane_excavation");
var m_faders_3d = b4w.require("faders_3d","faders_3d");
var _canvas_elem = null;    
var _timeout1=0;  
var _timeout2=0;  
var _timeout3=0;  
var _timeout4=0;  
var _timeout5=0;  
var _timeout6=0;  
var _timeout7=0;  
var _timeout8=0;  
var _timeout9=0;  
var _lang="";  
exports.init = function() {
    window.addEventListener("load", menu_initialization);  
}
function get_hmd_type() {  
        var hmd_type_tmp = m_input.can_use_device(m_input.DEVICE_HMD) && m_main.detect_mobile()   
          , device_hmd = m_input.get_device_by_type_element(m_input.DEVICE_HMD);
        return hmd_type_tmp ? "HMD" : "NONE"
    }
function init_cb(canvas_elem, success) {
    if (!success) {
        console.log("b4w init failure");
        return;
    }
 	m_storage.init("atlantida save state nivel");
    _canvas_elem = canvas_elem;
    var preloader_cont = document.getElementById("preloader_a_cont");  
    preloader_cont.style.visibility = "visible"
	var load_path = m_conf.ASSETS_PATH+"menu_intro.json";  
   m_data.load(load_path, m_main_menu.intro_load_cb, m_main_menu.preloader_cb,true);        
}   
function menu_initialization() {    
var main_canvas_container = document.getElementById("main_canvas_container");
var product_info_btn = document.getElementById("product_info_btn");  
var help_info_previ= document.getElementsByClassName("help_info_previ");    
 var product_info_previ = document.getElementById("product_info_previ");  
var clockwise= document.getElementsByClassName("clockwise");
var anticlockwise= document.getElementsByClassName("anticlockwise");
var canvas_cont_product_info = document.getElementById("canvas_cont_product_info");
var canvas_cont_faders = document.getElementById("canvas_cont_faders");
    var start_elem = document.getElementById("start_game");
	 var start = document.getElementById("start");
    var start_glow = document.getElementById("start_game_hover");  
    var quality_elem = document.getElementById("quality");
	   quality_elem.style.zIndex = 2;  
	var languages_elem = document.getElementById("languages_bar");
	   languages_elem.style.zIndex = 2;
    var menu_elem = document.getElementById("start_cont");  
    var lang_elem_es = document.getElementById("lang_es");
    var lang_elem_en = document.getElementById("lang_en");
    var qual_elem_low = document.getElementById("low_qual");
    var qual_elem_high = document.getElementById("high_qual");
    var body_elem = document.body;
var	lang_previ=m_storage.get("current_lang","atlantida save state nivel");
    if  ((_lang=="")&&(lang_previ=="")) 
					{
						_lang="es";
					}
					 else
					if (!lang_previ=="")
						_lang=lang_previ;
	 for (var i = 0; i < help_info_previ.length; i++) {
			  help_info_previ[0].addEventListener("click", function() {
				if (product_info_previ.style.visibility=="visible")
				 product_info_previ.style.visibility="hidden"
				 else
				 {
		    console.log("aqui ahora mostramos el texto correspondiente a donde este cada elemento o icono ayuda");
			product_info_previ.style.visibility="visible";  
				 }
			} );
	 }
var geometric_0=document.createElement("div");
		geometric_0.id="geometry_0";
		menu_elem.appendChild(geometric_0);
var div_code0=document.createElement("div");
		div_code0.className ="presentation_game0";
		div_code0.style.visibility="hidden";  
	    geometric_0.appendChild(div_code0);
	var   img_code0=document.createElement("img");
		img_code0.className = "p_n-dimensiones";
		img_code0.setAttribute("src", "css/p_n-dimensiones_es.svg");
		img_code0.setAttribute("draggable", "false");
	    div_code0.appendChild(img_code0);
var div_code1=document.createElement("div");
		div_code1.className ="presentation_game1";
		div_code1.style.visibility="hidden";
	    geometric_0.appendChild(div_code1);
	var   img_code1=document.createElement("img");
		img_code1.className = "p_entertainment";
		img_code1.setAttribute("src", "css/p_entertainment_es.svg");
		img_code1.setAttribute("draggable", "false");
	     div_code1.appendChild(img_code1);
var div_code2=document.createElement("div");
		div_code2.className ="presentation_game2";
		div_code2.style.visibility="hidden";
	    geometric_0.appendChild(div_code2);
	var   img_code2=document.createElement("img");
	   img_code2.className = "p_presents_game";
	   img_code2.setAttribute("src", "css/p_presents_game_es.svg");
   	   img_code2.setAttribute("draggable", "false");
	  div_code2.appendChild(img_code2);
var div_code3=document.createElement("div");
		div_code3.className ="presentation_game3";
		div_code3.style.visibility="hidden";
	   geometric_0.appendChild(div_code3);
	var   img_code3=document.createElement("img");
		img_code3.className = "p_the_lost_city";
		img_code3.setAttribute("src", "css/p_the_lost_city_es.svg");
		img_code3.setAttribute("draggable", "false");
		div_code3.appendChild(img_code3);
var titols_rproduints=false;  
  setTimeout(titols_reproduints(img_code0,img_code1,img_code2,img_code3), 3000); 
function init_contador_temp_anims_fonts(premi) {  
    var contador_temp_anims_fonts = document.getElementById("contador_temp_anims_fonts");
	contador_temp_anims_fonts.innerHTML= premi;
}
function titols_reproduints(img_code0,img_code1,img_code2,img_code3) {
if (titols_rproduints)
	return;
else {
	titols_rproduints=true;
	img_code0.style.animationPlayState="running";
	console.log("ahora deberia dejar de estar paused n-dimensiones titol"); 
    img_code0.style.animationIterationCount="1";
	img_code0.style.animationDelay="7s";
	div_code0.appendChild(img_code0);
	img_code1.style.animationPlayState="running";
	img_code1.style.animationIterationCount="1";
	img_code1.style.animationDelay="14s";
	 	div_code1.appendChild(img_code1);
	img_code2.style.animationPlayState="running";
	img_code2.style.animationIterationCount="1";
	img_code2.style.animationDelay="21s";
		div_code2.appendChild(img_code2);
    img_code3.style.animationPlayState="running";
    img_code3.style.animationIterationCount="1";
    img_code3.style.animationDelay="28s";
		div_code3.appendChild(img_code3);
	_timeout1=setTimeout(function() { div_code0.style.visibility="visible";
							init_contador_temp_anims_fonts(3);
							console.log("ahora se deberia mostrar n-dimensiones");}, 100);
	_timeout2=setTimeout(function() {div_code1.style.visibility="visible";
							init_contador_temp_anims_fonts(2);
							console.log("ahora se deberia mostrar entertainment");}, 10000);
	_timeout3=setTimeout(function() {div_code2.style.visibility="visible";
							init_contador_temp_anims_fonts(1);
							console.log("ahora se deberia mostrar presenta el juego");}, 18000);
	_timeout4=setTimeout(function() {div_code3.style.visibility="visible";
							console.log("ahora se deberia mostrar la cidudad perdida");}, 26000);
	_timeout5=setTimeout(function() {div_code0.style.visibility="hidden";}, 14000);
	_timeout6=setTimeout(function() {div_code1.style.visibility="hidden";}, 20000);
		init_contador_temp_anims_fonts(0);
	_timeout7=setTimeout(function() {div_code2.style.visibility="hidden";
								var contador_temp_anims_fonts_hide = document.getElementById("contador_temp_anims_fonts");
								contador_temp_anims_fonts_hide.innerHTML= "";
							}, 27000);
	_timeout8=setTimeout(function() {div_code3.style.visibility="hidden";}, 35000);
	_timeout9=setTimeout(function() {div_code3.style.visibility="hidden";}, 35000);
	titols_rproduints=false;
    var theCSSprop = window.getComputedStyle(img_code0,null).getPropertyValue("animation-duration");
	console.log("el count o veces a ejcutar animacin n-dimensiones es:"+img_code0.style.animationIterationCount);  
	console.log("el delay actual deberia ser de 7s  y es para n-dimensiones de:"+theCSSprop);
  }	 
}
setTimeout(function() {
	   for (var i = 0; i < clockwise.length; i++) {
			clockwise[i].style.visibility="hidden";
	   }
	   for (var i = 0; i < anticlockwise.length; i++) {
			anticlockwise[i].style.visibility="hidden";
	   }
	}, 8000);  
    menu_elem.style.display = "block";
    menu_elem.style.opacity = 1;   
   m_options_anims.init();  
 m_options_3_anims.init();  
  m_options_4_anims.init(); 
    document.location.hash = "quality=high";   
    function switch_lang(lang)  {
        body_elem.setAttribute("lang", lang);
        start_elem.setAttribute("src", "interface/start_game_" + lang + ".png");
        _lang = lang;
    }
  function init_app() {  
		 var is_mobile = m_interface.detect_mobile;
        var is_debug = m_version.type() == "DEBUG";
        var quality_elem = document.getElementById("quality");
   if (m_interface.detect_mobile)
        var quality = m_cfg.P_LOW;
    else
        var quality = m_cfg.P_HIGH;
      m_app.init({
        canvas_container_id: "main_canvas_container",
        callback: init_cb,
        physics_enabled: true,
        quality: quality,
        show_fps: is_debug,    
        autoresize: true,    
        alpha: false,
		 console_verbose: true,        
		 physics_use_workers: true,  
         stereo: get_hmd_type()
		   });
      console.log("tras m_app.init podemos poner como controla el hmd o gafas la camera , que mov le causa")
}
    function switch_qual(qual) {
        quality_elem.setAttribute("quality", qual);   
        document.location.hash = "quality=" + qual;
    }
    function show_start_btn_glow() {
        start_glow.style.display = "inline-block";
    }
    function show_brand_glow() {
        brand.className = "brand hover";
    }
    function hide_start_btn_glow() {
        start_glow.style.display = "";
    }
    function hide_brand_glow() {
        brand.className = "brand";
    }
    lang_elem_es.addEventListener("click", function() {switch_lang("es")}, false);
    lang_elem_en.addEventListener("click", function() {switch_lang("en")}, false);
   qual_elem_low.addEventListener("click", function() {switch_qual("low")}, false);
   qual_elem_high.addEventListener("click", function() {switch_qual("high")}, false);
    if (m_main.detect_mobile()) {
        switch_qual("low");
		product_info_btn.addEventListener("touchstart", product_info_btn_cb);
    } else {
		product_info_btn.addEventListener("mousedown", product_info_btn_cb);
		}  
 function  start_game_cb() {
	 start_glow.style.display = "inline-block";  
	start_glow.style.zIndex = 1;
	start_glow.style.visibility = "visible";  
	start_glow.style.opacity = 1;
setTimeout(function(){
	   canvas_cont_faders.style.visibility = "visible";
	  canvas_cont_faders.style.zIndex = 0;  
	   canvas_cont_faders.style.opacity= 1;
languages_elem.style.display="";
quality_elem.style.display="";
languages_elem.style.zIndex=-1;  
quality_elem.style.zIndex=-1;
start_glow.style.zIndex=0;
start_elem.style.zIndex=0;
start.style.zIndex=0;
product_info_btn.style.zIndex=0;
 setTimeout(titols_reproduints(img_code0,img_code1,img_code2,img_code3), 3000);  
m_faders_3d.fader_wormhole(26000);
setTimeout(function(){
menu_elem.parentNode.removeChild(menu_elem);
menu_elem.style.visibility = "hidden";
menu_elem.style.zIndex = 0;
clearTimeout(_timeout1);
clearTimeout(_timeout2);
clearTimeout(_timeout3);
clearTimeout(_timeout4);
clearTimeout(_timeout5);
clearTimeout(_timeout6);
clearTimeout(_timeout7);
clearTimeout(_timeout8);
clearTimeout(_timeout9);
init_app();   
   var hmd_device = m_input.get_device_by_type_element(m_input.DEVICE_HMD);
    if (hmd_device &&
            m_input.get_value_param(hmd_device, m_input.HMD_WEBVR_TYPE) ==
            m_input.HMD_WEBVR1)
        m_screen.request_fullscreen_hmd();
    else
		 m_screen.request_fullscreen(document.body, null, null);
 }, 27000);	
}, 3000);	
}  
	checkCookie();
     start.addEventListener("click", start_game_cb, false);
}  
function product_info_btn_cb() {
m_crane_excavation.product_info_btn_click(_lang);  
}
});
b4w.require("atlantida","atlantida").init("es");