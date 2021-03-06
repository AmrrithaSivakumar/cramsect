Genoverse.Plugins.tersectIntegration = function () {
    this.controls.push({
        icon: '<i class="fa fa-override"></i>',
        'class': 'gv-tersect-integration',
        name: 'Use Tersect Functionalities.',
        action: function (browser) {
            //adding libraries
            $('head').append('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/noty@3.2.0-beta/lib/noty.css">');
            $('head').append('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/noty@3.2.0-beta/lib/themes/light.css">');
            $('head').append('<script src="javascript/lib/d3.v5.min.js" charset="utf-8"></script>');
            $('head').append('<script src="https://cdn.jsdelivr.net/npm/noty@3.2.0-beta/lib/noty.min.js"></script>');
            $('head').append('<script src="javascript/lib/venn.js"></script>');
            // Resetting variables
            var tersectButton = this;
            var tersectIndexMenu = false;
            var tersectFileMenu = false;
            var indexGenerationMenu = false;
            var queryMenu = false;
            // If the control panel search button has already been clicked, it will close the search menu
            if ($(tersectButton).hasClass('gv-active')) {
                $('.gv-menu.gv-tersect-integration-menu .gv-close').trigger('click');
                $('.gv-menu.gv-tersect-integration-file-menu .gv-close').trigger('click');
                $(tersectButton).removeClass('gv-active');
            } else {
                // otherwise it will open the search menu
                var tersectMenu = $(this).data('tersectMenu');
                if (tersectMenu) {
                    tersectMenu.show();
                } else {
                    tersectMenu = makeTersectMenu().attr("id","tersectMenu");
                    $('#tsi-file').on('click', function () {
                        tersectIndexMenu = $(this).data("tersectIndexMenu");
                        console.log("index menu is worth:" + tersectIndexMenu);
                        if(tersectIndexMenu){
                            tersectIndexMenu.show();

                        } else {
                            tersectIndexMenu = makeTersectIndexMenu().attr("id","tersectIndexMenu");
                            //$('#tsi-locate-index',tersectIndexMenu).on('click',indexPopulator('/index/tersectUpload'));
                            $('#tsi-locate-index',tersectIndexMenu).on('click',function () {
                                tersectFileMenu = $(this).data("tersectFileMenu");
                                if(tersectFileMenu){
                                    tersectFileMenu.show();
                                } else {
                                    tersectFileMenu = makeTersectFileMenu().attr("id","tersectFileMenu");
                                    $('#tsi-locate-index',tersectIndexMenu).on('click',indexPopulator(".gv-tersect-index-list tbody","/index/tersectUpload"))

                                    $(this).data("tersectFileMenu",tersectFileMenu);
                                }
                            });
                            $('#generate-new-button',tersectIndexMenu).on('click',function () {
                                indexGenerationMenu = $(this).data("indexGenerationMenu");
                                if(indexGenerationMenu){
                                    indexGenerationMenu.show();
                                } else {
                                    indexGenerationMenu = makeIndexGenerationMenu().attr("id","indexGenerationMenu");

                                    $(this).data("indexGenerationMenu", indexGenerationMenu);
                                }
                            });

                            $(this).data("tersectIndexMenu",tersectIndexMenu);
                        }
                    });
                    $('#saved-queries').on('click', function () {
                        //$(".gv-tersect-integration-file-menu").remove();
                        //tersectFileMenu = makeTersectFileMenu();
                        if(queryMenu){
                            queryMenu.show();
                        } else {
                            queryMenu = makeQueryMenu();
                        }

                    });
                    $('#save-query').on('click', function () {
                        $("#save-status").removeClass("fa-arrow-circle-right");
                        $("#save-status").addClass("fa-spin fa-spinner");
                        setTimeout(function(){
                            $("#save-status").removeClass("fa-spin fa-spinner");
                            $("#save-status").addClass("fa-arrow-circle-right")
                        },3000)
                    });
                    $('.gv-close', tersectMenu).on('click', function () {
                        $(tersectButton).removeClass('gv-active');
                    });

                }
                $(tersectButton).addClass('gv-active');
                // Use off() to devalidate any handlers added by spamming the tersect button.
                $(this).data('tersectMenu', tersectMenu);
            }

            //makeMenu function declarations.
            function makeTersectMenu() {
                var tersectMenu = browser.makeMenu({
                    'Tersect: File Selection:': '',
                    '<span><a class="gv-tersect-integration-text gv-tersect-integration-input gv-tersect-integration-select-button" id="tsi-file">TSI File <i class="fa fa-arrow-circle-right"></i></a></span></br> \
                        <input type="text" id="searchBox" placeholder="Search for samples..."><span style="display:inline-block; width: 5px;"></span><button id="wildbutton" type="submit">Add Group</button> \
                        <label for="A">File set A</label><input type="radio" name="fileset" id="A" value="File A"><span style="display:inline-block; width: 5px;"></span><label for="B">File set B</label><input type="radio" name="fileset" id="B" value="File B"><span style="display:inline-block; width: 5px;"></span><label for="C">File set C</label></label><input type="radio" name="fileset" id="C" value="File C">\
                        <div id="gv-tersect-gui-container"><table id="genomeTable"></table></div> \
                        <div id="sampleCount"> <h4>Sample Count</h4> <span id="countA">A: </span> <span style="display:inline-block; width: 5px;"></span> <span id="countB">B: </span> <span style="display:inline-block; width: 5px;"></span> <span id="countC">C: </span> </div> <div id="setnotation"> <h4>Set notation:</h4> <p id="notation"></p> </div>\
                        <div id="venncontrols"> <button id="addCircle">Add Circle</button> <span style="display:inline-block; width: 20px;"></span> <input id="circleName" type="text" placeholder="Input name of circle..." /> <button id="removeCircle">Remove Circle</button> </div>\
                        <div><span class="gv-tersect-integration-span" id="clearFile"><a class="gv-tersect-integration-text ">Clear Files <i class="fa fa-arrow-circle-right"></i></a></span> <span class="gv-tersect-integration-span" id="clearOperations"><a class="gv-tersect-integration-text">Clear Operations <i class="fa fa-arrow-circle-right"></i></a></span></div> \
                        <div><span class="gv-tersect-integration-span" id="save-query"><a class="gv-tersect-integration-text ">Save Query <i id="save-status" class="fa fa-arrow-circle-right"></i></a></span> <span class="gv-tersect-integration-span" id="saved-queries"><a class="gv-tersect-integration-text">Saved Queries <i class="fa fa-arrow-circle-right"></i></a></span></div> \
                        <div><input type="text" id="filepath" />&nbsp;&nbsp;<span><a class="gv-tersect-integration-text" id="submit">Submit <i class="fa fa-arrow-circle-right"></i></a></span></div>\
                        <div id="tooltipdiv">\
                            <table id="sampleA" class="venntooltip">\
                                <tr>\
                                    <th><button id="hideA">&times;</button> Samples in A </th>\
                                </tr>\
                            <tr id="hereA"></tr>\
                            </table>\
                            <table id="sampleB" class="venntooltip">\
                                <tr>\
                                    <th><button id="hideB">&times;</button> Samples in B</th>\
                                </tr>\
                            <tr id="hereB"></tr>\
                            <table id="sampleC" class="venntooltip">\
                                <tr>\
                                    <th><button id="hideC">&times;</button> Samples in C</th>\
                                </tr>\
                            <tr id="hereC"></tr></table> </div>':'<div id="venn"></div>',

                }).addClass('gv-tersect-integration-menu');
                vennInit();

                return tersectMenu;
            }

            function makeTersectIndexMenu() {
                var indexMenu = browser.makeMenu({
                    '<div>Choose Tersect Index File:</div>':'',
                    '<table class="gv-tersect-integration-text gv-tersect-index-list"><thead><tr><td>Name</td><td>Instance</td><td>Local?</td><td>&emsp;&emsp;&emsp;</td></tr></thead><tbody></tbody></table>':'',
                    '<span class="gv-tersect-integration-span" id="tsi-locate-index"><a class="gv-tersect-integration-text">Locate TSI Index <i class="fa fa-arrow-circle-right"></i></a></span>':'',
                    '<span class="gv-tersect-integration-span" id="generate-new-button"><a class="gv-tersect-integration-text">Generate New Index <i class="fa fa-arrow-circle-right"></i></a></span>':''
                }).addClass('gv-tersect-integration-file-menu');
                return indexMenu;
            }

            function makeIndexGenerationMenu() {
                var generationMenu = browser.makeMenu({
                    '<div>Generate A New Tersect Index File:</div>':'',
                    '<div class="gv-tersect-dropzone"><a id="select-vcf">Select</a> Or Drop Files Here</div><input class="gv-tersect-integration-input gv-tersect-file-input" type="file" id="vcf-file-chooser" name="vcf file chooser" multiple>':'',
                    '':'',
                    '<span class="gv-tersect-integration-span" id="submit-new-button"><a class="gv-tersect-integration-text">Generate New Index <i class="fa fa-arrow-circle-right"></i></a></span>':''
                }).addClass('gv-tersect-integration-file-menu');
                vcfUploader(generationMenu,'#submit-new-button',"#vcf-file-chooser","#select-vcf","vcf","/index/vcfUpload")
                return generationMenu;
            }

            function makeTersectFileMenu() {
                var fileMenu = browser.makeMenu({
                    '<div>Choose Tersect Index Files:</div>':'',
                    '<div id="names" class="gv-tersect-integration-text">Local File Selection Here</div>':'<div class="gv-tersect-integration-text">Remote File Selection Here</div> <div class="gv-tersect-integration-text">(FTP etc.)</div>',
                    '<input class="gv-tersect-integration-input gv-tersect-file-input" type="file" id="local-file-chooser" name="local file chooser" multiple><div class="progressbar-border"> <div id="local-file-progress" class="progressbar-fill"></div></div>':'<input class="gv-tersect-integration-input" type="file" id="remote-file-chooser" name="remote file chooser" multiple>',
                    '<span id="tsi-submit-local" class="gv-tersect-integration-span"><a id="tsi-submit-local-text" class="gv-tersect-integration-text">Submit <i class="fa fa-arrow-circle-right"></i></a></span>':'<span class="gv-tersect-integration-span" id="tsi-submit-remote"><a class="gv-tersect-integration-text">Submit <i class="fa fa-arrow-circle-right"></i></a></span>',
                    '<span class="gv-tersect-integration-span" id="generate-new-button"><a class="gv-tersect-integration-text">Generate New Index <i class="fa fa-arrow-circle-right"></i></a></span>':''
                }).addClass('gv-tersect-integration-file-menu');
                $('#tsi-submit-local',fileMenu).on('click',function(){fileUploader(fileMenu,"#tsi-submit-local-text","#local-file-progress","#local-file-chooser","tsi", ".gv-tersect-index-list tbody","/index/tersectUpload/new")});
                return fileMenu;
            }


            function makeQueryMenu() {
                var geneMenu = browser.makeMenu({
                    '<div>Choose Query</div>':'',
                    '<div id="names" class="gv-tersect-integration-text">Demo</div><div>Query List Here</div>':'',
                }).addClass('gv-tersect-integration-file-menu');
                console.log("FileRunAgain");
                return geneMenu;
            }



        }});
};
function setScrollBar() {
    $('#pos').css({"height": "500px"});
    $('#names').css({"height": "500px"});
    $('#pos').css({"overflow-y": "scroll"});
    $('#names').css({"overflow-y": "hidden"});
    $('#pos').on('scroll', function () {
        $('#names').scrollTop($(this).scrollTop());
    });
}


