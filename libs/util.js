require('date-util');

exports.Right = 
function Right(Str,Num){
    if(Num<=0){
    return "";}
    else if (Num > String(Str).length){
    return Str;}
    else {
        var iLen = String(Str).length;
        return String(Str).substring(iLen,iLen-Num);
    }
}

exports.newDate = function (){
    let formatDate = new Date().format("yyyymmddHHMMss")

    return formatDate;
}

String.prototype.lpad = function (padLength, padString) {
    var s = this;
    while (s.length < padLength) { s = padString + s };
    return s;
}