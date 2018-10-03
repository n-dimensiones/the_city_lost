if (b4w.module_check("vehicles"))
    throw "Failed to register module: vehicles";
b4w.register("vehicles", function(exports, require) {
var m_app   = require("app");
var m_ctl   = require("controls");
var m_cons  = require("constraints");
var m_scs   = require("scenes");
var m_anim  = require("animation");
var m_sfx   = require("sfx");
var m_trans = require("transform");
var m_util  = require("util");
var m_vec3  = require("vec3");
var m_quat  = require("quat");
var m_phy   = require("physics");
var m_camera= require("camera");
var m_input     = require("input");
var m_gp_conf   = require("gp_conf");
var m_touch_controls= require("touch_controls");
var m_conf     = require("game_config");
var m_char     = require("character2"); 
var m_interface = require("interface2");  
var _touch_view_tps=null;
var _touch_view_FPS=null;
var _elapsed_sensor=null;
var _level_conf=null;
var _vehicle_wrapper=null;  
var _vehicles_wrappers = [];     
var _solicitar_conducir=2;  
var _vista_vehicle_default=1;  
var _is_char_htoh=true;   
exports.init= function(elapsed_sensor, is_char_htoh, data_id,level_conf) {          
_level_conf=level_conf;
_elapsed_sensor=elapsed_sensor;		
  var empty_name;
  for (var i = 0; i < m_conf.VEHICLES_EMPTIES.length; i++) {  
		 empty_name=m_conf.VEHICLES_EMPTIES[i];		
		var vehicle_empty = m_scs.get_object_by_name(empty_name, data_id);  
        var vehicle = m_scs.get_object_by_dupli_name(empty_name, "deportivo_chassis", data_id);  
		var cam_target = m_scs.get_object_by_dupli_name(empty_name, "cam_veh_target", data_id);
		var vehicle_drive = m_scs.get_object_by_dupli_name(empty_name, "vehicle_drive", data_id);
		var vehicle_name=m_phy.get_vehicle_name(vehicle);   
		  console.log("name del vehicle"+vehicle_name);     
         _vehicle_wrapper = init_wrapper(vehicle, vehicle_empty, cam_target,vehicle_drive, is_char_htoh); 
        _vehicle_wrapper.walk_speaker = m_scs.get_object_by_dupli_name(empty_name,
                                                  m_conf.VEHICLE_WALK_SPEAKER, data_id);
        _vehicle_wrapper.idle_speaker = m_scs.get_object_by_dupli_name(empty_name,
                                                  m_conf.VEHICLE_IDLE_SPEAKER, data_id);
        _vehicle_wrapper.run_speaker = m_scs.get_object_by_dupli_name(empty_name,
                                                  m_conf.VEHICLE_RUN_SPEAKER, data_id);
        _vehicle_wrapper.starter_speaker = m_scs.get_object_by_dupli_name(empty_name,
                                                  m_conf.VEHICLE_STARTER_SPEAKER, data_id);
		_is_char_htoh=_vehicle_wrapper.is_char_htoh;						
        m_ctl.create_sensor_manifold(_vehicle_wrapper, "CAR", m_ctl.CT_CONTINUOUS,     
                                     [elapsed_sensor], null, vehicle_ai_cb);    
        _vehicles_wrappers.push(_vehicle_wrapper);   
	}
}
function init_wrapper(body, empty, camera_target, vehicle_drive,is_char_htoh) {   
    return {
        body: body,    
        empty: empty,
		camera_target: camera_target, 
		vehicle_drive: vehicle_drive,																				
        hp: m_conf.VEHICLE_HP,    
        state: m_conf.VS_NONE,                      
       driving: null,    
        walk_speaker: null,
		run_speaker: null,
		starter_speaker: null,
		idle_speaker: null,
	     is_char_htoh: is_char_htoh  
    }
}
function vehicle_ai_cb(obj, id) {  
   if (obj.hp <= 0) {          
        kill(obj);           
        return;
    }
    switch (obj.state) {           
   case m_conf.VS_RUN:
     	if (!m_sfx.is_playing(_vehicle_wrapper.run_speaker)) 
	{
        m_sfx.play_def(_vehicle_wrapper.run_speaker);
        m_sfx.cyclic(_vehicle_wrapper.run_speaker, true);
	}
   case m_conf.VS_WALKING:
        var elapsed = m_ctl.get_sensor_value(obj, id, 0);
		if (!m_sfx.is_playing(_vehicle_wrapper.walk_speaker)) 
	{
        m_sfx.play_def(_vehicle_wrapper.walk_speaker);
        m_sfx.cyclic(_vehicle_wrapper.walk_speaker, true);
	}
        break;
		case m_conf.VS_IDLE:            
        var elapsed = m_ctl.get_sensor_value(obj, id, 0);
		if (!m_sfx.is_playing(_vehicle_wrapper.idle_speaker)) 
	{
        m_sfx.play_def(_vehicle_wrapper.idle_speaker);
        m_sfx.cyclic(_vehicle_wrapper.idle_speaker, true);
	}
        break;
		case m_conf.VS_NONE:
        var elapsed = m_ctl.get_sensor_value(obj, id, 0);
   m_sfx.stop(_vehicle_wrapper.walk_speaker);  
   m_sfx.stop(_vehicle_wrapper.run_speaker);
   m_sfx.stop(_vehicle_wrapper.idle_speaker);
   m_sfx.stop(_vehicle_wrapper.starter_speaker);
        break;
   default:
        break;
    }
}
function set_state(vehicle_wrapper, state) {   
    switch (state) {
    case m_conf.VS_WALKING:  
	       if (vehicle_wrapper.state == m_conf.VS_WALKING)
               set_state(vehicle_wrapper, m_conf.VS_RUN);
        break;
     case m_conf.VS_RUN:
	       if (vehicle_wrapper.state == m_conf.VS_WALKING)
               set_state(vehicle_wrapper, m_conf.VS_RUN);
	  break;
     case m_conf.VS_IDLE:
	       if (vehicle_wrapper.state == m_conf.VS_NONE)
               set_state(vehicle_wrapper, m_conf.VS_IDLE);
	  break;
      case m_conf.VS_NONE:
	       if (vehicle_wrapper.state == m_conf.VS_NONE)
               set_state(vehicle_wrapper, m_conf.VS_WALKING);
	  break;
    }
    vehicle_wrapper.state = state;
}
exports.disable_controls= function(obj)   
{
  m_app.disable_object_controls(obj);  
 _vehicle_wrapper.state= m_conf.VS_NONE; 
 m_ctl.remove_sensor_manifold(obj);
}
exports.setup_controls= function(obj)   
{
	var right_arrow = m_ctl.create_custom_sensor(0);
    var left_arrow  = m_ctl.create_custom_sensor(0);
    var up_arrow    = m_ctl.create_custom_sensor(0);
    var down_arrow  = m_ctl.create_custom_sensor(0);	
	 var touch_jump  = null;   
	 var right_giro  = m_ctl.create_custom_sensor(0);		
     var left_giro  = m_ctl.create_custom_sensor(0);		
	var touch_fly=null;  
var touch_attack=null;  
 _touch_view_tps= m_ctl.create_custom_sensor(0);     
 _touch_view_FPS = m_ctl.create_custom_sensor(0);	
    if(m_char.detect_mobile()) {
        m_touch_controls.setup_touch_controls(right_arrow, up_arrow, left_arrow, down_arrow, null, null, _touch_view_tps, _touch_view_FPS, null, right_giro, left_giro);  
    }
	enable_object_controls(obj, null, up_arrow, down_arrow, right_arrow, left_arrow);  
   m_gp_conf.update();
   _vehicle_wrapper.state=m_conf.VS_WALKING;
} 
enable_object_controls = function(obj, element, up_arrow, down_arrow, right_arrow, left_arrow) {     
    var trans_speed = 1;
    var is_vehicle = m_phy.is_vehicle_chassis(obj) ||
            m_phy.is_vehicle_hull(obj);
    var key_gamepad_cb = function(obj, id, pulse) {
        if (pulse == 1) {
            var elapsed = m_ctl.get_sensor_value(obj, id, 0);
            switch (id) {
            case "FORWARD":
                if (is_vehicle)
                    m_phy.vehicle_throttle(obj, 1);
                else
                    m_trans.move_local(obj, 0, -trans_speed * elapsed, 0);
                break;
            case "BACKWARD":
                if (is_vehicle)
                    m_phy.vehicle_throttle(obj, -1);
                else
                    m_trans.move_local(obj, 0, trans_speed * elapsed, 0);
                break;
            case "LEFT":
                if (is_vehicle)
                    m_phy.vehicle_steer(obj, -1);
                else
                    m_trans.move_local(obj, trans_speed * elapsed, 0, 0);
                break;
            case "RIGHT":
                if (is_vehicle)
                    m_phy.vehicle_steer(obj, 1);
                else
                    m_trans.move_local(obj, -trans_speed * elapsed, 0, 0);
                break;
            default:
                break;
            }
        } else {
            switch (id) {
            case "FORWARD":
            case "BACKWARD":
                if (is_vehicle)
                    m_phy.vehicle_throttle(obj, 0);
                break;
            case "LEFT":
            case "RIGHT":
                if (is_vehicle)
                    m_phy.vehicle_steer(obj, 0);
                break;
            default:
                break;
            }
        }  //if pulse
    }  //key_gamepad_cb
    var elapsed = m_ctl.create_elapsed_sensor();
    var key_w = m_ctl.create_keyboard_sensor(m_ctl.KEY_W);
    var key_s = m_ctl.create_keyboard_sensor(m_ctl.KEY_S);
    var key_a = m_ctl.create_keyboard_sensor(m_ctl.KEY_A);
    var key_d = m_ctl.create_keyboard_sensor(m_ctl.KEY_D);
    var key_up = m_ctl.create_keyboard_sensor(m_ctl.KEY_UP);
    var key_down = m_ctl.create_keyboard_sensor(m_ctl.KEY_DOWN);
    var key_left = m_ctl.create_keyboard_sensor(m_ctl.KEY_LEFT);
    var key_right = m_ctl.create_keyboard_sensor(m_ctl.KEY_RIGHT);
		var aa = m_input.check_enable_gamepad_indices();  //nos dectecta cuantos gamepad usamos de 4 posibles
		var index = aa.length ? aa[aa.length - 1] : 0
		var gs_w = m_ctl.create_gamepad_btn_sensor(m_input.GMPD_BUTTON_12, index);
        var gs_d = m_ctl.create_gamepad_btn_sensor(m_input.GMPD_BUTTON_15, index);
        var gs_s = m_ctl.create_gamepad_btn_sensor(m_input.GMPD_BUTTON_13, index);
        var gs_a = m_ctl.create_gamepad_btn_sensor(m_input.GMPD_BUTTON_14, index);
    var key_gamepad_logic = function(s) {
        return s[0] && (s[1] || s[2] || s[3] || s[4] || s[5]);				//el 4 y 5 son gamepad  añadidos						
    }       
    m_ctl.create_sensor_manifold(obj, "FORWARD", m_ctl.CT_CONTINUOUS,
            [elapsed, key_w, key_up, up_arrow, gs_w], key_gamepad_logic, key_gamepad_cb);
    m_ctl.create_sensor_manifold(obj, "BACKWARD", m_ctl.CT_CONTINUOUS,
            [elapsed, key_s, key_down, down_arrow, gs_s], key_gamepad_logic, key_gamepad_cb);
    m_ctl.create_sensor_manifold(obj, "LEFT", m_ctl.CT_CONTINUOUS,
            [elapsed, key_a, key_left, left_arrow, gs_a], key_gamepad_logic, key_gamepad_cb);
    m_ctl.create_sensor_manifold(obj, "RIGHT", m_ctl.CT_CONTINUOUS,
            [elapsed, key_d, key_right, right_arrow, gs_d], key_gamepad_logic, key_gamepad_cb);
} 
 disable_object_controls = function(obj) {
    var obj_std_manifolds = ["FORWARD", "BACKWARD", "LEFT", "RIGHT"];
    for (var i = 0; i < obj_std_manifolds.length; i++)
        m_ctl.remove_sensor_manifold(obj, obj_std_manifolds[i]);
  }
   function kill(vehicle_wrapper) {  
	var vehicle = vehicle_wrapper.empty;
    m_sfx.stop(vehicle_wrapper.walk_speaker);  
   m_sfx.stop(vehicle_wrapper.run_speaker);
   m_sfx.stop(vehicle_wrapper.idle_speaker);
   m_sfx.stop(vehicle_wrapper.starter_speaker);
  m_trans.set_translation_v(vehicle, m_conf.DEFAULT_POS_VEHICLE);	 
	vehicle_wrapper.hp = 100; 	
  }
function switchtps_vehicle(obj,id,pulse)		  {	
var camera=m_scs.get_active_camera();
var char_tmp=m_char.get_wrapper().phys_body;   
var target=null;
var target2=null;	
var empty=null;
var empty2=null;
var vehicle_drive_tmp=null;
var vehicle_drive_tmp2=null;
var quat_tmp=m_quat.create();
var vec3_tmp=m_vec3.create();
  if  (_vehicle_wrapper.vehicle_current=="car")  
	{
	 empty="deportivo01"; 
	target=m_scs.get_object_by_dupli_name(empty,"cam_veh_target");	  
	vehicle_drive_tmp=m_scs.get_object_by_dupli_name(empty,"vehicle_drive");   
	 m_cons.append_stiff(char_tmp, vehicle_drive_tmp, vec3_tmp, quat_tmp);
	m_cons.append_semi_soft(camera, target, m_conf.CAM_OFFSET_VEHICLE, m_conf.CAM_SOFTNESS); 
   }	
   else
  if  (_vehicle_wrapper.vehicle_current=="car2")
  {
	 empty2="deportivo02"; 
	 target2=m_scs.get_object_by_dupli_name(empty2,"cam_veh_target");
     vehicle_drive_tmp2=m_scs.get_object_by_dupli_name(empty2,"vehicle_drive");
	 m_cons.append_stiff(char_tmp, vehicle_drive_tmp2, vec3_tmp, quat_tmp);
	 m_cons.append_semi_soft(camera, target2, m_conf.CAM_OFFSET_VEHICLE, m_conf.CAM_SOFTNESS); 
  }	  
	if (_is_char_htoh)	
      m_anim.apply(m_char.get_wrapper().rig, "sit");  
     else
		m_anim.apply(m_char.get_wrapper().rig, "hunter_sittps");  
	  m_anim.set_behavior(m_char.get_wrapper().rig, m_anim.AB_CYCLIC);  
      m_anim.play(m_char.get_wrapper().rig);	
}  
function switchFPS_vehicle(obj,id,pulse)  {	
var empty_name1="";
var empty_name2="";
var target1=null; 
var target2=null; 
var vehicle_drive_tmp1=null;
var vehicle_drive_tmp2=null;
var char_tmp=m_char.get_wrapper().phys_body;
   if (_is_char_htoh)
		m_anim.apply(m_char.get_wrapper().rig, "sit");  
	else
		m_anim.apply(m_char.get_wrapper().rig, "hunter_sittps");  
 m_anim.set_behavior(m_char.get_wrapper().rig, m_anim.AB_CYCLIC);  
 m_anim.play(m_char.get_wrapper().rig);
var quat_tmp=m_quat.create();
var vec3_tmp=m_vec3.create();
var  u = [0, .15, 0.25];  
var A = m_quat.multiply(m_quat.setAxisAngle([0, 0, 1], Math.PI, m_quat.create()), m_quat.setAxisAngle([1, 0, 0], Math.PI / 2, m_quat.create()), m_quat.create());
var camera=m_scs.get_active_camera();
					m_cons.remove(camera);         
					m_cons.remove(obj) ; 
if ("car"==m_phy.get_vehicle_name(obj))
{
empty_name1="deportivo01";
vehicle_drive_tmp1= m_scs.get_object_by_dupli_name(empty_name1, "vehicle_drive"); 
 target1 = m_scs.get_object_by_dupli_name(empty_name1, "deportivo_chassis"); 
m_cons.append_semi_stiff(camera, target1, u, A, Math.PI / 3, -Math.PI / 3, Math.PI / 12, -Math.PI / 6);		
m_cons.append_stiff(char_tmp, vehicle_drive_tmp1, vec3_tmp, quat_tmp);															
}																			
else 
if ("car2"==m_phy.get_vehicle_name(obj))
{
 empty_name2="deportivo02";
  vehicle_drive_tmp2= m_scs.get_object_by_dupli_name(empty_name2, "vehicle_drive"); 
  target2 = m_scs.get_object_by_dupli_name(empty_name2, "deportivo_chassis"); 
 m_cons.append_semi_stiff(camera, target2, u, A, Math.PI / 3, -Math.PI / 3, Math.PI / 12, -Math.PI / 6);  
 m_cons.append_stiff(char_tmp, vehicle_drive_tmp2, vec3_tmp, quat_tmp); 
}	
console.log("estamos supuestamente en el FPS modo conduciendo el vehiculo por haber pulsado 1 tras pickar un vehicle o boton conducir");
console.log("pero no la hemos configurado aun");
_vista_vehicle_default=3;
}	
exports.setup_view_vehicle_tps_sensor_cb=function(obj) {  
 var sensorkey2 = m_ctl.create_keyboard_sensor(m_ctl.KEY_2);  
  m_ctl.create_sensor_manifold(obj, "THIRD_VIEW_VEHICLE", m_ctl.CT_SHOT, [sensorkey2,_touch_view_tps], 
		function(a) {
            return (a[0] || a[1])     
        },
		switchtps_vehicle);  
}
exports.setup_view_vehicle_FPS_sensor_cb=function(obj) {    
	 var sensorkey1 = m_ctl.create_keyboard_sensor(m_ctl.KEY_1);  
	 m_ctl.create_sensor_manifold(obj, "FIRST_VIEW_VEHICLE", m_ctl.CT_SHOT, [sensorkey1,_touch_view_FPS],
		function(a) {
            return (a[0] || a[1])            
        }, 
		switchFPS_vehicle);	 
}
exports.reset = function() {  
    for (var i = 0; i < _vehicles_wrappers.length; i++) {          
        var gw = _vehicles_wrappers[i];
        set_state(gw, m_conf.VS_NONE)
        var vehicle = gw.body; 
        m_trans.set_translation_v(vehicle, _level_conf.DEFAULT_POS_VEHICLE);   
        m_sfx.stop(gw.idle_speaker); 
		m_sfx.stop(gw.walk_speaker);
		m_sfx.stop(gw.run_speaker);
		m_sfx.stop(gw.starter_speaker);
    }
}
exports.get_wrapper=function() {
		return _vehicle_wrapper;  
}		
exports.get_wrappers = function() { 
    return _vehicles_wrappers;
}
})	