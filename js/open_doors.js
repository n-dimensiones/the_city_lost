"use strict"
if (b4w.module_check("open_doors"))
    throw "Failed to register module: open_doors";
b4w.register("open_doors", function(exports, require) {
var m_ctl = require("controls");  
var m_scs = require("scenes");  
var m_phy = require("physics");   
var m_anim = require("animation");    
var m_sfx = require("sfx");   
var m_trans = require("transform");  
var m_quat  = require("quat");   
var m_cons  = require("constraints"); 
var m_input = require("input");  
var m_mouse = require("mouse");		
var m_util  = require("util");		
var m_camera = require("camera");	
var m_resources= require("resources"); 
var m_canon = require("canon");							
var m_conf = require("game_config");  
var m_view	= require("control_view");  
var m_interface = require("interface2");  
var m_char     = require("character2");    
var _se_salio_de_la_casa=0;  
var _current_door= null;						
var _door_house_cam_pos= null;
var _stone01_loaded=false;
var _wood01_loaded=false;
var _llist_doors_fake_stone_01=null;
var	_llist_doors_fake_wood_01=null;
var	_llist_doors_stone_01=null;
var	_llist_doors_wood_01=null;
var	_llist_doors_rig_stone_01=null;
var	_llist_doors_rig_wood_01=null;
var	_llist_doors_collision_body_stone_01=null;  
var	_door_speaker_stone_01=null;
var	_door_speaker_wood_01=null;
var _llist_pos_cam_stone_01=null;
var _llist_pos_cam_wood_01=null;
var _is_in_house=false;  
exports.precache_doors=precache_doors;
function precache_doors(data_id)   {  
	 _stone01_loaded=false;
	 _wood01_loaded=true;
	if (_stone01_loaded)
	{
		_llist_doors_rig_stone_01=m_scs.get_object_by_dupli_name("house_stone_01","soporte_door", data_id);   
	   _llist_doors_fake_stone_01=m_scs.get_object_by_dupli_name("house_stone_01","fake_door", data_id);   
		_llist_doors_collision_body_stone_01=m_scs.get_object_by_dupli_name("house_stone_01","door_stone_collision", data_id);
		_llist_pos_cam_stone_01=m_scs.get_object_by_dupli_name("house_stone_01","posicion_camera_01", data_id);
		_door_speaker_stone_01=m_scs.get_object_by_dupli_name("house_stone_01","door_stone_spk", data_id);
	}
	if (_wood01_loaded)
	{
	_llist_doors_rig_wood_01=m_scs.get_object_by_dupli_name("house01_wood","soporte_door", data_id);
    _llist_doors_fake_wood_01=m_scs.get_object_by_dupli_name("house01_wood","fake_door", data_id);
	_llist_doors_wood_01=m_scs.get_object_by_dupli_name("house01_wood","door01_wood", data_id);   
	_llist_pos_cam_wood_01=m_scs.get_object_by_dupli_name("house01_wood","posicion_camera_01", data_id);
	_door_speaker_wood_01=m_scs.get_object_by_dupli_name("house01_wood","gate_squeak", data_id);
	}	
}
exports.open_ports=open_ports;											
function open_ports(on_ground_tmp,elapsed_sensor,data_id,index,length) {    
if  (_wood01_loaded)					{
		play_anim(_llist_doors_rig_wood_01,"door_house_wood_01_close",m_anim.AB_FINISH_STOP); 
	var sensor_opened_door_wood_01 = m_ctl.create_custom_sensor(0);  
   var  sensor_collition_wood_01_cam = m_ctl.create_collision_sensor(_llist_doors_fake_wood_01, "CAMERA", !1);  
   var sensor_collition_wood_01_char = m_ctl.create_collision_sensor(_llist_doors_fake_wood_01, "CHARACTER", !1);   
			}
if  (_stone01_loaded)		{		
		play_anim(_llist_doors_rig_stone_01,"door_house_stone_01_close",m_anim.AB_FINISH_STOP); 
		  var sensor_opened_door_stone_01 = m_ctl.create_custom_sensor(0);  
		  var  sensor_collition_stone_01_cam = m_ctl.create_collision_sensor(_llist_doors_fake_stone_01, "CAMERA", !1);  
          var sensor_collition_stone_01_char = m_ctl.create_collision_sensor(_llist_doors_fake_stone_01, "CHARACTER", !1);   
			}
	var sensor_touch_door= m_ctl.create_custom_sensor(0);  
    var sensor_click_door= m_ctl.create_custom_sensor(0);  
	 var sensor_out_house = m_ctl.create_custom_sensor(1);  
var sensor_in_house = m_ctl.create_ray_sensor(m_char.get_wrapper().picker, [0, 0, 0],   
                                          [0, 0, -1], "IN_HOUSE", true);
   var  sensor_keyO = m_ctl.create_keyboard_sensor(m_ctl.KEY_O);
   var sensorkeyX = m_ctl.create_keyboard_sensor(m_ctl.KEY_X);  
   	var aa = m_input.check_enable_gamepad_indices();  
	  var index = aa.length ? aa[aa.length - 1] : 0		
      var sensor_gamepad_btn_open= m_ctl.create_gamepad_btn_sensor(m_input.GMPD_BUTTON_0, index);  
	  var sensor_gamepad_btn_close= m_ctl.create_gamepad_btn_sensor(m_input.GMPD_BUTTON_2, index);  
 var  near_obj_info_element = document.getElementById("near_obj_info_container");  
	function touch_door_action(event) {		
    event.preventDefault();		
	m_ctl.set_custom_sensor(sensor_click_door, 1);   
	m_ctl.set_custom_sensor(sensor_touch_door, 1); 	
	  } 
	 near_obj_info_element.addEventListener("touchstart", touch_door_action, !1);  
	 near_obj_info_element.addEventListener("click", touch_door_action, !1); 
    var	in_house_cb = function(obj, id, pulse,f) {  
	if (pulse)	{	
			m_ctl.set_custom_sensor(sensor_out_house, 0);     			 
			_is_in_house=true;
				if (_llist_doors_fake_wood_01)  {
					_current_door=_llist_doors_fake_wood_01.name;                 
            		_door_house_cam_pos=_llist_pos_cam_wood_01;	
				}
				if	(_llist_doors_fake_stone_01) {
					_current_door=_llist_doors_fake_stone_01.name;                 
            		_door_house_cam_pos=_llist_pos_cam_stone_01;	
				}			
			  var POS_empty01 = new Float32Array(3); 			
			var door= _current_door;
			switch (door) {					
				case "house_stone_01*fake_door":
					m_trans.get_translation(_door_house_cam_pos,POS_empty01);   
					break;			
				case "house01_wood*fake_door":
					m_trans.get_translation(_door_house_cam_pos,POS_empty01);
					break;			
			}		
			var pivot_POS_act = new Float32Array(3); 
			m_trans.get_translation(m_char.get_wrapper().phys_body,pivot_POS_act);  
			var camera = m_scs.get_active_camera();
			m_cons.remove(camera); 
m_resources.get_wrapper().view_no_static=1; 
			m_mouse.exit_pointerlock();
		m_camera.static_setup(camera,  { pos: POS_empty01, look_at: pivot_POS_act });
		m_camera.correct_up(camera, m_util.AXIS_Z, true);   
console.log("deberiamos apuntar al personaje como lookat de eye camera cada frame");
    m_scs.hide_object(m_char.get_wrapper().sleeves);	
	m_scs.hide_object(m_char.get_wrapper().body_fps);
	m_scs.hide_object(m_char.get_wrapper().gun_fps);
	m_scs.hide_object(m_char.get_wrapper().gun_laser_fps);
	m_scs.hide_object(m_char.get_wrapper().pistol_fps);
	m_scs.hide_object(m_char.get_wrapper().knife_fps);
	m_scs.show_object(m_char.get_wrapper().body);
	m_scs.show_object(m_char.get_wrapper().gun_tps);
	m_scs.show_object(m_char.get_wrapper().gun_laser_tps);
	m_scs.show_object(m_char.get_wrapper().pistol_tps);
	m_scs.show_object(m_char.get_wrapper().knife_tps);
	_se_salio_de_la_casa=true; 
			}
			else if (!pulse) {             
			_is_in_house=false;
			_current_door=null;
			}
	}
   var	out_house_cb = function(obj, id, pulse) {
	if (pulse==1)
			{
if (_se_salio_de_la_casa)  
{
         m_ctl.set_custom_sensor(sensor_out_house, 1);   				
			_is_in_house=false;	 
			_current_door=null;
			m_resources.get_wrapper().view_no_static=0; 
			var pivot_POS_act = new Float32Array(3); 
			var offset = new Float32Array(3); 
			m_trans.get_translation(m_char.get_wrapper().phys_body,pivot_POS_act);  
			var camera = m_scs.get_active_camera();		
			offset[1]=pivot_POS_act[1]+3; 
			offset[2]=pivot_POS_act[2]+1.5; 
    _se_salio_de_la_casa=false; 
	var is_char_htoh=false;
	var data_id=m_char.get_wrapper().data_id;
	var index=m_char.get_wrapper().index;
	var length=m_char.get_wrapper().length;
	var elapsed=m_ctl.create_elapsed_sensor();
	m_view.eye_camera(camera,is_char_htoh,elapsed,null,null,data_id,index,length);  
			console.log("hemos salido de la casa y deberia cambiar a eye camera");			
}			
			}  
	}  
	var note_door_house_stone_01_cb = function(obj, id, pulse) {
				if (pulse==1)		{
					var sensor_opened_door_tmp=m_ctl.get_sensor_value(obj,id,2);	
					switch 	(sensor_opened_door_tmp) {
					case 0:	
					m_interface.muestra_notificacion("<p>Press O to open door </br>or button A</p>", "open_door.png",6); 
					break;
					case 1:	
					m_interface.muestra_notificacion("<p>Press J to close door</br>or button Y </p>", "open_door.png",6);
					_current_door=_llist_doors_fake_stone_01.name;                 
					_door_house_cam_pos=_llist_pos_cam_stone_01;	
					break;
					}  
				}	
				else
					{
					m_interface.oculta_notificacion("<p>Press O to open door </br>or button A </p>", "open_door.png");
					m_interface.oculta_notificacion("<p>Press J to close door </br>or button Y </p>", "open_door.png");
					}
     		} 
		var note_door_house_wood_01_cb = function(obj, id, pulse) {
				if (pulse==1)		{
           document.getElementById("near_obj_info_container").style.zIndex=2;
			document.getElementById("near_obj_info_container").style.visibility="visible";
			var body_elem=document.body;
			var current_lang= document.getElementsByTagName("BODY")[0].getAttribute("lang"); 
					var sensor_opened_door_tmp=m_ctl.get_sensor_value(obj,id,2);	
					if  	(sensor_opened_door_tmp==0) {
					  switch (current_lang) {
						case "es":
						m_interface.muestra_notificacion("<span>Presione 0 para abrir puerta o haz click al icono de la mano o boton A</span>", "grab.png");
						setTimeout(	function() {
							m_interface.muestra_notificacion("");
							document.getElementById("near_obj_info_container").style.zIndex=0;
							document.getElementById("near_obj_info_container").style.visibility="hidden";
							},8000);
						break;
						case "en":
						m_interface.muestra_notificacion("<span>Press O to open door or click on the hand icon or button A</span>", "grab.png");
						setTimeout(	function() {
							m_interface.muestra_notificacion("");
							document.getElementById("near_obj_info_container").style.zIndex=0;
							document.getElementById("near_obj_info_container").style.visibility="hidden";
							},8000);
						break;			
					 }
					}  
					if   (sensor_opened_door_tmp==1) {
					  switch (current_lang) {
						case "es":
						m_interface.muestra_notificacion("<span>Presione key X para cerrar puerta o haz click al icono de la mano o boton X</span>", "grab.png");
						setTimeout(	function() {
							m_interface.muestra_notificacion("");
							document.getElementById("near_obj_info_container").style.zIndex=0;
							document.getElementById("near_obj_info_container").style.visibility="hidden";
							},8000);
						break;
						case "en":
						m_interface.muestra_notificacion("<span>Press key X to close door or click on the hand icon or button X</span>", "grab.png");
						setTimeout(	function() {
							m_interface.muestra_notificacion("");
							document.getElementById("near_obj_info_container").style.zIndex=0;
							document.getElementById("near_obj_info_container").style.visibility="hidden";
							},8000);
						break;			
					 }
					}  
				}	  
				else
					{
					m_interface.oculta_notificacion("<p>Press O to open door </br>or button A </p>", "open_door.png");
					m_interface.oculta_notificacion("<p>Press J to close door </br>or button Y </p>", "open_door.png");
					}
     		} 
  var	open_door_stone_01_cb = function(obj, id, pulse,f) {   
	if (pulse)
			{	
			 m_ctl.set_custom_sensor(sensor_opened_door_stone_01, 1);           	
			m_sfx.play(_door_speaker_stone_01,0,0);  
			play_anim(_llist_doors_rig_stone_01,"door_house_stone_01_open",m_anim.AB_FINISH_STOP);  
			m_phy.disable_simulation(_llist_doors_collision_body_stone_01); 
				m_ctl.set_custom_sensor(sensor_click_door, 0);   
				m_ctl.set_custom_sensor(sensor_touch_door, 0); 				
			} 
	}	
  var	open_door_wood_01_cb = function(obj, id, pulse,f) {   
	if (pulse)
			{	
			 m_ctl.set_custom_sensor(sensor_opened_door_wood_01, 1);           	
			m_sfx.play(_door_speaker_wood_01,0,0);  
					play_anim(_llist_doors_rig_wood_01,"door_house_wood_01_open",m_anim.AB_FINISH_STOP);  
	 m_phy.disable_simulation(_llist_doors_wood_01); 
				m_ctl.set_custom_sensor(sensor_click_door, 0);   
				m_ctl.set_custom_sensor(sensor_touch_door, 0); 				
			} 
	}
  var	cerrar_wood_01_cb = function(obj,id, pulse,f) { 
	   if (pulse)  
		   {
			m_ctl.set_custom_sensor(sensor_opened_door_wood_01, 0);   
			m_sfx.play(_door_speaker_wood_01,0,0);  
					play_anim(_llist_doors_rig_wood_01,"door_house_wood_01_close",m_anim.AB_FINISH_STOP);  
			m_phy.enable_simulation(_llist_doors_wood_01);
			m_ctl.set_custom_sensor(sensor_click_door, 0);   
			m_ctl.set_custom_sensor(sensor_touch_door, 0);         		
		   }  
		}		 
 var	cerrar_stone_01_cb = function(obj,id, pulse,f) { 
	   if (pulse)  
		   {
			m_ctl.set_custom_sensor(sensor_opened_door_stone_01, 0);   
			m_sfx.play(_door_speaker_stone_01,0,0);  
						play_anim(_llist_doors_rig_stone_01,"door_house_stone_01_close",m_anim.AB_FINISH_STOP);  
			m_phy.enable_simulation(_llist_doors_collision_body_stone_01);
			m_ctl.set_custom_sensor(sensor_click_door, 0);   
			m_ctl.set_custom_sensor(sensor_touch_door, 0);         		
		   }  
		}		 
		var elapsed_sens = m_ctl.create_elapsed_sensor();	
	 m_ctl.create_sensor_manifold(m_char.get_wrapper().picker, "IN_HOUSE_CB", m_ctl.CT_CONTINUOUS,[ sensor_in_house, elapsed_sens],  
										function(a) { return a[0]&&a[1]}, in_house_cb); 
if  (_wood01_loaded)	{		
        m_ctl.create_sensor_manifold(_llist_doors_fake_wood_01, "NOTIFY_OPEN_CLOSE_PORT_WOOD_01", m_ctl.CT_TRIGGER,[sensor_collition_wood_01_cam, sensor_collition_wood_01_char,sensor_opened_door_wood_01,sensor_touch_door, sensor_click_door],		
									function(a) { return ((a[0] || a[1]) && a[2])  ||  ((a[0] || a[1])&& !a[2])}, note_door_house_wood_01_cb);  									
        m_ctl.create_sensor_manifold(null, "OPEN_DOOR_WOOD_01", m_ctl.CT_SHOT,[sensor_collition_wood_01_cam, sensor_collition_wood_01_char, sensor_keyO, sensor_click_door,sensor_opened_door_wood_01, sensor_touch_door, sensor_gamepad_btn_open], 
									function(a) { return  (a[0] && (a[2] || a[3] || a[5]|| a[6])&& !a[4] )||  (a[1] && (a[2] || a[3]|| a[5] || a[6])&& !a[4]) }, open_door_wood_01_cb);
	  m_ctl.create_sensor_manifold(null, "CERRAR_DOOR_WOOD_01", m_ctl.CT_SHOT, [sensor_collition_wood_01_cam, sensor_collition_wood_01_char, sensorkeyX, sensor_click_door, sensor_opened_door_wood_01, sensor_touch_door, sensor_gamepad_btn_close],
									function(a) {  return  (a[0] && (a[2] || a[3]|| a[5]|| a[6])&& a[4] )||  (a[1] && (a[2] || a[3]|| a[5]|| a[6])&& a[4]) }, cerrar_wood_01_cb)
		}	
if  (_stone01_loaded)		{								
		  m_ctl.create_sensor_manifold(_llist_doors_fake_stone_01, "NOTIFY_OPEN_CLOSE_PORT_STONE_01", m_ctl.CT_TRIGGER,[sensor_collition_stone_01_cam, sensor_collition_stone_01_char,sensor_opened_door_stone_01,sensor_touch_door, sensor_click_door],		
									function(a) { return ((a[0] || a[1]) && a[2])  ||  ((a[0] || a[1])&& !a[2])}, note_door_house_stone_01_cb);  							
		m_ctl.create_sensor_manifold(null, "OPEN_DOOR_STONE_01", m_ctl.CT_SHOT,[sensor_collition_stone_01_cam, sensor_collition_stone_01_char, sensor_keyO, sensor_click_door,sensor_opened_door_stone_01, sensor_touch_door, sensor_gamepad_btn_open], 
									function(a) { return  (a[0] && (a[2] || a[3] || a[5]|| a[6])&& !a[4] )||  (a[1] && (a[2] || a[3]|| a[5] || a[6])&& !a[4]) }, open_door_stone_01_cb);
		  m_ctl.create_sensor_manifold(null, "CERRAR_DOOR_STONE_01", m_ctl.CT_SHOT, [sensor_collition_stone_01_cam, sensor_collition_stone_01_char, sensorkeyX, sensor_click_door, sensor_opened_door_stone_01, sensor_touch_door, sensor_gamepad_btn_close],
									function(a) {  return  (a[0] && (a[2] || a[3]|| a[5]|| a[6])&& a[4] )||  (a[1] && (a[2] || a[3]|| a[5]|| a[6])&& a[4]) }, cerrar_stone_01_cb)
		}						
}
exports.play_anim=play_anim;
function play_anim(_character_rig, name_anim,type_anim) {  
       m_anim.apply(_character_rig, name_anim);  
        m_anim.set_behavior(_character_rig, type_anim);  
       m_anim.play(_character_rig)
	}   
});