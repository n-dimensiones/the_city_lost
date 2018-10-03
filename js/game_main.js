if (b4w.module_check("game_main"))
    throw "Failed to register module: game_main";
b4w.register("game_main", function(exports, require) {
var m_app   = require("app");
var m_ctl   = require("controls");
var m_cons  = require("constraints");
var m_scs   = require("scenes");
var m_anim  = require("animation");
var m_trans = require("transform");
var m_util  = require("util");
var m_sfx   = require("sfx");
var m_vec3  = require("vec3");
var m_quat  = require("quat");
var m_phy   = require("physics");
var m_camera= require("camera");
var m_cont      = require("container");  
var m_mouse = require("mouse");  
var m_input = require("input");  
var m_conf     = require("game_config");
var m_char     = require("character2"); 
var m_interface = require("interface2");
var m_vehicle     = require("vehicles"); 
var m_view 		= require("control_view");
var _driving=0;  			  
var _vehicles_wrappers=null;
var _camera=null;
var _data_id=0; 
exports.init= function(elapsed_sensor) {
}
exports.load_obj_cb = load_obj_cb;												
function load_obj_cb(obj, is_char_htoh, elapsed,data_id,index,length)  {	
_data_id=data_id;		
if (m_phy.is_character(obj)) {  
	 _camera = m_scs.get_active_camera();  									
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().phys_body);
	m_cons.remove(m_char.get_wrapper().phys_body);
	m_phy.set_character_move_dir(m_char.get_wrapper().phys_body, 0, 0);
	m_char.disable_controls();  
    m_phy.disable_simulation(m_char.get_wrapper().phys_body);
	m_cons.remove(_camera);
   m_app.disable_camera_controls();
m_ctl.remove_sensor_manifold(m_char.get_wrapper().gun_fps,"AIM_SHOT_GUN_FPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().gun_tps,"AIM_SHOT_GUN_TPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().pistol_tps,"AIM_SHOT_PISTOL_TPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().gun_laser_tps,"AIM_SHOT_GUN_LASER_TPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().gun_laser_fps,"AIM_SHOT_GUN_LASER_FPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().crosshair_obj,"CROSSHAIR");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().rig,"LASER_ARM_TPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().crosshair_obj, "DAMAGE_ENEMIES_SHOT");
console.log("falta rellenar aqui la descarga del personaje ");  
 }		
console.log("falta descargar objetos pickables y vehcile de manifolds y fisica como ya hemos hecho al personaje previaemnte");
if 	(m_phy.is_character(obj))          
{
switch (m_view.get_wrapper().viewFPS) {	
   case 0:
		m_cons.remove(m_char.get_wrapper().phys_body);
		m_cons.remove(_camera);
		m_scs.hide_object(m_char.get_wrapper().sleeves);	
		m_scs.hide_object(m_char.get_wrapper().body_fps);
	 var target = m_char.get_wrapper().camera_target;                   
		 m_cons.append_semi_soft(_camera, target,m_char.get_wrapper().offset_cam, m_conf.CAM_SOFTNESS);
		 m_camera.correct_up(_camera, m_util.AXIS_Z, true);   
		  m_camera.rotate_camera(_camera,0 , -Math.PI/16, true, true); 
	 break;
  case 1:
		m_cons.remove(m_char.get_wrapper().phys_body);
		m_cons.remove(_camera);
		var canvas_elem = m_cont.get_canvas();
			m_app.enable_camera_controls(false, false, true,canvas_elem);
			m_scs.show_object(m_char.get_wrapper().sleeves);	
			m_scs.show_object(m_char.get_wrapper().body_fps);
		break;		  
	}  
	var rota_default=m_quat.create();
	var vect3_tmp4=m_vec3.create();
    var pos_char=new Float32Array(3);
	m_trans.get_rotation(m_char.get_wrapper().phys_body, rota_default);
	pos_char=m_trans.get_translation(m_char.get_wrapper().phys_body, vect3_tmp4);
	if (((m_char.get_wrapper().reset_stat)||(m_char.get_wrapper().newlevel_stat))&&(!m_char.get_wrapper().gaming_stat))
	{
	var spawner_pos = new Float32Array(3);
	var spawner=m_scs.get_object_by_name("spawner",_data_id-2);  
	m_trans.get_translation(spawner,spawner_pos);
   m_phy.set_transform(m_char.get_wrapper().phys_body,spawner_pos, rota_default);   
	}
	else   
	m_phy.set_transform(m_char.get_wrapper().phys_body,pos_char, rota_default);   
	m_phy.enable_simulation(m_char.get_wrapper().phys_body);  
    m_char.setup_controls(elapsed, is_char_htoh, data_id,index,length);    
   m_phy.set_character_move_type(m_char.get_wrapper().phys_body, m_phy.CM_WALK); 
for (var i=0; i<m_vehicle.get_wrappers().length; i++)
{
 _vehicles_wrappers=m_vehicle.get_wrappers();	              
}	
 if (_vehicles_wrappers)
 {
	collision_to_vehicle(_vehicles_wrappers[0].body, is_char_htoh); 
	collision_to_vehicle(_vehicles_wrappers[1].body, is_char_htoh); 
 }	
m_view.setup_view_tps_sensor();      
m_view.setup_view_FPS_sensor();
}	
else  
	if ((m_phy.is_vehicle_chassis(obj))&&(_driving))  
{  															
	m_char.get_wrapper().vehicle_current=obj;
	m_scs.hide_object(m_char.get_wrapper().sleeves);	
	m_scs.hide_object(m_char.get_wrapper().body_fps);
	m_scs.hide_object(m_char.get_wrapper().gun_fps);
	m_scs.hide_object(m_char.get_wrapper().gun_laser_fps);
	m_scs.hide_object(m_char.get_wrapper().pistol_fps);
	m_scs.hide_object(m_char.get_wrapper().knife_fps);
	var camera=m_scs.get_active_camera();
    m_ctl.remove_sensor_manifold(m_char.get_wrapper().phys_body);
	m_cons.remove(m_char.get_wrapper().phys_body);
	m_cons.remove(camera);
	m_phy.set_character_move_dir(m_char.get_wrapper().phys_body, 0, 0);
   m_phy.disable_simulation(m_char.get_wrapper().phys_body);
   if (m_sfx.is_playing(m_char.get_wrapper().char_run_spk))	  
    m_sfx.stop(m_char.get_wrapper().char_run_spk);
var camera=m_scs.get_active_camera();
var char_tmp=m_char.get_wrapper().phys_body;
var quat_tmp=m_quat.create();
var vec3_tmp=m_vec3.create();
	switch (m_phy.get_vehicle_name(obj)) {  
	case "car":												 
		m_cons.append_semi_soft(camera, _vehicles_wrappers[0].camera_target, m_conf.CAM_OFFSET_VEHICLE, m_conf.CAM_SOFTNESS);  
		m_cons.append_stiff(char_tmp, _vehicles_wrappers[0].vehicle_drive, vec3_tmp, quat_tmp);
		break;	
	case "car2":											 
		m_cons.append_semi_soft(camera, _vehicles_wrappers[1].camera_target, m_conf.CAM_OFFSET_VEHICLE, m_conf.CAM_SOFTNESS);  
		m_cons.append_stiff(char_tmp, _vehicles_wrappers[1].vehicle_drive, vec3_tmp, quat_tmp);
		break;		  
	}  
if (is_char_htoh)
play_anim(m_char.get_wrapper().rig, "sit", m_anim.AB_CYCLIC);  
else
play_anim(m_char.get_wrapper().rig, "hunter_sittps", m_anim.AB_CYCLIC);  
	m_vehicle.setup_controls(obj); 	
	m_vehicle.setup_view_vehicle_FPS_sensor_cb(obj);
	m_vehicle.setup_view_vehicle_tps_sensor_cb(obj);  
   exit_vehicle_cb(obj, is_char_htoh); 	
 }   
} 
exports.exit_vehicle_cb=exit_vehicle_cb;  
function exit_vehicle_cb(obj, is_char_htoh) {    
var elapsed_sensor = m_ctl.create_elapsed_sensor();   
	var sensorkeyX = m_ctl.create_keyboard_sensor(m_ctl.KEY_X);  
	  var aa = m_input.check_enable_gamepad_indices();  
		var index = aa.length ? aa[aa.length - 1] : 0 
		var gamepad_out_car = m_ctl.create_gamepad_btn_sensor(m_input.GMPD_BUTTON_2, index);  
	m_ctl.create_sensor_manifold(obj, "QUIT", m_ctl.CT_SHOT, [sensorkeyX,gamepad_out_car], function(a) { return a[0]||a[1] }, function(obj,id, pulse) { 					
		   if (pulse)  
		   { 	
  m_vehicle._solicitar_conducir=1;  
			m_cons.remove(obj);  
			 m_phy.vehicle_throttle(obj, 0);
             m_phy.vehicle_brake(obj, 1);
			 var chassis=null;														
			if ("car"==m_phy.get_vehicle_name(obj))														
				{
				var empty1="deportivo01";  
				_chassis=m_scs.get_object_by_dupli_name(empty1,"deportivo_chassis",_data_id); 
				}
			else	
			if ("car2"==m_phy.get_vehicle_name(obj))															
			{
			var empty2="deportivo02";  
			_chassis=m_scs.get_object_by_dupli_name(empty2,"deportivo_chassis",_data_id);  
			}	
			m_vehicle.disable_controls(_chassis);					
            var camera = m_scs.get_active_camera();  			
            m_cons.remove(camera);
			 m_trans.set_translation_obj_rel(camera, 6.2, 3.2, 1.5, obj);
			m_phy.set_character_move_dir(m_char.get_wrapper().phys_body, 0, 0);
			m_char.disable_controls(); 
			m_phy.disable_simulation(m_char.get_wrapper().phys_body);			
			m_ctl.remove_sensor_manifold(m_char.get_wrapper().phys_body);
			var _vec3_tmp=new Float32Array(3);   
			var trans = m_trans.get_translation(camera, _vec3_tmp);
			trans[1]=trans[1]+6;
			var _quat4_tmp = new Float32Array(4);
			m_trans.get_rotation(m_char.get_wrapper().phys_body, _quat4_tmp);
			m_cons.remove(m_char.get_wrapper().phys_body);
			m_phy.set_transform(m_char.get_wrapper().phys_body, trans, _quat4_tmp); 
			console.log("se ha salido del vehiculo al pulsar F");
			load_obj_cb(m_char.get_wrapper().phys_body, is_char_htoh, elapsed_sensor);    
			_driving=0;
			m_vehicle.get_wrapper().driving=0;  
			m_char.get_wrapper().vehicle_current==null;	
		   } 
        });  
}	
function collision_to_vehicle(obj, is_char_htoh, sensorwater) { 
        var sensor_collition_cam = m_ctl.create_collision_sensor(obj, "CAMERA", !1);   																						
	   var elapsed_sensor = m_ctl.create_elapsed_sensor(); 			
        var   sensor_keyF = m_ctl.create_keyboard_sensor(m_ctl.KEY_F);
		var sensor_collition_char = m_ctl.create_collision_sensor(obj, "CHARACTER", !1);   
		var touch_conducir = m_ctl.create_custom_sensor(0);
	var aa = m_input.check_enable_gamepad_indices();  
		var index = aa.length ? aa[aa.length - 1] : 0
       var  gamepad_in_car = m_ctl.create_gamepad_btn_sensor(m_input.GMPD_BUTTON_0, index);  
function touch_conducir_cb (event) {
        event.preventDefault();
		m_ctl.set_custom_sensor(touch_conducir, 1);
   console.log("touch_conducir tiene el valor a 1 y es:"+touch_conducir);
}
   document.getElementById("near_obj_info_container").addEventListener("touchstart", touch_conducir_cb, false);
	document.getElementById("near_obj_info_container").addEventListener("click", touch_conducir_cb, false);
		 m_ctl.create_sensor_manifold(obj, "TOUCH_NOTIFY", m_ctl.CT_CONTINUOUS, [sensor_collition_cam,sensor_collition_char,elapsed_sensor], function(a) {  
            return (a[0] && a[2])|| (a [1] && a[2]) 
        }, function(obj, id, pulse) {
        	if (1 == pulse )
			{
			document.getElementById("near_obj_info_container").style.zIndex=2;
			document.getElementById("near_obj_info_container").style.visibility="visible";
			 console.log("touch_conducir debia tener el valor a 0 mientras no pique volante icon y es:"+touch_conducir);
			var body_elem=document.body;
			var current_lang= document.getElementsByTagName("BODY")[0].getAttribute("lang"); 
			switch (current_lang) {
				case "es":
				m_interface.muestra_notificacion("<span>Presione F para conducir o haz click al volante o boton A</span>", "drive.png");
				setTimeout(	function() {
							m_interface.muestra_notificacion("");
							document.getElementById("near_obj_info_container").style.zIndex=0;
							document.getElementById("near_obj_info_container").style.visibility="hidden";
							},10000);
				break;
				case "en":
				m_interface.muestra_notificacion("<span>Press F to drive or click on the steering wheel or button A</span>", "drive.png");
				setTimeout(	function() {
							m_interface.muestra_notificacion("");
							document.getElementById("near_obj_info_container").style.zIndex=0;
							document.getElementById("near_obj_info_container").style.visibility="hidden";
							},10000);
				break;			
			}
			console.log("se podria subir al  pulsar F en el name coche actual que es: "+m_phy.get_vehicle_name(obj));
			}
			else   
			{
				m_interface.muestra_notificacion("")  
			document.getElementById("near_obj_info_container").style.zIndex=0;
			document.getElementById("near_obj_info_container").style.visibility="hidden";
			}
        });
	    m_ctl.create_sensor_manifold(obj, "TOUCH", m_ctl.CT_SHOT, [sensor_collition_cam, sensor_collition_char, sensor_keyF, touch_conducir,gamepad_in_car], 
		function(a) {    
		   return  ((a[0]&&((a[2]||a[3])||a[4]))||(a[1]&& ((a[2]||a[3])||a[4])))
        },
		function(obj, id, pulse) {
            if (1 == pulse) 
		 {
			 console.log("el estado de touch_condudir es:"+touch_conducir);
		 obj.state= m_conf.VS_IDLE;
			_driving=1;  
			m_vehicle.get_wrapper().driving=1;  
			load_obj_cb(obj, is_char_htoh, elapsed_sensor);        
            m_interface.muestra_notificacion("");   
			console.log("se ha subido al pulsar F en el coche: "+m_phy.get_vehicle_name(obj));
			if ("car"==m_phy.get_vehicle_name(obj))
				m_char.get_wrapper().vehicle_current=obj;
		   else
			   if ("car2"==m_phy.get_vehicle_name(obj))
					m_char.get_wrapper().vehicle_current=obj;
		 } 
		}) 
}  
function play_anim(_character_rig, name_anim,type_anim) {  
       m_anim.apply(_character_rig, name_anim);  
        m_anim.set_behavior(_character_rig, type_anim);  
       m_anim.play(_character_rig)
	}          
})