mkdir -p .local/cert
cd .local/cert
openssl req -nodes -new -x509 -keyout privkey.pem -out cert.pem