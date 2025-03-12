ssh bb "cd /opt/bb ; sudo docker compose cp teaser:/data/app.db .local/teaser.db" && \
    scp bb:/opt/bb/.local/teaser.db ~/Downloads/ && \
    echo "================" && \
    sqlite3 ~/Downloads/teaser.db "SELECT NormalizedEmailAddress FROM Subscribers"
