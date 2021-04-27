DOWNLOAD_URL=$1
name=${DOWNLOAD_URL##*/}
curl ${DOWNLOAD_URL} > ${name} -s -x 127.0.0.1:1080
