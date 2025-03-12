FROM ubuntu:22.04
ADD https://github.com/sass/dart-sass/releases/download/1.69.4/dart-sass-1.69.4-linux-x64.tar.gz /tmp
WORKDIR /opt
RUN tar -xf /tmp/dart-sass-1.69.4-linux-x64.tar.gz
ENTRYPOINT ["/opt/dart-sass/sass"]
