"use strict";
b4w.register("crane_excavation", function(exports, require) {
var m_anim     = require("animation");
var m_app      = require("app");
var m_cfg      = require("config");
var m_cont     = require("container");
var m_data     = require("data");
var m_main     = require("main");
var m_scs      = require("scenes");
var m_sfx      = require("sfx");	
var m_ver       = require("version");
var DEBUG = (m_ver.type() == "DEBUG");
var _lang="es";	
exports.init_product_info_app= function() {	  
	 m_app.init({
        canvas_container_id: "canvas_cont_product_info",    
        callback: init_product_info_cb,
        physics_enabled: false,
        alpha: true,
        assets_dds_available: !DEBUG,
        assets_min50_available: !DEBUG,
        report_init_failure: false,
        media_auto_activation: false
    });
}
function load_product_info_cb(data_id) {  
   var letters_arm = m_scs.get_object_by_name('crane_rig',data_id);
    m_anim.stop(letters_arm);
	console.log("no dudes que se cargo la grua .json file escena con data id igual a:"+data_id);
}	
function init_product_info_cb()	{
       var load_path = "assets/crane_excavation_low.json";
var preloader_cont = document.getElementById("preloader_t_cont");  
    preloader_cont.style.visibility = "visible"
    m_data.load(load_path, load_product_info_cb,preloader_cb);      
}	
exports.product_info_btn_click=product_info_btn_click;
 function product_info_btn_click(lang) {
    m_data.activate_media();
    var letters_arm = m_scs.get_object_by_name('crane_rig');
    var spk = m_scs.get_object_by_name("deportivo_walk");
	_lang=lang;
	 	if (!m_sfx.is_playing(spk)) 
	{
        m_sfx.play_def(spk);
        m_sfx.cyclic(spk, true);
	}
    m_anim.apply(letters_arm, "crane_find");
	 m_anim.set_behavior(letters_arm, m_anim.AB_STOP);
    m_anim.play(letters_arm, letters_obj_cb);
}
function letters_obj_cb(obj) {
	  var spk = m_scs.get_object_by_name("deportivo_walk");
	  if (m_sfx.is_playing(spk))
		  m_sfx.stop(spk);
    m_anim.apply(obj, "crane_iexcavation");  
    m_anim.set_behavior(obj, m_anim.AB_STOP);
    m_anim.play(obj);
		setTimeout(function() {
           window.open("making_of/?lang="+_lang,"_self");
	console.log("deberia haberse abierto aqui la pagina de product info");   
        }, 3000);   
}
function preloader_cb(percentage) {
    var prelod_dynamic_path = document.getElementById("prelod_t_dynamic_path");
    var percantage_num      = prelod_dynamic_path.nextElementSibling;
    prelod_dynamic_path.style.width = percentage + "%";
    percantage_num.innerHTML = percentage + "%";
    if (percentage == 100) {
        remove_preloader();
        return;
    }
}
function remove_preloader() {
    var preloader_cont = document.getElementById("preloader_t_cont");
    setTimeout(function(){
            preloader_cont.style.visibility = "hidden"
        }, 1000);   
}
	});
b4w.require("crane_excavation","crane_excavation").init_product_info_app();