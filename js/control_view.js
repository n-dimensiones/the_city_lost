"use strict"
if (b4w.module_check("control_view"))
    throw "Failed to register module: control_view";
b4w.register("control_view", function(exports, require) {
var m_app   = require("app");
var m_scs = require("scenes");
var m_phy = require("physics");
var m_cons  = require("constraints");
var m_ctl   = require("controls");
var m_time  = require("time");
var m_vec3  = require("vec3");
var m_camera = require("camera");
var m_fps = require("fps");
var m_input= require("input");
var m_main  = require("main");
var m_hmd       = require("hmd");
var m_hmd_conf  = require("hmd_conf");  
var m_util  = require("util");
var m_quat  = require("quat");  
var m_resources= require("resources"); 
var m_input = require("input"); 
var m_mouse = require("mouse");
var m_trans = require("transform");
var m_anim = require("animation");
var m_load_level=require("load_level");
var m_game_main = require("game_main");
var m_char = require("character2");
var m_conf = require("game_config");
var m_weapons =require("weapons");
var m_vehicle = require("vehicles");
var _controlview=null; 
var _data_id=0;
var _index=0;
var _length=2;
var _char_collider=null;
var _vec3_tmp2 = m_vec3.create();  
var _dest_x_trans = 0;
var _dest_z_trans = 0;
exports.init_control_view = function(charcollider,camera,is_char_htoh, elapsed_sensor,eye_pos,look_at,data_id,index,length, level_tmp) {
	_controlview={
		camera:camera,
		is_char_htoh:is_char_htoh,
		elapsed_sensor:elapsed_sensor,
		eye_pos:eye_pos,
		look_at:look_at,
		data_id:data_id,
		level:level_tmp,
		index:index,
		length:length,
		view_tps_touch_sensor: m_ctl.create_custom_sensor(0), 
		view_fps_touch_sensor: m_ctl.create_custom_sensor(0), 
		view_tps_sensor: m_ctl.create_custom_sensor(1), 
		 view_fps_sensor: m_ctl.create_custom_sensor(0),    
		viewFPS:0,   
		char_collider: _char_collider 
	};	
}
exports.get_wrapper=get_wrapper;
function get_wrapper() {
 return _controlview;		
}
exports.setup_camera = function(obj) {	 
    var camera = m_scs.get_active_camera();
	m_cons.remove(camera);         
	m_cons.remove(obj); 				
  if (m_char.get_wrapper())             
  {
	var target = m_char.get_wrapper().camera_target;	 
	m_cons.append_semi_soft(camera, target, m_conf.CAM_OFFSET, m_conf.CAM_SOFTNESS);  
  }
}
function switchFPS(obj,id,pulse)  
	{	
 var  _empty_cam = m_scs.get_object_by_name("empty_cam");	
        m_ctl.remove_sensor_manifold(_empty_cam,"COLLISION_CAM_VS_WALL");
		m_cons.remove(obj);	  
		var camera=m_scs.get_active_camera();
		m_cons.remove(camera);        
		var vect3_tmp4=m_vec3.create();	
		var pos_char=new Float32Array(3);
		pos_char=m_trans.get_translation(_controlview.char_collider, vect3_tmp4);  
		pos_char[2]=pos_char[2]+1;  
		var _quat_tmp = m_quat.create();
        var rot_quat = m_trans.get_rotation(m_char.get_wrapper().phys_body, _quat_tmp);
		 m_trans.set_translation_v(camera, pos_char);  
	 m_trans.set_rotation_v(camera,rot_quat);													
		 m_camera.correct_up(camera, m_util.AXIS_MZ, true); 
 if (m_hmd.check_browser_support())
 {
 }
m_app.enable_camera_controls(false, false, true,main_canvas_container);
var  empty_fps = m_char.get_wrapper().empty_fps;
var my_offset_vector = new Float32Array([-0.035, -0.3, -0.25]);  
		m_cons.append_stiff(m_char.get_wrapper().gun_laser_empty, empty_fps, my_offset_vector,null,4); 
		m_phy.set_character_move_type(obj, m_phy.CM_WALK); 
		m_char.get_wrapper().state = m_conf.CH_STILL;  
		m_phy.set_character_move_dir(obj, 0, 0);
		_controlview.viewFPS=1; 
		 m_ctl.set_custom_sensor(_controlview.view_tps_sensor,0);
		 m_ctl.set_custom_sensor(_controlview.view_fps_sensor,1);		 
	m_weapons.switch_weapons_cb(m_char.get_wrapper().weapon_current,_controlview.viewFPS,m_char.get_wrapper().is_char_htoh_value);
	if ((m_char.get_wrapper().weapon_current==-1)||(m_char.get_wrapper().weapon_current==0))
			m_anim.apply(m_char.get_wrapper().laser_arm_fps, "hunter_idlefps");  
			else
			m_anim.apply(m_char.get_wrapper().laser_arm_fps, "hunter_idleshotfps");
		m_scs.hide_object(m_char.get_wrapper().body);   
		m_scs.show_object(m_char.get_wrapper().body_fps);	
		m_scs.show_object(m_char.get_wrapper().sleeves);	
	m_anim.set_behavior(m_char.get_wrapper().laser_arm_fps, m_anim.AB_CYCLIC); 
	m_anim.play(m_char.get_wrapper().laser_arm_fps);	
 }
function switchtps(obj,id,pulse)		  {		  
  m_scs.show_object(m_char.get_wrapper().body);
	m_scs.hide_object(m_char.get_wrapper().sleeves);	
	m_scs.hide_object(m_char.get_wrapper().body_fps);  
if (!m_char.get_wrapper()){			
  return;
}
m_scs.show_object(m_char.get_wrapper().body);  
	m_char.get_wrapper().offset_cam=m_conf.CAM_OFFSET;   
	m_char.get_wrapper().state = m_conf.CH_STILL;  
	var camera=m_scs.get_active_camera();
	var target = m_char.get_wrapper().camera_target;  			
     m_phy.set_character_move_dir(obj, 0, 0);	
	var target_POS_act = new Float32Array(3);  
	m_trans.get_translation(target,target_POS_act);  
		var _quat_tmp = m_quat.create();
        var rot_quat = m_trans.get_rotation(m_char.get_wrapper().phys_body, _quat_tmp);  
	m_cons.remove(camera);    
	m_cons.remove(obj);	
	m_app.disable_camera_controls();  
 m_trans.set_rotation_v(target,rot_quat );
 m_trans.set_translation_v(target, target_POS_act);  
		 m_camera.correct_up(camera, m_util.AXIS_MZ, true);   
	   	m_cons.append_semi_soft(camera, target, [0,4,0.5], m_conf.CAM_SOFTNESS);  
		m_resources.get_wrapper().view_no_static=1; 
	console.log("se supone se ejecuto el contrains de camera tps o he pulsado 2 para vista tps sin contar con el stiff de mouselook ");
	m_phy.set_character_move_type(obj, m_phy.CM_WALK);   
	_controlview.viewFPS=0;					  
	 m_ctl.set_custom_sensor(_controlview.view_tps_sensor,1);
	 m_ctl.set_custom_sensor(_controlview.view_fps_sensor,0);	
	 m_weapons.switch_weapons_cb(m_char.get_wrapper().weapon_current,_controlview.viewFPS,m_char.get_wrapper().is_char_htoh_value);
}   
exports.setup_view_tps_sensor=setup_view_tps_sensor;     
function setup_view_tps_sensor(charcollider,camera,is_char_htoh, elapsed_sensor,eye_pos,look_at,data_id,index,length) {  
 var sensorkey2 = m_ctl.create_keyboard_sensor(m_ctl.KEY_2); 
 m_ctl.create_sensor_manifold(m_char.get_wrapper().phys_body, "THIRD_VIEW", m_ctl.CT_SHOT, [sensorkey2,_controlview.view_tps_touch_sensor], 
		function(a) { return a[0] || a[1]             
        },
		switchtps);  
}
exports.setup_view_FPS_sensor=setup_view_FPS_sensor;
function setup_view_FPS_sensor(charcollider,camera,is_char_htoh, elapsed_sensor,eye_pos,look_at,data_id,index,length) { 
	 var sensorkey1 = m_ctl.create_keyboard_sensor(m_ctl.KEY_1);  		
	   m_ctl.create_sensor_manifold(m_char.get_wrapper().phys_body, "FIRST_VIEW", m_ctl.CT_SHOT, [sensorkey1,_controlview.view_fps_touch_sensor],
		function(a) {
            return a[0] || a[1]        
        }, 
		switchFPS);		
} 
	exports.setup_target_view=setup_target_view;
function setup_target_view(target_pos,target_pivot) {	
			if (m_char.get_wrapper())             																		
			{
				m_ctl.remove_sensor_manifold(m_char.get_wrapper().phys_body);
				m_cons.remove(m_char.get_wrapper().phys_body);
				m_phy.set_character_move_dir(m_char.get_wrapper().phys_body, 0, 0);
				m_char.disable_controls();  
				m_phy.disable_simulation(m_char.get_wrapper().phys_body);
			}
			var device = m_input.get_device_by_type_element(m_input.DEVICE_MOUSE);
			m_input.detach_param_cb(device, m_input.MOUSE_WHEEL, m_weapons.mouse_wheel_cb);  
			m_resources.get_wrapper().view_no_static=0; 
			m_mouse.exit_pointerlock();
		var camobjtarget = m_scs.get_active_camera();
		   m_cons.remove(camobjtarget);         
			m_camera.target_setup(camobjtarget, { pos: m_conf.TARGET_POS, pivot: m_conf.TARGET_PIVOT, 
            horiz_rot_lim: m_conf.TARGET_HORIZ_LIMITS, vert_rot_lim: m_conf.TARGET_VERT_LIMITS, 
            dist_lim: m_conf.DIST_LIMITS });			
			m_camera.rotate_camera(camobjtarget,0 , Math.PI/16, true, true); 
			m_app.enable_camera_controls(false, false, true,main_canvas_container); 
}
	function view_static_camera(is_char_htoh,elapsed_sensor) {
		var camobjtarget = m_scs.get_active_camera();
		 var sensorkey4 = m_ctl.create_keyboard_sensor(m_ctl.KEY_4);     
		m_ctl.create_sensor_manifold(camobjtarget, "VIEW4", m_ctl.CT_SHOT, [sensorkey4], 
		function(a) { return a[0] }, 
		function(obj,id,pulse) {
	if (pulse)
	{	
	console.log("se acaba de ejecutar view_static_camera o pulsar 4");
			m_ctl.remove_sensor_manifold(m_char.get_wrapper().phys_body);
			m_cons.remove(m_char.get_wrapper().phys_body);
			m_phy.set_character_move_dir(m_char.get_wrapper().phys_body, 0, 0);
			m_char.disable_controls();  
			m_phy.disable_simulation(m_char.get_wrapper().phys_body);
		   m_cons.remove(camobjtarget);         
		   	m_app.enable_camera_controls(false, false, true,main_canvas_container); 
			m_resources.get_wrapper().view_no_static=0; 
			m_mouse.exit_pointerlock();
		m_camera.static_setup(camobjtarget, { pos: m_conf.STATIC_POS, look_at: m_conf.STATIC_LOOK_AT });
		m_camera.correct_up(camobjtarget, m_util.AXIS_MZ, true);   
		view_eye_camera(is_char_htoh, elapsed_sensor);	
					}
			});  
	}
	function view_eye_camera(camobjtarget,is_char_htoh, elapsed_sensor,eye_pos,look_at,data_id,index,length) {				
		 var sensorkey5 = m_ctl.create_keyboard_sensor(m_ctl.KEY_5);     
		m_ctl.create_sensor_manifold(camobjtarget, "VIEW5", m_ctl.CT_SHOT, [sensorkey5], 
			function(a) { return a[0] }, 
			function(obj,id,pulse) {
		if (pulse)
		 {
		console.log("se acaba de ejecutar view_eye_camera o pulsar 5");
		eye_camera(obj,is_char_htoh,elapsed_sensor,null,null,data_id,index,length);  
		 }  
		});  
	} 
	function view_target_camera(camobjtarget1,is_char_htoh, elapsed_sensor,eye_pos,look_at,data_id,index,length) {
		 var sensorkey3 = m_ctl.create_keyboard_sensor(m_ctl.KEY_3);     
		m_ctl.create_sensor_manifold(camobjtarget1, "VIEW3", m_ctl.CT_SHOT, [sensorkey3], 
		function(a) { return a[0] }, 
		function(obj,id,pulse) {
	if (pulse)
	{	
		var EYE_POS_act = new Float32Array(3);
		if(m_char.get_wrapper())	{		
		m_trans.get_translation(m_char.get_wrapper().phys_body,EYE_POS_act);
		}
		target_camera(obj,EYE_POS_act,EYE_POS_act,is_char_htoh, elapsed_sensor,eye_pos,look_at,data_id,index,length);
		view_eye_camera(camobjtarget1,is_char_htoh, elapsed_sensor,eye_pos,look_at,data_id,index,length);	
	}
		});  
	} 
	function view_eye_camera_testing() {
		console.log("se acaba de ejecutar view_eye_camera y sino volvemos a ella es por que falta un load_cb() como si sucede en interface.init");		
	} 
exports.control_camera_cb=control_camera_cb;   
  function control_camera_cb(camera,is_char_htoh, elapsed_sensor,eye_pos,look_at,data_id,index,length) {  
	switch (m_camera.get_move_style(camera)) {		
	case m_camera.MS_TARGET_CONTROLS:
		var EYE_POS_act = new Float32Array(3);
		if(m_char.get_wrapper())	{	
		var rota_default=m_quat.create();
		m_trans.get_rotation(m_char.get_wrapper().phys_body, rota_default);
        m_phy.set_transform(m_char.get_wrapper().phys_body, m_conf.CHAR_DEF_POS, rota_default);   
		m_trans.get_translation(m_char.get_wrapper().phys_body,EYE_POS_act);
		target_camera(camera,EYE_POS_act,EYE_POS_act,is_char_htoh,elapsed_sensor,eye_pos,look_at,data_id,index,length);
		view_eye_camera(camera,is_char_htoh, elapsed_sensor,eye_pos,look_at,data_id,index,length);
		view_static_camera(); 	
		}
		else
		target_camera(camera,m_conf.EYE_POS,m_conf.EYE_LOOK_AT);  
		break; 	
	case m_camera.MS_EYE_CONTROLS:  
		if (m_char.get_wrapper())          
		{	
	       var rota_default=m_quat.create();
		   var EYE_POS_act = new Float32Array(3);
    		m_trans.get_rotation(m_char.get_wrapper().phys_body, rota_default);
			m_trans.get_translation(m_char.get_wrapper(is_char_htoh).phys_body,EYE_POS_act);
    	}
		set_tps(is_char_htoh);  
		view_target_camera(camera,EYE_POS_act,EYE_POS_act,is_char_htoh,elapsed_sensor,eye_pos,look_at,data_id,index,length); 
		view_static_camera();
		if (m_char.get_wrapper())             
		view_eye_camera(camera,is_char_htoh,elapsed_sensor,eye_pos,look_at,data_id,index,length); 	
		break;
	case m_camera.MS_STATIC:
		view_target_camera();
		if (m_char.get_wrapper())             
		view_eye_camera(is_char_htoh,elapsed_sensor); 	
		break;
    case m_camera.MS_HOVER_CONTROLS:
        var use_hover = true;
        var  sensorkeyQ = m_ctl.create_keyboard_sensor(m_ctl.KEY_Q);
		m_ctl.create_sensor_manifold(m_char.get_wrapper().phys_body, "VIEWHOVER", m_ctl.CT_SHOT, [sensorkeyQ], 
		function(a) { return a[0] }, 
		function(a, d) {
			 var camera = m_scs.get_active_camera();
			m_camera.hover_setup(camera, { pos: m_conf.HOVER_POS, pivot: m_conf.HOVER_PIVOT});
			m_camera.rotate_camera(camera, -Math.PI/4, -Math.PI/8, true, true);
			m_app.enable_camera_controls(false, false, false,main_canvas_container );
		  });
        break;    
	}  
 } 
 exports.target_camera=target_camera;
 function target_camera(camobjtarget1,postarget,pivottarget, is_char_htoh, elapsed_sensor,eye_pos,look_at,data_id,index,length) {  
 console.log("posiblemente se acaba de ejecutar view_target_camera pulsar 3 para llegar aqui");
		if(m_char.get_wrapper())	{		
		m_phy.set_character_move_dir(m_char.get_wrapper().phys_body, 0, 0);
		m_resources.get_wrapper().view_no_static=0; 
		m_mouse.exit_pointerlock();
		}
	   m_camera.correct_up(camobjtarget1, m_util.AXIS_MZ, true);   
		m_cons.remove(camobjtarget1);
		postarget[1]=postarget[1]+1;
		m_camera.target_setup(camobjtarget1, { pos: postarget, pivot: pivottarget,
		 horiz_rot_lim: m_conf.TARGET_HORIZ_LIMITS, vert_rot_lim: m_conf.TARGET_VERT_LIMITS, 
            dist_lim: m_conf.DIST_LIMITS });    
			m_camera.rotate_camera(camobjtarget1,0 , Math.PI/3, true, true); 
		m_app.enable_camera_controls(false, false, true,main_canvas_container); 
	}
exports.eye_camera=eye_camera;  
 function eye_camera(obj,is_char_htoh,elapsed_sensor,eye_pos,look_at,data_id,index,length) {  
var camera = m_scs.get_active_camera();  
		var EYE_POS_act = new Float32Array(3);
		if(m_char.get_wrapper())			
		{
		m_trans.get_translation(m_char.get_wrapper().phys_body,EYE_POS_act);
		m_ctl.remove_sensor_manifold(m_char.get_wrapper().phys_body);
		m_cons.remove(m_char.get_wrapper().phys_body);
		m_phy.set_character_move_dir(m_char.get_wrapper().phys_body, 0, 0);
		m_char.disable_controls();  
		m_phy.disable_simulation(m_char.get_wrapper().phys_body);		
		}
		m_resources.get_wrapper().view_no_static=1; 
		console.log("se acaba de ejecutar eye_camera y sino volvemos a ella es por que falta un load_cb() como si sucede en interface.init");
	   m_cons.remove(camera);
	   m_app.disable_camera_controls();  
	   if ((eye_pos)&&(look_at))   
	   {    
	      m_camera.eye_setup(camera, { pos: eye_pos , pivot: look_at, vert_rot_lim: m_conf.EYE_VERT_LIMITS}); 
	       m_camera.correct_up(camera, m_util.AXIS_MZ, true);   
	   }   
	   else
	   {  
	    m_camera.eye_setup(camera, { pos: m_conf.EYE_POS, pivot: m_conf.EYE_LOOK_AT, vert_rot_lim: m_conf.EYE_VERT_LIMITS});
		  m_camera.correct_up(camera, m_util.AXIS_MZ, true); 
	   }
	   if (m_char.get_wrapper())	
	   {		
		console.log("deberia ser el agua si estamos 1 de valor y es :"+m_char.get_wrapper().en_agua);
		if (m_char.get_wrapper().en_agua)
			m_char.reset();		
var vehicle_current=m_char.get_wrapper().vehicle_current; 
var emptyname="deportivo01*deportivo_chassis";
var emptyname2="deportivo02*deportivo_chassis";
	if ((vehicle_current.name==emptyname)||(vehicle_current.name==emptyname2))  
{
			m_cons.remove(vehicle_current);  
			 m_phy.vehicle_throttle(vehicle_current, 0);
             m_phy.vehicle_brake(vehicle_current, 1);
	var data_id_main=data_id-2;  
			 var chassis=null;														
			if ("car"==m_phy.get_vehicle_name(vehicle_current))														
				{
				var empty1="deportivo01";  
				chassis=m_scs.get_object_by_dupli_name(empty1,"deportivo_chassis",data_id_main); 
				}
			else	
			if ("car2"==m_phy.get_vehicle_name(vehicle_current))															
			{
			var empty2="deportivo02";  
			chassis=m_scs.get_object_by_dupli_name(empty2,"deportivo_chassis",data_id_main);  
			}	
			m_vehicle.disable_controls(chassis);		 
 }
		m_game_main.load_obj_cb(_controlview.char_collider, _controlview.is_char_htoh, _controlview.elapsed_sensor,_controlview.data_id,_controlview.index,_controlview.length);  
	   }	 
 }
exports.set_tps=set_tps;
function set_tps(is_char_htoh){            
	m_char.get_wrapper().offset_cam=m_conf.CAM_OFFSET; 
    m_scs.show_object(m_char.get_wrapper().body);
	m_char.get_wrapper().state = m_conf.CH_STILL;  
	m_phy.set_character_move_dir(m_char.get_wrapper().phys_body, 0, 0);								
	var camera=m_scs.get_active_camera();
		m_cons.remove(camera);   
		m_cons.remove(m_char.get_wrapper().phys_body);	
		m_app.disable_camera_controls();  
	var target = m_char.get_wrapper().camera_target;  	
	m_cons.append_semi_soft(camera, target, m_char.get_wrapper().offset_cam, m_conf.CAM_SOFTNESS);  
	console.log("se supone se ejecuto el contrains de camera tps o he pulsado 2 para vista tps sin contar con el stiff de mouselook ");
	m_phy.set_character_move_type(m_char.get_wrapper().phys_body, m_phy.CM_WALK);   
	_controlview.viewFPS=0;					  
	 m_ctl.set_custom_sensor(_controlview.view_tps_sensor,1);
	 m_ctl.set_custom_sensor(_controlview.view_fps_sensor,0);	
}	
})		