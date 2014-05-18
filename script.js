$(document).ready(function() {
    //$("div").fadeOut(10000);
    //$("#00").fadeOut(1000);
    
    //$(".cell").fadeOut(1000);
    
    // to change the contents of a given cell
    // set the html to form-select-<option> that are valid
    console.log( $("#02").html() );
    
    // used to disable a specific cell. used when setting a new board
    $("#02").prop( "disabled", true );
    
    // capture the event of a cell's value being changed by the user
    // update the model, then update the view from the new model
    $("select").change( function() {
        eventCallBack(this);
    } );
    
});

var eventCallBack = function(element)
{
    debugger;
    console.log("change detected on " + element.id);
}