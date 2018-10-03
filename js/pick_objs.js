if (b4w.module_check("pick_objs"))
    throw "Failed to register module: pick_objs";
b4w.register("pick_objs", function(exports, require) {
var m_ctl   = require("controls");
var m_cons  = require("constraints");
var m_scs   = require("scenes");
var m_anim  = require("animation");
var m_sfx   = require("sfx");
var m_trans = require("transform");
var m_quat  = require("quat");
var m_phy   = require("physics");
var m_input = require("input");  
var m_conf     = require("game_config");
var m_char     = require("character2"); 
var m_interface = require("interface2");
var _is_char_htoh=true;
var	_llist_object_pick=[];	
var _sensor_picked =  null;
var _sensor_collition_cam = null;
var _sensor_collition_char= null;
var _sensor_stat_picked= null;
var  _sensor_keyF = null;
var _sensorkeyL = null;
var  _gamepad_pick = null;
var  _gamepad_throw = null;
var camera_picker=null;
var char_picker=null;
exports.init= function(elapsed_sensor, is_char_htoh, llist_object_pick_de_json, data_id) {          
	if (!llist_object_pick_de_json)			
	{		
	_camera_picker = m_scs.get_active_camera();		
	_char_picker=m_char.get_wrapper().picker;
    _sensor_picked = m_ctl.create_custom_sensor(0);  
   _sensor_keyF = m_ctl.create_keyboard_sensor(m_ctl.KEY_F);
   _sensorkeyL = m_ctl.create_keyboard_sensor(m_ctl.KEY_L);  
     _sensor_stat_picked = m_ctl.create_custom_sensor(0); 
	var aa = m_input.check_enable_gamepad_indices();  
		var index = aa.length ? aa[aa.length - 1] : 0
         _gamepad_pick = m_ctl.create_gamepad_btn_sensor(m_input.GMPD_BUTTON_0, index);  
		_gamepad_throw = m_ctl.create_gamepad_btn_sensor(m_input.GMPD_BUTTON_2, index);  
	for (var i = 0; i < m_conf.PICK_NAME_LIST.length; i++){             
            for (var j = 0; j < m_conf.PICK_NAME_LIST[i].c.length; j++) {   
				var llist_object_pick = m_scs.get_object_by_dupli_name(m_conf.PICK_NAME_LIST[i].c[j], m_conf.PICK_NAME_LIST[i].obj);  
	   _sensor_collition_cam = m_ctl.create_collision_sensor(llist_object_pick, "CAMERA", !1); 
       _sensor_collition_char = m_ctl.create_collision_sensor(llist_object_pick, "CHARACTER", !1);   
				if (m_phy.has_physics(llist_object_pick))            
					m_phy.enable_simulation(llist_object_pick); 
				m_scs.show_object(llist_object_pick);	
			    _llist_object_pick.push(llist_object_pick);	
                if (llist_object_pick) {							
						 console.log("name object recogible es:"+llist_object_pick.name);
		   var g = {   
				i: [0, -.2, -.5],     
				h: null,             
				g: [0, 0, -15],    
				f: 0               
				};		
	    function touch_pickable_object (event) {  
        event.preventDefault();
       m_ctl.set_custom_sensor(_sensor_picked, 1);
	   console.log("el mensaje fue picado ej en touch dispositivos");
		}   
		 function touch_lanzar_pickable_object (event) {  
        event.preventDefault();
			throw_obj_container.style.zIndex = 0; 
			throw_obj_container.style.visibility = "hidden";
			throw_obj_container.style.opacity = 0;  
            m_phy.enable_simulation(llist_object_pick);  
            m_cons.remove(llist_object_pick);						
			m_scs.show_object(llist_object_pick);  
            m_phy.apply_velocity(llist_object_pick, g.g[0], g.g[1], g.g[2]);   
			m_ctl.set_custom_sensor(_sensor_stat_picked, 0);   
            g.f = 0;  
		    console.log("se ha lanzado el objeto  al clickar o touch icono pantalla");
		}   
	var throw_obj_container = document.getElementById("throw_obj_container");  
      document.getElementById("near_obj_info_container").addEventListener("touchstart", touch_pickable_object, !1);
	 document.getElementById("near_obj_info_container").addEventListener("click", touch_pickable_object, !1);
	  document.getElementById("throw_obj_container").addEventListener("touchstart", touch_lanzar_pickable_object, !1);
	 document.getElementById("throw_obj_container").addEventListener("click", touch_lanzar_pickable_object, !1);
	note_pickable_object_cb = function(obj, id, pulse) {
				if (1 == pulse)
				{	
           document.getElementById("near_obj_info_container").style.zIndex=2;
			document.getElementById("near_obj_info_container").style.visibility="visible";
			var body_elem=document.body;
			var current_lang= document.getElementsByTagName("BODY")[0].getAttribute("lang"); 
			switch (current_lang) {
				case "es":
				m_interface.muestra_notificacion("<span>Presione F para coger objetos o haz click al icono de la mano o boton A</span>", "grab.png");
				setTimeout(	function() {
							m_interface.muestra_notificacion("");
							document.getElementById("near_obj_info_container").style.zIndex=0;
							document.getElementById("near_obj_info_container").style.visibility="hidden";
							},10000);
				break;
				case "en":
				m_interface.muestra_notificacion("<span>Press F to grab or click on the hand icon or button A</span>", "grab.png");
				setTimeout(	function() {
							m_interface.muestra_notificacion("");
							document.getElementById("near_obj_info_container").style.zIndex=0;
							document.getElementById("near_obj_info_container").style.visibility="hidden";
							},10000);
				break;			
			}
					  console.log("se podria  pulsar  F para coger objetos y L lanzarlos: ");					
		}	
		else	
					{
					}			
     	} 
	picked_obj_cb = function(obj, id, pulse,g_tmp) {	
		if (pulse)
			{								
            throw_obj_container.style.zIndex = 2;    
			throw_obj_container.style.visibility = "visible";
			throw_obj_container.style.opacity = 1;  
            m_phy.disable_simulation(obj);									
			m_cons.append_stiff(obj, _camera_picker, g_tmp.i, g_tmp.h);  			
            m_ctl.set_custom_sensor(_sensor_picked, 0);              
			 m_ctl.set_custom_sensor(_sensor_stat_picked, 1);  
            g_tmp.f = 1;
				console.log("se ha picado el objeto  al pulsar F");		
		}  
	}		
	throw_obj_cb = function(obj,id, pulse,g_tmp) { 
		   if (pulse)  
		   {
			throw_obj_container.style.zIndex = 0; 
			throw_obj_container.style.visibility = "hidden";
			throw_obj_container.style.opacity = 0;  
            m_phy.enable_simulation(obj);  
            m_cons.remove(obj);						
            m_phy.apply_velocity(obj, g_tmp.g[0], g_tmp.g[1], g_tmp.g[2]);   
			 m_scs.show_object(obj);  
			m_ctl.set_custom_sensor(_sensor_stat_picked, 0);   
            g_tmp.f = 0;  
		    console.log("se ha lanzado el objeto  al pulsar L");
		   }  
		}	
        m_ctl.create_sensor_manifold(llist_object_pick, "PICK_NOTIFY"+llist_object_pick.obj, m_ctl.CT_TRIGGER, [_sensor_collition_char],		
									function(s) { return s[0]}, note_pickable_object_cb);  
		 m_ctl.create_sensor_manifold(llist_object_pick, "PICK"+llist_object_pick.obj, m_ctl.CT_SHOT, [_sensor_collition_cam,_sensor_collition_char, _sensor_keyF, _sensor_picked, _gamepad_pick],
								function(s) { return ((s[0] &&((s[2] || s[3]) || s[4])) || (s[1] && (s[2] || (s[3] || s[4]))))}, picked_obj_cb, g);
	  m_ctl.create_sensor_manifold(llist_object_pick, "THROW"+llist_object_pick.obj, m_ctl.CT_SHOT, [_sensorkeyL,_sensor_picked, _gamepad_throw,_sensor_stat_picked], 
	  function(s) { return (((s[0] || s[1]) || s[2])&& s[3] ) }, throw_obj_cb ,g) 
                }  
            }  
		} 
 }  
} 
})