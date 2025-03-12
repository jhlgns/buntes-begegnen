host="bb"

echo "[Building docker compose stack]" && \
docker compose build && \

echo "[Pushing images to registry]" && \
docker compose push && \

echo "[Copying files to remote]" && \
scp -r docker-compose.yml proxy .local/gitlab-registry-token.txt $host:/opt/bb/ && \

echo "[Pulling and starting containers on remote server]" && \
ssh $host <<EOF
    cd /opt/bb && \
    cat gitlab-registry-token.txt | docker login -u jhlgns --password-stdin registry.gitlab.com && \
    docker compose pull && \
    docker compose down --remove-orphans && \
    docker compose --profile DO_NOT_START down --remove-orphans && \
    docker compose up -d --force-recreate
EOF

# TODO Certs sind nicht an der richtigen Stelle