function removeScrollBar() {
    $('#pos').css({"height": "auto"});
    $('#names').css({"height": "auto"});
    $('#pos').css({"overflow-y": "hidden"});
    $('#names').css({"overflow-y": "hidden"});
}


function fileUploader(parent,submit_link_text,progress_bar,chooser,extension,index_list,url) {
    $(chooser,parent).click();

    var flag = true;
    $(chooser).off().on('change', function() {
        var files = $(chooser,parent).get(0).files;

        if (files.length > 0) {
            $(submit_link_text,parent).text('Submit 0%');
            $(progress_bar,parent).width("0%");
            var formData = new FormData();
            formData.append("instanceName",$('h1')[0].childNodes[0].nodeValue);
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                // add the files to formData object for the data payload
                const name = file.name;
                const lastDot = name.lastIndexOf('.');

                const fileName = name.substring(0, lastDot);
                const ext = name.substring(lastDot + 1);

                if (ext !== extension) {
                    alert("file extension is wrong.")
                    flag = false;
                }
                formData.append('uploads[]', file, file.name);
            }
        }
        if (flag == true) {
            $.ajax({
                url: url,
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function (data) {
                    console.log('upload successful!\n' + Date.now());
                    indexPopulator(index_list,url);

                },
                xhr: function () {
                    // create an XMLHttpRequest
                    var xhr = new XMLHttpRequest();
                    // listen to the 'progress' event
                    xhr.upload.addEventListener('progress', function (evt) {
                        if (evt.lengthComputable) {
                            // calculate the percentage of upload completed
                            var percentComplete = evt.loaded / evt.total;
                            percentComplete = parseInt(percentComplete * 100);
                            //
                            $(submit_link_text,parent).text('Submit ' + percentComplete + '%');
                            $(progress_bar,parent).width(percentComplete+'%');
                            // once the upload reaches 100%, set the progress bar text to done
                            if (percentComplete === 100) {
                                $(submit_link_text,parent).text('Submission Complete');
                            }
                        }
                    }, false);
                    return xhr;
                },
                error: function (xhr, status, error) {
                    xhr.abort();
                    alert(xhr.responseText);
                }
            });
        }
        $(chooser).val("");
    });
}

function indexPopulator(index_list,url){
    console.log("event fired successfully!");
    $(index_list).empty();
    $.ajax({
        type: 'GET',
        url: url,
        success: function(data){
            console.log("latest value"+this);
            $.each(data, function(){
                $(index_list).append('<tr data-id="'+this._id+'"><td><a class="gv-tersect-index-name">'+this.name+'</a></td><td><span>'+this.instance+'</span></td><td><span>'+this.local+'</span></td><td><a class="gv-tersect-index-delete">delete</a></td></tr>');
            });


            $(index_list).parent().off().on('click','.gv-tersect-index-delete',function(){indexDeleter(index_list,$(this).parent().parent().data("id"),url)});
            $(index_list).parent().on('click','.gv-tersect-index-name',function(){indexGetter(index_list,$(this).parent().parent().data("id"),url)});
        },
        dataType: "json"
    });
}

function indexDeleter(index_list,deletion_id,url){
    console.log("delete event fired at: "+Date.now());
    $.ajax({
        type: 'DELETE',
        url: url + "/" + deletion_id,
        success: function(data){
            alert("Item Deleted!");
            indexPopulator(index_list,url);
        },
        error: function(err){
            console.error(err);
        }
    })
}

