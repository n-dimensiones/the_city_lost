if (b4w.module_check("change_character"))
    throw "Failed to register module: change_character";
b4w.register("change_character", function(exports, require) {
var m_camera= require("camera");
var m_main = require("main");
var m_ctl   = require("controls");  
var m_scs   = require("scenes");  
var m_anim  = require("animation"); 
var m_sfx   = require("sfx");  
var m_trans = require("transform");  
var m_quat  = require("quat");   
var m_phy   = require("physics"); 
var m_cont  = require("container");   
var m_data  = require("data");  
var m_obj       = require("objects");  
var m_mouse     = require("mouse");  
var m_options_anims= require("options_2_anims");  
var m_resources= require("resources");  
var m_animals= require("animals");    
var m_canon = require("canon");    
var m_pick_objs = require("pick_objs");  
var m_picked_objs = require("picked_objs");  
var m_npc_ai = require("npc_ai");   
var m_asteroids= require("asteroids");   
var m_interface = require("interface2");  
var m_env = require("environment");		 
var m_main_menu= require("main_menu");  
var m_conf     = require("game_config");  
var m_char     = require("character2");    
var m_interface = require("interface2");   
var m_vehicle     = require("vehicles");    
var m_view 		= require("control_view");  
var m_ctl_view_conf = b4w.require("ctl_view_config");
var m_options_1_anims= require("options_1_anims");	
var _is_main_menu=false;	
var _fondo_options=null;  
var _boton_salir_select_avatar=null;
var _amazon_button=null; 
var _hunter_button=null;
var _pos_avatar1 = new Float32Array(3);
var _pos_avatar2 = new Float32Array(3);
var _pos_avatar3 = new Float32Array(3);
var _pos_avatar4 = new Float32Array(3);  
var _camera_pos= new Float32Array(3);
var _hunter_body=null;   
var _phys_body=null;  
var _helmet=null;
var _head_hunter=null;
var _visor=null;
var _mascara_gas=null;
var _linterna=null;
var _sensor_sel_greek=null;  
var _sensor_sel_hunter=null;  
var _sensor_sel_hunter2=null;  
var _sensor_sel_amazon=null;  
var _sensor_greek=null;  
var _sensor_hunter=null;  
var _sensor_hunter2=null;  
var _sensor_amazon=null;  
var _sensor_sel_salir = null; 
var _sensor_sel_play_anim =null;
var _elapsed_sensor=0;
var _is_char_htoh=0;   
var _selected_obj = null;
var _office=null;
var _controls_intro=null;
var _current_level="";								
var _current_avatar2="hunter3*hunter_body";  
var _data_id=0;
var _index_shot=0;
var _index_htoh=0;
var _length_htoh=1;
var _length_shot=3;  
var _level_conf=null;   
var _canvas_elem = null;
var _data_id_fps=[];   
var _control_data_id=[]; 	
exports.menu_change_avatar_cb=menu_change_avatar_cb;
function menu_change_avatar_cb(elapsed_sensor, current_level, current_avatar) {	    
	m_main.resume();   
 m_main_menu.hide_play_btns(); 
  m_options_1_anims.init();  
 _elapsed_sensor=elapsed_sensor;
if (!current_level=="")                
  _current_level=current_level;
else 
  _current_level="level02";  
  if (!current_avatar=="")   
  {
	   switch (current_avatar) {                     
        case "hunter_avatar": 
		_current_avatar2="hunter3*hunter_body";
            break;
        case "amazon_avatar":
        _current_avatar2="amazon*hunter_body";
            break; 
	  case "hunter2_avatar":
	  _current_avatar2="hunter2*hunter_body";
		break;
	  case "greek_avatar":
	  _current_avatar2="hoplita*hunter_body";
		break;
	 }
  }
 document.getElementById("main_canvas_container").style.opacity = 1; 
	m_data.load(m_conf.ASSETS_PATH + "setup_options.json", loaded_scene_avatars_cb, null, false, true);
_office=document.getElementById("link_office");
_controls_intro=document.getElementById("controls_intro");
_canvas_elem= m_cont.get_container();	
_canvas_elem.addEventListener("mousedown", select_obj_cb);   
_canvas_elem.addEventListener("touchstart",select_obj_cb);
   if  ((_current_avatar2=="")&&(!m_char.get_wrapper()))	 
	{
	 m_data.load(m_conf.ASSETS_PATH + "hunter_fps_avatar.json", loaded_hunter_fps_avatar_cb,null , true, true);
	m_data.load(m_conf.ASSETS_PATH + "hunter_avatar.json", loaded_hunter_avatar_cb, null, false, true);
	m_data.load(m_conf.ASSETS_PATH + "greek_avatar.json", loaded_greek_avatar_cb, null, false, true);
	m_data.load(m_conf.ASSETS_PATH + "hunter2_avatar.json", loaded_hunter2_avatar_cb, null, false, true);	
	m_data.load(m_conf.ASSETS_PATH + "amazon_avatar.json", loaded_amazon_avatar_cb, null, false, true);	
	}
	else
if (_current_avatar2=="hunter3*hunter_body")  
{
	m_data.load(m_conf.ASSETS_PATH + "hunter_avatar.json", loaded_hunter_avatar_cb, null, false, true);  
	m_data.load(m_conf.ASSETS_PATH + "greek_avatar.json", loaded_greek_avatar_cb, null, false, true);
	m_data.load(m_conf.ASSETS_PATH + "hunter2_avatar.json", loaded_hunter2_avatar_cb, null, false, true);	
	m_data.load(m_conf.ASSETS_PATH + "amazon_avatar.json", loaded_amazon_avatar_cb, null, false, true);	
}
    else         
		 if (_current_avatar2=="hunter2*hunter_body")
	 {
	m_data.load(m_conf.ASSETS_PATH + "hunter_avatar.json", loaded_hunter_avatar_cb, null, false, true);
	m_data.load(m_conf.ASSETS_PATH + "greek_avatar.json", loaded_greek_avatar_cb, null, false, true);	
	m_data.load(m_conf.ASSETS_PATH + "amazon_avatar.json", loaded_amazon_avatar_cb, null, false, true);	
	}
	else if(_current_avatar2=="hoplita*hunter_body")
	{
	m_data.load(m_conf.ASSETS_PATH + "hunter_avatar.json", loaded_hunter_avatar_cb, null, false, true);	
	m_data.load(m_conf.ASSETS_PATH + "hunter2_avatar.json", loaded_hunter2_avatar_cb, null, false, true);	
	m_data.load(m_conf.ASSETS_PATH + "amazon_avatar.json", loaded_amazon_avatar_cb, null, false, true);	
	}					
	else if (_current_avatar2=="hunter*hunter_body")
	{	
	m_data.load(m_conf.ASSETS_PATH + "greek_avatar.json", loaded_greek_avatar_cb, null, false, true);
	m_data.load(m_conf.ASSETS_PATH + "hunter2_avatar.json", loaded_hunter2_avatar_cb, null, false, true);
	m_data.load(m_conf.ASSETS_PATH + "amazon_avatar.json", loaded_amazon_avatar_cb, null, false, true);	
	}	
	else if (_current_avatar2=="amazon*hunter_body")   
	{		
	m_data.load(m_conf.ASSETS_PATH + "greek_avatar.json", loaded_greek_avatar_cb, null, false, true);
	m_data.load(m_conf.ASSETS_PATH + "hunter_avatar.json", loaded_hunter_avatar_cb, null, false, true);	
	m_data.load(m_conf.ASSETS_PATH + "hunter2_avatar.json", loaded_hunter2_avatar_cb, null, false, true);
	}
}  
function select_obj_cb(e) {     
    if (e.preventDefault)        
        e.preventDefault();
    var x = m_mouse.get_coords_x(e);
    var y = m_mouse.get_coords_y(e);
    var obj = m_scs.pick_object(x, y);            
    if (_selected_obj != obj) {
        if ((_selected_obj)&&(m_scs.outlining_is_enabled(_selected_obj)))
            m_scs.clear_outline_anim(_selected_obj);  
        if (((obj)&&(obj.name!="Plane.001"))&&(m_scs.outlining_is_enabled(obj)))
            m_scs.apply_outline_anim(obj, 1, 1, 0);       
 _selected_obj = obj;   
    }
}
function loaded_hunter_fps_avatar_cb(data_id_fps) {          
if (!_data_id_fps[0])	   
		{			
		_data_id_fps[0]=data_id_fps;
		console.log("camera de una escena fps y  el numero carga id del  json file esperaba fuese el 3 y  es:"+_data_id_fps[0]);
		}
	}
function loaded_scene_avatars_cb(data_id) {
if (!_control_data_id[1])	{  
_control_data_id[1]=data_id;
console.log(" numero carga id del  json file para la escena change avatar esperaba fuese el 1 y  es:"+_control_data_id[1]);
_fondo_options=m_scs.get_object_by_name("Plane.001",data_id);	
		if (m_obj.is_mesh(_fondo_options))
		{
		 m_scs.show_object(_fondo_options); 
		}
var camera_empty = m_scs.get_object_by_name("camera_empty",data_id);      
var spawner1 = m_scs.get_object_by_name("pos_avatar1",data_id);   
var spawner2 = m_scs.get_object_by_name("pos_avatar2",data_id);    
var spawner3 = m_scs.get_object_by_name("pos_avatar3",data_id);  
var spawner4 = m_scs.get_object_by_name("pos_avatar4",data_id);  
 _amazon_button = m_scs.get_object_by_name("amazon_button",data_id);
 _hunter_button = m_scs.get_object_by_name("hunter_button",data_id);
_boton_salir_select_avatar = m_scs.get_object_by_name("boton_salir_select_avatar",data_id);  
_boton_play_anim = m_scs.get_object_by_name("boton_play_anim",data_id);  
m_scs.show_object(_boton_salir_select_avatar); 
m_scs.show_object(_boton_play_anim); 
m_scs.show_object(_amazon_button);
m_scs.show_object(_hunter_button);
m_trans.get_translation(camera_empty, _camera_pos);  
 m_trans.get_translation(spawner1, _pos_avatar1);  
m_trans.get_translation(spawner2, _pos_avatar2); 
m_trans.get_translation(spawner3, _pos_avatar3);  
m_trans.get_translation(spawner4, _pos_avatar4); 
 var rota_camera_empty=m_quat.create();
m_trans.get_rotation(camera_empty, rota_camera_empty);
var camera=m_scs.get_active_camera();
		m_view.target_camera(camera,_camera_pos,_pos_avatar4); 
_sensor_sel_salir = m_ctl.create_selection_sensor(_boton_salir_select_avatar, 0); 
_sensor_sel_play_anim = m_ctl.create_selection_sensor(_boton_play_anim, 0); 	
  m_ctl.create_sensor_manifold(_boton_salir_select_avatar, "SALIR MENU SELECT AVATARS", m_ctl.CT_SHOT, 
                    [_sensor_sel_salir], function logic_func(s) {return s[0]} , salir_menu_avatars_cb);		
 function salir_menu_avatars_cb(obj,id,pulse) {
	  var data_id=2;   
       var index=0;   
	   var length=2;
	 var camera=m_scs.get_active_camera();	
		 m_ctl.set_custom_sensor(_sensor_sel_hunter2, 0);   
		 m_ctl.set_custom_sensor(_sensor_sel_hunter, 0);        
		 m_ctl.set_custom_sensor(_sensor_sel_greek, 0);        
		 m_ctl.set_custom_sensor(_sensor_sel_amazon, 0);   		
	if (_current_avatar2=="hunter_button")  
	{
       data_id=_control_data_id[2];
	   index=3;  
	   length=4;
	   _data_id=data_id;
	   _index_shot=index;
	   _length_shot=length;
m_ctl.remove_sensor_manifold(null, "SELECT ANIMS AVATAR AMAZON");
m_ctl.remove_sensor_manifold(null, "SELECT AVATAR AMAZON");
m_ctl.remove_sensor_manifold(null, "SELECT ANIMS AVATAR HUNTER2");
m_ctl.remove_sensor_manifold(null, "SELECT AVATAR HUNTER2");
m_ctl.remove_sensor_manifold(null, "SELECT ANIMS AVATAR HUNTER");
m_ctl.remove_sensor_manifold(null, "SELECT AVATAR HUNTER");
m_ctl.remove_sensor_manifold(null, "SELECT AVATAR GREEK");
m_ctl.remove_sensor_manifold(null, "SELECT ANIMS AVATAR GREEK");
m_ctl.remove_sensor_manifold(null, "SALIR MENU SELECT AVATARS");
	  m_data.unload(m_data.DATA_ID_ALL); 
	_control_data_id[5]=null;
	_control_data_id[4]=null;
	_control_data_id[3]=null;
	_control_data_id[1]=null;                 
	   _control_data_id[0]=null;  
var char_fps_name = "hunter_fps_avatar";  
var char_tps_name = "hunter_avatar";
 m_options_1_anims.hide_btns_control_intro();
  m_main_menu.load_level_cb(_current_level,_is_char_htoh,_control_data_id,_data_id_fps, char_fps_name, char_tps_name, false,index,length);  
    }
	if (_current_avatar2=="hoplita*hunter_body")
	{	
	   data_id=_control_data_id[3];  
       index=4;
	   length=5;
	   _data_id=data_id;
	   _index_htoh=index;
	   _length_htoh=length;
m_ctl.remove_sensor_manifold(null, "SELECT ANIMS AVATAR AMAZON");
m_ctl.remove_sensor_manifold(null, "SELECT AVATAR AMAZON");
m_ctl.remove_sensor_manifold(null, "SELECT ANIMS AVATAR HUNTER2");
m_ctl.remove_sensor_manifold(null, "SELECT AVATAR HUNTER2");
m_ctl.remove_sensor_manifold(null, "SELECT ANIMS AVATAR HUNTER");
m_ctl.remove_sensor_manifold(null, "SELECT AVATAR HUNTER");
m_ctl.remove_sensor_manifold(null, "SELECT AVATAR GREEK");
m_ctl.remove_sensor_manifold(null, "SELECT ANIMS AVATAR GREEK");
m_ctl.remove_sensor_manifold(null, "SALIR MENU SELECT AVATARS"); 
	 m_data.unload(m_data.DATA_ID_ALL); 
	_control_data_id[5]=null;
	_control_data_id[4]=null;
	_control_data_id[3]=null;
	_control_data_id[2]=null;
	_control_data_id[1]=null;                 
	   _control_data_id[0]=null;  
		var char_fps_name = "hunter_fps_avatar";  
		var char_tps_name = "greek_avatar";  
  m_options_1_anims.hide_btns_control_intro();
	m_main_menu.load_level_cb(_current_level,_is_char_htoh,_control_data_id,_data_id_fps, char_fps_name, char_tps_name, false,index,length);  
    }
   if (_current_avatar2=="hunter2*hunter_body")
   {
	   data_id=_control_data_id[4]; 
       index=1;
	   length=2;
	   _data_id=data_id;
	   _index_shot=index;
	   _length_shot=length;
m_ctl.remove_sensor_manifold(null, "SELECT ANIMS AVATAR AMAZON");
m_ctl.remove_sensor_manifold(null, "SELECT AVATAR AMAZON");
m_ctl.remove_sensor_manifold(null, "SELECT ANIMS AVATAR HUNTER2");
m_ctl.remove_sensor_manifold(null, "SELECT AVATAR HUNTER2");
m_ctl.remove_sensor_manifold(null, "SELECT ANIMS AVATAR HUNTER");
m_ctl.remove_sensor_manifold(null, "SELECT AVATAR HUNTER");
m_ctl.remove_sensor_manifold(null, "SELECT AVATAR GREEK");
m_ctl.remove_sensor_manifold(null, "SELECT ANIMS AVATAR GREEK");
m_ctl.remove_sensor_manifold(null, "SALIR MENU SELECT AVATARS");
	  m_data.unload(m_data.DATA_ID_ALL); 
	_control_data_id[5]=null;
	_control_data_id[4]=null;
	_control_data_id[3]=null;
	_control_data_id[2]=null;
	_control_data_id[1]=null;                 
	   _control_data_id[0]=null;  
		var char_fps_name = "hunter_fps_avatar";  
		var char_tps_name = "hunter2_avatar";
	m_options_1_anims.hide_btns_control_intro();
	m_main_menu.load_level_cb(_current_level,_is_char_htoh,_control_data_id,_data_id_fps, char_fps_name, char_tps_name, false,index,length);  
   }
   if (_current_avatar2=="amazon_button")
   {
	   data_id=_control_data_id[5]; 
	   index=3;
	   length=4;
	   _data_id=data_id;
	   _index_shot=index;
	   _length_shot=length;
 m_ctl.remove_sensor_manifold(null, "SELECT ANIMS AVATAR AMAZON");
m_ctl.remove_sensor_manifold(null, "SELECT AVATAR AMAZON");
m_ctl.remove_sensor_manifold(null, "SELECT ANIMS AVATAR HUNTER2");
m_ctl.remove_sensor_manifold(null, "SELECT AVATAR HUNTER2");
m_ctl.remove_sensor_manifold(null, "SELECT ANIMS AVATAR HUNTER");
m_ctl.remove_sensor_manifold(null, "SELECT AVATAR HUNTER");
m_ctl.remove_sensor_manifold(null, "SELECT AVATAR GREEK");
m_ctl.remove_sensor_manifold(null, "SELECT ANIMS AVATAR GREEK");
m_ctl.remove_sensor_manifold(null, "SALIR MENU SELECT AVATARS");
	  m_data.unload(m_data.DATA_ID_ALL); 
    _control_data_id[5]=null;
	_control_data_id[4]=null;
	_control_data_id[3]=null;
	_control_data_id[2]=null;
	_control_data_id[1]=null;                 
	   _control_data_id[0]=null;  
		var char_fps_name = "hunter_fps_avatar";  
		var char_tps_name = "amazon_avatar";
	m_options_1_anims.hide_btns_control_intro();
	m_main_menu.load_level_cb(_current_level,_is_char_htoh,_control_data_id,_data_id_fps, char_fps_name, char_tps_name, false,index,length);  
   }
	m_ctl.set_custom_sensor(_sensor_sel_salir, 0);
	if (((_current_avatar2=="")&&(!m_char.get_wrapper()))&&(((_sensor_hunter)&&(_sensor_hunter2))&&((_sensor_greek)&&(_sensor_amazon))))	
	{		
	m_data.unload(_control_data_id[5]);	
	m_data.unload(_control_data_id[4]);				
	m_data.unload(_control_data_id[3]);				
	m_data.unload(_control_data_id[2]);				
	m_data.unload(_control_data_id[1]);	
	_control_data_id[5]=null;
	_control_data_id[4]=null;
	_control_data_id[3]=null;
	_control_data_id[2]=null;
	_control_data_id[1]=null;
if (m_char.get_wrapper())
	{  m_view.eye_camera(camera,_is_char_htoh,_elapsed_sensor,null,null,data_id,index,length);  
		m_view.control_camera_cb(camera,_is_char_htoh,_elapsed_sensor,null,null,data_id,index,length);  	
		m_options_1_anims.hide_btns_control_intro();  
	}
	else {  
	 m_camera.target_setup(camera, { pos: m_ctl_view_conf.TARGET_POS, pivot: m_ctl_view_conf.TARGET_PIVOT, 
              horiz_rot_lim: m_ctl_view_conf.TARGET_HORIZ_LIMITS, vert_rot_lim: m_ctl_view_conf.TARGET_VERT_LIMITS, 
              dist_lim: m_ctl_view_conf.DIST_LIMITS });
	 m_main_menu.show_play_btns();
	 m_options_1_anims.hide_avatars_btn();  
	 }
	}		
  }
 }
}  
 function play_anims_avatar_cb(obj,id,pulse,get_change_avatar_data_id) {    
	if (_sensor_sel_play_anim)		
	m_scs.apply_outline_anim(_boton_play_anim, 10, 5, 0);
	if (_current_avatar2=="hunter_button")
	{  
	    var hunter_rig=m_scs.get_object_by_dupli_name("hunter3","hunter_rig",_control_data_id[2]);
		m_char.play_anim(hunter_rig, "hunter_walktps",m_anim.AB_STOP);
	}	
	 if (_current_avatar2=="hoplita*hunter_body")	
	 { 
		 var greek_rig=m_scs.get_object_by_dupli_name("hoplita","hunter_rig",_control_data_id[3]);
		m_anim.apply(greek_rig, "hunter_jabtps");
        m_anim.set_behavior(greek_rig, m_anim.AB_STOP);
        m_anim.play(greek_rig);		  
	 }	
	if (_current_avatar2=="hunter2*hunter_body")
	{  
	    var hunter_rig2=m_scs.get_object_by_dupli_name("hunter2","hunter_rig",_control_data_id[4]);
		m_char.play_anim(hunter_rig2, "hunter_walktps",m_anim.AB_STOP);
	}	
	if (_current_avatar2=="amazon_button")
	{  
	    var amazon_rig=m_scs.get_object_by_dupli_name("hunter3","hunter_rig",_control_data_id[5]);
		m_char.play_anim(amazon_rig, "hunter_walktps",m_anim.AB_STOP);  
	}	
	 m_ctl.set_custom_sensor(_sensor_sel_play_anim, 0);
 }  
function current_char(obj,is_char_htoh) {  
				_current_avatar2=obj.name;
				_is_char_htoh=is_char_htoh;
if (m_char.get_wrapper()) 
				m_char.get_wrapper().is_current_avatar2=_current_avatar2;  
				if (m_vehicle.get_wrapper())
					m_vehicle.get_wrapper().is_char_htoh=is_char_htoh;  
				console.log("el character body seleccionado es:"+_current_avatar2);
}
 function change_avatar_cb(obj,id, pulse) {
		  if (pulse)
			{            
			if 	(_selected_obj.name!="boton_salir_select_avatar")
			switch (_selected_obj.name) {           
			case "hoplita*hunter_body":  
				current_char(obj,false);				
			break;  
			case "hunter_button":
				current_char(obj,false);				
			break;
			case "hunter2*hunter_body":
				current_char(obj,false);
			break;
	        case "amazon_button":
				current_char(obj,false);
			break;
			} 
		}	
 }   
 function loaded_greek_avatar_cb(data_id) {
	if (!_control_data_id[3])	{  
		_control_data_id[3]=data_id; 
		 	var objs = m_scs.get_all_objects("ALL", data_id); 
			for (var i = 0; i < objs.length; i++) {   		
				var obj = objs[i];
			 if (m_phy.has_physics(obj))   		   
		       console.log("antes activabamos la fisica aqui pero sino hay terrerno del juego cae lueog sin fisica");
			  if  (obj.name=="hoplita*helmet")
			   m_scs.show_object(obj);
		      if (obj.name=="hoplita*knife_tps")
				  m_scs.show_object(obj);
			   if (obj.name=="hoplita*greek_shield")
				  m_scs.show_object(obj);
			 if (m_obj.is_mesh(obj)&&(obj.name=="hoplita*hunter_body"))  
				{
				_sensor_sel_greek = m_ctl.create_selection_sensor(obj, 1);  
				_sensor_greek = m_ctl.create_custom_sensor(obj, true); 
				var greek_collider=m_scs.get_object_by_dupli_name("hoplita","hunter_collider",data_id);
				var rota_default=m_quat.create();
				m_trans.get_rotation(greek_collider, rota_default);
				m_trans.set_translation(greek_collider, _pos_avatar1[0], _pos_avatar1[1],_pos_avatar1[2]);
				m_trans.set_rotation(greek_collider, rota_default[0], rota_default[1], rota_default[2], rota_default[3]);
				m_scs.show_object(obj);
			console.log("greek se supone se cargo correctametne");		
						  m_ctl.create_sensor_manifold(obj, "SELECT ANIMS AVATAR GREEK", m_ctl.CT_SHOT,          
                    [_sensor_sel_play_anim], function logic_func(s) {return s[0]} , play_anims_avatar_cb);	
					 m_ctl.create_sensor_manifold(obj, "SELECT AVATAR GREEK", m_ctl.CT_SHOT,     
                    [_sensor_sel_greek], function logic_func(s) {return s[0]} , change_avatar_cb, _level_conf);  
				}					
			}     
		  }
		}	
  function loaded_hunter_avatar_cb(data_id) {  
	if (!_control_data_id[2])	{  
		 _control_data_id[2]=data_id;
		 	var objs = m_scs.get_all_objects("ALL", data_id); 
			for (var i = 0; i < objs.length; i++) {   		
				var obj = objs[i];
			 if (m_phy.has_physics(obj))   		   
			  console.log("antes activabamos la fisica aqui pero sino hay terrerno del juego cae lueog sin fisica"); 
			 if (obj.name=="hunter3*helmet")
				  m_scs.show_object(obj);
			  if (obj.name=="hunter3*head_hunter")
				  m_scs.show_object(obj);
			 if (m_obj.is_mesh(obj)&&(obj.name=="hunter3*hunter_body"))  
				{ 
				_sensor_sel_hunter = m_ctl.create_selection_sensor(_hunter_button, 1);  
				_sensor_hunter = m_ctl.create_custom_sensor(obj, true);  
					var hunter_collider=m_scs.get_object_by_dupli_name("hunter3","hunter_collider",data_id);
					var rota_default=m_quat.create();
					m_trans.get_rotation(hunter_collider, rota_default);
					m_trans.set_translation(hunter_collider, _pos_avatar2[0], _pos_avatar2[1],_pos_avatar2[2]);
					m_trans.set_rotation(hunter_collider, rota_default[0], rota_default[1], rota_default[2], rota_default[3]);
					m_scs.show_object(obj);
	console.log("hunter se supone se cargo correctametne");					
					m_ctl.create_sensor_manifold(_hunter_button, "SELECT AVATAR HUNTER", m_ctl.CT_SHOT,     
                    [_sensor_sel_hunter], function logic_func(s) {return s[0]} , change_avatar_cb, _level_conf);  
						  m_ctl.create_sensor_manifold(_hunter_button, "SELECT ANIMS AVATAR HUNTER", m_ctl.CT_SHOT,          
                    [_sensor_sel_play_anim], function logic_func(s) {return s[0]} , play_anims_avatar_cb);														
				}	
         }     
	   }	
	}  
	function loaded_hunter2_avatar_cb(data_id) {  
    if (!_control_data_id[4])	{  
		 _control_data_id[4]=data_id;
	console.log("hunter2 el data_id de la carga  es:"+data_id);
		 	var objs = m_scs.get_all_objects("ALL", data_id); 
			for (var i = 0; i < objs.length; i++) {   		
				var obj = objs[i];
			 if (m_phy.has_physics(obj))   		   
		       console.log("antes activabamos la fisica aqui pero sino hay terrerno del juego cae lueog sin fisica"); 
			  if (obj.name=="hunter2*helmet")
				  m_scs.show_object(obj);
			  if (obj.name=="hunter2*head_hunter")
				  m_scs.show_object(obj);    
			 if (m_obj.is_mesh(obj)&&(obj.name=="hunter2*hunter_body"))  
				{ 
				_sensor_sel_hunter2 = m_ctl.create_selection_sensor(obj, 1);  
				_sensor_hunter2 = m_ctl.create_custom_sensor(obj, true);  	
					var hunter2_collider=m_scs.get_object_by_dupli_name("hunter2","hunter_collider",data_id);
					var rota2_default=m_quat.create();
					m_trans.get_rotation(hunter2_collider, rota2_default);
					m_trans.set_translation(hunter2_collider, _pos_avatar3[0], _pos_avatar3[1],_pos_avatar3[2]);
					m_trans.set_rotation(hunter2_collider, rota2_default[0], rota2_default[1], rota2_default[2], rota2_default[3]);
					m_scs.show_object(obj);
			console.log("hunter2 se supone se cargo correctametne");																		
					m_ctl.create_sensor_manifold(obj, "SELECT AVATAR HUNTER2", m_ctl.CT_SHOT,     
                    [_sensor_sel_hunter2], function logic_func(s) {return s[0]} , change_avatar_cb, _level_conf);  
						  m_ctl.create_sensor_manifold(obj, "SELECT ANIMS AVATAR HUNTER2", m_ctl.CT_SHOT,          
                    [_sensor_sel_play_anim], function logic_func(s) {return s[0]} , play_anims_avatar_cb);	
				}	
        }     
	 }
	}  
	function loaded_amazon_avatar_cb(data_id) {  
    if (!_control_data_id[5])	{  
		 _control_data_id[5]=data_id;
		 	var objs = m_scs.get_all_objects("ALL", data_id); 
			for (var i = 0; i < objs.length; i++) {   		
				var obj = objs[i];
			 if (m_phy.has_physics(obj))   		   
			    console.log("antes activabamos la fisica aqui pero sino hay terrerno del juego cae lueog sin fisica"); 
			 if (m_obj.is_mesh(obj)&&(obj.name=="hunter3*hunter_body"))  
				{ 
				_sensor_sel_amazon = m_ctl.create_selection_sensor(_amazon_button, 1);  
				_sensor_amazon = m_ctl.create_custom_sensor(obj, true);  	
					var amazon_collider=m_scs.get_object_by_dupli_name("hunter3","hunter_collider",data_id);
					var rota_default=m_quat.create();
					m_trans.get_rotation(amazon_collider, rota_default);
					m_trans.set_translation(amazon_collider, _pos_avatar4[0], _pos_avatar4[1],_pos_avatar4[2]);
					m_trans.set_rotation(amazon_collider, rota_default[0], rota_default[1], rota_default[2], rota_default[3]);
					m_scs.show_object(obj);
			console.log("amazon se supone se cargo correctamente aunque no la vemos en el escenario junto al resto se habra caido");
					m_ctl.create_sensor_manifold(_amazon_button, "SELECT AVATAR AMAZON", m_ctl.CT_SHOT,     
                    [_sensor_sel_amazon], function logic_func(s) {return s[0]} , change_avatar_cb, _level_conf);  
						  m_ctl.create_sensor_manifold(_amazon_button, "SELECT ANIMS AVATAR AMAZON", m_ctl.CT_SHOT,          
                    [_sensor_sel_play_anim], function logic_func(s) {return s[0]} , play_anims_avatar_cb);	
				}	
        }     
	 }
	}  
})						