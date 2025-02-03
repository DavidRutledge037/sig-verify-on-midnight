import fs from 'fs';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock fs.clone
fs.clone = function() {
    return Object.assign({}, this);
};

global.fs = fs; 