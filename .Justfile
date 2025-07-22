# Muestra este menú
default:
  ./just --list

# Ejecuta algunas tareas e inicializa el servidor en modo desarrollo
[working-directory: 'server']
server:
  npm install
  npm run clean
  npm run lint
  npm run test:unit
  npm run server:dev

# Ejecuta tareas relacionadas al servidor en el CI
server-ci:
  dagger call linter --source server
  dagger call test --source server
  dagger call testendtoend --source server

# Sube la imagen del servidor a dockerhub.
publish-server: server-ci
  dagger call publish --source server