function vcfUploader(parent,submit_link,chooser,chooser_link,extension,url){
    var formData = new FormData();
    formData.append("instanceName", $('h1')[0].childNodes[0].nodeValue);

    $(document).data("vcfFormData",formData);
    console.log(JSON.stringify($(document).data("vcfFormData"),null,4));

    $(chooser_link,parent).on('click', function(){
        $(chooser,parent).click();
        $(chooser, parent).off().on('change', function() {
            var files = $(chooser, parent).get(0).files;

            if (files.length > 0) {
                handleFileUpload(parent,"vcfFormData",files,extension);
                if($(".gv-tersect-dropzone .statusbar",parent)[0] && !$(".remove",parent)[0]){
                    $("<a class='remove'>remove</a>").insertAfter($(".gv-tersect-dropzone",parent));
                    if(!$(".entryname",parent)[0]) {
                        $("<input type=text placeholder='Name New Index:' class='entryname'></input><br>").insertAfter($(".gv-tersect-dropzone", parent));
                    }
                    $(".remove", parent).on("click", function(){
                        $(".statusbar",parent).empty();
                        formData = new FormData();
                        $(document).data("vcfFormData",formData);
                        $(".entryname",parent).remove();
                        $(".remove", parent).remove();
                    })
                }
            }
            $(chooser,parent).val("");

        });
    });

    $(parent).on('dragenter', function (e) {
        e.stopPropagation();
        e.preventDefault();
        $(this).css('border', '2px solid #0B85A1');
    });
    $(parent).on('dragover', function (e) {
        e.stopPropagation();
        e.preventDefault();
    });
    $(parent).on('drop', function (e) {
        $(this).css('border', '2px dotted #0B85A1');
        e.preventDefault();
        var files = e.originalEvent.dataTransfer.files;

        //We need to send dropped files to Server
        handleFileUpload(parent,"vcfFormData",files,extension);
        if($(".gv-tersect-dropzone .statusbar",parent)[0] && !$(".remove",parent)[0]){
            $("<a class='remove'>remove</a>").insertAfter($(".gv-tersect-dropzone",parent));
            if(!$(".entryname",parent)[0]) {
                $("<br><input type=text character_set='ISO-8859-1' placeholder='Name New Index:' class='entryname'></input>").insertAfter($(".gv-tersect-dropzone", parent));
            }
            $(".remove", parent).on("click", function(){
                $(".statusbar",parent).empty();
                formData = new FormData();
                $(document).data("vcfFormData",formData);
                $(".entryname",parent).remove();
                $(".remove", parent).remove();
            })
        }
    });
    $(document).on('dragenter', function (e) {
        e.stopPropagation();
        e.preventDefault();
    });
    $(document).on('dragover', function (e) {
        e.stopPropagation();
        e.preventDefault();
        obj.css('border', '2px dotted #0B85A1');
    });
    $(document).on('drop', function (e) {
        e.stopPropagation();
        e.preventDefault();
    });

    $(submit_link).on('click', function(){
        var vcfFormData = $(document).data('vcfFormData');
        if ($(".statusbar", parent)[0]) {
            // if($("entryname",parent).val()) {
                var newName = $(".entryname",parent).val()
                newName = newName.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"")
            // }
            if(newName) {
                $('<div class="progressbar-border"> <div class="progressbar-fill"></div></div>').insertAfter($(submit_link,parent));

                vcfFormData.append('newName',newName);
                $.ajax({
                    url: url,
                    type: 'POST',
                    data: vcfFormData,
                    processData: false,
                    contentType: false,
                    success: function (data) {
                        console.log('vcf upload successful!\n' + Date.now());
                        $(".statusbar", parent).empty();
                        formData = new FormData();
                        $(document).data("vcfFormData", formData);
                        $(".progressbar-border", parent).remove();
                        $(".remove", parent).remove();

                    },
                    xhr: function () {
                        // create an XMLHttpRequest
                        var xhr = new XMLHttpRequest();
                        // listen to the 'progress' event
                        xhr.upload.addEventListener('progress', function (evt) {
                            if (evt.lengthComputable) {
                                // calculate the percentage of upload completed
                                var percentComplete = evt.loaded / evt.total;
                                percentComplete = parseInt(percentComplete * 100);
                                //
                                $("a", submit_link).text('Submit ' + percentComplete + '%');
                                $(".progressbar-fill", parent).width(percentComplete + '%');
                                // once the upload reaches 100%, set the progress bar text to done
                                if (percentComplete === 100) {
                                    $("a", submit_link).text('Submission Complete');
                                }
                            }
                        }, false);
                        return xhr;
                    },
                    error: function (xhr, status, error) {
                        xhr.abort();
                        alert(xhr.responseText);
                    }
                });
            }
        }
    });



}



function handleFileUpload(parent,form_data,files,extension){
    formData = $(document).data(form_data);

    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        if (!(file.name.endsWith("."+extension)||file.name.endsWith("."+extension+".gz"))) {
            alert("a file in that selection has the wrong extension");
            break;
        };
        formData.append('uploads[]', file, file.name);

        var status = new createStatusbar(parent); //Using this we can set progress.
        status.setFileNameSize(file.name,file.size);

    }

    $(this).data(form_data,formData);

}


function createStatusbar(parent) {

    this.statusbar = $("<div class='statusbar'></div>");
    this.filename = $("<span class='filename'></span>").appendTo(this.statusbar);
    this.size = $("<span class='filesize'></span>").appendTo(this.statusbar);
    $(".gv-tersect-dropzone",parent).append(this.statusbar);

    this.setFileNameSize = function(name,size) {
        var sizeStr="";
        var sizeKB = size/1024;
        if(parseInt(sizeKB) > 1024)
        {
            var sizeMB = sizeKB/1024;
            sizeStr = sizeMB.toFixed(2)+" MB";
        }
        else
        {
            sizeStr = sizeKB.toFixed(2)+" KB";
        }

        this.filename.html(name);
        this.size.html(sizeStr);
    };

}

function indexGetter(parent, idToGet, url){
    $.post(url+"/view", { "tsifile": idToGet }, function (data) {
        operations.idToGet = idToGet;
        let samples = data.samples;
        $('#genomeTable').append('<tr>');
        for (i = 0; i < samples.length; i++) {
            $('<td>' + samples[i] + '</td>').attr({ id: [i], class: 'samples' }).appendTo('#genomeTable').draggable({
                opacity: 0.5,
                helper: "clone",
                //make sure cursor is out of the way so that mouseover event for venn can fire properly
                cursorAt: { left: -2, top: -2 },
                // Register what we're dragging with the drop manager
                start: function (event) {
                    DragDropManager.dragged = event.target;
                },
                drag: function (event) {
                    var goodPos = DragDropManager.placement();
                    //change tooltip depending on location of cursor
                    div.style('cursor', function () {
                        return (goodPos) ? 'copy' : 'no-drop';
                    });
                    //if location is outside of venn or in intersect do not disable drag and return sample to table
                    $(event.target).draggable('option', 'revert', (goodPos) ? false : true);
                    $(event.target).draggable('option', 'disabled', (goodPos) ? true : false);
                },
                stop: function (event) {
                    var goodPos = DragDropManager.placement();
                    if (goodPos) {
                        new Noty({
                            type: 'success',
                            layout: 'topRight',
                            text: DragDropManager.dragged.innerText + ' has been dropped in: ' + DragDropManager.droppable,
                            timeout: '4000',
                            theme: 'light',
                        }).show();
                        DragDropManager.add();

                    } else {
                        new Noty({
                            type: 'warning',
                            layout: 'topRight',
                            text: DragDropManager.dragged.innerText + " cannot be dropped here!",
                            timeout: '5000',
                            theme: 'light',
                            closeWith: ['click'],
                        }).show();


                    }
                    div.style('cursor', 'pointer');

                }
            })

        };
        $('#genomeTable').append(`</tr>`);
        //case sensitive search for samples (only matches from the beginning of samples)
        $("#searchBox").off().on("keyup", function () {
            wildcardgroup = $(this).val();
            $("#genomeTable td").filter(function () {
                $(this).toggle($(this).text().indexOf(wildcardgroup) == 0)
            });
        });

    });
}

////////////////////////////////////////////////////////////////////////////////////////////
//
// Tersect GUI from this point onward. Not properly integrated into the program as of yet.
//
//
////////////////////////////////////////////////////////////////////////////////////////////

var area = [];
var filesetA = [];
var filesetB = [];
var filesetC = [];
var wildcardgroup;
var operand;
var reverse;
var wildcardID = [];
var operations = {};
var int = [];
var command;
var sampleCountA = 0;
var sampleCountB = 0;
var sampleCountC = 0;
const circles = ['A', 'B', 'C'];
var groupNum;
var change;

var chart;
var div;

var tooltipA;
var tooltipB;
var tooltipC;

//returns array of circles displayed


//sets for making venn diagram
var sets = [{ sets: ['A'], size: 12 }];

