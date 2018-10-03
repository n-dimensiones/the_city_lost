if (b4w.module_check("main_menu"))
    throw "Failed to register module: main_menu";
b4w.register("main_menu", function(exports, require) {
var m_scs   = b4w.require("scenes");
var m_camera = b4w.require("camera");
var m_cont  = b4w.require("container");
var m_main = b4w.require("main");
var m_ctl   = b4w.require("controls");
var m_phy   = b4w.require("physics");
var m_sfx = b4w.require("sfx");   
var m_vec3  = b4w.require("vec3");
var m_data  = b4w.require("data");
var m_math = b4w.require("math");
var m_mat =  b4w.require("material");
var m_assets = b4w.require("assets");
var m_app   = b4w.require("app");
var m_cons  = b4w.require("constraints");
var m_anim  = b4w.require("animation");
var m_trans = b4w.require("transform");
var m_util  = b4w.require("util");
var m_quat  = b4w.require("quat");
var m_obj =  b4w.require("objects");
var m_nla    = b4w.require("nla");
var m_storage  = b4w.require("storage");
var m_mouse = require("mouse");
var m_load_level=b4w.require("load_level");  
var m_options_1_anims=b4w.require("options_1_anims");
var m_change_char =require("change_character");
var m_char= require("character2");
var m_resources= b4w.require("resources");  
var m_env = b4w.require("environment");		 
var m_conf     = b4w.require("game_config");  
var m_view 		= b4w.require("control_view"); 
var m_ctl_view_conf = b4w.require("ctl_view_config");
var m_play_pause_btn=null;				
var m_play_btn=null;	
var _data_id_fps=[];
var _control_data_id=[];
 _control_data_id[0]=0; 
var _previ_current_char="";
var _current_char="";
var _char_fps_name = "";  
var _char_tps_name = "";  
var _index=3;
var _length=4; 
var _is_main_menu=true;  
var _vec3_tmp = new Float32Array(3);	
var _vec2_tmp = new Float32Array(2);
var _hq_loaded = false;
var _button_clicked = false;
var _elapsed_sensor=null;  
var _ray_sens=null;  
var _hoverobject = null;   
var _buttons_info = {}; 
var _disable_plalist = false;
var _intro_spk = null;
var _playlist_spks = [];
var _end_spk = null;
var _hunter_portatil= null;
var _hunter_portatil_body=null;
var _portatil=null;
var _whormhole_rig= null;
var _whormhole_body= null;
var _tejas=null;
var _ground_de_pedres=null;
var _walls_brick=null;
var _walls_de_marble=null;
var _windows_wood=null;
var _descriptor_back=null;
var _base_links=null;
var _level_02_button=null;
var _play_back_btn=null;
var _play_btn=null;
var _play_pause_btn=null;
var _play_next_btn=null;
var _rot_anim_btn=null;
var _presentacion_n_d_boton=null;
var _portafolio=null;
var _portal_n_dimensiones=null;
var _primera=1;  
var _ray_id = null;
var _cam_from = new Float32Array(3);
var _cam_to = new Float32Array(3);
var _cam_pline = m_math.create_pline();
var _mouse_x = 0;
var _mouse_y = 0;
var _camera=null;
var _m_camera_shading=null;
var _default_cam_rot = new Float32Array(2);
var _cam_dist = null;
var _cam_pivot = new Float32Array(3);
var _cam_rot_fac = 0;
var _default_pos = new Float32Array(3);
var _default_rot = new Float32Array(4);
var _current_pos = new Float32Array(3);
var _current_rot = new Float32Array(4);
var _lang = "es";
 var _mainmenu_wrapper = null;
var  _back_to_main_menu_click=0;
var  _pause_btn_click=0;
var main_canvas_container=null;  
var _framequiet=-1; 
var _fstart=0;
var _f_rot_mainmenu_start=1;
var _f_rot_mainmenu_end=262;
var _start_presenta=363;   
var ANIM_TIME = 8;
var _is_presentacion=0;	
var _is_rot_mainmenu=0;
var _previ_anim="ninguna";
var _camera_target=1;
exports.hide_play_btns=hide_play_btns;
function hide_play_btns() {
m_scs.hide_object(m_play_pause_btn);				
m_scs.hide_object(m_play_btn);	
}
exports.show_play_btns=show_play_btns;
function show_play_btns() {
m_scs.show_object(m_play_pause_btn);				
m_scs.show_object(m_play_btn);	
}
exports.intro_load_cb=intro_load_cb;
function  intro_load_cb(data_id) {   
    _hq_loaded = false;
    _button_clicked = false;   
main_canvas_container =m_cont.get_canvas();
    main_canvas_container.oncontextmenu = function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    };
    _mouse_x = main_canvas_container.width / 2;  
    _mouse_y = main_canvas_container.height / 2;
	m_storage.init("atlantida save state nivel");
	m_options_1_anims.init(load_level_cb,m_change_char.menu_change_avatar_cb, _is_main_menu);		
	m_assets.enqueue([{id: "config", type: m_assets.AT_JSON, url: "js/intro_config.json"}],      
            process_config, null); 	  
m_resources.init(_elapsed_sensor,main_canvas_container);
var camera_pivot= new Float32Array(3);			
var camera_empty = m_scs.get_object_by_name("spawner",data_id);   
m_trans.get_translation(camera_empty, camera_pivot); 
	_camera = m_scs.get_active_camera();
    m_trans.get_translation(_camera, _default_pos);  
    m_trans.get_rotation(_camera, _default_rot);
		console.log("este es el valor actual de la pos de la camera:"+_default_pos);
		console.log("pero vamos a poner 32,-5, 9");								
			m_resources.get_wrapper().view_no_static=0; 
			m_mouse.exit_pointerlock();
m_camera.target_setup(_camera, { pos: [32,-5, 9], pivot: camera_pivot,   
		 vert_rot_lim: m_conf.TARGET_VERT_LIMITS, 	 
            dist_lim: {	min: 1,	max: 32  } });    
       console.log("la posicion del pivot o spawenr objeto destino que hemos elegido es:"+camera_pivot);
	m_cons.remove(_camera);									
	m_app.enable_camera_controls(false, false, false);  
	 m_ctl.create_sensor_manifold(null, "TIMELINE_ROT_0_MAINMENU",           
                 m_ctl.CT_CONTINUOUS,
                [m_ctl.create_elapsed_sensor()], null,            
        function() {  
		 m_play_pause_btn=m_scs.get_object_by_name("play_pause_btn");
		 m_play_btn=m_scs.get_object_by_name("play_btn");
		if (m_nla.is_play())
		{
		m_scs.show_object(m_play_pause_btn);
	    m_scs.hide_object(m_play_btn);
		}
	   else   
	   if (_previ_anim=="ninguna"){	   
		m_scs.show_object(m_play_btn);
	    m_scs.hide_object(m_play_pause_btn);  
		m_nla.reset_range(363,763);
		_framequiet=363;
		m_nla.set_frame(_framequiet);
		_camera_target=1;						
		_previ_anim="presentacion"; 
	   }		
		});  
    setTimeout(function() {
            var canvas_cont = m_cont.get_container();  
            canvas_cont.style.opacity = 1;          
        }, 1000);
	if (!m_main.detect_mobile()) {   								
        var ray_test_cb = function(sens_obj, id, pulse) {
            var sens_val = m_ctl.get_sensor_value(sens_obj, id, 0);
            var payload = m_ctl.get_sensor_payload(sens_obj, id, 0);
            var obj = payload.obj_hit;
            _ray_id = payload.ray_test_id;
           if (!sens_val) { 
                return;
            }
            if ((obj !== _hoverobject) && ((obj.name=="main_menu*level_01_button") ||  (obj.name=="main_menu*level_02_button") || (obj.name=="main_menu*underconstruction_button") ||  (obj.name=="main_menu*intro"))) {
                _hoverobject = obj;
                var binfo = _buttons_info[obj.name];
                if (binfo && binfo.speaker)
                    m_sfx.play_def(binfo.speaker);
            }
        }
         _ray_sens = m_ctl.create_ray_sensor(_camera, _cam_from, _cam_to, "BUTTON",
                                         true, false, true); 
        m_ctl.create_sensor_manifold(null, "BUTTON_HOVER", m_ctl.CT_CONTINUOUS,
                                    [_ray_sens], function(s){return true}, ray_test_cb);														
        main_canvas_container.addEventListener("mousedown", main_canvas_click, false); 
        main_canvas_container.addEventListener("mousemove", main_canvas_mouse_move, false);
        setTimeout(function() {
            if (!_hq_loaded && !_button_clicked)
			{
			}	
        }, 10000)
    } else
	{
	main_canvas_container.addEventListener("touchstart", main_canvas_touch, false);
	}
_hunter_portatil = m_scs.get_object_by_dupli_name("hunter_portatil","hunter_rig",data_id);
_hunter_portatil_body = m_scs.get_object_by_dupli_name("hunter_portatil","hunter_body",data_id);
_whormhole_rig = m_scs.get_object_by_dupli_name("wormhole","Armature",data_id);
_whormhole_body = m_scs.get_object_by_dupli_name("wormhole", "wormhole",data_id);
_portatil=m_scs.get_object_by_dupli_name("portatilbase","portatil_arm",data_id);
m_scs.show_object(_hunter_portatil_body);
m_scs.hide_object(_whormhole_body);
_ground_de_pedres=m_scs.get_object_by_dupli_name("historic_grec","ground_de_pedres",data_id);
_tejas=m_scs.get_object_by_dupli_name("historic_grec","tejas",data_id);
_walls_brick=m_scs.get_object_by_dupli_name("historic_grec","walls_brick",data_id);
_walls_de_marble=m_scs.get_object_by_dupli_name("historic_grec","walls_de_marble",data_id);
_windows_wood=m_scs.get_object_by_dupli_name("historic_grec","windows_wood",data_id);
_base_links=m_scs.get_object_by_name("base_links",data_id);
_level_02_button=m_scs.get_object_by_dupli_name("main_menu","level_02_button",data_id);
_play_back_btn=m_scs.get_object_by_name("play_back_btn",data_id);
_play_btn=m_scs.get_object_by_name("play_btn",data_id);
_play_pause_btn=m_scs.get_object_by_name("play_pause_btn",data_id);
_play_next_btn=m_scs.get_object_by_name("play_next_btn",data_id);
_rot_anim_btn=m_scs.get_object_by_name("rot_anim_btn",data_id);
_presentacion_n_d_boton=m_scs.get_object_by_name("presentacion_n-d_boton",data_id);
_portafolio=m_scs.get_object_by_name("portafolio",data_id);
_portal_n_dimensiones=m_scs.get_object_by_name("portal_n-dimensiones",data_id);
m_scs.show_object(_level_02_button);
m_scs.hide_object(_ground_de_pedres);
m_scs.hide_object(_tejas);
m_scs.hide_object(_walls_brick);
m_scs.hide_object(_walls_de_marble);
m_scs.hide_object(_windows_wood);
m_scs.hide_object(_base_links);	  
_descriptor_back=m_scs.get_object_by_name("descriptor_back");
m_scs.hide_object(_descriptor_back);
_m_camera_shading=m_scs.get_object_by_name("camera_shading");
m_scs.hide_object(_m_camera_shading);
  setTimeout(function() {
	  m_anim.apply(_hunter_portatil, "hunter_portatil_abre");
	  m_anim.set_behavior(_hunter_portatil, m_anim.AB_FINISH_STOP);
      m_anim.play(_hunter_portatil);
	  m_anim.apply(_hunter_portatil, "hunter_portatil_trabaja");
	  m_anim.set_behavior(_hunter_portatil, m_anim.AB_CYCLIC);
      m_anim.play(_hunter_portatil);
	  m_anim.apply(_portatil, "portatil_open");
	  m_anim.set_behavior(_portatil, m_anim.AB_FINISH_STOP);
      m_anim.play(_portatil);
        }, 10000);  
} 
function setup_language(config) {  
    var lang_val = 1;
    if (_lang == "es")
        lang_val = 0
}
function process_config(data, uri, type, path) {   
	setup_buttons(data);  
    setup_language(data);
    var camobj = m_scs.get_active_camera();
    _cam_rot_fac = data["camera_rotation_fac"];   
    m_vec3.copy(data["camera_pivot"], _cam_pivot);
    m_trans.get_translation(camobj, _vec3_tmp);
    _cam_dist = m_vec3.distance(_cam_pivot, _vec3_tmp);
}
function setup_buttons(config) {   
    var bdata = config["buttons_info"];   
     _elapsed_sensor = m_ctl.create_elapsed_sensor();
    for (var i = 0; i < bdata.length; i++) {
        var binfo = bdata[i];
        var obj = m_scs.get_object_by_dupli_name_list(binfo["button_name"].split("*"));  
        if (obj)
            _buttons_info[obj.name] = init_button_info(binfo);  
    }
    m_ctl.create_sensor_manifold(null, "ROT_CAMERA", m_ctl.CT_CONTINUOUS,     
                                [_elapsed_sensor], null,
								function () {
								});
}
function rotate_cam_cb(obj, id, pulse) {
    if (m_nla.is_play())
	{
        return;
	}	
    if (_cam_dist === null)
	{
      return;
    }
    var camobj = m_scs.get_active_camera();
	m_app.enable_camera_controls(false, false, true); 
    var default_x = main_canvas_container.width / 2;
    var default_y = main_canvas_container.height / 2;
    m_camera.get_camera_angles(camobj, _vec2_tmp);
    var c_width = main_canvas_container.width;
    var dx = (default_x - _mouse_x) / main_canvas_container.width * _cam_rot_fac;
    var dy = (default_y - _mouse_y) / main_canvas_container.height * _cam_rot_fac;
    var x = _default_cam_rot[0] - dx;
    var y = -_default_cam_rot[1] - dy;
    _vec3_tmp[0] = _cam_pivot[0] + _cam_dist * Math.sin(x);
    _vec3_tmp[1] = _cam_pivot[1] - _cam_dist * Math.cos(x);
    _vec3_tmp[2] = _cam_pivot[2] + _cam_dist * Math.sin(y);
    m_camera.static_set_look_at(camobj, _vec3_tmp, _cam_pivot);   
    m_camera.correct_up(camobj);  
}
function play_actions() {
	  m_anim.apply(_hunter_portatil, "hunter_portatil",m_anim.SLOT_2);
	  m_anim.set_behavior(_hunter_portatil, m_anim.AB_CYCLIC,m_anim.SLOT_2);
      m_anim.play(_hunter_portatil,null, m_anim.SLOT_2);
	  m_anim.apply(_portatil, "portatilAction", m_anim.SLOT_2);
	  m_anim.set_behavior(_portatil, m_anim.AB_CYCLIC,m_anim.SLOT_2);
      m_anim.play(_portatil, null, m_anim.SLOT_2);
}
function init_button_info(binfo) {
    var speaker = m_scs.get_object_by_dupli_name_list(binfo["mouse_over_speaker"].split("*"));  
    m_sfx.stop(speaker);
    return {
        speaker:         speaker,
        level_name:      binfo["level_name"],
		is_char_htoh:      binfo["is_char_htoh"]
    };
}
function main_canvas_mouse_move(e) {
if (m_nla.is_play()){
	return;
					}
    if (e.preventDefault)
        e.preventDefault();
    var x = e.clientX;
    var y = e.clientY;
    _mouse_x = x;
    _mouse_y = y;
	   var camobj = m_scs.get_active_camera();
    if (m_camera.is_static_camera(camobj)) {
       m_camera.calc_ray(camobj, _mouse_x, _mouse_y, _cam_pline);
        m_math.get_pline_directional_vec(_cam_pline, _cam_to);  
        m_vec3.scale(_cam_to, 100, _cam_to);  
			 m_phy.change_ray_test_from_to(_ray_id, _cam_from, _cam_to);
	}
}
function main_canvas_touch(e) {   
    if (e.preventDefault)
        e.preventDefault();
    var touches = e.changedTouches;
    var touch = touches[0];
    var x = touch.clientX;
    var y = touch.clientY;
    process_screen_click(x, y);
}
function main_canvas_click(e) {    
    if (e.preventDefault)
        e.preventDefault();
    var x = e.clientX;
    var y = e.clientY;
    process_screen_click(x, y);
}
function process_screen_click(x, y) {  
    var obj = m_scs.pick_object(x, y);	
	 var select_play_back_btn_sen = m_ctl.create_selection_sensor(_play_back_btn);
    var select_play_pause_btn_sen = m_ctl.create_selection_sensor(_play_pause_btn);
	var select_play_btn_sen = m_ctl.create_selection_sensor(_play_btn);
	var select_play_next_btn_sen = m_ctl.create_selection_sensor(_play_next_btn);
	var select_rot_anim_btn_sen = m_ctl.create_selection_sensor(_rot_anim_btn);
    var select_presentacion_n_d_boton_sen = m_ctl.create_selection_sensor(_presentacion_n_d_boton);
	var select_portafolio_sen = m_ctl.create_selection_sensor(_portafolio);   
   var select_portal_n_dimensiones_sen = m_ctl.create_selection_sensor(_portal_n_dimensiones);
   if (obj) { 
        if (_buttons_info[obj.name]) {
            var level_name_tmp = _buttons_info[obj.name].level_name;
			var is_char_htoh_tmp = _buttons_info[obj.name].is_char_htoh;
            if (level_name_tmp) {
                setTimeout(function() {
					m_options_1_anims.hide_btns_control_intro();
						_previ_current_char=m_storage.get("current_char","atlantida save state nivel");
				if (_previ_current_char=="")
					{
						_char_tps_name="hunter_avatar";
					}	
				else if (!_previ_current_char=="")
						_char_tps_name=_previ_current_char;
				_char_fps_name= "hunter3_fps_avatar";  
			load_level_cb(level_name_tmp,is_char_htoh_tmp,_control_data_id,_data_id_fps, _char_fps_name, _char_tps_name,_is_main_menu,_index,_length)},              
                           1000 * m_conf.LEVEL_LOAD_DELAY);  
            } else if (!m_main.detect_mobile()) {
                play_ending_speaker();
            }
        }   
         m_ctl.create_sensor_manifold(null, "TIMELINE_ROT_MAINMENU",
                 m_ctl.CT_SHOT,       
                [m_ctl.create_elapsed_sensor(),select_rot_anim_btn_sen], null,            
         rot_anim_mainmenu_cb
            );  
			m_ctl.create_sensor_manifold(null, "TIMELINE_CHECK_ROT",           
                 m_ctl.CT_CONTINUOUS,
                [m_ctl.create_elapsed_sensor(),select_rot_anim_btn_sen], null,            
		function() {
			if (m_nla.is_play()){
				{
				}
							}
			else
				{			
			 m_scs.hide_object(_play_pause_btn);
			 m_scs.show_object(_play_btn);	
			  _previ_anim="rot_anim"; 
			   _framequiet=0;
			m_ctl.remove_sensor_manifold(null,"TIMELINE_CHECK_ROT");	
			    m_nla.reset_range(_f_rot_mainmenu_start,_f_rot_mainmenu_end);			   
			    m_nla.set_frame(_f_rot_mainmenu_start);  
			   }	
			});	   
	m_ctl.create_sensor_manifold(null, "TIMELINE_CHECK_PRESENTACION",     
                 m_ctl.CT_CONTINUOUS,
                [m_ctl.create_elapsed_sensor(), select_presentacion_n_d_boton_sen], null,            
		function() {
			if (m_nla.is_play()){
							}
			else				    
				{
				 _framequiet=0;  
				m_scs.show_object(_play_btn);
				 m_scs.hide_object(_play_pause_btn);
				} 
		});  
               m_ctl.create_sensor_manifold(null, "TIMELINE_PRESENTACION",
                 m_ctl.CT_SHOT,
                [m_ctl.create_elapsed_sensor(),select_presentacion_n_d_boton_sen], null,            
         presentacion_cb  
            );  
   function select_anim_back_cb(obj, id, pulse) {
        if (pulse > 0)
            m_anim.play(obj);
        else {
            m_anim.stop(obj);
            m_anim.set_first_frame(obj);
        }
    }
        m_anim.apply_def(_play_back_btn); 
        m_ctl.create_sensor_manifold(_play_back_btn, "SELECT_BACK", m_ctl.CT_TRIGGER,
                [select_play_back_btn_sen], null, select_anim_back_cb);
               m_ctl.create_sensor_manifold(null, "TIMELINE_BACK_TO_MENU",
                 m_ctl.CT_SHOT,
                [m_ctl.create_elapsed_sensor(),select_play_back_btn_sen], null,
        function(){				   
				if (m_nla.is_play())				
				{
				m_scs.show_object(_descriptor_back);	
				m_nla.stop();
				fader_wormhole();					
				_back_to_main_menu_click=1;
				_framequiet=m_nla.get_frame();  
				} 
			  else                
				{
				 _framequiet=0;
				} 
				if ((_previ_anim=="ninguna")&&(_framequiet<_f_rot_mainmenu_end))
				{
					_camera_target=1;	
					 m_nla.reset_range(_f_rot_mainmenu_start,_f_rot_mainmenu_end);   
					 m_nla.set_frame(_f_rot_mainmenu_start);
				}	 
				if ((_previ_anim=="ninguna")&&(_framequiet>=_f_rot_mainmenu_end))
				{   
					_camera_target=1;	
					 m_nla.reset_range(_start_presenta,763);   
					 m_nla.set_frame(_start_presenta);
				}
				 if (_previ_anim=="rot_anim")
				 {
					 _camera_target=1;	
					 m_nla.reset_range(_f_rot_mainmenu_start,_f_rot_mainmenu_end);   
					 m_nla.set_frame(_f_rot_mainmenu_start);
				 }	 
				 if	(_previ_anim=="presentacion")
				  {
				  var fend=m_nla.get_frame_end();  
					 _camera_target=1;	
					m_nla.reset_range(_start_presenta,fend);   
					 m_nla.set_frame(_start_presenta);
				  }		 
				m_scs.show_object(_play_btn);   
				m_scs.hide_object(_play_pause_btn);
				 m_ctl.remove_sensor_manifold(null,"TIMELINE_A_PORTAL_N-DIMENSIONES");
				 m_ctl.remove_sensor_manifold(null,"TIMELINE_PRESENTACION");
				  m_ctl.remove_sensor_manifold(null,"TIMELINE_ROT_0_MAINMENU");
            });  
               m_ctl.create_sensor_manifold(null, "TIMELINE_STOP",
                 m_ctl.CT_SHOT,
                [m_ctl.create_elapsed_sensor(),select_play_pause_btn_sen], null,
             function(){		
			 _pause_btn_click=1;
				if (m_nla.is_play())			
				{
				m_nla.stop();
				_pause_btn_click=0;	
				_framequiet=m_nla.get_frame();  
				} else  
				if (((_previ_anim=="ninguna")||(_previ_anim=="rot_anim"))&&(_framequiet<_f_rot_mainmenu_end))
				{
					 m_nla.reset_range(_framequiet,_f_rot_mainmenu_end);   
					 m_nla.set_frame(_framequiet);
				}	 
				if (((_previ_anim=="ninguna")||(_previ_anim=="presentacion"))&&(_framequiet>=_f_rot_mainmenu_end))
				{  
					 m_nla.reset_range(_framequiet,763);   
					 m_nla.set_frame(_framequiet);
				}					
				m_scs.show_object(_play_btn);				
				 m_scs.hide_object(_play_pause_btn);
				 m_ctl.remove_sensor_manifold(null,"TIMELINE_A_PORTAL_N-DIMENSIONES");
				 m_ctl.remove_sensor_manifold(null,"TIMELINE_PRESENTACION");
				 m_ctl.remove_sensor_manifold(null,"TIMELINE_ROT_0_MAINMENU");
            });  
			m_ctl.create_sensor_manifold(null, "TIMELINE_CHECK_PLAY",           
                 m_ctl.CT_CONTINUOUS,
                [m_ctl.create_elapsed_sensor(),select_play_btn_sen], null,            
		function() {
			if (m_nla.is_play()){
			 m_ctl.remove_sensor_manifold(null,"BUTTON_HOVER");		
							}
			else
			{				 
				 _framequiet=0;
			 m_scs.hide_object(_play_pause_btn);
			 m_scs.show_object(_play_btn);	
			m_ctl.remove_sensor_manifold(null,"TIMELINE_CHECK_PLAY");	
			}	
			});
               m_ctl.create_sensor_manifold(null, "TIMELINE_PLAY",
                 m_ctl.CT_SHOT,
                [m_ctl.create_elapsed_sensor(),select_play_btn_sen], null,
				function(){	
				 if (m_nla.is_play()){
									return;  
									}
				if (_previ_anim=="ninguna")	
					{   
					_camera_target=0;	
					}	
				if ((_pause_btn_click)&&(_previ_anim=="rot_anim")) 
				{
m_scs.hide_object(_ground_de_pedres);
m_scs.hide_object(_tejas);
m_scs.hide_object(_walls_brick);
m_scs.hide_object(_walls_de_marble);
m_scs.hide_object(_windows_wood);
m_scs.show_object(_base_links);					
				}
				 if ((_pause_btn_click)&&(_previ_anim=="presentacion")) 
				  {
					m_scs.show_object(_ground_de_pedres);
					m_scs.show_object(_tejas);
					m_scs.show_object(_walls_brick);
					m_scs.show_object(_walls_de_marble);
					m_scs.show_object(_windows_wood);
					m_scs.hide_object(_base_links);	
				  }		 		 				
			  	if 	(((_back_to_main_menu_click)&&(_previ_anim=="rot_anim")) &&(m_camera.is_target_camera(_camera)))
			   {
m_scs.hide_object(_ground_de_pedres);
m_scs.hide_object(_tejas);
m_scs.hide_object(_walls_brick);
m_scs.hide_object(_walls_de_marble);
m_scs.hide_object(_windows_wood);
m_scs.show_object(_base_links);												
			   } else 
			    {
			    _camera_target=1;	
			    }
				if	(((_back_to_main_menu_click)&&(_previ_anim=="presentacion"))&&(m_camera.is_static_camera(_camera)))
				{				
m_scs.show_object(_ground_de_pedres);
m_scs.show_object(_tejas);
m_scs.show_object(_walls_brick);
m_scs.show_object(_walls_de_marble);
m_scs.show_object(_windows_wood);
m_scs.hide_object(_base_links);						
				}	else		  		   
					{
					_camera_target=0;	
					}
				 m_scs.hide_object(_play_btn);				
				 m_scs.show_object(_play_pause_btn);
			   _pause_btn_click=0;
			   _back_to_main_menu_click=0;
				  m_nla.play();		
				   m_ctl.remove_sensor_manifold(null,"TIMELINE_A_PORTAL_N-DIMENSIONES");
				    m_ctl.remove_sensor_manifold(null,"TIMELINE_PRESENTACION");
					m_ctl.remove_sensor_manifold(null,"TIMELINE_ROT_0_MAINMENU");
            });  
               m_ctl.create_sensor_manifold(null, "TIMELINE_A_PORTAFOLIO",
                 m_ctl.CT_SHOT,
                [m_ctl.create_elapsed_sensor(),select_portafolio_sen], null,
function() {												
			   m_scs.show_object(_m_camera_shading);
			   m_mat.set_nodemat_value(_m_camera_shading,["camera_shading_mat","Value"], 1);
				setTimeout(function() {			        			
					 m_mat.set_nodemat_value(_m_camera_shading,["camera_shading_mat","Value"], 0);
					m_ctl.remove_sensor_manifold(null,"TIMELINE_PLAY");
				 m_ctl.remove_sensor_manifold(null,"TIMELINE_STOP");
				 m_ctl.remove_sensor_manifold(null,"TIMELINE_PRESENTACION");	
				 m_ctl.remove_sensor_manifold(null,"TIMELINE_ROT_0_MAINMENU");
				window.open("https://www.n-dimensiones.es/portafolio","_self"); 
						}, 16000);			 			
				}
				);  
               m_ctl.create_sensor_manifold(null, "TIMELINE_A_PORTAL_N-DIMENSIONES",
                 m_ctl.CT_SHOT,
                [m_ctl.create_elapsed_sensor(),select_portal_n_dimensiones_sen], null,
				function() {     
			     m_scs.show_object(_m_camera_shading);
				 m_mat.set_nodemat_value(_m_camera_shading,["camera_shading_mat","Value"], 1);
     			setTimeout(function() {		
				 m_mat.set_nodemat_value(_m_camera_shading,["camera_shading_mat","Value"], 0);				
				 m_ctl.remove_sensor_manifold(null,"TIMELINE_PLAY");
				 m_ctl.remove_sensor_manifold(null,"TIMELINE_STOP");
				 m_ctl.remove_sensor_manifold(null,"TIMELINE_PRESENTACION");	
				 m_ctl.remove_sensor_manifold(null,"TIMELINE_ROT_0_MAINMENU");
				window.open("https://www.n-dimensiones.es/main/blog","_self"); 
				}, 16000);		
				}
				);  
   }
}  
function cleanup_events() {  
    _button_clicked = true;
    if (m_main.detect_mobile())
        main_canvas_container.removeEventListener("touchstart", main_canvas_touch, false);
    else {
        main_canvas_container.removeEventListener("mousedown", main_canvas_click);
        main_canvas_container.removeEventListener("mousemove", main_canvas_mouse_move);
    }
}
exports.rot_anim_mainmenu_cb=rot_anim_mainmenu_cb;
function  rot_anim_mainmenu_cb() {  
				if (m_nla.is_play())	{
					 return;
				 }			
		 _is_rot_mainmenu=1; 
			target_camera_action(); 
			_camera_target=1;	
				_fstart=_f_rot_mainmenu_start;  
				m_nla.set_range(_f_rot_mainmenu_start,_f_rot_mainmenu_end); 
				m_nla.set_frame(_fstart);
				m_nla.play();	
				_is_rot_mainmenu=0;  
				_previ_anim="rot_anim";
				m_scs.show_object(_play_pause_btn);
				 m_scs.hide_object(_play_btn);
m_scs.hide_object(_ground_de_pedres);
m_scs.hide_object(_tejas);
m_scs.hide_object(_walls_brick);
m_scs.hide_object(_walls_de_marble);
m_scs.hide_object(_windows_wood);
m_scs.show_object(_base_links);	
			_framequiet=m_nla.get_frame(); 
			if (((_framequiet < _f_rot_mainmenu_end)&&(_back_to_main_menu_click))&&(m_nla.is_play()))
			   {
				_back_to_main_menu_click=0;
				 m_nla.stop();
				 _framequiet=m_nla.get_frame();
			   } 
}  
exports.presentacion_cb=presentacion_cb;
function   presentacion_cb(in_params, out_params)	{	
			 if (m_nla.is_play())	{
					 return;
				 }	   
		   _is_presentacion=1; 
		   if  (_is_presentacion)
		   {
			_camera_target=0;	
		   }
					reset_camera_action();
				var fend=m_nla.get_frame_end();
				_fstart=_start_presenta;  
				m_nla.set_range(_start_presenta,fend); 
				m_nla.set_frame(_fstart);
				m_nla.play();	
				_is_presentacion=0;  
				_previ_anim="presentacion";
				m_scs.show_object(_play_pause_btn);				
				 m_scs.hide_object(_play_btn);
m_scs.show_object(_ground_de_pedres);
m_scs.show_object(_tejas);
m_scs.show_object(_walls_brick);
m_scs.show_object(_walls_de_marble);
m_scs.show_object(_windows_wood);
m_scs.hide_object(_base_links);	
			_framequiet=m_nla.get_frame(); 
			if (((_framequiet < m_nla.get_frame_end())&&(_back_to_main_menu_click))&&(m_nla.is_play()))
			   {
				_back_to_main_menu_click=0;
				 m_scs.show_object(_play_pause_btn);				
				 m_scs.hide_object(_play_btn);
				 m_nla.stop();
				setTimeout(function() {		
					_framequiet=m_nla.get_frame(); 
					if ((_framequiet) >= m_nla.get_frame_end())
					{ 
					}
						}, 18000);			 	
			   } 
	  }				
exports.load_level_cb=load_level_cb;                       
function load_level_cb(level_name,is_char_htoh,control_data_id,data_id_fps, char_fps_name, char_tps_name, is_main_menu,index,length) {  
		var elapsed_sensor = m_ctl.create_elapsed_sensor();  
    if (level_name == "under construction")   
        window.open("index.html","_self");      
    else {
        m_data.unload(m_data.DATA_ID_ALL);  
		m_ctl.remove_sensor_manifold(null,"BUTTON_HOVER");
		 m_ctl.remove_sensor_manifold(null,"TIMELINE_PLAY");
				 m_ctl.remove_sensor_manifold(null,"TIMELINE_STOP");
				 m_ctl.remove_sensor_manifold(null,"TIMELINE_PRESENTACION");	
				 m_ctl.remove_sensor_manifold(null,"TIMELINE_ROT_0_MAINMENU");
				  m_ctl.remove_sensor_manifold(null,"SELECT_BACK");
		main_canvas_container.removeEventListener("mousemove", main_canvas_mouse_move);   
        var json_path = m_conf.ASSETS_PATH + level_name + ".json";
		var json_path1 = m_conf.ASSETS_PATH + char_fps_name + ".json";
		var json_path2 = m_conf.ASSETS_PATH + char_tps_name + ".json";
        var preloader_cont = document.getElementById("preloader_a_cont");  
        preloader_cont.style.visibility = "visible";	
if (!control_data_id[0]) 
		m_data.load(json_path, function(data_id) {                
					m_load_level.load_cb(data_id, level_name, preloader_cb, 
                                                null, load_level_cb,is_char_htoh,index,length);
					},
                    preloader_cb, true, false);  
if (!data_id_fps[0])		
		m_data.load(json_path1, function(data_id) { 
					m_load_level.load1_cb(data_id, level_name, preloader2_cb, 
                                                null, load_level_cb,is_char_htoh,index,length);
					},
                    preloader2_cb, true, false);   
if (!control_data_id[1])   
		m_data.load(json_path2, function(data_id) { 
					m_load_level.load2_cb(data_id, level_name, preloader3_cb, 
                                                null, load_level_cb,is_char_htoh,index,length,char_tps_name,is_main_menu);
					},
                    preloader3_cb, true, false);  
    }
}  
exports.preloader_cb=preloader_cb;
function preloader_cb(percentage) {
    var prelod_dynamic_path = document.getElementById("prelod_a_dynamic_path");
    var percantage_num      = prelod_dynamic_path.nextElementSibling;
    prelod_dynamic_path.style.width = percentage + "%";
    percantage_num.innerHTML = percentage + "%";
    if (percentage == 100) {
        remove_preloader();
        return;
    }
}
function remove_preloader() {
    var preloader_cont = document.getElementById("preloader_a_cont");
    setTimeout(function(){
            preloader_cont.style.visibility = "hidden"
        }, 1000);   
}
exports.preloader2_cb=preloader2_cb;
function preloader2_cb(percentage) {
	var preloader2_cont = document.getElementById("preloader_city_cont");
	    preloader2_cont.style.visibility = "visible";
    var prelod2_dynamic_path = document.getElementById("prelod_cy_dynamic_path");
    var percantage2_num      = prelod2_dynamic_path.nextElementSibling;
    prelod2_dynamic_path.style.width = percentage + "%";
    percantage2_num.innerHTML = percentage + "%";
    if (percentage == 100) {
        remove2_preloader();
        return;
    }
}
function remove2_preloader() {
    var preloader2_cont = document.getElementById("preloader_city_cont");
    setTimeout(function(){
            preloader2_cont.style.visibility = "hidden"
        }, 10000);   
}
exports.preloader3_cb=preloader3_cb;
function preloader3_cb(percentage) {
	var preloader3_cont = document.getElementById("preloader_avatar_cont");
		preloader3_cont.style.visibility = "visible";
    var prelod3_dynamic_path = document.getElementById("prelod_av_dynamic_path");
    var percantage3_num      = prelod3_dynamic_path.nextElementSibling;
    prelod3_dynamic_path.style.width = percentage + "%";
    percantage3_num.innerHTML = percentage + "%";
    if (percentage == 100) {
        remove3_preloader();
        return;
    }
}
function remove3_preloader() {
    var preloader3_cont = document.getElementById("preloader_avatar_cont");
    setTimeout(function(){
            preloader3_cont.style.visibility = "hidden"
        }, 10000);   
}
function eye_camera_action() {
    var camera = m_scenes.get_active_camera();
    m_cam.eye_setup(camera, { pos: m_ctl_view_conf.EYE_POS, look_at: m_ctl_view_conf.EYE_LOOK_AT, 
            horiz_rot_lim: m_ctl_view_conf.EYE_HORIZ_LIMITS, vert_rot_lim: m_ctl_view_conf.EYE_VERT_LIMITS });
    m_cam.rotate_camera(camera, 0, -Math.PI/16, true, true);   
}
function target_camera_action() {	    
var vec3=new Float32Array(3);	
var vec3_2=new Float32Array(3);	
    var camera = m_scs.get_active_camera();
	m_camera.get_translation(camera, vec3);  
    m_camera.target_setup(camera, { pos: m_ctl_view_conf.TARGET_POS, pivot: m_ctl_view_conf.TARGET_PIVOT   
   	, 
              horiz_rot_lim: m_ctl_view_conf.TARGET_HORIZ_LIMITS, vert_rot_lim: m_ctl_view_conf.TARGET_VERT_LIMITS, 
              dist_lim: m_ctl_view_conf.DIST_LIMITS });
}
function hover_camera_action() {  
    var camera = m_scenes.get_active_camera();
    m_cam.hover_setup(camera, { pos: m_ctl_view_conf.HOVER_POS, pivot: m_ctl_view_conf.HOVER_PIVOT, 
            dist_lim: m_ctl_view_conf.DIST_LIMITS, hover_angle_lim: m_ctl_view_conf.HOVER_ANGLE_LIMITS, 
            enable_horiz_rot: true});
    m_cam.rotate_camera(camera, -Math.PI/4, -Math.PI/8, true, true);     
}
function reset_camera_action() {  
	 if (m_nla.is_play())
	{
        return;
	}	
    var camera = m_scs.get_active_camera();
    m_camera.static_setup(camera, { pos: _default_pos });
    m_trans.set_rotation_v(camera, _default_rot);
}
function fader_black()  {
			   m_scs.show_object(_m_camera_shading);
			   m_mat.set_nodemat_value(_m_camera_shading,["camera_shading_mat","Value"], 1);
				setTimeout(function() {			        			
					 m_mat.set_nodemat_value(_m_camera_shading,["camera_shading_mat","Value"], 0);
						}, 16000);			 			
} 
function fader_wormhole()  {
			  m_scs.show_object(_whormhole_body);
			    m_anim.apply(_whormhole_rig, "ArmatureAction");
				m_anim.set_behavior(_whormhole_rig, m_anim.AB_FINISH_STOP);
				m_anim.play(_whormhole_rig);
			   m_mat.set_nodemat_value(_whormhole_body,["wormhole_mat","Value"], 1); 
				setTimeout(function() {			        			
					 m_mat.set_nodemat_value(_whormhole_body,["wormhole_mat","Value"], 0);   
			m_scs.hide_object(_whormhole_body);
						}, 6000);			 			
} 
 function get_start_time_cb(in_params, out_params) {
	 console.log("inicio el tiempo variable ya te avisaremos que corre");
}
function update_timer_cb(in_params, out_params) {
	console.log("se actualizaron algun dato como score o time");
}
function end_of_game_cb(in_params, out_params) {
	console.log("finalizó el juego ajajajajaajajaj pero hubo aviso eeeh vale");
}
})