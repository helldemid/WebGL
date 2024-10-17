class SurfaceModel {
    constructor(name, p, h, uSegmentsNumber, vSegmentsNumber) {
        this.name = name;
        this.p = p;
        this.h = h;
        this.uSegmentsNumber = uSegmentsNumber;
        this.vSegmentsNumber = vSegmentsNumber;
        this.uSegments = [];
        this.vSegments = [];
        this.vertexList = [];
    }

    // A method for generating vertex data
    generateVertices() {
        this.vertexList = [];
        this.uSegments = [];
        this.vSegments = [];
        let vMax = 2 * Math.PI; // Maximum value of v (360 degrees)

        // U-polylines generation
        for (let i = 0; i < this.uSegmentsNumber; i++) {
            let z = -this.h + (i / this.uSegmentsNumber) * (2 * this.h); // change z from -h to h
            const uSegment = [];
            for (let j = 0; j <= this.vSegmentsNumber; j++) {
                let v = (j / this.vSegmentsNumber) * vMax; // angle v
                // Parabolic Humming-Top equation
                let x = (((Math.abs(z) - this.h) ** 2) / (2 * this.p)) * Math.cos(v);
                let y = (((Math.abs(z) - this.h) ** 2) / (2 * this.p)) * Math.sin(v);
                uSegment.push([x, y, z]);
                this.vertexList.push(x, y, z);
            }
            this.uSegments.push(uSegment);
        }

        // V-polylines generation
        for (let j = 0; j < this.vSegmentsNumber; j++) {
            let v = (j / this.vSegmentsNumber) * vMax; // angle v
            const vSegment = [];
            for (let i = 0; i <= this.uSegmentsNumber; i++) {
                let z = -this.h + (i / this.uSegmentsNumber) * (2 * this.h); // change z from -h to h
                // Parabolic Humming-Top equation
                let x = (((Math.abs(z) - this.h) ** 2) / (2 * this.p)) * Math.cos(v);
                let y = (((Math.abs(z) - this.h) ** 2) / (2 * this.p)) * Math.sin(v);
                vSegment.push([x, y, z]);
                this.vertexList.push(x, y, z);
            }
            this.vSegments.push(vSegment);
        }

    }

    initBuffer(gl) {
        const vertices = this.getVertices();

        this.vertexBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    }

    //This method is responsible for drawing the model using the previously initialized vertex buffer.
    draw(gl, shProgram) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

        gl.vertexAttribPointer(shProgram.vertexAttrib, 3, gl.FLOAT, false, 0, 0);

        gl.enableVertexAttribArray(shProgram.vertexAttrib);

        const USegmentVerticesNumber = this.vSegmentsNumber + 1;
        const VSegmentVerticesNumber = this.uSegmentsNumber + 1;
        const shiftToVLines = this.uSegments.length * USegmentVerticesNumber;

        // draw U-polylines
        for (let i = 0; i < this.uSegments.length; i++) {
            let shift = i * USegmentVerticesNumber;
            gl.drawArrays(gl.LINE_STRIP, shift, USegmentVerticesNumber);
        }

        // draw V-polylines
        for (let i = 0; i < this.vSegments.length; i++) {
            let shift = i * VSegmentVerticesNumber;
            gl.drawArrays(gl.LINE_STRIP, shiftToVLines + shift, VSegmentVerticesNumber);
        }
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

    setUSegmentsNumber(uSegmentsNumber) {
        uSegmentsNumber = parseInt(uSegmentsNumber);
        if (uSegmentsNumber >= 0) {
            this.uSegmentsNumber = uSegmentsNumber;
            this.generateVertices();
        }
    }

    setVSegmentsNumber(vSegmentsNumber) {
        vSegmentsNumber = parseInt(vSegmentsNumber);
        console.log(vSegmentsNumber)
        if (vSegmentsNumber >= 0) {
            this.vSegmentsNumber = vSegmentsNumber;
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
        return this.uSegmentsNumber;
    }
    getVSegmentsNumber() {
        return this.vSegmentsNumber;
    }
}
