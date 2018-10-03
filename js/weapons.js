if (b4w.module_check("weapons"))
    throw "Failed to register module: weapons";
b4w.register("weapons", function(exports, require) {
var m_ctl = require("controls");
var m_scs = require("scenes");
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
var m_input = require("input"); 
var m_options_anims= require("options_2_anims");  
var m_canon = require("canon");	
var m_conf = require("game_config");
var m_view	= require("control_view");
var m_combat = require("combat");
var m_asteroids= require("asteroids");
var m_aliens= require("aliens");
var m_trex= require("trex");
var m_char= require("character2");
var _weapons= [];
var _weapons_inactives= [];
var _view_sensor_tps=null;  
var _view_sensor_fps=null;
var _default_weapon=true;
var _current_weapon=0; 
var _ultimocurrentweapon=0;   
var  _penultimweapon=0;
var _down_count=false;  
var _char_attack_done = false;  
var	 _is_aim_mode = false;  
var _burst_fire_sensor = m_ctl.create_custom_sensor(0);  
var _time=0;  
var _last_mousewheel_time=0;
var _last_button_gamepad_time=0;
var _burst_time=0;  
var _last_shoot_time = 0; 
var _frame=0; 
var _char_run_spk = null;
var _char_attack_sword_spk = null;
var _char_sword_hit_spk = null;
var _char_attack_gun_tps_spk = null;
var _char_attack_gun_shotfpsspk = null; 
var _char_attack_pistol_tps_spk = null;
var _char_attack_pistol_shotfpsspk = null;
var _char_attack_gun_laser_tps_spk = null;
var _char_attack_gun_laser_shotfpsspk = null;
var _explosion_barrel_spk = null;
var _char_voice_attack_spks = [];
var _intro_spk=null;
var _end_spk=null;
var _ambience_water_spk=null;
var _vec3_tmp_2 = new Float32Array(3);
var _vec3_tmp_3 = new Float32Array(3);
var _vec3_tmp1 = new Float32Array(3);  
var _quat4_tmp = new Float32Array(4);  
var _quat_tmp0 = new Float32Array(4);  
var _vec3_tmp = m_vec3.create();  
var _vec2_tmp = new Float32Array(2);
var _quat_tmp2 = m_quat.create();   
var _tsr_tmp = m_tsr.create();  
var _quat_tmp = m_quat.create();  
var _vec3_tmp2 = m_vec3.create(); 
var _is_char_htoh=true;
function precache_speakers2() {  
_char_run_spk =m_char.get_wrapper().char_run_spk;
 _char_attack_sword_spk = m_char.get_wrapper().char_attack_sword_spk;
 _char_sword_hit_spk = m_char.get_wrapper().char_sword_hit_spk;  
 _char_attack_gun_tps_spk = m_char.get_wrapper().char_attack_gun_tps_spk;
 _char_attack_gun_shotfpsspk = m_char.get_wrapper().char_attack_gun_shotfpsspk ; 
 _char_attack_pistol_tps_spk = m_char.get_wrapper().char_attack_pistol_tps_spk;
 _char_attack_pistol_shotfpsspk = m_char.get_wrapper().char_attack_pistol_shotfpsspk;;
 _char_attack_gun_laser_tps_spk = m_char.get_wrapper().char_attack_gun_laser_tps_spk;
 _char_attack_gun_laser_shotfpsspk = m_char.get_wrapper().char_attack_gun_laser_shotfpsspk;
 _char_voice_attack_spks = m_char.get_wrapper().char_voice_attack_spks;
 _explosion_barrel_spk = m_char.get_wrapper().explosion_barrel_spk;
 _intro_spk= m_char.get_wrapper().intro_spk;
_end_spk= m_char.get_wrapper().end_spk;
_ambience_water_spk= m_char.get_wrapper().ambience_water_spk;	
}
exports.setup_attack=setup_attack;  
function setup_attack(key_enter, touch_attack, mouse_press_sensor, view_sensor_tps_tmp, view_sensor_fps_tmp, elapsed, is_char_htoh,data_id,index,length, gamepad_attack, touch_fly) {	
	precache_speakers2();  
_is_char_htoh=is_char_htoh;   
_view_sensor_tps=view_sensor_tps_tmp;  
_view_sensor_fps=view_sensor_fps_tmp;
 function 	assig_index_current_weapon_desde_mousewheel(delta,time,is_char_htoh) {    
 _ultimocurrentweapon=m_char.get_wrapper().weapon_current;   
 console.log("el valor del is_char_htoh al comenzar la asignacion de armas con raton es:"+is_char_htoh);	 
if (!is_char_htoh)
 {
	 _penultimweapon=m_char.get_wrapper().weapon_penultim;    
	 if (((m_char.get_wrapper().knife_tps_sensor.value==1)||(m_char.get_wrapper().knife_fps_sensor.value==1))&&(delta==-100))
	 {
		_ultimocurrentweapon=1;         
		_penultimweapon=0;
		_last_mousewheel_time = time;				
	 }
	else if (((m_char.get_wrapper().pistol_tps_sensor.value==1)||(m_char.get_wrapper().pistol_fps_sensor.value==1))&&(delta==-100))
	 {  
        _ultimocurrentweapon=2;      
		_penultimweapon=1;
		_last_mousewheel_time = time;
	 }	else
	  if (((m_char.get_wrapper().gun_laser_tps_sensor.value==1)||(m_char.get_wrapper().gun_laser_fps_sensor.value==1))&&(delta==-100))	
     {	
          	 _ultimocurrentweapon=3;     
			  _penultimweapon=2;
			  _last_mousewheel_time = time;
	 }	else
    if (((m_char.get_wrapper().gun_tps_sensor.value==1)||(m_char.get_wrapper().gun_fps_sensor.value==1))&&(delta==-100))	
     {	
          	 _ultimocurrentweapon=4;     
			  _penultimweapon=3;
			  _last_mousewheel_time = time;
	 }	
	 else	 
	   if (((m_char.get_wrapper().punyos_tps_sensor.value==1)||(m_char.get_wrapper().punyos_fps_sensor.value==1))&&(delta==100))	
     {	
          	 _ultimocurrentweapon=3;     
			  _penultimweapon=4;
			  _last_mousewheel_time = time;
	 }		 
	   else
	   if (((m_char.get_wrapper().gun_tps_sensor.value==1)||(m_char.get_wrapper().gun_fps_sensor.value==1))&&(delta==100))	
     {	
          	 _ultimocurrentweapon=2;     
			  _penultimweapon=3;
			  _last_mousewheel_time = time;
	 }		  	 
	  else	 
	 if (((m_char.get_wrapper().gun_laser_tps_sensor.value==1)||(m_char.get_wrapper().gun_laser_fps_sensor.value==1))&&(delta==100))
	 {
		_ultimocurrentweapon=1;         
		_penultimweapon=2;
		_last_mousewheel_time = time; 	
	 }	 
	 else   if (((m_char.get_wrapper().pistol_tps_sensor.value==1)||(m_char.get_wrapper().pistol_fps_sensor.value==1))&&(delta==100))	
     {	
          	 _ultimocurrentweapon=0;     
			  _penultimweapon=1;
			  _last_mousewheel_time = time;
	 }		  	 
 }  
	if ((is_char_htoh)&&(_ultimocurrentweapon==0))  
	{
		_ultimocurrentweapon=0;  
		console.log("la asignacion de knife arma al greek es lo unico al mover el raton con num 0 y es:"+_ultimocurrentweapon);
		_last_mousewheel_time=time;
		 return _ultimocurrentweapon;  
	}
	else   
	{
	m_char.get_wrapper().weapon_penultim= _penultimweapon;  
	console.log("el delta deberia cambiar si subimos o bajamos reuda y asi es cada vez que pasamos esta fon:"+delta);
	console.log("el valor del _ultimocurrentweapon es ahora:"+_ultimocurrentweapon);
	console.log("el valor del _penultimweapon es ahora:"+_penultimweapon);
    return _ultimocurrentweapon;	
	}
 } 
function 	assig_index_current_weapon_desde_change_weapons_with_gamepad(time,is_char_htoh) {  
_ultimocurrentweapon=m_char.get_wrapper().weapon_current;
console.log("se incremento o decremento el arma al pulsar gampead boton bumper derecho");
 if (!is_char_htoh)
 {
if (((m_char.get_wrapper().punyos_tps_sensor.value==1)||(m_char.get_wrapper().punyos_fps_sensor.value==1))&&(!_down_count))
   {	_ultimocurrentweapon++;
     	_last_button_gamepad_time=time;
		_down_count=true;   
   }    
if (((m_char.get_wrapper().punyos_tps_sensor.value==1)||(m_char.get_wrapper().punyos_fps_sensor.value==1))&&(_down_count))
   {	_ultimocurrentweapon--;
     	_last_button_gamepad_time=time;
   }     
   if (((m_char.get_wrapper().gun_tps_sensor.value==1)||(m_char.get_wrapper().gun_fps_sensor.value==1))&&(!_down_count))
			{
			_ultimocurrentweapon++;	
			_last_button_gamepad_time=time;
			}		
		if (((m_char.get_wrapper().pistol_tps_sensor.value==1)||(m_char.get_wrapper().pistol_fps_sensor.value==1))&&(!_down_count))
		{
			_ultimocurrentweapon++;
			_last_button_gamepad_time=time;
		}
			if (((m_char.get_wrapper().gun_laser_tps_sensor.value==1)||(m_char.get_wrapper().gun_laser_fps_sensor.value==1))&&(!_down_count))	
			{
				_ultimocurrentweapon++;
				_last_button_gamepad_time=time;				
			}
		if (((m_char.get_wrapper().gun_tps_sensor.value==1)||(m_char.get_wrapper().gun_fps_sensor.value==1))&&(_down_count))
			{
			_ultimocurrentweapon--;	
			_last_button_gamepad_time=time;
			}		
		if (((m_char.get_wrapper().gun_laser_tps_sensor.value==1)||(m_char.get_wrapper().gun_laser_fps_sensor.value==1))&&(_down_count))	
			{
				_ultimocurrentweapon--;
				_last_button_gamepad_time=time;
			}	
				if (((m_char.get_wrapper().pistol_tps_sensor.value==1)||(m_char.get_wrapper().pistol_fps_sensor.value==1))&&(_down_count))
				{
					_ultimocurrentweapon--;
					_last_button_gamepad_time=time;					
				}	
				 if (((m_char.get_wrapper().knife_tps_sensor.value==1)||(m_char.get_wrapper().knife_fps_sensor.value==1))&&(_down_count))
					{	_ultimocurrentweapon--;
					_last_button_gamepad_time=time;
					_down_count=false;
					}   	
				if (((m_char.get_wrapper().knife_tps_sensor.value==1)||(m_char.get_wrapper().knife_fps_sensor.value==1))&&(!_down_count))
					{	_ultimocurrentweapon++;
					_last_button_gamepad_time=time;
					}     	
		if (_ultimocurrentweapon>4)
		  _ultimocurrentweapon--;
		if (_ultimocurrentweapon<0)
		    _ultimocurrentweapon++;
 }  
	if ((is_char_htoh)&&(_ultimocurrentweapon==0))  
	{
		_ultimocurrentweapon=0;  
		console.log("la asignacion de knife arma al greek es lo unico al pulsar el bimper button del gamepad con num 0 y es:"+_ultimocurrentweapon);
		_last_button_gamepad_time=time;
		 return _ultimocurrentweapon;  
	}
	else 
		return _ultimocurrentweapon;
}  
 function change_weapons_with_gamepad_cb(time)	
	{ 
			time=_time;		
	 var viewFPS=m_view.get_wrapper().viewFPS;	 
			if (time -_last_button_gamepad_time>1)
	{	
	var current=assig_index_current_weapon_desde_change_weapons_with_gamepad(time,_is_char_htoh); 	
   _current_weapon=current;    	
   switch_weapons_cb(_current_weapon,viewFPS,_is_char_htoh);	 
	}		
  }  
 exports.mouse_wheel_cb=mouse_wheel_cb;
 function mouse_wheel_cb(delta,time) { 	
		time=_time;		
	 var viewFPS=m_view.get_wrapper().viewFPS;	 
	 var weapons_tmps= _weapons;           
	  var weapons_inactives_tmps= _weapons_inactives;
	  console.log("el time valor es:"+time);
	  console.log("el _last_mousewheel_time valor actual deberia ser algo menor que time y es:"+_last_mousewheel_time);
	  console.log("deberia darse el arma del greek si viewFPS_tmp es 0 y es:"+viewFPS);
	  console.log("deberia darse el arma del greek definitivametne  si _is_char_htoh es true y es:"+_is_char_htoh);	  
	if (time -_last_mousewheel_time>1)
	{		
	var current=assig_index_current_weapon_desde_mousewheel(delta,time,_is_char_htoh); 	
   _current_weapon=current;
	switch_weapons_cb(_current_weapon,viewFPS,_is_char_htoh);
   } 
}  
  var time_for_pulse_attack_cb = function(obj, id, pulse) {   
  var time = m_ctl.get_sensor_value(obj, id, 0);   
    	_time=time;     
    }	
	var time = m_ctl.create_timeline_sensor();
  m_ctl.create_sensor_manifold(null, "TIME_FOR_PULSE_ATTACK",
            m_ctl.CT_POSITIVE, [time], null, time_for_pulse_attack_cb); 
	var device = m_input.get_device_by_type_element(m_input.DEVICE_MOUSE);
	m_input.attach_param_cb(device, m_input.MOUSE_WHEEL, mouse_wheel_cb);   
	  m_ctl.create_sensor_manifold(null, "CHANGE_WEAPONS_WIHT_GAMEPAD",
            m_ctl.CT_CONTINUOUS, [elapsed,gamepad_attack[1]],function(s){return s[0]&& s[1]}, change_weapons_with_gamepad_cb);
if (_default_weapon)				 
{		
 var viewFPS=m_view.get_wrapper().viewFPS;	 	   
	if ((!viewFPS)&&(_is_char_htoh)) {		
	activate_sword_tps();
	process_sword_tps_cb(key_enter, touch_attack, view_sensor_tps_tmp, view_sensor_fps_tmp, gamepad_attack, touch_fly);	 
	process_damage_enemies_H2H_cb(elapsed,view_sensor_tps_tmp); 
	}
	else if((viewFPS)&&(_is_char_htoh))  {
    activate_sword_fps();
	process_sword_fps_cb(key_enter, touch_attack, view_sensor_tps_tmp, view_sensor_fps_tmp, gamepad_attack, touch_fly);	 
	process_damage_enemies_H2H_cb(elapsed,view_sensor_tps_tmp); 
	}
	if ((!viewFPS)&&(!_is_char_htoh)) {		
	activate_sword_tps();				
	process_sword_tps_cb(key_enter, touch_attack, view_sensor_tps_tmp, view_sensor_fps_tmp, gamepad_attack, touch_fly);	 
	process_damage_enemies_H2H_cb(elapsed,view_sensor_tps_tmp); 
	}
	else if((viewFPS)&&(!_is_char_htoh))  {
	activate_sword_fps();
	process_sword_fps_cb(key_enter, touch_attack, view_sensor_tps_tmp, view_sensor_fps_tmp, gamepad_attack, touch_fly);	 
	process_damage_enemies_H2H_cb(elapsed,view_sensor_tps_tmp); 
	}	
	_current_weapon=0;  
	 _default_weapon= false; 
}
exports.switch_weapons_cb=switch_weapons_cb;
 function switch_weapons_cb(current_tmp, viewFPS_tmp, is_char_htoh)  {        
	switch (current_tmp) {          											
    case 4:   
	_current_weapon=current_tmp;
	m_char.get_wrapper().weapon_current=current_tmp;
	console.log("esta es los fps punyos de nunmer 4 y es:"+current_tmp);
	if ((!viewFPS_tmp)&&(!is_char_htoh)) {			
    activate_punyos_tps();
	process_punyos_tps_cb(key_enter, touch_attack, view_sensor_tps_tmp, view_sensor_fps_tmp, gamepad_attack, touch_fly);	 
	process_damage_enemies_H2H_cb(elapsed,view_sensor_tps_tmp); 
	}
	else
	if((viewFPS_tmp)&&(!is_char_htoh))  {
	activate_punyos_fps();
	process_punyos_fps_cb(key_enter, touch_attack, view_sensor_tps_tmp, view_sensor_fps_tmp, gamepad_attack, touch_fly);	
	process_damage_enemies_H2H_cb(elapsed,view_sensor_tps_tmp); 
	}
		 break;	
	 case 0:   
    _current_weapon=current_tmp;
	m_char.get_wrapper().weapon_current=current_tmp;
	console.log("esta es los fps o tps sword o nunmer 0 y es:"+current_tmp);
	if ((!viewFPS_tmp)&&(is_char_htoh)) {		
	activate_sword_tps();
	process_sword_tps_cb(key_enter, touch_attack, view_sensor_tps_tmp, view_sensor_fps_tmp, gamepad_attack, touch_fly);	 
	process_damage_enemies_H2H_cb(elapsed,view_sensor_tps_tmp); 
	}
	else if((viewFPS_tmp)&&(is_char_htoh))  {
	m_scs.hide_object(m_char.get_wrapper().gun_fps);
    activate_sword_fps();  
	process_sword_fps_cb(key_enter, touch_attack, view_sensor_tps_tmp, view_sensor_fps_tmp, gamepad_attack, touch_fly);	 
	process_damage_enemies_H2H_cb(elapsed,view_sensor_tps_tmp); 
	}
	if ((!viewFPS_tmp)&&(!is_char_htoh)) {		
	activate_sword_tps();												
	process_sword_tps_cb(key_enter, touch_attack, view_sensor_tps_tmp, view_sensor_fps_tmp, gamepad_attack, touch_fly);	 
	process_damage_enemies_H2H_cb(elapsed,view_sensor_tps_tmp); 
	}
	else if((viewFPS_tmp)&&(!is_char_htoh))  {
	activate_sword_fps();												
	process_sword_fps_cb(key_enter, touch_attack, view_sensor_tps_tmp, view_sensor_fps_tmp, gamepad_attack, touch_fly);	 
	process_damage_enemies_H2H_cb(elapsed,view_sensor_tps_tmp); 	
	}	
	 break;									
	 case 2:  
	 _current_weapon=current_tmp;
	m_char.get_wrapper().weapon_current=current_tmp;
	console.log("esta es los fps o tps gunlaser o nunmer 2 y es:"+current_tmp);
	if (!viewFPS_tmp) {		 
	activate_gun_laser_tps();
	crosshair_spawn_for_tps_vs_FPS(viewFPS_tmp, view_sensor_tps_tmp, view_sensor_fps_tmp, elapsed);
	process_gun_laser_tps_cb(mouse_press_sensor, touch_attack, view_sensor_tps_tmp,view_sensor_fps_tmp, gamepad_attack, touch_fly); 
	process_damage_enemies_shoot_cb(view_sensor_tps_tmp, view_sensor_fps_tmp); 
	}
	else {
		activate_gun_laser_fps();
	crosshair_spawn_for_tps_vs_FPS(viewFPS_tmp, view_sensor_tps_tmp, view_sensor_fps_tmp, elapsed);  
	process_gun_laser_fps_cb(mouse_press_sensor, touch_attack, view_sensor_tps_tmp, view_sensor_fps_tmp,gamepad_attack, touch_fly);
	process_damage_enemies_shoot_cb(view_sensor_tps_tmp, view_sensor_fps_tmp); 	
	}
	 break;
	case 1:  
	_current_weapon=current_tmp;
	m_char.get_wrapper().weapon_current=current_tmp;
	console.log("esta es los fps o tps pistol o nunmer 1 y es:"+current_tmp);
	if (!viewFPS_tmp) {					
	activate_pistol_tps();
	crosshair_spawn_for_tps_vs_FPS(viewFPS_tmp, view_sensor_tps_tmp, view_sensor_fps_tmp, elapsed);
	process_pistol_tps_cb(mouse_press_sensor, touch_attack, view_sensor_tps_tmp,view_sensor_fps_tmp,gamepad_attack,touch_fly);  
	process_damage_enemies_shoot_cb(view_sensor_tps_tmp, view_sensor_fps_tmp); 
	}
	else {
	activate_pistol_fps();
	crosshair_spawn_for_tps_vs_FPS(viewFPS_tmp, view_sensor_tps_tmp, view_sensor_fps_tmp, elapsed);
	process_pistol_fps_cb(mouse_press_sensor, touch_attack, view_sensor_tps_tmp,view_sensor_fps_tmp,gamepad_attack,touch_fly);
	process_damage_enemies_shoot_cb(view_sensor_tps_tmp, view_sensor_fps_tmp); 
	}	
	break;
	case 3:   
	_current_weapon=current_tmp;
	m_char.get_wrapper().weapon_current=current_tmp;
	console.log("esta es los fps o tps gun o nunmer 3 y es:"+current_tmp);
	if (!viewFPS_tmp) {		
	activate_gun_tps();
	crosshair_spawn_for_tps_vs_FPS(viewFPS_tmp, view_sensor_tps_tmp, view_sensor_fps_tmp, elapsed);
	process_gun_tps_cb(mouse_press_sensor, touch_attack, view_sensor_tps_tmp,view_sensor_fps_tmp, gamepad_attack,touch_fly);  
	process_damage_enemies_shoot_cb(view_sensor_tps_tmp, view_sensor_fps_tmp); 
	}
	else {
	activate_gun_fps();
	crosshair_spawn_for_tps_vs_FPS(viewFPS_tmp, view_sensor_tps_tmp, view_sensor_fps_tmp, elapsed);
	process_gun_fps_cb(mouse_press_sensor, touch_attack, view_sensor_tps_tmp,view_sensor_fps_tmp, gamepad_attack, touch_fly);
	process_damage_enemies_shoot_cb(view_sensor_tps_tmp, view_sensor_fps_tmp); 
	}
	break;			
   }  
}	
}  
function start_shoot_smoke(em1, em2, em3, em4, speaker) {
    m_anim.play(em1, null, m_anim.SLOT_0);
    m_anim.play(em2, null, m_anim.SLOT_0);
    m_anim.play(em3, null, m_anim.SLOT_0);
    m_anim.play(em4, null, m_anim.SLOT_0);
}
  function finish_attack_cb(obj) {
	if ((_view_sensor_tps.value)&&(_is_char_htoh))
	{	
		m_anim.apply(m_char.get_wrapper().rig, "idle");
	    m_anim.set_behavior(m_char.get_wrapper().rig, m_anim.AB_CYCLIC);
        m_anim.play(m_char.get_wrapper().rig);
	}
	else if ((_view_sensor_tps.value)&&(!_is_char_htoh))
	  {
		m_anim.apply(m_char.get_wrapper().rig, "hunter_idleshottps");
	    m_anim.set_behavior(m_char.get_wrapper().rig, m_anim.AB_CYCLIC);
        m_anim.play(m_char.get_wrapper().rig);
	  }
	  else if ((_view_sensor_fps.value)&&(m_char.get_wrapper().weapon_current==4)) 
		  {
			m_anim.apply(m_char.get_wrapper().laser_arm_fps, "hunter_idlefps");
			m_anim.set_behavior(m_char.get_wrapper().laser_arm_fps, m_anim.AB_CYCLIC);   
			m_anim.play(m_char.get_wrapper().laser_arm_fps);					
			console.log("deberiamos ver la aniacion hunter_idlefps de brazos relajados  y menear solo los dedos");
		  }
		else if ((_view_sensor_fps.value)&&(m_char.get_wrapper().weapon_current<4))
          {			
			m_anim.apply(m_char.get_wrapper().laser_arm_fps, "hunter_idleshotfps");
			m_anim.set_behavior(m_char.get_wrapper().laser_arm_fps, m_anim.AB_CYCLIC);   
			m_anim.play(m_char.get_wrapper().laser_arm_fps);			
			console.log("deberiamos ver la aniacion hunter_idleshotfps de postura disparando menear los dedos");			
		  }			
       m_phy.set_character_move_dir(m_char.get_wrapper().phys_body, 0, 0);
       m_char.get_wrapper().state= m_conf.CH_STILL;             
    } 
	 function finish_attack_out_aim_cb(obj) {
	m_char.get_wrapper().state= m_conf.CH_STILL;	
	_char_attack_done = false;  
	 _is_aim_mode = false;  
	}
    function process_attack_sword_speakers() {
        if (m_sfx.is_playing(_char_run_spk))
            m_sfx.stop(_char_run_spk);
        m_sfx.play(_char_attack_sword_spk,0,0);
        var id = Math.floor(3 * Math.random());
	    m_sfx.play(_char_voice_attack_spks,0,0);
    }
	function process_attack_gun_tps_speakers() {
        if (m_sfx.is_playing(_char_run_spk))
            m_sfx.stop(_char_run_spk);
        m_sfx.play(_char_attack_gun_tps_spk,0,0);
    }
	function process_attack_gun_fps_speakers() {
        if (m_sfx.is_playing(_char_run_spk))
            m_sfx.stop(_char_run_spk);
		m_sfx.play(_char_attack_gun_shotfpsspk,0,0);
    }
	function process_attack_pistol_tps_speakers() {
        if (m_sfx.is_playing(_char_run_spk))
            m_sfx.stop(_char_run_spk);
		m_sfx.play(_char_attack_pistol_tps_spk,0,0);
    }
	function process_attack_pistol_fps_speakers() {
        if (m_sfx.is_playing(_char_run_spk))
            m_sfx.stop(_char_run_spk);
		m_sfx.play(_char_attack_pistol_shotfpsspk,0,0);	
    }
	function process_attack_gun_laser_tps_speakers() {
        if (m_sfx.is_playing(_char_run_spk))
            m_sfx.stop(_char_run_spk);
        m_sfx.play(_char_attack_gun_laser_tps_spk,0,0);
		m_sfx.play(_char_attack_gun_laser_tps_spk,0,0);
    }
function process_attack_gun_laser_fps_speakers() {
        if (m_sfx.is_playing(_char_run_spk))
            m_sfx.stop(_char_run_spk);
        m_sfx.play(_char_attack_gun_laser_shotfpsspk,0,0);
    }
exports.activate_sword_tps=activate_sword_tps;	
function activate_sword_tps() {		
if (!_is_char_htoh) {
  m_ctl.set_custom_sensor(m_char.get_wrapper().knife_fps_sensor,0);  
   m_ctl.set_custom_sensor(m_char.get_wrapper().knife_tps_sensor,1);  
	m_ctl.set_custom_sensor(m_char.get_wrapper().pistol_fps_sensor,0); 
	m_ctl.set_custom_sensor(m_char.get_wrapper().pistol_tps_sensor,0);  
	m_ctl.set_custom_sensor(m_char.get_wrapper().gun_laser_tps_sensor,0);
	m_ctl.set_custom_sensor(m_char.get_wrapper().gun_laser_fps_sensor,0);
	m_ctl.set_custom_sensor(m_char.get_wrapper().gun_tps_sensor,0);
	m_ctl.set_custom_sensor(m_char.get_wrapper().gun_fps_sensor,0);
	m_scs.show_object(m_char.get_wrapper().knife_tps);	
	m_scs.hide_object(m_char.get_wrapper().knife_fps);	
	m_scs.hide_object(m_char.get_wrapper().knife_tps_inactive);	
	m_scs.hide_object(m_char.get_wrapper().gun_tps);	
	m_scs.hide_object(m_char.get_wrapper().gun_fps);	
	m_scs.show_object(m_char.get_wrapper().gun_tps_inactive);
	m_scs.hide_object(m_char.get_wrapper().mira_telescopica);
	m_scs.hide_object(m_char.get_wrapper().pistol_tps);	
	m_scs.hide_object(m_char.get_wrapper().pistol_fps);
	m_scs.show_object(m_char.get_wrapper().pistol_tps_inactive);	
	m_scs.hide_object(m_char.get_wrapper().gun_laser_tps);
	m_scs.hide_object(m_char.get_wrapper().laser_tps);
	m_scs.hide_object(m_char.get_wrapper().gun_laser_fps);
	m_scs.hide_object(m_char.get_wrapper().laser_fps);
	m_scs.hide_object(m_char.get_wrapper().crosshair_base_obj);		
}
else
{
   m_ctl.set_custom_sensor(m_char.get_wrapper().knife_tps_sensor,1);  
	m_scs.show_object(m_char.get_wrapper().knife_tps);	
	m_scs.hide_object(m_char.get_wrapper().knife_tps_inactive);	
}
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().gun_fps,"AIM_SHOT_GUN_FPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().gun_tps,"AIM_SHOT_GUN_TPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().pistol_tps,"AIM_SHOT_PISTOL_TPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().gun_laser_tps,"AIM_SHOT_GUN_LASER_TPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().gun_laser_fps,"AIM_SHOT_GUN_LASER_FPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().crosshair_obj,"CROSSHAIR");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().rig,"LASER_ARM_TPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().phys_body, "ATTACK_PUNYOS_FPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().crosshair_obj, "DAMAGE_ENEMIES_SHOT");
}	
exports.activate_sword_fps=activate_sword_fps;	
function activate_sword_fps() {		
if (!_is_char_htoh) {
   m_ctl.set_custom_sensor(m_char.get_wrapper().knife_tps_sensor,0);  
   m_ctl.set_custom_sensor(m_char.get_wrapper().knife_fps_sensor,1);  
    m_ctl.set_custom_sensor(m_char.get_wrapper().pistol_fps_sensor,0);
   m_ctl.set_custom_sensor(m_char.get_wrapper().pistol_tps_sensor,0);  
	m_ctl.set_custom_sensor(m_char.get_wrapper().gun_laser_tps_sensor,0);
	m_ctl.set_custom_sensor(m_char.get_wrapper().gun_laser_fps_sensor,0);
	m_ctl.set_custom_sensor(m_char.get_wrapper().gun_tps_sensor,0);
	m_ctl.set_custom_sensor(m_char.get_wrapper().gun_fps_sensor,0);
	m_scs.show_object(m_char.get_wrapper().knife_fps);	
	m_scs.hide_object(m_char.get_wrapper().knife_tps);	
	m_scs.hide_object(m_char.get_wrapper().knife_tps_inactive);	
	m_scs.hide_object(m_char.get_wrapper().gun_tps);	
	m_scs.hide_object(m_char.get_wrapper().gun_fps);	
     m_scs.hide_object(m_char.get_wrapper().mira_telescopica);
	m_scs.hide_object(m_char.get_wrapper().gun_tps_inactive);
	m_scs.hide_object(m_char.get_wrapper().pistol_tps);	
	m_scs.hide_object(m_char.get_wrapper().pistol_fps);	
	m_scs.hide_object(m_char.get_wrapper().pistol_tps_inactive);	
	m_scs.hide_object(m_char.get_wrapper().gun_laser_tps);
	m_scs.hide_object(m_char.get_wrapper().laser_tps);
	m_scs.hide_object(m_char.get_wrapper().gun_laser_fps);
	m_scs.hide_object(m_char.get_wrapper().laser_fps);
	m_scs.hide_object(m_char.get_wrapper().crosshair_base_obj);	
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().gun_fps,"AIM_SHOT_GUN_FPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().gun_tps,"AIM_SHOT_GUN_TPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().pistol_tps,"AIM_SHOT_PISTOL_TPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().gun_laser_tps,"AIM_SHOT_GUN_LASER_TPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().gun_laser_fps,"AIM_SHOT_GUN_LASER_FPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().crosshair_obj,"CROSSHAIR");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().rig,"LASER_ARM_TPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().crosshair_obj, "DAMAGE_ENEMIES_SHOT");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().phys_body, "ATTACK_PUNYOS_FPS");
  }  
 }	
