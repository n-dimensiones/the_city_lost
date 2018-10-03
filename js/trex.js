if (b4w.module_check("trex"))
    throw "Failed to register module: trex";
b4w.register("trex", function(exports, require) {
var m_ctl   = require("controls");
var m_scs   = require("scenes");
var m_anim  = require("animation");
var m_sfx   = require("sfx");
var m_trans = require("transform");
var m_util  = require("util");
var m_vec3  = require("vec3");
var m_quat  = require("quat");
var m_phy   = require("physics");
var m_conf     = require("game_config");
var m_char     = require("character2");
var m_combat   = require("combat");
var m_obelisks = require("obelisks");
var m_bonuses  = require("bonuses");
//var m_gems     = require("gems");
var _trex_wrappers = [];     
var _vec3_tmp   = new Float32Array(3);
var _vec3_tmp_2 = new Float32Array(3);
var _vec3_tmp_3 = new Float32Array(3);
var _quat4_tmp  = new Float32Array(4);
var _quat4_tmp2 = new Float32Array(4);
var _trex_spawn_timer = 0;
var _spawn_point=[];
var _vec3_tmp_4   = new Float32Array(3);
var _vec3_tmp_5 = new Float32Array(3);
exports.init = function(elapsed_sensor,trex_empty,data_id) {
    _trex_spawn_timer = m_conf.TREXS_SPAWN_INTERVAL;  
var empty_name;
	if (!trex_empty)
    for (var i = 0; i < m_conf.TREX_EMPTIES.length; i++) {  
         empty_name = m_conf.TREX_EMPTIES[i];   
        var trex_empty = m_scs.get_object_by_name(empty_name);
        var trex = m_scs.get_object_by_dupli_name(empty_name, "trex_collider");
        var trex_rig = m_scs.get_object_by_dupli_name(empty_name, "trex_rig");
        var trex_wrapper = init_trex_wrapper(trex, trex_rig, trex_empty); 
        trex_wrapper.walk_speaker = m_scs.get_object_by_dupli_name(empty_name,
                                                  m_conf.TREX_WALK_SPEAKER);
		 trex_wrapper.idle_speaker = m_scs.get_object_by_dupli_name(empty_name,
                                                  m_conf.TREX_IDLE_SPEAKER);										  
        trex_wrapper.attack_speaker = m_scs.get_object_by_dupli_name(empty_name,
                                                  m_conf.TREX_ATTACK_SPEAKER);
        trex_wrapper.hit_speaker = m_scs.get_object_by_dupli_name(empty_name,
                                                  m_conf.TREX_HIT_SPEAKER);
        trex_wrapper.getout_speaker = m_scs.get_object_by_dupli_name(empty_name,
                                                  m_conf.TREX_GETOUT_SPEAKER);
        m_ctl.create_sensor_manifold(trex_wrapper, "TREX_AI", m_ctl.CT_CONTINUOUS,
                                     [elapsed_sensor], null, trex_ai_cb);    
        _trex_wrappers.push(trex_wrapper);   
    }
	 else
	 {
empty_name=trex_empty.name;  
        var trex_empty_tmp = m_scs.get_object_by_name(empty_name,data_id);
        var trex = m_scs.get_object_by_dupli_name(empty_name, "trex_collider",data_id);
        var trex_rig = m_scs.get_object_by_dupli_name(empty_name, "trex_rig",data_id);
        var trex_wrapper = init_trex_wrapper(trex, trex_rig, trex_empty_tmp); 
        trex_wrapper.walk_speaker = m_scs.get_object_by_dupli_name(empty_name,
                                                  m_conf.TREX_WALK_SPEAKER,data_id);
		 trex_wrapper.idle_speaker = m_scs.get_object_by_dupli_name(empty_name,
                                                  m_conf.TREX_IDLE_SPEAKER,data_id);										  
        trex_wrapper.attack_speaker = m_scs.get_object_by_dupli_name(empty_name,
                                                  m_conf.TREX_ATTACK_SPEAKER,data_id);
        trex_wrapper.hit_speaker = m_scs.get_object_by_dupli_name(empty_name,
                                                  m_conf.TREX_HIT_SPEAKER,data_id);
        trex_wrapper.getout_speaker = m_scs.get_object_by_dupli_name(empty_name,
                                                  m_conf.TREX_GETOUT_SPEAKER,data_id);
        m_ctl.create_sensor_manifold(trex_wrapper, "TREX_AI", m_ctl.CT_CONTINUOUS,
                                     [elapsed_sensor], null, trex_ai_cb, data_id);    
        _trex_wrappers.push(trex_wrapper);
	 }
    m_combat.set_enemies(_trex_wrappers);
}
function init_trex_wrapper(body, rig, empty) {   
    return {
        body: body,
        rig: rig,
        empty: empty,
        hp: m_conf.TREX_HP,    
        island_id: -1,    
        dest_point: 0,
        dest_pos: new Float32Array(3),
        last_target: m_conf.TT_POINT,              
        state: m_conf.TS_NONE,
        attack_point: new Float32Array(3),
        attack_done: false,
        walk_speaker: null,
		idle_speaker: null,
        attack_speaker: null,
        hit_speaker: null,
		name: "trex",  
        getout_speaker: null
    }
}
function play_idle_cb(obj,id,pulse) {
	 var gw = _trex_wrappers[0];
    if (!m_sfx.is_playing(gw.idle_speaker)) {
        m_sfx.play_def(gw.idle_speaker);
    }
}
function trex_ai_cb(trex_wrapper, id) {  
    if (trex_wrapper.hp <= 0) {          
        kill(trex_wrapper);
        return;
    }
 switch (trex_wrapper.state) {
 case m_conf.TS_ATTACKING:
        process_attack(trex_wrapper);
        break;
 case m_conf.TS_WALKING:
        var elapsed = m_ctl.get_sensor_value(trex_wrapper, id, 0);
	var char_wrapper = m_char.get_wrapper();  
	var trex_empty = trex_wrapper.empty;
    var trans       = _vec3_tmp_4;
    var targ_trans  = _vec3_tmp_5;
    m_trans.get_translation(trex_empty, trans);
    m_trans.get_translation(char_wrapper.phys_body, targ_trans);
    targ_trans[2] = trans[2];
    var dist_to_char = Math.floor(m_vec3.distance(trans, targ_trans));
        if (dist_to_char == 10) 
		{
			set_state(trex_wrapper, m_conf.TS_IDLE);	  
		}
      else 	
	  {  
		  play_idle_cb;
		  move(trex_wrapper, elapsed);  
	  }
        break;
case m_conf.TS_IDLE:  
        var elapsed = m_ctl.get_sensor_value(trex_wrapper, id, 0);
		var empty_name=m_conf.TREX_EMPTIES[0];			
		var idle_spk = m_scs.get_object_by_dupli_name(empty_name, m_conf.TREX_IDLE_SPEAKER);
		var idle_duration = m_sfx.get_duration(idle_spk) * m_sfx.get_playrate(idle_spk);
		m_ctl.create_sensor_manifold(null, "IDLE_TREX", m_ctl.CT_SHOT,            
        [m_ctl.create_timer_sensor(0)], null, play_idle_cb);															
        break;	
    default:
        break;
    }
}
exports.init_spawn = function(elapsed_sensor) {   
    var spawn_points = [];
    var spawn_quats = [];   
   for (var i = 0; i < m_conf.TREX_SPAWN_POINTS.length; i++) {    
        var spawn_obj = m_scs.get_object_by_name(m_conf.TREX_SPAWN_POINTS[i]);  
        var spawn_pos = m_trans.get_translation(spawn_obj);
        var spawn_rot = m_trans.get_rotation(spawn_obj);
        spawn_points.push(spawn_pos);  
        spawn_quats.push(spawn_rot);
    }
    function trex_spawn_cb(obj, id) {  
        var trex_wrapper = get_first_free_trex();
        if (!trex_wrapper)
            return;
        var elapsed = m_ctl.get_sensor_value(obj, id, 0);   
        _trex_spawn_timer -= elapsed;   
        if (_trex_spawn_timer <= 0) {
            _trex_spawn_timer = m_conf.TREXS_SPAWN_INTERVAL;  
            var island_id = get_random_available_island();  
            if (island_id == null) 
                return;
            spawn(trex_wrapper, island_id, spawn_points, spawn_quats);  
        }
    }
    m_ctl.create_sensor_manifold(null, "TREX_SPAWN", m_ctl.CT_CONTINUOUS,
                                 [elapsed_sensor], null, trex_spawn_cb);  
}
function spawn(trex_wrapper, island_id, spawn_points, spawn_quats) {  
    var trex_empty = trex_wrapper.empty;
    var num_spawns = spawn_points.length / m_conf.NUM_ISLANDS;  
    var spawn_id = Math.floor(Math.random() * num_spawns);    
    var spawn_pt_id = num_spawns * island_id + spawn_id;
    var spawn_point = spawn_points[spawn_pt_id];
	 _spawn_point=spawn_point;
    var spawn_quat = spawn_quats[spawn_pt_id];
    m_trans.set_translation_v(trex_empty, spawn_point);
    m_trans.set_rotation_v(trex_empty, spawn_quat);
    set_state(trex_wrapper, m_conf.TS_GETTING_OUT);
    m_sfx.play_def(trex_wrapper.getout_speaker);         
    trex_wrapper.island_id = island_id;        
    trex_wrapper.dest_pos.set(spawn_point);  
}
exports.kill=kill;
function kill(trex_wrapper) {  
    var trex = trex_wrapper.empty;  
    var trex_rig = trex_wrapper.rig;   
    var trans = _vec3_tmp;
    var quat = _quat4_tmp;
    m_anim.apply(trex_rig, "trex_death");
	m_anim.set_behavior(trex_rig, m_anim.AB_FINISH_STOP);
	m_anim.play(trex_rig); 
	console.log("deberiamos ver la animacon death del trex ")
    m_sfx.stop(trex_wrapper.walk_speaker);  
	setTimeout(function() { 
	m_trans.set_translation_v(trex, m_conf.DEFAULT_POS);
//	m_gems.spawn(trans);
	 trex_wrapper.island_id = -1;
    trex_wrapper.hp = 100;  
    set_state(trex_wrapper, m_conf.TS_NONE);
    m_obelisks.change_gems_num(trex_wrapper.island_id, 0);
	},6000);
}
function process_attack(trex_wrapper) {                       
    if (!trex_wrapper.attack_done) {
        var frame = m_anim.get_frame(trex_wrapper.rig);   
        if (frame >= m_conf.TREX_ATTACK_ANIM_FRAME) {   
            if (trex_wrapper.last_target == m_conf.TT_CHAR)      
                process_trex_char_attack(trex_wrapper);
            else if (trex_wrapper.last_target == m_conf.TT_OBELISK)   
                process_trex_obelisk_attack(trex_wrapper);
            trex_wrapper.attack_done = true;
        }
    }
}
function process_trex_char_attack(trex_wrapper) {   
    if(!m_combat.check_attack_htoh(trex_wrapper.attack_point,   
       m_char.get_wrapper().phys_body, m_conf.TREX_ATTACK_DIST))     
        return;
    var damage = m_conf.TREX_ATTACK_STRENGTH;  
    if (m_bonuses.shield_time_left() > 0)
        damage *= m_conf.BONUS_SHIELD_EFFECT;    
    m_char.change_hp(-damage);
    m_sfx.play_def(trex_wrapper.hit_speaker);
}
function process_trex_obelisk_attack(trex_wrapper) {
    var island_id = trex_wrapper.island_id;
    if (m_obelisks.num_gems(island_id))
        m_obelisks.damage_obelisk(island_id);
    m_sfx.play_def(trex_wrapper.hit_speaker);
}
function move(trex_wrapper, elapsed) {
    var char_wrapper = m_char.get_wrapper();
    var island_id = trex_wrapper.island_id;
    if (char_wrapper.island == island_id && char_wrapper.hp > 0) {
        attack_target(trex_wrapper, char_wrapper.phys_body, elapsed);
        trex_wrapper.last_target = m_conf.TT_CHAR;
    } 
//	else if (m_obelisks.num_gems(island_id)) {
//        var obelisk = get_obelisk_by_island_id(island_id);
//        attack_target(trex_wrapper, obelisk, elapsed);
//        trex_wrapper.last_target = m_conf.TT_OBELISK;
//    } 
   else {
        patrol(trex_wrapper, elapsed);
    }
}
function attack_target(trex_wrapper, target, elapsed) {
    var trex_empty = trex_wrapper.empty;
    var trans       = _vec3_tmp;
    var targ_trans  = _vec3_tmp_2;
    m_trans.get_translation(trex_empty, trans);
    m_trans.get_translation(target, targ_trans);
    targ_trans[2] = trans[2];
    trex_wrapper.dest_pos.set(targ_trans);
    var dist_to_targ = m_vec3.distance(trans, targ_trans);
    var angle_to_targ = rotate_to_dest(trex_wrapper, elapsed);
    if (dist_to_targ >= m_conf.TREX_ATTACK_DIST)
        translate(trex_wrapper, elapsed);
    else if (angle_to_targ < 0.05 * Math.PI)
        perform_attack(trex_wrapper);
}
function perform_attack(trex_wrapper) {
    var trex_empty = trex_wrapper.empty;
    var at_pt       = trex_wrapper.attack_point;
    var trans       = _vec3_tmp;
    var cur_dir     = _vec3_tmp_2;
    trex_wrapper.attack_done = false;
    set_state(trex_wrapper, m_conf.TS_ATTACKING)
    m_trans.get_translation(trex_empty, trans);
    m_vec3.scaleAndAdd(trans, cur_dir, m_conf.TREX_ATTACK_DIST, at_pt);
    at_pt[2] += 0.3; 
    if (m_sfx.is_playing(trex_wrapper.walk_speaker))
        m_sfx.stop(trex_wrapper.walk_speaker);
    m_sfx.play_def(trex_wrapper.attack_speaker);
}
function patrol(trex_wrapper, elapsed) {
    set_dest_point(trex_wrapper);
    rotate_to_dest(trex_wrapper, elapsed);
    translate(trex_wrapper, elapsed);
}
function set_dest_point(trex_wrapper) {
    var trex_empty = trex_wrapper.empty;
    var dest_pos = trex_wrapper.dest_pos;  
    var trans = _vec3_tmp;
    m_trans.get_translation(trex_empty, trans);  
    var dist_to_dest = m_vec3.distance(trans, dest_pos);
    if (dist_to_dest > 0.05 && trex_wrapper.last_target == m_conf.TT_POINT)
        return;
    trex_wrapper.last_target = m_conf.TT_POINT;    
    trex_set_random_destination(trex_wrapper, trans);
}
function trex_set_random_destination(trex_wrapper, trans) {
    var dest_pos = trex_wrapper.dest_pos;  
    var dest_point = trex_wrapper.dest_point
    var island_id = trex_wrapper.island_id;
    var rand = Math.random();
    var point_ind = Math.floor(m_conf.POINTS_PER_ISL * rand);   
    var pind = 0;
    for (var i = 0; i < m_conf.POINTS_PER_ISL; i++) {
        if (i != dest_point && pind++ == point_ind) {
            var new_pind  = m_conf.POINTS_PER_ISL * island_id + i;
            var point_name = m_conf.TREX_PATROL_POINTS[new_pind];
            var point_obj  = m_scs.get_object_by_name(point_name);
            m_trans.get_translation(point_obj, dest_pos);
            dest_pos[2] = trans[2];
            trex_wrapper.dest_point = i;
            return;
        }
    }
    trex_wrapper.dest_point = -1;
}
function rotate_to_dest(trex_wrapper, elapsed) {
    var trex_empty = trex_wrapper.empty;
    var dest_pos = trex_wrapper.dest_pos;
    var trans       = _vec3_tmp;
    var cur_dir     = _vec3_tmp_2;
    var dir_to_dest = _vec3_tmp_3;
    var cur_rot_q   = _quat4_tmp;
    var new_rot_q   = _quat4_tmp2;
    m_trans.get_translation(trex_empty, trans);
    m_trans.get_rotation(trex_empty, cur_rot_q);
    m_vec3.transformQuat(m_util.AXIS_MY, cur_rot_q, cur_dir);
    m_vec3.subtract(dest_pos, trans, dir_to_dest);
    m_vec3.normalize(dir_to_dest, dir_to_dest);
    m_quat.rotationTo(cur_dir, dir_to_dest, new_rot_q);
    m_quat.multiply(new_rot_q, cur_rot_q, new_rot_q);
    var vec_dot = m_vec3.dot(cur_dir, dir_to_dest);
    vec_dot = vec_dot > 1? 1: vec_dot < -1? -1: vec_dot;
    var angle_to_turn = Math.acos(vec_dot);
    var angle_ratio   = Math.abs(angle_to_turn) / Math.PI;
    var slerp         = elapsed / angle_ratio * m_conf.TREX_ROT_SPEED;
    m_quat.slerp(cur_rot_q, new_rot_q, Math.min(slerp, 1), new_rot_q);
    m_trans.set_rotation_v(trex_empty, new_rot_q);
    return angle_to_turn
}
function translate(trex_wrapper, elapsed) {
    var trans     = _vec3_tmp;
    var cur_dir   = _vec3_tmp_2;
    var cur_rot_q = _quat4_tmp;
    var empty = trex_wrapper.empty;
    var walk_speaker = trex_wrapper.walk_speaker;
	var idle_speaker = trex_wrapper.idle_speaker;
    m_trans.get_rotation(empty, cur_rot_q);
    m_trans.get_translation(empty, trans);
    m_vec3.transformQuat(m_util.AXIS_MY, cur_rot_q, cur_dir);
    m_vec3.scaleAndAdd(trans, cur_dir, m_conf.TREX_SPEED * elapsed, trans);
    m_trans.set_translation_v(empty, trans);
    if (!m_sfx.is_playing(walk_speaker)) {
		m_sfx.stop(idle_speaker); 
        m_sfx.play_def(walk_speaker);
        m_sfx.cyclic(walk_speaker, true);
    }
}
function set_state(trex_wrapper, state) {
    var trex_rig = trex_wrapper.rig;
    switch (state) {
    case m_conf.TS_WALKING:
        m_anim.apply(trex_rig, "trex_walk");    
        m_anim.set_behavior(trex_rig, m_anim.AB_CYCLIC);
        m_anim.play(trex_rig);
        break;
    case m_conf.TS_ATTACKING:
        var rand = Math.floor(3 * Math.random()) + 1;
        m_anim.apply(trex_rig, "trex_atack_0" + rand);  
        m_anim.play(trex_rig, function() {
            if (trex_wrapper.state != m_conf.TS_NONE)
                set_state(trex_wrapper, m_conf.TS_WALKING);
        });
        break;
    case m_conf.TS_GETTING_OUT:
        m_anim.apply(trex_rig, "trex_getout");   
        m_anim.play(trex_rig, function() {
            if (trex_wrapper.state != m_conf.TS_NONE)
                set_state(trex_wrapper, m_conf.TS_WALKING)
        });
        break;
    case m_conf.TS_IDLE:   
        m_anim.apply(trex_rig, "trex_idle");   
												m_anim.apply(trex_rig, "trex_idle"); 
        m_anim.play(trex_rig, function() {
            if (trex_wrapper.state != m_conf.TS_NONE)   
                set_state(trex_wrapper, m_conf.TS_WALKING)
        });
        break;
    }
    trex_wrapper.state = state;
}
function get_first_free_trex() {
    for (var i = 0; i < _trex_wrappers.length; i++) {
        var gw = _trex_wrappers[i];
        if (gw.state == m_conf.TS_NONE)
            return gw;
    }
    return null;
}
function get_random_available_island() {        
    var num_free = m_conf.NUM_ISLANDS;
    for (var i = 0; i < _trex_wrappers.length; i++) {
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
    for (var i = 0; i < _trex_wrappers.length; i++)
        if (_trex_wrappers[i].island_id == island_id)               
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
	_trex_spawn_timer = m_conf.TREXS_SPAWN_INTERVAL;  
    for (var i = 0; i < _trex_wrappers.length; i++) {
        var gw = _trex_wrappers[i];
        gw.island_id = -1;
        set_state(gw, m_conf.TS_NONE)
        var trex = gw.empty;
		var quad=m_quat.create();
		m_phy.set_transform(gw.body, _spawn_point[i], quad);   
        m_sfx.stop(gw.walk_speaker); 
    }
}
exports.island_has_trex = function(island_id) {  
    for (var i = 0; i < _trex_wrappers.length; i++)
        if (_trex_wrappers[i].island_id == island_id)
            return true;
    return false;
}
exports.get_wrappers = function() { 
    return _trex_wrappers;
}
})