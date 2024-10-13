$(document).ready(function () {
    const minZoom = 2.0; // Minimum zoom (so as not to be too close)
    const maxZoom = 50.0; // Maximum zoom (so as not to be too far)

    $('#webglcanvas').on('wheel', function (event) {
        event.preventDefault(); // To prevent page scrolling

        // Changing the zoom depending on the direction of the mouse wheel
        if (event.originalEvent.deltaY < 0) {
            zoomLevel = Math.max(minZoom, zoomLevel - 0.5); // approaching, the limit is a minimum
        } else {
            zoomLevel = Math.min(maxZoom, zoomLevel + 0.5); // remove, the maximum limit
        }


        draw(); // update the render after changing the zoom
    });

    $('#p').val(surfaceModel.getP());
    $('#h').val(surfaceModel.getH());
    $('#uSegments').val(surfaceModel.getUSegmentsNumber());
    $('#vSegments').val(surfaceModel.getVSegmentsNumber());

    $('#p').on('change', function () {
        const newP = parseFloat($(this).val());

        newP <= 0 ? $(this).val(1) : surfaceModel.setP(newP);

        surface.BufferData(surfaceModel.getVertices());
        draw();

    });

    $('#h').on('change', function () {
        const newH = parseFloat($(this).val());

        newH <= 0 ? $(this).val(1) : surfaceModel.setH(newH);

        surface.BufferData(surfaceModel.getVertices());
        draw();
    });

    $('#uSegments').on('change', function () {
        const newUSegments = parseFloat($(this).val());

        newUSegments <= 0 ? $(this).val(1) : surfaceModel.setUSegmentsNumber(newUSegments);

        surface.BufferData(surfaceModel.getVertices());
        draw();
    });

    $('#vSegments').on('change', function () {
        const newVSegments = parseFloat($(this).val());

        newVSegments <= 0 ? $(this).val(1) : surfaceModel.setVSegmentsNumber(newVSegments);

        surface.BufferData(surfaceModel.getVertices());
        draw();
    });
});