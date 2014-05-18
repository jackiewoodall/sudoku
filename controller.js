$(document).ready(function() {
    //$("div").fadeOut(10000);

    //$("#00").fadeOut(1000); // select by "id"
    
    //$(".cell").fadeOut(1000); // selection by "class"
    
    // to change the contents of a given cell
    // set the html to form-select-<option> that are valid
    //console.log( $("#02").html() );
    
    // used to disable a specific cell. used when setting a new board
    //$("#02").prop( "disabled", true );
    
    // capture the event of a cell's value being changed by the user
    // update the model, then update the view from the new model
    $("select").change( function() { OnSelectChange(this); });
    
    $("#btnNew").click(function() { OnNewClick(this); })
    
    $("#btnClear").click(function() { OnClearClick(this); })
    
    // initialize a start puzzle
    OnNewClick(this);
    
});

function OnSelectChange(element) {
    console.log("OnSelectChange " + element.id);
}

function OnNewClick(element) {
    console.log("OnNewClick " + element);
}

function OnClearClick(element) {
    console.log("OnClearClick " + element)
}
