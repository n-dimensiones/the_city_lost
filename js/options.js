if (b4w.module_check("options"))
    throw "Failed to register module: options";
b4w.register("options", function(exports, require) {
var m_anim  = require("animation");
var m_app   = require("app");
var m_cfg   = require("config");
var m_main  = require("main");
var m_data  = require("data");
var m_cont  = require("container");
var m_ctl   = require("controls");
var m_phy   = require("physics");
var m_cons  = require("constraints");
var m_input = require("input");
var m_scs   = require("scenes");
var m_trans = require("transform");
var m_print = require("print");
var m_debug = require("debug");
var m_screen	  = require("screen");
var m_obj       = require("objects");
var m_mouse     = require("mouse");
var m_math      = require("math");
var m_camera = require("camera");
var m_quat 		= require("quat");
var m_util = require("util");
var m_vec3  = require("vec3");
var m_sfx   = require("sfx");   
var m_conf = require("game_config");  
var m_game_main = require("game_main");  
var m_char = require("character2");
var m_combat = require("combat");
var m_bonuses = require("bonuses");
var m_interface = require("interface2");
//var m_golems = require("golems");
var m_aliens = require("aliens");
var m_obelisks = require("obelisks");
//var m_gems = require("gems");
var m_env = require("environment");		
var m_view =require("control_view");		
var m_vehicle= require("vehicles");	
var m_animals= require("animals");
var m_resources= require("resources");  
var _controls_container_cms=null;
var _option_wrapper= null;  
exports.init= function(elapsed_sensor) {  
	 _option_wrapper = {		
        view_no_static:     1         
		 }	
	var controls_container_cms2 = document.createElement("div"); 			
    var controls_container_cms = document.createElement("div");     
    controls_container_cms.id = "controls_container_cms";         
	controls_container_cms2.id = "controls_container_cms2"; 
            controls_container_cms.style.zIndex = 2;  
			document.getElementById("control_main_menu").style.zIndex = 0;
	_controls_container_cms=controls_container_cms;  
	var reset_b = create_button("OPEN OPTIONS");
    reset_b.onclick = open_options_action;
    controls_container_cms.appendChild(reset_b);
	var close_b = create_button("CLOSE OPTIONS");
    close_b.onclick = close_options_action;
    controls_container_cms.appendChild(close_b);
	var full_screen_b = create_button("FULL SCREEN");
    full_screen_b.onclick = full_screen_action;
    controls_container_cms.appendChild(full_screen_b);
	var exit_full_screen_b = create_button("EXIT FULL SCREEN");
    exit_full_screen_b.onclick = exit_full_screen_action;
    controls_container_cms.appendChild(exit_full_screen_b);
	var activar_FPS_view_b = create_button("ACTIVAR FPS VIEW");
    activar_FPS_view_b.onclick = activar_FPS_view_action;
    controls_container_cms.appendChild(activar_FPS_view_b);
	var activar_tps_view_b = create_button("ACTIVAR TPS VIEW");
    activar_tps_view_b.onclick = activar_tps_view_action;
    controls_container_cms.appendChild(activar_tps_view_b);
	var volver_eye_view_b = create_button("VOLVER EYE VIEW");
    volver_eye_view_b.onclick = volver_eye_view_action;
    controls_container_cms.appendChild(volver_eye_view_b);
	var activar_FLY_b = create_button("ACTIVAR FLY");
    activar_FLY_b.onclick = activar_FLY_action;
    controls_container_cms.appendChild(activar_FLY_b);
	var desactivar_FLY_b = create_button("DESACTIVAR FLY");
    desactivar_FLY_b.onclick = desactivar_FLY_action;
    controls_container_cms.appendChild(desactivar_FLY_b);
	var conducir_b = create_button("DEJAR DE CONDUCIR VEHICULO");
    conducir_b.onclick = conducir_action;
    controls_container_cms.appendChild(conducir_b);
	var sacar_animals_b = create_button("SACAR ANIMALES");
    sacar_animals_b.onclick = sacar_animals_action;
    controls_container_cms.appendChild(sacar_animals_b);
	var scene_anims_options_b = create_button("SCENE ANIMS OPTIONS");
    scene_anims_options_b.onclick = scene_anims_options_action;
    controls_container_cms.appendChild(scene_anims_options_b);
	var scene_classic_options_b = create_button("SCENE CLASSIC OPTIONS");
    scene_classic_options_b.onclick = scene_classic_options_action;
    controls_container_cms.appendChild(scene_classic_options_b);
	var exit_main_menu_b = create_button("EXIT MAIN MENU");
    exit_main_menu_b.onclick = exit_main_menu_action;
    controls_container_cms.appendChild(exit_main_menu_b);
	var main_menu_b = create_button("MAIN MENU");
    main_menu_b.onclick = main_menu_action;
    controls_container_cms2.appendChild(main_menu_b);
    document.body.appendChild(controls_container_cms);	
	 document.body.appendChild(controls_container_cms2);
}
function create_button(caption) {
    var button = document.createElement("div");
    button.className = "button_container";
    var label = document.createElement("label");
    label.className = "text";
    label.textContent = caption;
    button.appendChild(label);
    return button;
}
function main_menu_action() {
document.getElementById("controls_container_cms").style.zIndex = 2; 
}
function exit_main_menu_action() {
_controls_container_cms.style.zIndex=0;
document.getElementById("control_main_menu").style.zIndex = 2;
}
function open_options_action() {
 m_resources.get_container().style.zIndex = 2;
m_resources.get_container().style.visibility = "visible";
 console.log("se ha ejecutado boton open options"); 
 }
function close_options_action() {    
 var elapsed_sensor = m_ctl.create_elapsed_sensor();  
  m_resources.get_container().style.zIndex = 0;
  m_resources.get_container().style.visibility = "hidden";
  console.log("se ha ejecutado boton close options y se supone se ha hecho un load_cb y puesto antes _resources a 1"); 
   m_aliens.init(elapsed_sensor,m_resources.get_alien_empty(),m_resources.get_alien_data_id());  
   m_aliens.init_spawn(elapsed_sensor); 
}
function full_screen_action() {   
	m_screen.request_fullscreen(main_canvas_container, null, null);
	}
function exit_full_screen_action() {   
		m_screen.exit_fullscreen();		
	}
function scene_classic_options_action() {	
	 m_data.load(m_conf.ASSETS_PATH + "setup_options.json", loaded_classic_options_cb, null, false, true); 	
}
function loaded_classic_options_cb(data_id)			 {
var	fondo_options=m_scs.get_object_by_name("Plane.001",1);	
	if (m_obj.is_mesh(fondo_options))
		{
		 m_scs.show_object(fondo_options);	
		}
		setup_static_view();
} 
function setup_static_view() {   
			m_ctl.remove_sensor_manifold(m_char.get_wrapper().phys_body);
			m_cons.remove(m_char.get_wrapper().phys_body);
			m_phy.set_character_move_dir(m_char.get_wrapper().phys_body, 0, 0);
			m_char.disable_controls();  
			m_phy.disable_simulation(m_char.get_wrapper().phys_body);
		var camobjtarget = m_scs.get_active_camera();
    	m_cons.remove(camobjtarget);         
		m_app.enable_camera_controls(false, false, true,main_canvas_container); 
		_option_wrapper.view_no_static=0; 
		m_mouse.exit_pointerlock();
		m_camera.static_setup(camobjtarget, { pos: m_conf.STATIC_POS, look_at: m_conf.STATIC_LOOK_AT });
		m_camera.correct_up(camobjtarget, m_util.AXIS_MZ, true);   
}
function scene_anims_options_action() {
			 m_data.load(m_conf.ASSETS_PATH + "setup_options.json", loaded_anims_options_cb, null, false, true);		
}	
function loaded_anims_options_cb(data_id)			 {
   var	fondo_options=m_scs.get_object_by_name("Plane.001",data_id);	
   console.log("el data_id podria ser el 1 si es la primera json cargad y es:"+data_id)
	if (m_obj.is_mesh(fondo_options))
		{
		 m_scs.show_object(fondo_options);
		}
		m_view.setup_target_view();
} 
function activar_FPS_view_action() {
					var camera=m_scs.get_active_camera();
				    m_cons.remove(camera)         
					m_app.enable_camera_controls(false, false, true,main_canvas_container); 
					m_phy.set_character_move_type(m_char.get_wrapper().phys_body, m_phy.CM_WALK); 	
					console.log("se supone he pulsado FPS desde boton");
	}
function activar_tps_view_action() {   
 var elapsed_sensor = m_ctl.create_elapsed_sensor();  
					m_char.get_wrapper().state = m_conf.CH_STILL;   
					m_phy.set_character_move_dir(m_char.get_wrapper().phys_body, 0, 0);
					var camera=m_scs.get_active_camera();
					m_cons.remove(camera);   
					m_cons.remove(m_char.get_wrapper().phys_body);	
					m_app.disable_camera_controls(); 
					m_view.setup_camera(m_char.get_wrapper().phys_body);     
					m_phy.set_character_move_type(m_char.get_wrapper().phys_body, m_phy.CM_WALK);   				
     if ((m_vehicle.get_wrapper().state==m_conf.VS_WALKING)||(m_vehicle.get_wrapper().state==m_conf.VS_IDLE))
	 {
		 m_vehicle.disable_controls(m_vehicle.get_wrapper().body);					
		m_game_main.load_obj_cb(m_char.get_wrapper().phys_body, m_char.get_wrapper().is_char_htoh_value, elapsed_sensor);
	 }	
}	
function activar_FLY_action() {   
    var _fly=1;
	m_phy.set_character_move_type(m_char.get_wrapper().phys_body, m_phy.CM_FLY);
	m_char.get_wrapper().reset;
	}
function desactivar_FLY_action() {   
     var _fly=0;
	m_phy.set_character_move_type(m_char.get_wrapper().phys_body, m_phy.CM_WALK);
	}
function volver_eye_view_action() {	
  var elapsed_sensor = m_ctl.create_elapsed_sensor();  
  var EYE_POS_act = new Float32Array(3);
	m_trans.get_translation(m_char.get_wrapper().phys_body,EYE_POS_act);
 var camera = m_scs.get_active_camera(); 
  m_camera.eye_setup(camera, { pos: EYE_POS_act, look_at: m_conf.EYE_LOOK_AT});  
    m_camera.rotate_camera(camera, 0, -Math.PI/16, true, true);  
m_game_main.load_obj_cb(m_char.get_wrapper().phys_body, m_char.get_wrapper().is_char_htoh_value, elapsed_sensor);   
}
function sacar_animals_action() {   
	m_animals.init();	
	}		
function conducir_action() {   
    var elapsed_sensor = m_ctl.create_elapsed_sensor();  
    m_vehicle._solicitar_conducir=1;  
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().phys_body);
	m_cons.remove(m_char.get_wrapper().phys_body);
	m_phy.set_character_move_dir(m_char.get_wrapper().phys_body, 0, 0);
	m_char.disable_controls();  
    m_phy.disable_simulation(m_char.get_wrapper().phys_body);
	var empty="deportivo01";  
	var chassis=m_scs.get_object_by_dupli_name(empty,"deportivo_chassis");  
	m_vehicle.disable_controls(chassis);
 	m_game_main.load_obj_cb(m_char.get_wrapper().phys_body, m_char.get_wrapper().is_char_htoh_value, elapsed_sensor);   
	}
exports.get_wrapper=function() {
return _option_wrapper;   
}	
})	