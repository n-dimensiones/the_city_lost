"use strict"
if (b4w.module_check("character2"))
    throw "Failed to register module: character";
b4w.register("character2", function(exports, require) {
var m_ctl = require("controls");
var m_scs = require("scenes");
var m_time  = require("time");
var m_phy = require("physics");
var m_anim = require("animation");
var m_sfx = require("sfx");
var m_trans = require("transform");
var m_util  = require("util");
var m_vec3  = require("vec3");
var m_armat   = require("armature"); 
var m_quat  = require("quat");
var m_tsr   = require("tsr");
var m_cons  = require("constraints");
var m_print = require("print");
var m_cont      = require("container");
var m_gp_conf   = require("gp_conf");
var m_input = require("input");  
var m_app = require("app");  
var m_mouse = require("mouse");
var m_main = require("main");							
var m_camera = require("camera");	
var m_mat =  require("material");  
var m_resources= require("resources"); 
var m_canon = require("canon");								
var m_options= require("options");
var m_conf = require("game_config");
var m_view	= require("control_view");
var m_combat = require("combat");
var m_touch_controls= require("touch_controls");
var m_interface = require("interface2");
var m_bonuses = require("bonuses");
var m_env = require("environment");
var m_asteroids= require("asteroids");
var m_weapons = require("weapons");	
var m_open_doors = require("open_doors");
var _char_wrappers=[];
var _char_wrapper = null;   
var _time_ultim_change_premi=0;
var _weapons= [];   
var _weapons_inactives= [];
var _char_attack_done = false;  
var	 _is_aim_mode = false;  
var _burst_fire_sensor = m_ctl.create_custom_sensor(0);  
var _time=0;  
var _time_ultim_change_premi=0;
var _last_mousewheel_time=0;
var _ultimocurrentweapon=0;
var  _penultimweapon=0;
var _burst_time=0;  
var _last_shoot_time = 0; 
var _frame=0; 
var _explosion_barrel_spk=null;   
var _char_death_spk=null;    
var _underwater_spk=null;    
var _inhale_out_water_spk=null;   
var _char_run_spk = null;
var _char_attack_sword_spk = null;  
var _char_sword_hit_spk = null;   
var _char_land_spk = null;  
var _gem_pickup_spk = null;  
var _char_jump_spks = null;  
var _char_voice_attack_spks = null;   
var _char_hurt_spks = null;  
var _intro_spk = null;  
var _end_spk = null;   
var _ambience_water_spk= null;  
var _last_hurt_sound = -100;    
var _vec3_tmp_2 = new Float32Array(3);
var _vec3_tmp_3 = new Float32Array(3);
var _vec3_tmp1 = new Float32Array(3);  
var _quat4_tmp = new Float32Array(4);  
var _quat_tmp0 = new Float32Array(4);  
var _vec3_tmp = m_vec3.create();  
var _vec2_tmp = new Float32Array(2);  
var _vec2_tmp2 = new Float32Array(2);  
var _quat_tmp2 = m_quat.create();   
var _tsr_tmp = m_tsr.create();  
var _quat_tmp = m_quat.create();  
var _vec3_tmp2 = m_vec3.create(); 
var _obj_wall_right_hit=null;
var	_wall_right_hit_pos=0;
var _obj_wall_left_hit=null;
var	_wall_left_hit_pos=0;
var _obj_wall_front_hit=null;
var	_wall_front_hit_pos=0;
var _En_agua=0;  
var _rotation_cb = null;
var _giro_mouse = true;  
var	_level_conf=null;    
var _is_char_htoh=true;	 
var _data_id=0;  
var _view_sensor_tps=null;  
var _view_sensor_fps=null;
var STEP = 1.5;
var AXIS_THRESHOLD = 0.1;  
var ANIM_SPEED = 3.5;
exports.init_wrapper = function(is_char_htoh,level_conf, data_id,index,length,data_id_fps, data_main_id,current_char,is_main_menu) { 		
	 _level_conf=level_conf;
	_is_char_htoh=is_char_htoh;    	
	_data_id=data_id;  
	var empty_name_chars="";  
	var empty_name_shot="";  
	var empty_name_htoh="";  
	function init_char_htoh(data_id,empty_name_htoh,data_id_fps){
	 return {	      		
		empty_name:  empty_name_htoh,
 		phys_body:    m_scs.get_object_by_dupli_name(empty_name_htoh, "character_collider",data_id),      
		rig:    m_scs.get_object_by_dupli_name(empty_name_htoh, "greek_rig",data_id),
        body:   m_scs.get_object_by_dupli_name(empty_name_htoh, "greek_body",data_id),		
        picker: m_scs.get_object_by_dupli_name(empty_name_htoh, "character_picker",data_id),  
		camera_target: m_scs.get_object_by_dupli_name(empty_name_htoh, "camera_target",data_id), 
		shield: m_scs.get_object_by_dupli_name(empty_name_htoh, "greek_shield",data_id), 
		helmet: m_scs.get_object_by_dupli_name(empty_name_htoh, "greek_helmet",data_id), 	
       hp:    m_conf.MAX_CHAR_HP,   
        state: m_conf.CH_STILL,   
		en_agua:  false,	
		reset_stat: 0,  
	     newlevel_stat: 1,  
		gaming_stat:0 , 
	    pos_default: _level_conf.CHAR_DEF_POS,
		 is_char_htoh_value: true, 
		 is_current_avatar: false,  
		vehicle_current: null,		
	index: index,   
	length: length,    
	 knife_tps:  m_scs.get_object_by_dupli_name(empty_name_htoh, "greek_sword_hand",data_id),
	  knife_tps_inactive:  m_scs.get_object_by_dupli_name(empty_name_htoh, "greek_sword_funda",data_id),
	  weapon_current: m_conf.CHAR_CURRENT_HUNTER_WEAPON,
	  current_weapon_sensor: m_ctl.create_custom_sensor(0),  
	  knife_tps_sensor: m_ctl.create_custom_sensor(0),
	  knife_fps_sensor: m_ctl.create_custom_sensor(0),
	weapons_list: m_conf.CHAR_HUNTER_WEAPONS,
	weapons_inactives_list: m_conf.CHAR_HUNTER_WEAPONS_INACTIVES,
     gem_slot: null,    
     island: -1,
	 lava_sens: null,
    sensor_collision_target_camera_wall : null,
	offset_cam: m_conf.CAM_OFFSET,
	char_run_spk: m_scs.get_object_by_dupli_name(empty_name_htoh, m_conf.CHAR_RUN_SPEAKER, data_id),
	char_death_spk: m_scs.get_object_by_dupli_name(empty_name_htoh, m_conf.CHAR_DEATH_SPEAKER, data_id),
	intro_spk: _intro_spk,
	end_spk: _end_spk,
	ambience_water_spk: _ambience_water_spk,
	char_attack_sword_spk: m_scs.get_object_by_dupli_name(empty_name_htoh, m_conf.CHAR_ATTACK_SWORD_SPEAKER, data_id),   
   char_sword_hit_spk: m_scs.get_object_by_dupli_name(empty_name_htoh, m_conf.CHAR_SWORD_HIT_SPEAKER, data_id), 
   char_jump_spks: m_scs.get_object_by_dupli_name(empty_name_htoh, m_conf.CHAR_JUMP_SPKS, data_id),
   char_voice_attack_spks: m_scs.get_object_by_dupli_name(empty_name_htoh, m_conf.CHAR_ATTACK_VOICE_SPKS, data_id),	
	char_hurt_spks: m_scs.get_object_by_dupli_name(empty_name_htoh,m_conf.CHAR_HURT_SPKS, data_id),
   char_land_spk: m_scs.get_object_by_dupli_name(empty_name_htoh, m_conf.CHAR_LANDING_SPEAKER, data_id),
   gem_pickup_spk: m_scs.get_object_by_dupli_name(empty_name_htoh, m_conf.GEM_PICKUP_SPEAKER, data_id),
   underwater_spk: m_scs.get_object_by_dupli_name(empty_name_htoh, m_conf.CHAR_UNDERWATER, data_id),
   inhale_out_water_spk: m_scs.get_object_by_dupli_name(empty_name_htoh, m_conf.CHAR_INHALE_OUT_WATER, data_id)	
		}  
	}
  function  init_char_shot(data_id,empty_name_shot,data_id_fps, empty_name_shotfps, data_main_id){   
	return {
		empty_name_fps: empty_name_shotfps,
		laser_arm_fps: m_scs.get_object_by_dupli_name(empty_name_shotfps, "hunter_fps_rig",data_id_fps),		
		sleeves:   m_scs.get_object_by_dupli_name(empty_name_shotfps, "sleeves",data_id_fps), 		
		body_fps:   m_scs.get_object_by_dupli_name(empty_name_shotfps, "hunter_fps_body",data_id_fps), 		
		 knife_fps:  m_scs.get_object_by_dupli_name(empty_name_shotfps, "knife_fps",data_id_fps),
		pistol_fps:     m_scs.get_object_by_dupli_name(empty_name_shotfps, "pistol_fps",data_id_fps),
		gun_laser_fps:     m_scs.get_object_by_dupli_name(empty_name_shotfps, "gun_laser_fps",data_id_fps),
		laser_fps:     m_scs.get_object_by_dupli_name(empty_name_shotfps, "laser_fps",data_id_fps),
		gun_laser_empty: m_scs.get_object_by_name(empty_name_shotfps,data_id_fps), 
	 mira_telescopica:      m_scs.get_object_by_dupli_name(empty_name_shotfps, "mira_telescopica",data_id_fps),
	 gun_fps:   m_scs.get_object_by_dupli_name(empty_name_shotfps, "gun_fps", data_id_fps),		
     smokeleftfps:     m_scs.get_object_by_dupli_name(empty_name_shotfps, "emi_smoke_left",data_id_fps),
     smokerightfps:     m_scs.get_object_by_dupli_name(empty_name_shotfps, "emi_smoke_right",data_id_fps),
     smokefrontfps:     m_scs.get_object_by_dupli_name(empty_name_shotfps, "emi_smoke_front",data_id_fps),
     shotfirefps:     m_scs.get_object_by_dupli_name(empty_name_shotfps, "emi_fire",data_id_fps),	
		char_attack_gun_shotfpsspk: m_scs.get_object_by_dupli_name(empty_name_shotfps,m_conf.CHAR_ATTACK_GUN_FPS_SPEAKER,data_id_fps), 
	char_attack_pistol_shotfpsspk: m_scs.get_object_by_dupli_name(empty_name_shotfps, m_conf.CHAR_ATTACK_PISTOL_FPS_SPEAKER, data_id_fps),   
	char_attack_gun_laser_shotfpsspk: m_scs.get_object_by_dupli_name(empty_name_shotfps,m_conf.CHAR_ATTACK_GUN_LASER_FPS_SPEAKER,data_id_fps),
		empty_name: empty_name_shot,               
		phys_body:    m_scs.get_object_by_dupli_name(empty_name_shot, "hunter_collider",data_id),    
        rig:    m_scs.get_object_by_dupli_name(empty_name_shot, "hunter_rig",data_id),  
		body:   m_scs.get_object_by_dupli_name(empty_name_shot, "hunter_body",data_id), 
		helmet:   m_scs.get_object_by_dupli_name(empty_name_shot, "helmet",data_id), 
		head_hunter:   m_scs.get_object_by_dupli_name(empty_name_shot, "head_hunter",data_id), 
		visor:   m_scs.get_object_by_dupli_name(empty_name_shot, "visor2",data_id), 
		mascara_gas:   m_scs.get_object_by_dupli_name(empty_name_shot, "mascara_gas",data_id), 
		linterna:   m_scs.get_object_by_dupli_name(empty_name_shot, "linterna_helmet",data_id), 
        picker: m_scs.get_object_by_dupli_name(empty_name_shot, "character_picker",data_id), 
		camera_target: m_scs.get_object_by_dupli_name(empty_name_shot, "camera_target",data_id), 		
		crossh_empty:    m_scs.get_object_by_dupli_name(empty_name_shot, "crossh_empty",data_id),    
		empty_fps: m_scs.get_object_by_name("empty_fps",data_main_id),        
		cam_crossh_empty: m_scs.get_object_by_name("cam_crossh_empty",data_main_id),	   
        crosshair_obj: m_scs.get_object_by_dupli_name("crosshair_empty", "crosshair",data_main_id),  
        crosshair_base_obj: m_scs.get_object_by_dupli_name("crosshair_empty", "crosshair_base",data_main_id),	
		reset_stat: 0,  
		newlevel_stat: 1,  
		gaming_stat:0,  
		pos_default: _level_conf.CHAR_DEF_POS,
		current_char: current_char,
		is_main_menu: is_main_menu,
		hp:    m_conf.MAX_CHAR_HP,
		premi:   0,             
        state: m_conf.CH_STILL,   	 
		move_state: {forw_back:0, left_right:0},			
		en_agua: false,   
		vehicle_current: "deportivo01*deportivo_chassis"||"deportivo02*deportivo_chassis",	
		is_char_htoh_value: false,
		is_current_avatar: false,  
		  level: "level02",  
		  data_main_id: data_main_id,
		 weapon_current: m_conf.CHAR_CURRENT_HUNTER_WEAPON,   
	     weapon_penultim: m_conf.CHAR_PENULTIM_HUNTER_WEAPON,
		 weapons_list: m_conf.CHAR_HUNTER_WEAPONS,   
	     weapons_inactives_list: m_conf.CHAR_HUNTER_WEAPONS_INACTIVES,		
	 knife_tps:  m_scs.get_object_by_dupli_name(empty_name_shot, "knife_tps",data_id),
	 knife_tps_inactive:  m_scs.get_object_by_dupli_name(empty_name_shot, "knife_tps_funda",data_id),		
	 pistol_tps:     m_scs.get_object_by_dupli_name(empty_name_shot, "pistol_tps",data_id),		
	pistol_tps_inactive:     m_scs.get_object_by_dupli_name(empty_name_shot, "pistol_tps_funda",data_id),
	gun_laser_tps:     m_scs.get_object_by_dupli_name(empty_name_shot, "gun_laser_tps",data_id),
	laser_tps:     m_scs.get_object_by_dupli_name(empty_name_shot, "laser_tps",data_id),
	gun_tps:      m_scs.get_object_by_dupli_name(empty_name_shot, "gun_tps",data_id),
	 gun_tps_inactive:      m_scs.get_object_by_dupli_name(empty_name_shot, "gun_tps_torax",data_id),
		emitter_1:     m_scs.get_object_by_dupli_name(empty_name_shot, "smoke1",data_id),
		emitter_2:     m_scs.get_object_by_dupli_name(empty_name_shot, "smoke2",data_id),
		emitter_3:     m_scs.get_object_by_dupli_name(empty_name_shot, "smoke3",data_id),
		emitter_4:     m_scs.get_object_by_dupli_name(empty_name_shot, "fire",data_id),		
	    current_weapon_sensor: m_ctl.create_custom_sensor(0),
		knife_tps_sensor: m_ctl.create_custom_sensor(0),	
	    gun_tps_sensor: m_ctl.create_custom_sensor(0),
		pistol_tps_sensor: m_ctl.create_custom_sensor(0),
		gun_laser_tps_sensor: m_ctl.create_custom_sensor(0),		
		punyos_tps_sensor: m_ctl.create_custom_sensor(0), 
		punyos_fps_sensor: m_ctl.create_custom_sensor(0), 
		knife_fps_sensor: m_ctl.create_custom_sensor(0),
		gun_fps_sensor: m_ctl.create_custom_sensor(0),			
		pistol_fps_sensor: m_ctl.create_custom_sensor(0),		
        gun_laser_fps_sensor:m_ctl.create_custom_sensor(0),
     gem_slot: null,    
     island: -1, 
	 lava_sens: null,
	 is_in_house:false,  
    current_door: null,						
	door_house_cam_pos: null,
	sensor_collision_target_camera_wall : null,
	offset_cam: m_conf.CAM_OFFSET,
	char_run_spk: m_scs.get_object_by_dupli_name(empty_name_shot, m_conf.CHAR_RUN_SPEAKER, data_id),
	char_attack_sword_spk: m_scs.get_object_by_dupli_name(empty_name_shot, m_conf.CHAR_ATTACK_SWORD_SPEAKER, data_id),   
	char_sword_hit_spk: m_scs.get_object_by_dupli_name(empty_name_shot, m_conf.CHAR_SWORD_HIT_SPEAKER, data_id), 
	char_land_spk: m_scs.get_object_by_dupli_name(empty_name_shot, m_conf.CHAR_LANDING_SPEAKER, data_id),
    char_attack_gun_tps_spk: m_scs.get_object_by_dupli_name(empty_name_shot,m_conf.CHAR_ATTACK_GUN_TPS_SPEAKER, data_id),
	char_attack_pistol_tps_spk: m_scs.get_object_by_dupli_name(empty_name_shot, m_conf.CHAR_ATTACK_PISTOL_TPS_SPEAKER, data_id),	
	char_attack_gun_laser_tps_spk: m_scs.get_object_by_dupli_name(empty_name_shot,m_conf.CHAR_ATTACK_GUN_LASER_TPS_SPEAKER, data_id),	
	char_jump_spks: m_scs.get_object_by_dupli_name(empty_name_shot, m_conf.CHAR_JUMP_SPKS, data_id),
	char_voice_attack_spks: m_scs.get_object_by_dupli_name(empty_name_shot, m_conf.CHAR_ATTACK_VOICE_SPKS, data_id),	
	char_hurt_spks: m_scs.get_object_by_dupli_name(empty_name_shot,m_conf.CHAR_HURT_SPKS, data_id),
	char_win_spk: m_scs.get_object_by_dupli_name("enviroment", m_conf.WIN_SPEAKER, data_main_id), 
	explosion_barrel_spk:  m_scs.get_object_by_dupli_name("Barrel2", "explosion_barrel_spk",data_main_id),	
	intro_spk: m_scs.get_object_by_dupli_name("enviroment", m_conf.MUSIC_INTRO_SPEAKER,data_main_id),
	end_spk: m_scs.get_object_by_dupli_name("enviroment", m_conf.MUSIC_END_SPEAKER,data_main_id),
	ambience_water_spk: m_scs.get_object_by_dupli_name("enviroment", "ambience_water",data_main_id)	               
  }
}
if (is_char_htoh==false)
	{
	for ( index ; index< length; index++) {  
	    empty_name_shot= m_conf.CHAR_SHOT_EMPTIES[index];	
	var	empty_name_shotfps= m_conf.CHAR_SHOT_FPS_EMPTIES[index];
    _char_wrapper =init_char_shot(data_id,empty_name_shot,data_id_fps, empty_name_shotfps,data_main_id);            
		precache_speakers(is_char_htoh,data_id,index,length,data_id_fps,data_main_id); 															
		precache_weapons(is_char_htoh,data_id,index,length);  																							
     } 
   } 
  else
	if (is_char_htoh==true)  {
	for (var index = 0; index < m_conf.CHAR_HTOH_EMPTIES.length; index++) {  									
		empty_name_htoh=m_conf.CHAR_HTOH_EMPTIES[index];	         
		_char_wrapper =init_char_htoh(data_id,empty_name_htoh,data_id_fps);
		precache_speakers(is_char_htoh,data_id,index,length,data_id_fps); 
		precache_weapons(is_char_htoh,data_id,index,length); 
		m_scs.show_object(_char_wrapper.helmet);
		m_scs.show_object(_char_wrapper.shield);
	   }
     } 
  var time_for_pulse_click_premi_cb = function(obj, id, pulse) {   
  var time = m_ctl.get_sensor_value(obj, id, 0);   
    	_time=time;     
    }	
	var time_sensor = m_ctl.create_timeline_sensor();
  m_ctl.create_sensor_manifold(null, "TIME_FOR_PULSE_CLICK_PREMI",
            m_ctl.CT_POSITIVE, [time_sensor], null, time_for_pulse_click_premi_cb); 	
}
exports.setup_controls = function (elapsed_sensor, is_char_htoh,data_id,index,length) {
	var view_sensor_tps_tmp= m_view.get_wrapper().view_tps_sensor;  
	var view_sensor_fps_tmp= m_view.get_wrapper().view_fps_sensor;
	var container = m_cont.get_container();  
	var mouse_press_sensor = m_ctl.create_mouse_click_sensor(container);
    var keys_attack=[];
	   keys_attack[1]=m_ctl.create_keyboard_sensor(m_ctl.KEY_ENTER);  
	   keys_attack[0]=m_ctl.create_keyboard_sensor(m_ctl.KEY_G);  
    var right_arrow = m_ctl.create_custom_sensor(0);
    var left_arrow  = m_ctl.create_custom_sensor(0);
    var up_arrow    = m_ctl.create_custom_sensor(0);
    var down_arrow  = m_ctl.create_custom_sensor(0);
	var right_giro = m_ctl.create_custom_sensor(0);
	var left_giro = m_ctl.create_custom_sensor(0);
    var touch_jump  = m_ctl.create_custom_sensor(0);
	var click_jump  = m_ctl.create_custom_sensor(0);
	var touch_attack=[];
    touch_attack[0]= m_ctl.create_custom_sensor(0);  
	touch_attack[1]= m_ctl.create_custom_sensor(0);  
	touch_attack[2]= m_ctl.create_custom_sensor(0);  
	touch_attack[3]= m_ctl.create_custom_sensor(0);   
	touch_attack[4]= m_ctl.create_custom_sensor(0);   
	var touch_fly=[];
	 touch_fly[0]= m_ctl.create_custom_sensor(0);  
	touch_fly[1]= m_ctl.create_custom_sensor(0);  
	touch_fly[2]= m_ctl.create_custom_sensor(0);  
	var aa = m_input.check_enable_gamepad_indices();  
	  var index = aa.length ? aa[aa.length - 1] : 0		
	  var gamepad_attack=[];
       gamepad_attack[0]= m_ctl.create_gamepad_btn_sensor(m_input.GMPD_BUTTON_6, index);  
	   gamepad_attack[1]= m_ctl.create_gamepad_btn_sensor(m_input.GMPD_BUTTON_5, index);  
	var touch_view_tps= m_ctl.create_custom_sensor(0); 
	var touch_view_FPS = m_ctl.create_custom_sensor(0);	
	init_island_detection();  
    var on_ground_sens = m_ctl.create_custom_sensor(0);   
	var on_water_sens = m_ctl.create_custom_sensor(0);
	var on_stairs_sens_up = m_ctl.create_custom_sensor(0);  
	var on_stairs_sens_down = m_ctl.create_custom_sensor(0);
	setup_stairs_sensor(on_stairs_sens_up,on_stairs_sens_down); 
    setup_ground_sensor(on_ground_sens);     
	 setup_water_sensor(on_water_sens);	 
	setup_footsteep(on_ground_sens,on_water_sens);    
   m_open_doors.open_ports();
    if (detect_mobile()) {                 
        m_touch_controls.setup_touch_controls(right_arrow, up_arrow, left_arrow,
  down_arrow, touch_jump, touch_attack, touch_view_tps, touch_view_FPS, touch_fly, right_giro, left_giro);
  }
    setup_movement(up_arrow, down_arrow, on_ground_sens, elapsed_sensor,view_sensor_tps_tmp, view_sensor_fps_tmp, right_arrow, left_arrow); 
	setup_rotation(right_giro, left_giro, elapsed_sensor);  
    switch  (m_view.get_wrapper().viewFPS) {   
     case 0:
		setup_mouse_rotation();    
    break;
	case 1:
		setup_mouse_rotation(); 
	break;	
	}	
    setup_jumping(touch_jump, on_ground_sens, click_jump);
    m_weapons.setup_attack(keys_attack,touch_attack, mouse_press_sensor, view_sensor_tps_tmp, view_sensor_fps_tmp, elapsed_sensor, is_char_htoh, data_id,index,length, gamepad_attack, touch_fly);
	_char_wrapper.reset_stat=0;
	_char_wrapper.newlevel_stat=0;  
	_char_wrapper.gaming_stat=1;  
	m_gp_conf.update();  
}   
exports.precache_speakers=precache_speakers;
function precache_speakers(is_char_htoh,data_id,index,length,data_id_fps, data_main_id) { 
	var empty_name_shot="";  
	var empty_name_htoh="";  
	_intro_spk = m_scs.get_object_by_dupli_name("enviroment", m_conf.MUSIC_INTRO_SPEAKER, data_main_id);
   _end_spk = m_scs.get_object_by_dupli_name("enviroment", m_conf.MUSIC_END_SPEAKER, data_main_id);
   _ambience_water_spk=m_scs.get_object_by_dupli_name("enviroment", "ambience_water",data_main_id); 
   _explosion_barrel_spk = m_scs.get_object_by_dupli_name("Barrel2", "explosion_barrel_spk",data_main_id);
if (is_char_htoh)	
{
	for ( index ; index < length; index++) {  
	    empty_name_htoh=m_conf.CHAR_HTOH_EMPTIES[index];	
    _char_death_spk=_char_wrapper.char_death_spk;
  _char_run_spk=_char_wrapper.char_run_spk;												   
	_char_attack_sword_spk=_char_wrapper.char_attack_sword_spk;
	_char_sword_hit_spk=_char_wrapper.char_sword_hit_spk;
	 _char_land_spk=_char_wrapper.char_land_spk;
	_gem_pickup_spk=_char_wrapper.gem_pickup_spk;
	_char_jump_spks=_char_wrapper.char_jump_spks;
    _char_voice_attack_spks=_char_wrapper.char_voice_attack_spks;
	_char_hurt_spks=_char_wrapper.char_hurt_spks;
	_underwater_spk=_char_wrapper.underwater_spk;
	_inhale_out_water_spk=_char_wrapper.inhale_out_water_spk;
  }
 }
 else
 for ( index ; index < length; index++) {  
	    empty_name_shot=m_conf.CHAR_SHOT_EMPTIES[index];	
	var	empty_name_shotfps=m_conf.CHAR_SHOT_FPS_EMPTIES[index];
   _char_wrapper.explosion_barrel_spk = m_scs.get_object_by_dupli_name("Barrel2", "explosion_barrel_spk",data_main_id);
   _char_wrapper.char_death_spk = m_scs.get_object_by_dupli_name(empty_name_shot, m_conf.CHAR_DEATH_SPEAKER, data_id);
   _char_wrapper.char_win_spk= m_scs.get_object_by_dupli_name("enviroment", m_conf.WIN_SPEAKER, data_main_id),    
   _char_wrapper.char_run_spk = m_scs.get_object_by_dupli_name(empty_name_shot, m_conf.CHAR_RUN_SPEAKER, data_id);
    _char_run_spk=_char_wrapper.char_run_spk;
   _char_wrapper.char_attack_sword_spk = m_scs.get_object_by_dupli_name(empty_name_shot, m_conf.CHAR_ATTACK_SWORD_SPEAKER, data_id);												 
   _char_wrapper.char_sword_hit_spk = m_scs.get_object_by_dupli_name(empty_name_shot, m_conf.CHAR_SWORD_HIT_SPEAKER, data_id);
   _char_wrapper.char_attack_gun_tps_spk = m_scs.get_object_by_dupli_name(empty_name_shot,m_conf.CHAR_ATTACK_GUN_TPS_SPEAKER, data_id);								
   _char_wrapper.char_attack_gunfpsspk = m_scs.get_object_by_dupli_name(empty_name_shotfps,m_conf.CHAR_ATTACK_GUN_FPS_SPEAKER,data_id_fps);
    _char_wrapper.char_attack_pistol_tps_spk = m_scs.get_object_by_dupli_name(empty_name_shot,m_conf.CHAR_ATTACK_PISTOL_TPS_SPEAKER, data_id);		
	_char_wrapper.char_attack_pistolfpsspk = m_scs.get_object_by_dupli_name(empty_name_shotfps,m_conf.CHAR_ATTACK_PISTOL_FPS_SPEAKER, data_id_fps);	
   _char_wrapper.char_attack_gun_laser_tps_spk = m_scs.get_object_by_dupli_name(empty_name_shot,m_conf.CHAR_ATTACK_GUN_LASER_TPS_SPEAKER, data_id);	
 	_char_wrapper.char_attack_gun_laserfpsspk = m_scs.get_object_by_dupli_name(empty_name_shotfps,m_conf.CHAR_ATTACK_GUN_LASER_FPS_SPEAKER,data_id_fps);	
											_char_land_spk=_char_wrapper.char_land_spk;		 
    _char_wrapper.gem_pickup_spk = m_scs.get_object_by_dupli_name(empty_name_shot,
                                                     m_conf.GEM_PICKUP_SPEAKER, data_id);
												_gem_pickup_spk =_char_wrapper.gem_pickup_spk; 	 
	_char_jump_spks=_char_wrapper.char_jump_spks;
	_char_voice_attack_spks=_char_wrapper.char_voice_attack_spks;
	_char_hurt_spks=_char_wrapper.char_hurt_spks;	
	_char_wrapper.underwater_spk= m_scs.get_object_by_dupli_name(empty_name_shot,m_conf.CHAR_UNDERWATER, data_id);
	_char_wrapper.inhale_out_water_spk= m_scs.get_object_by_dupli_name(empty_name_shot, m_conf.CHAR_INHALE_OUT_WATER, data_id); 
	}  
}  
exports.precache_weapons=precache_weapons;
function precache_weapons(is_char_htoh,data_id,index,length){ 
if (is_char_htoh)	{
  for (var i = 0; i < _char_wrapper.weapons_list.length; i++) {
       var weapon_name = _char_wrapper.weapons_list[i];  
	   var weapon= _char_wrapper.weapons_list[weapon_name];
        _weapons.push(weapon);
    }
	m_scs.hide_object(_char_wrapper.knife_tps);		
  for (var i = 0; i < _char_wrapper.weapons_inactives_list.length; i++) {	  
        var weapon_inactive_name = _char_wrapper.weapons_inactives_list[i];
	     var weapons_inactives = _char_wrapper.weapons_inactives_list[weapon_inactive_name];
        _weapons_inactives.push(weapons_inactives);
    }
}
else
{
  for (var i = 0; i < _char_wrapper.weapons_list.length; i++) {
	  var weapon_name = _char_wrapper.weapons_list[i]; 
	   var weapon= _char_wrapper.weapons_list[weapon_name];
        _weapons.push(weapon);		
    }  
		m_scs.hide_object(_char_wrapper.gun_tps);
	m_scs.hide_object(_char_wrapper.pistol_tps);
	m_scs.hide_object(_char_wrapper.gun_laser_tps);
	m_scs.hide_object(_char_wrapper.knife_tps);
	m_scs.hide_object(_char_wrapper.gun_fps);
	m_scs.hide_object(_char_wrapper.gun_laser_fps);
  for (var i = 0; i < _char_wrapper.weapons_inactives_list.length; i++) {	  
        var weapon_inactive_name = _char_wrapper.weapons_inactives_list[i];    
	     var weapons_inactives = _char_wrapper.weapons_inactives_list[weapon_inactive_name];
        _weapons_inactives.push(weapons_inactives);
    }  
	m_scs.hide_object(_char_wrapper.gun_tps_inactive);
	m_scs.hide_object(_char_wrapper.pistol_tps_inactive);
	m_scs.hide_object(_char_wrapper.knife_tps_inactive);
	m_scs.hide_object(_char_wrapper.gun_fps);
	m_scs.hide_object(_char_wrapper.gun_laser_fps);	
	m_scs.hide_object(_char_wrapper.laser_fps);
	m_scs.hide_object(_char_wrapper.crosshair_base_obj);
    m_anim.apply(_char_wrapper.emitter_1, "ParticleSystem", m_anim.SLOT_0);
    m_anim.set_behavior(_char_wrapper.emitter_1, m_anim.AB_FINISH_RESET, m_anim.SLOT_0);
    m_anim.apply(_char_wrapper.emitter_2, "ParticleSystem", m_anim.SLOT_0);
    m_anim.set_behavior(_char_wrapper.emitter_2, m_anim.AB_FINISH_RESET, m_anim.SLOT_0);
    m_anim.apply(_char_wrapper.emitter_3, "ParticleSystem", m_anim.SLOT_0);
    m_anim.set_behavior(_char_wrapper.emitter_3, m_anim.AB_FINISH_RESET, m_anim.SLOT_0);
    m_anim.apply(_char_wrapper.emitter_4, "ParticleSystem", m_anim.SLOT_0);
    m_anim.set_behavior(_char_wrapper.emitter_4, m_anim.AB_FINISH_RESET, m_anim.SLOT_0);
	m_anim.apply(_char_wrapper.rig, "hunter_punchtps",m_anim.SLOT_5);
    m_anim.set_behavior(_char_wrapper.rig, m_anim.AB_FINISH_RESET,m_anim.SLOT_5);		
	m_anim.apply(_char_wrapper.rig, "hunter_shotpistoltps",m_anim.SLOT_4);
    m_anim.set_behavior(_char_wrapper.rig, m_anim.AB_FINISH_STOP);	
	m_anim.apply(_char_wrapper.rig, "hunter_aimguntps", m_anim.SLOT_1)
    m_anim.set_behavior(_char_wrapper.rig, m_anim.AB_FINISH_STOP, m_anim.SLOT_1);
	m_anim.apply(_char_wrapper.rig, "hunter_shotguntps", m_anim.SLOT_2);
    m_anim.set_behavior(_char_wrapper.rig, m_anim.AB_FINISH_RESET, m_anim.SLOT_2);  
	  m_anim.apply(_char_wrapper.smokeleftfps, "ParticleSystem", m_anim.SLOT_0);
    m_anim.set_behavior(_char_wrapper.smokeleftfps, m_anim.AB_FINISH_RESET, m_anim.SLOT_0);
    m_anim.apply(_char_wrapper.smokerightfps, "ParticleSystem", m_anim.SLOT_0);
    m_anim.set_behavior(_char_wrapper.smokerightfps, m_anim.AB_FINISH_RESET, m_anim.SLOT_0);
    m_anim.apply(_char_wrapper.smokefrontfps, "ParticleSystem", m_anim.SLOT_0);
    m_anim.set_behavior(_char_wrapper.smokefrontfps, m_anim.AB_FINISH_RESET, m_anim.SLOT_0);
    m_anim.apply(_char_wrapper.shotfirefps, "ParticleSystem", m_anim.SLOT_0);
    m_anim.set_behavior(_char_wrapper.shotfirefps, m_anim.AB_FINISH_RESET, m_anim.SLOT_0);
	m_anim.apply(_char_wrapper.laser_arm_fps, "hunter_punchfps",m_anim.SLOT_5);
    m_anim.set_behavior(_char_wrapper.laser_arm_fps, m_anim.AB_FINISH_RESET,m_anim.SLOT_5);	
	m_anim.apply(_char_wrapper.laser_arm_fps, "hunter_shotpistolfps",m_anim.SLOT_4);
    m_anim.set_behavior(_char_wrapper.laser_arm_fps, m_anim.AB_FINISH_RESET,m_anim.SLOT_4);	
	m_anim.apply(_char_wrapper.laser_arm_fps, "hunter_aimgunfps", m_anim.SLOT_1)
    m_anim.set_behavior(_char_wrapper.laser_arm_fps, m_anim.AB_FINISH_STOP, m_anim.SLOT_1);
	m_anim.apply(_char_wrapper.laser_arm_fps, "hunter_shotgunfps", m_anim.SLOT_2);
    m_anim.set_behavior(_char_wrapper.laser_arm_fps, m_anim.AB_FINISH_RESET, m_anim.SLOT_2);  
	m_anim.apply(_char_wrapper.laser_arm_fps, "hunter_shotaimgunfps", m_anim.SLOT_0);         
    m_anim.set_behavior(_char_wrapper.laser_arm_fps, m_anim.AB_FINISH_RESET, m_anim.SLOT_0);  
 }  
}  
function init_island_detection() {         
    var isl_cb = function(obj, id, pulse) {  
        if (pulse == 1)
            _char_wrapper.island = parseInt(id[id.length-1]); 
        else
           _char_wrapper.island = -1;
    }
    for (var i = 0; i < m_conf.NUM_ISLANDS; i++) {
        var coll_sens = m_ctl.create_collision_sensor(_char_wrapper.picker, "ISLAND"+i);  
        m_ctl.create_sensor_manifold(_char_wrapper.picker, "ISLE_COLL"+i, m_ctl.CT_TRIGGER,
                                     [coll_sens], null, isl_cb);           
    }
}
function setup_ground_sensor(ground_sens) {  
	var island_sens = m_ctl.create_ray_sensor(_char_wrapper.phys_body, [0, 0, 0],
                                          [0, 0, -1], "ISLAND", true);  
     var lava_sens = m_ctl.create_ray_sensor(_char_wrapper.phys_body, [0, 0, 0],
                                          [0, 0, -1], "LAVA", true);                   
    function ground_cb(obj, id, pulse) {
        var val = pulse == 1? 1: 0;           
        m_ctl.set_custom_sensor(ground_sens, val);
    }
    m_ctl.create_sensor_manifold(_char_wrapper.phys_body, "GROUND SENS",                
            m_ctl.CT_TRIGGER, [island_sens, lava_sens],
            function(s) {return s[0] && !s[1]}, ground_cb);   
}
function setup_stairs_sensor(stairs_sens_up,stairs_sens_down) {  
     var sensor_ray_tostairs_up =m_ctl.create_collision_sensor(_char_wrapper.picker,"STAIRS_UP");							  
	 var sensor_ray_tostairs_down =m_ctl.create_collision_sensor(_char_wrapper.picker,"STAIRS_DOWN");							  
    function stairs_up_cb(obj, id, pulse) {
         if (pulse == 1)
				   {
					   m_ctl.set_custom_sensor(stairs_sens_up, 1);	
		           }				
    }
    m_ctl.create_sensor_manifold(_char_wrapper.phys_body, "STAIRS_UP",
            m_ctl.CT_TRIGGER, [sensor_ray_tostairs_up],
            function(s) {return s[0] }, stairs_up_cb);   
	function stairs_down_cb(obj, id, pulse) {
         if (pulse == 1)
				   {	
						m_ctl.set_custom_sensor(stairs_sens_down, 1);
		           }			
    }
    m_ctl.create_sensor_manifold(_char_wrapper.phys_body, "STAIRS_DOWN",
            m_ctl.CT_TRIGGER, [sensor_ray_tostairs_down],
            function(s) {return s[0] }, stairs_down_cb);   
}
function setup_water_sensor(water_sens) {  
    var water_sens = m_ctl.create_ray_sensor(_char_wrapper.phys_body, [0, 0, 0],    
                                          [0, 0, -1], "WATER", true);
    function water_cb(obj, id, pulse) {
        var val = pulse == 1? 1: 0;           
        m_ctl.set_custom_sensor(water_sens, val);
    }
    m_ctl.create_sensor_manifold(_char_wrapper.phys_body, "WATER SENS",
            m_ctl.CT_TRIGGER, [water_sens],
            function(s) {return s[0]}, water_cb);
}
exports.detect_mobile = detect_mobile;  
function detect_mobile() {
    if( navigator.userAgent.match(/Android/i)
     || navigator.userAgent.match(/webOS/i)
     || navigator.userAgent.match(/iPhone/i)
     || navigator.userAgent.match(/iPad/i)
     || navigator.userAgent.match(/iPod/i)
     || navigator.userAgent.match(/BlackBerry/i)
     || navigator.userAgent.match(/Windows Phone/i)) {
        return true;
    } else {
        return false;
    }
}
function setup_movement(up_arrow, down_arrow, on_ground_sens, elapsed,view_sensor_tps_tmp, view_sensor_fps_tmp, right_arrow, left_arrow) {   
_view_sensor_tps=view_sensor_tps_tmp;  
_view_sensor_fps=view_sensor_fps_tmp;
var side_walk_on = m_ctl.create_custom_sensor(0);     
 var move_state = _char_wrapper.move_state;   
    var key_w     = m_ctl.create_keyboard_sensor(m_ctl.KEY_W);
    var key_s     = m_ctl.create_keyboard_sensor(m_ctl.KEY_S);
    var key_up    = m_ctl.create_keyboard_sensor(m_ctl.KEY_UP);
    var key_down  = m_ctl.create_keyboard_sensor(m_ctl.KEY_DOWN);
	var key_shilft     = m_ctl.create_keyboard_sensor(m_ctl.KEY_SHIFT);
   var key_a     = m_ctl.create_keyboard_sensor(m_ctl.KEY_A);
   var key_d     = m_ctl.create_keyboard_sensor(m_ctl.KEY_D);
   var key_left  = m_ctl.create_keyboard_sensor(m_ctl.KEY_LEFT);
   var key_right = m_ctl.create_keyboard_sensor(m_ctl.KEY_RIGHT);   
	 var key_c  = m_ctl.create_keyboard_sensor(m_ctl.KEY_C);  
	var aa = m_input.check_enable_gamepad_indices();  
		var index = aa.length ? aa[aa.length - 1] : 0
     var gs_a = m_ctl.create_gamepad_btn_sensor(m_input.GMPD_BUTTON_14, index);
     var gs_d = m_ctl.create_gamepad_btn_sensor(m_input.GMPD_BUTTON_15, index);
     var gs_w = m_ctl.create_gamepad_btn_sensor(m_input.GMPD_BUTTON_12, index);
     var gs_s = m_ctl.create_gamepad_btn_sensor(m_input.GMPD_BUTTON_13, index);	
	 var left_vert_axis = m_ctl.create_gamepad_axis_sensor(m_input.GMPD_AXIS_0, index);  
     var left_hor_axis = m_ctl.create_gamepad_axis_sensor(m_input.GMPD_AXIS_1, index); 
	 var right_hor_axis = m_ctl.create_gamepad_axis_sensor(m_input.GMPD_AXIS_3, index);  
    var move_array = [
        key_w, key_up, up_arrow,          
        key_s, key_down, down_arrow,       
		gs_w, gs_s, left_hor_axis, right_hor_axis,      
        on_ground_sens,elapsed ,key_shilft,            
        key_a, key_left, left_arrow,                 
        key_d, key_right, right_arrow,               
		gs_a, gs_d, left_vert_axis		            
    ];
    var forward_logic  = function(s){return (s[0] || s[1] || s[2] || s[6] || (s[8] < -AXIS_THRESHOLD) ||(s[9] < -AXIS_THRESHOLD)|| (s[0]&& s[12]))};  
    var backward_logic = function(s){return (s[3] || s[4] || s[5] || s[7] || (s[8] > AXIS_THRESHOLD) || (s[9] > AXIS_THRESHOLD)|| (s[3] && s[12]))};	
	var left_logic  = function(s){return (s[13] || s[14] || s[15] || s[19] || (s[21] < -AXIS_THRESHOLD)) };  
    var right_logic = function(s){return (s[16] || s[17] || s[18] || s[20] || (s[21] > AXIS_THRESHOLD)) };  
		function   on_fly_cb(obj, id, pulse) {    
            if (1 == pulse)
		  { 
			if (_char_wrapper.state == m_conf.CH_FLY)           
				{	
				_char_wrapper.state = m_conf.CH_STILL;
				m_phy.set_character_move_dir(obj, 0, 0);
				var gravity_vec = new Float32Array([0, 0, 10]);
				m_phy.set_object_gravity(obj, gravity_vec);
				} else
				{
				_char_wrapper.state = m_conf.CH_FLY; 						
			var camera = m_scs.get_active_camera();
			if (m_camera.is_eye_camera(camera))
				m_camera.eye_set_vertical_limits(camera,null);  
				m_phy.set_character_move_type(obj, m_phy.CM_FLY);							
                	var _vec2_tmp = new Float32Array(2);
					var angles = m_camera.get_camera_angles_char(camera, _vec2_tmp);   
				m_phy.set_character_fly_velocity(obj, 2); 
				var gravity_vec2 = new Float32Array([0, 0, 1]);  
				m_phy.set_object_gravity(obj, gravity_vec2);
				}  
		   } 
    	}
    function move_cb(obj, id, pulse) {   
        if (_char_wrapper.state == m_conf.CH_ATTACK) {    
            m_phy.set_character_move_dir(obj, 0, 0);
            return;
        }
        var island = m_ctl.get_sensor_value(obj, id, 10);   
        if (pulse == 1) {                
		m_ctl.set_custom_sensor(side_walk_on, 1);  
            switch(id) {
            case "FORWARD":
                move_state.forw_back = 1;		
                break;
            case "BACKWARD":
                move_state.forw_back = -1;						
                break;
			 case "LEFT":
                move_state.left_right = 1;
                break;
            case "RIGHT":
                move_state.left_right = -1;
                break;
             }
			var camera = m_scs.get_active_camera();
		      if (((_char_wrapper.state == m_conf.CH_STILL) || (_char_wrapper.state == m_conf.CH_RUN) ) && (_char_wrapper.state != m_conf.CH_FLY) && island && !_En_agua && !key_shilft.value)   
			  {    	
				_char_wrapper.state = m_conf.CH_WALK;
			if (m_camera.is_eye_camera(camera))
					m_camera.eye_set_vertical_limits(camera, m_conf.EYE_VERT_LIMITS);	
			  }  
			  else  if (((_char_wrapper.state == m_conf.CH_STILL)||(_char_wrapper.state == m_conf.CH_WALK)) && (_char_wrapper.state != m_conf.CH_FLY) && island && !_En_agua && (key_w.value && key_shilft.value))
			   {	
				  _char_wrapper.state = m_conf.CH_RUN;
				m_phy.set_character_run_velocity(obj, 8);  
				m_phy.apply_velocity_world(obj, 0, 8, 0);
			  }  
			else 
				if (((_char_wrapper.state == m_conf.CH_STILL) || (_char_wrapper.state == m_conf.CH_WALK) || (_char_wrapper.state == m_conf.CH_RUN) ||(_char_wrapper.state == m_conf.CH_FLY ))&& _En_agua && !island ) 
				{
				if (m_camera.is_eye_camera(camera))
					m_camera.eye_set_vertical_limits(camera,null);  
					_char_wrapper.state = m_conf.CH_SWIM;
					var _vec2_tmp = new Float32Array(2);
					var angles = m_camera.get_camera_angles_char(camera, _vec2_tmp);   
					m_phy.set_character_vert_move_dir_angle(obj, angles[1]);  
					if ((!m_sfx.is_playing(_underwater_spk))&&(m_sfx.is_playing(_char_run_spk)))
						m_sfx.stop(_char_run_spk);
						m_sfx.play_def(_underwater_spk);
			   }
            if (!m_sfx.is_playing(_char_run_spk))
                m_sfx.play(_char_run_spk,0,0);		
        } 
	else {
		m_ctl.set_custom_sensor(side_walk_on, 0);
		  switch(id) {
            case "FORWARD":  
            case "BACKWARD":
                move_state.forw_back = 0;
                break;
            case "LEFT":
            case "RIGHT":
                move_state.left_right = 0;
                break;				
		   }	
				if (((_char_wrapper.state == m_conf.CH_RUN) || (_char_wrapper.state == m_conf.CH_SWIM) || (_char_wrapper.state == m_conf.CH_WALK) || (_char_wrapper.state == m_conf.CH_JUMP)||(_char_wrapper.state != m_conf.CH_FLY) ) && island && !_En_agua)
				{  
				_char_wrapper.state = m_conf.CH_STILL;		
				}						
	  }  
	  if ((move_state.forw_back || move_state.left_right) && island) {
            if (!m_sfx.is_playing(_char_run_spk))
                m_sfx.play_def(_char_run_spk);
        } else {
            if (m_sfx.is_playing(_char_run_spk))
                m_sfx.stop(_char_run_spk);
        }
    m_phy.set_character_move_dir(obj, move_state.forw_back, move_state.left_right);
   };   
   function anim_cb(obj, id, pulse) {
        if (_char_wrapper.state == m_conf.CH_ATTACK)
            return;
        var cur_anim = m_anim.get_current_anim_name(_char_wrapper.rig);
		     switch(_view_sensor_tps.value) {
            case 1: 
				var required_anim =m_conf.CHAR_IDLE_TPS_ANIM;
				break;
			case 0:
				var required_anim =m_conf.CHAR_IDLE_FPS_ANIM;                 
				break;
			 }
		if ((move_state.left_right == 1)&&(_char_wrapper.state != m_conf.CH_FLY)) {
            required_anim = m_conf.CHAR_STRAFE;
            m_anim.set_speed(_char_wrapper.rig, -1);    	
        } else if ((move_state.left_right == -1) && (_char_wrapper.state != m_conf.CH_FLY))  {
            required_anim = m_conf.CHAR_STRAFE;
        } else 	if ((_char_wrapper.state == m_conf.CH_FLY)&&((move_state.forw_back == 1)||(move_state.forw_back == -1)||(move_state.left_right == 1)||(move_state.left_right == -1)||(move_state.left_right ==0)||(move_state.forw_back ==0))) {
            required_anim = m_conf.CHAR_FLY_ANIM;
        } 
		else 	if ((_char_wrapper.state == m_conf.CH_SWIM)&&((move_state.forw_back == 1)||(move_state.forw_back == -1)||(move_state.left_right == 1)||(move_state.left_right == -1)||(move_state.left_right ==0)||(move_state.forw_back ==0))) {
            required_anim = m_conf.CHAR_SWIM_ANIM;
		}
		else
			if (_char_wrapper.state == m_conf.CH_JUMP) {  
          required_anim = m_conf.CHAR_JUMP_ANIM;    
		}else
			if (_char_wrapper.state == m_conf.CH_STAIRS_UP) {  
            required_anim = m_conf.CHAR_STAIRS_UP_ANIM;			
		}
		else
			if (_char_wrapper.state == m_conf.CH_STAIRS_DOWN) {  
            required_anim = m_conf.CHAR_STAIRS_DOWN_ANIM;			
				console.log("deberia reproducirse por estar en el estado STAIRS_DOWN");		
		}		
		else
			if (_char_wrapper.state == m_conf.CH_STAIRS_DOWN) {  
            required_anim = m_conf.CHAR_STAIRS_DOWN_ANIM;											
        } else if ((move_state.forw_back == 1)&&(_char_wrapper.state == m_conf.CH_RUN)) {
            required_anim = m_conf.CHAR_RUN_ANIM;
        } else if ((move_state.forw_back == -1)&&(_char_wrapper.state == m_conf.CH_RUN)) {
            required_anim = m_conf.CHAR_RUN_ANIM;
            m_anim.set_speed(_char_wrapper.rig, -1);
        } else if ((move_state.forw_back == 1)&&(_char_wrapper.state == m_conf.CH_WALK)) {
            required_anim = m_conf.CHAR_WALK_ANIM;
        } else if ((move_state.forw_back == -1)&&(_char_wrapper.state == m_conf.CH_WALK)) {
            required_anim = m_conf.CHAR_WALK_ANIM;
            m_anim.set_speed(_char_wrapper.rig, -1);
        }
        if (cur_anim != required_anim) {
            m_anim.apply(_char_wrapper.rig, required_anim);
            m_anim.set_behavior(_char_wrapper.rig, m_anim.AB_CYCLIC);
			switch (_char_wrapper.state){
				case m_conf.CH_STAIRS_UP:
				  m_anim.set_behavior(_char_wrapper.rig, m_anim.AB_CYCLIC);
				break;	
				case m_conf.CH_JUMP:
				  m_anim.set_behavior(_char_wrapper.rig, m_anim.AB_FINISH_RESET); 
				  _char_wrapper.state = m_conf.CH_STILL; 
				break;	
				}
			   m_anim.play(_char_wrapper.rig);		
			}
    }  
	m_ctl.create_sensor_manifold(_char_wrapper.phys_body, "ON_FLY", m_ctl.CT_SHOT,[ key_c],
							function(s) {return  s[0]} , on_fly_cb); 		
    m_ctl.create_sensor_manifold(_char_wrapper.phys_body, "FORWARD",
        m_ctl.CT_CONTINUOUS, move_array, forward_logic, move_cb);
    m_ctl.create_sensor_manifold(_char_wrapper.phys_body, "BACKWARD",
        m_ctl.CT_CONTINUOUS, move_array, backward_logic, move_cb);		
    m_ctl.create_sensor_manifold(_char_wrapper.phys_body, "LEFT",
        m_ctl.CT_CONTINUOUS, move_array, left_logic, move_cb);
    m_ctl.create_sensor_manifold(_char_wrapper.phys_body, "RIGHT",
        m_ctl.CT_CONTINUOUS, move_array, right_logic, move_cb);
	 m_ctl.create_sensor_manifold(_char_wrapper.phys_body, "CHAR_ANIM",
        m_ctl.CT_CONTINUOUS, [on_ground_sens], function(s){return s[0]}, anim_cb);	
}  
function setup_mov_side(right_arrow, left_arrow, elapsed_sensor, on_ground_sens) {  
   var move_state = _char_wrapper.move_state;
   var side_walk_on = m_ctl.create_custom_sensor(0);
   var key_a     = m_ctl.create_keyboard_sensor(m_ctl.KEY_A);
    var key_d     = m_ctl.create_keyboard_sensor(m_ctl.KEY_D);
    var key_left  = m_ctl.create_keyboard_sensor(m_ctl.KEY_LEFT);
    var key_right = m_ctl.create_keyboard_sensor(m_ctl.KEY_RIGHT);
	var aa = m_input.check_enable_gamepad_indices();  
		var index = aa.length ? aa[aa.length - 1] : 0
        var gs_a = m_ctl.create_gamepad_btn_sensor(m_input.GMPD_BUTTON_14, index);
		var gs_d = m_ctl.create_gamepad_btn_sensor(m_input.GMPD_BUTTON_15, index);
	 var left_vert_axis = m_ctl.create_gamepad_axis_sensor(m_input.GMPD_AXIS_0, index);  
    var side_array = [
        key_a, key_left, left_arrow,
        key_d, key_right, right_arrow,
		gs_a, gs_d,
        elapsed_sensor, left_vert_axis, on_ground_sens
    ];
    var left_logic  = function(s){return (s[0] || s[1] || s[2] || s[6] || (s[9] < -AXIS_THRESHOLD)) };  
    var right_logic = function(s){return (s[3] || s[4] || s[5] || s[7] || (s[9] > AXIS_THRESHOLD)) };  
    function mov_side_cb(obj, id, pulse) {
        if (_char_wrapper.state == m_conf.CH_ATTACK)
            return;
        var elapsed = m_ctl.get_sensor_value(obj, "MOV_SIDE_LEFT", 8);
        var island = m_ctl.get_sensor_value(obj, id, 10); 
		 var cur_anim = m_anim.get_current_anim_name(_char_wrapper.rig);
        if (pulse == 1) {
			m_ctl.set_custom_sensor(side_walk_on, 1);
            switch(id) {
            case "MOV_SIDE_LEFT":
			     move_state.left_right = 1;  
                break;
            case "MOV_SIDE_RIGHT":
			    move_state.left_right = -1; 
                break;
            }  
        }
	else {    
				m_ctl.set_custom_sensor(side_walk_on, 0);
	             move_state.left_right = 0;   
				if ((_char_wrapper.state == m_conf.CH_RUN || _char_wrapper.state == m_conf.CH_SWIM || _char_wrapper.state == m_conf.CH_WALK || _char_wrapper.state == m_conf.CH_FLY ) && island && !_En_agua)
				if (_char_wrapper.state == m_conf.CH_FLY) 
				{	
				}	
				else	
				{  
				m_phy.set_character_move_dir(obj, 0,  move_state.left_right);       
				if (_is_char_htoh)
                m_anim.apply(_char_wrapper.rig, "idle");
			     else 
				m_anim.apply(_char_wrapper.rig, "hunter_idletps");	
                m_anim.set_behavior(_char_wrapper.rig, m_anim.AB_CYCLIC);
                m_anim.play(_char_wrapper.rig);
				}
				_char_wrapper.state = m_conf.CH_STILL;     
        }
	 if (move_state.left_right)		  
	 {
	      _char_wrapper.state = m_conf.CH_WALK; 	 
			if (island && !_En_agua ) {  
			 m_phy.set_character_move_dir(obj, 0, move_state.left_right);	 
			}	  
	  }  
   }  
   function anim_side_cb(obj, id, pulse) {
        if (_char_wrapper.state == m_conf.CH_ATTACK)
            return;
        var cur_anim = m_anim.get_current_anim_name(_char_wrapper.rig);
        var required_anim ="hunter_idletps";
		if (move_state.left_right == 1) {
            required_anim = "hunter_sideshilfttps";
            m_anim.set_speed(_char_wrapper.rig, -1);    	
        } else if (move_state.left_right == -1) {
            required_anim = "hunter_sideshilfttps";
        }
        if (cur_anim != required_anim) {
            m_anim.apply(_char_wrapper.rig, required_anim);
            m_anim.play(_char_wrapper.rig);
            m_anim.set_behavior(_char_wrapper.rig, m_anim.AB_CYCLIC);
        }
    }  
    m_ctl.create_sensor_manifold(_char_wrapper.phys_body, "MOVE_SIDE_LEFT",
        m_ctl.CT_CONTINUOUS, side_array, left_logic, mov_side_cb);
    m_ctl.create_sensor_manifold(_char_wrapper.phys_body, "MOVE_SIDE_RIGHT",
        m_ctl.CT_CONTINUOUS, side_array, right_logic, mov_side_cb);
	 m_ctl.create_sensor_manifold(_char_wrapper.phys_body, "CHAR_SIDE_ANIM",
        m_ctl.CT_CONTINUOUS, [on_ground_sens,side_walk_on], function(s){return s[0] && s[1]}, anim_side_cb);	
}
function setup_rotation(right_giro, left_giro, elapsed_sensor) {
    var key_q     = m_ctl.create_keyboard_sensor(m_ctl.KEY_Q);
    var key_e     = m_ctl.create_keyboard_sensor(m_ctl.KEY_E);
	var aa = m_input.check_enable_gamepad_indices();  
		var index = aa.length ? aa[aa.length - 1] : 0
	 var right_vert_axis = m_ctl.create_gamepad_axis_sensor(m_input.GMPD_AXIS_2, index);  
	var rotate_array = [   
        key_q, key_e, elapsed_sensor, right_vert_axis, left_giro, right_giro
    ];
    var left_logic  = function(s){return (s[0] || (s[3] < -AXIS_THRESHOLD) || s[4])};
    var right_logic = function(s){return (s[1] || (s[3] > AXIS_THRESHOLD) || s[5])};	
    function mov_rot_cb(obj, id, pulse) {
        if (_char_wrapper.state == m_conf.CH_ATTACK)
            return;
        var elapsed = m_ctl.get_sensor_value(obj, "ROT_LEFT", 2);
        if (pulse == 1) {
            switch(id) {
            case "ROT_LEFT":
			  var move_dir = 1;
                m_phy.character_rotation_inc(obj, elapsed * m_conf.ROT_SPEED, 0);
                break;
            case "ROT_RIGHT":
			   var move_dir = -1;
                m_phy.character_rotation_inc(obj, -elapsed * m_conf.ROT_SPEED, 0);
                break;
            }  
        }
		else {
            switch(id) {
             case "ROT_LEFT":
			  var move_dir = 1;
				  m_phy.set_character_move_dir(obj, 0, 0);
                break;
             case "ROT_RIGHT":
			   var move_dir = -1;
				  m_phy.set_character_move_dir(obj, 0, 0);
                break;
             }  
           }
    }	
    m_ctl.create_sensor_manifold(_char_wrapper.phys_body, "ROT_LEFT",
        m_ctl.CT_CONTINUOUS, rotate_array, left_logic, mov_rot_cb);
    m_ctl.create_sensor_manifold(_char_wrapper.phys_body, "ROT_RIGHT",
        m_ctl.CT_CONTINUOUS, rotate_array, right_logic, mov_rot_cb);
}
function plock_disabled_cb() {		
        if ((_char_wrapper.hp > 0) && (_char_wrapper.state != m_conf.CH_VICTORY)&& (_giro_mouse))   
		m_mouse.exit_pointerlock();
        }                      
exports.pointerlock_cb = pointerlock_cb;          
function pointerlock_cb(e) {      
 function rotation_cb(rot_x, rot_z) { 	
 var offset = new Float32Array(m_conf.CAM_OFFSET);  
    var dist = m_vec3.length(offset);  
    var clamp_left  = -Math.PI / 2;  
    var clamp_right = Math.PI / 2;
    var clamp_up    =0.01;
    var clamp_down  =  Math.PI / 3;         
		var camobj=m_scs.get_active_camera();
        m_phy.character_rotation_inc(_char_wrapper.phys_body, rot_x, 0);																						
		 switch  (m_view.get_wrapper().viewFPS) {  		 
		 case 0:
		 	if (rot_z) {
            m_camera.rotate_camera(camobj, 0, rot_z);  
		 m_camera.get_camera_angles(camobj, _vec3_tmp);   
            offset[1] =  dist * Math.cos(_vec3_tmp[1]);  
            offset[2] = -dist * Math.sin(_vec3_tmp[1]);  
		  m_cons.append_semi_stiff(camobj, _char_wrapper.camera_target, offset, null,
                                 clamp_left, clamp_right, clamp_up, clamp_down);
			}					 			 
		break;					 
		case 1:
			if (rot_x && rot_z )
			{			
			m_camera.rotate_camera(camobj, rot_x, rot_z);				
			}
		break;							 
		 } 
    }  
	_giro_mouse=m_resources.get_wrapper().view_no_static;  
    var canvas_elem = m_cont.get_canvas();           
    if ((_char_wrapper.hp > 0) && (!m_main.is_paused()) && (_char_wrapper.state != m_conf.CH_VICTORY) && (_giro_mouse)) 
	  m_mouse.request_pointerlock(canvas_elem, null, null, null, null, 
	  function (x,y) {
	rotation_cb(m_conf.MOUSE_ROT_MULT * x, m_conf.MOUSE_ROT_MULT * y);  
        });  
}
exports.setup_mouse_rotation=setup_mouse_rotation;  
function setup_mouse_rotation() {   
    var canvas_elem = m_cont.get_canvas();
    canvas_elem.addEventListener("mouseup", pointerlock_cb, false);
}
function register_gamepad(is_hmd) {
    m_gp_conf.update();
    var controller_cb = function(obj, id, pulse) {
        var w = m_ctl.get_sensor_value(obj, id, 0);
        var d = m_ctl.get_sensor_value(obj, id, 1);
        var s = m_ctl.get_sensor_value(obj, id, 2);
        var a = m_ctl.get_sensor_value(obj, id, 3);
        var r1 = m_ctl.get_sensor_value(obj, id, 4);
        var r2 = m_ctl.get_sensor_value(obj, id, 5);
        var l1 = m_ctl.get_sensor_value(obj, id, 6);
        var l2 = m_ctl.get_sensor_value(obj, id, 7);
        var left_vaxis = m_ctl.get_sensor_value(obj, id, 8);
        var left_haxis = m_ctl.get_sensor_value(obj, id, 9);
        var right_vaxis = m_ctl.get_sensor_value(obj, id, 10);
        var right_haxis = m_ctl.get_sensor_value(obj, id, 11);
        var elapsed = m_ctl.get_sensor_value(obj, id, 12);
        var time = m_ctl.get_sensor_value(obj, id, 13);
        var rot_value = elapsed * GAMEPAD_AXIS_ROTATION;
        var velocity = m_cam.get_velocities(obj, _velocity_tmp);
        if (w)
            _dest_z_trans += velocity.trans * COCKPIT_TRANS_FACTOR * elapsed;
        if (s)
            _dest_z_trans -= velocity.trans * COCKPIT_TRANS_FACTOR * elapsed;
        if (a)
            _dest_x_trans -= velocity.trans * COCKPIT_TRANS_FACTOR * elapsed;
        if (d)
            _dest_x_trans += velocity.trans * COCKPIT_TRANS_FACTOR * elapsed;
        if (r1 || r2 || l1 || l2)
            shoot(time);
        if (!is_hmd) {
            _dest_x_trans -= velocity.trans * COCKPIT_TRANS_FACTOR * elapsed * left_vaxis;
            _dest_z_trans += velocity.trans * COCKPIT_TRANS_FACTOR * elapsed * left_haxis;
            var vert_ang = - right_haxis * rot_value;
            var hor_ang = - right_vaxis * rot_value;
            m_cam.rotate_camera(obj, hor_ang, vert_ang);
        }
    }
    var init_sensors = function(index) {
        var gs_w = m_ctl.create_gamepad_btn_sensor(m_input.GMPD_BUTTON_12, index);
        var gs_d = m_ctl.create_gamepad_btn_sensor(m_input.GMPD_BUTTON_15, index);
        var gs_s = m_ctl.create_gamepad_btn_sensor(m_input.GMPD_BUTTON_13, index);
        var gs_a = m_ctl.create_gamepad_btn_sensor(m_input.GMPD_BUTTON_14, index);
        var gs_r1 = m_ctl.create_gamepad_btn_sensor(m_input.GMPD_BUTTON_4, index);
        var gs_r2 = m_ctl.create_gamepad_btn_sensor(m_input.GMPD_BUTTON_5, index);
        var gs_l1 = m_ctl.create_gamepad_btn_sensor(m_input.GMPD_BUTTON_6, index);
        var gs_l2 = m_ctl.create_gamepad_btn_sensor(m_input.GMPD_BUTTON_7, index);
        var left_vert_axis = m_ctl.create_gamepad_axis_sensor(m_input.GMPD_AXIS_0, index);
        var left_hor_axis = m_ctl.create_gamepad_axis_sensor(m_input.GMPD_AXIS_1, index);
        var right_vert_axis = m_ctl.create_gamepad_axis_sensor(m_input.GMPD_AXIS_2, index);
        var right_hor_axis = m_ctl.create_gamepad_axis_sensor(m_input.GMPD_AXIS_3, index);
        var e_s = m_ctl.create_elapsed_sensor();
        var time = m_ctl.create_timeline_sensor();
        var cam_obj = m_scs.get_active_camera();
        m_ctl.create_sensor_manifold(cam_obj, "CONTROLLER_CAMERA_MOVE" + index,
                m_ctl.CT_CONTINUOUS, [gs_w, gs_d, gs_s, gs_a, gs_r1, gs_r2,
                gs_l1, gs_l2, left_vert_axis, left_hor_axis, right_vert_axis,
                right_hor_axis, e_s, time],
                function() {return true}, controller_cb);
    };
    for (var i = 0; i < 4; i++)
        init_sensors(i);
}
function setup_go_up_stairs(on_stairs_sens_up) {
 var key_n = m_ctl.create_keyboard_sensor(m_ctl.KEY_N);	
    var stairs_up_cb = function(obj, id, pulse) {
	if (pulse==1) {	
        if (_char_wrapper.state != m_conf.CH_ATTACK) {        
            var stairs_up = m_ctl.get_sensor_value(obj, id, 1);			
            if (stairs_up) {
				_char_wrapper.state = m_conf.CH_STAIRS_UP;  
					console.log("deberia reproducirse por estar en el estado STAIRS_up");
					var POS_descan1 = new Float32Array(3);  
					var POS_bajo = new Float32Array(3);  
					var  spawn_stairs0= m_scs.get_object_by_dupli_name("stairs_group_up","spawn_stairs0");
					var  spawn_stairs1= m_scs.get_object_by_dupli_name("stairs_group_up","spawn_stairs1");  
					var quad=m_quat.create();
					m_trans.get_translation(spawn_stairs1, POS_descan1);	
					m_trans.get_translation(spawn_stairs0, POS_bajo);	
					m_trans.get_rotation(_char_wrapper.phys_body,quad);
					m_phy.set_character_move_dir(_char_wrapper.phys_body, 0, 0);
	if (m_sfx.is_playing(_char_run_spk))	{
                m_sfx.stop(_char_run_spk);
				 m_sfx.play_def(_char_run_spk);
	}			
					m_phy.set_transform(_char_wrapper.phys_body,POS_bajo,quad); 
					console.log("no deberia haberse reproducido");
					m_anim.apply(_char_wrapper.rig, m_conf.CHAR_STAIRS_UP_ANIM);         
					m_anim.set_behavior(_char_wrapper.rig, m_anim.AB_FINISH_STOP);	
					m_anim.play(_char_wrapper.rig);	
					console.log("deberia haberse reproducido");
  setTimeout(function() {
          m_phy.set_transform(_char_wrapper.phys_body,POS_descan1,quad);
		  console.log("habido un delay ahora deberia trasladarse la fisica del colllider y no antes");
				m_ctl.set_custom_sensor(on_stairs_sens_up, 0);
				stairs_up=0;
				console.log("aqui solo hemos pasado a estado del character STAIRS UP");	
				 _char_wrapper.state = m_conf.CH_STILL; 
        }, 5000);				
			} 
        }  
	 }
    }		
    m_ctl.create_sensor_manifold(_char_wrapper.phys_body, "UP_STAIRS",
        m_ctl.CT_SHOT, [key_n, on_stairs_sens_up],
        function(s){return s[0] && s[1]}, stairs_up_cb);
}
function setup_go_down_stairs(on_stairs_sens_down) {
	var key_b = m_ctl.create_keyboard_sensor(m_ctl.KEY_B);	
    var stairs_go_down_cb = function(obj, id, pulse) {
	if (pulse==1) {	
        if (_char_wrapper.state != m_conf.CH_ATTACK) {        
			var stairs_down = m_ctl.get_sensor_value(obj, id, 1);	
		  if (stairs_down) {
			  _char_wrapper.state = m_conf.CH_STAIRS_DOWN;  
				m_ctl.set_custom_sensor(on_stairs_sens_down, 0);
				stairs_down=0;
				console.log("deberiamos reproducir la escalera down");				
            }
        }  
	 }
    }		
    m_ctl.create_sensor_manifold(_char_wrapper.phys_body, "DOWN_STAIRS",
        m_ctl.CT_SHOT, [key_b, on_stairs_sens_down],
        function(s){return  s[1] }, stairs_go_down_cb);
}
function setup_jumping(touch_jump, on_ground_sens,click_jump) {
    var key_space = m_ctl.create_keyboard_sensor(m_ctl.KEY_SPACE);
	var aa = m_input.check_enable_gamepad_indices();  
	  var index = aa.length ? aa[aa.length - 1] : 0		
      var sensor_gamepad_btn_jump= m_ctl.create_gamepad_btn_sensor(m_input.GMPD_BUTTON_1, index);  
    var jump_cb = function(obj, id, pulse) {
        if (((pulse == 1) && (_char_wrapper.state != m_conf.CH_ATTACK)) && (_char_wrapper.state !=m_conf.CH_FLY)) {
			 _char_wrapper.state = m_conf.CH_JUMP; 
            m_phy.character_jump(obj);
            var island = m_ctl.get_sensor_value(obj, id, 2);
            if (island) {
			    m_sfx.play(_char_jump_spks,0,0);
				_char_wrapper.move_state.forw_back = 0;
               _char_wrapper.move_state.left_right = 0;
            }
        }
    }
    var landing_cb = function(obj, id, pulse) {
        m_sfx.play(_char_land_spk,0,0);
        if (_char_wrapper.state == m_conf.CH_STILL) {
			if (_is_char_htoh)
            m_anim.apply(_char_wrapper.rig, "idle");
			else
			m_anim.apply(_char_wrapper.rig, "hunter_idletps");	
            m_anim.set_behavior(_char_wrapper.rig, m_anim.AB_CYCLIC);
            m_anim.play(_char_wrapper.rig);
        } else if (_char_wrapper.state == m_conf.CH_RUN){
			if (_is_char_htoh)
            m_anim.apply(_char_wrapper.rig, "run");
		    else
			m_anim.apply(_char_wrapper.rig, "hunter_walktps");	
            m_anim.set_behavior(_char_wrapper.rig, m_anim.AB_CYCLIC);
            m_anim.play(_char_wrapper.rig);
        }
    }
    m_ctl.create_sensor_manifold(_char_wrapper.phys_body, "JUMP",
        m_ctl.CT_SHOT, [key_space, touch_jump, on_ground_sens, sensor_gamepad_btn_jump, click_jump],
        function(s){return s[0] || s[1] || s[3] || s[4]}, jump_cb);
}
exports.disable_controls = disable_controls;
function disable_controls() {   
  var camobj=m_scs.get_active_camera();
   var canvas_elem = m_cont.get_canvas();
    if (!detect_mobile())   
        m_mouse.exit_pointerlock();
   m_cons.remove(camobj);  
}
exports.run_victory=run_victory;
function run_victory(camera_tmp) {      
    _char_wrapper.state = m_conf.CH_VICTORY;
	m_anim.set_behavior(_char_wrapper.rig, m_anim.AB_FINISH_STOP,m_anim.SLOT_5);		
    m_anim.play(_char_wrapper.rig,null, m_anim.SLOT_5);  
    m_sfx.play(_char_wrapper.char_win_spk,0,0);
    var elapsed_sensor = m_ctl.create_elapsed_sensor();
    function cam_rotate_cb(obj, id, pulse) {
 if (m_camera.is_target_camera(obj)) {
        var angles = m_camera.get_camera_angles(obj, _vec2_tmp2);  
        var dist = m_camera.target_get_distance(obj);
        var elapsed = m_ctl.get_sensor_value(obj, id, 0);
        var hor_angle = elapsed * 0.1;
        if (angles[1] < _level_conf.VICT_CAM_VERT_ANGLE)   
            var vert_angle = elapsed * 0.05;
        else
            var vert_angle = 0;
		m_camera.rotate_camera(obj, hor_angle, vert_angle);
        if (dist > _level_conf.VICT_CAM_DIST) {   
            dist -= elapsed;
			console.log("la distancia de  la camera target no puede rebasar 10 y  es:"+dist);
            m_camera.target_set_distance(obj, dist);
        }	
    } 
 }	
    m_ctl.create_sensor_manifold(camera_tmp, "CAMERA_ROTATION", m_ctl.CT_CONTINUOUS,
        [elapsed_sensor], null, cam_rotate_cb);
}
exports.reset=reset;
function reset() {	
    _char_wrapper.state = m_conf.CH_STILL;   
    _char_wrapper.hp = m_conf.MAX_CHAR_HP;  
	m_interface.update_premi_text(0); 
    _char_wrapper.island = -1;  
    m_phy.set_character_move_dir(_char_wrapper.phys_body, 0, 0);	
		var rota_default=m_quat.create();
	_char_wrapper.reset_stat=1;
	_char_wrapper.newlevel_stat=0;
	_char_wrapper.gaming_stat=0;
}
exports.apply_hp_potion = function() {     
    change_hp(m_conf.BONUS_HP_INCR);    
}
exports.apply_premi_potion = function() {  
	change_premi(m_conf.BONUS_PREMI_INCR); 
}
exports.apply_lava_protect = function() {
    m_anim.apply(_char_wrapper.body, "LAVA_grow", m_anim.SLOT_1);  
    m_anim.set_behavior(_char_wrapper.body, m_anim.AB_FINISH_STOP, m_anim.SLOT_1);
    m_anim.play(_char_wrapper.body, null, m_anim.SLOT_1);
}
exports.remove_lava_protect = remove_lava_protect;
function remove_lava_protect() {
    m_anim.apply(_char_wrapper.body, "LAVA_fall", m_anim.SLOT_1);
    m_anim.set_behavior(_char_wrapper.body, m_anim.AB_FINISH_STOP, m_anim.SLOT_1);
    m_anim.play(_char_wrapper.body, null, m_anim.SLOT_1);
    m_bonuses.set_lava_protect_time(0);
}
exports.apply_shield = apply_shield;
function apply_shield() {
    m_anim.apply(_char_wrapper.body, "SHIELD_grow", m_anim.SLOT_2);
    m_anim.set_behavior(_char_wrapper.body, m_anim.AB_FINISH_STOP, m_anim.SLOT_2);
    m_anim.play(_char_wrapper.body, null, m_anim.SLOT_2);
    m_anim.apply(_char_wrapper.shield_sphere, "SHIELD_GLOW_grow");
    m_anim.set_behavior(_char_wrapper.shield_sphere, m_anim.AB_FINISH_STOP);
    m_anim.play(_char_wrapper.shield_sphere);
}
exports.remove_shield = remove_shield;
function remove_shield() {
    m_anim.apply(_char_wrapper.body, "SHIELD_flash", m_anim.SLOT_2);
    m_anim.set_behavior(_char_wrapper.body, m_anim.AB_FINISH_STOP, m_anim.SLOT_2);
    m_anim.play(_char_wrapper.body, null, m_anim.SLOT_2);
    m_anim.apply(_char_wrapper.shield_sphere, "SHIELD_GLOW_fall");
    m_anim.set_behavior(_char_wrapper.shield_sphere, m_anim.AB_FINISH_STOP);
    m_anim.play(_char_wrapper.shield_sphere);
    m_bonuses.set_shield_time(0);
}
exports.change_hp = change_hp;
function change_hp(amount) {     
    if (_char_wrapper.hp <= 0)
        return;
    var cur_time = m_time.get_timeline();
    if (amount < 0 && _last_hurt_sound < cur_time - 0.5) {
        var id = Math.floor(2 * Math.random());
  m_sfx.play(_char_hurt_spks,0,0);
        _last_hurt_sound = cur_time;
    }
    _char_wrapper.hp += amount;
    _char_wrapper.hp = Math.min(_char_wrapper.hp, m_conf.MAX_CHAR_HP);
    if (_char_wrapper.hp <= 0)
        kill();
    m_interface.update_hp_bar(_char_wrapper.hp);
}
exports.change_premi = change_premi;
function change_premi(amount,time) {     
	time=_time;				
if (time -_time_ultim_change_premi>1) {
    if (_char_wrapper.premi > _level_conf.MAX_CHAR_PREMI)   
        return;
    var cur_time = m_time.get_timeline();
    if (amount < 0 && _last_hurt_sound < cur_time - 0.5) {
        var id = Math.floor(2 * Math.random());
  m_sfx.play(_char_hurt_spks,0,0);
        _last_hurt_sound = cur_time;
    }
    _char_wrapper.premi += amount;
    _char_wrapper.premi = Math.min(_char_wrapper.premi, _level_conf.MAX_CHAR_PREMI);
   m_interface.update_premi_text(_char_wrapper.premi);  
if (_char_wrapper.premi >= _level_conf.MAX_CHAR_PREMI)
	{
var camera = m_scs.get_active_camera();
var quad=m_quat.create();
var POS_char = new Float32Array(3);   
var POS_cam = new Float32Array(3); 
					m_trans.get_translation(_char_wrapper.phys_body, POS_char);	
					m_trans.get_translation(camera, POS_cam);	
					m_trans.get_rotation(_char_wrapper.phys_body,quad);
	m_view.target_camera(camera,POS_cam,POS_char);  
	run_victory(camera);   
       document.getElementById("game_menu").style.visibility="hidden";
		document.getElementById("game_menu").style.opacity=0;
		document.getElementById("game_menu").style.zIndex=0;
	m_interface.show_victory_element(50); 
	console.log("he alcanzado el record 12000 ptos y los ptos acumulados son:"+_char_wrapper.premi);
	console.log("exito total , has ganado pasas al siguietne nivel o comienza denuevo");
	}
	_time_ultim_change_premi=time;
  }	
}
function kill() {
    disable_controls();
    m_env.disable_environment();
    m_sfx.clear_playlist();
    m_sfx.stop(_char_wrapper.intro_spk);
    m_sfx.play(_char_wrapper.end_spk,0,0);
    m_sfx.play(_char_wrapper.char_death_spk,0,0);
		m_anim.apply(_char_wrapper.rig, "hunter_deathtps");
    m_anim.set_behavior(_char_wrapper.rig, m_anim.AB_FINISH_STOP);  
    m_anim.play(_char_wrapper.rig);
    m_interface.show_replay_button();
    if (_char_wrapper.gem_slot)
        remove_gem();
    if (m_bonuses.shield_time_left > 0)
        remove_shield();
    if (m_bonuses.lava_protect_time_left > 0)
        remove_lava_protect();
}
exports.add_gem = function(gem_wrapper) {
    var gem_empty = gem_wrapper.empty;
    if (_char_wrapper.gem_slot) {
        if (_char_wrapper.gem_slot == gem_wrapper)
            return;
        remove_gem();
    }
    var gem_empty = gem_wrapper.empty;
    m_cons.append_stiff(gem_empty, _char_wrapper.phys_body, m_conf.GEM_OFFSET,
                        m_conf.GEM_ROT_OFFSET, m_conf.GEM_SCALE_OFFSET);
    gem_wrapper.state = m_conf.GM_CARRIED;
    _char_wrapper.gem_slot = gem_wrapper;
    m_sfx.play(_gem_pickup_spk,0,0);
}
exports.remove_gem = remove_gem;
function remove_gem() {
    var gem_empty = _char_wrapper.gem_slot.empty;
    m_cons.remove(gem_empty);
    m_trans.set_translation_v(gem_empty, m_conf.DEFAULT_POS);
    m_trans.set_scale(gem_empty, 1);
    _char_wrapper.gem_slot.state = m_conf.GM_SPARE;
    _char_wrapper.gem_slot = null;
}
function setup_footsteep(on_ground_sens,on_water_sens, on_fly) {			
var a,b,c=null; 
var height_water=null; 
var vec3_tmp = new Float32Array(3);  
var U = m_vec3.create(); 
          var I = m_ctl.create_custom_sensor(0); 
          var h = m_ctl.create_ray_sensor(_char_wrapper.picker , U, [0, 0, -1.25], "BEACH", !0)
          , f = m_ctl.create_ray_sensor(_char_wrapper.picker , U, [0, 0, -1.25], "WOOD", !0)
          , g = m_ctl.create_ray_sensor(_char_wrapper.picker , U, [0, 0, -1.25], "STONE", !0)
          , l = m_ctl.create_ray_sensor(_char_wrapper.picker , U, [0, 0, -1.25], "METAL", !0)
          , q = m_ctl.create_elapsed_sensor(_char_wrapper.picker )   
          , t = [m_ctl.create_vertical_velocity_sensor(_char_wrapper.picker , 2)];
if (_level_conf.LEVEL_NAME == "contact")
{
	m_ctl.create_sensor_manifold(_char_wrapper.phys_body, "WATER_DISTANCE", m_ctl.CT_POSITIVE, [q], null, function(obj,id,pulse) {  
            m_trans.get_translation(_char_wrapper.phys_body, vec3_tmp);
            height_water = m_scs.get_water_surface_level(vec3_tmp[0], vec3_tmp[1]);  
if (.3 > vec3_tmp[2] - height_water)
{
	if(!_En_agua && _char_wrapper.rig)
			{		
           _En_agua = true;
		   _char_wrapper.en_agua=_En_agua;
	        }
}
		   else
			   if (_En_agua && _char_wrapper.rig)
			   {
				   _En_agua = false;
				_char_wrapper.en_agua=_En_agua;
			   }
        });
        m_ctl.create_sensor_manifold(_char_wrapper.phys_body, "SPK_UNDERWATER", m_ctl.CT_TRIGGER, [on_water_sens], null, function(obj, id, pulse) {  
            if (_underwater_spk)  
                if (_ambience_water_spk){
                    1 == pulse ? (m_sfx.play(_underwater_spk,0,0), 
                    m_sfx.stop(_ambience_water_spk)) : (m_sfx.stop(_underwater_spk),
                    m_sfx.play(_ambience_water_spk,0,0))  
				}
        });
        m_ctl.create_sensor_manifold(_char_wrapper.phys_body, "SPK_INHALE", m_ctl.CT_TRIGGER, [on_water_sens], null, function(obj, id, pulse) {
            1 == pulse ? _inhale_out_water_spk && m_sfx.stop(_inhale_out_water_spk) : _inhale_out_water_spk && m_sfx.play(_inhale_out_water_spk)
        });
		gravedad_para_character_sobre_agua(_char_wrapper.phys_body,on_water_sens);		
    }
 }  
  function gravedad_para_character_sobre_agua(a, d) {  
        m_ctl.create_sensor_manifold(a, "UND_WATER_GRAV", m_ctl.CT_TRIGGER, [d], null, function(obj, id, pulse) {  
            if (1 == pulse)
			{
				var gravity_vec = new Float32Array([0, 0, 1]);  
				m_phy.set_object_gravity(a, gravity_vec);
			}	
            else
			{
				var gravity_vec2 = new Float32Array([0, 0, 10]);  
				m_phy.set_object_gravity(a, gravity_vec2);
			}
        })
    }	
exports.precache_doors=precache_doors;
function precache_doors()   {  
	for (var i = 0; i < m_conf.DOORS_NAME_LIST.length; i++)     
	{	llist_door_empty=m_scs.get_object_by_name(m_conf.DOORS_NAME_LIST[i].empty);
            for (var j = 0; j < m_conf.DOORS_NAME_LIST[i].empty.length; j++) {   
					llist_doors_fake = m_scs.get_object_by_dupli_name(m_conf.DOORS_NAME_LIST[i].empty, m_conf.DOORS_NAME_LIST[i].fake_obj);
			         llist_doors = m_scs.get_object_by_dupli_name(m_conf.DOORS_NAME_LIST[i].empty, m_conf.DOORS_NAME_LIST[i].obj);   
					 llist_doors_rig = m_scs.get_object_by_dupli_name(m_conf.DOORS_NAME_LIST[i].empty, m_conf.DOORS_NAME_LIST[i].rig);  
					 llist_doors_collision_body = m_scs.get_object_by_dupli_name(m_conf.DOORS_NAME_LIST[i].empty, m_conf.DOORS_NAME_LIST[i].collision_body);  
					  llist_pos_cam = m_scs.get_object_by_dupli_name(m_conf.DOORS_NAME_LIST[i].empty, m_conf.DOORS_NAME_LIST[i].pos_cam); 
					 door_speaker= m_scs.get_object_by_dupli_name(m_conf.DOORS_NAME_LIST[i].empty, m_conf.DOORS_NAME_LIST[i].speaker );
					  _llist_doors.push(llist_doors_fake);
					  _llist_pos_cam.push(llist_pos_cam);  
					 _door_speaker.push(door_speaker);
			}
    }
}
function open_ports() {  
			for  (var i=0; i< m_conf.DOORS_NAME_LIST.length; i++)  
				for (var j=0; j < m_conf.DOORS_NAME_LIST[i].empty.length; j++) {  
				   if (llist_doors_fake) {          
                    switch (m_conf.DOORS_NAME_LIST[i].obj) {  					
						case "door01_wood":
						play_anim(llist_doors_rig,"close_door",m_anim.AB_FINISH_STOP); 
						door_action(llist_doors_fake, door_speaker);						
                        break;					
						case "door_stone":
						play_anim(llist_doors_rig,"door_house_stone_01_close",m_anim.AB_FINISH_STOP); 
						door_action(llist_doors_fake, door_speaker);						
                        break;	
					}
				}
			}
}
 function door_action(door_body, door_speaker, c, h, f) {  		
    var sensor_opened_door = m_ctl.create_custom_sensor(0);  
	var sensor_touch_door= m_ctl.create_custom_sensor(0);  
    var sensor_click_door= m_ctl.create_custom_sensor(0);  
   var  sensor_collition_cam = m_ctl.create_collision_sensor(door_body, "CAMERA", !1);  
   var sensor_collition_char = m_ctl.create_collision_sensor(door_body, "CHARACTER", !1); 
var sensor_in_house = m_ctl.create_ray_sensor(_char_wrapper.phys_body, [0, 0, 0],
                                          [0, 0, -1], "IN_HOUSE", true);
   var  sensor_keyO = m_ctl.create_keyboard_sensor(m_ctl.KEY_O);
   var sensorkeyJ = m_ctl.create_keyboard_sensor(m_ctl.KEY_J);  
   	var aa = m_input.check_enable_gamepad_indices();  
	  var index = aa.length ? aa[aa.length - 1] : 0		
      var sensor_gamepad_btn_open= m_ctl.create_gamepad_btn_sensor(m_input.GMPD_BUTTON_0, index);  
	  var sensor_gamepad_btn_close= m_ctl.create_gamepad_btn_sensor(m_input.GMPD_BUTTON_3, index);  
 var  near_obj_info_element = document.getElementById("near_obj_info_container");  
	function touch_door_action(event) {		
    event.preventDefault();		
	_is_open_door=true;		
	m_ctl.set_custom_sensor(sensor_click_door, 1);   
	m_ctl.set_custom_sensor(sensor_touch_door, 1); 	
	  } 
	 near_obj_info_element.addEventListener("touchstart", touch_door_action, !1);  
	 near_obj_info_element.addEventListener("click", touch_door_action, !1); 
    var	in_house_cb = function(obj, id, pulse,f) {  
	if (pulse)
			{	
			_char_wrapper.is_in_house=true;
			console.log("estamos dentro la casa y deberia cambiar a target camera");
			}
			else if (!pulse) {
			_char_wrapper.is_in_house=false;
			console.log("estamos  fuera de la casa y nos va a cansar un poco ver esto");
			}
	}
	 m_ctl.create_sensor_manifold(_char_wrapper.picker, "IN_HOUSE_CB", m_ctl.CT_TRIGGER,[ sensor_in_house],  
										function(a) { return a[0]}, in_house_cb); 
	var note_door_action_cb = function(obj, id, pulse) {
			var	nota_door=true;
				if (1 == pulse)		{
			        nota_door=true;
					var sensor_opened_door_tmp=m_ctl.get_sensor_value(obj,id,2);	
					switch 	(sensor_opened_door_tmp) {
					case 0:	
					m_interface.muestra_notificacion("<p>Press O to open door </br>or button A</p>", "open_door.png",4); 
					console.log("se podria abrir la puerta pulsando la tecla 0");
					console.log("el valor de nota door es o deberia ser 1:"+nota_door);
					break;
					case 1:	
					m_interface.muestra_notificacion("<p>Press J to close door</br>or button Y </p>", "open_door.png");
					console.log("el valor de nota door es o deberia ser 1:"+nota_door);
					break;
					}  
				}	
				else
					{
					m_interface.oculta_notificacion("<p>Press O to open door </br>or button A </p>", "open_door.png");
					m_interface.oculta_notificacion("<p>Press J to close door </br>or button Y </p>", "open_door.png");
					nota_door=false;
					console.log("se esta ocultando los mensajes de puerta abrir o cerrar");
					}
     		} 
  var	open_door_cb = function(obj, id, pulse,f) {   
	if (pulse)
			{	
			 m_ctl.set_custom_sensor(sensor_opened_door, 1);           	
			_is_open_door=true;
			m_sfx.play(door_speaker,0,0);  
			switch 	(llist_doors.name) {
					case "house01_wood*door01_wood":	
					play_anim(llist_doors_rig,"open_door",m_anim.AB_FINISH_STOP);  
					break;
					case "house_stone_01*door_stone":	
						play_anim(llist_doors_rig,"door_house_stone_01_open",m_anim.AB_FINISH_STOP);  
					break;					
					}  
		_char_wrapper.current_door=llist_doors.name;
		_char_wrapper.door_house_cam_pos=_llist_pos_cam;
				m_ctl.set_custom_sensor(sensor_click_door, 0);   
				m_ctl.set_custom_sensor(sensor_touch_door, 0); 				
			} 
	}								
  var	cerrar_cb = function(obj,id, pulse,f) { 
	   if (pulse)  
		   {
			m_ctl.set_custom_sensor(sensor_opened_door, 0);   
			_is_open_door=false;
			m_sfx.play(door_speaker,0,0);  
	switch 	(llist_doors.name) {
					case "door01_wood":	
					play_anim(llist_doors_rig,"close_door",m_anim.AB_FINISH_STOP);  
					break;
					case "door_stone":	
						play_anim(llist_doors_rig,"door_house_stone_01_close",m_anim.AB_FINISH_STOP);  
					break;					
					}  
			m_ctl.set_custom_sensor(sensor_click_door, 0);   
			m_ctl.set_custom_sensor(sensor_touch_door, 0);         		
		   }  
		}		
		var elapsed_sens = m_ctl.create_elapsed_sensor();
        m_ctl.create_sensor_manifold(door_body, "NOTIFY_OPEN_CLOSE_PORT", m_ctl.CT_TRIGGER,[sensor_collition_cam, sensor_collition_char,sensor_opened_door,sensor_touch_door, sensor_click_door],		
									function(a) { return ((a[0] || a[1]) && a[2])  ||  ((a[0] || a[1])&& !a[2])}, note_door_action_cb);  
        m_ctl.create_sensor_manifold(null, "OPEN_DOOR", m_ctl.CT_SHOT,[sensor_collition_cam, sensor_collition_char, sensor_keyO, sensor_click_door,sensor_opened_door, sensor_touch_door, sensor_gamepad_btn_open], 
									function(a) { return  (a[0] && (a[2] || a[3] || a[5]|| a[6])&& !a[4] )||  (a[1] && (a[2] || a[3]|| a[5] || a[6])&& !a[4]) }, open_door_cb);
	  m_ctl.create_sensor_manifold(null, "CERRAR_DOOR", m_ctl.CT_SHOT, [sensor_collition_cam, sensor_collition_char, sensorkeyJ, sensor_click_door, sensor_opened_door, sensor_touch_door, sensor_gamepad_btn_close],
									function(a) {  return  (a[0] && (a[2] || a[3]|| a[5]|| a[6])&& a[4] )||  (a[1] && (a[2] || a[3]|| a[5]|| a[6])&& a[4]) }, cerrar_cb)
 }
exports.play_anim=play_anim;
function play_anim(_character_rig, name_anim,type_anim) {  
       m_anim.apply(_character_rig, name_anim);  
        m_anim.set_behavior(_character_rig, type_anim);  
       m_anim.play(_character_rig)
	}   
exports.get_wrapper=get_wrapper;	
function get_wrapper(is_char_htoh)	
{	
	return _char_wrapper;             
}
exports.get_wrappers=get_wrappers;
function get_wrappers(is_char_htoh)	
 {
return _char_wrappers;	
 }
})