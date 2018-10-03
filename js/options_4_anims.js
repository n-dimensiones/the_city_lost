"use strict"
if (b4w.module_check("options_4_anims"))
    throw "Failed to register module: options_4_anims";
b4w.register("options_4_anims", function(exports, require) {
var m_app         = require("app");
var m_screen	  = require("screen"); 
var m_input       = require("input");  
var m_main        = require("main");
var m_scs 		  = require("scenes");  
var _menu_close_func         = null;
var _is_panel_open_top       = false;
var _is_panel_open_left      = false;
var _is_anim_top             = false;
var _is_anim_left            = false;
var _is_help_menu_opened      = false;
var _no_social               = false;  
var _geometric_01			=null;
var _geometric_02           =null;
var ANIM_ELEM_DELAY          = 50;
var _opened_0_button=null;
var _buttons_0_container=null;
var _hor_0_button_section=null;
var _portfolio_4_button=null;
var _is_hiden=false;   
var _player_buttons = [
    {
	type: "simple_button", 
	id: "opened_4_button",
	callback:  open_menu
	},
    {
	type: "simple_button", 
	id: "portfolio_4_button",  
	callback:  function () {  
		console.log("a ver si vemos esto para primer boton a la izq desde el centro");
		window.open("https://www.n-dimensiones.es/portafolio","_self"); 
		}
	},
    {
	type: "simple_button",
	id: "source_code_4_button"
	,
  callback: function () {
			window.open("https://github.com/n-dimensiones","_self");	
	  }
	},
    {
	 type:              "trigger_button",
     id:                "contacto_4_button",                  
	 callback: function () {
		 console.log("a ver si vemos esto para el segundo boton a la izq desde el centro"); 
		 window.open("https://www.n-dimensiones.es/main/contacto","_self");  
		 },
     replace_button_id: "fullscreen_4_off_button",            
	 replace_button_cb: function () {console.log("no deberiamos ver ejecutarse esta nunca, exit_fullscreen")}
	 }
] 
exports.init = function(geometric_01,geometric_02,load_level_cb,change_avatar_cb, is_main_menu) {    	 
	 cache_dom_elems();
	 _opened_0_button.style.display = "block";									
	 init_control_buttons();  
  } 
function cache_dom_elems() {
   _buttons_0_container = document.querySelector("#buttons_4_container");
     _opened_0_button = document.querySelector("#opened_4_button");
	   _portfolio_4_button = document.querySelector("#portfolio_4_button");
	 _hor_0_button_section = document.querySelector("#hor_4_button_section");
		_geometric_01 = document.getElementById("geometry_01");
	 	_geometric_02 = document.getElementById("geometry_02");
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
    _buttons_0_container.removeEventListener("mouseleave", deferred_close);
    _buttons_0_container.removeEventListener("mouseenter", clear_deferred_close);
    document.body.removeEventListener("touchmove", deferred_close);
    var hor_elem  = document.querySelector("#portfolio_4_button");
    var vert_elem = document.querySelector("#vert_4_section_button").firstElementChild;
    var drop_left = function(elem) {
        _is_anim_left = true;
		 elem.style.display = "";
		elem.style.marginRight = "-45px";
		elem.style.zIndex = 0;
            if (elem.previousElementSibling && elem.previousElementSibling.id != "opened_4_button")  
			{  elem.style.opacity = 0; 
                drop_left(elem.previousElementSibling);  
			}
            else {  
                setTimeout(function() {
                    _is_anim_left = false;
                    _is_panel_open_left = false;
                    check_anim_end();  
                    _hor_0_button_section.style.display = "";
                }, 100);
                return;
            } 
    }  
    var drop_top = function(elem) {
        _is_anim_top = true;
        elem.style.display = "";
		elem.style.marginBottom = "-45px";
		elem.style.zIndex = 0;
            if (elem.nextElementSibling && elem.nextElementSibling.id != "opened_4_button")
			{	elem.style.opacity = 0; 
                drop_top(elem.nextElementSibling);
			}	
            else {
                setTimeout(function() {
                    _is_anim_top = false;
                    _is_panel_open_top = false;
                    check_anim_end();  
                }, 100);
                return;
            }  
    } 
    if (!_no_social)
        drop_top(vert_elem);
    drop_left(hor_elem);
}								
function open_menu() {
    clear_deferred_close();
    if (is_anim_in_process())
        return;
    disable_opened_button();  
    if (is_control_panel_opened()) {
       close_menu();
        return;
    }
    var hor_elem = document.querySelector("#contacto_4_button") ||
                   document.querySelector("#fullscreen_4_off_button")||
				   document.querySelector("#source_code_4_button");
    var vert_elem = document.querySelector("#vert_3_section_button").lastElementChild;
    var drop_left = function(elem) {  
        _is_anim_left = true;
        elem.style.marginRight = "-45px";
        if ((elem.id == "portfolio_4_button") &&
                _is_help_menu_opened) {
            setTimeout(function() {
                _is_anim_left = false;
                _is_panel_open_left = true;
                check_anim_end();
            }, 100);
            return;
        }
        elem.style.display = "block";
		elem.style.marginRight = "0px";
		elem.style.zIndex = 2;
		    if (!elem.nextElementSibling) {  
			elem.style.opacity = 1;  
                setTimeout(function() {
                    _is_anim_left = false;
                    _is_panel_open_left = true;
                    check_anim_end();  
                }, 100);
                return;
            }  
			elem.style.opacity = 1;
            drop_left(elem.nextElementSibling);
    }
    var drop_top = function(elem) {          
        _is_anim_top = true;
        elem.style.marginBottom = "-45px";
        elem.style.display = "block";
		elem.style.marginBottom = "0px";
            if (!elem.previousElementSibling) {
					elem.style.opacity = 1;
                setTimeout(function() {
                    _is_anim_top = false;
                    _is_panel_open_top = true;
                    check_anim_end();
                }, 100);
                return;
            }
            drop_top(elem.previousElementSibling)   
		elem.style.opacity = 1;
    }
    _hor_0_button_section.style.display = "block";  
    if (!_no_social)   
        drop_top(vert_elem);
    drop_left(hor_elem);
    if (is_touch())
        document.body.addEventListener("touchmove", deferred_close);
    else {
        _buttons_0_container.addEventListener("mouseleave", deferred_close);
        _buttons_0_container.addEventListener("mouseenter", clear_deferred_close); 
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
                              });
                    else
                        elem.addEventListener("mouseup", function(e) {
                                  button.callback(e, button);
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
    var button_links = document.querySelectorAll(".control_4_panel_button a");  
    for (var i = 0; i < button_links.length; i++) {
        var link = button_links[i];
        if (link.hasAttribute("href"))
            link.href += document.location.href;  
        add_hover_class_to_button(link.parentNode);
    }
}
function check_anim_end() {
    if (!is_anim_in_process()) {
        enable_opened_button();
        if ((!check_cursor_position("buttons_4_container") &&
                is_control_panel_opened()) ||
                (is_touch() && is_control_panel_opened()))
            deferred_close();
    }
}	 
function is_touch() {                  
    return !!(("ontouchstart" in window && !isFinite(navigator.maxTouchPoints))
              || navigator.maxTouchPoints)
}	 
function get_button_object_from_id(elem_id) {
    for (var i = 0; i < _player_buttons.length; i++)
        if (_player_buttons[i].id == elem_id)
            return _player_buttons[i];
    return null;
}
function add_hover_class_to_button(elem) {       
    if (!elem)
        return;
    if (m_main.detect_mobile()) {
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
function is_anim_in_process() {
    return _is_anim_top || _is_anim_left;
}
function is_control_panel_opened() {
    return _is_panel_open_top || _is_panel_open_left;
}
function disable_opened_button() {
    if (is_touch())
        _opened_0_button.removeEventListener("touchend", open_menu);
    else
        _opened_0_button.removeEventListener("mouseup", open_menu);
}
function enable_opened_button() {   
    if (is_touch())
        _opened_0_button.addEventListener("touchend", open_menu);
    else
        _opened_0_button.addEventListener("mouseup", open_menu);
}
function deferred_close(e) {   
    if (is_anim_in_process())
        return;
    clear_deferred_close();
}
function clear_deferred_close() {
    clearTimeout(_menu_close_func);
} 	
function remove_anims_css(geometric_01,geometric_02)  
{
	 if (is_anim_in_process())
        return;
	if (!_is_hiden)   
		   {
			_geometric_01=document.getElementById("geometry_01");
			_geometric_02=document.getElementById("geometry_02");
			_geometric_01.parentNode.removeChild(_geometric_01);	
			_geometric_02.parentNode.removeChild(_geometric_02);	
			console.log("se han detenido toda animacion de la portada tanto riged como css");
			_is_hiden=true;  
		   } 	   
        else
			restablece_anims_css();
}
function restablece_anims_css(geometric_01,geometric_02)  
{
 var start_cont=document.getElementById("start_cont");	   	
   _geometric_01=document.createElement("div");
		start_cont.appendChild(_geometric_01);
		_geometric_01.id="geometric_01";
		var   div_codepen=document.createElement("div");
		_geometric_01.appendChild(div_codepen);
		var   div_codepen2=document.createElement("div");
		_geometric_01.appendChild(div_codepen2);
		div_codepen.className = "codepen";
		div_codepen2.className = "codepen2";
		var   div_cube=document.createElement("div");
		div_codepen.appendChild(div_cube);
		div_cube.className = "cube";
		var   div_face1=document.createElement("div");
		div_cube.appendChild(div_face1);
		var   div_face2=document.createElement("div");
		div_cube.appendChild(div_face2);
		var   div_face3=document.createElement("div");
		div_cube.appendChild(div_face3);
		var   div_face4=document.createElement("div");
		div_cube.appendChild(div_face4);
		var   div_face5=document.createElement("div");
		div_cube.appendChild(div_face5);
		var   div_face6=document.createElement("div");
		div_cube.appendChild(div_face6);
		div_face1.className = "face";
		div_face2.className = "face";
		div_face3.className = "face";
		div_face4.className = "face";
		div_face5.className = "face";
		div_face6.className = "face";
	  var opened_0_button=document.getElementById("opened_4_button");	
		opened_0_button.appendChild(_geometric_02);
		_geometric_02.id="geometric_02";
	console.log("se habra rellenado las tabla face");
		console.log("mostramos las animaciones nuevamente");   
		_is_hiden=false;  
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
    if (!check_cursor_position("buttons_4_container") && _is_anim_left)
        deferred_close();
    var fullscreen_0_button = document.querySelector("#fullscreen_4_on_button") ||
                            document.querySelector("#fullscreen_4_off_button");
    if (fullscreen_0_button)
        update_button(fullscreen_0_button);
} 
});