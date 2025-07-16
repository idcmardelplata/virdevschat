# Muestra este menú
default:
  ./just --list

# Inicializa el contenedor de flagd si esta detenido o no se encuentra.
test-flagd:
  #!/usr/bin/env bash
  if  [[ ! `docker ps | grep flagd` ]]; then
    if [[ `docker ps -a | grep flagd | grep 'Exited'` ]]; then
      echo "El contenedor no esta en ejecucion" 
      echo "Iniciando..." 
      docker start flagd
    else
      echo "Iniciando flagd"
      docker run --name=flagd -p 8013:8013 -d -v $(pwd)/server:/etc/flagd/ -it ghcr.io/open-feature/flagd:latest start --uri file:/etc/flagd/flags.flagd.json
    fi
  else
    echo "Flagd esta ejecutandose correctamente"
  fi

# Ejecuta algunas tareas e inicializa el servidor
[working-directory: 'server']
server: test-flagd
  npm install
  npm run clean
  npm run lint
  npm run test:unit
  npm run server



