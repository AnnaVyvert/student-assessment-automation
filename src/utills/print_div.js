import { get_txt } from "./get_txt";

export async function printDiv(elem, filePath){
    var mywindow = window.open('', 'PRINT', 'height=1,width=1');

    mywindow.document.write('<html><head><title>' + document.title  + '</title>');
    mywindow.document.write('</head><body >');
    mywindow.document.write('<style>'+
    await get_txt(filePath)
    +'</style>')
    mywindow.document.write(document.querySelector(elem).innerHTML);
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    mywindow.print();
    mywindow.close();

    return true;
}