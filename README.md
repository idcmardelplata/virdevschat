# Simple chat application

Este proyecto nacio de una mentoria personalizada, donde comenzamos a ver
websockets y terminamos creando este hermoso chat. Si bien el proyecto todavia
esta en desarrollo, poco a poco iremos agregarndo nuevas caracteristicas, pero 
por ahora no esta listo para funcionar en produccion.

## Deployment

Este proyecto se divide en 2 areas; un servidor y un cliente.
Para ponerlo en marcha solo hace falta ejecutar el script `setup`
con el parametro deseado `--server` para poner en marcha el servidor 
o `--client` para lanzar una instancia de un cliente. Tambien hemos agregado
un flag `-all`para iniciar tanto un cliente como un servidor.

Para ejecutar este proyecto, primero debe
darle permisos de ejecucion al script, esto
lo logra con el comando `chmod `x ./setup`
luego haga:

```bash
  ./setup --all`
```
