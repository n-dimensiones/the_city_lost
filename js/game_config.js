if (b4w.module_check("game_config"))
    throw "Failed to register module: game_config";
b4w.register("game_config", function(exports, require) {		
exports.ASSETS_PATH = "assets/";
exports.LEVEL_LOAD_DELAY = 1.5;  
exports.NUM_ISLANDS = 1;
exports.DEFAULT_POS = new Float32Array([0, 0, 1]);  
exports.GEM_OFFSET = new Float32Array([0, 0, 0.25]);
exports.GEM_ROT_OFFSET = new Float32Array([0, 0, 0, 1]);
exports.GEM_SCALE_OFFSET = 0.6;
exports.SIDE_SPEED=1;
exports.ROT_SPEED = 2;
exports.CAM_SOFTNESS = 0.2;
exports.CAM_SOFTNESS_VEHICLE = 0.0;                    
exports.CAM_OFFSET = new Float32Array([0, 4, 0.5]);   
exports.CAM_OFFSET_COL_WALLS = new Float32Array([0, 1, 0.5]);
exports.CAM_OFFSET_VEHICLE = new Float32Array([0, 16, 8]);  
exports.CAM_VEH_FPS = new Float32Array([0,1,0.3]);
exports.MOUSE_ROT_MULT = 2;    
exports.TOUCH_ROT_MULT = 0.007;
exports.CHARS_EMPTIES=["character","hunter"];
exports.CHAR_HTOH_EMPTIES = ["character"]; 
exports.CHAR_SHOT_EMPTIES = ["hunter","hunter2","amazon","hunter3","hoplita"]; 
exports.CHAR_SHOT_FPS_EMPTIES = ["hunter3_fps","hunter3_fps","hunter3_fps","hunter3_fps","hunter3_fps"];  
exports.MAX_CHAR_HP = 100;  
exports.CHAR_ATTACK_DIST = 0.7;  
exports.CHAR_ATTACK_STR = 35;       
exports.CHAR_ATTACK_ANIM_FRAME = 1;   
exports.CHAR_HUNTER_WEAPONS = ["knife_tps", "pistol_tps", "gun_laser", "gun_tps","punyos_fps"];  
exports.CHAR_HUNTER_WEAPONS_HTOH = ["knife_tps"];  
exports.CHAR_HUNTER_WEAPONS_INACTIVES = ["knife_funda", "pistol_funda","gun_torax"];
exports.CHAR_HUNTER_WEAPONS_INACTIVES_HTOH = ["knife_funda"];
exports.CHAR_MAX_ID_HUNTER_WEAPONS = 3;  
exports.CHAR_CURRENT_HUNTER_WEAPON = 0;   
exports.CHAR_PENULTIM_HUNTER_WEAPON=1;  
exports.CHAR_CHANGE_CURRENT_WEAPON_DELAY=2;
exports.CROSSHAIR_DELAY = 5;   
exports.MAX_LASER_LENGTH = 100;  
exports.MAX_LASER_LENGTH_GUN_ALIEN = 25;
exports.SHOOT_LISER_DELAY = 1.2;  
exports.BURST_LISER_TIME = 1 / 100;   
exports.LASER_DAMAGE = 700; 
exports.LEFT_MOUSE_BUTTON_ID = 1;  
exports.RIGHT_MOUSE_BUTTON_ID = 3;
exports.CH_STILL = 0;
exports.CH_RUN = 1;
exports.CH_ATTACK = 2;
exports.CH_SWIM = 3;
exports.CH_WALK = 4;
exports.CH_JUMP = 5;
exports.CH_VICTORY = 6;
exports.CH_FLY=7;
exports.CH_STAIRS_UP=8;
exports.CH_STAIRS_DOWN=9;
exports.CHAR_IDLE_TPS_ANIM = "hunter_idletps";
exports.CHAR_IDLE_FPS_ANIM = "hunter_idlefps";
exports.CHAR_RUN_ANIM = "hunter_runtps";
exports.CHAR_WALK_ANIM = "hunter_walktps";
exports.CHAR_STRAFE = "hunter_sideshilfttps";
exports.CHAR_JUMP_ANIM = "hunter_jumptps";
exports.CHAR_FLY_ANIM ="hunter_flytps";
exports.CHAR_SWIM_ANIM ="hunter_swimtps";
exports.CHAR_STAIRS_UP_ANIM ="hunter_stairs_13uptps";
exports.CHAR_STAIRS_DOWN_ANIM ="hunter_stairs_13downtps";
exports.CHAR_VICTORY_ANIM = "idle";  
exports.ROCK_SPEED = 2;
exports.ROCK_DAMAGE = 20;
exports.ROCK_DAMAGE_RADIUS = 0.75;
exports.ROCK_RAY_LENGTH = 10;
exports.ROCK_FALL_DELAY = 0.5;
exports.LAVA_DAMAGE_INTERVAL = 1;  
exports.BONUS_SPAWN_CHANCE = 0.5;
exports.BONUS_HP_INCR = 30;               
exports.BONUS_PREMI_INCR = 100;
exports.BONUS_SHIELD_TIME = 10;
exports.BONUS_SHIELD_EFFECT = 0.33;
exports.BONUS_LAVA_PROT_TIME = 15;
exports.BONUS_LIFETIME = 10;
exports.BONUS_FLASH_SPEED = 3;
exports.SHIELD_FLASH_LENGTH = 0.9;
exports.LAVA_FALL_LENGTH = 1.0;
exports.GOLEMS_EMPTIES = ["golem", "golem.001", "golem.002"];  
exports.TREX_EMPTIES = ["trex"];		
exports.TREX_DEATH_EMPTY = ["trex_death"];  
exports.TREX_DEATH_RIG   = ["trex_death_rig"];
exports.TREX_SPAWN_POINTS = ["trex_spawn"];
exports.TREX_PATROL_POINTS = ["trex_spawn",     "trex_patrol"];
exports.TREX_IDLE_SPEAKER = "trex_idle";
exports.TREX_WALK_SPEAKER = "trex_walk";
exports.TREX_ATTACK_SPEAKER = "trex_atack_miss";
exports.TREX_HIT_SPEAKER = "trex_atack_hit";
exports.TREX_GETOUT_SPEAKER = "trex_getout";														
exports.TREX_SPEED = 1;   
exports.TREX_ROT_SPEED = 1.0;
exports.TREX_ATTACK_DIST = 1;  
exports.TREX_ATTACK_STRENGTH = 10;
exports.TREX_ATTACK_ANIM_FRAME = 30;                            
exports.TREXS_SPAWN_INTERVAL = 1;    
exports.TREX_HP = 1;
exports.TS_WALKING = 0;
exports.TS_ATTACKING = 1;   
exports.TS_GETTING_OUT = 2;   
exports.TS_NONE = 3;     
exports.TS_IDLE = 4; 
exports.TT_POINT = 0;
exports.TT_CHAR = 1;   
exports.TT_OBELISK = 2;
exports.ASTEROID_EMPTIES = 1;   
exports.ASTEROID_HP = 100; 
exports.VEHICLES_EMPTIES = ["deportivo01","deportivo02"];   
exports.VEHICLE_WALK_SPEAKER = "deportivo_walk";
exports.VEHICLE_RUN_SPEAKER = "deportivo_run";
exports.VEHICLE_IDLE_SPEAKER = "deportivo_idle";
exports.VEHICLE_STARTER_SPEAKER = "deportivo_starter";
exports.VEHICLE_SPEED = 0.2;
exports.VEHICLE_ROT_SPEED = 1.0;
exports.VEHICLE_HP = 100;
exports.VS_WALKING = 0;  
exports.VS_RUN = 1 ;							 
exports.VS_NONE = 3;     
exports.VS_IDLE = 2;  
exports.AIRPLANES_EMPTIES = ["helicopter01","helicopter02"];   
exports.DEFAULT_POS_AIRPLANE = new Float32Array([-6, -18, -1.7]); 
exports.DEFAULT_POS_AIRPLANE2 = new Float32Array([-9, -11, -1.7]); 
exports.AIRPLANE_FLY_SPEAKER = "deportivo_walk";
exports.AIRPLANE_OVERFLY_SPEAKER = "deportivo_run";
exports.AIRPLANE_IDLE_SPEAKER = "deportivo_idle";
exports.AIRPLANE_STARTER_SPEAKER = "deportivo_starter";
exports.AIRPLANE_SPEED = 0.2;
exports.AIRPLANE_ROT_SPEED = 1.0;
exports.AIRPLANE_HP = 100;
exports.AIRS_FLY = 0;  
exports.AIRS_OVERFLY = 1 ;							 
exports.AIRS_NONE = 3;     
exports.AIRS_IDLE = 2;  
exports.BOATS_EMPTIES = ["boat01","boat02"];   
exports.DEFAULT_POS_BOATS = new Float32Array([-15, 35, -6]); 
exports.DEFAULT_POS_BOATS2 = new Float32Array([-11, 33, -6]); 
exports.BOAT_FLY_SPEAKER = "deportivo_walk";
exports.BOAT_OVERFLY_SPEAKER = "deportivo_run";
exports.BOAT_IDLE_SPEAKER = "deportivo_idle";
exports.BOAT_STARTER_SPEAKER = "deportivo_starter";
exports.BOAT_SPEED = 0.2;
exports.BOAT_ROT_SPEED = 1.0;
exports.BOAT_HP = 100;
exports.BOAT_CRUISE = 0;  
exports.BOAT_NONE = 2;     
exports.BOAT_IDLE = 1;  
exports.PICK_NAME_LIST=[         
{
		c: ["Barrel"],           
        obj: "plastic_barrel",
        e: "Plastic Barrel Stroke",
        d: 5,
		type: "recogible"
},
{
		c: ["Brick"],           
        obj: "Brick",
        e: "Plastic Barrel Stroke",
        d: 5,
		type: "recogible"	
}
]
exports.PICKABLE_NAME_LIST=[
{
		c: ["premio_ptos"],           
        obj: "moneda_100",
        e: "sound premio monedas",
        d: 5,
		type: "premio"
},
{
		c: ["premio_ptos.000"],           
        obj: "moneda_100",
        e: "sound premio monedas",
        d: 5,
		type: "premio"
},
{
		c: ["premio_ptos.001"],           
        obj: "moneda_100",
        e: "sound premio monedas",
        d: 5,
		type: "premio"
},
{
		c: ["premio_ptos.002"],           
        obj: "moneda_100",
        e: "sound premio monedas",
        d: 5,
		type: "premio"
},
{
		c: ["premio_ptos.003"],           
        obj: "moneda_100",
        e: "sound premio monedas",
        d: 5,
		type: "premio"
},
{
		c: ["premio_ptos.004"],           
        obj: "moneda_100",
        e: "sound premio monedas",
        d: 5,
		type: "premio"
},
{
		c: ["maletin_life"],           
        obj: "maletin_life_100",
        e: "sound salvavidas",
        d: 5,
		type: "salvavidas"
},
{
		c: ["maletin_life.000"],           
        obj: "maletin_life_100",
        e: "sound salvavidas",
        d: 5,
		type: "salvavidas"
}
,
{
		c: ["maletin_life.001"],           
        obj: "maletin_life_100",
        e: "sound salvavidas",
        d: 5,
		type: "salvavidas"
}
,
{
		c: ["maletin_life.002"],           
        obj: "maletin_life_100",
        e: "sound salvavidas",
        d: 5,
		type: "salvavidas"
}
,
{
		c: ["maletin_life.003"],           
        obj: "maletin_life_100",
        e: "sound salvavidas",
        d: 5,
		type: "salvavidas"
}
,
{
		c: ["maletin_life.004"],           
        obj: "maletin_life_100",
        e: "sound salvavidas",
        d: 5,
		type: "salvavidas"
}
];
exports.PICKABLE_NAME_LIST_JSON = [{      
        c: ["Barrel_json"],
        obj: "Barrel_json",
        e: "Barrel Stroke",
        d: 4
    }];
exports.DOORS_NAME_LIST = [{  
        empty: "house01_wood",
		rig:	"soporte_door",  
		fake_obj: "fake_door",
        obj: "door01_wood",               
		collision_body: "door01_wood_collision",   
		pos_cam: "posicion_camera_01",
        speaker: "gate_squeak",   
		anim_open: "open_door",
		anim_close: "close_door"
    },{
		empty: "house_stone_01",
		rig:	"soporte_door",  
		fake_obj: "fake_door",
        obj: "door_stone",               
		collision_body: "house_stone_01_collision",   
		pos_cam: "posicion_camera_01",
        speaker: "door_stone_spk",   
		anim_open: "door_house_stone_01_open",
		anim_close: "door_house_stone_01_close"
	}];	
exports.HP_BONUSES_EMPTIES = ["potion_hp", "potion_hp.001", "potion_hp.002"];
exports.SHIELD_BONUSES_EMPTIES = ["potion_def"];
exports.LAVA_BONUSES_EMPTIES = ["potion_lava"];
exports.ROCK_EMPTIES = ["lava_rock","lava_rock.001"];  
exports.ROCK_NAMES = ["rock_01", "rock_02", "rock_03"];   
exports.BURST_EMITTER_NAMES = ["burst_emitter_01", "burst_emitter_02",
                               "burst_emitter_03"];
exports.MARK_NAMES = ["mark_01", "mark_02", "mark_03"];  
exports.POINTS_PER_ISL	=2;				
exports.GEMS_EMPTIES = ["gem_0", "gem_1", "gem_2", "gem_3", "gem_4", "gem_multi"];
exports.GEMS_NAMES   = ["gem_0", "gem_1", "gem_2", "gem_3", "gem_4", "gem_multi"];
exports.GM_SPARE = 0;
exports.GM_CARRIED = 1;
exports.GM_LAYING = 2;
exports.OBELISK_NUM_GEMS = 4;
exports.OBELISKS_GEMS_NAME = ["BG", "PG", "RG", "GG", "YG"];
exports.OBELISK_GEM_HEALTH = 3;
exports.ISLES_SHIELD_DUPLI_NAME_LIST = ["enviroment", "islands", "island_shield_0"];
exports.SHUTTER_EMITTER_EMPTY = "shutter_glass";     
exports.SHUTTER_EMITTER_NAME = "glass_shutter_emitter";
exports.BTYPE_HP = 0;
exports.BTYPE_LAVA = 1;
exports.BTYPE_SHIELD = 2;
exports.CHAR_UNDERWATER = "Underwater";
exports.CHAR_INHALE_OUT_WATER = "Inhale_Out_Water";
exports.CHAR_RUN_SPEAKER = "character_run";
exports.CHAR_ATTACK_SWORD_SPEAKER = "sword_miss";
exports.CHAR_ATTACK_GUN_TPS_SPEAKER = "gun_shot";
exports.CHAR_ATTACK_GUN_FPS_SPEAKER = "gun_shotfpsspk";
exports.CHAR_ATTACK_GUN_LASER_TPS_SPEAKER = "gun_laser_shot_tps";   
exports.CHAR_ATTACK_GUN_LASER_FPS_SPEAKER = "gun_laser_shotfpsspk";  
exports.CHAR_ATTACK_PISTOL_TPS_SPEAKER = "gun_shot";  
exports.CHAR_ATTACK_PISTOL_FPS_SPEAKER = "pistol_shotfpsspk";  
exports.CHAR_ATTACK_VOICE_SPKS = ["character_attack_voice_01"];
exports.CHAR_HURT_SPKS = ["character_hurt_voice_01"]; 
exports.CHAR_JUMP_SPKS = ["character_jump_voice_01"];
exports.CHAR_SWORD_HIT_SPEAKER = "sword_hit";
exports.CHAR_DEATH_SPEAKER = "character_voice_death_01";
exports.CHAR_LANDING_SPEAKER = "character_jump_ends"; 
exports.GEM_PICKUP_SPEAKER = "gem_pickup";
exports.GEM_MOUNT_SPEAKER = "gem_mount";
exports.CHAR_HEAL_SPEAKER = "bonus_heal";
exports.CHAR_LAVA_SPEAKER = "bonus_lava";
exports.CHAR_SHIELD_SPEAKER = "bonus_shield";
exports.ISLAND_SPEAKER = "island_shield_grow";
exports.ROCK_HIT_SPEAKERS = ["rock_hit_01", "rock_hit_02", "rock_hit_03"];
exports.GEM_DESTR_SPEAKER = "gem_destroy";
exports.WIN_SPEAKER = "final_win"; 
exports.MUSIC_INTRO_SPEAKER = "level_01_bm_intro";         
exports.MUSIC_END_SPEAKER = "level_01_bm_end";
exports.MUSIC_SPEAKERS = ["Ambient_sound","Ambient_sound2"]; 
exports.MUSIC_SPEAKERS2 = ["Ambient_Ambulance",
                          "Cataclysmic_Molten_Core",
                          "Ether",
                          "Ticker"];
exports.VICT_CAM_VERT_ANGLE = -0.3;
exports.VICT_CAM_DIST = 10;
exports.TARGET_POS = new Float32Array([0, 12, 6]);  
exports.TARGET_PIVOT = new Float32Array([0, 0, 0]);  
exports.DIST_LIMITS = {
			min: 1,
			max: 6     
			};
exports.TARGET_VERT_LIMITS = {
			down: -Math.PI/16, 
			up: -Math.PI/3            
			}
exports.TARGET_HORIZ_LIMITS = {
			left: -Math.PI/4, 
			right: Math.PI/4
			}
exports.HOVER_ANGLE_LIMITS = {
    down: -Math.PI/16, 
    up: -Math.PI/4
}
exports.HOVER_POS = new Float32Array([4.5, 3, 3]);
exports.HOVER_PIVOT = new Float32Array([4.5, 0, 0]);
exports.EYE_POS_INTRO = new Float32Array([-1.5, -3, 1.5]);   
exports.EYE_LOOK_AT_INTRO = new Float32Array([-1.5, 0, 0.5]);  
exports.EYE_POS = new Float32Array([-1.5, -3, 1.5]);   
exports.EYE_LOOK_AT = new Float32Array([-1.5, 0, 0.5]);  
exports.EYE_VERT_LIMITS = {   
    down: -Math.PI/16,   
    up: Math.PI/16
}
exports.EYE_HORIZ_LIMITS = {  
    left: Math.PI/4, 
    right: -Math.PI/4
}
exports.STATIC_POS = new Float32Array([0, 0, -1]);
exports.STATIC_LOOK_AT = new Float32Array([0, 0, -17]);
})