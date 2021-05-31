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
    console.log(data)
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
    var filepath = path.join(__dirname, `../../generated-acts/`);
    var filename = `Acta-${data.consecutivo}-${Date.now().toString()}.docx`
    fs.writeFileSync(filepath+filename, buf);
    return {filepath: filepath, filename: filename};
}

module.exports = {makeDoc};