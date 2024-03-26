const http = require('http');
const httpProxy = require('http-proxy');
const fs = require('fs');
const port = process.argv.length < 3?3000:process.argv[2];

var proxyPorts = { registry: 3 };

const proxy = httpProxy.createProxyServer({});

const server = http.createServer((req, res) => {
  // Seleccionar aleatoriamente un servidor backend
  var apiReg = "";
  for (let key in proxyPorts) {
      //if(req.url.startsWith("/"+key+"/")){
      if(req.url.split("/")[1] == key){ 
        apiReg = key;
        req.url = req.url.replace("/"+key,"");
        break;
      }
  }
  
  if(apiReg != ""){
    if(apiReg == "registry"){
      var data = req.url.split("/").filter(elemento => elemento !== '');
      if(data.length >= 1){
        if(data[0] == "get"){
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(proxyPorts));
        }else{
          if(data[0] == "set"){
            if(data.length >= proxyPorts[apiReg]){
              if (!isNaN(data[2]) || data[1] != "registry") {
                 proxyPorts[data[1]] = data[2];
                 fs.writeFile("apiReg.json", JSON.stringify(proxyPorts),(e)=>{});
                 res.writeHead(200, { 'Content-Type': 'application/json' });
                 res.end('{"estado":"0","mensaje":"OK"}');
              } else {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end('{"estado":"400","mensaje":"Parametro '+data[2]+' incorrecto, no es númerico"}');
              }
            }else{
               res.writeHead(400, { 'Content-Type': 'application/json' });
               res.end('{"estado":"400","mensaje":"Parametros incompletos para el registro"}');
            }  
          }else{
              if(data[0] == "del"){
                  if(data[1] != "registry"){
                    delete  proxyPorts[data[1]];
                    fs.writeFile("apiReg.json", JSON.stringify(proxyPorts),(e)=>{});
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end('{"estado":"0","mensaje":"OK"}');
                  }
              }else{
                   if(data[0] == "exit"){
                      res.writeHead(200, { 'Content-Type': 'application/json' });
                      res.end('{"estado":"0","mensaje":"OK"}'); 
                      process.exit(0);
                  }else{
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end('{"estado":"404","mensaje":"Comando '+data[0]+' no encontrado"}');
                  }
              }
          }
        } 
      }else{   
         res.writeHead(400, { 'Content-Type': 'application/json' });
         res.end('{"estado":"400","mensaje":"Parametros incompletos"}');
      }    
    }else{
      // Realizar la solicitud al servidor backend seleccionado
      proxy.web(req, res, {
        target: `http://localhost:${proxyPorts[apiReg]}`,
      });
    }
  }
  else{
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end('{"estado":"404","mensaje":"Servicio '+req.url.split("/")[1]+' no registrado"}');
  }

  proxy.on('error', (err, req, res) => {
    //console.error('Error en el proxy:', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
   res.end('{"estado":"500","mensaje":"Error interno: '+err+'"}');
  });
});

if (fs.existsSync("apiReg.json")) {
  let jsonCont = fs.readFileSync("apiReg.json", 'utf8');
  if(jsonCont != "")
    proxyPorts = Object.assign({}, proxyPorts, JSON.parse(jsonCont));
  else   
    fs.writeFile("apiReg.json", JSON.stringify(proxyPorts),(e)=>{}); 
} else {
  fs.writeFile("apiReg.json", JSON.stringify(proxyPorts),(e)=>{});
}

help();

server.listen(port, () => {
  console.log(" -----------------------------------------------------------------");
  console.log(`| BaPu escuchando en -> ${port}                                      |`);
  console.log(" -----------------------------------------------------------------");
});

function help(){
  console.log("    ------------------------------------------------------------");
  console.log("   |                     _  ->                                  |");
  console.log("   |                 -> |_| -> BaPu v1.0                        |");
  console.log("   |                        ->                                  |");
  console.log("   |------------------------------------------------------------|");
  console.log("   |                Balanceador de Puertos                      |");
  console.log("   |        mediante una relación prefijo url a puerto          |");
  console.log("    ------------------------------------------------------------");
  console.log(" -----------------------------------------------------------------");
  console.log("|                         Ayuda                                   |");
  console.log(`| http://localhost:${port}  -> Host de invocación                   |`);
  console.log("|                                                                 |");
  console.log("| /registry/get -> Obtiene los prefijos configurados              |");
  console.log(`| /registry/set/{servicio}/{8080} -> Configura prefijo "servicio" |`);
  console.log('|                                    al puerto "8080"             |');
  console.log('| /registry/det/{servicio} -> Elimina prefijos "servicio"         |');
  console.log("| /registry/exit -> Cierra la aplicación de BaPu                  |");
  console.log("|                                                                 |");
  console.log('| /{servicio}/ -> Llamado de "servicio" configurado               |');
  console.log("|                                                                 |");
  console.log(" -----------------------------------------------------------------");
}