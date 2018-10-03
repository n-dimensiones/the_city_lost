"use strict";
if (b4w.module_check("text_content"))
    throw "Failed to register module: text_content";
b4w.register("text_content", function(exports, require) {
var	m_app=b4w.require("app");
var m_main = require("main");
exports.init =  function() {
    window.addEventListener("load", menu_initialization);  
}
function menu_initialization() {	
var volver_a_main_page_btn = document.getElementById("volver_a_main_page_btn");
var volver_a_main_page_btn_hover = document.getElementById("volver_a_main_page_btn_hover");
var body_elem = document.body;	
console.log("creo que sino se ejecuta esto estoy mec");
var lang="";
 var url_params = m_app.get_url_params();     
if (url_params)		 
{	
console.log("el parametro pasado como hash es:"+url_params.lang);		  
body_elem.setAttribute("lang",url_params.lang);
}
if (m_main.detect_mobile()) { 																		
volver_a_main_page_btn.addEventListener("touchstart", volver_a_main_page_btn_cb, false); 
} 
else {
 volver_a_main_page_btn.addEventListener("click", volver_a_main_page_btn_cb, false);	
}
}  
 function show_volver_a_main_page_btn_hover() {
    }
function hide_volver_a_main_page_btn_hover() {
volver_a_main_page_btn.style.display = "inline-block"; 		
volver_a_main_page_btn.style.zIndex = 2; 
volver_a_main_page_btn.style.visibility = "visible";  
volver_a_main_page_btn.style.opacity = 1;  
volver_a_main_page_btn_hover.style.display = "";
volver_a_main_page_btn_hover.style.zIndex = 0; 
volver_a_main_page_btn_hover.style.visibility = "hidden";  
volver_a_main_page_btn_hover.style.opacity = 0;  
    }
function volver_a_main_page_btn_cb(e) {  
        e.stopPropagation();
        e.preventDefault();   	
volver_a_main_page_btn_hover.style.display = "inline-block";
volver_a_main_page_btn_hover.style.zIndex = 2; 
volver_a_main_page_btn_hover.style.visibility = "visible";  
volver_a_main_page_btn_hover.style.opacity = 1;  
volver_a_main_page_btn.style.display = "";		
volver_a_main_page_btn.style.zIndex = 0; 
volver_a_main_page_btn.style.visibility = "hidden";  
volver_a_main_page_btn.style.opacity = 0;  
	 setTimeout(function(){
           window.history.back();     
        }, 1000);	
}
});
b4w.require("text_content").init("es");