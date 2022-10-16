./network.sh down
export COMPOSE_PROJECT_NAME=docker
./network.sh up createChannel -ca -s couchdb
./network.sh deployCC -l javascript

