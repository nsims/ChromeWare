

chrome.runtime.sendMessage(null, function(response){
	var file = response.file;
	var sFileName = "Image";
	var boundaryString = '---------------------------132611019532525';
    var boundary = '--' + boundaryString;
    var requestbody = boundary + '\r\n'
            + 'Content-Disposition: form-data; name="Upload_FileName"; filename="'
            + sFileName + '"' + '\r\n'
            + 'Content-Type: image/png' + '\r\n'
            + '\r\n'
            + file
            + '\r\n'
            + boundary + '--\r\n';
            
    // Send
    var http_request = new XMLHttpRequest();
	
	var sSoftwareRequestURL = "https://software.enablon.com/Software/?u=/Referent/Rqtes"
	var sHTTPRequestURL = sSoftwareRequestURL + "&pp_FieldNo=" + 34 + "&pp_CurMode=1&pp_fieldId=XFichier&pp_frmfldid=fld_XFichier&pp_Name=Files&upl_Mode=1&RecId=-1";
	
    http_request.open('POST', sHTTPRequestURL + "&tm=4&fno=%201&upl_Field=" + 34 + "&upl_State=1&formfld=fld_XFichier", true);
    http_request.setRequestHeader("Referer", sHTTPRequestURL + "&tm=37&fno=1&pp_mfmode=2&skiplist=0");                  
    http_request.setRequestHeader("Content-type", "multipart/form-data; boundary=" + boundaryString);
    //http_request.setRequestHeader("Connection", "close");
    http_request.setRequestHeader("Content-length", requestbody.length);
    http_request.sendAsBinary(requestbody);

});