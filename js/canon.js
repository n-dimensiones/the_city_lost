if (b4w.module_check("canon"))
    throw "Failed to register module: canon";           
b4w.register("canon", function(exports, require) {
var m_ctl   = require("controls");
var m_scs   = require("scenes");
var m_anim  = require("animation");
var m_sfx   = require("sfx");
var m_trans = require("transform");
var m_util  = require("util");
var m_vec3  = require("vec3");
var m_quat  = require("quat");
var m_phy = require("physics");
var m_conf     = require("game_config");
var m_char     = require("character2");
var m_combat   = require("combat");
var m_obelisks = require("obelisks");
var m_bonuses  = require("bonuses");
//var m_gems     = require("gems");
var _canons_wrappers = [];     
var _laser_tps=null;
var _laser=null;
var _laser2=null;	
var	 _canon_speaker_strike=null;
var _explosion_canon_spk=null;
 var _vec3_tmp_4= new Float32Array(3);           
 var _vec3_tmp_5= new Float32Array(3);    
 var _vec3_tmp_4_Z= new Float32Array(3);  
 var _vec3_tmp_5_Z=	new Float32Array(3);   
var _vec3_tmp   = new Float32Array(3);
var _vec3_tmp_2 = new Float32Array(3);
var _vec3_tmp_3 = new Float32Array(3);
var _quat4_tmp  = new Float32Array(4);
var _quat4_tmp2 = new Float32Array(4);
var _quat4_tmp3 = m_quat.create();  
var _quat_tmp = m_quat.create();  
var _vec3_tmp_4   = new Float32Array(3);
var _vec3_tmp_5 = new Float32Array(3);
var _vec3_tmp_4_Z= new Float32Array(3);
var _vec3_tmp_5_Z= new Float32Array(3);
var _elapsed_sensor=null;
var _elapsed_time=0;  
var _canon_attack_done = false;  
var _obj_hit = null;   
var _burst_fire_sensor = m_ctl.create_custom_sensor(0);  
var _proximity_to_char_sensor = m_ctl.create_custom_sensor(0);   
var _idem_island_sensor = m_ctl.create_custom_sensor(0);  
var	_idem_island=0;			
var _time=0;  
var _burst_time=0;  
var _last_shoot_time = 0;  
var _frame=0; 
exports.init = function(elapsed_sensor,canon_empty) {   
	var empty_name;
	if (!canon_empty)   
	for (var i = 0; i < m_conf.CANONS_EMPTIES.length; i++) {  										
		 empty_name=m_conf.CANONS_EMPTIES[i];		
		var canon_empty = m_scs.get_object_by_name(empty_name); 
        var canon_body = m_scs.get_object_by_dupli_name(empty_name, "canon_collider");
        var canon_rig = m_scs.get_object_by_dupli_name(empty_name, "canon_rig");
     var canon_wrapper = init_canon_wrapper(canon_body, canon_rig, canon_empty);
        canon_wrapper.canon_ronda_speaker = m_scs.get_object_by_dupli_name(empty_name,   
                                                  m_conf.CANON_RONDA_SPEAKER);    
		canon_wrapper.canon_idle_speaker = m_scs.get_object_by_dupli_name(empty_name,
															 m_conf.CANON_IDLE_SPEAKER);	
        canon_wrapper.canon_attack_speaker = m_scs.get_object_by_dupli_name(empty_name,
                                                  m_conf.CANON_ATTACK_SPEAKER);		
		canon_wrapper.canon_speaker_strike = m_scs.get_object_by_dupli_name(empty_name,      
                                                  m_conf.CANON_SPEAKER_STRIKE);	
		canon_wrapper.explosion_canon_spk = m_scs.get_object_by_dupli_name(empty_name,      
                                                  m_conf.CANON_SPEAKER_EXPLOSION);											  
		_canon_speaker_strike=canon_wrapper.canon_speaker_strike;								  
		_explosion_canon_spk=canon_wrapper.explosion_canon_spk;
         canon_wrapper.gun_laser_tps=  m_scs.get_object_by_dupli_name(empty_name, "gun");
		 canon_wrapper.gun_soporte_laser_tps=  m_scs.get_object_by_dupli_name(empty_name, "soporte_gun");
		 canon_wrapper.gun_base_laser_tps=  m_scs.get_object_by_dupli_name(empty_name, "base");
		 m_scs.show_object(canon_wrapper.gun_laser_tps);  
	     m_scs.show_object(canon_wrapper.gun_soporte_laser_tps); 
		 m_scs.show_object(canon_wrapper.gun_base_laser_tps); 
		canon_wrapper.laser_tps=  m_scs.get_object_by_dupli_name(empty_name, "laser_tps");  
		_laser_tps= canon_wrapper.laser_tps;		 
		m_scs.hide_object(_laser_tps);                                     
		canon_wrapper.laser=  m_scs.get_object_by_name("laser");
		_laser=canon_wrapper.laser;
     	canon_wrapper.laser2=   m_scs.get_object_by_dupli_name("laser.001", "laser");  
		_laser2=canon_wrapper.laser2;
		  _elapsed_sensor=elapsed_sensor;
		var	elapsed_sensor=m_ctl.create_elapsed_sensor();
		m_anim.apply(canon_rig, "canon_idle"); 
        m_anim.set_behavior(canon_rig, m_anim.AB_STOP);  
        m_anim.play(canon_rig);
				m_anim.apply(canon_rig, "canon_ronda"); 
        m_anim.set_behavior(canon_rig, m_anim.AB_STOP);  
        m_anim.play(canon_rig);
				m_anim.apply(canon_rig, "canon_attack"); 
        m_anim.set_behavior(canon_rig, m_anim.AB_STOP);  
        m_anim.play(canon_rig);
			m_anim.apply(_laser, "laser_strike"); 
		    m_anim.set_behavior(_laser, m_anim.AB_CYCLIC);   
			m_anim.apply(_laser2, "laser_strike");
		    m_anim.set_behavior(_laser2, m_anim.AB_CYCLIC);			
			m_anim.apply(_laser_tps, "laser_strike");
		    m_anim.set_behavior(_laser_tps, m_anim.AB_CYCLIC);			
            m_anim.play(_laser_tps);
		canon_wrapper.state=m_conf.CS_IDLE;
		console.log("se ha establecido en .init el estado idle");  
        m_ctl.create_sensor_manifold(canon_wrapper, "CANON", m_ctl.CT_CONTINUOUS,     
                                     [elapsed_sensor],function(s) { return s[0]}, canon_ai_cb);    
        _canons_wrappers.push(canon_wrapper);   
	}
    m_combat.set_enemies(_canons_wrappers);
}
function init_canon_wrapper(body, rig, empty) {  
    return {
        body: body,    
        rig: rig,
        empty: empty,
        hp: m_conf.CANON_HP,    
        island_id: 0,    
		dist_to_char: 0,
		dest_point: 0,                 
        dest_pos: new Float32Array(3),     
		dest_pos_Z: new Float32Array(3),						
        last_target: m_conf.CT_POINT,              
        state: m_conf.CS_IDLE,
        attack_point: new Float32Array(3),
        attack_done: false,   
        canon_ronda_speaker: null,
		canon_idle_speaker: null,
        canon_attack_speaker: null,
		canon_speaker_strike: null,  
         gun_laser_tps: null,         
		gun_soporte_laser_tps: null,
		gun_base_laser_tps: null,		
		laser_tps: null,
		laser: null,
		laser2: null
    }
}
function dist_to_char_cb(canon_wrapper) {
	var char_wrapper = m_char.get_wrapper();  
	var canon_empty = canon_wrapper.empty;
	var trans       = _vec3_tmp_4;
    var targ_trans  = _vec3_tmp_5;
	var trans_Z       = _vec3_tmp_4_Z;             
    var targ_trans_Z  = _vec3_tmp_5_Z;
    m_trans.get_translation(canon_empty, trans);
    m_trans.get_translation(char_wrapper.phys_body, targ_trans);
	canon_wrapper.dest_pos_Z.set(targ_trans);  
    targ_trans[2] = trans[2];  
       canon_wrapper.dest_pos.set(targ_trans);
    var dist_to_char = Math.floor(m_vec3.distance(trans, targ_trans));
    canon_wrapper.dist_to_char= dist_to_char;
	return canon_wrapper.dist_to_char;
}
function canon_ai_cb(obj, id,pulse) {  
if (pulse) {
	var char_wrapper = m_char.get_wrapper();	
    var island_id = obj.island_id;
    if (m_char.get_wrapper().island == island_id)  
			{		
			_idem_island=1; 		
			 m_ctl.set_custom_sensor(_idem_island_sensor, 1);	
		   }  				
			else
				if (m_char.get_wrapper().island != island_id) {	
				_idem_island=0;		
				 m_ctl.set_custom_sensor(_idem_island_sensor, 0);	
				}
    if (obj.hp <= 0) {          
        kill(obj);   
        return;
    }
	switch (obj.state) {
    case m_conf.CS_ATTACKING:  
	function attack_cb() { 
	if (pulse) {
		  var elapsed = m_ctl.get_sensor_value(obj, id, 0);
	     _elapsed_time=elapsed;  
			var dist_to_char =dist_to_char_cb(obj);	
        if ((dist_to_char <=20)&&(m_char.get_wrapper().island != island_id)) {  
		m_ctl.set_custom_sensor(_proximity_to_char_sensor, 1);	
		 var state1 = m_ctl.get_sensor_value(obj, id, 0);
				   obj.state=m_conf.CS_RONDA;
		}	else
		if ((dist_to_char <=20)&&(m_char.get_wrapper().island == island_id)&&(!m_sfx.is_playing(obj.canon_attack_speaker))) {
				process_attack_canon_tps_cb(obj,elapsed);  
				process_damage_char_shoot_cb(obj,elapsed);	
		   } 
      else 	
		  if ((dist_to_char>20)&&(m_char.get_wrapper().island != island_id))
		{
		  m_ctl.set_custom_sensor(_proximity_to_char_sensor, 0);	
			obj.state=m_conf.CS_IDLE;	  
			}	
	  } 
	} 
	m_ctl.create_sensor_manifold(obj, "ATTACK_CANON", m_ctl.CT_SHOT,  
        [_proximity_to_char_sensor, _idem_island_sensor, _elapsed_sensor], function(s) {return s[0] || s[1]}, attack_cb);	
      break;
    case m_conf.CS_RONDA:   
	function ronda_cb(obj, id, pulse)      { 
	if (pulse) {
	  var canon_rig=obj.rig;
	  var dist_to_char =dist_to_char_cb(obj);
		  if ((dist_to_char >20)&&(m_char.get_wrapper().island != island_id))  
		{
		m_ctl.set_custom_sensor(_proximity_to_char_sensor, 0);		
		obj.state=m_conf.CS_IDLE;
		}
      else 	
		  if ((dist_to_char<=20)&&(m_char.get_wrapper().island == island_id))  
	  {        
		m_ctl.set_custom_sensor(_proximity_to_char_sensor, 1);	
		  m_ctl.set_custom_sensor(_idem_island_sensor, 1);	
		  obj.state=m_conf.CS_ATTACKING;	 
	  } else  
	      if ((dist_to_char<=20)&&(m_char.get_wrapper().island != island_id)&&(!m_sfx.is_playing(obj.canon_ronda_speaker)))  {    
		   m_ctl.set_custom_sensor(_idem_island_sensor, 0);	
			m_scs.hide_object(obj.laser_tps);
			m_sfx.stop(obj.canon_idle_speaker);		
	        m_sfx.stop(obj.canon_attack_speaker);	
			m_sfx.play_def(obj.canon_ronda_speaker);  
			m_anim.apply(canon_rig, "canon_ronda");  
			m_anim.set_behavior(canon_rig, m_anim.AB_CYCLIC);
			m_anim.play(canon_rig,function() {
	            if (obj.state != m_conf.CS_ATTACKING)   
              obj.state=m_conf.CS_IDLE;	 
			});  
	     }  
	}
 } 
          var elapsed = m_ctl.get_sensor_value(obj, id, 0);
	     _elapsed_time=elapsed;  
		m_ctl.create_sensor_manifold(obj, "RONDA_CANON", m_ctl.CT_TRIGGER,  
        [_proximity_to_char_sensor, _idem_island_sensor, _elapsed_sensor], function(s) {return s[0] || !s[1]}, ronda_cb);		
        break;		
	 case m_conf.CS_IDLE:  
	function play_idle_cb(obj,id,pulse) {
		var canon_rig=obj.rig;
		if (pulse) {
    	var dist_to_char =dist_to_char_cb(obj);	
        if (dist_to_char <=20) {  
		m_ctl.set_custom_sensor(_proximity_to_char_sensor, 1);	
		 var state1 = m_ctl.get_sensor_value(obj, id, 0);
		   switch (_idem_island)  {
			    case 0:
				   obj.state=m_conf.CS_RONDA;
				break;
				 case 1:
						obj.state=m_conf.CS_ATTACKING;
					break;
		   } 
		}
      else 	
		  if ((dist_to_char>20)&&(!m_sfx.is_playing(obj.canon_idle_speaker)))      
	  {
		  m_scs.hide_object(obj.laser_tps);
		  m_ctl.set_custom_sensor(_proximity_to_char_sensor, 0);	
	    m_sfx.stop(obj.canon_attack_speaker);	
		m_sfx.stop(obj.canon_ronda_speaker);		
		m_sfx.play_def(obj.canon_idle_speaker);  
	    m_anim.apply(canon_rig, "canon_idle");   
        m_anim.set_behavior(canon_rig, m_anim.AB_CYCLIC);
        m_anim.play(canon_rig, function() {
                if (obj.state != m_conf.CS_ATTACKING)   
				obj.state=m_conf.CS_RONDA;	 
        });
	  }
	 } 
	}  
		m_ctl.create_sensor_manifold(obj, "IDLE_CANON", m_ctl.CT_SHOT,  
        [_proximity_to_char_sensor,_elapsed_sensor], function(s) {return !s[0]}, play_idle_cb);		
        break;	
	default:
        break;
    } 
  }
}  
function process_damage_char_shoot_cb(canon_wrapper,elapsed)  {  
   var damage_char_shot_cb = function(obj, id, pulse) {    
        if (canon_wrapper.state != m_conf.CS_ATTACKING)
            return;
   if (!canon_wrapper.attack_done) { 
        var time = m_ctl.get_sensor_value(obj, id, 0);   
        if (time - _burst_time > m_conf.BURST_LISER_TIME) {     
				m_ctl.set_custom_sensor(_burst_fire_sensor, 0);  
			}          
	var elapsed = m_ctl.get_sensor_value(obj, id, 1);   
    var cross_pos = m_trans.get_translation(obj, _vec3_tmp);
    var cross_view = m_trans.get_rotation(obj, _quat_tmp);
    var forward_tmp=m_quat.create();
	var vec3_tmp2 = m_vec3.create(); 
	var enemis=m_combat.get_wrapper();
	var	forward = m_vec3.transformQuat(m_util.AXIS_MY, cross_view, vec3_tmp2);  
        forward = m_vec3.scale(forward, m_conf.MAX_LASER_LENGTH, vec3_tmp2);  
        forward = m_vec3.add(forward, cross_pos, forward);         
     var ray_test_cb = function(id, hit_fract, obj_hit, hit_time) { 
		 _obj_hit=obj_hit;   
		 if(!m_combat.check_attack_shot(obj_hit,elapsed))	
			 return;
		canon_wrapper.attack_done = true;			
 		 _frame = m_anim.get_frame(canon_wrapper.rig);  
	  if (_frame >= m_conf.CANON_ATTACK_ANIM_FRAME) {    //60frames en m_conf file actualmente pero la anim deberia ser la attack de 159
														//la ultima vez se vio a 168 o mas que no parecen pertener mas que a anim del ronda en lugar del de attack luego revisar
														//porque deberia ser la attack y solo cuando se de se testea si hubo o no colision para poderlo dar por finalizado el ataque
														//y si no debia ser cicly la animacion para que se controle su ejecucion una y otra vez lo que ya sustituiria a simular ser ciclica
														//el que por ej por continuar en la zona de ataque sea lo que la reproduce una y otra vez
		if (m_combat.check_attack_shot(_obj_hit,elapsed))	{	//simplemente comprueba no ya la distancia al char sino si hubo colision 
		 var damage = m_conf.CANON_ATTACK_STRENGTH;  
		 m_char.change_hp(-damage); //*0.01);   //tal 0.01 es un simple delay que he puesto para que no muera inmediatamente durante las pruebas el character
	//   m_sfx.play_def(canon_wrapper.hit_speaker);
	    canon_wrapper.attack_done = false;	
				}//fin del if si hubo collison del laser con character	
		}  //fin (_frame >= m_conf.CHAR_ATTACK_ANIM_FRAME)
	 }//fin ray_test_cb()														
	 var id = m_phy.append_ray_test(null, cross_pos, forward,          // objeto null es cualquiera creo, desde, hacia, collision id, callback y true que se auto elimine el rayo al terminar 
                "CHARACTER", ray_test_cb, true);                     
  }  //fin del if (!_char_attack_done)		
 }   //fin damage_char_shot_cb   callback del manifold para el crosshair definicion . Parece que antes era la burst_cb
        	var canon_gun_obj = canon_wrapper.gun_laser_tps;  //la Turret malla  anteriormente era la crosshair_obj o pto mira
			if (canon_gun_obj) {               //pto mira
			var time = m_ctl.create_timeline_sensor();  //vaya hombre tambien se crea un timeline en shoot o 
													//register_mouse mdoule porque usamos variables que lo usan
			var elapsed = m_ctl.create_elapsed_sensor();
			m_ctl.create_sensor_manifold(canon_gun_obj, "DAMAGE_CHAR_SHOT", m_ctl.CT_POSITIVE,   //ANTIGUA "BURST"
                [time, elapsed, _burst_fire_sensor], null, damage_char_shot_cb); 
		     }// fin manifold burst_cb llamada
}	//fin fon process_damage_enemies_shoot_cb()
function set_state(canon_wrapper, state) {  	
    var canon_rig = canon_wrapper.rig;  //si es el collider seria el body  . COMO ESTAMOS EN UN FOR DEBERIA USARSE ESTA EN LUGAR DE LA SIGUIENTE
    switch (state) {
    case m_conf.CS_RONDA:
//			console.log("se esta en estado ronda");
        break;
    //case m_conf.CS_ATTACKING:   
//llevado a dentro attack_target acualmente insertado en a su vez en la reconstruida process_attack_canon_tps_cb													
 //       break;
    case m_conf.CS_IDLE:   
	    break;
    }
    canon_wrapper.state = state;  //para attacking nos la comimos para reducir motivos que no reproducian lo esperado de la combinacion laser y anim del canon
}
 //fon que asigna a cada golem algo mas que sus valores de partida, ahora aqui determinamos su posicion -rotacion e isla la que le pasamos como parametro
 //en el manifold encargado con un elapsed time y golem interval de valor 3 de operar. Reducido a 1 durante las pruebas, supongo que hasta que no muere no vuelve a salir etc
//para el canon solo tenemos que reemplazar aqui canoon por asteroid explosion o lo que sea como ej inicial y no hay reset porque desaparece ya totalmente 
//contamos con que el module character tiene en sus linea actual 2876 un pedazo codigo copia del previo para destruir barrel algo o muy independiente del modulo 
//de picked object al que pertenece barrel object , con canon si deberiamos empezar ya a engancharlo a su kill fon de enemi
//aunque lo que termine aqui funcionando lo probamos pues alli asi
exports.kill=kill;
function kill(canon_wrapper) {  // malla del golem que vamos a reemplazar por la del death golem, que dispondra de dos  armatures la death rig y la death blow
	    var canon = canon_wrapper.empty;
//10   ocultarlo y mostrar exploson es exactamente lo que hacemso en weapons modul en linaa 1958	
//10 cuando podiamos exportar kill alli pues pero nos traemos su codigo aqui ajustado al actual
//    var alien_death_empty = m_scs.get_object_by_name(m_conf.ALIENS_DEATH_EMPTY);   //puede ser perfectamente al ppio ej la explosion del asteroid enemi
//    var alien_death_rig = m_scs.get_object_by_dupli_name(m_conf.ALIENS_DEATH_EMPTY,
//                                                     m_conf.ALIENS_DEATH_RIG);
													 // var alien_death_blow = m_scs.get_object_by_dupli_name(m_conf.ALIENS_DEATH_EMPTY,
   //                                                       m_conf.ALIENS_DEATH_BLOW);
  //   var alien_death_blow = m_scs.get_object_by_dupli_name(m_conf.ALIENS_DEATH_EMPTY);
  //para que iba a cargarla si es repetir blow a la empty
	var trans = _vec3_tmp;
    var quat = _quat4_tmp;
	//    m_trans.get_translation(alien, trans);  //obtenmos la posicion para sarsela a la nueva malla que sutituye al golem
    m_trans.get_rotation(canon, quat);
	//    m_trans.set_translation_v(alien_death_empty, trans);  //le damos al golem malla death la del golem normal al que matamos
//    m_trans.set_rotation_v(alien_death_empty, quat);    //le damos la rotacion a tal en este caso la del canon al asteroid explosion malla o lo que sea o armature
//    m_anim.apply(alien_death_rig, "alien_death");
//    m_anim.set_behavior(alien_death_rig, m_anim.AB_FINISH_STOP);
//    m_anim.play(alien_death_rig);
  //   m_anim.play(alien_death_blow); //que nos muestre como explota , es la animacion del death malla
  //    m_sfx.stop(alien_wrapper.walk_speaker);  //que ya no ande o se oiga tal sonido que seguramente es ciclico
	//Y semejante algunas cosas a lo que sucede en la export.reset de este mismo .js
	//y le reseteamos al golem empty del que se trate todo, asi que ahora estara bajo tierra a -1 esperando teletrasportarse en cuanto spawn fon determine su nueva posicion
	//    m_trans.set_translation_v(alien, m_conf.DEFAULT_POS);
	//    m_gems.spawn(trans);
	//    alien_wrapper.island_id = -1;
	//    alien_wrapper.hp = 100;
	//    set_state(alien_wrapper, m_conf.AS_NONE)
	//    m_obelisks.change_gems_num(alien_wrapper.island_id, 0);
	 //m_scs.show_object(canon_wrapper.gun_laser_tps);  
	 //    m_scs.show_object(canon_wrapper.gun_soporte_laser_tps); 
	//	 m_scs.show_object(canon_wrapper.gun_base_laser_tps); 
	 if (m_sfx.is_playing(m_char.get_wrapper().char_sword_hit_spk))
		m_sfx.stop(m_char.get_wrapper().char_sword_hit_spk); 
																							//excepto la gun laser tps el resto finalizan su nombre en el blend file a ..spk
																							//y lo deje mal sin tal y aun asi se oia un ruido distorsionado horrible
	var explosion_canon = m_scs.get_object_by_dupli_name("canon", "explosion_canon");	//_canon_speaker_strike  ya dice en su uso que suena horrible aunque diria que lo debi ajustar de alguna forma, en tales referencias se usaba la play de abajo con 1,0 que cometnamos porque aunque este 0,0, la ultima vez que la probamos sonaba a enganchado cmo sino vovlese o hiciese un reset al finalizar
	//MMMMMMMMMMMMMMMMMMMMMMMMenudo fake, lo anterior dicho , si esto y hablando del objeto explosion, no del speeker, que es otro objeto que nos liamos
// _explosion_canon_spk =m_scs.get_object_by_dupli_name("canon", "explosion_canon_spk");  //,data_main_id) ;
	//				m_sfx.play(_explosion_canon_spk,0,0); 
	 if (m_sfx.is_playing(_explosion_canon_spk))
		m_sfx.stop(_explosion_canon_spk); 
	else 
		m_sfx.play(_explosion_canon_spk,0,0);   //supong que es la misma y efecto que asteroids
					//desde weapons se tra este que alli estuvo montado para ok
				//	m_scs.hide_object(gun_laser);  
				//	m_scs.hide_object(soporte_laser);  
				//	m_scs.hide_object(base_laser);  
				m_scs.hide_object(canon_wrapper.gun_laser_tps);  
	     m_scs.hide_object(canon_wrapper.gun_soporte_laser_tps); 
		 m_scs.hide_object(canon_wrapper.gun_base_laser_tps);
				//	m_scs.show_object(explosion_barrel)  //es el unico objeto que dejamos hide en la escena  o blend file origen
					 m_anim.apply(explosion_canon, "explosion");
					  m_anim.play(explosion_canon);
}
function process_attack_canon_tps_cb(canon_wrapper, elapsed) {   
    	var time = m_ctl.create_timeline_sensor();				
		canon_wrapper.attack_done = true;  //antes de reproducir las animaciones en  process_canon_char_attack_anims()
        m_ctl.set_custom_sensor(_burst_fire_sensor, 1);  //ANTES REPRESENTABA ponerlo a 1 HAcER CREO PULSADO LA TECLA BOTON LEF DEL RATON,
															//en canon es lo mismo supongo que attack_done a true
		process_canon_char_attack_anims(canon_wrapper,elapsed);				//reproducimos animaciones laser malla y canon malla									
				////////////VER FON Shoot del module character para ver como estqablecne un if para un delay del disparo o laser que aqui no aprovechamos aun
        _last_shoot_time = time;  //forma o debia formar parte de una condicion adicional o delay para que hasta que no pase no pueda darse las animaciones
											//ver function shoot_cb extraida aqui por algun motivo aun no he podido determinar sin tal condicion
        _burst_time = time;   //esto deberia de valer para qeu se de la condicion en process_damage_enemies_shoot_cb pero solo es para alli cambiar a 0 
									//el _burst_fire_sensor osea el sensor de que hihco pupa o daño o que hubo colision
        canon_wrapper.attack_done = false;   
}//FIN process_attack_canon_tps_cb
//function process_canon_char_attack(canon_wrapper,elapsed) {   
//}
function move(canon_wrapper, elapsed) {   
    var char_wrapper = m_char.get_wrapper();	
    var island_id = canon_wrapper.island_id;
    if (char_wrapper.island == island_id && char_wrapper.hp > 0) {           
//       attack_target(canon_wrapper, char_wrapper.phys_body, elapsed);
	canon_wrapper.last_target = m_conf.CT_CHAR;
	canon_wrapper.attack_done=false; //solo ha de ser true previo a reproducir anims y en callback ray_test_cb alli si hay collision
									//termina por ponerse a false tambien, y volver una vez reproducidas
if	((!canon_wrapper.attack_done)&&(canon_wrapper.state != m_conf.CS_ATTACKING)&&(canon_wrapper.last_target == m_conf.CT_CHAR)&&(!m_sfx.is_playing(canon_wrapper.canon_attack_speaker)))
canon_wrapper.state= m_conf.CS_ATTACKING;             ////////////se supone que incluye estado  attack_done a false y true , true solo previo a reproducir las anims attack del laser y canon	
    } else {                              
        patrol(canon_wrapper, elapsed);   
    }
}
//function attack_target(canon_wrapper, target, elapsed) {   
  //aqui se reproducia la animacion con el antiguo metodo de enemis modules "set_state" y previamente el rotate_to_dest()
//}
//function perform_attack(canon_wrapper) {
//aqui se reproducia directamente  las anims con los play metodos
//}
function rotate_to_dest(canon_wrapper, elapsed) {
    var canon_empty = canon_wrapper.empty;
	//canon_wrapper.gun_laser_tps=  m_scs.get_object_by_dupli_name(empty_name, "gun");
	//canon_wrapper.gun_soporte_laser_tps=  m_scs.get_object_by_dupli_name(empty_name, "soporte_gun");
	var canon_gun=canon_wrapper.gun_laser_tps;
	var canon_support=canon_wrapper.gun_soporte_laser_tps;
    var dest_pos = canon_wrapper.dest_pos;  //obtiene su valor en dist_to_char_cb() pero alli la altura del char le asigna la del canon
											//y decidimos para evitarlo dejarlo a altura z igual a 0 a cada cañon
   var dest_pos_Z= canon_wrapper.dest_pos_Z;			//en tales get del calculo de distancia a char de ronda e idle estados se actualiza , lo precisamos para el caclulo siguiente
    var trans       = _vec3_tmp;  //la obtenemos aqui con un get
	var cur_rot_q   = _quat4_tmp;  //la obtenemos aqui con un get
	var cur_rot_q_tmp = _quat4_tmp3;
    var cur_dir     = _vec3_tmp_2;
    var dir_to_dest = _vec3_tmp_3;   //se obtiene de trans y dest_pos
    var new_rot_q   = _quat4_tmp2;
	//PARA SUPPORT DEL CANON, finalment esera para el empty porque lo 
    var trans_Z       = _vec3_tmp;  //la obtenemos aqui con un get
	var cur_rot_q_Z   = _quat4_tmp;  //la obtenemos aqui con un get
	var cur_rot_q_tmp_Z = _quat4_tmp3;
    var cur_dir_Z     = _vec3_tmp_2;
    var dir_to_dest_Z = _vec3_tmp_3;   //se obtiene de trans y dest_pos
    var new_rot_q_Z   = _quat4_tmp2;
//	if (altura_char>altura_canon)
//	{
	m_trans.get_translation(canon_gun, trans_Z);
    m_trans.get_rotation(canon_gun, cur_rot_q_Z);       //obtenemos la rotacion actual alien 
//	var char_wrapper = m_char.get_wrapper();
//    var targ_trans_Z=m_vec3.create();
//    m_trans.get_translation(char_wrapper.phys_body, targ_trans_Z);  //deberia ser un valor previo al que machaca dist_to_char_cb() con la posicion o altura del canon
																		//por ello la variable recoge su valor ????
//	canon_wrapper.dest_pos_Z.set(targ_trans_Z);  //como no usamos targ_trans[2] = trans[2];  de fon dist_to_char_cb() no varia su
												//altura del char que la conservamos en tal variable dest_pos_Z
// no nos hacen falta las 4 lineas anteriores al ya actualizar dest_pos_Z valor en la fon dist_to_char_cb()	
		// m_trans.set_rotation_v(canon_empty, [0,0,1,-0.25]);  //originalmente era support pero no esta muy ajustado y volvemos al ppio sin rotacion en vertical
															//1 es 180º mirando canon al contrario de las rampas, 0.25 son 45º deberia mirar espejo
  m_vec3.transformQuat(m_util.AXIS_MY, cur_rot_q_Z, cur_dir_Z);  //creo en eje y , quizas este relacionado con el damage al canon aun en character.js incluido pues se usa MY
    m_vec3.subtract(dest_pos_Z, trans_Z, dir_to_dest_Z);         //obtenemos la direccion al destino no la posicion , usamos la posicion destino para obtenerla
    m_vec3.normalize(dir_to_dest_Z, dir_to_dest_Z);           //la normalizamos
    m_quat.rotationTo(cur_dir_Z, dir_to_dest_Z, new_rot_q_Z);   //y obtenemos la nueva rotacion con la del alien y la del destino
    m_quat.multiply(new_rot_q_Z, cur_rot_q_Z, new_rot_q_Z);
    var vec_dot_Z = m_vec3.dot(cur_dir_Z, dir_to_dest_Z);
    vec_dot_Z = vec_dot_Z > 1? 1: vec_dot_Z < -1? -1: vec_dot_Z;
    var angle_to_turn_Z = Math.acos(vec_dot_Z);
    var angle_ratio_Z   = Math.abs(angle_to_turn_Z) / Math.PI;
    var slerp_Z         = elapsed / angle_ratio_Z * m_conf.CANON_ROT_SPEED;
    m_quat.slerp(cur_rot_q_Z, new_rot_q_Z, Math.min(slerp_Z, 1), new_rot_q_Z);
//	var migiro=m_quat.create();
//	var newrot=m_quat.create();
//	migiro=[0,0,0.1,0.0]; //hemos empezado por -0.1,0.0 y dejaba a canon mitad hundido y girado 45º de lo deseado, a 0.1,0.0 se va a tomar viento
							//nos damos cuenta que el otro canon el adherido al coche tiene otros valores resultantes
//	m_quat.add(migiro,new_rot_q_Z,newrot);
//	 m_trans.set_rotation_v(canon_gun, newrot);  //originalmente era support pero no esta muy ajustado y volvemos al ppio sin rotacion en vertical
	 m_trans.set_rotation_v(canon_gun, new_rot_q_Z);  //originalmente era support pero no esta muy ajustado y volvemos al ppio sin rotacion en vertical
//estas dos lineas de interes colampsan la console log	 
//	console.log("el actual valor de la rotacion en radianes dle canon previa hacia el character, es:"+ cur_rot_q_Z);
//	console.log("el actual valor de la rotacion canon hacia el character, es:"+ new_rot_q_Z);
//	} //fin (altura_char>altura_canon)
    m_trans.get_translation(canon_empty, trans);
    m_trans.get_rotation(canon_empty, cur_rot_q);       //obtenemos la rotacion actual alien 
    m_vec3.transformQuat(m_util.AXIS_MY, cur_rot_q, cur_dir);  //creo en eje y 
    m_vec3.subtract(dest_pos, trans, dir_to_dest);         //obtenemos la direccion al destino no la posicion , usamos la posicion destino para obtenerla
    m_vec3.normalize(dir_to_dest, dir_to_dest);           //la normalizamos
    m_quat.rotationTo(cur_dir, dir_to_dest, new_rot_q);   //y obtenemos la nueva rotacion con la del alien y la del destino
    m_quat.multiply(new_rot_q, cur_rot_q, new_rot_q);
    var vec_dot = m_vec3.dot(cur_dir, dir_to_dest);
    vec_dot = vec_dot > 1? 1: vec_dot < -1? -1: vec_dot;
    var angle_to_turn = Math.acos(vec_dot);
    var angle_ratio   = Math.abs(angle_to_turn) / Math.PI;
    var slerp         = elapsed / angle_ratio * m_conf.CANON_ROT_SPEED;
    m_quat.slerp(cur_rot_q, new_rot_q, Math.min(slerp, 1), new_rot_q);
    m_trans.set_rotation_v(canon_empty, new_rot_q);
}
function process_canon_char_attack_anims(obj,elapsed){  //actualmente esta dentro del etado ATTACKING de la callback CANON en .init
																	//podia estar perfectametne canon_wrapper como parametro 
																	//pero como deje obj dentro su contenindo en su lugar asi lo dejo finalmente 
				rotate_to_dest(obj,elapsed);  
					var canon_rig = obj.rig; 
					m_anim.apply(canon_rig, "canon_ronda");   //se mueve arriba abajo y como el idle , un derivado del idle solo que adaptado al nuevo hueso
													//evitando hundirse en el terreno o efecto malo al girar el antiguo  hueso sin control siguiendo al char
						m_anim.set_behavior(canon_rig, m_anim.AB_STOP);  //m_anim.SLOT_0  //FINISH_RESET
						m_anim.play(canon_rig);
				if 	(!m_sfx.is_playing(_canon_speaker_strike))		
					m_sfx.play_def(_canon_speaker_strike);   //activarlo comentando  attack speaker_strike
				//	m_sfx.play(_canon_speaker_strike,1,0);   //activarlo comentando  attack speaker_strike
				//ninguna de las dos opciones dispara o se oye de forma agradable es orrible comentadas hasta buscar una alternativa o solucion
			//var _canon_speaker_strike = _gun_laser.speaker_strike;
	//     if ((_canon_speaker_strike)
/*
						m_sfx.stop(_char_run_spk);
						m_sfx.stop(obj.canon_ronda_speaker);		
						m_sfx.stop(obj.canon_idle_speaker);		
						m_sfx.play_def(obj.canon_attack_speaker);  //sonido provisional de un cañonazo que no sirve si lo que vemos es un laser, mejor pues oir el laser
	//m_sfx.is_play(obj.canon_idle_speaker)		
						m_sfx.play_def(_canon_speaker_strike);   //activarlo comentando  attack speaker_strike
															//detiene la animacion si la conidcion attack ya no se da y solo vemos el laser
															//disparo animacion que de la otra forma convivian laser disparo y animacion
										//reproduce se supone el sonido del disparo 
						m_anim.apply(canon_rig, "canon_attack");   //se mueve arriba abajo y como el idle , un derivado del idle solo que adaptado al nuevo hueso
													//evitando hundirse en el terreno o efecto malo al girar el antiguo  hueso sin control siguiendo al char
						m_anim.set_behavior(canon_rig, m_anim.AB_CYCLIC);  //m_anim.SLOT_0  //FINISH_RESET
						m_anim.play(canon_rig,function() {
							if (obj.state != m_conf.CS_IDLE)   //CREO que se da cuando se ha dado la apply() previa
								obj.state=m_conf.CS_RONDA;	 
				//				console.log("se ha terminado la animaicon ronda y ahora deberia hacerse idle o estado");
							});  //en getting_out y attacking hay un segundo parametro que esl if acondicionado a que if no sea estado alien NONE
	*/
	//YA ESTAN EN .INIT aqui solo hacemos el play		
			m_scs.show_object(obj.laser_tps);  //muestra la anim del disparo laser tanto si usamos las anims del rig "canon_attack" 
												//como la que represetna el rotate de rotaten_to_dest()
												//lo que pasa que ambas juntas parecen no comvivir
//			m_anim.apply(_laser, "laser_strike"); 
//		    m_anim.set_behavior(_laser, m_anim.AB_CYCLIC);   
            //m_anim.play(_laser);
			 //m_anim.play(milaser,finish_attack_cb)	
//						console.log("se esta en estado attack y hubo pulse y distancia es menor o igual a 20 y misma zona");
/*
	//reproduce las animaciones malla canon attack y laser malla
	var char_wrapper = m_char.get_wrapper();										
    var canon_rig = canon_wrapper.rig; 
	  m_sfx.stop(canon_wrapper.canon_ronda_speaker);		
	  m_sfx.stop(canon_wrapper.canon_idle_speaker);		
	  m_sfx.play_def(canon_wrapper.canon_attack_speaker);  //sonido provisional de lanzar objetos		
	m_anim.apply(canon_rig, "canon_attack",m_anim.SLOT_0);   //se mueve arriba abajo y como el idle , un derivado del idle solo que adaptado al nuevo hueso
													//evitando hundirse en el terreno o efecto malo al girar el antiguo  hueso sin control siguiendo al char
	m_anim.set_behavior(canon_rig, m_anim.AB_FINISH_RESET,m_anim.SLOT_0);
    m_anim.play(canon_rig, null, m_anim.SLOT_0);
   var canon_empty = canon_wrapper.empty;
    var trans       = _vec3_tmp;
    var targ_trans  = _vec3_tmp_2;
    m_trans.get_translation(canon_empty, trans);  //obtenemos posicion alien
    m_trans.get_translation(char_wrapper.phys_body, targ_trans);  //obtenemos posicion char
    targ_trans[2] = trans[2];   //garantiza que la z sea la misma donde este el alien con tal asignacion
    var dist_to_targ = m_vec3.distance(trans, targ_trans);
  //    var angle_to_targ = rotate_to_dest(canon_wrapper, elapsed);  //como devuelve un return y ahora ha sido cometnado nos ahorramos lios
//  rotate_to_dest(canon_wrapper, elapsed);      //tenemos que ver que a pesar de este traslate rotation se
											//de igualmente las animaciones en la orientacion de tal rotacion hacia el character
 var canon_empty = canon_wrapper.empty;
    var at_pt       = canon_wrapper.attack_point;
    var trans       = _vec3_tmp;
    var cur_dir     = _vec3_tmp_2;
		m_anim.apply(canon_rig, "canon_attack");   //se mueve arriba abajo y como el idle , un derivado del idle solo que adaptado al nuevo hueso
													//evitando hundirse en el terreno o efecto malo al girar el antiguo  hueso sin control siguiendo al char
		m_anim.set_behavior(canon_rig, m_anim.AB_FINISH_RESET);
        m_anim.play(canon_rig,function() {    //al final el ataque se pone en modo ronda  , la puse en la callback de la animacion 
												//del laser tubo pero hace un efecto idle incompleto y diria queno retoma la ronda animacion bien
	//           if (canon_wrapper.state != m_conf.CS_IDLE)
	//			{
				m_scs.hide_object(canon_wrapper.laser_tps);  //parece no hacer efecto , luego lo traslado o copio al set_sttate de ronda
				canon_wrapper.last_target == m_conf.CT_POINT; // process_attack  comprueba si es CT_CHAR   o lo establece aqui volvemos al pto partida o predeterminado last_target
															 //que realmente es un pto indeterminado al darse solo un giro constante y no un desplazamiento como a los aliens
//console.log("esto seria si ha finalizado la anim attack su callback condiciona para entrar en estado RONDA");
//                set_state(canon_wrapper, m_conf.CS_RONDA); //no puede darse antes que el resto o los anula al salirse de aqui
	//			}	
        });         
//		 m_scs.show_object(canon_wrapper.laser_tps);  
		console.log("hemos supuestamente reproducido la actual anim de ataque de malla canon y laser malla o su shader");  //si eso es asi que las hemos reproducido
*/
		//deberiamos ver que el frame de damage fon ¿es referido a cuales de ambas mallas? parece que al hueso de canon
}  //fin process_canon_char_attack_anims()
exports.reset = function() {  //cuando ha  muerto un golem  , reseteamos sus parametros como sucedia al crearlos en export.init de este .js
							//para que spawn manifold le vuelva a dar isla y posicion -rotacion nuevos(aleatorios)
    for (var i = 0; i < _canons_wrappers.length; i++) {
        var gw = _canons_wrappers[i];
//        gw.island_id = -1;
//        set_state(gw, m_conf.AS_NONE)  // por defecto era AS_NONE para alien pero este canon creo le basta con IDLE
//        var alien = gw.empty;
//        m_trans.set_translation_v(alien, m_conf.DEFAULT_POS);
//        m_sfx.stop(gw.walk_speaker); //y lo silenciamos
var quad=m_quat.create();
var POS_char = new Float32Array(3);   
m_trans.get_translation(gw.empty, POS_char);	
m_trans.get_rotation(gw.empty,quad);
m_phy.set_transform(gw.body, POS_char, quad);   //a 1.5 actrualmente aunque estuvo a 0.5 en game_config.js		
		//m_scs.show_object(gw.gun_laser);  
		//m_scs.show_object(gw.soporte_laser);  
		//m_scs.show_object(gw.base_laser);  
		 m_scs.show_object(gw.gun_laser_tps);  
	     m_scs.show_object(gw.gun_soporte_laser_tps); 
		 m_scs.show_object(gw.gun_base_laser_tps); 
    }
}
exports.get_wrappers = function() { //fon basada en modoulo character.js pero alli hace un return a _char_wrapper no a un arrya . Creo no tiene sentido esta creacion existiendo
    return _canons_wrappers;
}
//function get_first_free_golem() {
//    for (var i = 0; i < _golems_wrappers.length; i++) {
//        var gw = _golems_wrappers[i];
//        if (gw.state == m_conf.GS_NONE)
//            return gw;
//    }
//    return null;
//}
})