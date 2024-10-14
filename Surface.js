class SurfaceModel {
    constructor(name, p, h, uSegments, vSegments) {
        this.name = name;
        this.p = p;
        this.h = h;
        this.uSegments = uSegments;
        this.vSegments = vSegments;
        this.vertexList = [];
    }

    // A method for generating vertex data
    generateVertices() {
        this.vertexList = [];
        let vMax = 2 * Math.PI; // Maximum value of v (360 degrees)

        // U-polylines generation
        for (let i = 0; i <= this.uSegments; i++) {
            let z = -this.h + (i / this.uSegments) * (2 * this.h); // change z from -h to h
            for (let j = 0; j <= this.vSegments; j++) {
                let v = (j / this.vSegments) * vMax; // angle v
                // Parabolic Humming-Top equation
                let x = (((Math.abs(z) - this.h) ** 2) / (2 * this.p)) * Math.cos(v);
                let y = (((Math.abs(z) - this.h) ** 2) / (2 * this.p)) * Math.sin(v);
                this.vertexList.push(x, y, z);
            }
        }

        // V-polylines generation
        for (let j = 0; j <= this.vSegments; j++) {
            let v = (j / this.vSegments) * vMax; // angle v
            for (let i = 0; i <= this.uSegments; i++) {
                let z = -this.h + (i / this.uSegments) * (2 * this.h); // change z from -h to h
                // Parabolic Humming-Top equation
                let x = (((Math.abs(z) - this.h) ** 2) / (2 * this.p)) * Math.cos(v);
                let y = (((Math.abs(z) - this.h) ** 2) / (2 * this.p)) * Math.sin(v);
                this.vertexList.push(x, y, z);
            }
        }
    }

    initBuffer(gl) {
        const vertices = this.getVertices();

        this.vertexBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        this.count = vertices.length / 3;
    }

    //This method is responsible for drawing the model using the previously initialized vertex buffer.
    draw(gl, shProgram) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

        gl.vertexAttribPointer(shProgram.vertexAttrib, 3, gl.FLOAT, false, 0, 0);

        gl.enableVertexAttribArray(shProgram.vertexAttrib);

        gl.drawArrays(gl.LINE_STRIP, 0, this.count);
    }

    setH(h) {
        h = parseFloat(h);
        if (h > 0) {
            this.h = h;
            this.generateVertices();
        }
    }

    setP(p) {
        p = parseFloat(p);
        if (p > 0) {
            this.p = p;
            this.generateVertices();
        }
    }

    setUSegmentsNumber(uSegments) {
        uSegments = parseFloat(uSegments);
        if (uSegments >= 0) {
            this.uSegments = uSegments;
            this.generateVertices();
        }
    }

    setVSegmentsNumber(vSegments) {
        vSegments = parseFloat(vSegments);
        if (vSegments >= 0) {
            this.vSegments = vSegments;
            this.generateVertices();
        }
    }

    getVertices() {
        return this.vertexList;
    }

    getP() {
        return this.p;
    }
    getH() {
        return this.h;
    }
    getUSegmentsNumber() {
        return this.uSegments;
    }
    getVSegmentsNumber() {
        return this.vSegments;
    }
}
