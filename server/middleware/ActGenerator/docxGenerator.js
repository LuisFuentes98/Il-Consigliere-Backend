var PizZip = require('pizzip');
var Docxtemplater = require('docxtemplater');

var fs = require('fs');
var path = require('path');

function replaceErrors(key, value){
    if(value instanceof Error){
        return Object.getOwnPropertyNames(value).reduce(function(error,key){
            error[key] = value[key];
            return error;
        }, {});
    }
    return value;
}

function errorHandler(error){
    console.log(JSON.stringify({error: error}, replaceErrors));
    if(error.properties && error.properties.errors instanceof Array){
        const errorMessages = error.properties.errors.map(function(error){
            return error.properties.explanation;
        }).join("/n");
        console.log('errorMessages', errorMessages);
    }
    throw error;
}

async function makeDoc(data){
    var content = fs.readFileSync(path.resolve(__dirname, 'Acta ICSJ-XX-202X.docx'), 'binary');
    var zip = new PizZip(content);
    var doc;
    try {
        doc = new Docxtemplater(zip);
    } catch(error){
        errorHandler(error);
    };

    doc.setData(data);

    try{
        doc.render();
    }catch(error){
        errorHandler(error);
    }

    var buf = doc.getZip().generate({type: 'nodebuffer'});
    var filename = path.resolve(__dirname, `generated_acts/Acta-${Date.now.toString()}.docx`);
    fs.writeFileSync(path, buf);
    return path;
}

module.exports = {makeDoc};