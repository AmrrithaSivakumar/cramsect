var area = [];
var filesetA = [];
var filesetB = [];
var filesetC = [];
var wildcardgroup;
var int = [];
var command;
var wildcardID = [];
var sampleCountA = 0;
var sampleCountB = 0;
var sampleCountC = 0;
const circles = ['A', 'B', 'C'];
var groupNum;
var change;

function circlesDisplayed() {
  var displayed = [];
  sets.forEach(function (elem) {
      if (elem.sets.length == 1) {
          displayed.push(elem.sets);
}
});
return displayed;
}

var chart = venn.VennDiagram();
var div = d3.select("#venn");

//sets for making venn diagram
var sets = [{ sets: ['A'], size: 12 }];

$("#countA").text("A: " + sampleCountA);
$("#countB").text("B: " + sampleCountB);
$("#countC").text("C: " + sampleCountC);

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
}

//hide radiobuttons and labels and counts
$("label[for=B], #B, #countB, label[for=C], #C, #countC").hide();

var chart = venn.VennDiagram();
var div = d3.select("#venn");

//draw venn
div.datum(sets).call(chart
    .width(400)
    .height(400)
);

//customise venn diagram
    function customiseVenn() {
        var colours = ["#D81B60", "#1E88E5", "#FFC107"]
        d3.selectAll("#venn .venn-circle path")
            .style("fill", function (d, i) { return colours[i]; })
            .style("fill-opacity", .7)
            .style("stroke", "none")


        d3.selectAll("#venn .venn-intersection path")
            .style("stroke", "#004D40")
            .style("stroke-width", 0)



        d3.select("[data-venn-sets=A_B_C]").select("path")
            .style("stroke", "")

        d3.selectAll("#venn .venn-circle text")
            .style("fill", "#fff")
            .style("font-size", "24")
            .style("font-weight", "200");
        getNotation();
    }

    customiseVenn();


//make tooltips for files
var tooltipA = d3.select("#sampleA")
var tooltipB = d3.select("#sampleB")
var tooltipC = d3.select("#sampleC");

//returns array of circles not displayed
  function newCircles() {
      var newCircles = [...circles];
      var currentCircles = circlesDisplayed();
      currentCircles.forEach(function (elem) {
          newCircles = newCircles.filter(circ => circ != elem)
      });
      return newCircles;
  }

  //resets venn to orignal appearance
      function resetVenn() {
          area = [];
          customiseVenn();
      }

//action listeners for venn
div.selectAll('g')
    .on('mouseover', function (d, i) {
        //brings smallest area to top
        venn.sortAreas(div, d);
        DragDropManager.droppable = d.sets;
    })

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



       //get samples from tsi file
       $.post('/', { "tsifile": "tomato.tsi" }, function (data) {
           var samples = data.samples;
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
       });


       //case sensitive search for samples (only matches from the beginning of samples)
       $("#searchBox").on("keyup", function () {
           wildcardgroup = $(this).val();
           $("#genomeTable td").filter(function () {
               $(this).toggle($(this).text().indexOf(wildcardgroup) == 0)
           });
       });


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


           $('#here' + set).append(`<td id="table${wildcardID}">${input}<button class="tableButton" name="${groupNum}" id="${set + wildcardID}">&times;</button></td>`);
           wildcardID = [];

       }


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


           filesetA = filesetA.filter(item => !item.includes(samp))
           filesetB = filesetB.filter(item => !item.includes(samp))
           filesetC = filesetC.filter(item => !item.includes(samp))

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


       $('#clearSample').click(function () {
           filesetA = [];
           filesetB = [];
           filesetC = [];
           $('#genomeTable td').draggable('option', 'disabled', false);
           $('.venntooltip td').remove();

       });

       $('#clearOperations').click(resetVenn);


       $("#submit").click(function () {
           var files = circlesDisplayed();
           function hasSamples() {
               files.forEach(function (elem) {
                   if (elem == "A") {
                       return filesetA.length;
                   } else if (elem == "B") {
                       return filesetB.length;
                   } else if (elem == "C") {
                       return filesetC.length;
                   }
               });
           }

           getNotation();

           if (command && $("#filepath").val() && hasSamples()) {

               var operations = {};


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




               $.post("http://localhost:3000/", operations, function (data) {
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


       });
   });