exports.activate_punyos_fps=activate_punyos_fps;	
function activate_punyos_fps() {		
  m_ctl.set_custom_sensor(m_char.get_wrapper().punyos_fps_sensor,1);  
  console.log("me veo obligado a poner este comentario para saber que punyos sensor es deva lor 1 y es:"+m_char.get_wrapper().punyos_fps_sensor.value)
   m_ctl.set_custom_sensor(m_char.get_wrapper().knife_tps_sensor,0);  
   m_ctl.set_custom_sensor(m_char.get_wrapper().knife_fps_sensor,0);  
    m_ctl.set_custom_sensor(m_char.get_wrapper().pistol_fps_sensor,0);
   m_ctl.set_custom_sensor(m_char.get_wrapper().pistol_tps_sensor,0);  
	m_ctl.set_custom_sensor(m_char.get_wrapper().gun_laser_tps_sensor,0);
	m_ctl.set_custom_sensor(m_char.get_wrapper().gun_laser_fps_sensor,0);
	m_ctl.set_custom_sensor(m_char.get_wrapper().gun_tps_sensor,0);
	m_ctl.set_custom_sensor(m_char.get_wrapper().gun_fps_sensor,0);
	m_scs.hide_object(m_char.get_wrapper().knife_fps);	
	console.log("para empezar deberia haberse ocultado knife fps");
	m_scs.hide_object(m_char.get_wrapper().knife_tps);	
	m_scs.hide_object(m_char.get_wrapper().knife_tps_inactive);	
	m_scs.hide_object(m_char.get_wrapper().gun_tps);	
	m_scs.hide_object(m_char.get_wrapper().gun_fps);	
     m_scs.hide_object(m_char.get_wrapper().mira_telescopica);
	m_scs.hide_object(m_char.get_wrapper().gun_tps_inactive);
	m_scs.hide_object(m_char.get_wrapper().pistol_tps);	
	m_scs.hide_object(m_char.get_wrapper().pistol_fps);	
	m_scs.hide_object(m_char.get_wrapper().pistol_tps_inactive);	
	m_scs.hide_object(m_char.get_wrapper().gun_laser_tps);
	m_scs.hide_object(m_char.get_wrapper().laser_tps);
	m_scs.hide_object(m_char.get_wrapper().gun_laser_fps);
	m_scs.hide_object(m_char.get_wrapper().laser_fps);
	m_scs.hide_object(m_char.get_wrapper().crosshair_base_obj);	
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().phys_body, "ATTACK_PUNYOS_TPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().gun_fps,"AIM_SHOT_GUN_FPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().gun_tps,"AIM_SHOT_GUN_TPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().pistol_tps,"AIM_SHOT_PISTOL_TPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().pistol_tps,"AIM_SHOT_PISTOL_TPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().gun_laser_tps,"AIM_SHOT_GUN_LASER_TPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().gun_laser_fps,"AIM_SHOT_GUN_LASER_FPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().crosshair_obj,"CROSSHAIR");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().rig,"LASER_ARM_TPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().crosshair_obj, "DAMAGE_ENEMIES_SHOT");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().phys_body, "ATTACK_SWORD_TPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().phys_body, "ATTACK_SWORD_FPS");
 }	
 exports.activate_punyos_tps=activate_punyos_tps;	
