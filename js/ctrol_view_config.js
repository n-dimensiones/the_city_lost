if (b4w.module_check("ctl_view_config"))
    throw "Failed to register module: ctl_view_config";
b4w.register("ctl_view_config", function(exports, require) {
exports.STATIC_POS = new Float32Array([32, -5, 9]);
exports.STATIC_LOOK_AT = new Float32Array([0, 0, 0]);
exports.EYE_POS = new Float32Array([-1.5, -3, 0.5]);
exports.EYE_LOOK_AT = new Float32Array([-1.5, 0, 0.5]);
exports.TARGET_POS = new Float32Array([2, 7, 4]);
exports.TARGET_PIVOT = new Float32Array([0, 0, 0]);
exports.DIST_LIMITS = {
    min: 2,
    max: 20
};
exports.EYE_VERT_LIMITS = {
    down: -Math.PI/16, 
    up: Math.PI/16
}
exports.EYE_HORIZ_LIMITS = {
    left: Math.PI/4, 
    right: -Math.PI/4
}
exports.TARGET_VERT_LIMITS = {
    down: -Math.PI/16, 
    up: -Math.PI/4
}
exports.TARGET_HORIZ_LIMITS = {
    left: -Math.PI/4, 
    right: Math.PI/4
}
exports.HOVER_ANGLE_LIMITS = {
    down: -Math.PI/16, 
    up: -Math.PI/4
}
exports.HOVER_POS = new Float32Array([4.5, 3, 3]);
exports.HOVER_PIVOT = new Float32Array([4.5, 0, 0]);
})