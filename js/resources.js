if (b4w.module_check("resources"))
    throw "Failed to register module: resources";
b4w.register("resources", function(exports, require) {
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
m_camera = require("camera"); 
m_quat   = require("quat");   
var m_obj       = require("objects");
var m_mouse     = require("mouse");
var m_math      = require("math");
var m_conf      =  require("game_config");  
var _alien_empty =null;   
var _alien_data_id=0; 							
var	_llist_object_pick=[];	
var _object_picked_data_id=0;
var _drag_mode = false;  
var _enable_camera_controls = true;    
var _resources_wrapper=null;
var _selected_obj = null;
var _controls_container_rom=null;  
var WALL_X_MAX = 4;
var WALL_X_MIN = -3.8;
var WALL_Y_MAX = 3.5;
var WALL_Y_MIN = -4.2;
var ROT_ANGLE = Math.PI/4;  
var OUTLINE_COLOR_VALID = [0, 1, 0];   
var OUTLINE_COLOR_ERROR = [1, 0, 0];  
var FLOOR_PLANE_NORMAL = [0, 0, 1];
var _obj_delta_xy = new Float32Array(2);    
var spawner_pos = new Float32Array(3);  
var _vec3_tmp = new Float32Array(3);   
var _vec3_tmp2 = new Float32Array(3);
var _vec3_tmp3 = new Float32Array(3);
var _vec4_tmp = new Float32Array(4);
var _pline_tmp = m_math.create_pline();   
exports.init= function(elapsed_sensor, canvas_elem) {  
	_resources_wrapper={
		selected_obj: _selected_obj,
	    view_no_static: 1  
	};    
 var spawner = m_scs.get_object_by_name("spawner");    
 m_trans.get_translation(spawner, spawner_pos);   
var	controls_container_rom = document.getElementById("controls_container_rom"); 																		  
	 controls_container_rom.style.display="block";
	_controls_container_rom=controls_container_rom; 
document.getElementById("controls_container_rom").style.zIndex = 0;
document.getElementById("controls_container_rom").style.visibility = "hidden";								
    init_buttons();  
    document.getElementById("load-1").addEventListener("click", function(e) {   
        m_data.load(m_conf.ASSETS_PATH + "bed.json", loaded_cb, null, false, true);   
    });
    document.getElementById("load-2").addEventListener("click", function(e) {
        m_data.load(m_conf.ASSETS_PATH + "barrel_json.json", loaded_objs_picked_cb, null, false, true);  
    });                                                  
    document.getElementById("load-3").addEventListener("click", function(e) {
        m_data.load(m_conf.ASSETS_PATH + "commode_and_pot.json", loaded_cb, null, false, true);
    });
    document.getElementById("load-4").addEventListener("click", function(e) {
        m_data.load(m_conf.ASSETS_PATH + "fan.json", loaded_cb, null, false, true);
    });
    document.getElementById("load-5").addEventListener("click", function(e) {
        m_data.load(m_conf.ASSETS_PATH + "alien_for_resources.json", loaded_alien_cb, null, false, true);    
    });						 
    document.getElementById("delete").addEventListener("click", function(e) {
        if (_selected_obj) {  
            var id = m_scs.get_object_data_id(_selected_obj);
            m_data.unload(id);
            _selected_obj = null;
        }
    });
    document.getElementById("rot-ccw").addEventListener("click", function(e) {
        if (_selected_obj)
            rotate_object(_selected_obj, ROT_ANGLE);
    });
    document.getElementById("rot-cw").addEventListener("click", function(e) {
        if (_selected_obj)
            rotate_object(_selected_obj, -ROT_ANGLE);
    });
    canvas_elem.addEventListener("mousedown", main_canvas_down);   
    canvas_elem.addEventListener("touchstart",main_canvas_down);
	canvas_elem.addEventListener("mouseup", main_canvas_up); 
    canvas_elem.addEventListener("touchend", main_canvas_up);           	
}
function init_buttons() {          
    var ids = ["delete", "rot-ccw", "rot-cw"];
    for (var i = 0; i < ids.length; i++) {
        var id = ids[i];
        document.getElementById(id).addEventListener("mousedown", function(e) {
            var parent = e.target.parentNode;
            parent.classList.add("active");      
		});
        document.getElementById(id).addEventListener("mouseup", function(e) {  
            var parent = e.target.parentNode;
            parent.classList.remove("active");
        });
        document.getElementById(id).addEventListener("touchstart", function(e) {
            var parent = e.target.parentNode;
            parent.classList.add("active");
        });
        document.getElementById(id).addEventListener("touchend", function(e) {
            var parent = e.target.parentNode;
            parent.classList.remove("active");
        });
    }
}
exports.get_container= get_container;     
function get_container() {             
 return _controls_container_rom; 
}
function loaded_cb(data_id) {  
	var objs = m_scs.get_all_objects("ALL", data_id); 
   for (var i = 0; i < objs.length; i++) {   		
        var obj = objs[i];
		console.log("name object:"+obj.name);
        if (m_phy.has_physics(obj)) {        
            m_phy.enable_simulation(obj);   
		  var sensor_col = m_ctl.create_collision_sensor(obj);
		 var sensor_sel = m_ctl.create_selection_sensor(obj, true);        
            if (obj == _selected_obj)
                m_ctl.set_custom_sensor(sensor_sel, 1);
            m_ctl.create_sensor_manifold(obj, "COLLISION", m_ctl.CT_CONTINUOUS, 
                    [sensor_col, sensor_sel], logic_func, trigger_outline);
            var obj_parent = m_obj.get_parent(obj);
            if (obj_parent && m_obj.is_armature(obj_parent))
                m_trans.set_translation_v(obj_parent, spawner_pos);  
            else
                m_trans.set_translation_v(obj, spawner_pos);    
        }
        if (m_obj.is_mesh(obj))
		{
		 m_scs.show_object(obj);
		 console.log("mostramos si es  un  objeto en la escena actual: "+ obj.name);  
		}  
    }  
}
function loaded_alien_cb(data_id) {  
	_alien_data_id=data_id;
	_alien_empty=m_scs.get_object_by_name("alien",data_id);
	var alien_body= m_scs.get_object_by_dupli_name("alien","alien_collider",data_id);    
        if (m_phy.has_physics(_alien_empty)) {           
    }  
	m_scs.show_object(_alien_empty);
		 console.log("mostramos si es  un  objeto en la escena actual: "+ _alien_empty.name);  
	var active_scene = m_scs.get_active();
    console.log("la atual activa escena es :"+active_scene);
	 var scenes = m_scs.get_scenes();
	 console.log("las escenas disponibles son:"+scenes);
}
function loaded_objs_picked_cb(data_id) {  
		_object_picked_data_id=data_id;
        for (var i = 0; i < m_conf.PICKABLE_NAME_LIST_JSON.length; i++)     
            for (var j = 0; j < m_conf.PICKABLE_NAME_LIST_JSON[i].c.length; j++) {   
			         var llist_object_pick = m_scs.get_object_by_dupli_name(m_conf.PICKABLE_NAME_LIST_JSON[i].c[j], m_conf.PICKABLE_NAME_LIST_JSON[i].obj,1);  
			_llist_object_pick.push(llist_object_pick);
			}
}
exports.get_alien_data_id= function() {
	return _alien_data_id;
}
exports.get_alien_empty = function() { 
    return _alien_empty;				
}
exports.get_picked_llist_obj = function() { 
    return _llist_object_pick;				
}
exports.get_object_picked_data_id = function() {
return _object_picked_data_id;
}
function logic_func(s) {
    return s[1];	
}
function trigger_outline(obj, id, pulse) {  
    if (pulse == 1) {
        var has_collision = m_ctl.get_sensor_value(obj, id, 0);   
        if (has_collision)
            m_scs.set_outline_color(OUTLINE_COLOR_ERROR);  
        else
            m_scs.set_outline_color(OUTLINE_COLOR_VALID);   
    }
}
function rotate_object(obj, angle) {
    var obj_parent = m_obj.get_parent(obj);
    if (obj_parent && m_obj.is_armature(obj_parent)) {
        var obj_quat = m_trans.get_rotation(obj_parent, _vec4_tmp);
        m_quat.rotateZ(obj_quat, angle, obj_quat);
        m_trans.set_rotation_v(obj_parent, obj_quat);
    } else {
        var obj_quat = m_trans.get_rotation(obj, _vec4_tmp);
        m_quat.rotateZ(obj_quat, angle, obj_quat);
        m_trans.set_rotation_v(obj, obj_quat);
    }
}
function main_canvas_down(e) {     
	_drag_mode = true;
    if (e.preventDefault)        
        e.preventDefault();
    var x = m_mouse.get_coords_x(e);
    var y = m_mouse.get_coords_y(e);
    var obj = m_scs.pick_object(x, y);            
    if (_selected_obj != obj) {
        if ((_selected_obj)&&(m_scs.outlining_is_enabled(_selected_obj)))
            m_scs.clear_outline_anim(_selected_obj);  
        if (((obj)&&(obj.name!="Plane.001"))&&(m_scs.outlining_is_enabled(obj)))
            m_scs.apply_outline_anim(obj, 1, 1, 0);       
 _selected_obj = obj;   
		_resources_wrapper.selected_obj=_selected_obj;
    }
    if (_selected_obj) {
        var cam = m_scs.get_active_camera();
        var obj_parent = m_obj.get_parent(_selected_obj);
        if (obj_parent && m_obj.is_armature(obj_parent))
            m_trans.get_translation(obj_parent, _vec3_tmp);
        else
            m_trans.get_translation(_selected_obj, _vec3_tmp);
        m_camera.project_point(cam, _vec3_tmp, _obj_delta_xy);
        _obj_delta_xy[0] = x - _obj_delta_xy[0];
        _obj_delta_xy[1] = y - _obj_delta_xy[1];
    }
}
function main_canvas_up(e) {
    _drag_mode = false;
    if (!_enable_camera_controls) {   
        _enable_camera_controls = true;    
    }
}
function main_canvas_move(e) {
    if (_drag_mode)
        if (_selected_obj) {
            if (_enable_camera_controls) {
                _enable_camera_controls = false;
            }
            var cam = m_scs.get_active_camera();
            var x = m_mouse.get_coords_x(e);   
            var y = m_mouse.get_coords_y(e);
            if (x >= 0 && y >= 0) {
                x -= _obj_delta_xy[0];   
                y -= _obj_delta_xy[1];
		var camobj = m_scs.get_active_camera();		
	   if (m_camera.is_static_camera(camobj)) {
                var pline = m_camera.calc_ray(cam, x, y, _pline_tmp);  
                var camera_ray = m_math.get_pline_directional_vec(pline, _vec3_tmp);
                var cam_trans = m_trans.get_translation(cam, _vec3_tmp2);  
				m_math.set_pline_initial_point(_pline_tmp, cam_trans);     
                m_math.set_pline_directional_vec(_pline_tmp, camera_ray);    
                var point = m_math.line_plane_intersect(FLOOR_PLANE_NORMAL, 0, _pline_tmp, _vec3_tmp3); 
    }
                if (point && camera_ray[2] < 0) {
                    var obj_parent = m_obj.get_parent(_selected_obj);
                    if (obj_parent && m_obj.is_armature(obj_parent))
                        m_trans.set_translation_v(obj_parent, point);
                    else
                        m_trans.set_translation_v(_selected_obj, point);
                }
            }   
        }  
}
function limit_object_position(obj) {
    var bb = m_trans.get_object_bounding_box(obj);
    var obj_parent = m_obj.get_parent(obj);
    if (obj_parent && m_obj.is_armature(obj_parent))
        var obj_pos = m_trans.get_translation(obj_parent, _vec3_tmp);
    else
        var obj_pos = m_trans.get_translation(obj, _vec3_tmp);
    if (bb.max_x > WALL_X_MAX)
        obj_pos[0] -= bb.max_x - WALL_X_MAX;
    else if (bb.min_x < WALL_X_MIN)
        obj_pos[0] += WALL_X_MIN - bb.min_x;
    if (bb.max_y > WALL_Y_MAX)
        obj_pos[1] -= bb.max_y - WALL_Y_MAX;
    else if (bb.min_y < WALL_Y_MIN)
        obj_pos[1] += WALL_Y_MIN - bb.min_y;
    if (obj_parent && m_obj.is_armature(obj_parent))
        m_trans.set_translation_v(obj_parent, obj_pos);
    else
        m_trans.set_translation_v(obj, obj_pos);
}
exports.get_wrapper=get_wrapper;
function get_wrapper(){
	return _resources_wrapper;	
}
})