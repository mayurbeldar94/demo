const Fs = require('fs')  //Define File System
const Path = require('path')  //Define Path to download the file
const Axios = require('axios') // Axios Library used to download the file, here GET and POST methods are used
const handlebars = require('handlebars');
const express = require('express');
const app = express()

async function downloadImage () {

        const url = 'https://samples.openweathermap.org/data/2.5/weather?q=London,uk&appid=b6907d289e10d714a6e88b30761fae22' //URL from where JSON file needs to be downloaded
        const path = Path.resolve(__dirname, './', 'data.json') // Path and Name of the file which is to be downloaded
 
        const writer = Fs.createWriteStream(path) //Method to download the file
  
        const response = await Axios({
            url,
            method: 'GET',
            responseType: 'stream'
        })
 

  //For fetching the JSON data
  Fs.readFile('./data.json', 'utf8', (err, fileContents) => {
        if (err) {
         console.error(err)
         return
        }
 
  try {
         const data = JSON.parse(fileContents)
         //Creating HTML page
         const source = `
          <h3><font color="red"><b>{{name}}, {{sys.country}}, {{weather.0.description}} </b></font></h3>
          <h5><mark>{{main.temp}} &#8457</mark> temperature from {{main.temp_min}} to {{main.temp_max}} &#8457, Wind {{wind.speed}} m/s Clouds {{wind.deg}} %, {{main.pressure}} hpa</h5>
          <h5>Geo Coords <font color="red">[{{coord.lon}}, {{coord.lat}}]</h5>`;

        const template = handlebars.compile(source, { strict: true }) ;
        const result = template(data);
       // console.log(result);
        app.get('/',(req,res) => {
            res.send(result)
        })
        app.listen(3000,() => { console.log('listening on port 3000')})


    //Saving as HTML page
    //Path where HTML file will be created
         Fs.writeFile("./File.html", result, function(err) {
        if(err) {
             return console.log('unable to create last html file :',err);
         }

      console.log("The file was saved!");
        });
    //Done


      } catch(err) {
    console.error(err)   }
       
})
  //Data fetched into a variable
    response.data.pipe(writer)
 //console.log(test)
}
downloadImage()