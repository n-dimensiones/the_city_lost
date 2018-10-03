if (b4w.module_check("animals"))
    throw "Failed to register module: animals";
b4w.register("animals", function(exports, require) {
var m_scs= require("scenes");
var m_npc_ai= require("npc_ai");
var m_trans= require("transform");  
var m_anim= require("animation");
var m_conf= require("game_config");
 exports.init= function() {
	var alien_emptys=["alien.003"];  	    
        for (var i = 0; i < alien_emptys.length; i++)   
            rig = m_scs.get_object_by_dupli_name(alien_emptys[i], "alien_rig"),
            body = m_scs.get_object_by_dupli_name(alien_emptys[i], "alien_body"),
            collider = m_scs.get_object_by_dupli_name(alien_emptys[i], "alien_collider"),
            empty = m_scs.get_object_by_name(alien_emptys[i]),
            body && (alien_struct = { 
				 path: [[1, 1, 0], [1, 2, 0], [2, 1, 0], [0, 0, 0]],
                delay: [0, 1, 1, 1],     
                actions: {
                    idle: ["alien_idle"],    
                    move: ["alien_walk"],
                    run: ["alien_walk"]
                },
                obj: body,
                rig: rig,
                collider: collider,
                empty: empty,
                speed: 0.5,          
                random: !0,                                     
                type: m_npc_ai.NT_WALKING,   
                rot_speed: .8          
            },
            m_npc_ai.new_event_track(alien_struct));
			console.log("se creo el alien como animal");
	var trex_emptys=["trex.006"];  	    
        for (var i = 0; i < trex_emptys.length; i++)   
            rig = m_scs.get_object_by_dupli_name(trex_emptys[i], "trex_rig"),
            trex = m_scs.get_object_by_dupli_name(trex_emptys[i], "trex_body"),
            trex_collider = m_scs.get_object_by_dupli_name(trex_emptys[i], "trex_collider"),
            empty = m_scs.get_object_by_name(trex_emptys[i]),
            trex && (trex_struct = { 
				 path: [[1, 1, 0], [1, 2, 0], [2, 1, 0], [0, 0, 0]],
                delay: [0, 1, 1, 1],     
                actions: {
                    idle: ["trex_idle"],    
                    move: ["trex_walk"],
                    run: ["trex_run"]
                },
                obj: trex,
                rig: rig,
                collider: trex_collider,
                empty: empty,
                speed: 0.5,          
                random: !0,                                     
                type: m_npc_ai.NT_WALKING,   
                rot_speed: .8          
            },
            m_npc_ai.new_event_track(trex_struct));
			console.log("se creo el trex como animal");
 }	
})			