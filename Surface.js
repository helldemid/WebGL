class SurfaceModel {
    constructor(p, h, uSegments, vSegments) {
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
