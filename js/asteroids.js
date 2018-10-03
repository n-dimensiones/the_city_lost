if (b4w.module_check("asteroids"))
    throw "Failed to register module: asteroids";
b4w.register("asteroids", function(exports, require) {
var m_scs       = require("scenes");
var m_cons		= require("constraints");  
var m_obj       = require("objects");
var m_ctl       = require("controls");
var m_anim      = require("animation");
var m_trans     = require("transform");
var m_sfx       = require("sfx");
var m_quat      = require("quat");
var m_vec3      = require("vec3");
var m_phy   = require("physics");
var m_mat       = require("material");
var m_print     = require("print");
var m_conf = require("game_config");
var m_combat = require("combat");  
var ASTEROID_DEFAULT_SPEED = 20;
var ASTEROID_DEFAULT_TARGET_OFFSET = 3;
var ASTEROID_DEFAULT_SPAWN_OFFSET = 20;
var ASTEROID_MAX_SPEED = 40;
var ENV_SPHERE_ROT_FACTOR = 1 / 512;
var EPSILON_DISTANCE = 0.0001;
var _asteroid_speed = ASTEROID_DEFAULT_SPEED;
var _vec3_tmp = m_vec3.create();  
var _vec3_tmp2 = m_vec3.create(); 
var _quat_tmp = m_quat.create();  
var _quat_tmp2 = m_quat.create();  
var QUAT4_IDENT = new Float32Array([0,0,0,1]);			
var _asteroid_list = [];   
function int_to_str_length(num, length) {  
    var r = "" + num;   
    while (r.length < length)
        r = "0" + r;
    return r;
}
function init_asteroid(name, asteroid_empty, asteroid_arm, asteroid_copy_obj,
        asteroid_emitter_obj, asteroid_copy_mesh_obj, asteroid_speaker) {     
    var asteroid = {
        name: name,
        empty: asteroid_empty,          
        ast_arm: asteroid_arm,
        ast_copy_obj: asteroid_copy_obj,   
        body: asteroid_copy_mesh_obj,   
        ast_emitter_obj: asteroid_emitter_obj,
        ast_speaker: asteroid_speaker,
        active: false,
        angular_velosity: m_quat.create(),
        velosity: m_vec3.create(),
        hp: m_conf.ASTEROID_HP,
        is_destroyed: false
    }
    return asteroid;
}
exports.get_asteroid_by_name=get_asteroid_by_name;  
function get_asteroid_by_name(name) {  
    for (var i = 0; i < _asteroid_list.length; i++)
        if (_asteroid_list[i].name == name)
            return _asteroid_list[i];
}
exports.init= init;
function init() {
    for (var i = 0; i < m_conf.ASTEROID_EMPTIES; i++) {    
        var name = "asteroid." + int_to_str_length(i, 3);
        var asteroid_empty = m_scs.get_object_by_name(name);  
        if (asteroid_empty) {
            var asteroid_children = m_scs.get_object_children(asteroid_empty);  
            var asteroid_arm = null;
            var asteroid_emitter_obj = null;
            var asteroid_speaker = null;
			 var asteroid__mesh_obj = null;
            for (var j = 0; j < asteroid_children.length; j++) {
                if (m_obj.is_armature(asteroid_children[j])) {
                    asteroid_arm = asteroid_children[j];
                } 
				if (m_scs.get_object_name(asteroid_children[j]) == "explosion_emitter") {   
                    asteroid_emitter_obj = asteroid_children[j];
                } 
				if (m_obj.is_speaker(asteroid_children[j])) {
                    asteroid_speaker = asteroid_children[j];
                } 
				if (m_obj.is_mesh(asteroid_children[j])) {   
                    asteroid_mesh_obj = asteroid_children[j];   
				}	
            }
		var asteroid = init_asteroid(name, asteroid_empty, asteroid_arm,
                    asteroid_empty, asteroid_emitter_obj,      
                    asteroid_mesh_obj, asteroid_speaker);
           _asteroid_list.push(asteroid);
        }   
    }  
m_combat.set_enemies(_asteroid_list);   
}
exports.damage_asteroid=damage_asteroid;    
function damage_asteroid(asteroid){    
    var name = m_scs.get_object_name_hierarchy(asteroid)[0];
    var dupli_name = m_scs.get_object_name_hierarchy(asteroid)[1];   
    var asteroid = get_asteroid_by_name(name);
    if (asteroid && !asteroid.is_destroyed) {
		console.log("si vemos este mensaje se supone debiamos ver que hay colision con el asteroide pero hay problemas posteriores para no explotar");
		anims_y_sound_asteroid_damage(asteroid,dupli_name);      
    }  
}
function compile_asteroid(obj) {
    var name = m_scs.get_object_name_hierarchy(obj)[0];
    var asteroid = get_asteroid_by_name(name);
    asteroid.is_destroyed = false;
    init_asteroid_transform(asteroid);
}
function anims_y_sound_asteroid_damage(asteroid,dupli_name) {
        if (asteroid.hp < 0) {
            m_vec3.set(0, 0, 0, asteroid.velosity);
            m_quat.identity(asteroid.angular_velosity);
            var ast_arm = asteroid.ast_arm;
            if (ast_arm) {
                m_anim.apply(ast_arm, dupli_name + "_disruption");   
                m_anim.play(ast_arm, compile_asteroid);
            }
            var ast_copy_mesh_obj = asteroid.body;
            if (ast_copy_mesh_obj) {
                m_anim.apply(ast_copy_mesh_obj, "asteroid_fading");   
                m_anim.play(ast_copy_mesh_obj);
            }
            var emitter = asteroid.ast_emitter_obj;
            if (emitter) {
                var trans = m_trans.get_translation(asteroid.empty, _vec3_tmp);
                m_trans.set_translation_v(emitter, trans);
                m_anim.apply(emitter, "explosion"); 
                m_anim.play(emitter);
            }
            var speaker = asteroid.ast_speaker;
            if (speaker) {
                var trans = m_trans.get_translation(asteroid.empty, _vec3_tmp);
                m_trans.set_translation_v(speaker, trans);
                m_sfx.play_def(speaker);
            }
            asteroid.is_destroyed = true;
        }   
}
exports.init_asteroid_transform=init_asteroid_transform;  
function init_asteroid_transform(asteroid) {
    var ast_obj = asteroid.empty;
    var spawn_coord = _vec3_tmp;
    spawn_coord[0] = 0;
    spawn_coord[1] = 1000;
    spawn_coord[2] = 0;
    var ident_quat = m_quat.identity(_quat_tmp);
    m_trans.set_translation_v(ast_obj, spawn_coord);
    var ast_copy_obj = asteroid.ast_copy_obj;
    if (ast_copy_obj)
        m_trans.set_translation_v(ast_copy_obj, spawn_coord);
    m_vec3.set(0, 0, 0, asteroid.velosity);
    m_quat.identity(asteroid.angular_velosity);
    asteroid.active = false;
    asteroid.hp = m_conf.ASTEROID_HP;   
}
exports.spawn_asteroid_random_pos=spawn_asteroid_random_pos; 
function spawn_asteroid_random_pos(asteroid, cam_coord) {
    asteroid.active = true;
    var target_coord = m_vec3.copy(cam_coord, _vec3_tmp2);
    target_coord[0] += ASTEROID_DEFAULT_TARGET_OFFSET * (2 * Math.random() - 1);
    target_coord[1] = 0;
    target_coord[2] += ASTEROID_DEFAULT_TARGET_OFFSET * (2 * Math.random() - 1);
    var spawn_coord = m_vec3.copy(cam_coord, _vec3_tmp);
    spawn_coord[0] += ASTEROID_DEFAULT_SPAWN_OFFSET * (2 * Math.random() - 1);
    spawn_coord[1] = 100;
    spawn_coord[2] += ASTEROID_DEFAULT_SPAWN_OFFSET * Math.random() / 2;
    var ast_obj = asteroid.empty;
    m_trans.set_translation_v(ast_obj, spawn_coord);
    var ast_copy_obj = asteroid.ast_copy_obj;
    if (ast_copy_obj)
        m_trans.set_translation_v(ast_copy_obj, spawn_coord);
    var dir = m_vec3.subtract(target_coord, spawn_coord, _vec3_tmp2);
    m_vec3.normalize(dir, dir);
    var velocity = m_vec3.scale(dir, _asteroid_speed, dir);
    _asteroid_speed = _asteroid_speed < ASTEROID_MAX_SPEED?
            _asteroid_speed + 1: _asteroid_speed;
    var cockpit_mesh_obj = m_cockpit.get_wrapper().cockpit_mesh_obj;
    if (cockpit_mesh_obj)
        m_mat.set_nodemat_value(cockpit_mesh_obj, ["screen", "speed"],
                1 - 0.1 * ((_asteroid_speed - ASTEROID_DEFAULT_SPEED) /
                (ASTEROID_MAX_SPEED - ASTEROID_DEFAULT_SPEED) * 8 % 8));
    m_vec3.copy(velocity, asteroid.velosity);
    var axis = m_vec3.set(2 * Math.random() - 1, 2 * Math.random() - 1, 2 * Math.random() - 1, _vec3_tmp);
    asteroid.angular_velosity = m_quat.setAxisAngle(axis,
            Math.PI * (2 * Math.random() - 1) * 10, asteroid.angular_velosity);
}
exports.reset = function() {  
    for (var i = 0; i < _asteroid_list.length; i++) {
        var gw = _asteroid_list[i];
var quad=m_quat.create();
var POS_char = new Float32Array(3);   
m_trans.get_translation(gw.empty, POS_char);	
m_trans.get_rotation(gw.empty,quad);
m_phy.set_transform(gw.body, POS_char, quad);   
m_scs.show_object(gw.ast_copy_obj);
m_scs.show_object(gw.body);
    }
}
exports.get_wrapper=get_wrapper;
function 	 get_wrapper() {
	return _asteroid_list;
}
})