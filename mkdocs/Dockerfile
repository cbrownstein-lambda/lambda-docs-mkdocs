FROM python:3.12.4-alpine
COPY requirements.txt /usr/local/requirements.txt
RUN adduser -h /usr/src/mkdocs -D -u 1001 mkdocs && \
    apk add bash gcc libc-dev libffi-dev git cairo
ENV PATH="$PATH:/usr/src/mkdocs/.local/bin"
USER mkdocs
RUN mkdir -p /usr/src/mkdocs/build && \
    pip install --upgrade pip && \
    pip install mkdocs-material=="9.*" && \
    pip install -r /usr/local/requirements.txt && \
    pip install mkdocs-techdocs-redirects && \
    git config --global --add safe.directory /usr/src/mkdocs/build
WORKDIR /usr/src/mkdocs/build
ENTRYPOINT ["/usr/src/mkdocs/.local/bin/mkdocs"]
