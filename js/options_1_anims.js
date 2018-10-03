"use strict"
if (b4w.module_check("options_1_anims"))
    throw "Failed to register module: options_1_anims";
b4w.register("options_1_anims", function(exports, require) {
var m_main_menu=require("main_menu");
var m_interface=require("interface2");
var m_main = require("main");
var m_data = require("data");
var m_storage =  require("storage");
var m_input= require("input");
var m_screen = require("screen");
var m_char= require("character2");
var m_faders_3d = require("faders_3d");
var _data_id_fps=[];
var _control_data_id=[];
var _is_main_menu=false; 
var _previ_current_char="";
var _current_level="";
var _current_avatar="";
var _select_nivel_pendent=true;
var _select_avatar_pendent=true;
var _lanzar_nivel_pendent=true;
var _char_fps_name = "";  
var _char_tps_name = "";  
var _index=3;
var _length=4; 
var select_hunter_btn=null;
var select_amazon_btn= null;
exports.hide_avatars_btn=hide_avatars_btn;
function hide_avatars_btn() {
select_hunter_btn.style.zIndex = 0; 
select_hunter_btn.style.visibility = "hidden";  
select_hunter_btn.style.opacity = 0;  
select_amazon_btn.style.zIndex = 0; 
select_amazon_btn.style.visibility = "hidden";  
select_amazon_btn.style.opacity = 0;  
}
exports.hide_btns_control_intro=hide_btns_control_intro; 
function  hide_btns_control_intro() {
lanzar_level_btn.style.zIndex = 0;
lanzar_level_btn.style.visibility = "hidden";  
lanzar_level_btn.style.opacity = 0;   
select_level01_btn.style.zIndex = 0;
select_level01_btn.style.visibility = "hidden";  
select_level01_btn.style.opacity = 0;   
select_level02_btn.style.zIndex = 0;
select_level02_btn.style.visibility = "hidden";  
select_level02_btn.style.opacity = 0;  
anima_avatar_btn.style.zIndex = 0;
anima_avatar_btn.style.visibility = "hidden";  
anima_avatar_btn.style.opacity = 0;   
menu_select_avatar_btn.style.zIndex = 0;
menu_select_avatar_btn.style.visibility = "hidden";  
menu_select_avatar_btn.style.opacity = 0;   
select_hunter_btn.style.zIndex = 0; 
select_hunter_btn.style.visibility = "hidden";  
select_hunter_btn.style.opacity = 0;  
select_amazon_btn.style.zIndex = 0; 
select_amazon_btn.style.visibility = "hidden";  
select_amazon_btn.style.opacity = 0;  
fullscreen_btn.style.zIndex = 0; 
fullscreen_btn.style.visibility = "hidden";  
fullscreen_btn.style.opacity = 0;  
exit_fullscreen_btn.style.zIndex = 0; 
exit_fullscreen_btn.style.visibility = "hidden";  
exit_fullscreen_btn.style.opacity = 0;  	
msg_select_char.style.zIndex = 0; 
msg_select_char.style.visibility = "hidden";  
msg_select_char.style.opacity = 0;  
help_info1_select_avatar.style.visibility="hidden";
	help_info1_select_avatar.style.zIndex = 0; 
	presentacion_n_d_btn.style.visibility="hidden";
	proximamente_btn.style.visibility="hidden";
	rot_scene_intro_btn.style.visibility="hidden";
}   
exports.init = function(load_level_cb,change_avatar_cb, is_main_menu) {       
var main_canvas_container= document.getElementById("main_canvas_container");
m_storage.init("atlantida save state nivel");
var presentacion_n_d_btn = document.getElementById("presentacion_n_d_btn");
var rot_scene_intro_btn = document.getElementById("rot_scene_intro_btn");		
var proximamente_btn = document.getElementById("proximamente_btn");	
if (m_char.get_wrapper())
_is_main_menu=m_char.get_wrapper().is_main_menu;
var select_level01_btn = document.getElementById("select_level01_btn");
var select_level02_btn = document.getElementById("select_level02_btn");
var lanzar_level_btn= document.getElementById("lanzar_level_btn");
var anima_avatar_btn= document.getElementById("anima_avatar_btn");
var msg_select_char= document.getElementById("msg_select_char");    
 var help_select_avatar= document.getElementsByClassName("help_select_avatar");
 var help_info1_select_avatar = document.getElementById("help_info1_select_avatar");  
var anticlockwise= document.getElementsByClassName("anticlockwise");
var menu_select_avatar_btn = document.getElementById("menu_select_avatar_btn");
select_hunter_btn= document.getElementById("select_hunter_btn");
select_amazon_btn= document.getElementById("select_amazon_btn");
var fullscreen_btn= document.getElementById("fullscreen_btn");
var exit_fullscreen_btn= document.getElementById("exit_fullscreen_btn");
select_level01_btn.style.zIndex = 2;
select_level01_btn.style.visibility = "visible";  
select_level01_btn.style.opacity = 1;   
select_level02_btn.style.zIndex = 2;
select_level02_btn.style.visibility = "visible";  
select_level02_btn.style.opacity = 1;  
lanzar_level_btn.style.zIndex = 2;
lanzar_level_btn.style.visibility = "visible";  
lanzar_level_btn.style.opacity = 1;   
anima_avatar_btn.style.zIndex = 2;
anima_avatar_btn.style.visibility = "visible";  
anima_avatar_btn.style.opacity = 1;   
menu_select_avatar_btn.style.zIndex = 2; 
menu_select_avatar_btn.style.visibility = "visible";  
menu_select_avatar_btn.style.opacity = 1;  
fullscreen_btn.style.zIndex = 2; 
fullscreen_btn.style.visibility = "visible";  
fullscreen_btn.style.opacity = 1;  
exit_fullscreen_btn.style.zIndex = 2; 
exit_fullscreen_btn.style.visibility = "visible";  
exit_fullscreen_btn.style.opacity = 1;  
msg_select_char.style.zIndex = 2; 
msg_select_char.style.visibility = "visible";  
msg_select_char.style.opacity = 1;  
	presentacion_n_d_btn.style.visibility="visible";
	proximamente_btn.style.visibility="visible";
	rot_scene_intro_btn.style.visibility="visible";
for (var i = 0; i < anticlockwise.length; i++) {
			anticlockwise[i].style.visibility="hidden";  
	   }
anticlockwise[3].style.visibility="visible";
if (m_main.detect_mobile()) { 
anima_avatar_btn.addEventListener("touchstart", anima_avatar_btn_cb, false);
lanzar_level_btn.addEventListener("touchstart", lanzar_level_btn_cb, false);
select_level01_btn.addEventListener("touchstart", select_level01_btn_cb, false);
select_level02_btn.addEventListener("touchstart", select_level02_btn_cb, false);
menu_select_avatar_btn.addEventListener("touchstart", menu_select_avatar_btn_cb, false);
select_hunter_btn.addEventListener("touchstart", select_hunter_btn_cb, false);
select_amazon_btn.addEventListener("touchstart", select_amazon_btn_cb, false);
 presentacion_n_d_btn.addEventListener("touchstart", presentacion_n_d_cb, false);
	proximamente_btn.addEventListener("touchstart", proximamente_cb, false);
	rot_scene_intro_btn.addEventListener("touchstart", rot_scene_intro_cb, false);
fullscreen_btn.addEventListener("click", fullscreen_btn_cb, false);  
exit_fullscreen_btn.addEventListener("touchstart", exit_fullscreen_btn_cb, false);
 for (var i = 0; i < help_select_avatar.length; i++) {
			  help_select_avatar[0].addEventListener("touchstart", function() {
				if (help_info1_select_avatar.style.visibility=="visible")
				 help_info1_select_avatar.style.visibility="hidden"
				 else 
				 {
		    console.log("aqui ahora mostramos el texto correspondiente a donde este cada elemento o icono ayuda");
			help_info1_select_avatar.style.visibility="visible";  
				 }
			} );
	 }
} 
else {
anima_avatar_btn.addEventListener("click", anima_avatar_btn_cb, false);
lanzar_level_btn.addEventListener("click", lanzar_level_btn_cb, false);
 select_level01_btn.addEventListener("click", select_level01_btn_cb, false);
 select_level02_btn.addEventListener("click", select_level02_btn_cb, false);
 menu_select_avatar_btn.addEventListener("click", menu_select_avatar_btn_cb, false);
 select_hunter_btn.addEventListener("click", select_hunter_btn_cb, false);
 select_amazon_btn.addEventListener("click", select_amazon_btn_cb, false);
 for (var i = 0; i < help_select_avatar.length; i++) {
			  help_select_avatar[0].addEventListener("click", function() {
				if (help_info1_select_avatar.style.visibility=="visible")
				 help_info1_select_avatar.style.visibility="hidden"
				 else 
				 {
		    console.log("aqui ahora mostramos el texto correspondiente a donde este cada elemento o icono ayuda");
			help_info1_select_avatar.style.visibility="visible";  
				 }
			} );
	 }
 presentacion_n_d_btn.addEventListener("click", presentacion_n_d_cb, false);
 proximamente_btn.addEventListener("click", proximamente_cb, false);
 rot_scene_intro_btn.addEventListener("click", rot_scene_intro_cb, false);
 fullscreen_btn.addEventListener("click", fullscreen_btn_cb, false);
 exit_fullscreen_btn.addEventListener("click", exit_fullscreen_btn_cb, false);
    }
  function presentacion_n_d_cb() {
	   console.log("funciona la presentacion lo que sea");
	  m_main_menu.presentacion_cb();
  }
  function proximamente_cb() {
  m_faders_3d.fader_wormhole(26000);
  window.open("https://www.n-dimensiones.es/assets/greek_presentation/","_self");      //abre una nueva ventana
  console.log("dejamos una imagen tachada porque no hay aun un video o algo a mostrar aqui podria ser multiplayer juego");	  
  }
  function rot_scene_intro_cb() {
	  m_main_menu.rot_anim_mainmenu_cb();  
	  console.log("funciona la rotacion escena  lo que sea");
  }
 function oculta_muestra_info1_cb() {
  if  ((_select_avatar_pendent)||((_select_nivel_pendent)||(_lanzar_nivel_pendent))) {
	if (help_info1_select_avatar.style.visibility=="visible")
	{
	 help_info1_select_avatar.style.visibility="hidden";
    }
	 else 
		{
		help_info1_select_avatar.style.visibility = "visible";  
		help_info1_select_avatar.style.zIndex = 2; 
		help_info1_select_avatar.style.opacity = 1;  
		help_info1_select_avatar.style.display = "block"; 
		 console.log("mostramos info de seleccionar avatar o nivel o lanzar nivel");
		} 
   }
 }
 function oculta_muestra_info2_cb() {
	  help_info1_select_avatar.style.visibility= "hidden";
	  help_info3_select_avatar.style.visibility= "hidden";
	  help_info1_select_avatar.style.display = "";
	  help_info3_select_avatar.style.display = "";
 if ((!_select_avatar_pendent)&&((_select_nivel_pendent)&&(_lanzar_nivel_pendent))) {	 
	if (help_info2_select_avatar.style.visibility=="visible")      
	{	 help_info2_select_avatar.style.visibility="hidden";
	}	
	 else 
	 {
		help_info2_select_avatar.style.visibility= "visible";  
		help_info2_select_avatar.style.zIndex = 2; 
		help_info2_select_avatar.style.opacity = 1;  
		help_info2_select_avatar.style.display = "block"; 
		 console.log("mostramos info de seleccionar nivel");
		 info2.style.visibility="visible";
	 } 
  } 
 }
 function oculta_muestra_info3_cb() {
	  help_info1_select_avatar.style.visibility= "hidden";
	  help_info2_select_avatar.style.visibility= "hidden";
	 help_info1_select_avatar.style.display = "";
	 help_info2_select_avatar.style.display = "";
 if (((_lanzar_nivel_pendent)&&(!_select_nivel_pendent))&&(!_select_avatar_pendent)){	 
	if (help_info3_select_avatar.style.visibility=="visible")
	{ help_info3_select_avatar.style.visibility= "hidden";
	}	
	 else 
	 {
		help_info3_select_avatar.style.visibility= "visible";  
		help_info3_select_avatar.style.zIndex = 2; 
		help_info3_select_avatar.style.opacity = 1;  
		help_info3_select_avatar.style.display = "block"; 
		console.log("mostramos info de lanzar nivel");
			info3.style.visibility="visible";
	 } 
  }
 }
function mostrar_help_select_nivel() {
msg_select_nivel.style.zIndex = 2; 
msg_select_nivel.style.visibility = "visible";  
msg_select_nivel.style.opacity = 1; 
msg_select_char.style.zIndex = 0; 
msg_select_char.style.visibility = "hidden";  
msg_select_char.style.opacity = 0;  
}	
function mostrar_help_lanzar_nivel() {
msg_lanza_game.style.zIndex = 2; 
msg_lanza_game.style.visibility = "visible";  
msg_lanza_game.style.opacity = 1;  
msg_select_nivel.style.zIndex = 0; 
msg_select_nivel.style.visibility = "hidden";  
msg_select_nivel.style.opacity = 0; 
}	
function ocultar_help_lanzar_nivel() {
msg_lanza_game.style.zIndex = 0; 
msg_lanza_game.style.visibility = "hidden";  
msg_lanza_game.style.opacity = 0;  
}	
   function select_level01_btn_cb(e) {  
        e.stopPropagation();
        e.preventDefault();
_current_level="level01";
 _select_nivel_pendent=false;
  anticlockwise[1].style.visibility="hidden";
 anticlockwise[2].style.visibility="visible";
 console.log("el actual nivel seleccionado es: "+_current_level);
   }
   function select_level02_btn_cb(e) {  
        e.stopPropagation();
        e.preventDefault();
_current_level="level02";
console.log("el actual nivel seleccionado es: "+_current_level);
 _select_nivel_pendent=false;
  anticlockwise[1].style.visibility="hidden";
 anticlockwise[2].style.visibility="visible";
   }
   function lanzar_level_btn_cb(e) {  
        e.stopPropagation();
        e.preventDefault();
hide_btns_control_intro();   
  _lanzar_nivel_pendent=false;  
   anticlockwise[2].style.visibility="hidden";
   _previ_current_char=m_storage.get("current_char","atlantida save state nivel");
    if  ((_current_avatar=="")&&(_previ_current_char=="")) 
					{
						_char_tps_name="hunter_tps_avatar";
					}	
					 else
					if (!_previ_current_char=="")
						_char_tps_name=_previ_current_char;
					_char_tps_name=_current_avatar; 
					_char_fps_name="hunter3_fps_avatar";  
  m_main_menu.load_level_cb(_current_level,false,_control_data_id,_data_id_fps, _char_fps_name, _char_tps_name, false,_index,_length);
  }
  function anima_avatar_btn_cb(e) {  
        e.stopPropagation();
        e.preventDefault();
console.log("pendiente asignar animaciones pero ya esta el codigo definido solo usarlo aqui taben");
   }
function menu_select_avatar_btn_cb(e) {  
        e.stopPropagation();
        e.preventDefault();   
select_hunter_btn.style.zIndex = 2; 
select_hunter_btn.style.visibility = "visible";  
select_hunter_btn.style.opacity = 1;  
select_amazon_btn.style.zIndex = 2; 
select_amazon_btn.style.visibility = "visible";  
select_amazon_btn.style.opacity = 1;  
change_avatar_cb(0,_current_level, _current_avatar);  
}  
function select_greek_btn_cb(e) {  
        e.stopPropagation();
        e.preventDefault();   
		_current_avatar="greek_avatar";   
		console.log("current avatar"+_current_avatar);
		hide_avatars_btn();
		 _select_avatar_pendent=false;
	  anticlockwise[3].style.visibility="hidden";
	 anticlockwise[1].style.visibility="visible";
   if (m_char.get_wrapper()) 
	 m_char.get_wrapper().current_char=_current_avatar;
}  
function select_hunter_btn_cb(e) {  
        e.stopPropagation();
        e.preventDefault();   
		_current_avatar="hunter_avatar";   
		console.log("current avatar"+_current_avatar);
		hide_avatars_btn();
    _select_avatar_pendent=false;
	anticlockwise[1].style.visibility="visible";
	 anticlockwise[3].style.visibility="hidden";
  if (m_char.get_wrapper())
	 m_char.get_wrapper().current_char=_current_avatar;
}  
function select_hunter2_btn_cb(e) {  
        e.stopPropagation();
        e.preventDefault();   
		_current_avatar="hunter2_avatar";   
		console.log("current avatar"+_current_avatar);
		hide_avatars_btn();
		 _select_avatar_pendent=false;
	anticlockwise[1].style.visibility="visible";	 
	 anticlockwise[3].style.visibility="hidden";
   if (m_char.get_wrapper())
	 m_char.get_wrapper().current_char=_current_avatar;
}  
function select_amazon_btn_cb(e) {  
        e.stopPropagation();
        e.preventDefault();   
		_current_avatar="amazon_avatar";   
		console.log("current avatar"+_current_avatar);
		hide_avatars_btn();
		 _select_avatar_pendent=false;
	anticlockwise[1].style.visibility="visible";	 
	 anticlockwise[3].style.visibility="hidden";
   if (m_char.get_wrapper()) 
	 m_char.get_wrapper().current_char=_current_avatar;
}  
function fullscreen_btn_cb(e) {
	    var hmd_device = m_input.get_device_by_type_element(m_input.DEVICE_HMD);
    if (hmd_device &&
            m_input.get_value_param(hmd_device, m_input.HMD_WEBVR_TYPE) ==
            m_input.HMD_WEBVR1)
        m_screen.request_fullscreen_hmd();
    else
	 m_screen.request_fullscreen(document.body, null, null);  
}
function exit_fullscreen_btn_cb(e) {
    m_screen.exit_fullscreen();
}
  } 
});