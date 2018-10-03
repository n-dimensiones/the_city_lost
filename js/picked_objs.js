if (b4w.module_check("picked_objs"))
    throw "Failed to register module: picked_objs";
b4w.register("picked_objs", function(exports, require) {
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
var spawner_pos = new Float32Array(3);  
var	_llist_object_pick=[];	
var _llist_sound_object_pick=null;
var emitter_splash_water=[];
var emitter_dust=[]; 
var _sensor_picked =  null;
var _sensor_ya_hide = null;
var _sensor_collition_cam = null;
var _sensor_collition_char= null;
var  _sensor_keyF = null;  
var _sensorkeyL = null;
var  _gamepad_pick = null;
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
			var aa = m_input.check_enable_gamepad_indices();  
		var index = aa.length ? aa[aa.length - 1] : 0
         _gamepad_pick = m_ctl.create_gamepad_btn_sensor(m_input.GMPD_BUTTON_0, index);  
	    function touch_pickable_object (event) {  
        event.preventDefault();
       m_ctl.set_custom_sensor(_sensor_picked, 1);
	   console.log("se ha debido pulsar click sobre mensaje o touched");
		}   
	var throw_obj_container = document.getElementById("throw_obj_container");  
      document.getElementById("near_obj_info_container").addEventListener("touchstart", touch_pickable_object, !1);
	 document.getElementById("near_obj_info_container").addEventListener("click", touch_pickable_object, !1);
	for (var i = 0; i < m_conf.PICKABLE_NAME_LIST.length; i++){             
            for (var j = 0; j < m_conf.PICKABLE_NAME_LIST[i].c.length; j++) {   
				_llist_sound_object_pick = m_scs.get_object_by_dupli_name(m_conf.PICKABLE_NAME_LIST[i].c[j], m_conf.PICKABLE_NAME_LIST[i].e); 
			var	 llist_object_pick = m_scs.get_object_by_dupli_name(m_conf.PICKABLE_NAME_LIST[i].c[j], m_conf.PICKABLE_NAME_LIST[i].obj);  
       _sensor_collition_char = m_ctl.create_collision_sensor(llist_object_pick, "CHARACTER", !1);   
				m_scs.show_object(llist_object_pick);	
				_sensor_ya_hide= m_ctl.create_custom_sensor(0);	
			    _llist_object_pick.push(llist_object_pick);	
                if (llist_object_pick) { 
				switch (m_conf.PICKABLE_NAME_LIST[i].type) {   
				case "premio":
					pickable_object_action(llist_object_pick, null, [0, -.4, -1], m_quat.setAxisAngle([0, -1, 0], -Math.PI / 2, m_quat.create()), [10, 0, 0], "premio", true);
				break;
				case "salvavidas":	
					pickable_object_action(llist_object_pick, null, [0, -.4, -1], m_quat.setAxisAngle([0, -1, 0], -Math.PI / 2, m_quat.create()), [10, 0, 0], "salvavidas",true);						
				break;
						 console.log("name object recogible es:"+llist_object_pick.name);
				 }  
                }  
            }  
		} 
 }  
} 
 function pickable_object_action(object_piked, d, c, h, f, type,stat_view) { 
		   var g = {   
				i: c,     
				h: h,     
				g: f,    
				f: 0,    
				type_tmp: type,	  
				stat_view: stat_view
				};		
	note_pickable_object_cb = function(obj, id, pulse,g_tmp) {
				if (1 == pulse)
				{	
			if (g_tmp.stat_view==false)    
				return;
			 document.getElementById("near_obj_info_container").style.zIndex=2;
			document.getElementById("near_obj_info_container").style.visibility="visible";
			var body_elem=document.body;
			var current_lang= document.getElementsByTagName("BODY")[0].getAttribute("lang"); 
					switch (g_tmp.type_tmp) {
					case "premio":
				switch (current_lang) {
				case "es":
				m_interface.muestra_notificacion("<span>Presione F para sumar puntos o haz click al icono de la mano o boton A</span>", "grab.png");
				setTimeout(	function() {
							m_interface.muestra_notificacion("");
							document.getElementById("near_obj_info_container").style.zIndex=0;
							document.getElementById("near_obj_info_container").style.visibility="hidden";
							},10000);
				break;
				case "en":
				m_interface.muestra_notificacion("<span>Press F to increase points or click on the hand icon or button A</span>", "grab.png");
				setTimeout(	function() {
							m_interface.muestra_notificacion("");
							document.getElementById("near_obj_info_container").style.zIndex=0;
							document.getElementById("near_obj_info_container").style.visibility="hidden";
							},10000);
				break;			
				}
					  console.log("se podria subir al  pulsar  F para sumar ptos");
					break;						
					case "salvavidas":
				switch (current_lang) {
				case "es":
				m_interface.muestra_notificacion("<span>Presione F para recuperar vida o haz click al icono de la mano o boton A</span>", "grab.png");
				setTimeout(	function() {
							m_interface.muestra_notificacion("");
							document.getElementById("near_obj_info_container").style.zIndex=0;
							document.getElementById("near_obj_info_container").style.visibility="hidden";
							},10000);
				break;
				case "en":
				m_interface.muestra_notificacion("<span>Press F to recover life or click on the hand icon or button A</span>", "grab.png");
				setTimeout(	function() {
							m_interface.muestra_notificacion("");
							document.getElementById("near_obj_info_container").style.zIndex=0;
							document.getElementById("near_obj_info_container").style.visibility="hidden";
							},10000);
				break;			
				}
					  console.log("se podria subir al  pulsar  F para recuperar vida");
					break;
				   } 
				}	
				else           
					{
						m_interface.oculta_notificacion("<p>Press F to grab</p>", "grab.png");
						m_interface.oculta_notificacion("<p>Press F a sumar ptos</p>", "premio.png");
						m_interface.oculta_notificacion("<p>Press F para recuperar vida</p>", "salvavidas.png");
					}			
     			} 
	picked_obj_cb = function(obj, id, pulse,g_tmp) {	
		if (pulse)
			{			
			switch (g_tmp.type_tmp) {
			case "premio":	
				m_sfx.play_def(_llist_sound_object_pick);
				console.log("se ejecuto lo que precisemos para acumular ptos");
				m_char.apply_premi_potion();  
				 m_ctl.set_custom_sensor(_sensor_picked, 0);   
				 m_scs.hide_object(obj);
				  m_ctl.set_custom_sensor(_sensor_ya_hide, 1);  
				  g_tmp.stat_view=false;
			  break;			
			case "salvavidas":
				m_sfx.play_def(_llist_sound_object_pick);
			   m_char.apply_hp_potion();  
			    m_ctl.set_custom_sensor(_sensor_picked, 0);   
				m_scs.hide_object(obj);
				 m_ctl.set_custom_sensor(_sensor_ya_hide, 1);  
				g_tmp.stat_view=false;														
			   break;			
			}
		}  
	}						
	throw_obj_cb = function(obj,id, pulse,g_tmp) { 
		   if (pulse)  
		   {
			   switch (g_tmp.type_tmp) {
			case "recogible":           		
			throw_obj_container.style.zIndex = 0; 
            m_phy.enable_simulation(obj);  
            m_cons.remove(obj);						
            m_phy.apply_velocity(obj, g_tmp.g[0], g_tmp.g[1], g_tmp.g[2]);   
			m_ctl.set_custom_sensor(_sensor_picked, 0);   
            g_tmp.f = 0;  
		    console.log("se ha lanzado el objeto  al pulsar E");
		    break;
			   }
		   }  
		}	
        m_ctl.create_sensor_manifold(object_piked, "PICK_NOTIFY"+object_piked.name, m_ctl.CT_TRIGGER, [_sensor_collition_char,_sensor_ya_hide],		
									function(s) { return s[0] && !s[1]}, note_pickable_object_cb,g);  
        m_ctl.create_sensor_manifold(object_piked, "PICK"+object_piked.name, m_ctl.CT_LEVEL,  
			[_sensor_collition_char, _sensor_keyF, _sensor_picked, _gamepad_pick,_sensor_ya_hide], 		
					function(s) {    																	
return (s[0] && ((s[1]  || s[2]) || s[3]))  
								}, picked_obj_cb, g); 
 }
