#Iniciar el cliente

# Show recipes
default:
  ./just --list

# Perform some tasks and run the server
[working-directory: 'server']
server:
  npm install
  npm run lint
  npm run test:unit
  npm run server
