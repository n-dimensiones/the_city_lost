if (b4w.module_check("aliens"))
    throw "Failed to register module: aliens";           
b4w.register("aliens", function(exports, require) {
var m_ctl   = require("controls");
var m_scs   = require("scenes");
var m_anim  = require("animation");
var m_sfx   = require("sfx");
var m_trans = require("transform");
var m_util  = require("util");
var m_vec3  = require("vec3");
var m_quat  = require("quat");
var m_conf     = require("game_config");
var m_char     = require("character2");
var m_combat   = require("combat");
var m_obelisks = require("obelisks");
var m_bonuses  = require("bonuses");
//var m_gems     = require("gems");
var m_resources = require("resources");
var m_phy = require("physics");   
var _vec3_tmp   = new Float32Array(3);  
var _vec3_tmp_2 = new Float32Array(3);
var _vec3_tmp_3 = new Float32Array(3);
var _quat4_tmp  = new Float32Array(4); 
var _quat4_tmp2 = new Float32Array(4);
var _vec3_tmp_4   = new Float32Array(3);
var _vec3_tmp_5 = new Float32Array(3);
var _quat_tmp = m_quat.create();  
var _aliens_spawn_timer = 0;
var _spawn_point=[];
var _aliens_wrappers = [];     
var _is_shot_alien_distance_to_char=false;  
var _gun_alien_speaker_strike=null;
var _idle_speaker=null;
var _elapsed=0;   
var _obj_hit = null;   
var _laser_tps = null;
var _burst_time=0;  
var _frame=0; 
var _burst_fire_sensor = m_ctl.create_custom_sensor(0);  
var _proximity_to_char_sensor = m_ctl.create_custom_sensor(0);   
var _idem_island_sensor = m_ctl.create_custom_sensor(0);  
exports.init = function(elapsed_sensor,alien_empty,data_id) {   
					_aliens_spawn_timer = m_conf.ALIENS_SPAWN_INTERVAL;  
	var empty_name;
	if (!alien_empty)   
	for (var i = 0; i < m_conf.ALIENS_EMPTIES.length; i++) {  
		 empty_name=m_conf.ALIENS_EMPTIES[i];		
		var alien_empty = m_scs.get_object_by_name(empty_name);  
        var alien_body = m_scs.get_object_by_dupli_name(empty_name, "alien_collider");
        var alien_rig = m_scs.get_object_by_dupli_name(empty_name, "alien_rig");
        var alien_wrapper = init_alien_wrapper(alien_body, alien_rig, alien_empty); 
        alien_wrapper.walk_speaker = m_scs.get_object_by_dupli_name(empty_name,
                                                  m_conf.ALIEN_WALK_SPEAKER);
		alien_wrapper.idle_speaker = m_scs.get_object_by_dupli_name(empty_name,
                                                  m_conf.ALIEN_IDLE_SPEAKER);											
        alien_wrapper.attack_speaker = m_scs.get_object_by_dupli_name(empty_name,
                                                  m_conf.ALIEN_ATTACK_SPEAKER);
        alien_wrapper.hit_speaker = m_scs.get_object_by_dupli_name(empty_name,
                                                  m_conf.ALIEN_HIT_SPEAKER);
        alien_wrapper.getout_speaker = m_scs.get_object_by_dupli_name(empty_name,
                                                  m_conf.ALIEN_GETOUT_SPEAKER);
        alien_wrapper.gun_alien_speaker_strike = m_scs.get_object_by_dupli_name(empty_name,
                                                  m_conf.ALIEN_SPEAKER_LASER_STRIKE);												  
		_gun_alien_speaker_strike=alien_wrapper.gun_alien_speaker_strike;
		_idle_speaker = alien_wrapper.idle_speaker;
		alien_wrapper.gun_alien = m_scs.get_object_by_dupli_name(empty_name, "gun_alien");
		alien_wrapper.laser_tps=  m_scs.get_object_by_dupli_name(empty_name, "laser_tps");  
		_laser_tps= alien_wrapper.laser_tps;		 	
		m_anim.apply(_laser_tps, "laser_strike");
		m_anim.set_behavior(_laser_tps, m_anim.AB_CYCLIC);			
        m_anim.play(_laser_tps);
		m_scs.hide_object(_laser_tps);
        m_ctl.create_sensor_manifold(alien_wrapper, "ALIEN", m_ctl.CT_CONTINUOUS,     
                                     [elapsed_sensor], null, alien_ai_cb);    
        _aliens_wrappers.push(alien_wrapper);   
	}
	else                                                             
		{
        empty_name=alien_empty.name;  
							console.log("elalien cargado del json es esperemos alien, veamos si esa si es: "+alien_empty.name);
        var alien_empty_tmp = m_scs.get_object_by_name(empty_name,data_id);   
        var alien_body = m_scs.get_object_by_dupli_name(empty_name, "alien_collider",data_id);
        var alien_rig = m_scs.get_object_by_dupli_name(empty_name, "alien_rig",data_id);
        var alien_wrapper = init_alien_wrapper(alien_body, alien_rig, alien_empty_tmp); 
        alien_wrapper.walk_speaker = m_scs.get_object_by_dupli_name(empty_name,
                                                  m_conf.ALIEN_WALK_SPEAKER,data_id);
        alien_wrapper.attack_speaker = m_scs.get_object_by_dupli_name(empty_name,		
                                                  m_conf.ALIEN_ATTACK_SPEAKER,data_id);
		alien_wrapper.idle_speaker = m_scs.get_object_by_dupli_name(empty_name,
                                                  m_conf.ALIEN_IDLE_SPEAKER,data_id);	
        alien_wrapper.hit_speaker = m_scs.get_object_by_dupli_name(empty_name,
                                                  m_conf.ALIEN_HIT_SPEAKER,data_id);
        alien_wrapper.getout_speaker = m_scs.get_object_by_dupli_name(empty_name,
                                                  m_conf.ALIEN_GETOUT_SPEAKER,data_id);
		alien_wrapper.gun_alien_speaker_strike = m_scs.get_object_by_dupli_name(empty_name,
                                                  m_conf.ALIEN_SPEAKER_LASER_STRIKE);											  
	_gun_alien_speaker_strike=alien_wrapper.gun_alien_speaker_strike;
		_idle_speaker = alien_wrapper.idle_speaker;
		alien_wrapper.gun_alien = m_scs.get_object_by_dupli_name(empty_name, "gun_alien");
		alien_wrapper.laser_tps=  m_scs.get_object_by_dupli_name(empty_name, "laser_tps");  
		_laser_tps= alien_wrapper.laser_tps;		 	
		m_anim.apply(_laser_tps, "laser_strike");
		m_anim.set_behavior(_laser_tps, m_anim.AB_CYCLIC);			
        m_anim.play(_laser_tps);
		m_scs.hide_object(_laser_tps);
        m_ctl.create_sensor_manifold(alien_wrapper, "ALIEN", m_ctl.CT_CONTINUOUS,
                                     [elapsed_sensor], null, alien_ai_cb);    
        _aliens_wrappers.push(alien_wrapper);   
      }  
    m_combat.set_enemies(_aliens_wrappers);
}
function init_alien_wrapper(body, rig, empty) {   
    return {
        body: body,    
        rig: rig,
        empty: empty,
        hp: m_conf.ALIEN_HP,    
        island_id: -1,    
        dest_point: 0,                 
        dest_pos: new Float32Array(3),     
        last_target: m_conf.AT_POINT,              
        state: m_conf.AS_NONE,
        attack_point: new Float32Array(3),
        attack_done: false,
        walk_speaker: null,
		idle_speaker: null,
        attack_speaker: null,
        hit_speaker: null,
        getout_speaker: null,
		gun_alien_speaker_strike: null,
		gun_alien: null,
		laser_tps: null
    }
}
function play_idle_cb(obj,id,pulse) {
    if (!m_sfx.is_playing(_idle_speaker)) {
        m_sfx.play_def(_idle_speaker);
    }
}
function alien_ai_cb(alien_wrapper, id) { 
	var char_wrapper = m_char.get_wrapper();	
    var island_id = alien_wrapper.island_id;
    if (char_wrapper.island == island_id)  
			{		
			_idem_island=1; 		
			 m_ctl.set_custom_sensor(_idem_island_sensor, 1);	
		   }  				
			else
				if (char_wrapper.island != island_id) {	
				_idem_island=0;		
				 m_ctl.set_custom_sensor(_idem_island_sensor, 0);	
				}
    if (alien_wrapper.hp <= 0) {          
        kill(alien_wrapper);
        return;
    }
    switch (alien_wrapper.state) {
   case m_conf.AS_ATTACKING:  
	    var elapsed = m_ctl.get_sensor_value(alien_wrapper, id, 0);
        process_attack(alien_wrapper,elapsed);  
        break;
	case m_conf.AS_WALKING:   
        var elapsed = m_ctl.get_sensor_value(alien_wrapper, id, 0);
    var char_wrapper = m_char.get_wrapper();  
	var alien_empty = alien_wrapper.empty;
    var trans       = _vec3_tmp_4;
    var targ_trans  = _vec3_tmp_5;
    m_trans.get_translation(alien_empty, trans);
    m_trans.get_translation(char_wrapper.phys_body, targ_trans);
    targ_trans[2] = trans[2];
    alien_wrapper.dest_pos.set(targ_trans);   
    var dist_to_char = Math.floor(m_vec3.distance(trans, targ_trans));
        if (dist_to_char == 10) 
		{
			set_state(alien_wrapper, m_conf.AS_IDLE);	  
		}
      else 	
	  {  
		  move(alien_wrapper, elapsed);  
	  }
        break;
	 case m_conf.AS_IDLE:  
        var elapsed = m_ctl.get_sensor_value(alien_wrapper, id, 0);
		var empty_name=m_conf.ALIENS_EMPTIES[0];		  
		var idle_duration = m_sfx.get_duration(_idle_speaker) * m_sfx.get_playrate(_idle_speaker);
		m_ctl.create_sensor_manifold(null, "IDLE_ALIEN", m_ctl.CT_SHOT,
        [m_ctl.create_timer_sensor(0)], null, play_idle_cb);				
        break;	
    default:
        break;
    }
}
exports.init_spawn = function(elapsed_sensor) {   
    var spawn_points = [];
    var spawn_quats = [];   
   for (var i = 0; i < m_conf.ALIEN_SPAWN_POINTS.length; i++) {    
        var spawn_obj = m_scs.get_object_by_name(m_conf.ALIEN_SPAWN_POINTS[i]);
        var spawn_pos = m_trans.get_translation(spawn_obj);
        var spawn_rot = m_trans.get_rotation(spawn_obj);
        spawn_points.push(spawn_pos);  
        spawn_quats.push(spawn_rot);
    }
    function aliens_spawn_cb(obj, id) {  
        var alien_wrapper = get_first_free_alien();
        if (!alien_wrapper)
            return;
        var elapsed = m_ctl.get_sensor_value(obj, id, 0);   
        _aliens_spawn_timer -= elapsed;   
        if (_aliens_spawn_timer <= 0) {
            _aliens_spawn_timer = m_conf.ALIENS_SPAWN_INTERVAL;  
            var island_id = get_random_available_island();
            if (island_id == null) 
                return;
            spawn(alien_wrapper, island_id, spawn_points, spawn_quats);  
        }
    }
    m_ctl.create_sensor_manifold(null, "ALIENS_SPAWN", m_ctl.CT_CONTINUOUS,
                                 [elapsed_sensor], null, aliens_spawn_cb);  
}
function spawn(alien_wrapper, island_id, spawn_points, spawn_quats) {
    var alien_empty = alien_wrapper.empty;
    var num_spawns = spawn_points.length / m_conf.NUM_ISLANDS;  
    var spawn_id = Math.floor(Math.random() * num_spawns);    
    var spawn_pt_id = num_spawns * island_id + spawn_id;
    var spawn_point = spawn_points[spawn_pt_id];
	_spawn_point=spawn_point;
    var spawn_quat = spawn_quats[spawn_pt_id];
    m_trans.set_translation_v(alien_empty, spawn_point);
    m_trans.set_rotation_v(alien_empty, spawn_quat);    
    set_state(alien_wrapper, m_conf.AS_GETTING_OUT)
    m_sfx.play_def(alien_wrapper.getout_speaker);         
    alien_wrapper.island_id = island_id;        
    alien_wrapper.dest_pos.set(spawn_point);  
}
exports.kill=kill;
function kill(alien_wrapper) {  
    var alien = alien_wrapper.empty;
    var alien_death_empty = m_scs.get_object_by_name(m_conf.ALIENS_DEATH_EMPTY);
    var alien_death_rig = m_scs.get_object_by_dupli_name(m_conf.ALIENS_DEATH_EMPTY,
                                                     m_conf.ALIENS_DEATH_RIG);
	var trans = _vec3_tmp;
    var quat = _quat4_tmp;
    m_trans.get_translation(alien, trans);  
    m_trans.get_rotation(alien, quat);
    m_trans.set_translation_v(alien_death_empty, trans);  
    m_trans.set_rotation_v(alien_death_empty, quat);    
    m_anim.apply(alien_death_rig, "alien_death");
    m_anim.set_behavior(alien_death_rig, m_anim.AB_FINISH_STOP);
    m_anim.play(alien_death_rig);
    m_sfx.stop(alien_wrapper.walk_speaker);  
		setTimeout(function() { 
    m_trans.set_translation_v(alien, m_conf.DEFAULT_POS);
 //   m_gems.spawn(trans);
    alien_wrapper.island_id = -1;
    alien_wrapper.hp = 100;
    set_state(alien_wrapper, m_conf.AS_NONE);   
    m_obelisks.change_gems_num(alien_wrapper.island_id, 0);
		},6000);
}
function attack_anims(alien_wrapper) {
	var alien_rig=alien_wrapper.rig;
       if ((_is_shot_alien_distance_to_char)&&(!alien_wrapper.attack_done))
	   {		
		  var time = m_ctl.create_timeline_sensor();	
		m_ctl.set_custom_sensor(_burst_fire_sensor, 1);  
		   rotate_to_dest(alien_wrapper, 1);  
        m_anim.apply(alien_rig, "alien_walk");   
		m_anim.set_behavior(alien_rig, m_anim.AB_STOP);
		m_anim.play(alien_rig);
		if 	(!m_sfx.is_playing(_gun_alien_speaker_strike))		
					m_sfx.play_def(_gun_alien_speaker_strike);   
		m_scs.show_object(_laser_tps);  
		m_anim.apply(alien_rig, "alien_shot");   
		m_anim.set_behavior(alien_rig, m_anim.AB_CYCLIC);
		m_anim.play(alien_rig, function() {
            if (alien_wrapper.state != m_conf.AS_NONE)   
			{
			_last_shoot_time = time;  
			_burst_time = time;   
				_is_shot_alien_distance_to_char=false;
		        alien_wrapper.attack_done=false;
				set_state(alien_wrapper, m_conf.AS_WALKING);
				alien_wrapper.state =m_conf.AS_WALKING;
			}	
        });
	   }
	   else
		   if ((!_is_shot_alien_distance_to_char)&&(!alien_wrapper.attack_done))
	   {
        var rand = Math.floor(3 * Math.random()) + 1; 
        m_anim.apply(alien_rig, "alien_atack_0" + rand);   
        m_anim.play(alien_rig, function() {
            if (alien_wrapper.state != m_conf.AS_NONE)
                set_state(alien_wrapper, m_conf.AS_WALKING);
        });
		_is_shot_alien_distance_to_char=true;
		alien_wrapper.attack_done=false;
	   } 
}
function process_damage_char_shoot_cb(alien_wrapper,elapsed)  {  
   var damage_char_shot_cb = function(obj, id, pulse) {    
        if (alien_wrapper.state != m_conf.AS_ATTACKING)
		{
            return;
		}	
   if (!alien_wrapper.attack_done) { 
        var time = m_ctl.get_sensor_value(obj, id, 0);   
        if (time - _burst_time > m_conf.BURST_LISER_TIME) {     
				m_ctl.set_custom_sensor(_burst_fire_sensor, 0);  
			}          
	var elapsed = m_ctl.get_sensor_value(obj, id, 1);   
    var cross_pos = m_trans.get_translation(obj, _vec3_tmp);
    var cross_view = m_trans.get_rotation(obj, _quat_tmp);
    var forward_tmp=m_quat.create();
	var vec3_tmp2 = m_vec3.create(); 
	var enemis=m_combat.get_wrapper();
	var	forward = m_vec3.transformQuat(m_util.AXIS_MY, cross_view, vec3_tmp2);  
        forward = m_vec3.scale(forward, m_conf.MAX_LASER_LENGTH_GUN_ALIEN, vec3_tmp2);  
        forward = m_vec3.add(forward, cross_pos, forward);         
     var ray_test_cb = function(id, hit_fract, obj_hit, hit_time) { 
		 _obj_hit=obj_hit;   
		 if(!m_combat.check_attack_shot(obj_hit,elapsed))	
			 return;
		alien_wrapper.attack_done = true;			
 		 _frame = m_anim.get_frame(alien_wrapper.rig);  
       if (_frame >= m_conf.ALIEN_ATTACK_ANIM_FRAME) {    
		if (m_combat.check_attack_shot(_obj_hit,elapsed))	{	
		 var damage = m_conf.ALIEN_ATTACK_STRENGTH;  
		 m_char.change_hp(-damage*0.01);   
	    alien_wrapper.attack_done = false;	
				}
		}  
	 }
	 var id = m_phy.append_ray_test(null, cross_pos, forward,          
                "CHARACTER", ray_test_cb, true);                     
  }  
 }   
        	var gun_obj = alien_wrapper.body;  
			if (gun_obj) {               
			var time = m_ctl.create_timeline_sensor();  
			var elapsed = m_ctl.create_elapsed_sensor();
			m_ctl.create_sensor_manifold(gun_obj, "DAMAGE_CHAR_SHOT", m_ctl.CT_POSITIVE,   
                [time, elapsed, _burst_fire_sensor], null, damage_char_shot_cb); 
		     }
}	
function process_attack(alien_wrapper,elapsed) {                       
				attack_target(alien_wrapper,elapsed);  
			function process_shot_alien_cb(obj,id,pulse)  
			{
				attack_anims(obj);
			}
				process_damage_char_shoot_cb(alien_wrapper);   
              m_ctl.create_sensor_manifold(alien_wrapper, "ATTACK_SHOT_ALIEN", m_ctl.CT_SHOT,  
        [_proximity_to_char_sensor, _idem_island_sensor], function(s) {return s[0] && s[1]}, process_shot_alien_cb);	
}
function process_alien_char_attack(alien_wrapper) {   
    if  ((!m_combat.check_attack_htoh(alien_wrapper.attack_point,   
       m_char.get_wrapper().phys_body, m_conf.ALIEN_ATTACK_DIST))||(!m_combat.check_attack_shot(_obj_hit)))  
        return;
    var damage = m_conf.ALIEN_ATTACK_STRENGTH;  
    if (m_bonuses.shield_time_left() > 0)
        damage *= m_conf.BONUS_SHIELD_EFFECT;    
    m_char.change_hp(-damage);
				if 	((!m_sfx.is_playing(_gun_alien_speaker_strike))&&(_is_shot_alien_distance_to_char))
					m_sfx.stop(_gun_alien_speaker_strike);   
				else	(!m_sfx.is_playing(alien_wrapper.hit_speaker))  
				    m_sfx.play_def(alien_wrapper.hit_speaker);  
}
function process_alien_obelisk_attack(alien_wrapper) {
    var island_id = alien_wrapper.island_id;
    if (m_obelisks.num_gems(island_id))
        m_obelisks.damage_obelisk(island_id);
    m_sfx.play_def(alien_wrapper.hit_speaker);
}
function attack_target(alien_wrapper,elapsed) {
	alien_wrapper.last_target = m_conf.AT_CHAR;
	var char_wrapper = m_char.get_wrapper();
	var target= char_wrapper.phys_body;	
	var alien_empty = alien_wrapper.empty;
    var trans       = _vec3_tmp;
    var targ_trans  = _vec3_tmp_2;
    m_trans.get_translation(alien_empty, trans);  
    m_trans.get_translation(target, targ_trans);  
    targ_trans[2] = trans[2];   
    alien_wrapper.dest_pos.set(targ_trans);
    var dist_to_targ = m_vec3.distance(trans, targ_trans);
    var angle_to_targ = rotate_to_dest(alien_wrapper, elapsed);   
	_elapesd=elapsed;
    if (dist_to_targ >= m_conf.ALIEN_ATTACK_DIST)  
	{  var rand = Math.floor(3 * Math.random()) + 1; 
	_is_shot_alien_distance_to_char=true;		
	 m_ctl.set_custom_sensor(_proximity_to_char_sensor, 1);	
}
else if (angle_to_targ < 0.05 * Math.PI)
	{
		_is_shot_alien_distance_to_char=false;  
		perform_attack(alien_wrapper);   
		 m_ctl.set_custom_sensor(_proximity_to_char_sensor, 0);	
	}
}
function move(alien_wrapper, elapsed) {
    var char_wrapper = m_char.get_wrapper();
    var island_id = alien_wrapper.island_id;
    if (char_wrapper.island == island_id && char_wrapper.hp > 0) {
    alien_wrapper.state = m_conf.AS_ATTACKING;
     set_state(alien_wrapper, m_conf.AS_ATTACKING);  
	}
//     else if (m_obelisks.num_gems(island_id)) {
//        var obelisk = get_obelisk_by_island_id(island_id);
//        alien_wrapper.last_target = m_conf.AT_OBELISK;
//    } 
  else {
        patrol(alien_wrapper, elapsed);   
    }
}
function perform_attack(alien_wrapper) {
    var alien_empty = alien_wrapper.empty;
    var at_pt       = alien_wrapper.attack_point;
    var trans       = _vec3_tmp;
    var cur_dir     = _vec3_tmp_2;
    alien_wrapper.attack_done = false;
    set_state(alien_wrapper, m_conf.AS_ATTACKING);
    m_trans.get_translation(alien_empty, trans);
    m_vec3.scaleAndAdd(trans, cur_dir, m_conf.ALIEN_ATTACK_DIST, at_pt);
    at_pt[2] += 0.3; 
    if (m_sfx.is_playing(alien_wrapper.walk_speaker))
        m_sfx.stop(alien_wrapper.walk_speaker);
    m_sfx.play_def(alien_wrapper.attack_speaker);
}
function patrol(alien_wrapper, elapsed) {      
    set_dest_point(alien_wrapper);
    rotate_to_dest(alien_wrapper, elapsed);  
    translate(alien_wrapper, elapsed);  
}
function set_dest_point(alien_wrapper) { 
    var alien_empty = alien_wrapper.empty;
    var dest_pos = alien_wrapper.dest_pos;  
    var trans = _vec3_tmp;  
    m_trans.get_translation(alien_empty, trans);  
    var dist_to_dest = m_vec3.distance(trans, dest_pos);   
    if (dist_to_dest > 0.05 && alien_wrapper.last_target == m_conf.AT_POINT)  
        return;
    alien_wrapper.last_target = m_conf.AT_POINT;    
	alien_set_random_destination(alien_wrapper, trans);                
}
function alien_set_random_destination(alien_wrapper, trans) {  
    var dest_pos = alien_wrapper.dest_pos;    
    var dest_point = alien_wrapper.dest_point   
    var island_id = alien_wrapper.island_id;       
    var rand = Math.random();
    var point_ind = Math.floor(m_conf.POINTS_PER_ISL * rand);   
    var pind = 0;
    for (var i = 0; i < m_conf.POINTS_PER_ISL; i++) {  
        if (i != dest_point && pind++ == point_ind) {
            var new_pind  = m_conf.POINTS_PER_ISL * island_id + i;
            var point_name = m_conf.ALIEN_PATROL_POINTS[new_pind];  
            var point_obj  = m_scs.get_object_by_name(point_name);   
            m_trans.get_translation(point_obj, dest_pos);  
            dest_pos[2] = trans[2];  
            alien_wrapper.dest_point = i;  
            return;
        }
    }
    alien_wrapper.dest_point = -1;  
}
function rotate_to_dest(alien_wrapper, elapsed) {
    var alien_empty = alien_wrapper.empty;
    var dest_pos = alien_wrapper.dest_pos;  
    var trans       = _vec3_tmp;
    var cur_dir     = _vec3_tmp_2;
    var dir_to_dest = _vec3_tmp_3;
    var cur_rot_q   = _quat4_tmp;
    var new_rot_q   = _quat4_tmp2;
    m_trans.get_translation(alien_empty, trans);
    m_trans.get_rotation(alien_empty, cur_rot_q);       
    m_vec3.transformQuat(m_util.AXIS_MY, cur_rot_q, cur_dir);  
    m_vec3.subtract(dest_pos, trans, dir_to_dest);         
    m_vec3.normalize(dir_to_dest, dir_to_dest);           
    m_quat.rotationTo(cur_dir, dir_to_dest, new_rot_q);   
    m_quat.multiply(new_rot_q, cur_rot_q, new_rot_q);
    var vec_dot = m_vec3.dot(cur_dir, dir_to_dest);
    vec_dot = vec_dot > 1? 1: vec_dot < -1? -1: vec_dot;
    var angle_to_turn = Math.acos(vec_dot);
    var angle_ratio   = Math.abs(angle_to_turn) / Math.PI;
    var slerp         = elapsed / angle_ratio * m_conf.ALIEN_ROT_SPEED;
    m_quat.slerp(cur_rot_q, new_rot_q, Math.min(slerp, 1), new_rot_q);
    m_trans.set_rotation_v(alien_empty, new_rot_q);
    return angle_to_turn
}
function translate(alien_wrapper, elapsed) {   
    var trans     = _vec3_tmp;  
    var cur_dir   = _vec3_tmp_2;
    var cur_rot_q = _quat4_tmp;  
    var empty = alien_wrapper.empty;
    var walk_speaker = alien_wrapper.walk_speaker;
    m_trans.get_rotation(empty, cur_rot_q);
    m_trans.get_translation(empty, trans);  
    m_vec3.transformQuat(m_util.AXIS_MY, cur_rot_q, cur_dir);   
    m_vec3.scaleAndAdd(trans, cur_dir, m_conf.ALIEN_SPEED * elapsed, trans);  
    m_trans.set_translation_v(empty, trans);                
if (!m_sfx.is_playing(walk_speaker))
{   
	m_sfx.play_def(walk_speaker);
	m_sfx.cyclic(walk_speaker, true);
} 
}
function set_state(alien_wrapper, state) {  
    var alien_rig = alien_wrapper.rig;
    switch (state) {
    case m_conf.AS_WALKING:     
		m_scs.hide_object(_laser_tps);  
        m_anim.apply(alien_rig, "alien_walk")
        m_anim.set_behavior(alien_rig, m_anim.AB_CYCLIC);
        m_anim.play(alien_rig);  
        break;
    case m_conf.AS_ATTACKING:   
	attack_anims(alien_wrapper);
        break;
    case m_conf.AS_GETTING_OUT:   
        m_anim.apply(alien_rig, "alien_getout");
        m_anim.play(alien_rig, function() {
            if (alien_wrapper.state != m_conf.AS_NONE)
			{
				set_state(alien_wrapper, m_conf.AS_WALKING);
				alien_wrapper.state =m_conf.AS_WALKING;
			}
        });
        break;
    case m_conf.AS_IDLE:   
       if (!m_sfx.is_playing(_idle_speaker))								
		   m_sfx.is_playing(_idle_speaker);
		m_scs.hide_object(_laser_tps);  
		m_anim.apply(alien_rig, "alien_idle");   
												  m_anim.apply(alien_rig, "alien_idle"); 
        m_anim.play(alien_rig, function() {
            if (alien_wrapper.state != m_conf.AS_NONE)   
			{
				set_state(alien_wrapper, m_conf.AS_WALKING);
				alien_wrapper.state =m_conf.AS_WALKING;
			}	
        });
        break;
    }
    alien_wrapper.state = state;
}
function get_first_free_alien() {
    for (var i = 0; i < _aliens_wrappers.length; i++) {
        var gw = _aliens_wrappers[i];
        if (gw.state == m_conf.AS_NONE)  
            return gw;
    }
    return null;
}
function get_random_available_island() {        
    var num_free = m_conf.NUM_ISLANDS;
    for (var i = 0; i < _aliens_wrappers.length; i++) {
        if (!is_available_island(i))
            num_free--;  
    }
    if (num_free == 0)
        return null;
    var id = Math.floor(Math.random() * num_free);  
    var free_id = 0;
    for (var i = 0; i < m_conf.NUM_ISLANDS; i++) {
        if (is_available_island(i) && free_id++ == id)    
                return i;
    }
    return null;
}
function is_available_island(island_id) {  
    for (var i = 0; i < _aliens_wrappers.length; i++)
        if (_aliens_wrappers[i].island_id == island_id)               
            return false;
        if (m_obelisks.is_filled(island_id))        
            return false;
    return true;
}
function get_obelisk_by_island_id(island_id) {
    var obelisk = m_scs.get_object_by_dupli_name("obelisk_" + island_id,
                                                 "obelisk");
    return obelisk;
}
exports.reset = function() {  
	_aliens_spawn_timer = m_conf.ALIENS_SPAWN_INTERVAL;  
    for (var i = 0; i < _aliens_wrappers.length; i++) {
        var gw = _aliens_wrappers[i];
        gw.island_id = -1;
        set_state(gw, m_conf.AS_NONE)
        var alien = gw.empty;
        m_sfx.stop(gw.walk_speaker); 
		var quad=m_quat.create();
		m_phy.set_transform(gw.body, _spawn_point[i], quad);   
    }
}
exports.island_has_aliens = function(island_id) {  
    for (var i = 0; i < _aliens_wrappers.length; i++)
        if (_aliens_wrappers[i].island_id == island_id)
            return true;
    return false;
}
exports.get_wrappers = function() { 
    return _aliens_wrappers;
}
})