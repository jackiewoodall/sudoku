var _puzzleActive = null;
var _puzzleInitial = null;

$(document).ready(function() {

    // initialize the board's HTML
    $("select").html( GenerateOptionHTML );

    // register event handlers
    $("select").change( function() { OnSelectChange(this); });
    
    $("#btnNew").click(function() { OnNewClick(this); })
    
    $("#btnClear").click(function() { OnClearClick(this); })

    $("#btnSolve").click(function() { OnSolveClick(this); })
    
    $("#btnLoad").click(function() { OnLoadClick(this); })

    $("#btnDump").click(function() { OnDumpClick(this); })
    
    // load a start puzzle
    OnNewClick(this);
});

function OnSelectChange(element) {
    console.log("OnSelectChange " + element.id);

    var r = parseInt(element.id[0]);
    var c = parseInt(element.id[1]);
    var v = parseInt(element.value);
    var oldValue = _puzzleActive.get(r,c);
    
    v = isNaN(v) ? 0 : v;
    
    if(oldValue != 0) {
        _puzzleActive.unset(r,c,oldValue);
    }
    
    if( v !=0 ) {
        _puzzleActive.set(r,c,v);
    }
    
    UpdateView(_puzzleInitial, _puzzleActive);
}

function OnNewClick(element) {
    console.log("OnNewClick " + element);
    
    var r = Math.floor(Math.random() * testSeries.length);
    
    Loadpuzzle(testSeries[r]);
}

function OnClearClick(element) {
    console.log("OnClearClick " + element);
    
    var r=confirm("Clear the board! Are you sure?");
    if (r==true) {
        $("select").html( GenerateOptionHTML );
        $("select").prop( "disabled", false);
    }
}

function OnSolveClick(element) {
    console.log("OnSolveClick " + element);
    
    var solved = solve(_puzzleActive);
    
    if( solved === false ) {
        alert("Unsolvable");
    } else {
        _puzzleActive = solved;
        UpdateView(_puzzleInitial, _puzzleActive);
    }
}

function OnLoadClick(element) {
    console.log("OnLoadClick " + element);
    
    var txtElement = $("#txtLoad");
    var txtValue = txtElement[0].value;

    if(txtValue.length > 0 ) {
        Loadpuzzle(txtValue);
    }
}

function OnDumpClick(element) {
    console.log("OnDumpClick " + element);
    
    $("#txtDump").text( _puzzleActive.dump() );
}

function GenerateOptionHTML(index, origText) {
    return '\
        <option value=" "> </option>\
        <option value="1">1</option>\
        <option value="2">2</option>\
        <option value="3">3</option>\
        <option value="4">4</option>\
        <option value="5">5</option>\
        <option value="6">6</option>\
        <option value="7">7</option>\
        <option value="8">8</option>\
        <option value="9">9</option>';
}

function Loadpuzzle(str) {
    _puzzleInitial = load(str);
    _puzzleActive = _puzzleInitial.clone();
    
    $("select").html( GenerateOptionHTML );
    $("select").prop( "disabled", false);
    
    UpdateView(_puzzleInitial, _puzzleActive);
}

function UpdateView(initial, current) {
    for(var r=0;r<9;r++) {
        for(var c=0;c<9;c++) {
            // initial overrides current
            var v = initial.get(r,c);
            if(v !== 0) {
                // set in stone this value
                SetFixed(r,c,v);
            } else {
                var v = current.get(r,c);
                var candidates = current.candidates(r,c);
                SetVariable(r,c,v,candidates);
            }
        }
    }
}

function GetSelect(r,c) {
    var idStr = "#" + r.toString() + c.toString();
    
    var element = $(idStr);
    
    if(element != null && element.length >0) {
    } else {
        element = null;
    }
    return element;
}

function SetFixed(r,c,v) {
    var element = GetSelect(r,c);
    
    if(element != null) {
        element[0].value = v;
        element.prop( "disabled", true);
    }
}

function SetVariable(r,c,v,candidates) {
    var element = GetSelect(r,c);
    
    if(element != null) {
        var options = '<option value=" "> </option>';
        
        if( v>=1 && v<=9) candidates.push(v);
        else v = ' ';
        
        for(var i=0;i<candidates.length;i++) {
            var num = candidates[i];
            options += '<option value="' + num.toString() + '">' + num.toString() + '</option>';
        }
        element.html(options);
        element[0].value = v;
    }
}