exports.reset=reset;    
function reset() {                                           
	for (var i = 0; i < _llist_object_pick.length; i++){   
	if (m_scs.is_hidden(_llist_object_pick[i]))
	 m_scs.show_object(_llist_object_pick[i]);
	m_ctl.set_custom_sensor(_sensor_ya_hide, 0);  
	_llist_object_pick[i].stat_view=true; 
	}
}
   function lanzar_picked_sobre_agua(a, d, c) {   
		var sensor_veritical_velocidad = m_ctl.create_vertical_velocity_sensor(a, 2);
        m_ctl.create_sensor_manifold(a, "WATER_SPLASH", m_ctl.CT_SHOT, [d, sensor_veritical_velocidad], null, function(obj, id, pulse, n) {   
			a = m_ctl.get_sensor_payload(obj, id, 0).hit_pos;  
console.log("el objeto esta sobre el agua y la golpea deberiamos por ello escuchar el sonido del splash water");
		  n = m_ctl.get_object_by_dupli_name("enviroment", n);  
            m_trans.set_translation_v(n, a);   
            m_sfx.play_def(n);
            a[2] += .05;  
        }, "Water Splash Light")  
    }
    function spaw_speaker_particles_water_o_dust(water_o_dust_tmp, b) {         
        for (var i = 0; i < water_o_dust_tmp.length; i++) {
            var e = water_o_dust_tmp[i];
            m_trans.set_translation_v(e, b);  
			m_anim.set_first_frame(e);   
            m_anim.play(e)  
        }
    }
    function sounds_for_picked_objs_lanzados(obj, d, c, velocidad_lanzamiento, f, p) {   
		 var collision_sensor_isla = m_ctl.create_collision_sensor(obj, "ISLAND", !1);   
          var collison_sensor_cam = m_ctl.create_collision_sensor(obj, "CAMERA", !1);
		  motion_sensor = m_ctl.create_motion_sensor(obj, velocidad_lanzamiento, 100);   
          var collision_sensor_water = m_ctl.create_collision_sensor(obj, "WATER", !1);   
          var collision_sensor_stone = m_ctl.create_collision_sensor(obj, "STONE", !1);
        conj_sensores = [collision_sensor_isla, collison_sensor_cam, motion_sensor, collision_sensor_water, d, collision_sensor_stone];  
        background_sounds = m_scs.get_object_by_dupli_name(p, c);  
        m_ctl.create_sensor_manifold(obj, "STROKE_" + m_scs.get_object_name(obj), m_ctl.CT_SHOT, conj_sensores, function(a) {   
            return (a[0] || a[5]) && !a[1] && a[2] && !a[3] && !a[4]
        }, function(obj, id, pulse, background_sounds_tmp) {
			posicion_oject_picked = m_trans.get_translation(obj);
			m_trans.set_translation_v(background_sounds_tmp, posicion_oject_picked);   
			m_sfx.play_def(background_sounds_tmp);  
        }, background_sounds)          
    } 
    function gravedad_para_picked_sobre_agua(a, d) {  
        m_ctl.create_sensor_manifold(a, "UND_WATER_GRAV", m_ctl.CT_TRIGGER, [d], null, function(obj, id, pulse) {   
            if (1 == pulse)
			{
				m_phy.set_gravity(a, 1);
				console.log("el objeto esta sobre el agua y gravedad pasa de 10 a 1");
			}	
            else
			{
				m_phy.set_gravity(a, 10);
				console.log("el objeto no esta sobre el agua, gravedad es 10");
			}
        })
    }
function play_anim(_character_rig, name_anim,type_anim) {  
       m_anim.apply(_character_rig, name_anim);  
        m_anim.set_behavior(_character_rig, type_anim);  
       m_anim.play(_character_rig)
	}          
})