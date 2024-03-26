<img src="https://github.com/bernardosegura/BaPu/blob/master/logo.png"/>

# BaPu

Es un Balanceador de Puertos que se fundamenta en la relación de prefijo en la URL. Esta solución ofrece una manera sencilla de gestionar los servicios en un servidor, permitiendo que sean accedidos a través de la misma URL, pero con prefijos distintos. BaPu utiliza esta relación de prefijo en la URL para dirigir las solicitudes entrantes a los puertos correspondientes en el servidor donde está alojado.

# Ejecución de código fuente

💻 __Windows__
```cmd
C:\Users\usuario\BaPu>npm install  
C:\Users\usuario\BaPu>npm start [puerto de escucha http, si se omite por default es 3000] 
```
🐧 __Linux__, 🖥️ __Mac OS__ y ⚙️ __ARM__
```bash
usuario@equipo:~/BaPu$ npm install
usuario@equipo:~/BaPu$ npm start [puerto de escucha http, si se omite por default es 3000] 
```
# Construcción de Binario

💻 __Windows__
```cmd
C:\Users\usuario\BaPu>npm run build:win
```
🐧 __Linux__
```bash
usuario@equipo:~/BaPu$ npm run build:linux
```
🖥️ __Mac OS__
```bash
usuario@equipo:~/BaPu$ npm run build:mac
```
⚙️ __ARM__
```bash
usuario@equipo:~/BaPu$ npm run build:arm
```

# Acceso a la Plataforma

Desde tu navegador preferido ingresa a 

__http://[server]:[puerto de escucha http, si se omite por default es 3000]/registry/[opcion]/__ 
__Ó__
__http://[server]:[puerto de escucha http, si se omite por default es 3000]/[nombre de servicio configurado]/__ 

ejemplo
```
http://localhost:3000/registry/get o http://localhost:3000/servicio
```