//hide radiobuttons and labels and counts
$("label[for=B], #B, #countB, label[for=C], #C, #countC").hide();


/**allows mouseover event to fire during drag and drop and not after
 * also adds sample being dragged to its respective tooltip and fileset array */
var DragDropManager = {
    dragged: null,
    droppable: null,
    placement: function () {
        if (this.droppable == null || this.droppable.length > 1) return false;
        return true;
    },
    add: function () {
        if (this.droppable[0] == 'A') {
            $('#hereA').append(`<td id="table${this.dragged.id}">${this.dragged.innerText}<button class="tableButton" id="A${this.dragged.id}">&times;</button></td>`);
            filesetA.push(`'` + this.dragged.innerText + `'`);
            sampleCountA++;
            $("#countA").text("A: " + sampleCountA);

        } else if (this.droppable[0] == 'B') {
                $('#hereB').append(`<td id="table${this.dragged.id}">${this.dragged.innerText}<button class="tableButton" id="B${this.dragged.id}">&times;</button></td>`);
                filesetB.push(`'` + this.dragged.innerText + `'`);
                sampleCountB++;
                $("#countB").text("B: " + sampleCountB);
        } else if (this.droppable[0] == 'C') {
                $('#hereC').append(`<td id="table${this.dragged.id}">${this.dragged.innerText}<button class="tableButton" id="C${this.dragged.id}">&times;</button></td>`);
                filesetC.push(`'` + this.dragged.innerText + `'`);
                sampleCountC++;
                $("#countC").text("C: " + sampleCountC);
        }

    }
};

function vennInit(){
    $("#countA").text("A: " + sampleCountA);
    $("#countB").text("B: " + sampleCountB);
    $("#countC").text("C: " + sampleCountC);

    chart = venn.VennDiagram();
    div = d3.select("#venn");

    //sets for making venn diagram
    sets = [{ sets: ['A'], size: 12 }];
    //draw venn
    div.datum(sets).call(chart
        .width(300)
        .height(300)
    );
    //customise venn diagram
    customiseVenn();

    //make tooltips for files
    tooltipA = d3.select("#sampleA");
    tooltipB = d3.select("#sampleB");
    tooltipC = d3.select("#sampleC");

    $('#addCircle').click(function () {
        if (newCircles().length != 0) {

            var newCircle = newCircles()[0];
            var setLength = sets.length;

            //could change to for each
            for (i = 0; i < setLength; i++) {
                var intersectSize = sets[i].size / 3;
                var newSet = [...sets[i].sets]
                newSet.push(newCircle);
                var newFullSet = { sets: newSet, size: intersectSize }
                sets.push(newFullSet);
            }
            sets.push({ sets: [newCircle], size: 12 });
            var disp = circlesDisplayed();
            disp.forEach(elem => $("label[for=" + elem + "], #" + elem + ", #count" + elem).show());
            redraw();
        } else {
            alert(`No more circles can be added!`)
        }
    });
    $('#removeCircle').click(function () {
        var delCircle = $("#circleName").val().toUpperCase();
        var currentCircles = circlesDisplayed();
        if (currentCircles.length >= 2) {

            if (currentCircles.find(circle => circle == delCircle)) {

                //could change to for each
                for (i = 0; i < sets.length; i++) {
                    if (sets[i].sets.find(set => set == delCircle)) {
                        sets.splice(i, 1);
                        i--;

                    }

                }
                $("label[for=" + delCircle + "], #" + delCircle + ", #count" + delCircle).hide();
                redraw();
            } else {
                alert(`Circle ${$("#circleName").val().toUpperCase()} does not exist!`)
            }
        } else {
            alert('Cannot remove all circles!');
        }
        $("#circleName").val("");
    });

    //action listeners for venn
    div.selectAll('g')
        .on('mouseover', function (d, i) {
            DragDropManager.droppable = d.sets;
        })

        .on('mouseout', function (d, i) {
            DragDropManager.droppable = null;

        })

        .on('contextmenu', function (d, i) {
            d3.event.preventDefault();
            $('#sampleA').show();
            tooltipA.transition().duration(400).style("opacity", .9);
            tooltipA.style("left", d3.event.pageX + "px")
                .style("top", d3.event.pageY + "px");

        })

        .on('click', function (d, i) {
            d3.select(this).select("text").style("font-weight", "100")
                .style("font-size", "36px");
            getNotation();
            area.push(d.sets);
        });

    $('#wildbutton').click(function () {
        if (wildcardgroup !== undefined) {
            var group = wildcardgroup + '*';
            if ($("fileset").prop("checked", true)) {
                var radButton = $('input[name=fileset]:checked').val();
                if (radButton == 'File A') {
                    addSample(group, filesetA)
                    //add number of samples to count
                    sampleCountA = sampleCountA + groupNum;
                    $("#countA").text("A: " + sampleCountA);
                }
                else if (radButton == 'File B') {
                    addSample(group, filesetB);
                    //add number of samples to count
                    sampleCountB = sampleCountB + groupNum;
                    $("#countB").text("B: " + sampleCountB);
                }
                else if (radButton == 'File C') {
                    addSample(group, filesetC);
                    //add number of samples to count
                    sampleCountC = sampleCountC + groupNum;
                    $("#countC").text("C: " + sampleCountC);
                }

            } else {
                alert("Please select a radio button!");
            }

        }
    });

//remove sample if close button is clicked in tooltip
    $("#tooltipdiv").on('click', '.tableButton', function () {
        var ID = (this.id).substr(1);
        var tableID = `[id="table${ID}"]`;
        //remove from filesets
        var samp = $(tableID).text().slice(0, -1);
        filesetA = filesetA.filter(item => !item.includes(samp));
        filesetB = filesetB.filter(item => !item.includes(samp));
        filesetC = filesetC.filter(item => !item.includes(samp));
        //remove from table
        $(tableID).remove();

        if (ID.includes(',')) {

            var arrID = ID.split(',');
            for (i = 0; i < arrID.length; i++) {
                //make sample draggable
                $('#' + arrID[i]).draggable('option', 'disabled', false);
            }
            //decrement count
            if (this.id.charAt(0) == "A") {
                sampleCountA = sampleCountA - this.name;
                $("#countA").text("A: " + sampleCountA);
            } else if (this.id.charAt(0) == "B") {
                sampleCountB = sampleCountB - this.name;
                $("#countB").text("B: " + sampleCountB);
            } else {
                sampleCountC = sampleCountC - this.name;
                $("#countC").text("C: " + sampleCountC);
            }
        } else {
            //make sample draggable
            $('#' + ID).draggable('option', 'disabled', false);
            //decrement count
            if (this.id.charAt(0) == "A") {
                sampleCountA--;
                $("#countA").text("A: " + sampleCountA);
            } else if (this.id.charAt(0) == "B") {
                sampleCountB--;
                $("#countB").text("B: " + sampleCountB);
            } else {
                sampleCountC--;
                $("#countC").text("C: " + sampleCountC);
            }
        }
    });

    $("#tooltipdiv").on('click', '#hideA', function () {
        $('#sampleA').hide();
    });
    $("#tooltipdiv").on('click', '#hideB', function () {
        $('#sampleB').hide();
    });
    $("#tooltipdiv").on('click', '#hideC', function () {
        $('#sampleC').hide();
    });


    $('#clearFile').click(function () {
        filesetA = [];
        filesetB = [];
        filesetC = [];
        $('#genomeTable td').draggable('option', 'disabled', false);
        $('.venntooltip td').remove();

    });

    $('#clearOperations').click(resetVenn);


    $("#submit").click(function () {
        var files = circlesDisplayed();
        alert(typeof files);
        function hasSamples() {
            for(var x=0; x<files.length;x++){
                if(files[x]=="A"){
                    return filesetA.length;
                } else if(files[x]=="B"){
                    return filesetB.length;
                } else if(files[x]=="C"){
                    return filesetC.length;
                }
            }
        }

        alert(hasSamples())
        getNotation();
        //alert("command:" +command+"filepath: "+$("#filepath").val()+"hassamples: "+ hasSamples2(files));

        if (command && $("#filepath").val() && hasSamples()) {



            operations.setA = JSON.stringify(filesetA);
            operations.setB = JSON.stringify(filesetB);
            operations.setC = JSON.stringify(filesetC);

            operations.command = command;
            //check file name ends with vcf
            if ($("#filepath").val().endsWith(".vcf")) {
                operations.filepath = $("#filepath").val();
            } else {
                operations.filepath = $("#filepath").val() + ".vcf";
            }



            $.post("/index/generate", operations, function (data) {
                var loc = data.location;


                new Noty({
                    type: 'success',
                    layout: 'center',
                    text: " Virtual Genome VCF file downloaded to: " + loc,
                    //timeout: '5000',
                    theme: 'light',
                    closeWith: ['button'],
                }).show();

                //resetVenn();
                //filesetA = [];
                //filesetB = [];
                $('#genomeTable td').draggable('option', 'disabled', false);
                $('.venntooltip td').remove();
                $("#filepath").val("")

            });
            //if conditions were not fulfiled, display warnings
        } else {
            if (!command) {
                new Noty({
                    type: 'error',
                    layout: 'center',
                    text: "Please select an area of the Venn Diagram!",
                    theme: 'light',
                    closeWith: ['button'],
                }).show();
            }
            if (!$("#filepath").val()) {
                new Noty({
                    type: 'error',
                    layout: 'center',
                    text: "Please give a file name for VCF download!",
                    theme: 'light',
                    closeWith: ['button'],
                }).show();
            }
            if (!hasSamples()) {

                files.forEach(function (elem) {
                    if (elem == "A") {
                        if (filesetA.length == 0) {
                            new Noty({
                                type: 'error',
                                layout: 'center',
                                text: "Please add samples to circle A!",
                                theme: 'light',
                                closeWith: ['button'],
                            }).show();
                        }
                    } else if (elem == "B") {
                        if (filesetB.length == 0) {
                            new Noty({
                                type: 'error',
                                layout: 'center',
                                text: "Please add samples to circle B!",
                                theme: 'light',
                                closeWith: ['button'],
                            }).show();
                        }
                    } else if (elem == "C") {
                        if (filesetC.length == 0) {
                            new Noty({
                                type: 'error',
                                layout: 'center',
                                text: "Please add samples to circle C!",
                                theme: 'light',
                                closeWith: ['button'],
                            }).show();
                        }
                    }
                })
            }
            {

            }

        }

        //resetVenn();
        //operations={};
        //filesetA = [];
        //filesetB = [];
        $('#genomeTable td').draggable('option', 'disabled', false);
        $('.venntooltip td').remove();
        $("#filepath").val("")
    });
};
//resets venn to original appearance
function resetVenn() {
    area = [];

    customiseVenn()
}


