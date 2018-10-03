
Project N-Dimensiones y su autor: florencio Valladlid Rodriguez
------------------------------------------------------

 Os deja accesi a su primer videojuego o demo 3D , "la ciudad perdida" como un poderoso ej de app para la web,
 que solo necesita el navegador web de cualquier dispositivo, de codigo realizado
 con el engine 3d, o framework  "blend4web" en javascript, html5 y css3, y el estado actual de desarrollo no tiene
 nada que envidiar a generos  de videojuegos shooter,puzzle, aventuras..etc  de otros engines que se generan como app nativas y requieren 
 para su acceso de equipos especificos de alta gama, su sencillez y rapida implementación, lo diferencia claramente para 
ser ideal para iniciarse en desarrollos 3d, aprendizage y  este desarrollo, solo requiere apoyarlo en su crowdfounding 
 para llegar mas alla a ser un juego en linea multijugador y sin limites mas que el del hardware y el que nos van imponiendo los navegadores web
que por suerte va mejorando dia a dia.
 Con vuestro apoyo podran salir incluso versiones de mayor resolución para el disfrute en equipos de alta gama.
Mientras falte el apoyo, podra usar este codigo, se proporcionan los binarios proporcinoados en dir assets de
 las mallas pero segiran habiendo errores de no found de sus imagenes que supondra un palo al testarlo,
 pero ante semejante regao que ya os hago mas palo es dedicar tiempo a un proyecto sin este apoyo.

demo reel
------------
 
 Para que veais rapidamente su potecial resumido hay la demo reel
 https://youtu.be/C-zYG_BbMJs


 
contact
--------

@flokisun
https://www.linkedin.com/in/florenciovalladolidrodriguez/



testing:
----------

ya jugable directamente en 
www.n-dimensiones.es

recomiendo leer la guia antes
https://www.n-dimensiones.es/main/blog


Crowdfounding campaña para seguir desarrollando:
apoyalo para que haya proximas salidas:  multiplayer, middle y alta resolution
https://patreon.com/ndimensiones


https://github.com/n-dimensiones

version
-------
 actual: 001
 
Se requiere descargar sdk free CE 17.12 o la LITE  o solo el addon de blend4web para usarlo en blender 2.79.
 Y sólo asi podras obtener tus propios modelos o los nombres en el codigo usado de las mallas y escenas .json y .bin files
Se actualizo a la actual sdk18.05 porque ambas 17 y 18 ya usan modules de nodejs con javascript ES6, en lugar de la api  b4w.js previa pero
como habian errores que ya no puede resolver mantuve la previa para que os llegue sino se hubiese retrasado 
y no cuento ni con tiempo ni dinero para permitirmelo.  Si como os dije apoyais crowdfounding ,vuelvo a insistir segurametne si os la entregaria actualizada a sdk1 18.05 
con javascript ES6


Quick start
-----------

Clone the repo, `git clone https://github.com/n-dimensiones/the_city_lost.git`
 
Para descargar directorio /assets
https://drive.google.com/open?id=1kHXAA4F-ATPKJa6XBT-kP51OIAy0pMQQ




Copyright and license
---------------------

Licensed under GPL v3 license, se proporcionan los archivos fuente.
Se adjunta file LICENSE

All image and audio files (including *.png, *.jpg, *.svg, *.mp3, *.wav 
and *.ogg) are licensed under the CC-BY-NC license. No se proporcionan porque, se precisa apoyo al crowdfounding para mantener el proyecto y poder seguir desarrollando, ampliando y alcanzar los objetivos de hacer multiplayer y resoluciones de pantalla mejores, middle y high




bugs_errores actuales
---------------------

Solo se registran los que salen al usar la portada o inicio pagina principal, si se ejecuta a modo testing sin estar en producion o sin simularlo
Donde se requiere para no ver estos errors ej https, y requisitos de una app progresive con manifest

A bad HTTP response code (404) was received when fetching the script.
Failed to load resource: net::ERR_INVALID_RESPONSE
/blend4web_ce/projects/atlantida/#quality=high:1 Uncaught (in promise) TypeError: Failed to register a Service
Worker: A bad HTTP response code (404) was received when fetching the script.
Promise.then (async)
(anonymous) @ (index):1096


