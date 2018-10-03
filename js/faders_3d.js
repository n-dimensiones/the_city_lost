"use strict";
b4w.register("faders_3d", function(exports, require) {
var m_anim     = require("animation");
var m_app      = require("app");
var m_cfg      = require("config");
var m_cont     = require("container");
var m_data     = require("data");
var m_main     = require("main");
var m_scs      = require("scenes");
var m_sfx      = require("sfx");	
var m_ver       = require("version");
var m_mat	 =  require("material");  
var DEBUG = (m_ver.type() == "DEBUG");
var _whormhole_rig= null;
var _whormhole_body= null;
var _m_camera_shading=null;
var _lang="es";	
exports.init_faders_3d_app= function() {	  
	 m_app.init({
        canvas_container_id: "canvas_cont_faders",    
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
			_m_camera_shading=m_scs.get_object_by_name("camera_shading");
			m_scs.hide_object(_m_camera_shading);
	     _whormhole_rig = m_scs.get_object_by_dupli_name("wormhole","Armature",data_id);
		  _whormhole_body = m_scs.get_object_by_dupli_name("wormhole", "wormhole",data_id);
		   m_scs.hide_object(_whormhole_body);
}	
function init_product_info_cb()	{
	var load_path = "assets/crane_wormhole_blak_faders.json";
var preloader_cont = document.getElementById("preloader_t_cont");  
    preloader_cont.style.visibility = "visible"
    m_data.load(load_path, load_product_info_cb,preloader_cb);      
}	
exports.fader_black=fader_black;
function fader_black() {
	  m_data.activate_media();
			  m_scs.show_object(_m_camera_shading);
			   m_mat.set_nodemat_value(_m_camera_shading,["camera_shading_mat","Value"], 1);
				setTimeout(function() {			        			
					 m_mat.set_nodemat_value(_m_camera_shading,["camera_shading_mat","Value"], 0);
						}, 16000);			 	
}
exports.fader_wormhole=fader_wormhole;
function fader_wormhole(delay_num)  {
			     m_data.activate_media();
			if (!_whormhole_body)   
               return;				
			  m_scs.show_object(_whormhole_body);  
			    m_anim.apply(_whormhole_rig, "ArmatureAction");
				m_anim.set_behavior(_whormhole_rig, m_anim.AB_FINISH_STOP);
				m_anim.play(_whormhole_rig);
			   m_mat.set_nodemat_value(_whormhole_body,["wormhole_mat","Value"], 1); 
				setTimeout(function() {			        			
					 m_mat.set_nodemat_value(_whormhole_body,["wormhole_mat","Value"], 0);   
			m_scs.hide_object(_whormhole_body);
						}, delay_num);			 			
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
b4w.require("faders_3d","faders_3d").init_faders_3d_app();