//function to add sample group to fileset array and tooltip
function addSample(input, fset) {
    fset.push(`'` + input + `'`);
    var set;
    if (fset == filesetA) {
        set = 'A';
    } else if (fset == filesetB) {
        set = 'B';
    } else {
        set = 'C';
    }
    new Noty({
        type: 'success',
        layout: 'topRight',
        text: input + ' has been added to: ' + set,
        timeout: '4000',
        theme: 'light',
    }).show();

    $("#genomeTable td").filter(function () {
        if ($(this).text().indexOf(wildcardgroup) == 0) {
            //disable drag on matching samples
            $(this).draggable('option', 'disabled', true);
            wildcardID.push(this.id);

        }
    });
    //number of samples in wildcard
    groupNum = $('#genomeTable td:visible').length;
    $('#here' + set).append(`<td id="table${wildcardID}">${input}<button class="tableButton" name="${groupNum}"  id="${set + wildcardID}">&times;</button></td>`);
    wildcardID = [];

}


function unionAB(elem) {
    if (elem.length == 1 && elem[0] == 'A') return true;
    return false;
}

function hasSamples2(collection) {
    collection.forEach(function (elem) {
        if (elem == "A") {
            return filesetA;
        } else if (elem == "B") {
            return filesetB;
        } else if (elem == "C") {
            return filesetC;
        }
    });
}

function customiseVenn(){
    var colours = ["#D81B60", "#1E88E5", "#FFC107"];
    d3.selectAll("#venn .venn-circle path")
        .style("fill", function (d, i) { return colours[i]; })
        .style("fill-opacity", .7)
        .style("stroke", "none");

    d3.selectAll("#venn .venn-intersection path")
        .style("stroke", "#004D40")
        .style("stroke-width", 0);

    d3.select("[data-venn-sets=A_B_C]").select("path")
        .style("stroke", "");

    d3.selectAll("#venn .venn-circle text")
        .style("fill", "#fff")
        .style("font-size", "24")
        .style("font-weight", "200");
    getNotation();

}

//returns array of circles not displayed
function newCircles() {
    var newCircles = [...circles];
    var currentCircles = circlesDisplayed();
    currentCircles.forEach(function (elem) {
        newCircles = newCircles.filter(circ => circ != elem)
    });
    return newCircles;
}

function circlesDisplayed() {
    var displayed = [];
    sets.forEach(function (elem) {
        if (elem.sets.length == 1) {
            displayed.push(elem.sets);

        }
    });
    return displayed;
}

//draws venn again
function redraw() {
    var div = d3.select("#venn");
    if (circlesDisplayed().length > 1) {
        div.datum(sets).call(chart
            .width(550)
            .height(550)
        );
    } else {
        div.datum(sets).call(chart
            .width(400)
            .height(400)
        );
    }

    resetVenn();

    div.selectAll('g')
        .on('mouseover', function (d, i) {
            venn.sortAreas(div, d);

            if (d.sets.length > 1 && !area.some(elem => elem.join().includes(d.sets) && elem.length == d.sets.length)) {
                d3.select(this).select("path")
                    .style("fill", "#004D40")
                    .style("fill-opacity", 1);

            } else if (!area.includes(d.sets)) {
                d3.select(this).select("text")
                    .style("font-size", "36px");

                d3.selectAll(".venn-intersection").each(function (d, i) {
                    var sel = d3.select(this).attr("data-venn-sets");
                    var selArray = sel.replace(/_/g, ",").split(",");

                    if (!area.some(elem => elem.join().includes(selArray) && elem.length == selArray.length)) {
                        var item = "[data-venn-sets=" + sel + "]"
                        int.push(item);
                    }
                })
                if (int.length < 3) {
                    int.filter(elem => !elem.length == 3);
                }
                change = int.filter(elem => elem.includes(d.sets));
                change.forEach(function (elem) {
                    d3.select(elem).select("path")
                        .style("fill-opacity", .9)
                        .style("fill", "#fff")
                });

            }
            DragDropManager.droppable = d.sets;
        })

        // Clear the target from the DragDropManager on mouseOut.
        .on('mouseout', function (d, i) {
            DragDropManager.droppable = null;
            if (d.sets.length > 1 && !area.some(elem => elem.join().includes(d.sets) && elem.length == d.sets.length)) {
                d3.select(this).select("path")
                    .style("fill-opacity", 0);

            } else if (!area.includes(d.sets)) {
                d3.select(this).select("text")
                    .style("font-size", "24px");

                change.forEach(function (elem) {
                    d3.select(elem).select("path")
                        .style("fill-opacity", 0)

                    int = [];
                    change = [];
                })
            }

        })

        .on('contextmenu', function (d, i) {
            d3.event.preventDefault();
            if (d.sets.length == 1) {
                if (d.sets[0] == 'A') {
                    $('#sampleA').show();
                    tooltipA.transition().duration(400).style("opacity", .9);
                    tooltipA.style("left", d3.event.pageX + "px")
                        .style("top", d3.event.pageY + "px");
                } else if (d.sets[0] == 'B') {
                    $('#sampleB').show();
                    tooltipB.transition().duration(400).style("opacity", .9);
                    tooltipB.style("left", d3.event.pageX + "px")
                        .style("top", d3.event.pageY + "px");
                } else if (d.sets[0] == 'C') {
                    $('#sampleC').show();
                    tooltipC.transition().duration(400).style("opacity", .9);
                    tooltipC.style("left", d3.event.pageX + "px")
                        .style("top", d3.event.pageY + "px");
                }
            }
        })

        .on('click', function (d, i) {

            var selection = d3.select(this);


            if (!area.includes(d.sets)) {
                area.push(d.sets);

                //to remove middle if intersect is already selected
                if ((area.some(elem => elem.length == 2) && d.sets.length == 3)) {

                    d3.select(this).select("path")
                        .style("fill", "#fff")
                        .style("fill-opacity", 1)
                    //remove middle if intersect is selected
                } else if (area.some(elem => elem.length == 3) && d.sets.length == 2) {

                    d3.select("[data-venn-sets=A_B_C]").select("path")
                        .style("fill", "#fff")
                        .style("fill-opacity", 1)
                } else {
                    selection.select("text")
                        .style("fill", "#004D40")
                        .style("font-size", "46px");
                    //remove highlight from intersects
                    if (d.sets.length == 1) {
                        change.forEach(function (elem) {
                            d3.select(elem).select("path")
                                .style("fill-opacity", 0)
                        });
                    }
                }
            } else {

                //remove set from array if clicked again
                area = area.filter(function (elem) {
                    if (elem.length == d.sets.length) {
                        return !elem.join().includes(d.sets);
                    } else {
                        return elem;
                    }
                });
                //remove highlight from centre intersect if other intersect is deselected
                if (area.some(elem => elem.length == 3) && !area.some(elem => elem.length == 2)) {
                    d3.select("[data-venn-sets=A_B_C]").select("path")
                        .style("fill", "#004D40")
                }
                //restore colour and font size
                selection.select("path")
                    .style("fill-opacity", d.sets.length == 1 ? .7 : 0)
                selection.select("text")
                    .style("fill", "#fff")
                    .style("font-size", "24px");
                var setName = d.sets.toString().replace(/,/g, " &cap; ");
                new Noty({
                    type: 'success',
                    layout: 'topRight',
                    text: setName + ' has been deselected. ',
                    timeout: '2000',
                    theme: 'light',
                }).show();

            }
            getNotation();
        });

}