function activate_punyos_tps() {		
  m_ctl.set_custom_sensor(m_char.get_wrapper().punyos_tps_sensor,1);  
  m_ctl.set_custom_sensor(m_char.get_wrapper().punyos_fps_sensor,0);  
  console.log("me veo obligado a poner este comentario para saber que punyos sensor es deva lor 1 y es:"+m_char.get_wrapper().punyos_tps_sensor.value)
   m_ctl.set_custom_sensor(m_char.get_wrapper().knife_tps_sensor,0);  
   m_ctl.set_custom_sensor(m_char.get_wrapper().knife_fps_sensor,0);  
    m_ctl.set_custom_sensor(m_char.get_wrapper().pistol_fps_sensor,0);
   m_ctl.set_custom_sensor(m_char.get_wrapper().pistol_tps_sensor,0);  
	m_ctl.set_custom_sensor(m_char.get_wrapper().gun_laser_tps_sensor,0);
	m_ctl.set_custom_sensor(m_char.get_wrapper().gun_laser_fps_sensor,0);
	m_ctl.set_custom_sensor(m_char.get_wrapper().gun_tps_sensor,0);
	m_ctl.set_custom_sensor(m_char.get_wrapper().gun_fps_sensor,0);
	m_scs.hide_object(m_char.get_wrapper().knife_fps);	
	m_scs.hide_object(m_char.get_wrapper().knife_tps);	
	console.log("para empezar deberia haberse ocultado knife tps");
	m_scs.hide_object(m_char.get_wrapper().knife_tps_inactive);	
	m_scs.hide_object(m_char.get_wrapper().gun_tps);	
	m_scs.hide_object(m_char.get_wrapper().gun_fps);	
     m_scs.hide_object(m_char.get_wrapper().mira_telescopica);
	m_scs.hide_object(m_char.get_wrapper().gun_tps_inactive);
	m_scs.hide_object(m_char.get_wrapper().pistol_tps);	
	m_scs.hide_object(m_char.get_wrapper().pistol_fps);	
	m_scs.hide_object(m_char.get_wrapper().pistol_tps_inactive);	
	m_scs.hide_object(m_char.get_wrapper().gun_laser_tps);
	m_scs.hide_object(m_char.get_wrapper().laser_tps);
	m_scs.hide_object(m_char.get_wrapper().gun_laser_fps);
	m_scs.hide_object(m_char.get_wrapper().laser_fps);
	m_scs.hide_object(m_char.get_wrapper().crosshair_base_obj);	
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().phys_body, "ATTACK_PUNYOS_FPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().gun_fps,"AIM_SHOT_GUN_FPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().gun_tps,"AIM_SHOT_GUN_TPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().pistol_tps,"AIM_SHOT_PISTOL_TPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().pistol_tps,"AIM_SHOT_PISTOL_TPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().gun_laser_tps,"AIM_SHOT_GUN_LASER_TPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().gun_laser_fps,"AIM_SHOT_GUN_LASER_FPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().crosshair_obj,"CROSSHAIR");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().rig,"LASER_ARM_TPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().crosshair_obj, "DAMAGE_ENEMIES_SHOT");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().phys_body, "ATTACK_SWORD_TPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().phys_body, "ATTACK_SWORD_FPS");
 }	
 exports.activate_pistol_tps=activate_pistol_tps;	
 function activate_pistol_tps() {	
    m_ctl.set_custom_sensor(m_char.get_wrapper().pistol_fps_sensor,0);
    m_ctl.set_custom_sensor(m_char.get_wrapper().pistol_tps_sensor,1);  
	m_ctl.set_custom_sensor(m_char.get_wrapper().knife_tps_sensor,0);
	m_ctl.set_custom_sensor(m_char.get_wrapper().knife_fps_sensor,0);
	m_ctl.set_custom_sensor(m_char.get_wrapper().gun_laser_tps_sensor,0)
	m_ctl.set_custom_sensor(m_char.get_wrapper().gun_laser_fps_sensor,0);
	m_ctl.set_custom_sensor(m_char.get_wrapper().gun_tps_sensor,0);
	m_ctl.set_custom_sensor(m_char.get_wrapper().gun_fps_sensor,0);
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().gun_tps,"AIM_SHOT_GUN_TPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().gun_fps,"AIM_SHOT_GUN_FPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().gun_laser_tps,"AIM_SHOT_GUN_LASER_TPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().gun_laser_fps,"AIM_SHOT_GUN_LASER_FPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().rig,"LASER_ARM_TPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().phys_body, "ATTACK_SWORD_TPS");	
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().phys_body, "ATTACK_SWORD_FPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().phys_body, "DAMAGE_ENEMIES_HtoH");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().phys_body, "ATTACK_PUNYOS_FPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().phys_body, "ATTACK_PUNYOS_TPS");
	m_scs.show_object(m_char.get_wrapper().pistol_tps);
	m_scs.hide_object(m_char.get_wrapper().pistol_fps);	
	m_scs.hide_object(m_char.get_wrapper().pistol_tps_inactive);
	m_scs.hide_object(m_char.get_wrapper().gun_tps);
	m_scs.hide_object(m_char.get_wrapper().gun_fps);
	m_scs.show_object(m_char.get_wrapper().gun_tps_inactive);
	m_scs.hide_object(m_char.get_wrapper().mira_telescopica);
	m_scs.hide_object(m_char.get_wrapper().gun_laser_tps);
	m_scs.hide_object(m_char.get_wrapper().laser_tps);
	m_scs.hide_object(m_char.get_wrapper().gun_laser_fps);
	m_scs.hide_object(m_char.get_wrapper().laser_fps);
	m_scs.show_object(m_char.get_wrapper().crosshair_base_obj);	
	m_scs.hide_object(m_char.get_wrapper().knife_tps);	
	m_scs.hide_object(m_char.get_wrapper().knife_fps);	
	m_scs.show_object(m_char.get_wrapper().knife_tps_inactive);	
 }
