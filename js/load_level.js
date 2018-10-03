if (b4w.module_check("load_level"))
    throw "Failed to register module: load_level";
b4w.register("load_level", function(exports, require) {
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
var m_main = require("main");
var m_aliens = require("aliens");
var m_options_anims= require("options_2_anims");  
var m_resources= require("resources");  
var m_animals= require("animals");    
var m_canon = require("canon");    
var m_pick_objs = require("pick_objs");  
var m_picked_objs = require("picked_objs");  
var m_npc_ai = require("npc_ai");   
var m_asteroids= require("asteroids");   
var m_interface = require("interface2");  
var m_trex = require("trex");   
var m_env = require("environment");		 
var m_main_menu= require("main_menu");  
var m_conf     = require("game_config");  
var m_open_doors = require("open_doors");
var m_char     = require("character2");    
var m_interface = require("interface2");   
var m_vehicle     = require("vehicles");    
var m_view 		= require("control_view");  
var m_change_char =require("change_character");
var _fondo_options=null;  
var _boton_salir_select_avatar=null;
var _pos_avatar1 = new Float32Array(3);
var _pos_avatar2 = new Float32Array(3);
var _pos_avatar3 = new Float32Array(3);
var _pos_avatar4 = new Float32Array(3);  
var _hunter_body=null;   
var _phys_body=null;  
var _helmet=null;
var _head_hunter=null;
var _visor=null;
var _mascara_gas=null;
var _linterna=null;
var _alien_empty=null;   
var _trex_empty= null;
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
var _current_avatar="";
var _data_id=0;
var _level_conf=null;   
var _canvas_elem = null;
var _data_id_fps=[];   
var _control_data_id=[]; 	
exports.load_cb=load_cb;		
function load_cb(data_id, level_name, preloader_cb, intro_lodad_cb, load_level,is_char_htoh,index,length){     
_control_data_id[0]=data_id; 
_is_char_htoh=is_char_htoh;
_canvas_elem= m_cont.get_container();		
var camera=m_scs.get_active_camera();											
var elapsed_sensor = m_ctl.create_elapsed_sensor();  		
 _elapsed_sensor=elapsed_sensor;
    if (level_name == "level01" || level_name == "level02")        
		_level_conf = require(level_name + "_config");  
	 m_resources.init(_elapsed_sensor,_canvas_elem);    
	m_vehicle.init(_elapsed_sensor, _is_char_htoh, data_id,_level_conf); 
} 
exports.load1_cb=load1_cb;
function load1_cb(data_id, level_name, preloader_cb, intro_lodad_cb, load_level,is_char_htoh,index,length) {
	_control_data_id[1]=data_id;	
}
exports.load2_cb=load2_cb;
function load2_cb(data_id, level_name, preloader_cb, intro_lodad_cb, load_level,is_char_htoh,index,length,current_char,is_main_menu) {  
	_control_data_id[2]=data_id;
	var camera = m_scs.get_active_camera();
	var empty_name_shot= m_conf.CHAR_SHOT_EMPTIES[index];	
    m_open_doors.precache_doors(_control_data_id[0]); 	    
    m_char.init_wrapper(_is_char_htoh,_level_conf,_control_data_id[2],index,length,_control_data_id[1],_control_data_id[0],current_char,is_main_menu);
	m_char.get_wrapper().level=level_name;
	m_char.precache_weapons(_is_char_htoh,_control_data_id[2],index,length);  
	m_view.init_control_view();   
	m_view.get_wrapper().data_id=_control_data_id[2];  
	m_view.get_wrapper().char_collider=m_scs.get_object_by_dupli_name(empty_name_shot,"hunter_collider",_control_data_id[2]);		
	m_view.get_wrapper().level=level_name;
	m_view.get_wrapper().index=index;
	m_view.get_wrapper().length=length;
	m_view.get_wrapper().is_char_htoh=_is_char_htoh;
	m_view.get_wrapper().elapsed_sensor=_elapsed_sensor;
    m_options_anims.init(_is_char_htoh);  
m_interface.init(cleanup_game,_elapsed_sensor,load_cb, m_main_menu.preloader_cb,null,"",null, m_change_char.menu_change_avatar_cb);   
setup_music(_control_data_id[0]);  
 m_view.eye_camera(camera,_is_char_htoh,_elapsed_sensor,null,null,_control_data_id[2],index,length);  
m_view.control_camera_cb(camera,_is_char_htoh,_elapsed_sensor,null,null,_control_data_id[2],index,length);  	
        m_pick_objs.init(_elapsed_sensor, _is_char_htoh,null,_control_data_id[2]);
		m_picked_objs.init(_elapsed_sensor, _is_char_htoh,null, _control_data_id[2]); 
	m_interface.show_points_element(0);  
	m_interface.show_life_bar_element(0);  
if (m_main.detect_mobile()) {  
 var controls_elem = document.getElementById("controls");   
 m_interface.show_elem(controls_elem);
}	
	m_asteroids.init();	
if (level_name=="level02")									
m_env.setup_lava(_elapsed_sensor);   
}  
function cleanup_game(elapsed_sensor,data_id) {   
  document.getElementById("main_canvas_container").style.opacity = 1; 
    m_ctl.remove_sensor_manifold(null, "PLAYLIST");
    m_char.reset();
if (m_trex.get_wrappers())
	m_trex.reset();
if (m_aliens.get_wrappers())
	m_aliens.reset();
if (m_asteroids.get_wrapper())
	m_asteroids.reset();
if (m_canon.get_wrappers())
	m_canon.reset();
    m_picked_objs.reset();
    m_char.setup_controls(elapsed_sensor);  
var level_name=m_char.get_wrapper().level;
if (level_name == "level02")	
    m_env.setup_lava(elapsed_sensor);
    m_vehicle.reset();  
    m_interface.update_hp_bar(100);
	m_char.get_wrapper().premi=0;
	m_interface.update_premi_text(m_char.get_wrapper().premi);
   setup_music(data_id);
}
exports.setup_music=setup_music;   
function setup_music(data_id) {  
    var intro_spk = m_scs.get_object_by_dupli_name("enviroment", m_conf.MUSIC_INTRO_SPEAKER, data_id);
    var end_spk = m_scs.get_object_by_dupli_name("enviroment", m_conf.MUSIC_END_SPEAKER, data_id);   
    var intro_duration = m_sfx.get_duration(intro_spk) * m_sfx.get_playrate(intro_spk);
    var playlist_cb = function(obj, id, pulse){
        m_ctl.remove_sensor_manifold(null, "PLAYLIST");
        if (m_char.get_wrapper())             
			if (m_char.get_wrapper().hp <= 0)                 
            return;										
        var playlist_objs = [];
		 var playlist_objs2 = [];
        var speakers = m_conf.MUSIC_SPEAKERS;  
		 var speakers2 = m_conf.MUSIC_SPEAKERS2;  
        for (var i = 0; i < speakers.length; i++) {
            var spk_name = speakers[i];
            var spk = m_scs.get_object_by_dupli_name("enviroment", spk_name, data_id);
            playlist_objs.push(spk);
        }
		 for (var i = 0; i < speakers2.length; i++) {
            var spk_name2 = speakers2[i];
            var spk2 = m_scs.get_object_by_dupli_name("enviroment", spk_name2, data_id);
            playlist_objs2.push(spk2);
        }
	  m_sfx.apply_playlist(playlist_objs, 6, true);  
     m_sfx.apply_playlist(playlist_objs2,6, true);  
	}
	  m_ctl.create_sensor_manifold(null, "PLAYLIST", m_ctl.CT_SHOT,              
        [m_ctl.create_timer_sensor(intro_duration)], null, playlist_cb);
 }
})