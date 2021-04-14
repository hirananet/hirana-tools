nest build
cp -R resources dist/resources
docker build -t alexander171294/hira-client:tools-v2 .
docker push alexander171294/hira-client:tools-v2
