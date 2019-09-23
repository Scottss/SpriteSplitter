"use strict";

$(function () {
    // const inputCvs = $("canvas#input")[0];
    // const previewCvs = $("canvas#preview")[0];

    // const inputCtx = inputCvs.getContext("2d");
    // const previewCtx = previewCvs.getContext("2d");

    const parseFile = function (file) {
        const fr = new FileReader();

        fr.readAsDataURL(file);

        fr.addEventListener("load", function () {
            const img = new Image();
            img.src = fr.result;
            // Maximum area: 268,435,456 pixels (e.g., 16,384 x 16,384)

            img.addEventListener("load", function () {
                // const $inputCvs = $("<canvas/>").appendTo("body").css("display", "none");
                // const inputCvs = $inputCvs[0];
                // inputCvs.width = img.width;
                // inputCvs.height = img.height;

                // inputCtx.drawImage(img, 0, 0);
                // console.log(img);

                // gridPiece = inputCtx.getImageData(left, top, width, height);

                // previewCtx.putImageData(gridPiece, 0, 0);

                // previewCtx.toDataURL();

                //Padding-left: 125px, Padding-top: 65px, padding-right:135 w +135
                //L2: 410px from top L3: 750px from top.
                //

                const spacing = [
                    125, 65,
                    185, 340
                ];

                let zip = new JSZip();
                let num = 1;
                for (let r = 0; r < 3; r++) {
                    for (let c = 0; c < 3; c++) {
                        $("body").append(
                            $("<br/>")
                        );
                        const $cvs = $("<canvas/>").appendTo("body");
                        const cvs = $cvs[0];
                        const ctx = cvs.getContext("2d");

                        cvs.width = spacing[2];
                        cvs.height = spacing[3];

                        ctx.drawImage(img,
                            spacing[0] + (c * (435 - spacing[0])), spacing[1] + (r * (410 - spacing[1])),   // Start at spacing[0] pixels from the left and spacing[1] from the top of the image (crop),
                            spacing[2], spacing[3],   // "Get" a `spacing[2] * spacing[3]` (w * h) area from the source image (crop),
                            0, 0,                     // Place the result at 0, 0 in the canvas,
                            spacing[2], spacing[3]    // With as width / height: * 1 (scale)
                        );
                        // console.log(previewCtx)

                        zip.file("img" + (num++) + ".png", cvs.toDataURL().split(/,/g)[1], {
                            base64: true
                        });
                    }
                }
                zip.generateAsync({ type: "base64" }).then(function (base64) {
                    $("body").append(
                        $("<a/>").html("Download").attr("download", "images.zip").attr("href", "data:application/zip;base64," + base64)
                    );
                });
            });
        });
    };

    function sleep(milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds) {
                break;
            }
        }
    }

    $(document).on("dragenter", function (e) {
        // change background
        $("body").css("background-color", "#999");
    }).on("dragleave", function (e) {
        // revert background
        $("body").css("background-color", "#222");
    }).on("dragover", function (e) {
        // keep changing background
        e.preventDefault();

        $("body").css("background-color", "#999");
    })

    document.addEventListener("drop", function (e) {
        e.preventDefault();

        $("body").css("background-color", "#222");

        const files = e.dataTransfer.files;

        for (let file of files) {
            parseFile(file);
        }
    });
});