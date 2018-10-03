"use strict"
if (b4w.module_check("combat"))
    throw "Failed to register module: combat";
b4w.register("combat", function(exports, require) {
var m_trans = require("transform");
var m_vec3  = require("vec3");
var m_quat      = require("quat");
var m_ctl = require("controls");
var m_phy = require("physics");
var m_trans = require("transform");
var m_util  = require("util");
var m_asteroids= require("asteroids");
var m_conf  = require("game_config");
var _vec3_tmp = new Float32Array(3);
var _vec3_tmp3 = m_vec3.create();  
var _vec3_tmp2 = m_vec3.create(); 
var _quat_tmp = m_quat.create();  
var _enemies=[];  
exports.set_enemies = function(enemies) {  
		var enemies_tmp=enemies;
		  for (var i = 0; i < enemies_tmp.length; i++) {
			var enemis_inc=[];
			enemis_inc=enemies_tmp[i];
			_enemies.push(enemis_inc);
        }
}
exports.process_attack_on_enemies_htoh = function(at_pt, at_dst) {           
  for (var i = 0; i < _enemies.length; i++) {  
	   var en = _enemies[i];                   
        if (en.hp <= 0)     
            continue;
		var enemi = en.empty;			
        if (check_attack_htoh(at_pt, enemi, at_dst)) {   
		en.hp -= m_conf.CHAR_ATTACK_STR;  
            return true;
        }		
    }
    return false;
}
exports.process_attack_on_enemies_shot = function(obj_hit,elapsed) {           
  for (var i = 0; i < _enemies.length; i++) {  
	   var en = _enemies[i];  
	if (obj_hit==en.body) {  
        if (en.hp <= 0)     
            continue;
		console.log("el objeto golpeado con crash collision id es un trex: "+obj_hit.name)
			console.log("era:"+en.hp);										
		en.hp -= m_conf.CHAR_ATTACK_STR;  
			console.log("la vida actual del enemigo:"+en.name);
			console.log("es:"+en.hp);								
            return true;
	}	
  }
    return false;
}
exports.check_attack_htoh = check_attack_htoh;              
function check_attack_htoh(at_pt, targ, dist) {   
    var targ_trans = _vec3_tmp;
    m_trans.get_translation(targ, targ_trans);   
    var targ_dist_to_at_pt = m_vec3.distance(targ_trans, at_pt);  
    if (targ_dist_to_at_pt < dist)             
        return true;
    return false;
}
exports.check_attack_shot=check_attack_shot;
function check_attack_shot(obj_hit,elapsed) {  
   if (obj_hit)   
	   return true;
return false;
}
exports.get_wrapper = function() {
    return _enemies;
}
})