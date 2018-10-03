if (b4w.module_check("boat"))
    throw "Failed to register module: boat";
b4w.register("boat", function(exports, require) {
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
var _vehicle_wrapper=null;  
var _vehicles_wrappers = [];     
var _solicitar_conducir=2;  
var _vista_vehicle_default=1;  
var _is_char_htoh=true;   
exports.init= function(elapsed_sensor, is_char_htoh) {          
  var empty_name;
  for (var i = 0; i < m_conf.AIRPLANES_EMPTIES.length; i++) {  
		 empty_name=m_conf.BOATS_EMPTIES[i];		
		var vehicle_empty = m_scs.get_object_by_name(empty_name);  
        var vehicle = m_scs.get_object_by_dupli_name(empty_name, "boat_chassis");  
         _vehicle_wrapper = init_wrapper(vehicle, vehicle_empty, is_char_htoh); 		
		_is_char_htoh=_vehicle_wrapper.is_char_htoh;						
        m_ctl.create_sensor_manifold(_vehicle_wrapper, "BOAT", m_ctl.CT_CONTINUOUS,     
                                     [elapsed_sensor], null, vehicle_ai_cb);    
        _vehicles_wrappers.push(_vehicle_wrapper);   
	}
}
function init_wrapper(body, empty, camera_target, is_char_htoh) {   
    return {
        body: body,    
        hp: m_conf.BOAT_HP,    
        state: m_conf.BOAT_NONE,                      
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
   case m_conf.BOAT_CRUISE:
        var elapsed = m_ctl.get_sensor_value(obj, id, 0);
        break;
		case m_conf.BOAT_IDLE:            
        var elapsed = m_ctl.get_sensor_value(obj, id, 0);
        break;
		case m_conf.BOAT_NONE:
        var elapsed = m_ctl.get_sensor_value(obj, id, 0);
        break;
   default:
        break;
    }
}
function set_state(vehicle_wrapper, state) {   
    switch (state) {
    case m_conf.BOATS_WALKING:  
	       if (vehicle_wrapper.state == m_conf.VS_WALKING)
               set_state(vehicle_wrapper, m_conf.VS_RUN);
        break;
     case m_conf.BOATS_RUN:
	       if (vehicle_wrapper.state == m_conf.VS_WALKING)
               set_state(vehicle_wrapper, m_conf.VS_RUN);
	  break;
     case m_conf.BOATS_IDLE:
	       if (vehicle_wrapper.state == m_conf.VS_NONE)
               set_state(vehicle_wrapper, m_conf.VS_IDLE);
	  break;
      case m_conf.BOATS_NONE:
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
    if(m_char.detect_mobile()) {
        m_touch_controls.setup_touch_controls(right_arrow, up_arrow, left_arrow, down_arrow);  
    }
	enable_object_controls(obj, null, up_arrow, down_arrow, right_arrow, left_arrow);  
   m_gp_conf.update();
   _vehicle_wrapper.state=m_conf.VS_WALKING;
} 
/
 disable_object_controls = function(obj) {
    var obj_std_manifolds = ["FORWARD", "BACKWARD", "LEFT", "RIGHT"];
    for (var i = 0; i < obj_std_manifolds.length; i++)
        m_ctl.remove_sensor_manifold(obj, obj_std_manifolds[i]);
  }
   function kill(vehicle_wrapper) {  
	var vehicle = vehicle_wrapper.empty;
  m_trans.set_translation_v(vehicle, m_conf.DEFAULT_POS_BOATS);	 
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
  m_ctl.create_sensor_manifold(obj, "THIRD_VIEW_VEHICLE", m_ctl.CT_SHOT, [sensorkey2], 
		function(a) {
            return a[0]     
        },
		switchtps_vehicle);  
}
exports.setup_view_vehicle_FPS_sensor_cb=function(obj) {    
	 var sensorkey1 = m_ctl.create_keyboard_sensor(m_ctl.KEY_1);  
	 m_ctl.create_sensor_manifold(obj, "FIRST_VIEW_VEHICLE", m_ctl.CT_SHOT, [sensorkey1],
		function(a) {
            return a[0]            
        }, 
		switchFPS_vehicle);	 
}
exports.reset = function() {  
    for (var i = 0; i < _vehicle_wrapper.length; i++) {          
        var gw = _vehicle_wrapper[i];
        set_state(gw, m_conf.VS_NONE)
        var vehicle = gw.empty;
        m_trans.set_translation_v(vehicle, m_conf.DEFAULT_POS_VEHICLE);
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