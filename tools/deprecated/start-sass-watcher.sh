#docker build -t bb-web-sass-watcher -f sass-watcher.Dockerfile .
#docker run --rm -d -it --name bb-web-sass-watcher -v $PWD:/sass node bash -c 'npm install -g sass && cd /sass && sass --watch %s'

docker rm -f bundlor-web-sass-watcher

docker build -f ./tools/sass-watcher.Dockerfile -t bundlor-web-sass-watcher . && \
    docker run --rm -it \
        --name bundlor-web-sass-watcher \
        -u $(id -u) \
        -v $PWD/src/BuntesBegegnen.Api:/home/ubuntu/sass \
        bundlor-web-sass-watcher \
        --load-path /home/ubuntu/sass/Pages \
        --load-path /home/ubuntu/sass/Styles \
        --watch /home/ubuntu/sass/Styles/Main.scss:/home/ubuntu/sass/wwwroot/css/style.css
