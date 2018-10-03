if (b4w.module_check("level01_config"))
    throw "Failed to register module: level01_config";
b4w.register("level01_config", function(exports, require) {
exports.VICT_CAM_VERT_ANGLE = -0.3;
exports.VICT_CAM_DIST = 10;
exports.LEVEL_NAME = "protect_city";
exports.CHAR_DEF_POS = new Float32Array([0, 0, 2]);
exports.MAX_CHAR_PREMI = 500;  
exports.DEFAULT_POS_VEHICLE = new Float32Array([-0.78, 10.5, 0.37]); 
exports.DEFAULT_POS_VEHICLE2 = new Float32Array([-0.52, 5.7, 0.30]); 
})