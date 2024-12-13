import inquirer from "inquirer";
import qr from "qr-image";
import fs from "fs";
inquirer
    .prompt([
        {
        message: "type your url",
        name: "url"
        }
    ])
    .then((answer) => {
        const URL = answer.url;
        var qr_svg = qr.image(URL);
        qr_svg.pipe(fs.createWriteStream("qr-img.png")) 

        fs.writeFile("URL.txt", URL, (err) => {
            if (err) throw err;
            console.log("file has been saved");
        })
    })
    .catch((error) => {
        if (error.isTtyError) {

        }else{
            
        }
    });