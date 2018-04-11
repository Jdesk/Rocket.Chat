rm -fr bundle
docker build -t basitmustafa/ct-rocketchat:$1 -f .ct-docker-new/Dockerfile .
docker push basitmustafa/ct-rocketchat:$1
#kubectl patch deployment ct-rocketchat-staging -p "{\"spec\":{\"template\":{\"metadata\":{\"labels\":{\"date\":\"`date +'%s'`\"}}}}}" || true