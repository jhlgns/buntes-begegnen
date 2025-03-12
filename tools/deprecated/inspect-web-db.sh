ssh bb "cd /opt/bb ; sudo docker compose cp web:/data/app.db .local/web.db" && \
    scp bb:/opt/bb/.local/web.db ~/Downloads/ && \
    sqlitebrowser ~/Downloads/web.db
