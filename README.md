# Wiener Schnitzler – Schnitzlers Wien



* data is fetched from https://github.com/wiener-moderne-verein/wienerschnitzler-data
* build with [DSE-Static-Cookiecutter](https://github.com/acdh-oeaw/dse-static-cookiecutter)


## initial (one time) setup

* run `./shellscripts/dl_saxon.sh`
* run `./fetch_data.sh`
* run `ant`


## start dev server

* `cd html/`
* `python -m http.server`
* go to [http://0.0.0.0:8000/](http://0.0.0.0:8000/)

## publish as GitHub Page

* got to https://https://github.com/wiener-moderne-verein/wienerschnitzler-static/workflows/build.yml 
* click the `Run workflow` button


## dockerize your application

* To build the image run: `docker build -t wienerschnitzler-static .`
* To run the container: `docker run -p 80:80 --rm --name wienerschnitzler-static wienerschnitzler-static`
* in case you want to password protect you server, create a `.htpasswd` file (e.g. https://htpasswdgenerator.de/) and modifiy `Dockerfile` to your needs; e.g. run `htpasswd -b -c .htpasswd admin mypassword`

### run image from GitHub Container Registry

`docker run -p 80:80 --rm --name wienerschnitzler-static ghcr.io/wiener-moderne-verein/wienerschnitzler-static:main`