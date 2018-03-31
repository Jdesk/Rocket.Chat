rm -fr bundle
docker build -t basitmustafa/ct-rocketchat:$1 -f .ct-docker-new/Dockerfile .
docker push basitmustafa/ct-rocketchat:$1