exports.activate_pistol_fps=activate_pistol_fps;	
 function activate_pistol_fps() {	 
	m_ctl.set_custom_sensor(m_char.get_wrapper().pistol_tps_sensor,0);  
    m_ctl.set_custom_sensor(m_char.get_wrapper().pistol_fps_sensor,1);  
	m_ctl.set_custom_sensor(m_char.get_wrapper().knife_tps_sensor,0);
	m_ctl.set_custom_sensor(m_char.get_wrapper().knife_fps_sensor,0);
	m_ctl.set_custom_sensor(m_char.get_wrapper().gun_laser_tps_sensor,0);
	m_ctl.set_custom_sensor(m_char.get_wrapper().gun_laser_fps_sensor,0);
	m_ctl.set_custom_sensor(m_char.get_wrapper().gun_tps_sensor,0);
	m_ctl.set_custom_sensor(m_char.get_wrapper().gun_fps_sensor,0);
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().gun_tps,"AIM_SHOT_GUN_TPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().gun_fps,"AIM_SHOT_GUN_FPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().gun_laser_tps,"AIM_SHOT_GUN_LASER_TPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().gun_laser_fps,"AIM_SHOT_GUN_LASER_FPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().rig,"LASER_ARM_TPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().phys_body, "ATTACK_SWORD_TPS");	
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().phys_body, "ATTACK_SWORD_FPS");	
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().phys_body, "DAMAGE_ENEMIES_HtoH");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().phys_body, "ATTACK_PUNYOS_FPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().phys_body, "ATTACK_PUNYOS_TPS");
	m_scs.show_object(m_char.get_wrapper().pistol_fps);
	m_scs.hide_object(m_char.get_wrapper().pistol_tps);
	m_scs.hide_object(m_char.get_wrapper().pistol_tps_inactive);
	m_scs.hide_object(m_char.get_wrapper().gun_tps);
	m_scs.hide_object(m_char.get_wrapper().gun_fps);
	m_scs.hide_object(m_char.get_wrapper().gun_tps_inactive);
	m_scs.hide_object(m_char.get_wrapper().mira_telescopica);
	m_scs.hide_object(m_char.get_wrapper().gun_laser_tps);
	m_scs.hide_object(m_char.get_wrapper().laser_tps);
	m_scs.hide_object(m_char.get_wrapper().gun_laser_fps);
	m_scs.hide_object(m_char.get_wrapper().laser_fps);
	m_scs.show_object(m_char.get_wrapper().crosshair_base_obj);	
	m_scs.hide_object(m_char.get_wrapper().knife_tps);	
	m_scs.hide_object(m_char.get_wrapper().knife_fps);	
	m_scs.hide_object(m_char.get_wrapper().knife_tps_inactive);	
 }
 exports.activate_gun_laser_tps=activate_gun_laser_tps;	
