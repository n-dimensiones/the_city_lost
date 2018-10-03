if (b4w.module_check("level02_config"))
    throw "Failed to register module: level02_config";
b4w.register("level02_config", function(exports, require) {
exports.VICT_CAM_VERT_ANGLE = -0.3;
exports.VICT_CAM_DIST = 10;
exports.LEVEL_NAME = "contact";
exports.CHAR_DEF_POS = new Float32Array([0, 0, 2]);   
exports.MAX_CHAR_PREMI = 500;  
exports.DEFAULT_POS_VEHICLE = new Float32Array([-1.3, -10.2, 1]); 
exports.DEFAULT_POS_VEHICLE2 = new Float32Array([-2.8, -12.5, 1]); 
})