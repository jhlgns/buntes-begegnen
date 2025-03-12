#!/usr/bin/env python3

import os
import shutil
import argparse

# NOTE(jh): To use --generator-image:
# 1. Check out your version or fork from https://github.com/OpenAPITools/openapi-generator
# 2. cd <openapi_generator_dir>
# 3. docker build -t <custom image name> .
# 4. generate-api-client.py --output-dir ... --generator-image <custom image name>

parser = argparse.ArgumentParser()
parser.add_argument("--output-dir", type=str, default="src/api-client")
parser.add_argument("--swagger-doc-url", type=str, default="https://localhost:8443/swagger/v1/swagger.json")
parser.add_argument("--generator-image", type=str, default="openapitools/openapi-generator-cli")
parser.add_argument("--npm-i-dir", type=str, default="src/api-client")
parser.add_argument("--no-download", action="store_true")

args = parser.parse_args()

print(f"Using output directory '{args.output_dir}'")
print(f"Using swagger document URL '{args.swagger_doc_url}'")
print(f"Using generator image '{args.generator_image}'")

# TODO @Security
if args.no_download == False:
    try: os.remove("swagger.json")
    except: pass

    exitcode = os.system(f"wget --no-check-certificate {args.swagger_doc_url}")
    if exitcode != 0:
        print(f"Failed to download swagger.json: {exitcode = }")
        exit(1)

shutil.rmtree(args.output_dir, ignore_errors=True)

user_arg = f" --user {os.getuid()}" if os.name == "posix" else ""
os.system(
    f"docker run --rm -v {os.getcwd()}:/local" +
    user_arg +
    f" {args.generator_image} generate" +
    " -i /local/swagger.json" +
    " -g typescript" +
    " --additional-properties=npmName=bundlor-web-api-client,npmVersion=1.0.0,supportsES6=true" +
    " --type-mappings='set=Array'" +
    f" -o /local/{args.output_dir}")

os.system(f"cd {args.output_dir} && npm i")

if args.npm_i_dir != None:
    print(f"Running: 'cd {args.npm_i_dir} && npm i'")
    os.system(f"cd {args.npm_i_dir} && npm i")