function activate_gun_laser_tps() {	
	m_ctl.set_custom_sensor(m_char.get_wrapper().gun_laser_fps_sensor,0);   
	m_ctl.set_custom_sensor(m_char.get_wrapper().gun_laser_tps_sensor,1);         
	m_ctl.set_custom_sensor(m_char.get_wrapper().gun_tps_sensor,0);   
	m_ctl.set_custom_sensor(m_char.get_wrapper().gun_fps_sensor,0);   
	m_ctl.set_custom_sensor(m_char.get_wrapper().knife_tps_sensor,0);   
	m_ctl.set_custom_sensor(m_char.get_wrapper().knife_fps_sensor,0); 
	m_ctl.set_custom_sensor(m_char.get_wrapper().pistol_tps_sensor,0);   
	m_ctl.set_custom_sensor(m_char.get_wrapper().pistol_fps_sensor,0);   
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().pistol_tps,"AIM_SHOT_PISTOL_TPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().gun_tps,"AIM_SHOT_GUN_TPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().gun_laser_fps,"AIM_SHOT_GUN_LASER_FPS");  
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().gun_fps,"AIM_SHOT_GUN_FPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().rig,"LASER_ARM_FPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().phys_body, "ATTACK_SWORD_TPS");	
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().phys_body, "ATTACK_SWORD_FPS");	
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().phys_body, "DAMAGE_ENEMIES_HtoH");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().phys_body, "ATTACK_PUNYOS_FPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().phys_body, "ATTACK_PUNYOS_TPS");
    m_scs.show_object(m_char.get_wrapper().gun_laser_tps);	  
	m_scs.show_object(m_char.get_wrapper().laser_tps);			
	m_scs.show_object(m_char.get_wrapper().crosshair_base_obj);
	m_scs.hide_object(m_char.get_wrapper().gun_laser_fps);	  
	m_scs.hide_object(m_char.get_wrapper().laser_fps);			
	m_scs.hide_object(m_char.get_wrapper().pistol_tps);	
	m_scs.hide_object(m_char.get_wrapper().pistol_fps);	
	m_scs.show_object(m_char.get_wrapper().pistol_tps_inactive);	
	m_scs.show_object(m_char.get_wrapper().gun_tps_inactive);  
	m_scs.hide_object(m_char.get_wrapper().gun_tps);
	m_scs.hide_object(m_char.get_wrapper().gun_fps);	
	m_scs.hide_object(m_char.get_wrapper().mira_telescopica);
	m_scs.hide_object(m_char.get_wrapper().knife_tps);	
	m_scs.hide_object(m_char.get_wrapper().knife_fps);	
	m_scs.show_object(m_char.get_wrapper().knife_tps_inactive);		 
 } 
exports.activate_gun_laser_fps=activate_gun_laser_fps;	
function activate_gun_laser_fps() {	
	m_ctl.set_custom_sensor(m_char.get_wrapper().gun_laser_fps_sensor,1);   
	m_ctl.set_custom_sensor(m_char.get_wrapper().gun_laser_tps_sensor,0);         
	m_ctl.set_custom_sensor(m_char.get_wrapper().gun_tps_sensor,0);   
	m_ctl.set_custom_sensor(m_char.get_wrapper().gun_fps_sensor,0);   
	m_ctl.set_custom_sensor(m_char.get_wrapper().knife_tps_sensor,0);   
	m_ctl.set_custom_sensor(m_char.get_wrapper().knife_fps_sensor,0);   
	m_ctl.set_custom_sensor(m_char.get_wrapper().pistol_tps_sensor,0);   
	m_ctl.set_custom_sensor(m_char.get_wrapper().pistol_fps_sensor,0);   
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().pistol_tps,"AIM_SHOT_PISTOL_TPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().pistol_tps,"AIM_SHOT_PISTOL_FPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().gun_tps,"AIM_SHOT_GUN_TPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().gun_tps,"AIM_SHOT_GUN_FPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().gun_laser_fps,"AIM_SHOT_GUN_LASER_TPS");  
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().rig,"LASER_ARM_TPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().phys_body, "ATTACK_SWORD_TPS");	
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().phys_body, "ATTACK_SWORD_FPS");	
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().phys_body, "DAMAGE_ENEMIES_HtoH");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().phys_body, "ATTACK_PUNYOS_FPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().phys_body, "ATTACK_PUNYOS_TPS");
    m_scs.show_object(m_char.get_wrapper().gun_laser_fps);	  
	m_scs.show_object(m_char.get_wrapper().laser_fps);			
	m_scs.show_object(m_char.get_wrapper().crosshair_base_obj);
	m_scs.hide_object(m_char.get_wrapper().gun_laser_tps);	  
	m_scs.hide_object(m_char.get_wrapper().laser_tps);			
	m_scs.hide_object(m_char.get_wrapper().pistol_tps);	
	m_scs.hide_object(m_char.get_wrapper().pistol_tps_inactive);	
	m_scs.hide_object(m_char.get_wrapper().pistol_fps);	
	m_scs.hide_object(m_char.get_wrapper().gun_tps_inactive);  
	m_scs.hide_object(m_char.get_wrapper().gun_tps);
	m_scs.hide_object(m_char.get_wrapper().gun_fps);	
	m_scs.hide_object(m_char.get_wrapper().mira_telescopica);
	m_scs.hide_object(m_char.get_wrapper().knife_tps);	
	m_scs.hide_object(m_char.get_wrapper().knife_fps);	
	m_scs.hide_object(m_char.get_wrapper().knife_tps_inactive);		 
 } 
exports.activate_gun_tps=activate_gun_tps;	
function activate_gun_tps() {	
	m_ctl.set_custom_sensor(m_char.get_wrapper().gun_fps_sensor,0);
	m_ctl.set_custom_sensor(m_char.get_wrapper().gun_tps_sensor,1);  
	m_ctl.set_custom_sensor(m_char.get_wrapper().pistol_fps_sensor,0); 
	m_ctl.set_custom_sensor(m_char.get_wrapper().pistol_tps_sensor,0);  
	m_ctl.set_custom_sensor(m_char.get_wrapper().knife_tps_sensor,0);
	m_ctl.set_custom_sensor(m_char.get_wrapper().knife_fps_sensor,0);
	m_ctl.set_custom_sensor(m_char.get_wrapper().gun_laser_tps_sensor,0);
	m_ctl.set_custom_sensor(m_char.get_wrapper().gun_laser_fps_sensor,0);	
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().gun_fps,"AIM_SHOT_GUN_FPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().gun_laser_tps,"AIM_SHOT_GUN_LASER_TPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().gun_laser_fps,"AIM_SHOT_GUN_LASER_FPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().rig,"LASER_ARM_TPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().phys_body, "ATTACK_SWORD_TPS");	
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().phys_body, "ATTACK_SWORD_FPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().phys_body, "DAMAGE_ENEMIES_HtoH");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().phys_body, "ATTACK_PUNYOS_FPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().phys_body, "ATTACK_PUNYOS_TPS");
	m_scs.show_object(m_char.get_wrapper().gun_tps);
	m_scs.hide_object(m_char.get_wrapper().gun_tps_inactive);	
	m_scs.hide_object(m_char.get_wrapper().gun_fps);
    m_scs.hide_object(m_char.get_wrapper().mira_telescopica);
	m_scs.show_object(m_char.get_wrapper().pistol_tps_inactive);		
	m_scs.hide_object(m_char.get_wrapper().pistol_tps);	
	m_scs.hide_object(m_char.get_wrapper().pistol_fps);	
	m_scs.hide_object(m_char.get_wrapper().gun_laser_tps);
	m_scs.hide_object(m_char.get_wrapper().laser_tps);
	m_scs.hide_object(m_char.get_wrapper().gun_laser_fps);
	m_scs.hide_object(m_char.get_wrapper().laser_fps);
	m_scs.show_object(m_char.get_wrapper().crosshair_base_obj);	
	m_scs.hide_object(m_char.get_wrapper().knife_tps);	
	m_scs.hide_object(m_char.get_wrapper().knife_fps);	
	m_scs.show_object(m_char.get_wrapper().knife_tps_inactive);	
}
exports.activate_gun_fps=activate_gun_fps;	
function activate_gun_fps() {	
	m_ctl.set_custom_sensor(m_char.get_wrapper().gun_fps_sensor,1);  
	m_ctl.set_custom_sensor(m_char.get_wrapper().gun_tps_sensor,0);	
	m_ctl.set_custom_sensor(m_char.get_wrapper().pistol_fps_sensor,0); 
	m_ctl.set_custom_sensor(m_char.get_wrapper().pistol_tps_sensor,0);  
	m_ctl.set_custom_sensor(m_char.get_wrapper().knife_tps_sensor,0);
	m_ctl.set_custom_sensor(m_char.get_wrapper().knife_fps_sensor,0);
	m_ctl.set_custom_sensor(m_char.get_wrapper().gun_laser_tps_sensor,0);
	m_ctl.set_custom_sensor(m_char.get_wrapper().gun_laser_fps_sensor,0);
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().gun_fps,"AIM_SHOT_GUN_TPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().gun_laser_tps,"AIM_SHOT_GUN_LASER_TPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().gun_laser_fps,"AIM_SHOT_GUN_LASER_FPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().rig,"LASER_ARM_TPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().phys_body, "ATTACK_SWORD_TPS");	
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().phys_body, "ATTACK_SWORD_FPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().phys_body, "DAMAGE_ENEMIES_HtoH");	
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().phys_body, "ATTACK_PUNYOS_FPS");
	m_ctl.remove_sensor_manifold(m_char.get_wrapper().phys_body, "ATTACK_PUNYOS_TPS");
	m_scs.hide_object(m_char.get_wrapper().gun_tps);
	m_scs.show_object(m_char.get_wrapper().gun_fps);
	m_scs.show_object(m_char.get_wrapper().mira_telescopica);
	m_scs.hide_object(m_char.get_wrapper().gun_tps_inactive);	
	m_scs.hide_object(m_char.get_wrapper().pistol_tps_inactive);		
	m_scs.hide_object(m_char.get_wrapper().pistol_tps);	
	m_scs.hide_object(m_char.get_wrapper().pistol_fps);	
	m_scs.hide_object(m_char.get_wrapper().gun_laser_tps);
	m_scs.hide_object(m_char.get_wrapper().laser_tps);
	m_scs.hide_object(m_char.get_wrapper().gun_laser_fps);
	m_scs.hide_object(m_char.get_wrapper().laser_fps);
	m_scs.show_object(m_char.get_wrapper().crosshair_base_obj);	
	m_scs.hide_object(m_char.get_wrapper().knife_tps);	
	m_scs.hide_object(m_char.get_wrapper().knife_fps);	
	m_scs.hide_object(m_char.get_wrapper().knife_tps_inactive);	
}
exports.process_gun_tps_cb=process_gun_tps_cb;
function process_gun_tps_cb(mouse_press_sensor, touch_attack, view_sensor_tps_tmp,view_sensor_fps_tmp, gamepad_attack, touch_fly) {
	_char_attack_done = false;
	 var aim_shot_gun_tps_cb = function(obj, id, pulse) {
        if ((pulse == 1) && (m_char.get_wrapper().state != m_conf.CH_ATTACK)&& (m_char.get_wrapper().gun_tps_sensor.value==1)) {
            m_char.get_wrapper().state= m_conf.CH_ATTACK;    	
            console.log("se supone hemos debido pasara a estado 2 o  CH_ATTACK y estamos en :"+m_char.get_wrapper().state);			
			var payload = m_ctl.get_sensor_payload(obj, id, 0); 
        if	((payload.which==m_conf.LEFT_MOUSE_BUTTON_ID)||(touch_attack)||(gamepad_attack))
			{		
            _char_attack_done = true;
			start_shoot_smoke(m_char.get_wrapper().emitter_1, m_char.get_wrapper().emitter_2, m_char.get_wrapper().emitter_3, m_char.get_wrapper().emitter_4);  
		   m_anim.play(m_char.get_wrapper().rig, finish_attack_cb, m_anim.SLOT_2);    
            m_phy.set_character_move_dir(m_char.get_wrapper().phys_body, 0, 0);
            _char_attack_done = false;			
			m_ctl.set_custom_sensor(_burst_fire_sensor, 1);			
			process_attack_gun_tps_speakers();			
          }	
	   }
    }
	m_ctl.create_sensor_manifold(m_char.get_wrapper().gun_tps, "AIM_SHOT_GUN_TPS", m_ctl.CT_TRIGGER,    
[mouse_press_sensor, touch_attack[3], view_sensor_tps_tmp, view_sensor_fps_tmp,m_char.get_wrapper().gun_tps_sensor, gamepad_attack[0]], function(s){return (s[0]||s[1] || s[5])&& s[2]&& !s[3]&& s[4]}, aim_shot_gun_tps_cb);	
   }	
