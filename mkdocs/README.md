# Building

From the main folder:

```
$ docker build -t mkdocs -f mkdocs/Dockerfile .
```

# Example usage

```
$ docker run -it -p 8000:8000 -v $(pwd):/usr/src/mkdocs/build mkdocs serve --dev-addr 0.0.0.0:8000
```
