/*
PARA RECIBIR LOS MAILS, EDITAR LA LINEA 93
*/

import fs from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib';
import { PdfReader }  from "pdfreader";
import { Email } from '../utils/Email.js';

var totales;


const splitPDF = async (pdfFilePath, outputDirectory) => {
  const data = await fs.promises.readFile(pdfFilePath);
  const readPdf = await PDFDocument.load(data);
  const { length } = readPdf.getPages();
  totales = length;
  for (let i = 0, n = length; i < n; i += 1) {
    const writePdf = await PDFDocument.create();
    const [page] = await writePdf.copyPages(readPdf, [i]);
    writePdf.addPage(page);
    const bytes = await writePdf.save();
    const outputPath = path.join(outputDirectory, `Invoice_Page_${i + 1}.pdf`);
    await fs.promises.writeFile(outputPath, bytes);
    console.log(`Added ${outputPath}`);

    

  }
};

splitPDF('./utils/nombres.pdf', 'archivos').then(() =>
  envio()
);



var name = ""
var nroMail = 1

function envio(){

  for (let index = 1; index <= totales; index++) {

    var direccion = "./archivos/Invoice_Page_"+index+".pdf"

    fs.readFile(direccion, (err, pdfBuffer) => {
      // pdfBuffer contains the file content

      new PdfReader().parseBuffer(pdfBuffer, (err, item) => {
        if (err) console.error("error:", err);
        else if (!item) {
          
          envioMail(name, nroMail)
          name = ""
          nroMail ++
          
        }
        else if (item.text) {
            name +=item.text
        }
      });

    });

  
  }


}




function envioMail(name, dir){

  var arrNombre = name.split(' ')
  var apellido = ""

  var nombre = arrNombre[0]
  
  for (let indice = 1; indice < arrNombre.length; indice++) {
    apellido += arrNombre[indice]
    
  }
  
  var direccionDeMail = nombre + apellido + "@hotmail.com"

  const email = new Email();

  email.enviar("robertino.momo@gmail.com", direccionDeMail, direccionDeMail, "./archivos/Invoice_Page_"+dir+".pdf")


}