function getNotation() {
    var circleD = circlesDisplayed();
    var areaL = area.length;
    switch (circleD.length) {
        case 0:
            $('#notation').html("&empty;");
            command = null;
            break;
        case 1:
            //single circle
            $('#notation').html(circleD[0][0]);
            command = circleD[0][0];
            break;
        case 2:
            //2 set circle
            switch (areaL) {
                case 0:
                    $('#notation').html("&empty;");
                    command = null;
                    break;
                case 1:
                    switch (area[0].length) {
                        case 1:
                            var other = circleD.filter(elem => elem !== area[0]);
                            $('#notation').html(area[0] + " &minus; " + other[0]);
                            command = area[0][0] + "\\" + other[0];
                            break;
                        case 2:
                            $("#notation").html(area[0][0] + " &cap; " + area[0][1]);
                            command = area[0][0] + " & " + area[0][1];
                            break;
                    }
                    break;
                case 2:
                    switch (area.every(elem => elem.length == 1)) {
                        case true:
                            $("#notation").html(area[0][0] + " &#8710; " + area[1][0]);
                            command = area[0][0] + " ^ " + area[1][0];
                            break;
                        case false:
                            var single = area.filter(elem => elem.length == 1);
                            $("#notation").html(single[0][0]);
                            command = single[0][0];
                            break;
                    }
                    break;
                case 3:
                    var single = area.filter(elem => elem.length == 1);
                    $("#notation").html(single[0][0] + " &cup; " + single[1][0]);
                    command = single[0][0] + " | " + single[1][0];
                    break;
            }
            break;
        case 3:
            //3 set circle
            var intersect = [['A', 'B'], ['A', 'C'], ['B', 'C']];
            switch (areaL) {
                case 0:
                    $('#notation').html("&empty;");
                    command = null;
                    break;
                case 1:
                    switch (area[0].length) {
                        case 1:
                            var other = circleD.filter(elem => elem !== area[0]);
                            $('#notation').html(area[0] + " &minus; " + other[0] + " &minus; " + other[1]);
                            command = area[0][0] + " \\ " + other[0] + " \\ " + other[1]
                            break;
                        case 2:
                            $('#notation').html(area[0][0] + " &cap; " + area[0][1]);
                            command = area[0][0] + " & " + area[0][1];
                            break;
                        case 3:
                            $('#notation').html(circleD[0] + " &cap; " + circleD[1] + " &cap; " + circleD[2]);
                            command = circleD[0] + " & " + circleD[1] + " & " + circleD[2];
                            break;
                    }
                    break;
                case 2:
                    switch (area.every(elem => elem.length == 1)) {
                        case true:
                            //W2
                            var other = circleD.filter(elem => !area.join().includes(elem));
                            $('#notation').html("(" + area[0] + " &#8710; " + area[1] + ") &minus; " + other[0]);
                            command = "(" + area[0][0] + " ^ " + area[1][0] + ") \\ " + other[0];
                            break;
                        case false:
                            switch (area.every(elem => elem.length == 1 || elem.length == 3)) {
                                case true:
                                    //WY
                                    var single = area.filter(elem => elem.length == 1);
                                    var other = circleD.filter(elem => !single.join().includes(elem));
                                    $('#notation').html("(" + single[0] + " &minus; " + other[0] + " &minus; " + other[1] + ") &cup; ("
                                        + circleD[0] + " & " + circleD[1] + " & " + circleD[2] + ")");
                                    command = "(" + single[0][0] + " \\ " + other[0] + " \\ " + other[1] + ") | ("
                                        + circleD[0] + " & " + circleD[1] + " & " + circleD[2] + ")";
                                    break;
                                case false:
                                    switch (area.every(elem => elem.length == 2)) {
                                        case true:
                                            //X2
                                            var common = area[0].filter(elem => area[1].includes(elem));
                                            var other = circleD.filter(elem => !common.includes(elem));
                                            $('#notation').html("(" + other[0] + " &cup; " + other[1] + ") &cap; " + common[0]);
                                            command = "(" + other[0] + " | " + other[1] + ") & " + common[0][0];
                                            break;
                                        case false:
                                            switch (area.every(elem => elem.length == 2 || elem.length == 3)) {
                                                case true:
                                                    //Z
                                                    var int = area.filter(elem => elem.length == 2);
                                                    var uns = circleD.filter(elem => !int.join().includes(elem));
                                                    $('#notation').html("(" + int[0][0] + " &cap; " + int[0][1] + ") &minus; " + uns[0]);
                                                    command = "(" + int[0][0] + " & " + int[0][1] + ") \\ " + uns[0];
                                                    break;
                                                case false:
                                                    //WX
                                                    var single = area.filter(elem => elem.length == 1);
                                                    var double = area.filter(elem => elem.length == 2);
                                                    switch (double.join().includes(single)) {
                                                        case true:
                                                            var uns = circleD.filter(elem => !double.join().includes(elem));
                                                            $('#notation').html("(" + single[0] + " &minus; " + uns[0] + ") &cup; (" + double[0][0] + " &cap; " + double[0][1] + ")");
                                                            command = "(" + single[0][0] + " \\ " + uns[0] + ") | (" + double[0][0] + " & " + double[0][1] + ")";
                                                            break;
                                                        case false:
                                                            $('#notation').html("(" + single[0] + " &minus; " + double[0][0] + " &minus; " + double[0][1] + ") &cup; (" + double[0][0] + " &cap; " + double[0][1] + ")");
                                                            command = "(" + single[0][0] + " \\ " + double[0][0] + " \\ " + double[0][1] + ") | (" + double[0][0] + " & " + double[0][1] + ")";
                                                            break;
                                                    }
                                                    break;
                                            }
                                            break;
                                    }
                                    break;
                            }
                            break;
                    }
                    break;
                case 3:
                    switch (area.every(elem => elem.length == 1)) {
                        case true:
                            //W3
                            $('#notation').html(area[0] + " &#8710; " + area[1] + " &#8710; " + area[2]);
                            command = area[0][0] + " ^ " + area[1][0] + " ^ " + area[2][0];
                            break;
                        case false:
                            switch (area.every(elem => elem.length == 2)) {
                                case true:
                                    //X3
                                    $('#notation').html("(" + area[0][0] + " &cap; " + area[0][1] + ") &cup; (" + area[1][0] + " &cap; " + area[1][1] + ") &cup; ("
                                        + area[2][0] + " &cap; " + area[2][1] + ")");
                                    command = "(" + area[0][0] + " & " + area[0][1] + ") | (" + area[1][0] + " & " + area[1][1] + ") | ("
                                        + area[2][0] + " & " + area[2][1] + ")";
                                    break;
                                case false:
                                    switch (area.every(elem => elem.length == 1 || elem.length == 3)) {
                                        case true:
                                            //W2Y
                                            var single = area.filter(elem => elem.length == 1);
                                            var other = circleD.filter(elem => !single.join().includes(elem));
                                            $('#notation').html("( (" + single[0][0] + " &#8710; " + single[1][0] + ") &minus; " + other[0]
                                                + " ) &cup; (" + circleD[0] + " &cap; " + circleD[1] + " &cap; " + circleD[2] + ")");
                                            command = "( (" + single[0][0] + " ^ " + single[1][0] + ") \\ " + other[0]
                                                + " ) | (" + circleD[0] + " & " + circleD[1] + " & " + circleD[2] + ")";
                                            break;
                                        case false:
                                            switch (area.every(elem => elem.length == 2 || elem.length == 3)) {
                                                case true:
                                                    //Z2
                                                    var double = area.filter(elem => elem.length == 2);
                                                    $('#notation').html("(" + double[0][0] + " &cap; " + double[0][1] + ") &#8710; (" + double[1][0] +
                                                        " &cap; " + double[1][1] + ")");
                                                    command = "(" + double[0][0] + " & " + double[0][1] + ") ^ (" + double[1][0] +
                                                        " & " + double[1][1] + ")";
                                                    break;
                                                case false:
                                                    switch (area.filter(elem => elem.length == 1).length) {
                                                        case 1:
                                                            switch (area.some(elem => elem.length == 3)) {
                                                                case true:
                                                                    //WZ
                                                                    var single = area.filter(elem => elem.length == 1);
                                                                    var double = area.filter(elem => elem.length == 2);
                                                                    switch (double.join().includes(single)) {

                                                                        case true:
                                                                            var uns = circleD.filter(elem => !double.join().includes(elem));
                                                                            $('#notation').html(single[0] + " &minus; " + uns[0]);
                                                                            command = single[0][0] + " \\ " + uns[0]
                                                                            break;
                                                                        case false:
                                                                            $('#notation').html("(" + single[0] + " &minus; " + double[0][0] + " &minus; " + double[0][1] +
                                                                                ") &cup; ( (" + double[0][0] + " &cap; " + double[0][1] + ") &minus; " + single[0] + ")");
                                                                            command = "(" + single[0][0] + " \\ " + double[0][0] + " \\ " + double[0][1] +
                                                                                ") | ( (" + double[0][0] + " & " + double[0][1] + ") \\ " + single[0][0] + ")";
                                                                            break;

                                                                    }
                                                                    break;
                                                                case false:
                                                                    //WX2
                                                                    var singles = area.filter(elem => elem.length == 1);
                                                                    var doubles = area.filter(elem => elem.length == 2);
                                                                    switch (doubles.every(elem => elem.join().includes(singles))) {
                                                                        case true:
                                                                            $('#notation').html(singles[0]);
                                                                            command = singles[0][0];
                                                                            //console.log(command);
                                                                            break;
                                                                        case false:
                                                                            var unq = doubles.filter(elem => !elem.join().includes(singles));
                                                                            var non = doubles.filter(elem => elem.join().includes(singles));
                                                                            var uni = circleD.filter(elem => !non.join().includes(elem));
                                                                            $('#notation').html("(" + singles[0] + " &minus; " + uni[0] + ") &cup; (" +
                                                                                unq[0][0] + " &cap; " + unq[0][1] + ")");
                                                                            command = "(" + singles[0][0] + " \\ " + uni[0] + ") | (" +
                                                                                unq[0][0] + " & " + unq[0][1] + ")"
                                                                            break;
                                                                    }

                                                                    break;
                                                            }
                                                            break;
                                                        case 2:
                                                            //W2X
                                                            var single2 = area.filter(elem => elem.length == 1);
                                                            var uns = circleD.filter(elem => !single2.join().includes(elem));
                                                            var double2 = area.filter(elem => elem.length == 2);
                                                            $('#notation').html("( (" + single2[0] + " &#8710; " + single2[1] + ") &minus; " +
                                                                uns[0] + ") &cup; (" + double2[0][0] + " &cap; " + double2[0][1] + ")");
                                                            command = "( (" + single2[0][0] + " ^ " + single2[1][0] + ") \\" +
                                                                uns[0] + ") | (" + double2[0][0] + " & " + double2[0][1] + ")";
                                                            break;

                                                    }
                                            }
                                            break;
                                    }
                                    break;
                            }
                            break;
                    }
                    break;
                case 4:
                    switch (area.some(elem => elem.length == 2)) {
                        case true:
                            var double = area.filter(elem => elem.length == 2);
                            var single = area.filter(elem => elem.length == 1);
                            switch (area.some(elem => elem.length == 3)) {
                                case true:
                                    switch (double.length) {
                                        case 1:
                                            //W2Z

                                            var uns = circleD.filter(elem => !single.join().includes(elem));
                                            switch (single.every(elem => double.join().includes(elem))) {
                                                case true:


                                                    $('#notation').html("(" + single[0] + " &cup; " + single[1] + ") &minus; " + uns[0]);
                                                    command = "(" + single[0][0] + " | " + single[1][0] + ") \\ " + uns[0];

                                                    break;
                                                case false:
                                                    var s1 = single.filter(elem => double.join().includes(elem));
                                                    var s2 = single.filter(elem => !double.join().includes(elem));
                                                    $('#notation').html(s1[0] + " &#8710; (" + s2[0] + " &minus; " + uns[0] + ")");
                                                    command = s1[0][0] + " ^ (" + s2[0][0] + " \\ " + uns[0] + ")"
                                                    break;
                                            }

                                            break;
                                        case 2:
                                            //WZ2
                                            switch (double.every(elem => elem.join().includes(single[0]))) {
                                                case true:
                                                    $('#notation').html(single[0] + " &minus; (" + circleD[0] + " &cap; " + circleD[1] + " &cap; " + circleD[2] + ")");
                                                    command = single[0][0] + " \\ (" + circleD[0] + " & " + circleD[1] + " & " + circleD[2] + ")";
                                                    break;
                                                case false:
                                                    var unec = double.filter(elem => !elem.join().includes(single));
                                                    var other = intersect.filter(elem => !double.join().includes(elem));
                                                    $('#notation').html("(" + single[0] + " &cup; (" + unec[0][0] + " &cap; " + unec[0][1] + ")  ) &minus; (" + other[0][0] + " &cap; " + other[0][1] + ")");
                                                    command = "(" + single[0][0] + " | (" + unec[0][0] + " & " + unec[0][1] + ")  ) \\ (" + other[0][0] + " & " + other[0][1] + ")";
                                                    break;
                                            }
                                            break;
                                        case 3:
                                            //Z3
                                            $('#notation').html("(" + double[0][0] + " &cap; " + double[0][1] + ") &#8710; (" + double[1][0] + " &cap; " + double[1][1] +
                                                ") &#8710; (" + double[2][0] + " &cap; " + double[2][1] + ")");
                                            command = "(" + double[0][0] + " & " + double[0][1] + ") ^ (" + double[1][0] + " & " + double[1][1] +
                                                ") ^ (" + double[2][0] + " & " + double[2][1] + ")";
                                            //command = $('#notation').html().replace(/&cup;/g, "|").replace(/&cap;/g, "&").replace(/&minus;/g, "\\").replace(/&#8710;/g, "^");
                                            break;
                                    }
                                    break;
                                case false:

                                    switch (double.length) {
                                        case 1:
                                            //W3X
                                            $('#notation').html("(" + circleD[0] + " &#8710; " + circleD[1] + " &#8710; " + circleD[2] +
                                                ") &cup; (" + double[0][0] + " &cap; " + double[0][1] + ")");
                                            command = "(" + circleD[0] + " ^ " + circleD[1] + " ^ " + circleD[2] +
                                                ") | (" + double[0][0] + " & " + double[0][1] + ")";
                                            break;
                                        case 2:
                                            //W2X2
                                            switch (single.some(elem => double[0].join().includes(elem) && double[1].join().includes(elem))) {
                                                case true:
                                                    var uns = circleD.filter(elem => !single.join().includes(elem));
                                                    var s1 = single.filter(elem => !double[0].join().includes(elem) || !double[1].join().includes(elem));
                                                    var s2 = single.filter(elem => !s1.includes(elem));
                                                    $('#notation').html("(" + s1[0] + " &minus; " + uns[0] + ") &cup; " + s2[0]);
                                                    command = "(" + s1[0][0] + " \\ " + uns[0] + ") | " + s2[0][0];
                                                    break;
                                                case false:
                                                    $('#notation').html("(" + single[0] + " &#8710; " + single[1] + ") &cup; (" + double[0][0] + " &cap; " + double[0][1] + ")");
                                                    command = "(" + single[0][0] + " ^ " + single[1][0] + ") | (" + double[0][0] + " & " + double[0][1] + ")";
                                                    break;
                                            }

                                            break;
                                        case 3:
                                            //WX3
                                            var unq = double.filter(elem => !elem.join().includes(single));
                                            $('#notation').html(single[0] + " &cup; (" + unq[0][0] + " &cap; " + unq[0][1] + ")");
                                            command = single[0][0] + " | (" + unq[0][0] + " & " + unq[0][1] + ")";
                                            break;
                                    }
                                    break;
                            }
                            break;
                        case false:
                            //W3Y
                            $('#notation').html("(" + circleD[0] + " &#8710; " + circleD[1] + " &#8710; " + circleD[2] +
                                ") &cup; (" + circleD[0] + " &cap; " + circleD[1] + " &cap; " + circleD[2] +
                                ")");
                            command = "(" + circleD[0] + " ^ " + circleD[1] + " ^ " + circleD[2] +
                                ") | (" + circleD[0] + " & " + circleD[1] + " & " + circleD[2] +
                                ")"
                            break;
                    }
                    break;
                case 5:
                    switch (area.some(elem => elem.length == 3)) {
                        case true:
                            var double = area.filter(elem => elem.length == 2);
                            var single = area.filter(elem => elem.length == 1);
                            switch (double.length) {
                                case 1:
                                    //W3Z
                                    var other = circleD.filter(elem => !double.join().includes(elem));
                                    $('#notation').html("(" + double[0][0] + " &cup; " + double[0][1] + ") &#8710; " + other[0]);
                                    command = "(" + double[0][0] + " | " + double[0][1] + ") ^ " + other[0];
                                    break;
                                case 2:
                                    //W2Z2
                                    switch (single.some(elem => double[0].join().includes(elem) && double[1].join().includes(elem))) {
                                        case true:
                                            var unq = intersect.filter(elem => !double.join().includes(elem));
                                            $('#notation').html("(" + single[0] + " &cup; " + single[1] + ") &minus; (" + unq[0][0] + " &cap; " + unq[0][1] + ")");
                                            command = "(" + single[0][0] + " | " + single[1][0] + ") \\ (" + unq[0][0] + " & " + unq[0][1] + ")";
                                            break;
                                        case false:
                                            $('#notation').html(single[0] + " &#8710; " + single[1]);
                                            command = single[0][0] + " ^ " + single[1][0];
                                            break;
                                    }
                                    break;
                                case 3:
                                    //WZ3
                                    var others = double.filter(elem => !elem.join().includes(single));
                                    $('#notation').html("(" + single[0] + " &cup;  (" + others[0][0] + " &cap; " + others[0][1] + ") ) &minus; (" + circleD[0] + " &cap; " + circleD[1] + " &cap; " + circleD[2] +
                                        ")");
                                    command = "(" + single[0][0] + " |  (" + others[0][0] + " & " + others[0][1] + ") ) \\ (" + circleD[0] + " & " + circleD[1] + " & " + circleD[2] +
                                        ")";
                                    //  $('#notation').append("(" + single[0] + " &minus;  (" + others[0][0] + " &cap; " + others[0][1] + ") ) &cup; ( (" + others[0][0] + " &cap; " + others[0][1] + ") &minus; " + single[0] +
                                    //    ")");
                                    break;
                            }
                            break;
                        case false:
                            switch (area.filter(elem => elem.length == 2).length) {
                                case 2:
                                    //W3X2
                                    var double = area.filter(elem => elem.length == 2);
                                    var other = intersect.filter(elem => !double.join().includes(elem));
                                    var singCirc = circleD.filter(elem => !other.join().includes(elem));
                                    $('#notation').html("(" + other[0][0] + " &#8710; " + other[0][1] + ") &cup; " + singCirc[0]);
                                    command = "(" + other[0][0] + " ^ " + other[0][1] + ") | " + singCirc[0];
                                    break;
                                case 3:
                                    //W2X3
                                    var single = area.filter(elem => elem.length == 1);
                                    $('#notation').html(single[0] + " &cup; " + single[1]);
                                    command = single[0][0] + " | " + single[1][0];
                                    break;
                            }
                            break;
                    }
                    break;
                case 6:
                    switch (area.some(elem => elem.length == 3)) {
                        case true:
                            var double = area.filter(elem => elem.length == 2);
                            switch (area.filter(elem => elem.length == 2).length) {
                                case 2:
                                    //WW3Z2
                                    var other = intersect.filter(elem => !double.join().includes(elem));
                                    $('#notation').html("(" + circleD[0] + " &cup; " + circleD[1] + " &cup; " + circleD[2] +
                                        ") &minus; (" + other[0][0] + " &cap; " + other[0][1] + ")");
                                    command = "(" + circleD[0] + " | " + circleD[1] + " | " + circleD[2] +
                                        ") \\ (" + other[0][0] + " & " + other[0][1] + ")";
                                    break;
                                case 3:
                                    //W2Z3
                                    var single = area.filter(elem => elem.length == 1);
                                    $('#notation').html("(" + single[0] + " &cup; " + single[1] + ") &minus; (" + circleD[0] +
                                        " &cap; " + circleD[1] + " &cap; " + circleD[2] + ")");
                                    command = "(" + single[0][0] + " | " + single[1][0] + ") \\ (" + circleD[0] +
                                        " & " + circleD[1] + " & " + circleD[2] + ")";
                                    break;
                            }
                            break;
                        case false:
                            //W3X3
                            $('#notation').html(circleD[0] + " &cup; " + circleD[1] + " &cup; " + circleD[2]);
                            command = circleD[0] + " |" + circleD[1] + " | " + circleD[2];
                            break;
                    }

                    break;
                case 7:
                    //W3Z3
                    $('#notation').html("(" + circleD[0] + " &cup; " + circleD[1] + " &cup; " + circleD[2] +
                        ") &minus; (" + circleD[0] + " &cap; " + circleD[1] + " &cap; " + circleD[2] +
                        ")");
                    command = "(" + circleD[0] + " | " + circleD[1] + " | " + circleD[2] +
                        ") \\ (" + circleD[0] + " & " + circleD[1] + " & " + circleD[2] +
                        ")";
                    break;

            }
            break;
    }
}

Genoverse.Plugins.tersectIntegration.requires = 'controlPanel';