exports.process_gun_fps_cb=process_gun_fps_cb;
function process_gun_fps_cb(mouse_press_sensor, touch_attack, view_sensor_tps_tmp,view_sensor_fps_tmp, gamepad_attack,current_tmp) {
   	_char_attack_done=false;
    var is_zoom_mode = false;
 function start_shoot_anim(obj, is_zoom_mode, anim_cb, slot_num, zoom_slot_num) {  
    if (is_zoom_mode)
        m_anim.play(obj, anim_cb, zoom_slot_num);
    else
        m_anim.play(obj, anim_cb, slot_num); 
	}
 function seet_zoom_speed(obj, is_zoom_mode, slot_num) {  
    if (is_zoom_mode)
        m_anim.set_speed(obj, -1, slot_num);
    else
        m_anim.set_speed(obj, 1, slot_num);
 }
    var logic_func = function(s) {
      return  (s[0]||s[1] || s[5])&& !s[2]&& s[3]&& s[4];
    }
    var aim_shot_gun_fps_cb = function(obj, id, pulse) {
        if ((pulse==1) && (m_char.get_wrapper().state != m_conf.CH_ATTACK)&& (!_char_attack_done)&& (m_char.get_wrapper().gun_fps_sensor.value==1)) { 
		    m_char.get_wrapper().state= m_conf.CH_ATTACK;    
			console.log("se supone hemos debido pasara a estado 2 o  CH_ATTACK y estamos en :"+m_char.get_wrapper().state);					
            var payload = m_ctl.get_sensor_payload(obj, id, 0); 		
				 if	((payload.which==m_conf.LEFT_MOUSE_BUTTON_ID)||(touch_attack)||(gamepad_attack))
				 {
				_char_attack_done=true;
              start_shoot_smoke(m_char.get_wrapper().smokeleftfps, m_char.get_wrapper().smokerightfps, m_char.get_wrapper().smokefrontfps, m_char.get_wrapper().shotfirefps); 
               m_anim.play(m_char.get_wrapper().laser_arm_fps, finish_attack_cb, m_anim.SLOT_2);  			
				process_attack_gun_fps_speakers();		
				_char_attack_done=false;
				m_ctl.set_custom_sensor(_burst_fire_sensor, 1);	
				 }
        }
    }	
			m_ctl.create_sensor_manifold(m_char.get_wrapper().gun_fps, "AIM_SHOT_GUN_FPS", m_ctl.CT_SHOT,
            [mouse_press_sensor,touch_attack[3], view_sensor_tps_tmp,view_sensor_fps_tmp, m_char.get_wrapper().gun_fps_sensor,gamepad_attack[0]], logic_func, aim_shot_gun_fps_cb);	  	
}  
exports.process_pistol_tps_cb=process_pistol_tps_cb;	
function process_pistol_tps_cb(mouse_press_sensor, touch_attack, view_sensor_tps_tmp,view_sensor_fps_tmp,gamepad_attack,current_tmp)	{	  
        _char_attack_done=false     
		var aim_shot_pistol_tps_cb = function(obj, id, pulse) {  		
        if ((pulse==1) && (m_char.get_wrapper().state != m_conf.CH_ATTACK) && (m_char.get_wrapper().pistol_tps_sensor)) { 			
            m_char.get_wrapper().state= m_conf.CH_ATTACK;            
			var payload = m_ctl.get_sensor_payload(obj, id, 0);  
if  ((payload.which==m_conf.LEFT_MOUSE_BUTTON_ID)||(touch_attack)||(gamepad_attack)) {    
			_char_attack_done= true;
            m_anim.play(m_char.get_wrapper().rig, finish_attack_cb,m_anim.SLOT_4);    		  
            m_phy.set_character_move_dir(m_char.get_wrapper().phys_body, 0, 0);     
	   		m_ctl.set_custom_sensor(_burst_fire_sensor, 1); 
			_char_attack_done = false;  										
			process_attack_pistol_tps_speakers();
		}	
		}	
	}
	 m_ctl.create_sensor_manifold(m_char.get_wrapper().pistol_tps, "AIM_SHOT_PISTOL_TPS", m_ctl.CT_SHOT,
    [mouse_press_sensor, touch_attack[1], view_sensor_tps_tmp, view_sensor_fps_tmp, m_char.get_wrapper().pistol_tps_sensor, gamepad_attack[0]], function(s){return (s[0] || s[1] || s[5] )&& s[2]&& !s[3]&& s[4]}, aim_shot_pistol_tps_cb);	
}
exports.process_pistol_fps_cb=process_pistol_fps_cb;	
function process_pistol_fps_cb(mouse_press_sensor, touch_attack, view_sensor_tps_tmp,view_sensor_fps_tmp,gamepad_attack,current_tmp)	{	  
        _char_attack_done=false     
		var aim_shot_pistol_fps_cb = function(obj, id, pulse) {  		
        if (((pulse==1) && (m_char.get_wrapper().state != m_conf.CH_ATTACK)) && (m_char.get_wrapper().pistol_fps_sensor)) { 			
            m_char.get_wrapper().state= m_conf.CH_ATTACK;            
			var payload = m_ctl.get_sensor_payload(obj, id, 0);  
if  ((payload.which==m_conf.LEFT_MOUSE_BUTTON_ID)||(touch_attack)||(gamepad_attack)) {    
			_char_attack_done= true;
            m_anim.play(m_char.get_wrapper().laser_arm_fps, finish_attack_cb,m_anim.SLOT_4);    		  
            m_phy.set_character_move_dir(m_char.get_wrapper().phys_body, 0, 0);     
	   		m_ctl.set_custom_sensor(_burst_fire_sensor, 1); 
			_char_attack_done = false;  				
			process_attack_pistol_fps_speakers();
		}	
		}	
	}
	 m_ctl.create_sensor_manifold(m_char.get_wrapper().pistol_tps, "AIM_SHOT_PISTOL_FPS", m_ctl.CT_SHOT,
    [mouse_press_sensor, touch_attack[1], view_sensor_tps_tmp, view_sensor_fps_tmp, m_char.get_wrapper().pistol_fps_sensor, gamepad_attack[0]], function(s){return (s[0] || s[1] || s[5] )&& !s[2]&& s[3]&& s[4]}, aim_shot_pistol_fps_cb);	
}
function laser_fps_direction()		{
		var crosshair_obj_tmp = m_char.get_wrapper().crosshair_obj;
		var laser_arm_fps= m_char.get_wrapper().laser_arm_fps;            
        var elapsed = m_ctl.create_elapsed_sensor();
        var laser_arm_fps_cb = function(obj, id, pulse) {   
		if (pulse)
		{
            var cross_view = m_trans.get_rotation(crosshair_obj_tmp, _quat_tmp);    
            var laser_dir = m_vec3.transformQuat(m_util.AXIS_MY, cross_view, _vec3_tmp);          
            laser_dir = m_vec3.scale(laser_dir, m_conf.MAX_LASER_LENGTH, _vec3_tmp);    
            var arm_quat = m_trans.get_rotation(laser_arm_fps, _quat_tmp);         
            var inv_arm_quat = m_quat.invert(arm_quat, _quat_tmp);
            laser_dir = m_vec3.transformQuat(laser_dir, inv_arm_quat, _vec3_tmp);    																	
           var laser_tsr = m_tsr.identity(_tsr_tmp);                  			
			if (laser_dir[0] < 0.1 * m_conf.MAX_LASER_LENGTH) {   
                laser_tsr = m_tsr.set_trans(laser_dir, _tsr_tmp);
            } else
            laser_tsr = m_tsr.identity(_tsr_tmp);
            if (laser_dir[0] > -0.1 * m_conf.MAX_LASER_LENGTH) {
                var laser_tsr = m_tsr.set_trans(laser_dir, _tsr_tmp);
                m_armat.set_bone_tsr(laser_arm_fps, "right_laser", laser_tsr);
            } else
                m_armat.set_bone_tsr(laser_arm_fps, "right_laser", laser_tsr);	
        }
			else  
			{
			}		
		} 
        m_ctl.create_sensor_manifold(laser_arm_fps, "LASER_ARM_FPS",
                m_ctl.CT_CONTINUOUS, [elapsed],null, laser_arm_fps_cb);        
} 
function laser_tps_direction()		{
		var crosshair_obj_tmp = m_char.get_wrapper().crosshair_obj;
		var laser_arm_tps= m_char.get_wrapper().rig;            
        var elapsed = m_ctl.create_elapsed_sensor();
        var laser_arm_tps_cb = function(obj, id, pulse) {   
		if (pulse)
		{
            var cross_view = m_trans.get_rotation(crosshair_obj_tmp, _quat_tmp); 
            var laser_dir = m_vec3.transformQuat(m_util.AXIS_MY, cross_view, _vec3_tmp);         
            laser_dir = m_vec3.scale(laser_dir, m_conf.MAX_LASER_LENGTH, _vec3_tmp);    
            var arm_quat = m_trans.get_rotation(laser_arm_tps, _quat_tmp);     
            var inv_arm_quat = m_quat.invert(arm_quat, _quat_tmp);
            laser_dir = m_vec3.transformQuat(laser_dir, inv_arm_quat, _vec3_tmp);     
            var laser_tsr = m_tsr.identity(_tsr_tmp);                  
			if (laser_dir[0] < 0.45 * m_conf.MAX_LASER_LENGTH) {   
                laser_tsr = m_tsr.set_trans(laser_dir, _tsr_tmp); 
            } else
            laser_tsr = m_tsr.identity(_tsr_tmp);
            if (laser_dir[0] > -0.45 * m_conf.MAX_LASER_LENGTH) {
                var laser_tsr = m_tsr.set_trans(laser_dir, _tsr_tmp);
                m_armat.set_bone_tsr(laser_arm_tps, "right_laser", laser_tsr);
            } else
                m_armat.set_bone_tsr(laser_arm_tps, "right_laser", laser_tsr);
        }
			else  
			{
			}
		} 
        m_ctl.create_sensor_manifold(laser_arm_tps, "LASER_ARM_TPS",
                m_ctl.CT_CONTINUOUS, [elapsed],null, laser_arm_tps_cb);  
} 
exports.process_gun_laser_tps_cb=process_gun_laser_tps_cb;
function process_gun_laser_tps_cb(mouse_press_sensor, touch_attack, view_sensor_tps_tmp,view_sensor_fps_tmp, gamepad_attack,current_tmp) {
		_char_attack_done=false  
		var aim_shot_gun_laser_tps_cb = function(obj, id, pulse) {  
	   if ((pulse==1) && (m_char.get_wrapper().state != m_conf.CH_ATTACK)&& (m_char.get_wrapper().gun_laser_tps_sensor)&&(!_char_attack_done)) {
            m_char.get_wrapper().state= m_conf.CH_ATTACK;                
			var payload = m_ctl.get_sensor_payload(obj, id, 0);  
		if  ((payload.which==m_conf.LEFT_MOUSE_BUTTON_ID)||(gamepad_attack[0])||(touch_attack)) {
			_char_attack_done=true;			
			m_anim.apply(m_char.get_wrapper().rig, "hunter_shotgunlasertps");  
            m_anim.set_behavior(m_char.get_wrapper().rig, m_anim.AB_FINISH_STOP);
            m_anim.play(m_char.get_wrapper().rig);    
			process_attack_gun_laser_tps_speakers(); 
			laser_tps_direction();  
			var time = m_ctl.get_sensor_value(obj, id, 5);  
			m_ctl.set_custom_sensor(_burst_fire_sensor, 1); 
			m_anim.apply(m_char.get_wrapper().laser_tps, "laser_strike"); 		     
		    m_anim.set_behavior(m_char.get_wrapper().laser_tps, m_anim.AB_FINISH_STOP);   
            m_anim.play(m_char.get_wrapper().laser_tps,finish_attack_cb);		
           _last_shoot_time = time;  
           _burst_time = time;  			 
            m_phy.set_character_move_dir(m_char.get_wrapper().phys_body, 0, 0);			
            _char_attack_done = false;			 
			}
		}	
	}
	var time = m_ctl.create_timeline_sensor();
	m_ctl.create_sensor_manifold(m_char.get_wrapper().gun_laser_tps, "AIM_SHOT_GUN_LASER_TPS", m_ctl.CT_SHOT,               
            [mouse_press_sensor, touch_attack[2], view_sensor_tps_tmp, view_sensor_fps_tmp, m_char.get_wrapper().gun_laser_tps_sensor,time, gamepad_attack[0]],
				function(s){return (s[0] || s[1] || s[6])&& s[2]&& !s[3]&& s[4]}, aim_shot_gun_laser_tps_cb);	
}   
exports.process_gun_laser_fps_cb=process_gun_laser_fps_cb;
function process_gun_laser_fps_cb(mouse_press_sensor, touch_attack, view_sensor_tps_tmp,view_sensor_fps_tmp, gamepad_attack,current_tmp) {
    _char_attack_done=false  	
		var aim_shot_gun_laser_fps_cb = function(obj, id, pulse) {  
        if ((pulse==1) && (m_char.get_wrapper().state != m_conf.CH_ATTACK)&& (m_char.get_wrapper().gun_laser_fps_sensor.value==1)&&(!_char_attack_done)) {
            m_char.get_wrapper().state= m_conf.CH_ATTACK;    		            
			var payload = m_ctl.get_sensor_payload(obj, id, 0);  
		if  ((payload.which==m_conf.LEFT_MOUSE_BUTTON_ID)||(touch_attack) || (gamepad_attack))  {			
			_char_attack_done=true;	
            m_anim.apply(m_char.get_wrapper().laser_arm_fps, "hunter_shotgunlaserfps");  
            m_anim.set_behavior(m_char.get_wrapper().laser_arm_fps, m_anim.AB_FINISH_STOP);
            m_anim.play(m_char.get_wrapper().laser_arm_fps);    
			process_attack_gun_laser_fps_speakers();  
			laser_fps_direction();  
			var time = m_ctl.get_sensor_value(obj, id, 5);  
			m_ctl.set_custom_sensor(_burst_fire_sensor, 1); 
		   m_anim.apply(m_char.get_wrapper().laser_fps, "laser_strike"); 		     
		    m_anim.set_behavior(m_char.get_wrapper().laser_fps, m_anim.AB_FINISH_STOP);  
            m_anim.play(m_char.get_wrapper().laser_fps, finish_attack_cb);						
		   _last_shoot_time = time;  
           _burst_time = time;  	
            m_phy.set_character_move_dir(m_char.get_wrapper().phys_body, 0, 0);			
            _char_attack_done = false;   
					}		
		}	
	}
	var time = m_ctl.create_timeline_sensor();
	m_ctl.create_sensor_manifold(m_char.get_wrapper().gun_laser_fps, "AIM_SHOT_GUN_LASER_FPS", m_ctl.CT_SHOT,
            [mouse_press_sensor, touch_attack[2], view_sensor_tps_tmp, view_sensor_fps_tmp, m_char.get_wrapper().gun_laser_fps_sensor, time, gamepad_attack[0]], 
			function(s){return (s[0] || s[1] || s[6])&& !s[2]&& s[3]&& s[4]}, aim_shot_gun_laser_fps_cb);	
}	
exports.process_punyos_tps_cb=process_punyos_tps_cb;
function process_punyos_tps_cb(key_enter, touch_attack, view_sensor_tps_tmp, view_sensor_fps_tmp, gamepad_attack, touch_fly)  {  
   var attack_punyos_tps_cb = function(obj, id, pulse) {
        if (((pulse == 1 && m_char.get_wrapper().state != m_conf.CH_ATTACK)) && (m_char.get_wrapper().punyos_tps_sensor.value==1)) {
            m_char.get_wrapper().state= m_conf.CH_ATTACK;    
			_char_attack_done=true;	
			if (_is_char_htoh)
		     console.log("no hay punyos para greek  todavia");
			else
			 console.log("ya ha sido aplicada en precache weapons para punyos");
			m_anim.play(m_char.get_wrapper().rig, finish_attack_cb,m_anim.SLOT_5);
			console.log("se ha de reproducir aqui la animacion de golpear con un machete o cuchillo en este caso punyos tps");
            m_phy.set_character_move_dir(m_char.get_wrapper().phys_body, 0, 0);
            _char_attack_done = false;
        }
    }																							  
	    m_ctl.create_sensor_manifold(m_char.get_wrapper().phys_body, "ATTACK_PUNYOS_TPS", m_ctl.CT_TRIGGER,     													
	        [key_enter[1], touch_attack[4], m_char.get_wrapper().punyos_tps_sensor, gamepad_attack[0]], function(s){return (s[0] || s[1] || s[3])&& s[2]}, attack_punyos_tps_cb);	
}
exports.process_punyos_fps_cb=process_punyos_fps_cb;
function process_punyos_fps_cb(key_enter, touch_attack, view_sensor_tps_tmp, view_sensor_fps_tmp, gamepad_attack, touch_fly)  {  
   var attack_punyos_fps_cb = function(obj, id, pulse) {
        if (((pulse == 1 && m_char.get_wrapper().state != m_conf.CH_ATTACK)) && (m_char.get_wrapper().punyos_fps_sensor.value==1)) {
            m_char.get_wrapper().state= m_conf.CH_ATTACK;    
			_char_attack_done=true;	
			if (_is_char_htoh)
		     console.log("no hay punyos para greek  todavia");
			else
			 console.log("ya ha sido aplicada en precache weapons para punyos");
			m_anim.play(m_char.get_wrapper().laser_arm_fps, finish_attack_cb,m_anim.SLOT_5);
			console.log("se ha de reproducir aqui la animacion de golpear con un machete o cuchillo en este caso punyos");
            m_phy.set_character_move_dir(m_char.get_wrapper().phys_body, 0, 0);
            _char_attack_done = false;
        }
    }																							  
	    m_ctl.create_sensor_manifold(m_char.get_wrapper().phys_body, "ATTACK_PUNYOS_FPS", m_ctl.CT_TRIGGER,     													
	        [key_enter[1], touch_attack[4], m_char.get_wrapper().punyos_fps_sensor, gamepad_attack[0]], function(s){return (s[0] || s[1] || s[3])&& s[2]}, attack_punyos_fps_cb);	
}
exports.process_sword_tps_cb=process_sword_tps_cb;
function process_sword_tps_cb(key_enter, touch_attack, view_sensor_tps_tmp, view_sensor_fps_tmp, gamepad_attack, touch_fly) {  
    var attack_sword_tps_cb = function(obj, id, pulse) {
        if (((pulse == 1 && m_char.get_wrapper().state != m_conf.CH_ATTACK)) && (m_char.get_wrapper().knife_tps_sensor.value==1)) {
            m_char.get_wrapper().state= m_conf.CH_ATTACK;    
			_char_attack_done=true;	
			if (_is_char_htoh)
			m_anim.apply(m_char.get_wrapper().rig, "attack_onehanded");  
			else
			m_anim.apply(m_char.get_wrapper().rig, "hunter_jabtps");			
			m_anim.set_behavior(m_char.get_wrapper().rig, m_anim.AB_FINISH_STOP);
            m_anim.play(m_char.get_wrapper().rig, finish_attack_cb);   
            m_phy.set_character_move_dir(m_char.get_wrapper().phys_body, 0, 0);
            _char_attack_done = false;
            process_attack_sword_speakers();
        }
    }																							  
	    m_ctl.create_sensor_manifold(m_char.get_wrapper().phys_body, "ATTACK_SWORD_TPS", m_ctl.CT_TRIGGER,     													
	        [key_enter[0], touch_attack[0], m_char.get_wrapper().knife_tps_sensor, gamepad_attack[0]], function(s){return (s[0] || s[1] || s[3])&& s[2]}, attack_sword_tps_cb);
 }
