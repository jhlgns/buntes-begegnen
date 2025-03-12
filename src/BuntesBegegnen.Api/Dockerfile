FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env

WORKDIR /source

COPY ./Directory.Build.props .
COPY ./src/BuntesBegegnen.Api/BuntesBegegnen.Api.csproj ./src/BuntesBegegnen.Api/BuntesBegegnen.Api.csproj
COPY ./ext/Bundlor.Lib.Hosting/Bundlor.Lib.Hosting.csproj ./ext/Bundlor.Lib.Hosting/Bundlor.Lib.Hosting.csproj
RUN dotnet restore ./src/BuntesBegegnen.Api

COPY ./src/BuntesBegegnen.Api ./src/BuntesBegegnen.Api
COPY ./ext/Bundlor.Lib.Hosting ./ext/Bundlor.Lib.Hosting
RUN dotnet publish -c Release -o /build ./src/BuntesBegegnen.Api


FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build-env /build .
RUN mkdir -p /data && chown -R app:app /data
RUN mkdir -p /home/app/.aspnet/DataProtection-Keys && chown -R app:app /home/app/.aspnet/DataProtection-Keys
USER app
ENTRYPOINT ["dotnet", "BuntesBegegnen.Api.dll"]
