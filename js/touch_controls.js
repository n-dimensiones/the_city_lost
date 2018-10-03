"use strict"
if (b4w.module_check("touch_controls"))
    throw "Failed to register module: touch_controls";
b4w.register("touch_controls", function(exports, require) {
var m_ctl   = require("controls");
var m_view	= require("control_view");
var m_vehicle     = require("vehicles"); 
exports.setup_touch_controls = function (right_arrow, up_arrow, left_arrow,
                                         down_arrow, jump, attack, view_tps, view_FPS, fly, right_giro, left_giro) {    
    var touch_start_pos = new Float32Array(2);
	var touch_start_pos_giro = new Float32Array(2);
    var move_touch_idx;
	var giro_touch_idx;  
    var jump_touch_idx;
    var attack_touch_idx;
	var view_tps_touch_idx;
	var view_FPS_touch_idx;
	var fly_touch_idx;
    var tap_elem = document.getElementById("control_tap");
	 var giro_tap_elem = document.getElementById("control_giro_tap"); 
    var control_elem = document.getElementById("control_circle");
    var tap_elem_offset = tap_elem.clientWidth / 2;        
	var giro_tap_elem_offset = giro_tap_elem.clientWidth / 2;    
    var ctrl_elem_offset = control_elem.clientWidth / 2;
    function touch_start_cb(event) {
        event.preventDefault();
        var h = window.innerHeight;
        var w = window.innerWidth;
        var touches = event.changedTouches;
		 var touches_giro = event.changedTouches;  
        for (var i = 0; i < touches.length; i++) {
            var touch = touches[i];
            var x = touch.clientX;
            var y = touch.clientY;
            if (x > w / 2) 
                break;
            touch_start_pos[0] = x;
            touch_start_pos[1] = y;
            move_touch_idx = touch.identifier;
            tap_elem.style.visibility = "visible";
            tap_elem.style.left = x - tap_elem_offset + "px";
            tap_elem.style.top  = y - tap_elem_offset + "px";
            control_elem.style.visibility = "visible";
			control_elem.style.zIndex = 2;
            control_elem.style.left = x - ctrl_elem_offset + "px";
            control_elem.style.top  = y - ctrl_elem_offset + "px";
        }
		for (var i = 0; i < touches_giro.length; i++) {
            var touch_giro = touches_giro[i];
            var x = touch_giro.clientX;
            var y = touch_giro.clientY;
            if (x < w / 2) 
                break;
            touch_start_pos_giro[0] = x;
            touch_start_pos_giro[1] = y;
            giro_touch_idx = touch_giro.identifier;
            giro_tap_elem.style.visibility = "visible";
			giro_tap_elem.style.zIndex = 2;  
            giro_tap_elem.style.left = x - giro_tap_elem_offset + "px";  
            giro_tap_elem.style.top  = y - giro_tap_elem_offset + "px";
        }
    }
    function touch_jump_cb (event) {
        event.preventDefault();
        var touches = event.changedTouches;
        for (var i = 0; i < touches.length; i++) {
            var touch = touches[i];
            m_ctl.set_custom_sensor(jump, 1);
            jump_touch_idx = touch.identifier;
        }
    }
	 function touch_view_tps_cb (event) {         
        event.preventDefault();
        var touches = event.changedTouches;
        for (var i = 0; i < touches.length; i++) {
            var touch = touches[i];
            view_FPS_touch_idx = touch.identifier;
        }
		 m_ctl.set_custom_sensor(view_FPS, 1);
		m_ctl.set_custom_sensor(view_tps, 0);
		m_ctl.set_custom_sensor(m_view.get_wrapper().view_fps_touch_sensor, 1);
		m_ctl.set_custom_sensor(m_view.get_wrapper().view_tps_touch_sensor, 0);
		console.log("se pulso sobre boton control view para el caso de ser tps");
    }
	 function touch_view_FPS_cb (event) {
		 event.preventDefault();
        var touches = event.changedTouches;
        for (var i = 0; i < touches.length; i++) {
            var touch = touches[i];
            view_tps_touch_idx = touch.identifier;
        }
		m_ctl.set_custom_sensor(view_tps, 1);
		m_ctl.set_custom_sensor(view_FPS, 0);
		m_ctl.set_custom_sensor(m_view.get_wrapper().view_tps_touch_sensor, 1);
		m_ctl.set_custom_sensor(m_view.get_wrapper().view_fps_touch_sensor, 0);
		console.log("se pulso sobre boton control view para el caso de ser Fps");
    }
    function touch_attack_cb (event) {
        event.preventDefault();
        var touches = event.changedTouches;
        for (var i = 0; i < touches.length; i++) {
            var touch = touches[i];
            attack_touch_idx = touch.identifier;
        }
		m_ctl.set_custom_sensor(attack[0], 1);
		m_ctl.set_custom_sensor(attack[1], 1);
		m_ctl.set_custom_sensor(attack[2], 1);
		m_ctl.set_custom_sensor(attack[3], 1);
		m_ctl.set_custom_sensor(attack[4], 1);
    }
	function touch_fly_cb (event) {
        event.preventDefault();
        var touches = event.changedTouches;
        for (var i = 0; i < touches.length; i++) {
            var touch = touches[i];
            fly_touch_idx = touch.identifier;
        }
		 m_ctl.set_custom_sensor(fly[0], 1);
		m_ctl.set_custom_sensor(fly[1], 1);
		m_ctl.set_custom_sensor(fly[2], 1);
    }
    function touch_move_cb(event) {
        event.preventDefault();
        m_ctl.set_custom_sensor(up_arrow, 0);
        m_ctl.set_custom_sensor(down_arrow, 0);
        m_ctl.set_custom_sensor(left_arrow, 0);
        m_ctl.set_custom_sensor(right_arrow, 0);
		m_ctl.set_custom_sensor(right_giro, 0);
		m_ctl.set_custom_sensor(left_giro, 0);
        var h = window.innerHeight;
        var w = window.innerWidth;
        var touches = event.changedTouches;
		var touches_giro = event.changedTouches;
        for (var i=0; i < touches.length; i++) {
            var touch = touches[i];
            var x = touch.clientX;
            var y = touch.clientY;
            if (x > w / 2) 
                break;
            tap_elem.style.left = x - tap_elem_offset + "px";
            tap_elem.style.top  = y - tap_elem_offset + "px";
            var d_x = x - touch_start_pos[0];
            var d_y = y - touch_start_pos[1];
            var r = Math.sqrt(d_x * d_x + d_y * d_y);
            if (r < 16) 
                break;
            var cos = d_x / r;
            var sin = -d_y / r;
            if (cos > Math.cos(3 * Math.PI / 8))
                m_ctl.set_custom_sensor(right_arrow, 1);
            else if (cos < -Math.cos(3 * Math.PI / 8))
                m_ctl.set_custom_sensor(left_arrow, 1);
            if (sin > Math.sin(Math.PI / 8))
                m_ctl.set_custom_sensor(up_arrow, 1);
            else if (sin < -Math.sin(Math.PI / 8))
                m_ctl.set_custom_sensor(down_arrow, 1);
        }
		for (var i=0; i < touches_giro.length; i++) {
            var touch_giro = touches_giro[i];
            var x = touch_giro.clientX;
            var y = touch_giro.clientY;
            if (x < w / 2) 
                break;     
            giro_tap_elem.style.left = x - giro_tap_elem_offset + "px";
            giro_tap_elem.style.top  = y -  giro_tap_elem_offset + "px";
            var d_x = x - touch_start_pos_giro[0];
            var d_y = y - touch_start_pos_giro[1];
            var r = Math.sqrt(d_x * d_x + d_y * d_y);
            if (r < 16) 
                break;		
            var cos = d_x / r;
            var sin = -d_y / r;
            if (cos > Math.cos(3 * Math.PI / 8))
                m_ctl.set_custom_sensor(right_giro, 1);
            else if (cos < -Math.cos(3 * Math.PI / 8))
                m_ctl.set_custom_sensor(left_giro, 1);
        }
    }
    function touch_end_cb(event) {
        event.preventDefault();
        var touches = event.changedTouches;
		 var touches_giro = event.changedTouches;
        for (var i=0; i < touches.length; i++) {
            if (touches[i].identifier == move_touch_idx) {
                m_ctl.set_custom_sensor(up_arrow, 0);
                m_ctl.set_custom_sensor(down_arrow, 0);
                m_ctl.set_custom_sensor(left_arrow, 0);
                m_ctl.set_custom_sensor(right_arrow, 0);
                tap_elem.style.visibility = "hidden";
                control_elem.style.visibility = "hidden";
				control_elem.style.zIndex = 0;
                move_touch_idx = null;
            } else if (touches[i].identifier == jump_touch_idx) {
                m_ctl.set_custom_sensor(jump, 0);
                jump_touch_idx = null;
            } else if (touches[i].identifier == attack_touch_idx) {
                m_ctl.set_custom_sensor(attack[0], 0);
				 m_ctl.set_custom_sensor(attack[1], 0);
				 m_ctl.set_custom_sensor(attack[2], 0);
				 m_ctl.set_custom_sensor(attack[3], 0);
				  m_ctl.set_custom_sensor(attack[4], 0);
                attack_touch_idx = null;
            }
			 else if (touches[i].identifier == fly_touch_idx) {
                m_ctl.set_custom_sensor(fly[0], 0);
				 m_ctl.set_custom_sensor(fly[1], 0);
				 m_ctl.set_custom_sensor(fly[2], 0);				 
                fly_touch_idx = null;
            }
			else if  (touches[i].identifier==view_FPS_touch_idx) {
				 m_ctl.set_custom_sensor(view_FPS, 0);
		m_ctl.set_custom_sensor(view_tps, 1);
		m_ctl.set_custom_sensor(m_view.get_wrapper().view_fps_touch_sensor, 0);
		m_ctl.set_custom_sensor(m_view.get_wrapper().view_tps_touch_sensor, 1);
		console.log("se dejo de pulsar sobre boton control view para el caso de ser Fps");
				view_FPS_touch_idx= null;
			}
			else if (touches[i].identifier==view_tps_touch_idx) {
				 m_ctl.set_custom_sensor(view_FPS, 1);
		m_ctl.set_custom_sensor(view_tps, 0);
		m_ctl.set_custom_sensor(m_view.get_wrapper().view_fps_touch_sensor, 1);
		m_ctl.set_custom_sensor(m_view.get_wrapper().view_tps_touch_sensor, 0);
		console.log("se dejo de pulsar sobre boton control view para el caso de ser tps");
				view_tps_touch_idx= null;
			}
        }
		  for (var i=0; i < touches_giro.length; i++) {
            if (touches_giro[i].identifier == giro_touch_idx) {
                m_ctl.set_custom_sensor(left_giro, 0);
                m_ctl.set_custom_sensor(right_giro, 0);
                giro_tap_elem.style.visibility = "hidden";  
                giro_touch_idx = null;
				giro_tap_elem.style.zIndex = 0;
			}
        }  
    }  
    document.getElementById("main_canvas_container").addEventListener("touchstart", touch_start_cb, false);
		document.getElementById("control_jump").addEventListener("touchstart", touch_jump_cb, false);
		document.getElementById("control_attack").addEventListener("touchstart", touch_attack_cb, false);
		document.getElementById("control_view_tps").addEventListener("touchstart", touch_view_tps_cb, false);
		document.getElementById("control_view_FPS").addEventListener("touchstart", touch_view_FPS_cb, false);
		document.getElementById("control_fly").addEventListener("touchstart", touch_fly_cb, false);
    document.getElementById("main_canvas_container").addEventListener("touchmove", touch_move_cb, false);
    document.getElementById("main_canvas_container").addEventListener("touchend", touch_end_cb, false);
    document.getElementById("controls").addEventListener("touchend", touch_end_cb, false);
    document.getElementById("control_jump").style.visibility = "visible";
    document.getElementById("control_attack").style.visibility = "visible";
	document.getElementById("control_view_tps").style.visibility = "visible";
	document.getElementById("control_view_FPS").style.visibility = "visible";
	document.getElementById("control_fly").style.visibility = "visible";
	show_controls_touch();
}
exports.hide_controls_touch=hide_controls_touch;
function hide_controls_touch() {
    document.getElementById("control_jump").style.visibility = "hidden";
    document.getElementById("control_attack").style.visibility = "hidden";
	document.getElementById("control_view_tps").style.visibility = "hidden";
	document.getElementById("control_view_FPS").style.visibility = "hidden";
	document.getElementById("control_fly").style.visibility = "hidden";
}
exports.show_controls_touch=show_controls_touch; 
function show_controls_touch(){
    document.getElementById("control_jump").style.visibility = "visible";
    document.getElementById("control_attack").style.visibility = "visible";
	document.getElementById("control_view_tps").style.visibility = "visible";
	document.getElementById("control_view_FPS").style.visibility = "visible";
	document.getElementById("control_fly").style.visibility = "visible";
}
})