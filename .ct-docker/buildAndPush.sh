rm -fr bundle
meteor npm install
set +e 
 meteor add rocketchat:lib 
set -e
meteor build --server-only --directory .
docker build -t basitmustafa/ct-rocketchat -f .ct-docker/Dockerfile .
docker push basitmustafa/ct-rocketchat 
