#!/bin/bash

# Install production dependencies
npm install --save \
    @cosmjs/proto-signing \
    @cosmjs/stargate \
    @noble/ed25519 \
    axios \
    cors \
    dotenv \
    express \
    mongodb \
    multiformats \
    react \
    react-dom

# Install development dependencies
npm install --save-dev \
    @types/cors \
    @types/express \
    @types/jest \
    @types/node \
    @types/react \
    @types/react-dom \
    jest \
    ts-jest \
    ts-node \
    typescript 