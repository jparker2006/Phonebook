"use strict";

var onload = () => {
    MainFunction();
}

function MainFunction() {
    MakeListForm();
}

function MakeListForm() {
    var sPage = "";
    sPage += "<div id='ListFrame' style='width: 100%;'>";
    sPage += "<div class='RoundedBox' style='width: 90%; max-width: 950px;'>";
    sPage += "<div class='BigText SlideInR2L'>Contacts</div>";
    sPage += "<input type='text' id='SearchBar' class='Control' style='width: 250px;' Placeholder='Search' onkeyup=AJAXifyList();>";
    sPage += "<div class='FloatRight'><input type='button' id='NewBtn' class='Control' value='+' title='Add a contact' onClick=MakeRecordForm("+false+");></div>";
    sPage += "<div id='List' style='line-height: 1.6;'>Loading...</div>";
    sPage += "</div>";
    sPage += "</div>";
    sPage += "<div id='Feedback' class='SmallText'></div>";

    document.getElementById('Main').innerHTML = sPage;

    postFileFromServer('SQL.php', "GetRecords=" + encodeURIComponent("All"), GetRecordsCallback);
}

function GetRecordsCallback(data) {
    let objRecords = JSON.parse(data);
    let sList = "";
    for (let x = 0; x < objRecords.length; x++) {
        sList += "<a href=\"javascript:MakeRecordForm(" + true + ", " + objRecords[x].id + ")\">";
        sList += objRecords[x].last + ", " + objRecords[x].first + "</a><br>";
    }
    document.getElementById('List').innerHTML = sList;
}

function AJAXifyList() {
    let str = document.getElementById('SearchBar').value;
    if (str)
        postFileFromServer('SQL.php', "SearchString=" + encodeURIComponent(str), GetRecordsCallback);
    else
        postFileFromServer('SQL.php', "GetRecords=" + encodeURIComponent("All"), GetRecordsCallback);
}

function MakeRecordForm(bEditing, nID) {
    var sPage = "";
    sPage += "<div id='RecordFrame' style='width: 100%;'>";
    sPage += "<div id='Record' class='RoundedBox' style='width: 90%; max-width: 950px;'>";
    sPage += "<div style='margin-left: auto; margin-right: auto;'>";
    if (bEditing)
        sPage += "<div class='FloatRight'><input type='button' id='DelBtn' class='Control' value='-' title='Delete contact' onClick=DeleteRecord("+nID+");></div>";
    sPage += "<input type='text' id='FirstName' class='Control' style='width: 250px;' Placeholder='First Name'>";
    sPage += "<input type='text' id='LastName' class='Control' style='width: 250px;' Placeholder='Last Name'>";
    sPage += "<input type='text' id='MobilePhone' class='Control' style='width: 250px;' Placeholder='Mobile Phone'><br>";
    sPage += "</div>";
    sPage += "<div style='margin-left: auto; margin-right: auto; width: 250px;'>";
    if (bEditing)
        sPage += "<input type='button' id='SaveBtn' class='Control' value='Save' onClick=ModifyRecord("+nID+");>";
    else
        sPage += "<input type='button' id='CreateBtn' class='Control' value='Create' onClick=CreateRecord();>";
    sPage += "<input type='button' id='CancelBtn' class='Control' value='Cancel' onClick=MakeListForm();>";
    sPage += "</div>";
    sPage += "</div>";
    sPage += "</div>";
    sPage += "<div id='Feedback' class='SmallText'></div>";

    document.getElementById('Main').innerHTML = sPage;

    if (bEditing)
        postFileFromServer('SQL.php', "GetRecords=" + encodeURIComponent(nID), GetRecordCallback);
    function GetRecordCallback(data) {
        let objRecord = JSON.parse(data);
        document.getElementById('FirstName').value = objRecord.first;
        document.getElementById('LastName').value = objRecord.last;
        document.getElementById('MobilePhone').value = objRecord.mobile
    }
}

function ModifyRecord(nID) {
    let objNewRecord = {};
    objNewRecord.id = nID;
    objNewRecord.first = document.getElementById('FirstName').value.trim();
    objNewRecord.last = document.getElementById('LastName').value.trim();
    objNewRecord.mobile = document.getElementById('MobilePhone').value.trim();
    let jsonRecord = JSON.stringify(objNewRecord);
    postFileFromServer('SQL.php', "ModifyRecord=" + encodeURIComponent(jsonRecord), ModifyRecordCallback);
    function ModifyRecordCallback(data) {
        if (true == data)
            MakeListForm();
        else
            document.getElementById('Feedback').innerHTML = "Failed.";
    }
}

function DeleteRecord(nID) {
    postFileFromServer('SQL.php', "DeleteRecord=" + nID, DeleteRecordCallback);
    function DeleteRecordCallback(data) {
        if (data)
            MakeListForm();
        else
            document.getElementById('Feedback').innerHTML = "Failed.";
    }
}

function CreateRecord() {
    document.getElementById('Feedback').innerHTML = "";
    let objNewRecord = {};
    var sFirst = document.getElementById('FirstName').value.trim();
    var sLast = document.getElementById('LastName').value.trim();
    var sMobile = document.getElementById('MobilePhone').value.trim();

    if (sFirst && sLast && sMobile) {
        objNewRecord.First = sFirst;
        objNewRecord.Last = sLast;
        objNewRecord.Mobile = sMobile;
        let jsonRecord = JSON.stringify(objNewRecord);
        postFileFromServer('SQL.php', "NewRecord=" + encodeURIComponent(jsonRecord), NewRecordCallback);
    }
    else {
        alert('Missing Data');
    }

    function NewRecordCallback(data) {
        if (data) {
            MakeListForm();
        }
        else {
            document.getElementById('Feedback').innerHTML = 'Failed';
        }
    }
}

function postFileFromServer(url, sData, doneCallback) {
	var xhr;
	xhr = new XMLHttpRequest();
	xhr.onreadystatechange = handleStateChange;
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.send(sData);
	function handleStateChange() {
		if (xhr.readyState === 4) {
			doneCallback(xhr.status == 200 ? xhr.responseText : null);
		}
	}
}
