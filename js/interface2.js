"use strict"
if (b4w.module_check("interface2"))
    throw "Failed to register module: interface2";
b4w.register("interface2", function(exports, require) {
var m_char = require("character2");
var m_scs = require("scenes");
var m_trans       = require("transform");
var m_anim_camera = require("camera_anim");
var m_quat        = require("quat");
var m_phy   = require("physics");
var m_ctl   = require("controls");
var m_time  = require("time");
var m_cont = require("container");
var m_main = require("main");
var m_data = require("data");
var m_storage     = require("storage");
var m_game_main = require("game_main");  
var m_aliens = require("aliens");
var m_trex = require("trex");
var m_faders_3d = require("faders_3d");
var m_conf = require("game_config");
var m_main_menu=require("main_menu");
var m_options_1_anims=b4w.require("options_1_anims");
var m_change_char =require("change_character");
var m_view 		= require("control_view");  
var _quad=m_quat.create();
var _POS_char = new Float32Array(3);   
var _premi=0;
var _life=0;
var _previa_posicion="";						
var _previa_orientacion="";						
var _previ_premi="";
var _previ_life="";
var  _current_char="";
var _is_main_menu=false; 
var _char_tps_name="";
var _char_fps_name="";
var _touch_main_menu=null;  
var _main_points_container=null;
var _value_label=null;
exports.init = function(replay_cb, elapsed_sensor, load_cb,           
                        preloader_cb, plock_cb, level_name,         
                        load_level, menu_change_avatar_cb) {       
m_storage.init("atlantida save state nivel");
    var control_load_previ_stat     = document.getElementById("control_load_previ_stat");  
    var control_save_current_stat   = document.getElementById("control_save_current_stat");
	var control_view_restore   = document.getElementById("control_view_restore");  
	var control_out_vehicle   = document.getElementById("control_out_vehicle");  
    var replay_button = document.getElementById("replay");  
	 var game_exit      = document.getElementById("game_exit");
	 var game_exit_sub_btn = document.getElementById("game_exit_dialeg_sub");
	 var save_game      = document.getElementById("save_game");
    var life_bar      = document.getElementById("life_bar");
    var game_menu     = document.getElementById("game_menu");
    var menu_resume   = document.getElementById("menu_resume");
    var menu_help     = document.getElementById("menu_help");
    var menu_restart  = document.getElementById("menu_restart");
	var menu_character  = document.getElementById("menu_character");
    var menu_exit     = document.getElementById("menu_exit");
    var menu_credits  = document.getElementById("menu_credits");
    var control_circle = document.getElementById("control_circle");
    var controls_elem = document.getElementById("controls");          
    var game_menu_calling = document.getElementById("game_menu_calling");
    var next_level = document.getElementById("next_level");
    var victory_elem = document.getElementById("victory");
    var credits_panel  = document.getElementById("credits_panel");
    var authors_panel  = document.getElementById("authors_list");
    var authors_list_exit  = document.getElementById("authors_list_exit");
    var authors_click_area = document.getElementById("authors_click_area");
    var help_panel  = document.getElementById("help_panel");
    var preloader_cont = document.getElementById("preloader_cont");
    var back_to_menu  = document.getElementById("back_to_menu");
    var under_construction = document.getElementById("under_construct");
    var canvas_shadow = document.getElementById("canvas_shadow");  
    var canvas_elem = m_cont.get_canvas();
 function next_level_cb(e) {  
        e.stopPropagation();
        e.preventDefault();
		m_anim_camera.stop_cam_rotating();
			var camera = m_scs.get_active_camera();
			m_ctl.remove_sensor_manifold(camera, "CAMERA_ROTATION"); 
        hide_elem(victory_elem);
        hide_elem(life_bar);
        hide_elem(controls_elem);
        hide_elem(control_circle);
		level_name=m_char.get_wrapper().level;	
		var _data_id_fps=[];
		var _control_data_id=[];     
								_char_tps_name=m_char.get_wrapper().current_char; 
				_char_fps_name= "hunter3_fps_avatar";  
if (_char_tps_name=="hunter_avatar")		
{
 var _index=3;
  var _length=4; 
}
	if (_char_tps_name=="hunter2_avatar")		
	{
		var _index=1;
		var _length=2; 
	}
		if (_char_tps_name=="amazon_avatar")	  
			{
			var _index=3;
			var _length=4; 
			}
				if (_char_tps_name=="greek_avatar")		
				{
				var _index=4;
				var _length=5; 
				}
		var _main_menu=false; 
        switch (level_name) {
        case "level02":   
		 m_main_menu.load_level_cb("level01", false, _control_data_id,_data_id_fps, _char_fps_name, _char_tps_name,_main_menu,_index,_length);
            break;
	   case "level01":
			m_faders_3d.fader_wormhole(10000);
			window.open("https://www.n-dimensiones.es/portafolio/","_self");
			console.log("dejamos una imagen tachada porque no hay aun un video o algo a mostrar aqui podria ser multiplayer juego");	  
            break;
        }
    }
  function resume_cb() {  
        m_main.resume();
        hide_elem(game_menu, 0.5);
        hide_elem(canvas_shadow);
			document.getElementById("main_canvas_container").style.zIndex = 2;
			document.getElementById("main_canvas_container").style.opacity = 1;   
						document.getElementById("game_menu").style.opacity = 0;  
    }
  function credits_cb() {
		credits_panel.style.visibility="visible";
		credits_panel.style.zIndex=3;
		credits_panel.style.opacity=1;
		console.log("si vemos esto y no mostro la credts panel o lista creditos es que show_elem no funciona");
    }
  function authors_cb(e) {
        e.preventDefault();
        e.stopPropagation();
	 authors_panel.style.visibility="visible";
		authors_panel.style.zIndex=4;
		authors_panel.style.opacity=1;
		console.log("si vemos esto y no mostro la autor panel con mi fondo y link al equipo n-dimensiones, es que show_elem no funciona");
    }
   function help_cb() {
        show_elem(help_panel);
		help_panel.style.visibility="visible";
		help_panel.style.zIndex=3;
		help_panel.style.opacity=1;
		console.log("si vemos esto y no mostro la ayuda panel es que show_elem no funciona");
    }
   function menu_exit_cb() {    
        m_main.resume();
        m_data.unload();  
        hide_elem(back_to_menu);
        hide_elem(under_construction);
        hide_elem(game_menu);
        hide_elem(canvas_shadow);
        hide_elem(life_bar);
        hide_elem(game_menu_calling);
        hide_elem(controls_elem);
        hide_elem(control_circle);
		hide_elem(_main_points_container);  
		hide_botons_ctrl_help_load_save();  
		document.getElementById("control_main_menu").style.visibility = "hidden"; 
	document.getElementById("control_load_previ_stat").style.visibility = "hidden";
    document.getElementById("control_save_current_stat").style.visibility = "hidden";
		document.getElementById("control_view_restore").style.visibility = "hidden";	
			document.getElementById("control_out_vehicle").style.visibility = "hidden";	
        if (m_main.detect_mobile()) {  
			var load_path = m_conf.ASSETS_PATH+"menu_intro.json"; 
			 m_data.load(load_path, m_main_menu.intro_load_cb, m_main_menu.preloader_cb,true);  
        } else
		{   
		var load_path = m_conf.ASSETS_PATH+"menu_intro.json"; 
		 m_data.load(load_path, m_main_menu.intro_load_cb, m_main_menu.preloader_cb,true);  
		}		
    }  
    function menu_restart_cb() {
        m_main.resume();    
        hide_elem(game_menu);
        hide_elem(canvas_shadow);
        replay_cb(elapsed_sensor);
		control_view_restore_cb();
    }
    function replay_btn_cb() {  
        hide_elem(replay_button);
        hide_elem(victory_elem);            
        replay_cb(elapsed_sensor);    
			var camera = m_scs.get_active_camera();
			m_ctl.remove_sensor_manifold(camera, "CAMERA_ROTATION"); 
		m_anim_camera.stop_cam_rotating();
		control_view_restore_cb();  
    }
	function game_exit_sub_btn_cb() {
	window.open("index.html","_self");  
	}
	 function menu_character_cb() {  
        hide_elem(game_menu);
       hide_elem(canvas_shadow);
	    hide_elem(back_to_menu);
        hide_elem(under_construction);
        hide_elem(life_bar);
        hide_elem(game_menu_calling);
        hide_elem(controls_elem);
        hide_elem(control_circle);
		hide_elem(_main_points_container);  
		hide_botons_ctrl_help_load_save();  
		document.getElementById("control_main_menu").style.visibility = "hidden"; 
	document.getElementById("control_load_previ_stat").style.visibility = "hidden";
    document.getElementById("control_save_current_stat").style.visibility = "hidden";
		document.getElementById("control_view_restore").style.visibility = "hidden";	
			document.getElementById("control_out_vehicle").style.visibility = "hidden";	
	   var _char_tps_name = "hunter_avatar"; 
	   hide_botons_ctrl_help_load_save(); 
	  m_char.get_wrapper().is_main_menu=_is_main_menu;  
		m_change_char.menu_change_avatar_cb(elapsed_sensor,level_name,_char_tps_name);  								  
    }
    function show_game_menu_cb() {
        if (game_menu.style.visibility != "visible") {
            m_main.pause();
            hide_elem(replay_button);
            show_elem(game_menu);
            show_elem(canvas_shadow);
			document.getElementById("main_canvas_container").style.zIndex = 0;
			document.getElementById("main_canvas_container").style.opacity = 0.5;
			document.getElementById("game_menu").style.visibility = "visible";
			document.getElementById("game_menu").style.opacity = 1;
			document.getElementById("game_menu").style.zIndex = 2;
        }
    }
    function show_game_exit_cb() {       			
			document.getElementById("game_exit_dialeg").style.visibility = "visible";
			document.getElementById("game_exit_dialeg").style.opacity = 1;
			document.getElementById("game_exit_dialeg").style.zIndex = 3; 
			hide_elem(game_menu);
        }
    if (m_main.detect_mobile()) {
        menu_resume.addEventListener("touchstart", resume_cb, false);
        menu_help.addEventListener("touchstart", help_cb, false);
        menu_exit.addEventListener("touchstart", menu_exit_cb, false);
        menu_credits.addEventListener("touchstart", credits_cb, false);
        authors_click_area.addEventListener("touchstart", authors_cb, false);
        menu_restart.addEventListener("touchstart", menu_restart_cb, false); 
		menu_character.addEventListener("touchstart", menu_character_cb, false); 
        replay_button.addEventListener("touchstart", replay_btn_cb, false);
        victory_elem.addEventListener("touchstart", replay_btn_cb, false);
		game_exit.addEventListener("touchstart", show_game_exit_cb, false);
		game_exit_sub_btn.addEventListener("touchstart", game_exit_sub_btn_cb, false);
		save_game.addEventListener("touchstart", control_save_current_stat_cb, false);
        credits_panel.addEventListener("touchstart", function(){
		credits_panel.style.visibility="hidden";
		credits_panel.style.zIndex=0;
		credits_panel.style.opacity=0;
			}, false);
        authors_list_exit.addEventListener("touchstart", function(){
			authors_panel.style.visibility="hidden";
		authors_panel.style.zIndex=0;
		authors_panel.style.opacity=0;
			}, false);
        help_panel.addEventListener("touchstart", function(){
		help_panel.style.visibility="hidden";
		help_panel.style.zIndex=0;
		help_panel.style.opacity=0;
			}, false);
        next_level.addEventListener("touchstart", next_level_cb, false);
        help_panel.setAttribute("mobile", "1");
        back_to_menu.addEventListener("touchstart", menu_exit_cb, false);
        game_menu_calling.addEventListener("touchstart", show_game_menu_cb, false);
		control_load_previ_stat.addEventListener("touchstart", control_load_previ_stat_cb, false);
		control_save_current_stat.addEventListener("touchstart", control_save_current_stat_cb, false);
		control_view_restore.addEventListener("touchstart", control_view_restore_cb, false);
		control_out_vehicle.addEventListener("touchstart", control_out_vehicle_cb, false);
			hide_botons_ctrl_help_load_save();
		document.getElementById("control_main_menu").style.visibility = "visible"; 
		document.getElementById("control_main_menu").style.zIndex = 2;		
	document.getElementById("control_load_previ_stat").style.visibility = "visible";
	document.getElementById("control_load_previ_stat").style.zIndex = 2;	
    document.getElementById("control_save_current_stat").style.visibility = "visible";
	document.getElementById("control_save_current_stat").style.zIndex = 2;	
	document.getElementById("control_view_restore").style.visibility = "visible";
	document.getElementById("control_view_restore").style.zIndex = 2;	
		document.getElementById("control_out_vehicle").style.visibility = "visible";
		document.getElementById("control_out_vehicle").style.zIndex = 2;	
    } else {
		show_botons_ctrl_help_load_save();
        menu_resume.addEventListener("click", resume_cb, false);
        menu_help.addEventListener("click", help_cb, false);
        menu_exit.addEventListener("click", menu_exit_cb, false);
        menu_credits.addEventListener("click", credits_cb, false);
        authors_click_area.addEventListener("click", authors_cb, false);
        menu_restart.addEventListener("click", menu_restart_cb, false);
        replay_button.addEventListener("click", replay_btn_cb, false);
		menu_character.addEventListener("click", menu_character_cb, false); 
        victory_elem.addEventListener("click", replay_btn_cb, false);
		game_exit.addEventListener("click", show_game_exit_cb, false);
		game_exit_sub_btn.addEventListener("click", game_exit_sub_btn_cb, false);
		save_game.addEventListener("click", control_save_current_stat_cb, false);
		credits_panel.addEventListener("click", function(){
		credits_panel.style.visibility="hidden";
		credits_panel.style.zIndex=0;
		credits_panel.style.opacity=0;
			}, false);
        authors_list_exit.addEventListener("click", function(){
		authors_panel.style.visibility="hidden";
		authors_panel.style.zIndex=0;
		authors_panel.style.opacity=0;
			}, false);
        help_panel.addEventListener("click", function(){
		help_panel.style.visibility="hidden";
		help_panel.style.zIndex=0;
		help_panel.style.opacity=0;
			}, false);
        next_level.addEventListener("click", next_level_cb, false);
        help_panel.setAttribute("mobile", "0");
        back_to_menu.addEventListener("click", menu_exit_cb, false);
        game_menu_calling.addEventListener("click", show_game_menu_cb, false);
		control_load_previ_stat.addEventListener("click", control_load_previ_stat_cb, false);
		control_save_current_stat.addEventListener("click", control_save_current_stat_cb, false);
		control_view_restore.addEventListener("click", control_view_restore_cb, false);
		control_out_vehicle.addEventListener("click", control_out_vehicle_cb, false);
	document.getElementById("control_main_menu").style.visibility = "visible"; 
		document.getElementById("control_main_menu").style.zIndex = 2;		
	document.getElementById("control_load_previ_stat").style.visibility = "visible";
	document.getElementById("control_load_previ_stat").style.zIndex = 2;
    document.getElementById("control_save_current_stat").style.visibility = "visible";
	document.getElementById("control_save_current_stat").style.zIndex = 2;
	document.getElementById("control_view_restore").style.visibility = "visible";
	document.getElementById("control_view_restore").style.zIndex = 2;
		document.getElementById("control_out_vehicle").style.visibility = "visible";	
		document.getElementById("control_out_vehicle").style.zIndex = 2;
    }
    if (level_name == "under construction") {
		console.log("si realment ele damos  al boton o cubo under_construction debe salir este log");
        var back_to_menu  = document.getElementById("back_to_menu");
        var under_construction = document.getElementById("under_construct");
        show_elem(back_to_menu);
        show_elem(under_construction);
    }
	else {
			show_elem(game_menu_calling);   
			document.getElementById("game_menu_calling").style.visibility = "visible";
			document.getElementById("game_menu_calling").style.opacity = 1;
			document.getElementById("game_menu_calling").style.zIndex = 2;
        var key_esc = m_ctl.KEY_ESC;
		if (!m_char.get_wrapper())    
		show_game_menu_cb();
        m_ctl.create_kb_sensor_manifold(null, "SHOW_GAME_MENU", m_ctl.CT_SHOT, key_esc, show_game_menu_cb);
		console.log("se ejecuto correctametne esperando mostrar game menu porque no lo muestra o eso pasaba cuando este comentario");
            }   
	_main_points_container = document.createElement("div");  
	_main_points_container.className = "main_points_container"; 
	_main_points_container.setAttribute("id", "main_points_container");
    document.body.appendChild(_main_points_container);
	var body_elem=document.body;
 var current_lang= document.getElementsByTagName("BODY")[0].getAttribute("lang"); 
	if (current_lang=="es")
	create_puntos_acumulados_elements(null,null,"puntos");  
	else
		create_puntos_acumulados_elements(null,null,"score");  
  _touch_main_menu = m_ctl.create_custom_sensor(0);           
	function touch_main_menu_cb (event) {
        event.preventDefault();
	 m_ctl.set_custom_sensor(_touch_main_menu, 1);  
	 console.log("si se ve esto es que se pulso sobre el icono main menu o hico click, ha de estar options.init  al load_level cargado para ver este atajo o truco");
		show_controls_container_cms(level_name);	 
	 }
	document.getElementById("control_main_menu").addEventListener("touchstart", touch_main_menu_cb, false);
	document.getElementById("control_main_menu").addEventListener("click", touch_main_menu_cb, false);
 var  sensor_key_M = m_ctl.create_keyboard_sensor(m_ctl.KEY_M);	
  m_ctl.create_sensor_manifold(null, "MAIN_MENU",
    m_ctl.CT_SHOT, [sensor_key_M, _touch_main_menu],                           
    function(s){return s[0] || s[1]},  
	function (obj, id, pulse) {
		if (pulse){
				console.log("es un truco o atacjo a funes que precisan carga de character modul antes en laod_level modul usar modulo options.js");
	          show_controls_container_cms(level_name);
				}
		}
	);  
function show_botons_ctrl_help_load_save() {
	document.getElementById("jump_help").style.visibility = "visible";
    document.getElementById("attack_help").style.visibility = "visible";
	document.getElementById("view_tps_help").style.visibility = "visible";
	document.getElementById("view_FPS_help").style.visibility = "visible";
	document.getElementById("fly_help").style.visibility = "visible";
}
exports.hide_botons_ctrl_help_load_save=hide_botons_ctrl_help_load_save;	
function hide_botons_ctrl_help_load_save() {
		document.getElementById("control_main_menu").style.visibility = "hidden"; 
	document.getElementById("control_load_previ_stat").style.visibility = "hidden";
    document.getElementById("control_save_current_stat").style.visibility = "hidden";
	document.getElementById("jump_help").style.visibility = "hidden";
    document.getElementById("attack_help").style.visibility = "hidden";
	document.getElementById("view_tps_help").style.visibility = "hidden";
	document.getElementById("view_FPS_help").style.visibility = "hidden";
	document.getElementById("fly_help").style.visibility = "hidden";
	document.getElementById("control_view_restore").style.visibility = "hidden";
 }	
function show_controls_container_cms(level_name) {   
			    m_ctl.set_custom_sensor(_touch_main_menu, 0); 				
			    console.log("deberia haber mostrado los botones tipo cam_mov_stile");			
				console.log("ahora que lo usamos habra que organizar su css para dispositivos moviles");
	level_name=m_char.get_wrapper().level;		
var	data_id=m_char.get_wrapper().data_main_id;			
if (level_name=="level01")
{	
	 setTimeout(function(){
var	alien_empty=m_scs.get_object_by_name("alien",data_id);
     m_aliens.init(elapsed_sensor,alien_empty,data_id);
     m_aliens.init_spawn(elapsed_sensor)	 
   }, 15000);
}	
if (level_name=="level02")
{
	 setTimeout(function(){
; 
var  trex_empty=m_scs.get_object_by_name("trex",data_id);
 m_trex.init(elapsed_sensor,trex_empty,data_id);
 m_trex.init_spawn(elapsed_sensor,data_id); 
        }, 15000); 
	}  
	}
exports.show_replay_button = function(period) {  
    var replay_button = document.getElementById("replay");
    show_elem(replay_button, period);
}
exports.hide_replay_button = function(period) {
    var replay_button = document.getElementById("replay");
    hide_elem(replay_button, period);
}
exports.show_victory_element=show_victory_element;
function show_victory_element(period) {
    var victory_elem = document.getElementById("victory");
	hide_elem(game_menu);
	level_name=m_char.get_wrapper().level;
		document.getElementById("game_menu").style.visibility="hidden";
		document.getElementById("game_menu").style.opacity=0;
		document.getElementById("game_menu").style.zIndex=0;
    show_elem(victory_elem, period);
}
exports.hide_victory_element = function(period) {
    var victory_elem = document.getElementById("victory");
    hide_elem(victory_elem, period);
}
exports.show_points_element = function(period) {  
    show_elem(_main_points_container, period);
	_main_points_container.style.visibility = "visible";
	_main_points_container.style.opacity = 1;
	console.log("deberiamos visualizar los ptos");
}
exports.hide_points_element = function(period) {
    hide_elem(_main_points_container, period);
}
exports.show_life_bar_element = function(period) {       
    var life_bar = document.getElementById("life_bar");
    show_elem(life_bar, period);
	life_bar.style.visibility = "visible";
	life_bar.style.opacity = 1;
	console.log("deberiamos visualizar los barra vida");
} 
exports.show_elem=show_elem;  
function show_elem(elem, period) {
   elem.style.visibility = "visible";  
    if (!period) {
        elem.style.opacity = 1;
        return
    }
    elem.style.opacity = 0;
    var finish_time = m_time.get_timeline() + period;
    function show_elem_cb(obj, id, pulse) {
        var time_left = finish_time - m_time.get_timeline();
        if (time_left < 0) {
            m_ctl.remove_sensor_manifold(null, "SHOW_"+ elem.id);
            return;
        }
        var opacity = 1 - time_left / period;
        elem.style.opacity = opacity;
    }
    if (!m_ctl.check_sensor_manifold(null, "SHOW_" + elem.id)) {
        var elapsed_sens = m_ctl.create_elapsed_sensor();
        m_ctl.create_sensor_manifold(null, "SHOW_" + elem.id,
            m_ctl.CT_CONTINUOUS, [elapsed_sens], null, show_elem_cb);
    }
}
exports.hide_elem=hide_elem;
function hide_elem(elem, period) {
 if (!period) {
        elem.style.opacity = 0;
        elem.style.visibility = "hidden";
        return
    }
    var start_opacity = elem.style.opacity;
    var finish_time = m_time.get_timeline() + period;
    function show_elem_cb(obj, id, pulse) {
        var time_left = finish_time - m_time.get_timeline();
        if (time_left < 0) {
            elem.style.visibility = "hidden";
            m_ctl.remove_sensor_manifold(null, "HIDE_"+ elem.id);
            return;
        }
        var opacity = time_left / period;
        elem.style.opacity = start_opacity * opacity;
    }
    if (!m_ctl.check_sensor_manifold(null, "HIDE_" + elem.id)) {
        var elapsed_sens = m_ctl.create_elapsed_sensor();
        m_ctl.create_sensor_manifold(null, "HIDE_" + elem.id,
            m_ctl.CT_CONTINUOUS, [elapsed_sens], null, show_elem_cb);
    }
}
exports.muestra_notificacion=function(elemento_texto,elemento_grafic,period) {   
 var	 near_obj_info_element = document.getElementById("near_obj_info_container");
	if	(elemento_texto) {
		near_obj_info_element.innerHTML = elemento_texto;   
		 near_obj_info_element.style.visibility = "visible";
        near_obj_info_element.style.zIndex = 2;                           
        near_obj_info_element.style.backgroundImage = "url(icons/" + elemento_grafic + ")";
	}
	else	
	near_obj_info_element.style.zIndex = 0 
}  
exports.oculta_notificacion=function(elemento_texto,elemento_grafic,period) {   
           var	 near_obj_info_element = document.getElementById("near_obj_info_container");
	near_obj_info_element.innerHTML = "";
    near_obj_info_element.style.visibility = "hidden";
    near_obj_info_element.style.zIndex = 0      
}
exports.update_hp_bar=update_hp_bar;
function update_hp_bar(hp) {  
    var green_elem = document.getElementById("life_bar_green");
    var red_elem = document.getElementById("life_bar_red");
    var mid_elem = document.getElementById("life_bar_mid");
    var hp_px_ratio = 192 / m_conf.MAX_CHAR_HP;
    var green_width = Math.max(hp * hp_px_ratio, 0);
    var red_width = Math.min((m_conf.MAX_CHAR_HP - hp) * hp_px_ratio, 192);   
    green_elem.style.width =  green_width + "px";
    red_elem.style.width =  red_width + "px";
    mid_elem.style.left = green_width + 19 + "px";
}
exports.update_premi_text=update_premi_text;   
function update_premi_text(premi) {  
	_value_label.innerHTML= premi;
}
function create_puntos_acumulados_elements(obj, key_name, puntos_acumulados_elements_name) 
{
   var puntos_acumulados_elements = init_puntos_acumulados_elements(puntos_acumulados_elements_name); 
}
function puntos_acumulados_elements_changed(e) {
 _value_label.textContent = puntos_acumulados_elements.value;
}
function init_puntos_acumulados_elements(puntos_acumulados_elements_name) {
    var container = document.createElement("div");
    container.className = "points_container";
    var name_label = document.createElement("label");
    name_label.className = "text_label";
    name_label.textContent = puntos_acumulados_elements_name;   
     _value_label = document.createElement("label");    
    _value_label.className = "value_label";
    _value_label.setAttribute("id", puntos_acumulados_elements_name);
    container.appendChild(name_label);
    container.appendChild(_value_label);
    _main_points_container.appendChild(container);
	_main_points_container.style.opacity = 1; 
	_value_label.textContent="0";
   return _value_label;  
}
function control_load_previ_stat_cb(e) {
	 e.stopPropagation();
        e.preventDefault();
		_previa_posicion=m_storage.get("posicion_char","atlantida save state nivel");
     _previa_orientacion=m_storage.get("orientacion_char","atlantida save state nivel");
	 _previ_premi=m_storage.get("puntos_char","atlantida save state nivel");
	  _previ_life=m_storage.get("life_char","atlantida save state nivel");
if  (!_previa_posicion=="")   
	  {  
var previa_posicion_toFloat = _previa_posicion.split(",").map(function(n) {
    return Number(n);
});
var _previa_orientacion_toFloat = _previa_orientacion.split(",").map(function(n) {
    return Number(n);
});
			var _previ_premi_toInt=parseInt(_previ_premi);
			var _previ_life_toInt=parseInt(_previ_life);
		  m_phy.set_transform(m_char.get_wrapper().phys_body,previa_posicion_toFloat,_previa_orientacion_toFloat);	
		  m_char.get_wrapper().premi=_previ_premi_toInt;
		  m_char.get_wrapper().hp=_previ_life_toInt;
		   update_premi_text(m_char.get_wrapper().premi);
		   update_hp_bar(m_char.get_wrapper().hp);
	  } 
  console.log("restauramos un estado previo guardado")
}
function control_save_current_stat_cb(e) {
	 e.stopPropagation();
        e.preventDefault();
					m_trans.get_translation(m_char.get_wrapper().phys_body, _POS_char);	
					m_trans.get_rotation(m_char.get_wrapper().phys_body,_quad);
					_premi=m_char.get_wrapper().premi;   
					_life=m_char.get_wrapper().hp;
					_current_char=m_char.get_wrapper().current_char;  
 var body_elem=document.body;
 var current_lang= document.getElementsByTagName("BODY")[0].getAttribute("lang"); 
	m_storage.set("posicion_char",_POS_char,"atlantida save state nivel");
	m_storage.set("orientacion_char",_quad,"atlantida save state nivel");
	m_storage.set("puntos_char",_premi,"atlantida save state nivel");  
	m_storage.set("life_char",_life,"atlantida save state nivel");  
	m_storage.set("current_char",_current_char,"atlantida save state nivel");
	m_storage.set("current_lang",current_lang,"atlantida save state nivel");
	_previa_posicion=m_storage.get("posicion_char","atlantida save state nivel");
     _previa_orientacion=m_storage.get("orientacion_char","atlantida save state nivel");
	 _previ_premi=m_storage.get("puntos_char","atlantida save state nivel");
	  _previ_life=m_storage.get("life_char","atlantida save state nivel");
		console.log("guardamos el estado actual posicion,orientacion,usuario actual,premio acumulado,vida");
}
function control_view_restore_cb() {
	var camera = m_scs.get_active_camera();
	var is_char_htoh=false;
	var data_id=m_char.get_wrapper().data_id;
	var index=m_char.get_wrapper().index;
	var length=m_char.get_wrapper().length;
	var elapsed=m_ctl.create_elapsed_sensor();
	m_view.eye_camera(camera,is_char_htoh,elapsed,null,null,data_id,index,length);  
	console.log("se ha ejeuctado la restauracion de la camera eye , en caso de desorientacion al tps o FPS intercambio, elpased sensor es:"+elapsed);	
}
function control_out_vehicle_cb() {  
  control_view_restore_cb();
}
	 }
})  