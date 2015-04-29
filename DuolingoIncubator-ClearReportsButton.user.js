// ==UserScript==
// @name         Duolingo Incubator - Clear Reports Button
// @version      0.4
// @description  Click once to delete all reports of one source sentence! :D
// @author       sommerlied
// @match http://incubator.duolingo.com/*
// @include http://incubator.duolingo.com/*
// ==/UserScript==

var clearReportsSectionId = 'clear-reports-section-';
var fullscreenObserver = null;
var editorObserver = null;

window.onload=function () {
    try { 
        observeFullscreen();
        observeEditor();
        if(document.getElementsByClassName('reports-subsection') != null){
            addSections();
        }
    }
    catch(error) {
        console.log("Error in userscript 'Clear Reports Button': " + error.message)
    }
}

// observe if skill editor is open
function observeFullscreen(){
    var fullscreenDiv = document.getElementById('fullscreen');
    fullscreenObserver = setupObserver(checkFullscreenMutations);
    fullscreenObserver.observe(fullscreenDiv, { attributes: true, attributeFilter:['style'] });
}

// observe if one specific sentence is open in the editor
function observeEditor(){
    var editor = document.getElementById('exercise-editor');
    if(editor){
        editorObserver = setupObserver(checkEditorMutations);
        editorObserver.observe(editor, { childList: true });
        editor.addEventListener('DOMSubtreeModified', function(){addSections()});
    }
}

// creates a new observer object depending on the browser
function setupObserver(functionToBeExecuted){
    
    var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    var isChrome = !!window.chrome && !isOpera
        
    var observer = null;
    if(isChrome){  // Chrome
        observer = new window.WebKitMutationObserver(functionToBeExecuted);
    }else{ // other browsers
        observer = new MutationObserver(functionToBeExecuted);
    }
    
    return observer;
}

// "checkFullscreenMutations" is called when the fullscreen skill editor is opened/closed
// it connects/disconnects the editor observer
// (because when one is looking at the whole skill tree, there is no exercise editor to be observed)
function checkFullscreenMutations(mutations){
    mutations.forEach(function(mutation) {
        alert("fullscreen mutation");
        if(mutation.target.style.getPropertyValue('display') == 'none'){
            alert("editor disconnect");
            editorObserver.disconnect();
        }else{ // connect
            alert("editor connect");
            observeEditor();
        }
    })
}

// "checkEditorMutations" is called when there are automatic changes in the exercise editor
// eg. one mutation = loading reports on the right side of the editor when clicking on a sentence
function checkEditorMutations(mutations) {
    mutations.forEach(function(mutation) {
        alert("editor mutation");
        addSections();
    })
}

// add a button for the forward and the reverse sentence 
function addSections(){
    try{  
        addClearAllReportsSection('forward');
        addClearAllReportsSection('reverse');
    }
    catch(error){
        console.log("Error in userscript 'Clear Reports Button': " + error.message)
    }
}

function addClearAllReportsSection(sectionId){
    
    var section = document.getElementById(sectionId);
    if(section != null){ // details of a sentence are displayed
        
        // find first report subsection
        var reportSections = section.getElementsByClassName('reports-subsection');
        if(reportSections != null){ //there are reports

            var firstReportSection = reportSections[0];
            if(firstReportSection != null){

                // check if section is already there
                if(document.getElementById(clearReportsSectionId+section.id) == null){

                    // create new section
                    var buttonSection = document.createElement('div');
                    buttonSection.id = clearReportsSectionId+section.id;

                    // create section headline
                    var buttonSectionHeader = document.createElement('div');
                    buttonSectionHeader.className = 'sub-sub-header';
                    buttonSectionHeader.textContent = 'Clear Reports';
                    buttonSectionHeader.style.padding = '15px 7px 25px 5px';
                    buttonSectionHeader.style.borderBottom = '1px solid #eee'; 

                    // create clear-all-reports button
                    var clearAllReportsButton = document.createElement('button');
                    clearAllReportsButton.className = 'btn-inc-sm btn-primary pull-right info';
                    clearAllReportsButton.textContent = 'Clear All Reports';

                    // add event listener to clear-all-reports button
                    clearAllReportsButton.addEventListener('click', function(){clearAllReports(section)});

                    buttonSection.appendChild(buttonSectionHeader);
                    buttonSectionHeader.appendChild(clearAllReportsButton);

                    // insert button section
                    var insertedElement = firstReportSection.parentNode.insertBefore(buttonSection, firstReportSection);
                }
            }
        }
    }
}

//"clearAllReports clears/rejects all reports under element "section" 
//"section" expects an DOM element 
function clearAllReports(section){

    // clear suggestions
    clickButtons(section, "reject-report");

    // clear freewrite reports
    clickButtons(section, "clear-freewrite-report");

    // clear other reports
    clickButtons(section, "clear-report");
}

// "clickButtons" clicks on all buttons of class "buttonClass" under element "section"
// "section" expects an DOM element
//  "buttonClass" expects a string
function clickButtons(section, buttonClass){
    var rejectButtons = section.getElementsByClassName(buttonClass);
    for (i = 0; i < rejectButtons.length; i++) {
        rejectButtons[i].click();
    }
}








