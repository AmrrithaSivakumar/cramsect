Genoverse.Plugins.tersectIntegration = function () {
    this.controls.push({
        icon: '<i class="fa fa-override"></i>',
        'class': 'gv-tersect-integration',
        name: 'Use Tersect Functionalities.',
        action: function (browser) {
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
                    tersectMenu = makeTersectMenu();
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
                    //Venn gui pop up when press submit
                    $('#submit-query').on('click', function () {
                      if(vennGui){
                        vennGui.show();
                      } else {
                        vennGui = makeVennGui();
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
                    '<span><a class="gv-tersect-integration-text gv-tersect-integration-input gv-tersect-integration-select-button" id="tsi-file">TSI File <i class="fa fa-arrow-circle-right"></i></a></span></br>':'',
                    '<div><span class="gv-tersect-integration-span" id="save-query"><a class="gv-tersect-integration-text ">Save Query <i id="save-status" class="fa fa-arrow-circle-right"></i></a></span> <span class="gv-tersect-integration-span" id="saved-queries"><a class="gv-tersect-integration-text">Saved Queries <i class="fa fa-arrow-circle-right"></i></a></span></div>': '<span><a class="gv-tersect-integration-text gv-tersect-integration-submit-button" id="submit-query">Submit <i class="fa fa-arrow-circle-right"></i></a></span>',

                }).addClass('gv-tersect-integration-menu');



                return tersectMenu;
            }

            function makeVennGui() {
              var gui = browser.makeMenu({
                '<div>Venn Diagram</div>':'',
                '<div id="names" class ="gv-tersect-integration-text">Gui</div><div>venn List Here</div>':'',

              }).addClass('gv-tersect-integration-file-menu');

              // loading the venn gui file
              $.get('/index(2).html', function(result){
                $('#names').html(result);
              });

              console.log("venn gui");
              return gui;
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
                $(index_list).append('<tr data-id="'+this._id+'"><td><a>'+this.name+'</a></td><td><span>'+this.instance+'</span></td><td><span>'+this.local+'</span></td><td><a class="gv-tersect-index-delete">delete</a></td></tr>');
            });

            $(index_list).parent().off().on('click','.gv-tersect-index-delete',function(){indexDeleter(index_list,$(this).parent().parent().data("id"),url)});

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





// function indexPopulator(url){
//     console.log("event fired successfully!");
//     $.ajax({
//         type: 'GET',
//         url: url,
//         success: function(data){
//             console.log("latest value"+this);
//
//             $.each(data, function(){
//                 $(".gv-tersect-index-list").append('<div id="'+this._id+'"><a>'+this.name+'</a>--<a>delete</a></div>')
//
//             })
//         },
//         dataType: "json"
//     });
// }
/*function () {
    $('#tsi-submit-local-text').text('Submit 0%');
    var files = $('#local-file-chooser').get(0).files;
    var flag = true;
    if (files.length > 0) {
        var formData = new FormData();
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            // add the files to formData object for the data payload
            const name = file.name;
            const lastDot = name.lastIndexOf('.');

            const fileName = name.substring(0, lastDot);
            const ext = name.substring(lastDot + 1);

            if (ext !== "txt") {
                alert("file extension is wrong.")
                flag = false;
            }
            formData.append('uploads[]', file, file.name);
        }
    }
    if(flag == true){
        $.ajax({
            url: '/index/tersectUpload',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (data) {
                console.log('upload successful!\n' + data);
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
                        // update the Bootstrap progress bar with the new percentage
                        $('#tsi-submit-local-text').text('Submit ' + percentComplete + '%');
                        // once the upload reaches 100%, set the progress bar text to done
                        if (percentComplete === 100) {
                            $('#tsi-submit-local-text').text('Submission Complete');
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
}*/
Genoverse.Plugins.tersectIntegration.requires = 'controlPanel';
