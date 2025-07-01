FROM golang:1.24-alpine
LABEL AUTHOR="Impervguin"

ARG BUILD_TARGET

RUN apk add --no-cache make && \
    mkdir /build
WORKDIR /build

COPY pkg/pgmigrator/ .

RUN go mod download && \
    make build BUILD_TARGET=${BUILD_TARGET}

ENV PATH="$PATH:/build"