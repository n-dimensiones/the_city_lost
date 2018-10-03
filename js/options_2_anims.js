"use strict";
if (b4w.module_check("options_2_anims"))
    throw "Failed to register module: options_2_anims";
b4w.register("options_2_anims", function(exports, require) {
var m_app         = require("app");
var m_cfg         = require("config");  
var m_cont        = require("container");  
var m_ctl         = require("controls");  
var m_data        = require("data");  
var m_gp_cf     = require("gp_conf");  
var m_hmd         = require("hmd");
var m_hmd_conf    = require("hmd_conf");
var m_input       = require("input");  
var m_main        = require("main"); 
var m_scs         = require("scenes");
var m_sfx         = require("sfx");
var m_storage     = require("storage");
var m_version     = require("version");
var m_screen	  = require("screen");  
var m_time  = require("time");
var m_trans       = require("transform");
var m_util        = require("util");
var m_vec3        = require("vec3");
var m_quat        = require("quat");
var m_phy   = require("physics");
var m_char  = require("character2");
var m_weapons     = require("weapons");  
var m_view	= require("control_view");
var m_interface = require("interface2");
var m_load_level=require("load_level");
var _is_char_htoh=true;  
var BUILT_IN_SCRIPTS_ID      = "built_in_scripts";
var DEFAULT_QUALITY          = "HIGH";
var DEFAULT_STEREO           = "NONE";
var CAMERA_AUTO_ROTATE_SPEED = 0.3;
var HIDE_MENU_DELAY          = 2000;
var ANIM_ELEM_DELAY          = 50;
var LOGO_SHOW_DELAY          = 300;
var LOGO_HIDE_DELAY          = 300;
var LOGO_CIRCLE_HIDE_DELAY   = 300;
var CAPTION_SHOW_DELAY       = 300;
var CAPTION_HIDE_DELAY       = 300;
var MENU_BUTTON_SHOW_DELAY   = 300;
var PRELOADER_HIDE_DELAY     = 300;
var _menu_close_func         = null;
var _is_panel_open_top       = false;
var _is_panel_open_left      = false;
var _is_anim_top             = false;
var _is_anim_left            = false;
var _is_qual_menu_opened     = false;
var _is_stereo_menu_opened   = false;
var _is_help_menu_opened     = false;
var _no_social               = false;
var _socials                 = [];
var _is_hiden=true;
var _circle_container;
var _preloader_caption;
var _first_stage;
var _second_stage;
var _third_stage;
var _load_container;
var _preloader_container;
var _opened_button;
var _logo_container;
var _buttons_container;
var _quality_buttons_container;
var _stereo_buttons_container;
var _help_info_container;
var _help_button;
var _hor_button_section;
var _selected_object;
var _stereo_mode;
var _pick = m_scs.pick_object;  
var _options_anims_wrapper=null;
var _vec3_tmp = new Float32Array(3);
var _vec3_tmp2 = new Float32Array(3);
var _quat_tmp = new Float32Array(4);
var _player_buttons = [
    {
	type: "simple_button", 
	id: "opened_button",
	callback: open_menu
	},
    {
	type: "simple_button", 
	id: "help_button",
	callback: open_help
	},
    {
	type: "simple_button",
	id: "close_help",
	callback: close_help
	},
    {
	 type:              "trigger_button",
     id:                "fullscreen_on_button",                  
     callback:          enter_fullscreen,
     replace_button_id: "fullscreen_off_button",            
     replace_button_cb: exit_fullscreen
	 },
    {type:              "trigger_button",
     id:                "pause_button",
     callback:          pause_engine,
     replace_button_id: "play_button",
     replace_button_cb: resume_engine},
    {type:              "trigger_button",
     id:                "auto_rotate_on_button",
     callback:          rotate_camera,
     replace_button_id: "auto_rotate_off_button",
     replace_button_cb: stop_camera
	 },
    {type:              "trigger_button",
     id:                "sound_on_button",  
     callback:          stop_sound,
     replace_button_id: "sound_off_button",
     replace_button_cb: play_sound},
    {
	 type:                   "menu_button",
     id:                     "stereo_buttons_container",
     callback:               open_stereo_menu,
     child_buttons_array_id: ["def_mode_button",
                              "anag_mode_button",
                              "hmd_mode_button"],
     child_buttons_array_cb: [
                 function(){change_stereo("NONE")},
                 function(){change_stereo("ANAGLYPH")},
                 function(){change_stereo("HMD")}]
	},
	 {type:                   "menu_button",
     id:                     "quality_buttons_container",
     callback:               open_qual_menu,
     child_buttons_array_id: ["knife_button",
							 "low_mode_button",  
                              "high_mode_button",   
                              "ultra_mode_button",
							  "punyos_button"],			
     child_buttons_array_cb: [
	function() {
			_options_anims_wrapper.last_button_weapons_time=m_time.get_timeline();
			 if (!_is_char_htoh) {     	
		      _options_anims_wrapper.current_weapon=0;                 
			  m_ctl.set_custom_sensor(m_char.get_wrapper().punyos_fps_sensor,0);
			   m_ctl.set_custom_sensor(m_char.get_wrapper().punyos_tps_sensor,0);
			  m_ctl.set_custom_sensor(m_char.get_wrapper().gun_tps_sensor,0);
			  m_ctl.set_custom_sensor(m_char.get_wrapper().gun_fps_sensor,0);
			  m_ctl.set_custom_sensor(m_char.get_wrapper().gun_laser_tps_sensor,0);
			  m_ctl.set_custom_sensor(m_char.get_wrapper().gun_laser_fps_sensor,0);
			  m_ctl.set_custom_sensor(m_char.get_wrapper().knife_tps_sensor,1);
			  m_ctl.set_custom_sensor(m_char.get_wrapper().knife_fps_sensor,1);
			 }
	   m_ctl.create_sensor_manifold(m_char.get_wrapper().phys_body, "CHANGE_WEAPONS_TO_BUTTON_KNIFE",
            m_ctl.CT_SHOT, [m_char.get_wrapper().pistol_tps_sensor, m_char.get_wrapper().gun_tps_sensor, m_char.get_wrapper().gun_laser_tps_sensor,  m_char.get_wrapper().punyos_fps_sensor,m_char.get_wrapper().knife_tps_sensor,_options_anims_wrapper.buttonclick_sensor]
									, function(s) {return (s[0] && s[5]) || (s[1]&& s[5]) || (s[2]&& s[5]) || (s[3]&&s[5])||(s[4] && s[5])}, change_weapons_to_bottons_cb);
			},			
	function() {
		 _options_anims_wrapper.last_button_weapons_time=m_time.get_timeline();
		 _options_anims_wrapper.current_weapon=1;
		   m_ctl.set_custom_sensor(m_char.get_wrapper().pistol_tps_sensor,1);
		    m_ctl.set_custom_sensor(m_char.get_wrapper().pistol_fps_sensor,1);
		if (!_is_char_htoh) {     	
			    m_ctl.set_custom_sensor(m_char.get_wrapper().punyos_fps_sensor,0);
				m_ctl.set_custom_sensor(m_char.get_wrapper().punyos_tps_sensor,0);
				m_ctl.set_custom_sensor(m_char.get_wrapper().knife_fps_sensor,0);
				m_ctl.set_custom_sensor(m_char.get_wrapper().knife_tps_sensor,0);
				m_ctl.set_custom_sensor(m_char.get_wrapper().gun_tps_sensor,0);
				m_ctl.set_custom_sensor(m_char.get_wrapper().gun_fps_sensor,0);
				m_ctl.set_custom_sensor(m_char.get_wrapper().gun_laser_tps_sensor,0);
				m_ctl.set_custom_sensor(m_char.get_wrapper().gun_laser_fps_sensor,0);
				}
	   m_ctl.create_sensor_manifold(m_char.get_wrapper().phys_body, "CHANGE_WEAPONS_TO_BUTTON_PISTOL",
            m_ctl.CT_SHOT, [m_char.get_wrapper().pistol_tps_sensor, m_char.get_wrapper().gun_tps_sensor, m_char.get_wrapper().gun_laser_tps_sensor, m_char.get_wrapper().punyos_fps_sensor,m_char.get_wrapper().knife_tps_sensor,_options_anims_wrapper.buttonclick_sensor]
									, function(s) {return (s[0] && s[5]) || (s[1]&& s[5]) || (s[2]&& s[5])|| (s[3]&&s[5]) || (s[4] && s[5])}, change_weapons_to_bottons_cb);
	       },
		function() {
			_options_anims_wrapper.last_button_weapons_time=m_time.get_timeline();
			 if (!_is_char_htoh) {     	
		      _options_anims_wrapper.current_weapon=3;
			 m_ctl.set_custom_sensor(m_char.get_wrapper().punyos_fps_sensor,0);
			 m_ctl.set_custom_sensor(m_char.get_wrapper().punyos_tps_sensor,0);
			  m_ctl.set_custom_sensor(m_char.get_wrapper().gun_tps_sensor,1);
			  m_ctl.set_custom_sensor(m_char.get_wrapper().gun_fps_sensor,1);
			  m_ctl.set_custom_sensor(m_char.get_wrapper().gun_laser_tps_sensor,0);
			  m_ctl.set_custom_sensor(m_char.get_wrapper().gun_laser_fps_sensor,0);
			  m_ctl.set_custom_sensor(m_char.get_wrapper().knife_tps_sensor,0);
			   m_ctl.set_custom_sensor(m_char.get_wrapper().knife_fps_sensor,0);
			}
	   m_ctl.create_sensor_manifold(m_char.get_wrapper().phys_body, "CHANGE_WEAPONS_TO_BUTTON_RIFLE",
            m_ctl.CT_SHOT, [m_char.get_wrapper().pistol_tps_sensor, m_char.get_wrapper().gun_tps_sensor, m_char.get_wrapper().gun_laser_tps_sensor, m_char.get_wrapper().punyos_fps_sensor,m_char.get_wrapper().knife_tps_sensor,_options_anims_wrapper.buttonclick_sensor]
									, function(s) {return (s[0] && s[5]) || (s[1]&& s[5]) || (s[2]&& s[5]) || (s[3]&&s[5])||(s[4]&& s[5])}, change_weapons_to_bottons_cb);
			},
		function() {
			_options_anims_wrapper.last_button_weapons_time=m_time.get_timeline();
		if (!_is_char_htoh) {     		
			   _options_anims_wrapper.current_weapon=2;
			   m_ctl.set_custom_sensor(m_char.get_wrapper().punyos_fps_sensor,0);
			    m_ctl.set_custom_sensor(m_char.get_wrapper().punyos_tps_sensor,0);
		       m_ctl.set_custom_sensor(m_char.get_wrapper().gun_laser_tps_sensor,1);
			   m_ctl.set_custom_sensor(m_char.get_wrapper().gun_laser_tps_sensor,1);
		       m_ctl.set_custom_sensor(m_char.get_wrapper().gun_tps_sensor,0);
			   m_ctl.set_custom_sensor(m_char.get_wrapper().gun_fps_sensor,0);
	  	  m_ctl.set_custom_sensor(m_char.get_wrapper().knife_tps_sensor,0);
		  m_ctl.set_custom_sensor(m_char.get_wrapper().knife_fps_sensor,0);
		}
	   m_ctl.create_sensor_manifold(m_char.get_wrapper().phys_body, "CHANGE_WEAPONS_TO_BUTTON_LASER",
            m_ctl.CT_SHOT, [m_char.get_wrapper().pistol_tps_sensor, m_char.get_wrapper().gun_tps_sensor, m_char.get_wrapper().gun_laser_tps_sensor, m_char.get_wrapper().punyos_fps_sensor,m_char.get_wrapper().knife_tps_sensor,_options_anims_wrapper.buttonclick_sensor]
									, function(s) {return (s[0] && s[5]) || (s[1]&& s[5]) || (s[2]&& s[5])|| (s[3]&&s[5])|| (s[4]&&s[5])}, change_weapons_to_bottons_cb);
			},
			function() {
			_options_anims_wrapper.last_button_weapons_time=m_time.get_timeline();
			 if (!_is_char_htoh) {     	
		      _options_anims_wrapper.current_weapon=4;                 
			  m_ctl.set_custom_sensor(m_char.get_wrapper().knife_fps_sensor,0);
			  m_ctl.set_custom_sensor(m_char.get_wrapper().knife_tps_sensor,0);
			   m_ctl.set_custom_sensor(m_char.get_wrapper().punyos_fps_sensor,1);
			   m_ctl.set_custom_sensor(m_char.get_wrapper().punyos_tps_sensor,1);
			  m_ctl.set_custom_sensor(m_char.get_wrapper().gun_tps_sensor,0);
			  m_ctl.set_custom_sensor(m_char.get_wrapper().gun_fps_sensor,0);
			  m_ctl.set_custom_sensor(m_char.get_wrapper().gun_laser_tps_sensor,0);
			  m_ctl.set_custom_sensor(m_char.get_wrapper().gun_laser_fps_sensor,0);
			  m_ctl.set_custom_sensor(m_char.get_wrapper().pistol_tps_sensor,0);
			  m_ctl.set_custom_sensor(m_char.get_wrapper().pistol_fps_sensor,0);
			}
	   m_ctl.create_sensor_manifold(m_char.get_wrapper().phys_body, "CHANGE_WEAPONS_TO_BUTTON_PUNYOS",
            m_ctl.CT_SHOT, [m_char.get_wrapper().pistol_tps_sensor, m_char.get_wrapper().gun_tps_sensor, m_char.get_wrapper().gun_laser_tps_sensor,  m_char.get_wrapper().punyos_fps_sensor,m_char.get_wrapper().knife_tps_sensor,_options_anims_wrapper.buttonclick_sensor]
									, function(s) {return (s[0] && s[5]) || (s[1]&& s[5]) || (s[2]&& s[5]) || (s[3]&&s[5])|| (s[4]&&s[5])}, change_weapons_to_bottons_cb);
			}
   ]}
]    
function change_weapons_to_bottons_cb(obj,id,pulse)   {	
if (pulse)
{
var time=m_time.get_timeline();		
var	 last_button_weapons_time=_options_anims_wrapper.last_button_weapons_time;
	if (time - last_button_weapons_time>0.009)
	{		
	 var viewFPS=m_view.get_wrapper().viewFPS;	 
	  console.log("el time valor es:"+time);
	  console.log("el _last_button_weapons_time valor actual deberia ser algo menor que time y es:"+last_button_weapons_time);
	var current=_options_anims_wrapper.current_weapon;
	m_weapons.switch_weapons_cb(current,viewFPS,_is_char_htoh);  
	console.log("el current arma es:"+current);
	m_char.get_wrapper().weapon_current=current;
	m_ctl.set_custom_sensor(_options_anims_wrapper.buttonclick_sensor,0);  
   } 
  }	  
 } 
exports.init = function(is_char_htoh) {    
		m_storage.init("options_anims:"+ window.location.href);
	    set_stereo_config();  
    _is_char_htoh=is_char_htoh;
	 _options_anims_wrapper={
						last_button_weapons_time: 2,
						current_weapon: 0,
						buttonclick_sensor:   m_ctl.create_custom_sensor(0)           
						};  
	cache_dom_elems();		
 _opened_button.style.display = "block";						
	    check_fullscreen();  
       _quality_buttons_container.classList.add("punyos_button");
	    set_stereo_button();
     init_control_buttons();	
	 var hmd_mode_button = document.querySelector("#hmd_mode_button");
    if (!m_input.can_use_device(m_input.DEVICE_HMD)) {
        hmd_mode_button.parentElement.removeChild(hmd_mode_button);
    }
}
function init_cb(canvas_element, success) {            
	    check_fullscreen();  
	    set_stereo_button();
	   init_control_buttons();
	    m_gp_cf.update();
}
function cache_dom_elems() {
     _circle_container = document.querySelector("#circle_container");
    _preloader_caption = document.querySelector("#preloader_caption");
    _first_stage = document.querySelector("#first_stage");
    _second_stage = document.querySelector("#second_stage");
    _third_stage = document.querySelector("#third_stage");
    _load_container = document.querySelector("#load_container");
    _preloader_container = document.querySelector("#preloader_container");
    _opened_button = document.querySelector("#opened_button");
    _logo_container = document.querySelector("#logo_container");
    _buttons_container = document.querySelector("#buttons_container");
    _quality_buttons_container = document.querySelector("#quality_buttons_container");
    _stereo_buttons_container = document.querySelector("#stereo_buttons_container");
    _help_info_container = document.querySelector("#help_info_container");
    _help_button = document.querySelector("#help_button");
    _hor_button_section = document.querySelector("#hor_button_section");
}
function set_quality_button() {
    var quality = m_storage.get("quality");
    if (!quality || quality == "CUSTOM") {
        quality = DEFAULT_QUALITY;  
        m_storage.set("quality", quality);
    }
    _quality_buttons_container.className = "control_panel_button";
    switch (quality) {
    case "LOW":
        break;
    case "HIGH":
        break;
    case "ULTRA":
        break;
	case "ULTRE":  
        break;	
    }
}
function set_stereo_button() {
    var stereo = m_storage.get("stereo") || DEFAULT_STEREO;  
    m_storage.set("stereo", stereo);
    _stereo_buttons_container.className = "control_panel_button";
    switch (stereo) {
    case "NONE":
        _stereo_buttons_container.classList.add("def_mode_button");
        break;
    case "ANAGLYPH":
        _stereo_buttons_container.classList.add("anag_mode_button");
        break;
    case "HMD":
        _stereo_buttons_container.classList.add("hmd_mode_button");
        if (m_input.can_use_device(m_input.DEVICE_HMD))
            m_hmd_conf.update();
        break;
    }
}
function init_control_buttons() {
    window.oncontextmenu = function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    };
    init_links();
    for (var i = 0; i < _player_buttons.length; i++) {
        var button = _player_buttons[i];
        var elem = document.getElementById(button.id);
        add_hover_class_to_button(elem);
        switch (button.type) {
        case "simple_button":
            if (elem)    
                if (is_touch())
                    elem.addEventListener("touchend", button.callback);
                else
                    elem.addEventListener("mouseup", button.callback);
            break;
        case "menu_button":
            (function(button){
                if (elem)
                    if (is_touch())
                        elem.addEventListener("touchend", function(e) {
                                  button.callback(e, button);
								   m_ctl.set_custom_sensor(_options_anims_wrapper.buttonclick_sensor,1);
                              });
                    else
                        elem.addEventListener("mouseup", function(e) {
                                  button.callback(e, button);
								  m_ctl.set_custom_sensor(_options_anims_wrapper.buttonclick_sensor,1);
								  console.log("estamos comprobando que se dio buttonclick_sensor y se establcio a:"+_options_anims_wrapper.buttonclick_sensor.value);
                              });
            })(button);
            break;
        case "trigger_button":
            (function(button){
                if (elem)
                    if (is_touch())
                        elem.addEventListener("touchend", function(e) {
                            button.callback(e);
                        });
                    else
                        elem.addEventListener("mouseup", function(e) {
                            button.callback(e);
                        });
            })(button);
            break;
        }
    }
}
function init_links() {
    var button_links = document.querySelectorAll(".control_panel_button a");
    for (var i = 0; i < button_links.length; i++) {
        var link = button_links[i];
        if (link.hasAttribute("href"))
	    link.href += "www.n-dimensiones.es";
        add_hover_class_to_button(link.parentNode);
    }
}
function search_file() {
    var module_name = m_cfg.get("built_in_module_name");
    if (b4w.module_check(module_name)) {
        var bd = require(module_name);
        var file = bd["data"]["main_file"];
        remove_built_in_scripts();
        return file;
    } else {
        var url_params = m_app.get_url_params();
        _logo_container.style.display = "block";
        if (url_params && url_params["load"]) {
            file = url_params["load"];
            return file;
        } else {
            report_app_error("Please specify a scene to load",
                             "For more info visit",
                             "https://www.blend4web.com/doc/en/web_player.html");
            return null;
        }
    }
}
function get_button_object_from_id(elem_id) {
    for (var i = 0; i < _player_buttons.length; i++)
        if (_player_buttons[i].id == elem_id)
            return _player_buttons[i];
    return null;
}
function anim_logo(file) {
    m_app.css_animate(_logo_container, "opacity", 0, 1, LOGO_SHOW_DELAY, "", "", function() {
            m_main.resume();
            m_data.load(file, loaded_callback, null, false);
    })
}
function open_help() {
 if (_is_hiden)
            m_gp_cf.show();
        else
            m_gp_cf.hide();
        _is_hiden = !_is_hiden;   
}
function close_help(is_cb) {
}
function add_hover_class_to_button(elem) {       
    if (!elem)
        return;
    if (is_touch()) {
        elem.addEventListener("touchstart", function() {
            elem.classList.add("hover");
            clear_deferred_close();
        });
        elem.addEventListener("touchend", function() {
            elem.classList.remove("hover");
            deferred_close();
        });
    } else {
        elem.addEventListener("mouseenter", function() {
            elem.classList.add("hover");
        });
        elem.addEventListener("mouseout", function(e) {
            elem.classList.remove("hover");
        });
    }
}
function check_cursor_position(elem_id) {
    var hover = false;
    if (document.querySelectorAll) {
        var elems = document.querySelectorAll( ":hover" );
        for (var i = 0; i < elems.length; i++) {
            if (elems[i].id == elem_id) {
                hover = true;
                break;
            }
        }
    }
    return hover;
}
function update_button(elem) {
    var old_elem_id = elem.id;
    var button = get_button_object_from_id(elem.id);  
    var old_callback = button.callback;
    elem.id = button.id =  button.replace_button_id;
    button.replace_button_id = old_elem_id;
    if (!check_cursor_position(elem.id))
        elem.classList.remove("hover");
    button.callback = button.replace_button_cb;
    button.replace_button_cb = old_callback;
}
function close_menu() {  
    if (is_anim_in_process())
        return;
	 var controls_elem = document.getElementById("controls"); 
	 var controls_out_vehicle = document.getElementById("control_out_vehicle"); 
	 var controls_view_restore = document.getElementById("control_view_restore"); 
	 m_interface.hide_elem(controls_elem);
	 m_interface.hide_elem(controls_out_vehicle);
	 m_interface.hide_elem(controls_view_restore);
	  document.getElementById("controls").style.zIndex=0;
	 document.getElementById("control_out_vehicle").style.zIndex=0;
	document.getElementById("control_view_restore").style.zIndex=0;
    _buttons_container.removeEventListener("mouseleave", deferred_close);
    _buttons_container.removeEventListener("mouseenter", clear_deferred_close);
    document.body.removeEventListener("touchmove", deferred_close);
    close_qual_menu();
    close_stereo_menu();
    var hor_elem  = document.querySelector("#help_button");
    var vert_elem = document.querySelector("#vert_section_button").firstElementChild;
    var drop_left = function(elem) {
        _is_anim_left = true;
        m_app.css_animate(elem, "marginRight", 0, -45, ANIM_ELEM_DELAY, "", "px");
        m_app.css_animate(elem, "opacity", 1, 0, ANIM_ELEM_DELAY, "", "", function() {
            if (elem.previousElementSibling && elem.previousElementSibling.id != "opened_button")
                drop_left(elem.previousElementSibling);
            else {
                setTimeout(function() {
                    _is_anim_left = false;
                    _is_panel_open_left = false;
                    check_anim_end();
                    _hor_button_section.style.display = "";
                }, 100);
                return;
            }
        });
    }
    var drop_top = function(elem) {
        _is_anim_top = true;
        m_app.css_animate(elem, "marginBottom", 0, -45, ANIM_ELEM_DELAY, "", "px");
        m_app.css_animate(elem, "opacity", 1, 0, ANIM_ELEM_DELAY, "", "", function() {
            if (elem.nextElementSibling && elem.nextElementSibling.id != "opened_button")
                drop_top(elem.nextElementSibling);
            else {
                setTimeout(function() {
                    _is_anim_top = false;
                    _is_panel_open_top = false;
                    check_anim_end();
                }, 100);
                return;
            }
        });
    }
    drop_left(hor_elem);
    if (!_no_social)
        drop_top(vert_elem);
}
function open_menu() {
    clear_deferred_close();
    if (is_anim_in_process())
        return;
	 var controls_elem = document.getElementById("controls"); 
	 var controls_out_vehicle = document.getElementById("control_out_vehicle"); 
	 var controls_view_restore = document.getElementById("control_view_restore"); 
	 m_interface.show_elem(controls_elem);
	 m_interface.show_elem(controls_out_vehicle);
	 m_interface.show_elem(controls_view_restore);
	 document.getElementById("controls").style.zIndex=2;
	 document.getElementById("control_out_vehicle").style.zIndex=2;
	document.getElementById("control_view_restore").style.zIndex=2;
    disable_opened_button();
    if (is_control_panel_opened()) {
       close_menu();
        return;
    }
    var hor_elem = document.querySelector("#fullscreen_on_button") ||
                   document.querySelector("#fullscreen_off_button") ||
                   document.querySelector("#quality_buttons_container");
    var vert_elem = document.querySelector("#vert_section_button").lastElementChild;
    var drop_left = function(elem) {
        _is_anim_left = true;
        elem.style.marginRight = "-45px";
        if ((elem.id == "help_button") &&
                _is_help_menu_opened) {  
            setTimeout(function() {
                _is_anim_left = false;
                _is_panel_open_left = true;
                check_anim_end();
            }, 100);
            return;
        }
        elem.style.display = "block";
        m_app.css_animate(elem, "marginRight", -45, 0, ANIM_ELEM_DELAY, "", "px", function() {
            if (!elem.nextElementSibling) {        
                setTimeout(function() {
                    _is_anim_left = false;
                    _is_panel_open_left = true;
                    check_anim_end();
                }, 100);
                return;
            }
            drop_left(elem.nextElementSibling)
        });
        m_app.css_animate(elem, "opacity", 0, 1, ANIM_ELEM_DELAY, "", "");
    }
    var drop_top = function(elem) {
        _is_anim_top = true;
        elem.style.marginBottom = "-45px";
        elem.style.display = "block";
        m_app.css_animate(elem, "marginBottom", -45, 0, ANIM_ELEM_DELAY, "", "px", function() {
            if (!elem.previousElementSibling) {
                setTimeout(function() {
                    _is_anim_top = false;
                    _is_panel_open_top = true;
                    check_anim_end();
                }, 100);
                return;
            }
            drop_top(elem.previousElementSibling)
        });
        m_app.css_animate(elem, "opacity", 0, 1, ANIM_ELEM_DELAY, "", "");
    }
    _hor_button_section.style.display = "block";
    drop_left(hor_elem);
    if (!_no_social)  
        drop_top(vert_elem);
    if (is_touch())
        document.body.addEventListener("touchmove", deferred_close);
    else {
        _buttons_container.addEventListener("mouseleave", deferred_close);           
        _buttons_container.addEventListener("mouseenter", clear_deferred_close);
    }
}
function check_anim_end() {
    if (!is_anim_in_process()) {
        enable_opened_button();
        if ((!check_cursor_position("buttons_container") &&
                is_control_panel_opened()) ||
                (is_touch() && is_control_panel_opened()))
            deferred_close();
    }
}
function is_touch() {
    return !!(("ontouchstart" in window && !isFinite(navigator.maxTouchPoints))
              || navigator.maxTouchPoints)
}
function is_anim_in_process() {
    return _is_anim_top || _is_anim_left;
}
function is_control_panel_opened() {
    return _is_panel_open_top || _is_panel_open_left;
}
function disable_opened_button() {
    if (is_touch())
        _opened_button.removeEventListener("touchend", open_menu);
    else
        _opened_button.removeEventListener("mouseup", open_menu);
}
function enable_opened_button() {
    if (is_touch())
        _opened_button.addEventListener("touchend", open_menu);
    else
        _opened_button.addEventListener("mouseup", open_menu);
}
function deferred_close(e) {   
    if (is_anim_in_process())
        return;
    clear_deferred_close();
}
function clear_deferred_close() {
    clearTimeout(_menu_close_func);
} 
function close_qual_menu(e) {
    if (is_anim_in_process())
        return;
    if (!_is_qual_menu_opened)
        return;
    _is_qual_menu_opened = false;
    if (e) {
        e.stopPropagation();
        var active_elem = e.target;
    } else
        var active_elem = document.querySelectorAll(".active_elem_q")[0];
    _quality_buttons_container.style.marginRight = "0px";
    for (var i = 0, child = _quality_buttons_container.children; i < child.length; i++) {
        child[i].style.display = "none";
        child[i].style.opacity = 0;
    }
    _quality_buttons_container.className = "control_panel_button " + active_elem.id;
}
function close_stereo_menu(e) {
    if (is_anim_in_process())
        return;
    if (!_is_stereo_menu_opened)
        return;
    _is_stereo_menu_opened = false;
    if (e) {
        e.stopPropagation();
        var active_elem = e.target;
    } else
        var active_elem = document.querySelectorAll(".active_elem_s")[0];
    _stereo_buttons_container.style.marginRight = "0px";
    for (var i = 0, child = _stereo_buttons_container.children; i < child.length; i++) {
        child[i].style.display = "none";
        child[i].style.opacity = 0;
    }
    _stereo_buttons_container.className = "control_panel_button " + active_elem.id;
}
function open_qual_menu(e, button) {
    if (is_anim_in_process())
        return;
    close_stereo_menu();
    _is_qual_menu_opened = true;
    _quality_buttons_container.style.marginRight = "-30px";
    var child_id = button.child_buttons_array_id;
    var child_cb = button.child_buttons_array_cb;
    for (var i = 0; i < child_id.length; i++) {
        var child_elem = document.getElementById(child_id[i]);
        if (!_quality_buttons_container.classList.contains(child_id[i]))
            m_input.add_click_listener(child_elem, child_cb[i]);
        else {
            child_elem.className = "active_elem_q";
            m_input.add_click_listener(child_elem, close_qual_menu);
        }
    }
    _quality_buttons_container.className = "quality_buttons_container";
    for (var i = 0, child = _quality_buttons_container.children; i < child.length; i++) {
        child[i].style.display = "block";
        child[i].style.opacity = 1;
    }
}
function open_stereo_menu(e, button) {
    if (is_anim_in_process())
        return;
    close_qual_menu();
    _is_stereo_menu_opened = true;
    _stereo_buttons_container.style.marginRight = "-30px";
    var child_id = button.child_buttons_array_id;
    var child_cb = button.child_buttons_array_cb;
    for (var i = 0; i < child_id.length; i++) {
        var child_elem = document.getElementById(child_id[i]);
        if (!child_elem)
            continue;
        if (!_stereo_buttons_container.classList.contains(child_id[i]))
            if (is_touch())
                child_elem.addEventListener("touchend", child_cb[i]);
            else
                child_elem.addEventListener("mouseup", child_cb[i]);
        else {
            child_elem.className = "active_elem_s";
            if (is_touch())
                child_elem.addEventListener("touchend", close_stereo_menu);
            else
                child_elem.addEventListener("mouseup", close_stereo_menu);
        }
    }
    var no_hmd = "";
    if (!m_input.can_use_device(m_input.DEVICE_HMD))
        no_hmd = "no_hmd";
    _stereo_buttons_container.className = "stereo_buttons_container " + no_hmd;
    for (var i = 0, child = _stereo_buttons_container.children; i < child.length; i++) {
        child[i].style.display = "block";
        child[i].style.opacity = 1;
    }
}
function change_stereo(stereo) {
    deferred_close();
    if (_stereo_mode == stereo)
        return;
    switch (stereo) {
    case "NONE":
        m_storage.set("stereo", "NONE");
            m_hmd.disable_hmd();
            _pick = m_scs.pick_object;
        break;
    case "ANAGLYPH":
        m_storage.set("stereo", "ANAGLYPH");
        break;
    case "HMD":
        m_storage.set("stereo", "NONE");  
        if (_stereo_mode == "NONE") {
			if (m_hmd.check_browser_support())
			{
				register_hmd();
			}
			else
				return
         action_hmd_cb();
        } else {    
            m_storage.set("stereo", "NONE");
        }
        break;
    }  
    _stereo_mode = stereo;
    set_stereo_button(stereo);
}  
function action_hmd_cb()
{
var dest_x_trans = 0;
var dest_z_trans = 0;
 var elapsed = m_ctl.create_elapsed_sensor();
    var phmdsensor = m_ctl.create_hmd_position_sensor();
    var updated_eye_data = false;
    var last_hmd_pos = m_vec3.create();
    var hmd_cb = function(obj, id, pulse) {
        if (pulse > 0) {
            var hmd_pos = m_ctl.get_sensor_payload(obj, id, 1);  
            if (!updated_eye_data) {
                m_vec3.copy(hmd_pos, last_hmd_pos);  
                updated_eye_data = true;  
            } else {
                var diff_hmd_pos = m_vec3.subtract(hmd_pos, last_hmd_pos, _vec3_tmp2);
                m_vec3.scale(diff_hmd_pos, 15, diff_hmd_pos);
                dest_x_trans += diff_hmd_pos[0];
                dest_z_trans += diff_hmd_pos[2]; 
                m_vec3.copy(hmd_pos, last_hmd_pos);
            }
        }
    }
    var cam_obj = m_scs.get_active_camera();
    m_ctl.create_sensor_manifold(cam_obj, "HMD_TRANSLATE_CAMERA",
            m_ctl.CT_CONTINUOUS, [elapsed, phmdsensor], null, hmd_cb);
}
function get_hmd_type() {  
        var hmd_type_tmp = m_input.can_use_device(m_input.DEVICE_HMD) && m_main.detect_mobile()   
          , device_hmd = m_input.get_device_by_type_element(m_input.DEVICE_HMD);
        return hmd_type_tmp ? "HMD" : "NONE"
    }
function register_hmd() {
    m_hmd_conf.update();
    m_hmd.enable_hmd(m_hmd.HMD_ALL_AXES_MOUSE_NONE);  
}
function reload_app() {         
    setTimeout(function() {
        window.location.reload();
    }, 100);
}
function set_stereo_config() {
    var stereo = m_storage.get("stereo") || DEFAULT_STEREO;  
    _stereo_mode = stereo;            
    if (stereo == "NONE" && m_input.can_use_device(m_input.DEVICE_HMD))
        stereo = "HMD";
    m_cfg.set("stereo", stereo);
}
function on_resize() {
    m_cont.resize_to_container();
} 
function loaded_callback(data_id, success) {
    if (!success) {
        report_app_error("Could not load the scene",
                "For more info visit",
                 "https://www.blend4web.com/doc/en/web_player.html");
        return;
    }
    m_app.enable_camera_controls();
    m_main.set_render_callback(render_callback);
    on_resize();
    var mouse_move  = m_ctl.create_mouse_move_sensor();
    var mouse_click = m_ctl.create_mouse_click_sensor();
    var canvas_cont = m_cont.get_container();
    function move_cb() {
        canvas_cont.className = "move";   
    }
    function stop_cb(obj, id, pulse) {
        if (pulse == -1)
            canvas_cont.className = "";
    }
    m_ctl.create_sensor_manifold(null, "MOUSE_MOVE", m_ctl.CT_SHOT,
            [mouse_click, mouse_move], function(s) {return s[0] && s[1]}, move_cb);
    m_ctl.create_sensor_manifold(null, "MOUSE_STOP", m_ctl.CT_TRIGGER,
            [mouse_click], function(s) {return s[0]}, stop_cb);
    var url_params = m_app.get_url_params();
    if (url_params && "autorotate" in url_params)
        rotate_camera();
    var meta_tags = m_scs.get_meta_tags();
    if (meta_tags.title)
        document.title = meta_tags.title;
}
 function render_callback(elapsed, current_time) {}
function rotate_camera(e) {
    if (is_anim_in_process())
        return;
    if (e)
        var elem = e.target
    else
        var elem = document.querySelector("#auto_rotate_on_button");
    m_camera_anim.auto_rotate(CAMERA_AUTO_ROTATE_SPEED, function(){
        if (elem)
            update_button(elem);
    });
    if (elem)
        update_button(elem);
    if (m_main.is_paused()) {
        resume_engine();
        update_play_pause_button();
    }
}
function stop_camera(e) {
    if (is_anim_in_process())
        return;
    m_camera_anim.auto_rotate(CAMERA_AUTO_ROTATE_SPEED);
    if (e)
        update_button(e.target);
}
function play_sound(e) {
    if (is_anim_in_process())
        return;
m_load_level.setup_music(m_char.get_wrapper().data_main_id);
    update_button(e.target);
}
function stop_sound(e) {
    if (is_anim_in_process())
        return;
	  m_ctl.remove_sensor_manifold(null, "PLAYLIST");
    update_button(e.target);
} 
 function pause_engine(e) {   
    if (is_anim_in_process())
        return;
    m_main.pause();
   if (e)
       update_button(e.target);
}
function resume_engine(e) {
    if (is_anim_in_process())
        return;
    m_main.resume();
    if (e)
        update_button(e.target);
}
function check_fullscreen() {
    var fullscreen_on_button = document.querySelector("#fullscreen_on_button");
	if (!m_screen.check_fullscreen())  
	  fullscreen_on_button.parentElement.removeChild(fullscreen_on_button);
}
function enter_fullscreen(e) {  
    if (is_anim_in_process())
        return;
    var hmd_device = m_input.get_device_by_type_element(m_input.DEVICE_HMD);
    if (hmd_device &&
            m_input.get_value_param(hmd_device, m_input.HMD_WEBVR_TYPE) ==
            m_input.HMD_WEBVR1)
        m_screen.request_fullscreen_hmd();
    else
        m_screen.request_fullscreen(document.body, fullscreen_cb, fullscreen_cb);
}
function exit_fullscreen() {
    if (is_anim_in_process())
        return;
    m_screen.exit_fullscreen();
}
function fullscreen_cb(e) {
    if (!check_cursor_position("buttons_container") && _is_anim_left)
        deferred_close();
    var fullscreen_button = document.querySelector("#fullscreen_on_button") ||
                            document.querySelector("#fullscreen_off_button");
    if (fullscreen_button)
        update_button(fullscreen_button);
}
 function activate_knife_tps_cb(e) {
	m_weapons.activate_knife_tps();	
}
function activate_sword_tps_cb(e) {
	m_weapons.activate_sword_tps();	
}
function activate_pistol_tps_cb(e) {
	m_weapons.activate_pistol_tps();	
}
function activate_gun_laser_tps_cb(e) {
	m_weapons.activate_gun_laser_tps();	
}
function activate_gun_tps_cb(e) {
	m_weapons.activate_gun_tps();	
}
function assig_index_current_weapon_desde_buttons(current_weapon) {	 
  var time=m_time.get_timeline();								
	 if (current_weapon==0)
	 {	
		_options_anims_wrapper.last_button_weapons_time=time;
		_options_anims_wrapper.current_weapon=0;
	 }	
	 if (current_weapon==1)
	 { 
	  _options_anims_wrapper.last_button_weapons_time=time;
	  _options_anims_wrapper.current_weapon=1;
	 } 
	 if (current_weapon==2)
	 {  
    	_options_anims_wrapper.last_button_weapons_time=time;
		_options_anims_wrapper.current_weapon=2;
	 }
	 if (current_weapon==3)
	 {  
		_options_anims_wrapper.last_button_weapons_time=time;
		console.log("este cambio a weapon rifle se da en la llamada desde weapons a asignar con botones el arma") 
		_options_anims_wrapper.current_weapon=3;
	 }	
 }
 function create_interface() {  
            m_gp_cf.show();
}
exports.get_wrapper=get_wrapper; 
 function get_wrapper() {
	return _options_anims_wrapper;	 
 }
})	