exports.process_sword_fps_cb=process_sword_fps_cb;
function process_sword_fps_cb(key_enter, touch_attack, view_sensor_tps_tmp, view_sensor_fps_tmp, gamepad_attack, touch_fly) {  
    var attack_sword_fps_cb = function(obj, id, pulse) {
        if (((pulse == 1) && (m_char.get_wrapper().state != m_conf.CH_ATTACK)) && (m_char.get_wrapper().knife_fps_sensor.value==1)) {
            m_char.get_wrapper().state= m_conf.CH_ATTACK;    
			_char_attack_done=true;	
			if (_is_char_htoh)
			m_anim.apply(m_char.get_wrapper().laser_arm_fps, "hunter_jab_fps");			
			else
			m_anim.apply(m_char.get_wrapper().laser_arm_fps, "hunter_jabfps");			
			m_anim.set_behavior(m_char.get_wrapper().laser_arm_fps, m_anim.AB_FINISH_STOP);
            m_anim.play(m_char.get_wrapper().laser_arm_fps, finish_attack_cb);   
			console.log("se ha de reproducir aqui la animacion de golpear con un machete o cuchillo");
            m_phy.set_character_move_dir(m_char.get_wrapper().phys_body, 0, 0);
            _char_attack_done = false;
            process_attack_sword_speakers();
        }
    }																							  
	    m_ctl.create_sensor_manifold(m_char.get_wrapper().phys_body, "ATTACK_SWORD_FPS", m_ctl.CT_TRIGGER,     													
	        [key_enter[0], touch_attack[0], m_char.get_wrapper().knife_fps_sensor, gamepad_attack[0]], function(s){return (s[0] || s[1] || s[3])&& s[2]}, attack_sword_fps_cb);
 } 
