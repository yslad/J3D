J3D.Primitive = {};

J3D.Primitive.Cube = function(w, h, d) {
	var c = J3D.Primitive.getEmpty();
	w = w * 0.5;
	h = h * 0.5;
	d = d * 0.5;
	
	J3D.Primitive.addQuad(c, new v3(-w, h, d), new v3(w, h, d), new v3(w, -h, d), new v3(-w, -h, d));
	J3D.Primitive.addQuad(c, new v3(w, h, -d), new v3(-w, h, -d), new v3(-w, -h, -d), new v3(w, -h, -d));
	
	J3D.Primitive.addQuad(c, new v3(-w, h, -d), new v3(-w, h, d), new v3(-w, -h, d), new v3(-w, -h, -d));
	J3D.Primitive.addQuad(c, new v3(w, h, d), new v3(w, h, -d), new v3(w, -h, -d), new v3(w, -h, d));
	
	J3D.Primitive.addQuad(c, new v3(w, h, d), new v3(-w, h, d), new v3(-w, h, -d), new v3(w, h, -d));
	J3D.Primitive.addQuad(c, new v3(w, -h, d), new v3(w, -h, -d), new v3(-w, -h, -d), new v3(-w, -h, d));

	return new J3D.Mesh(c);
}

J3D.Primitive.FullScreenQuad = function() {
	var c = new J3D.Geometry();
	c.addArray("aVertexPosition", new Float32Array([-1, 1,     1, 1,     1, -1,     -1, 1,     1, -1,     -1, -1]), 2);
	c.addArray("aTextureCoord", new Float32Array([0, 1,     1, 1,     1, 0,     0, 1,     1, 0,    0, 0]), 2);
	return c;
}

J3D.Primitive.Plane = function(w, h, wd, hd, wo, ho) {
	var c = J3D.Primitive.getEmpty();
	
	if(!wo) wo = 0;
	if(!ho) ho = 0;
 	
	w = w * 0.5;
	h = h * 0.5;
	
	if(!wd) wd = 1;
	if(!hd) hd = 1;
	
	var wStart = -w + wo;
	var wEnd = w + wo;
	var hStart = h + ho;
	var hEnd = -h + ho;
	var uStart = 0;
	var uEnd = 1;
	var vStart = 1;
	var vEnd = 0;
	
	var wb = (w * 2) / wd;
	var hb = (h * 2) / hd;
	
	for(var i = 0; i < wd; i++) {
		for(var j = 0; j < hd; j++) {
			
			var bvStart = wStart + i * wb;
			var bvEnd = bvStart + wb;
			var bhStart = hStart - j * hb;
			var bhEnd = bhStart - hb;
			
			var va = new v3(bvStart, bhStart, 0);
			var vb = new v3(bvEnd, bhStart, 0);
			var vc = new v3(bvEnd, bhEnd, 0);
			var vd = new v3(bvStart, bhEnd, 0);
			
			var us = 1 / wd * i;
			var ue = 1 / wd * (i + 1);
			var vs = 1 - (1 / hd * (j + 1));
			var ve = 1 - (1 / hd * j);
			
			J3D.Primitive.addQuad(c, va, vb, vc, vd, us, ue, vs, ve);
		}
	}

	return new J3D.Mesh(c);
}

/**
 * Adapted from Three.js & Papervision3d
 */
J3D.Primitive.Sphere = function(radius, segmentsWidth, segmentsHeight) {
        var c = J3D.Primitive.getEmpty();

        var vertices = [];
        var uvs = [];

        var radius = radius || 50;
        var segmentsX = Math.max( 3, Math.floor( segmentsWidth ) || 8 );
        var segmentsY = Math.max( 3, Math.floor( segmentsHeight ) || 6 );

        var phiStart = 0;
        var phiLength = Math.PI * 2;

        var thetaStart = 0;
        var thetaLength = Math.PI;

        var x, y;

        for ( y = 0; y <= segmentsY; y ++ ) {

            for ( x = 0; x <= segmentsX; x ++ ) {

                var u = x / segmentsX;
                var v = y / segmentsY;

                var xp = - radius * Math.cos( phiStart + u * phiLength ) * Math.sin( thetaStart + v * thetaLength );
                var yp = radius * Math.cos( thetaStart + v * thetaLength );
                var zp = radius * Math.sin( phiStart + u * phiLength ) * Math.sin( thetaStart + v * thetaLength );

                vertices.push( new v3(xp, yp, zp) );
                uvs.push([u, 1-v]);
            }
        }

        for ( y = 0; y <= segmentsY; y ++ ) {

            for ( x = 0; x < segmentsX; x ++ ) {

                var vt1 = vertices[ y * segmentsX + x + 0 ];
			    var vt2 = vertices[ y * segmentsX + x + 1 ];
			    var vt3 = vertices[ (y+1) * segmentsX + x + 1 ];
			    var vt4 = vertices[ (y+1) * segmentsX + x + 0 ];

                var uv1 = uvs[ y * segmentsX + x + 0 ];
			    var uv2 = uvs[ y * segmentsX + x + 1 ];
			    var uv3 = uvs[ (y+1) * segmentsX + x + 1 ];
			    var uv4 = uvs[ (y+1) * segmentsX + x + 0 ];

                var n1 = vt1.cp().norm();
                var n2 = vt2.cp().norm();
                var n3 = vt3.cp().norm();
                var n4 = vt4.cp().norm();

                var p = c.vertices.length / 3;

                c.vertices.push(vt1.x, vt1.y, vt1.z, vt2.x, vt2.y, vt2.z, vt3.x, vt3.y, vt3.z, vt4.x, vt4.y, vt4.z);
                c.uv1.push( uv1[0],uv1[1],  uv2[0],uv2[1], uv3[0],uv3[1], uv4[0],uv4[1] );
                c.normals.push( n1.x, n1.y, n1.z, n2.x, n2.y, n2.z, n3.x, n3.y, n3.z, n4.x, n4.y, n4.z );
                c.tris.push( p + 0, p + 1, p + 2,  p + 0, p + 2, p + 3 );
            }
        }

        return new J3D.Mesh(c);
    }

J3D.Primitive.getEmpty = function(){
	var g = {};
	g.vertices = [];	 
	g.normals = [];
	g.uv1 = [];
	g.tris = [];
	return g;
}

J3D.Primitive.addQuad = function(g, p1, p2, p3, p4, minU, maxU, minV, maxV) {
	var n1 = v3.cross(p1.sub(p2), p2.sub(p3)).norm();
	var p = g.vertices.length / 3;
	
	var nu = (minU) ? minU : 0;
	var xu = (maxU) ? maxU : 1;
	var nv = (minV) ? minV : 0;
	var xv = (maxV) ? maxV : 1;
		
	g.vertices.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z, p3.x, p3.y, p3.z, p4.x, p4.y, p4.z);
	g.normals.push (n1.x, n1.y, n1.z, n1.x, n1.y, n1.z, n1.x, n1.y, n1.z, n1.x, n1.y, n1.z);
	g.uv1.push(nu,xv, xu,xv, xu,nv, nu,nv);
	
	g.tris.push(p, p + 1, p + 2, p, p + 2, p + 3);
}