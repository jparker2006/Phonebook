<?php

if (isset($_POST['ConnectToDB']))
    $sConnectToDB = $_POST['ConnectToDB'];
else if (isset($_POST['NewRecord']))
    $jsonNewRecord = $_POST['NewRecord'];
else if (isset($_POST['GetRecords']))
    $sGetRecords = $_POST['GetRecords'];
else if (isset($_POST['ModifyRecord']))
    $jsonModifyRecord = $_POST['ModifyRecord'];
else if (isset($_POST['DeleteRecord']))
    $nRecordToDelete = $_POST['DeleteRecord'];
else if (isset($_POST['SearchString']))
    $sSearching = $_POST['SearchString'];


if ($sConnectToDB)
    $sFeedback = ConnectToDB ($sConnectToDB);
else if ($jsonNewRecord)
    $sFeedback = NewRecord ($jsonNewRecord);
else if ($sGetRecords)
    $sFeedback = GetRecords ($sGetRecords);
else if ($jsonModifyRecord)
    $sFeedback = ModifyRecord ($jsonModifyRecord);
else if ($nRecordToDelete)
    $sFeedback = DeleteRecord ($nRecordToDelete);
else if ($sSearching)
    $sFeedback = SearchRecords ($sSearching);


echo $sFeedback;


function QueryDB ($sSQL) {
    $dbhost = 'localhost';
    $dbuser = 'phonebook_site';
    $dbpass = 'j60ixT';
    $db = "phonebook";

    $dbconnect = new mysqli($dbhost, $dbuser, $dbpass, $db);
    $Result = $dbconnect->query($sSQL);

    $dbconnect->close();

    return $Result;
}

function ConnectToDB ($sConnectToDB) {
    $dbhost = 'localhost';
    $dbuser = 'phonebook_site';
    $dbpass = 'xxxxx';
    $db = "phonebook";

    $dbconnect = new mysqli($dbhost, $dbuser, $dbpass, $db);

    if ($dbconnect->connect_error) {
        return "Connection error: " . $dbconnect->connect_error;
    }
    else {
        return "Connection success! " . $dbconnect->fields;
    }

    $dbconnect->close();
}

function NewRecord ($jsonNewRecord) {

    $objNewRecord = json_decode($jsonNewRecord);

    $sSQL = "INSERT INTO Contacts (first, last, mobile)
        VALUES ('" . $objNewRecord->First . "', '" . $objNewRecord->Last . "', '" . $objNewRecord->Mobile . "')";

    return QueryDB ($sSQL) ? "Record created!" : "Record creation failed.";
}

function GetRecords ($sGetRecords) {
    if ("All" === $sGetRecords) {
        $sSQL = "SELECT * FROM Contacts ORDER BY last, first";
        $tResult = QueryDB ($sSQL);
        $aList = [];
        $nRows = $tResult->num_rows;

        if ($nRows > 0) {
            for ($nListCounter = 0; $nListCounter < $nRows; $nListCounter++) {
                $row = $tResult->fetch_assoc();
                $aList[$nListCounter] = new stdClass();
                $aList[$nListCounter]->id = $row["id"];
                $aList[$nListCounter]->first = $row["first"];
                $aList[$nListCounter]->last = $row["last"];
            }
        }
        return json_encode($aList);
    }
    else {
        $sSQL = "SELECT * FROM Contacts WHERE id=" . intval($sGetRecords);
        $tResult = QueryDB ($sSQL);
        $nRows = $tResult->num_rows;
        $row = $tResult->fetch_assoc();
        $objRecord = new stdClass();
        $objRecord->id = $row["id"];
        $objRecord->first = $row["first"];
        $objRecord->last = $row["last"];
        $objRecord->mobile = $row["mobile"];
        return json_encode($objRecord);
    }
}

function ModifyRecord ($jsonModifyRecord) {
    $objModifyRecord = json_decode($jsonModifyRecord);
    $sSQL = "UPDATE Contacts SET first='" . $objModifyRecord->first . "', last='" . $objModifyRecord->last . "', mobile='" . $objModifyRecord->mobile . "' WHERE id=" . $objModifyRecord->id;
    $tResult = QueryDB ($sSQL);
    return $tResult;
}

function DeleteRecord ($nRecordToDelete) {
    $sSQL = "DELETE FROM Contacts WHERE id=" . $nRecordToDelete;
    $tResult = QueryDB ($sSQL);
    return $tResult;
}

function SearchRecords ($sSearching) {
    $aList = [];
    $sSQL = "SELECT * FROM Contacts WHERE first LIKE '%" . $sSearching . "%' OR last LIKE '%" . $sSearching . "%' OR mobile LIKE '%" . $sSearching . "%'";
    $tResult = QueryDB ($sSQL);
    $nRows = $tResult->num_rows;

    if ($nRows > 0) {
        for ($nListCounter = 0; $nListCounter < $nRows; $nListCounter++) {
            $row = $tResult->fetch_assoc();
            $aList[$nListCounter] = new stdClass();
            $aList[$nListCounter]->id = $row["id"];
            $aList[$nListCounter]->first = $row["first"];
            $aList[$nListCounter]->last = $row["last"];
        }
    }

    return json_encode($aList);
}

/* Table skeleton
CREATE TABLE Contacts (
id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
first VARCHAR(50) NOT NULL,
last VARCHAR(50) NOT NULL,
mobile VARCHAR(30) NOT NULL
);
*/

?>