exports.process_damage_enemies_H2H_cb=process_damage_enemies_H2H_cb;
function process_damage_enemies_H2H_cb(elapsed,view_sensor_tps_tmp)    {     
	var damage_enemies_h2h_cb = function(obj, id, pulse) {
        if (m_char.get_wrapper().state != m_conf.CH_ATTACK)
            return; 
        if (!_char_attack_done) {  
			if (view_sensor_tps_tmp.value==1){
            var frame = m_anim.get_frame(m_char.get_wrapper().rig);  
            if (frame >= m_conf.CHAR_ATTACK_ANIM_FRAME) {
                var trans     = _vec3_tmp;
                var cur_dir   = _vec3_tmp_2;
                var at_pt     = _vec3_tmp_3;
                var cur_rot_q = _quat4_tmp;
                var at_dst = m_conf.CHAR_ATTACK_DIST;
                m_trans.get_translation(m_char.get_wrapper().phys_body, trans);
                m_trans.get_rotation(m_char.get_wrapper().phys_body, cur_rot_q);
                m_vec3.transformQuat(m_util.AXIS_MY, cur_rot_q, cur_dir);
                m_vec3.scaleAndAdd(trans, cur_dir, at_dst, at_pt);          
                if (m_combat.process_attack_on_enemies_htoh(at_pt, at_dst))
                    m_sfx.play(_char_sword_hit_spk,0,0);
                _char_attack_done = true;
            } 
		  }
		  else
		  {
			var frame = m_anim.get_frame(m_char.get_wrapper().laser_arm_fps);  
            if (frame >= 1) {   
                var trans     = _vec3_tmp;
                var cur_dir   = _vec3_tmp_2;
                var at_pt     = _vec3_tmp_3;
                var cur_rot_q = _quat4_tmp;
                var at_dst = m_conf.CHAR_ATTACK_DIST;
                m_trans.get_translation(m_char.get_wrapper().phys_body, trans);
                m_trans.get_rotation(m_char.get_wrapper().phys_body, cur_rot_q);
                m_vec3.transformQuat(m_util.AXIS_MY, cur_rot_q, cur_dir);
                m_vec3.scaleAndAdd(trans, cur_dir, at_dst, at_pt);          
                if (m_combat.process_attack_on_enemies_htoh(at_pt, at_dst))
                _char_attack_done = true;
		   }
          }
		}
    }
	 m_ctl.create_sensor_manifold(m_char.get_wrapper().phys_body, "DAMAGE_ENEMIES_HtoH", m_ctl.CT_CONTINUOUS,
        [elapsed], null, damage_enemies_h2h_cb);
}	
exports.process_damage_enemies_shoot_cb=process_damage_enemies_shoot_cb;
function process_damage_enemies_shoot_cb(view_sensor_tps_tmp, view_sensor_fps_tmp) {    
    var damage_enemies_shot_cb = function(obj, id, pulse) {    
        if (m_char.get_wrapper().state != m_conf.CH_ATTACK)
            return;            
     if (!_char_attack_done) {  															
        var time = m_ctl.get_sensor_value(obj, id, 0);  
        if (time - _burst_time > m_conf.BURST_LISER_TIME) {   												
				m_ctl.set_custom_sensor(_burst_fire_sensor, 0);  				           			
			}          
		var elapsed = m_ctl.get_sensor_value(obj, id, 1);
        var cross_pos = m_trans.get_translation(obj, _vec3_tmp);   
        var cross_view = m_trans.get_rotation(obj, _quat_tmp);		
function giro_crosh_for_asteroid_collision(cross_view_tmp) {
	  var forward_tmp=m_quat.create();
	var vec3_tmp2 = m_vec3.create(); 
		return  forward_tmp = m_vec3.transformQuat(m_util.AXIS_MY, cross_view_tmp, vec3_tmp2); 
}	
	var	forward=giro_crosh_for_asteroid_collision(cross_view);
        forward = m_vec3.scale(forward, m_conf.MAX_LASER_LENGTH, _vec3_tmp2);  
        forward = m_vec3.add(forward, cross_pos, forward);         
     var ray_test_cb = function(id, hit_fract, obj_hit, hit_time, hit_pos, hit_norm) { 			
			_char_attack_done = true;		
			switch (_current_weapon) {  
			case 3:  
			 _frame = m_anim.get_frame(m_char.get_wrapper().rig);  
			break;			
			case 2:  
			 _frame = m_anim.get_frame(m_char.get_wrapper().laser_tps);  
			break;			
			case 1:  
			 _frame = m_anim.get_frame(m_char.get_wrapper().rig);  
			break;			
			case 0:    
			 _frame = m_anim.get_frame(m_char.get_wrapper().rig);  
			break;
			} 
            if (_frame >= m_conf.CHAR_ATTACK_ANIM_FRAME) { 		
				if	(m_combat.process_attack_on_enemies_shot(obj_hit,0,elapsed))  
				{  				
					 if (m_sfx.is_playing(_char_sword_hit_spk))
						m_sfx.stop(_char_sword_hit_spk);  														
				_char_attack_done = false;					
				}				
			}  
			if (m_asteroids.get_wrapper())
          m_asteroids.damage_asteroid(obj_hit);		
		if (m_canon.get_wrappers())					
for (i=0; i<m_canon.get_wrappers().length; i++)				{
	var	canon=m_canon.get_wrappers()[i];
			 if (obj_hit==canon.body)
			 {
			 m_canon.kill(canon);		 
			 }			
	}
			   var barrel = m_scs.get_object_by_dupli_name("Barrel2", "plastic_barrel");
			   var explosion_barrel = m_scs.get_object_by_dupli_name("Barrel2", "explosion_barrel_person");
			 if (obj_hit==barrel)
			 { var posbarrel=m_vec3.create();
		           posbarrel=m_trans.get_translation(barrel,posbarrel);
				  console.log("el objeto barrel antes de la explosion estaba en la posicion o pto;"+posbarrel);
				 console.log("el pto de colision hit_pos, en la colision con barril producida es en:"+hit_pos);
					 if (m_sfx.is_playing(_char_sword_hit_spk))
						m_sfx.stop(_char_sword_hit_spk); 
					m_sfx.play(_explosion_barrel_spk,0,0); 
					m_scs.hide_object(barrel);  
					 m_anim.apply(explosion_barrel, "explosion");
					  m_anim.play(explosion_barrel);
			 }		
		if (m_aliens.get_wrappers())					
		for (i=0; i<m_aliens.get_wrappers().length; i++) 	{
		var	alien=m_aliens.get_wrappers()[i];
			if (obj_hit==alien.body)
				{
				m_aliens.kill(alien);		
				}
			}
		if (m_trex.get_wrappers())						
		   for (i=0; i<m_trex.get_wrappers().length; i++) 	{
    		var	trex=m_trex.get_wrappers()[i];			
			if (obj_hit==trex.body)
				{
				m_trex.kill(trex);					 
				}
	     	}
		}
	var id=m_phy.append_ray_test_ext(null, cross_pos, forward, "crash", ray_test_cb, true, true, true ,true);
		 }  
	}   
			var crosshair_obj = m_char.get_wrapper().crosshair_obj;	
			if (crosshair_obj) {               
			var time = m_ctl.create_timeline_sensor();  
			var elapsed = m_ctl.create_elapsed_sensor();			
			m_ctl.create_sensor_manifold(crosshair_obj, "DAMAGE_ENEMIES_SHOT", m_ctl.CT_POSITIVE,  
                [time, elapsed, _burst_fire_sensor], null, damage_enemies_shot_cb);  
		     }
}	
exports.crosshair_spawn_for_tps_vs_FPS=crosshair_spawn_for_tps_vs_FPS;
function crosshair_spawn_for_tps_vs_FPS(viewFPS,view_sensor_fps_tmp,view_sensor_tps_tmp, elapsed)	 {  
		var crosshair_obj = m_char.get_wrapper().crosshair_obj;  
        var cam_obj = m_scs.get_active_camera();
        var crosshair_cb = function(obj, id, pulse)    {	     	    
		if (viewFPS) {	 		
		m_scs.hide_object(m_char.get_wrapper().gun_laser_tps);
		m_scs.hide_object(m_char.get_wrapper().laser_tps);		
		var gun_to_camera_tmp=m_char.get_wrapper().gun_laser_empty;  		
		var cam_crossh_empty_tmp=m_char.get_wrapper().cam_crossh_empty;     
		var quat_tmp=m_quat.create();
            var cam_crossh_pos = m_trans.get_translation(cam_crossh_empty_tmp, _vec3_tmp2);
			m_trans.set_translation_v(obj,cam_crossh_pos);  
            var view = m_trans.get_rotation(cam_crossh_empty_tmp, _quat_tmp);
            var cross_view = m_trans.get_rotation(obj, _quat_tmp2);
            var elapsed_tmp = m_ctl.get_sensor_value(obj, id, 0);   
            var new_cross_view = m_quat.lerp(cross_view, view,  
                     m_conf.CROSSHAIR_DELAY * elapsed_tmp, _quat_tmp);        
           m_trans.set_rotation_v(obj, new_cross_view);															
			}		
        else        
		if (!viewFPS) {												
		var char_crossh=m_char.get_wrapper().crossh_empty;   
		var quat_tmp=m_quat.create();
		var vec3_tmp=m_vec3.create();		     
			var vec3_tmp3=m_vec3.create();			
            var char_crossh_pos = m_trans.get_translation(char_crossh, _vec3_tmp2);
			  m_trans.set_translation_v(obj, char_crossh_pos);		
            var view = m_trans.get_rotation(char_crossh, _quat_tmp);
            var cross_view = m_trans.get_rotation(obj, _quat_tmp2);
            var elapsed_tmp = m_ctl.get_sensor_value(obj, id, 0);  		
            var new_cross_view = m_quat.lerp(cross_view, view,  
                    m_conf.CROSSHAIR_DELAY * elapsed_tmp, _quat_tmp);        
            m_trans.set_rotation_v(obj, new_cross_view);
		}  
	  }  
		    m_ctl.create_sensor_manifold(m_char.get_wrapper().crosshair_obj, "CROSSHAIR",             
			                    m_ctl.CT_CONTINUOUS, [elapsed], function(s) {return s[0]}, crosshair_cb); 
}	
})