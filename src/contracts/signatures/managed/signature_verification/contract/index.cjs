'use strict';
const __compactRuntime = require('@midnight-ntwrk/compact-runtime');
const expectedRuntimeVersionString = '0.7.0';
const expectedRuntimeVersion = expectedRuntimeVersionString.split('-')[0].split('.').map(Number);
const actualRuntimeVersion = __compactRuntime.versionString.split('-')[0].split('.').map(Number);
if (expectedRuntimeVersion[0] != actualRuntimeVersion[0]
     || (actualRuntimeVersion[0] == 0 && expectedRuntimeVersion[1] != actualRuntimeVersion[1])
     || expectedRuntimeVersion[1] > actualRuntimeVersion[1]
     || (expectedRuntimeVersion[1] == actualRuntimeVersion[1] && expectedRuntimeVersion[2] > actualRuntimeVersion[2]))
   throw new __compactRuntime.CompactError(`Version mismatch: compiled code expects ${expectedRuntimeVersionString}, runtime is ${__compactRuntime.versionString}`);
{ const MAX_FIELD = 102211695604070082112571065507755096754575920209623522239390234855480569854275933742834077002685857629445612735086326265689167708028928n;
  if (__compactRuntime.MAX_FIELD !== MAX_FIELD)
     throw new __compactRuntime.CompactError(`compiler thinks maximum field value is ${MAX_FIELD}; run time thinks it is ${__compactRuntime.MAX_FIELD}`)
}

var DocumentType;
(function (DocumentType) {
  DocumentType[DocumentType['Basic'] = 0] = 'Basic';
  DocumentType[DocumentType['Legal'] = 1] = 'Legal';
  DocumentType[DocumentType['Regulated'] = 2] = 'Regulated';
})(DocumentType = exports.DocumentType || (exports.DocumentType = {}));

const _descriptor_0 = new __compactRuntime.CompactTypeBytes(32);

const _descriptor_1 = new __compactRuntime.CompactTypeEnum(2, 1);

const _descriptor_2 = new __compactRuntime.CompactTypeField();

const _descriptor_3 = new __compactRuntime.CompactTypeUnsignedInteger(18446744073709551615n, 8);

const _descriptor_4 = new __compactRuntime.CompactTypeUnsignedInteger(255n, 1);

class _DocumentMetadata_0 {
  alignment() {
    return _descriptor_1.alignment().concat(_descriptor_0.alignment().concat(_descriptor_2.alignment().concat(_descriptor_3.alignment().concat(_descriptor_3.alignment().concat(_descriptor_4.alignment())))));
  }
  fromValue(value_0) {
    return {
      documentType: _descriptor_1.fromValue(value_0),
      ownerCommitment: _descriptor_0.fromValue(value_0),
      multiParty: _descriptor_2.fromValue(value_0),
      requiredSignatures: _descriptor_3.fromValue(value_0),
      signerCount: _descriptor_3.fromValue(value_0),
      version: _descriptor_4.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_1.toValue(value_0.documentType).concat(_descriptor_0.toValue(value_0.ownerCommitment).concat(_descriptor_2.toValue(value_0.multiParty).concat(_descriptor_3.toValue(value_0.requiredSignatures).concat(_descriptor_3.toValue(value_0.signerCount).concat(_descriptor_4.toValue(value_0.version))))));
  }
}

const _descriptor_5 = new _DocumentMetadata_0();

const _descriptor_6 = new __compactRuntime.CompactTypeBoolean();

class _SignatureEntry_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment()))));
  }
  fromValue(value_0) {
    return {
      documentHash: _descriptor_0.fromValue(value_0),
      signerCommitment: _descriptor_0.fromValue(value_0),
      proof: _descriptor_0.fromValue(value_0),
      nullifierHash: _descriptor_0.fromValue(value_0),
      timestamp: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.documentHash).concat(_descriptor_0.toValue(value_0.signerCommitment).concat(_descriptor_0.toValue(value_0.proof).concat(_descriptor_0.toValue(value_0.nullifierHash).concat(_descriptor_0.toValue(value_0.timestamp)))));
  }
}

const _descriptor_7 = new _SignatureEntry_0();

const _descriptor_8 = new __compactRuntime.CompactTypeVector(4, _descriptor_0);

const _descriptor_9 = new __compactRuntime.CompactTypeVector(2, _descriptor_0);

const _descriptor_10 = new __compactRuntime.CompactTypeVector(3, _descriptor_0);

class _ContractAddress_0 {
  alignment() {
    return _descriptor_0.alignment();
  }
  fromValue(value_0) {
    return {
      bytes: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.bytes);
  }
}

const _descriptor_11 = new _ContractAddress_0();

class Contract {
  witnesses;
  constructor(...args_0) {
    if (args_0.length !== 1)
      throw new __compactRuntime.CompactError(`Contract constructor: expected 1 argument, received ${args_0.length}`);
    const witnesses_0 = args_0[0];
    if (typeof(witnesses_0) !== 'object')
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor is not an object');
    if (typeof(witnesses_0.local_secret_key) !== 'function')
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named local_secret_key');
    this.witnesses = witnesses_0;
    this.circuits = {
      commit_to_did: (...args_1) => {
        if (args_1.length !== 2)
          throw new __compactRuntime.CompactError(`commit_to_did: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        const contextOrig_0 = args_1[0];
        const did_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.originalState != undefined && contextOrig_0.transactionContext != undefined))
          __compactRuntime.type_error('commit_to_did',
                                      'argument 1 (as invoked from Typescript)',
                                      'src/contracts/signatures/signature_verification.compact line 72, char 1',
                                      'CircuitContext',
                                      contextOrig_0)
        if (!(did_0.buffer instanceof ArrayBuffer && did_0.BYTES_PER_ELEMENT === 1 && did_0.length === 32))
          __compactRuntime.type_error('commit_to_did',
                                      'argument 1 (argument 2 as invoked from Typescript)',
                                      'src/contracts/signatures/signature_verification.compact line 72, char 1',
                                      'Bytes<32>',
                                      did_0)
        const context = { ...contextOrig_0 };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(did_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this.#_commit_to_did_0(context, partialProofData, did_0);
        partialProofData.output = { value: _descriptor_0.toValue(result_0), alignment: _descriptor_0.alignment() };
        return { result: result_0, context: context, proofData: partialProofData };
      },
      generate_nullifier: (...args_1) => {
        if (args_1.length !== 3)
          throw new __compactRuntime.CompactError(`generate_nullifier: expected 3 arguments (as invoked from Typescript), received ${args_1.length}`);
        const contextOrig_0 = args_1[0];
        const did_0 = args_1[1];
        const documentHash_0 = args_1[2];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.originalState != undefined && contextOrig_0.transactionContext != undefined))
          __compactRuntime.type_error('generate_nullifier',
                                      'argument 1 (as invoked from Typescript)',
                                      'src/contracts/signatures/signature_verification.compact line 85, char 1',
                                      'CircuitContext',
                                      contextOrig_0)
        if (!(did_0.buffer instanceof ArrayBuffer && did_0.BYTES_PER_ELEMENT === 1 && did_0.length === 32))
          __compactRuntime.type_error('generate_nullifier',
                                      'argument 1 (argument 2 as invoked from Typescript)',
                                      'src/contracts/signatures/signature_verification.compact line 85, char 1',
                                      'Bytes<32>',
                                      did_0)
        if (!(documentHash_0.buffer instanceof ArrayBuffer && documentHash_0.BYTES_PER_ELEMENT === 1 && documentHash_0.length === 32))
          __compactRuntime.type_error('generate_nullifier',
                                      'argument 2 (argument 3 as invoked from Typescript)',
                                      'src/contracts/signatures/signature_verification.compact line 85, char 1',
                                      'Bytes<32>',
                                      documentHash_0)
        const context = { ...contextOrig_0 };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(did_0).concat(_descriptor_0.toValue(documentHash_0)),
            alignment: _descriptor_0.alignment().concat(_descriptor_0.alignment())
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this.#_generate_nullifier_0(context,
                                                     partialProofData,
                                                     did_0,
                                                     documentHash_0);
        partialProofData.output = { value: _descriptor_0.toValue(result_0), alignment: _descriptor_0.alignment() };
        return { result: result_0, context: context, proofData: partialProofData };
      },
      get_version: (...args_1) => {
        if (args_1.length !== 1)
          throw new __compactRuntime.CompactError(`get_version: expected 1 argument (as invoked from Typescript), received ${args_1.length}`);
        const contextOrig_0 = args_1[0];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.originalState != undefined && contextOrig_0.transactionContext != undefined))
          __compactRuntime.type_error('get_version',
                                      'argument 1 (as invoked from Typescript)',
                                      'src/contracts/signatures/signature_verification.compact line 97, char 1',
                                      'CircuitContext',
                                      contextOrig_0)
        const context = { ...contextOrig_0 };
        const partialProofData = {
          input: { value: [], alignment: [] },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this.#_get_version_0(context, partialProofData);
        partialProofData.output = { value: _descriptor_0.toValue(result_0), alignment: _descriptor_0.alignment() };
        return { result: result_0, context: context, proofData: partialProofData };
      },
      registerDocument: (...args_1) => {
        if (args_1.length !== 6)
          throw new __compactRuntime.CompactError(`registerDocument: expected 6 arguments (as invoked from Typescript), received ${args_1.length}`);
        const contextOrig_0 = args_1[0];
        const documentHash_0 = args_1[1];
        const documentType_0 = args_1[2];
        const ownerDID_0 = args_1[3];
        const multiParty_0 = args_1[4];
        const requiredSignatures_0 = args_1[5];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.originalState != undefined && contextOrig_0.transactionContext != undefined))
          __compactRuntime.type_error('registerDocument',
                                      'argument 1 (as invoked from Typescript)',
                                      'src/contracts/signatures/signature_verification.compact line 105, char 1',
                                      'CircuitContext',
                                      contextOrig_0)
        if (!(documentHash_0.buffer instanceof ArrayBuffer && documentHash_0.BYTES_PER_ELEMENT === 1 && documentHash_0.length === 32))
          __compactRuntime.type_error('registerDocument',
                                      'argument 1 (argument 2 as invoked from Typescript)',
                                      'src/contracts/signatures/signature_verification.compact line 105, char 1',
                                      'Bytes<32>',
                                      documentHash_0)
        if (!(typeof(documentType_0) === 'number' && documentType_0 >= 0 && documentType_0 <= 2))
          __compactRuntime.type_error('registerDocument',
                                      'argument 2 (argument 3 as invoked from Typescript)',
                                      'src/contracts/signatures/signature_verification.compact line 105, char 1',
                                      'Enum<DocumentType, Basic, Legal, Regulated>',
                                      documentType_0)
        if (!(ownerDID_0.buffer instanceof ArrayBuffer && ownerDID_0.BYTES_PER_ELEMENT === 1 && ownerDID_0.length === 32))
          __compactRuntime.type_error('registerDocument',
                                      'argument 3 (argument 4 as invoked from Typescript)',
                                      'src/contracts/signatures/signature_verification.compact line 105, char 1',
                                      'Bytes<32>',
                                      ownerDID_0)
        if (!(typeof(multiParty_0) === 'bigint' && multiParty_0 >= 0 && multiParty_0 <= __compactRuntime.MAX_FIELD))
          __compactRuntime.type_error('registerDocument',
                                      'argument 4 (argument 5 as invoked from Typescript)',
                                      'src/contracts/signatures/signature_verification.compact line 105, char 1',
                                      'Field',
                                      multiParty_0)
        if (!(typeof(requiredSignatures_0) === 'bigint' && requiredSignatures_0 >= 0 && requiredSignatures_0 <= 18446744073709551615n))
          __compactRuntime.type_error('registerDocument',
                                      'argument 5 (argument 6 as invoked from Typescript)',
                                      'src/contracts/signatures/signature_verification.compact line 105, char 1',
                                      'Uint<0..18446744073709551615>',
                                      requiredSignatures_0)
        const context = { ...contextOrig_0 };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(documentHash_0).concat(_descriptor_1.toValue(documentType_0).concat(_descriptor_0.toValue(ownerDID_0).concat(_descriptor_2.toValue(multiParty_0).concat(_descriptor_3.toValue(requiredSignatures_0))))),
            alignment: _descriptor_0.alignment().concat(_descriptor_1.alignment().concat(_descriptor_0.alignment().concat(_descriptor_2.alignment().concat(_descriptor_3.alignment()))))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this.#_registerDocument_0(context,
                                                   partialProofData,
                                                   documentHash_0,
                                                   documentType_0,
                                                   ownerDID_0,
                                                   multiParty_0,
                                                   requiredSignatures_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData };
      },
      generate_signature_proof: (...args_1) => {
        if (args_1.length !== 3)
          throw new __compactRuntime.CompactError(`generate_signature_proof: expected 3 arguments (as invoked from Typescript), received ${args_1.length}`);
        const contextOrig_0 = args_1[0];
        const documentHash_0 = args_1[1];
        const signerDID_0 = args_1[2];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.originalState != undefined && contextOrig_0.transactionContext != undefined))
          __compactRuntime.type_error('generate_signature_proof',
                                      'argument 1 (as invoked from Typescript)',
                                      'src/contracts/signatures/signature_verification.compact line 132, char 1',
                                      'CircuitContext',
                                      contextOrig_0)
        if (!(documentHash_0.buffer instanceof ArrayBuffer && documentHash_0.BYTES_PER_ELEMENT === 1 && documentHash_0.length === 32))
          __compactRuntime.type_error('generate_signature_proof',
                                      'argument 1 (argument 2 as invoked from Typescript)',
                                      'src/contracts/signatures/signature_verification.compact line 132, char 1',
                                      'Bytes<32>',
                                      documentHash_0)
        if (!(signerDID_0.buffer instanceof ArrayBuffer && signerDID_0.BYTES_PER_ELEMENT === 1 && signerDID_0.length === 32))
          __compactRuntime.type_error('generate_signature_proof',
                                      'argument 2 (argument 3 as invoked from Typescript)',
                                      'src/contracts/signatures/signature_verification.compact line 132, char 1',
                                      'Bytes<32>',
                                      signerDID_0)
        const context = { ...contextOrig_0 };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(documentHash_0).concat(_descriptor_0.toValue(signerDID_0)),
            alignment: _descriptor_0.alignment().concat(_descriptor_0.alignment())
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this.#_generate_signature_proof_0(context,
                                                           partialProofData,
                                                           documentHash_0,
                                                           signerDID_0);
        partialProofData.output = { value: _descriptor_0.toValue(result_0), alignment: _descriptor_0.alignment() };
        return { result: result_0, context: context, proofData: partialProofData };
      },
      verify_signature_proof: (...args_1) => {
        if (args_1.length !== 5)
          throw new __compactRuntime.CompactError(`verify_signature_proof: expected 5 arguments (as invoked from Typescript), received ${args_1.length}`);
        const contextOrig_0 = args_1[0];
        const documentHash_0 = args_1[1];
        const signerCommitment_0 = args_1[2];
        const proof_0 = args_1[3];
        const nullifierHash_0 = args_1[4];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.originalState != undefined && contextOrig_0.transactionContext != undefined))
          __compactRuntime.type_error('verify_signature_proof',
                                      'argument 1 (as invoked from Typescript)',
                                      'src/contracts/signatures/signature_verification.compact line 150, char 1',
                                      'CircuitContext',
                                      contextOrig_0)
        if (!(documentHash_0.buffer instanceof ArrayBuffer && documentHash_0.BYTES_PER_ELEMENT === 1 && documentHash_0.length === 32))
          __compactRuntime.type_error('verify_signature_proof',
                                      'argument 1 (argument 2 as invoked from Typescript)',
                                      'src/contracts/signatures/signature_verification.compact line 150, char 1',
                                      'Bytes<32>',
                                      documentHash_0)
        if (!(signerCommitment_0.buffer instanceof ArrayBuffer && signerCommitment_0.BYTES_PER_ELEMENT === 1 && signerCommitment_0.length === 32))
          __compactRuntime.type_error('verify_signature_proof',
                                      'argument 2 (argument 3 as invoked from Typescript)',
                                      'src/contracts/signatures/signature_verification.compact line 150, char 1',
                                      'Bytes<32>',
                                      signerCommitment_0)
        if (!(proof_0.buffer instanceof ArrayBuffer && proof_0.BYTES_PER_ELEMENT === 1 && proof_0.length === 32))
          __compactRuntime.type_error('verify_signature_proof',
                                      'argument 3 (argument 4 as invoked from Typescript)',
                                      'src/contracts/signatures/signature_verification.compact line 150, char 1',
                                      'Bytes<32>',
                                      proof_0)
        if (!(nullifierHash_0.buffer instanceof ArrayBuffer && nullifierHash_0.BYTES_PER_ELEMENT === 1 && nullifierHash_0.length === 32))
          __compactRuntime.type_error('verify_signature_proof',
                                      'argument 4 (argument 5 as invoked from Typescript)',
                                      'src/contracts/signatures/signature_verification.compact line 150, char 1',
                                      'Bytes<32>',
                                      nullifierHash_0)
        const context = { ...contextOrig_0 };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(documentHash_0).concat(_descriptor_0.toValue(signerCommitment_0).concat(_descriptor_0.toValue(proof_0).concat(_descriptor_0.toValue(nullifierHash_0)))),
            alignment: _descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment())))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this.#_verify_signature_proof_0(context,
                                                         partialProofData,
                                                         documentHash_0,
                                                         signerCommitment_0,
                                                         proof_0,
                                                         nullifierHash_0);
        partialProofData.output = { value: _descriptor_2.toValue(result_0), alignment: _descriptor_2.alignment() };
        return { result: result_0, context: context, proofData: partialProofData };
      },
      signDocument: (...args_1) => {
        if (args_1.length !== 4)
          throw new __compactRuntime.CompactError(`signDocument: expected 4 arguments (as invoked from Typescript), received ${args_1.length}`);
        const contextOrig_0 = args_1[0];
        const documentHash_0 = args_1[1];
        const signerDID_0 = args_1[2];
        const proof_0 = args_1[3];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.originalState != undefined && contextOrig_0.transactionContext != undefined))
          __compactRuntime.type_error('signDocument',
                                      'argument 1 (as invoked from Typescript)',
                                      'src/contracts/signatures/signature_verification.compact line 167, char 1',
                                      'CircuitContext',
                                      contextOrig_0)
        if (!(documentHash_0.buffer instanceof ArrayBuffer && documentHash_0.BYTES_PER_ELEMENT === 1 && documentHash_0.length === 32))
          __compactRuntime.type_error('signDocument',
                                      'argument 1 (argument 2 as invoked from Typescript)',
                                      'src/contracts/signatures/signature_verification.compact line 167, char 1',
                                      'Bytes<32>',
                                      documentHash_0)
        if (!(signerDID_0.buffer instanceof ArrayBuffer && signerDID_0.BYTES_PER_ELEMENT === 1 && signerDID_0.length === 32))
          __compactRuntime.type_error('signDocument',
                                      'argument 2 (argument 3 as invoked from Typescript)',
                                      'src/contracts/signatures/signature_verification.compact line 167, char 1',
                                      'Bytes<32>',
                                      signerDID_0)
        if (!(proof_0.buffer instanceof ArrayBuffer && proof_0.BYTES_PER_ELEMENT === 1 && proof_0.length === 32))
          __compactRuntime.type_error('signDocument',
                                      'argument 3 (argument 4 as invoked from Typescript)',
                                      'src/contracts/signatures/signature_verification.compact line 167, char 1',
                                      'Bytes<32>',
                                      proof_0)
        const context = { ...contextOrig_0 };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(documentHash_0).concat(_descriptor_0.toValue(signerDID_0).concat(_descriptor_0.toValue(proof_0))),
            alignment: _descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment()))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this.#_signDocument_0(context,
                                               partialProofData,
                                               documentHash_0,
                                               signerDID_0,
                                               proof_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData };
      },
      revokeDocument: (...args_1) => {
        if (args_1.length !== 3)
          throw new __compactRuntime.CompactError(`revokeDocument: expected 3 arguments (as invoked from Typescript), received ${args_1.length}`);
        const contextOrig_0 = args_1[0];
        const documentHash_0 = args_1[1];
        const ownerDID_0 = args_1[2];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.originalState != undefined && contextOrig_0.transactionContext != undefined))
          __compactRuntime.type_error('revokeDocument',
                                      'argument 1 (as invoked from Typescript)',
                                      'src/contracts/signatures/signature_verification.compact line 221, char 1',
                                      'CircuitContext',
                                      contextOrig_0)
        if (!(documentHash_0.buffer instanceof ArrayBuffer && documentHash_0.BYTES_PER_ELEMENT === 1 && documentHash_0.length === 32))
          __compactRuntime.type_error('revokeDocument',
                                      'argument 1 (argument 2 as invoked from Typescript)',
                                      'src/contracts/signatures/signature_verification.compact line 221, char 1',
                                      'Bytes<32>',
                                      documentHash_0)
        if (!(ownerDID_0.buffer instanceof ArrayBuffer && ownerDID_0.BYTES_PER_ELEMENT === 1 && ownerDID_0.length === 32))
          __compactRuntime.type_error('revokeDocument',
                                      'argument 2 (argument 3 as invoked from Typescript)',
                                      'src/contracts/signatures/signature_verification.compact line 221, char 1',
                                      'Bytes<32>',
                                      ownerDID_0)
        const context = { ...contextOrig_0 };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(documentHash_0).concat(_descriptor_0.toValue(ownerDID_0)),
            alignment: _descriptor_0.alignment().concat(_descriptor_0.alignment())
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this.#_revokeDocument_0(context,
                                                 partialProofData,
                                                 documentHash_0,
                                                 ownerDID_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData };
      },
      verifySignatures: (...args_1) => {
        if (args_1.length !== 2)
          throw new __compactRuntime.CompactError(`verifySignatures: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        const contextOrig_0 = args_1[0];
        const documentHash_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.originalState != undefined && contextOrig_0.transactionContext != undefined))
          __compactRuntime.type_error('verifySignatures',
                                      'argument 1 (as invoked from Typescript)',
                                      'src/contracts/signatures/signature_verification.compact line 239, char 1',
                                      'CircuitContext',
                                      contextOrig_0)
        if (!(documentHash_0.buffer instanceof ArrayBuffer && documentHash_0.BYTES_PER_ELEMENT === 1 && documentHash_0.length === 32))
          __compactRuntime.type_error('verifySignatures',
                                      'argument 1 (argument 2 as invoked from Typescript)',
                                      'src/contracts/signatures/signature_verification.compact line 239, char 1',
                                      'Bytes<32>',
                                      documentHash_0)
        const context = { ...contextOrig_0 };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(documentHash_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this.#_verifySignatures_0(context,
                                                   partialProofData,
                                                   documentHash_0);
        partialProofData.output = { value: _descriptor_2.toValue(result_0), alignment: _descriptor_2.alignment() };
        return { result: result_0, context: context, proofData: partialProofData };
      }
    };
    this.impureCircuits = {
      commit_to_did: this.circuits.commit_to_did,
      generate_nullifier: this.circuits.generate_nullifier,
      get_version: this.circuits.get_version,
      registerDocument: this.circuits.registerDocument,
      generate_signature_proof: this.circuits.generate_signature_proof,
      verify_signature_proof: this.circuits.verify_signature_proof,
      signDocument: this.circuits.signDocument,
      revokeDocument: this.circuits.revokeDocument,
      verifySignatures: this.circuits.verifySignatures
    };
  }
  initialState(...args_0) {
    if (args_0.length !== 1)
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 1 argument (as invoked from Typescript), received ${args_0.length}`);
    const constructorContext_0 = args_0[0];
    if (typeof(constructorContext_0) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'constructorContext' in argument 1 (as invoked from Typescript) to be an object`);
    }
    if (!('initialPrivateState' in constructorContext_0)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialPrivateState' in argument 1 (as invoked from Typescript)`);
    }
    if (!('initialZswapLocalState' in constructorContext_0)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript)`);
    }
    if (typeof(constructorContext_0.initialZswapLocalState) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript) to be an object`);
    }
    const state_0 = new __compactRuntime.ContractState();
    let stateValue_0 = __compactRuntime.StateValue.newArray();
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    state_0.data = stateValue_0;
    state_0.setOperation('commit_to_did', new __compactRuntime.ContractOperation());
    state_0.setOperation('generate_nullifier', new __compactRuntime.ContractOperation());
    state_0.setOperation('get_version', new __compactRuntime.ContractOperation());
    state_0.setOperation('registerDocument', new __compactRuntime.ContractOperation());
    state_0.setOperation('generate_signature_proof', new __compactRuntime.ContractOperation());
    state_0.setOperation('verify_signature_proof', new __compactRuntime.ContractOperation());
    state_0.setOperation('signDocument', new __compactRuntime.ContractOperation());
    state_0.setOperation('revokeDocument', new __compactRuntime.ContractOperation());
    state_0.setOperation('verifySignatures', new __compactRuntime.ContractOperation());
    const context = {
      originalState: state_0,
      currentPrivateState: constructorContext_0.initialPrivateState,
      currentZswapLocalState: constructorContext_0.initialZswapLocalState,
      transactionContext: new __compactRuntime.QueryContext(state_0.data, __compactRuntime.dummyContractAddress())
    };
    const partialProofData = {
      input: { value: [], alignment: [] },
      output: undefined,
      publicTranscript: [],
      privateTranscriptOutputs: []
    };
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(0n),
                                                                            alignment: _descriptor_4.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newMap(
                                        new __compactRuntime.StateMap()
                                      ).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(1n),
                                                                            alignment: _descriptor_4.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newMap(
                                        new __compactRuntime.StateMap()
                                      ).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(2n),
                                                                            alignment: _descriptor_4.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newMap(
                                        new __compactRuntime.StateMap()
                                      ).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(3n),
                                                                            alignment: _descriptor_4.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newMap(
                                        new __compactRuntime.StateMap()
                                      ).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(4n),
                                                                            alignment: _descriptor_4.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newMap(
                                        new __compactRuntime.StateMap()
                                      ).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(5n),
                                                                            alignment: _descriptor_4.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newMap(
                                        new __compactRuntime.StateMap()
                                      ).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    state_0.data = context.transactionContext.state;
    return {
      currentContractState: state_0,
      currentPrivateState: context.currentPrivateState,
      currentZswapLocalState: context.currentZswapLocalState
    }
  }
  #_persistent_hash_0(context, partialProofData, value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_10, value_0);
    return result_0;
  }
  #_persistent_hash_1(context, partialProofData, value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_8, value_0);
    return result_0;
  }
  #_persistent_hash_2(context, partialProofData, value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_9, value_0);
    return result_0;
  }
  #_local_secret_key_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.witnessContext(ledger(context.transactionContext.state), context.currentPrivateState, context.transactionContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.local_secret_key(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(result_0.buffer instanceof ArrayBuffer && result_0.BYTES_PER_ELEMENT === 1 && result_0.length === 32))
      __compactRuntime.type_error('local_secret_key',
                                  'return value',
                                  'src/contracts/signatures/signature_verification.compact line 69, char 1',
                                  'Bytes<32>',
                                  result_0)
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_0.toValue(result_0),
      alignment: _descriptor_0.alignment()
    });
    return result_0;
  }
  #_commit_to_did_0(context, partialProofData, did_0) {
    const sk_0 = this.#_local_secret_key_0(context, partialProofData);
    const randomness_0 = this.#_persistent_hash_2(context,
                                                  partialProofData,
                                                  [did_0, sk_0]);
    const commitment_0 = this.#_persistent_hash_0(context,
                                                  partialProofData,
                                                  [new Uint8Array([100, 105, 100, 58, 99, 111, 109, 109, 105, 116, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                                   did_0,
                                                   randomness_0]);
    return commitment_0;
  }
  #_generate_nullifier_0(context, partialProofData, did_0, documentHash_0) {
    const sk_0 = this.#_local_secret_key_0(context, partialProofData);
    const nullifier_0 = this.#_persistent_hash_1(context,
                                                 partialProofData,
                                                 [new Uint8Array([110, 117, 108, 108, 105, 102, 105, 101, 114, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                                  did_0,
                                                  documentHash_0,
                                                  sk_0]);
    return nullifier_0;
  }
  #_get_version_0(context, partialProofData) {
    const key_0 = new Uint8Array([118, 101, 114, 115, 105, 111, 110, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const current_0 = _descriptor_6.fromValue(Contract._query(context,
                                                              partialProofData,
                                                              [
                                                               { dup: { n: 0 } },
                                                               { idx: { cached: false,
                                                                        pushPath: false,
                                                                        path: [
                                                                               { tag: 'value',
                                                                                 value: { value: _descriptor_4.toValue(3n),
                                                                                          alignment: _descriptor_4.alignment() } }] } },
                                                               { push: { storage: false,
                                                                         value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                                                      alignment: _descriptor_0.alignment() }).encode() } },
                                                               'member',
                                                               { popeq: { cached: true,
                                                                          result: undefined } }]).value)?
                      _descriptor_3.fromValue(Contract._query(context,
                                                              partialProofData,
                                                              [
                                                               { dup: { n: 0 } },
                                                               { idx: { cached: false,
                                                                        pushPath: false,
                                                                        path: [
                                                                               { tag: 'value',
                                                                                 value: { value: _descriptor_4.toValue(3n),
                                                                                          alignment: _descriptor_4.alignment() } }] } },
                                                               { idx: { cached: false,
                                                                        pushPath: false,
                                                                        path: [
                                                                               { tag: 'value',
                                                                                 value: { value: _descriptor_0.toValue(key_0),
                                                                                          alignment: _descriptor_0.alignment() } }] } },
                                                               { popeq: { cached: false,
                                                                          result: undefined } }]).value)
                      :
                      0n;
    const next_0 = ((t1) => {
                     if (t1 > 18446744073709551615n)
                       throw new __compactRuntime.CompactError('src/contracts/signatures/signature_verification.compact line 100, char 18: cast from unsigned value to smaller unsigned value failed: ' + t1 + ' is greater than 18446744073709551615');
                     return t1;
                   })(current_0 + 1n);
    Contract._query(context,
                    partialProofData,
                    [
                     { idx: { cached: false,
                              pushPath: true,
                              path: [
                                     { tag: 'value',
                                       value: { value: _descriptor_4.toValue(3n),
                                                alignment: _descriptor_4.alignment() } }] } },
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                            alignment: _descriptor_0.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(next_0),
                                                                            alignment: _descriptor_3.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } },
                     { ins: { cached: true, n: 1 } }]);
    return this.#_persistent_hash_2(context,
                                    partialProofData,
                                    [key_0,
                                     new Uint8Array([118, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])]);
  }
  #_registerDocument_0(context,
                       partialProofData,
                       documentHash_0,
                       documentType_0,
                       ownerDID_0,
                       multiParty_0,
                       requiredSignatures_0)
  {
    __compactRuntime.assert(!this.#_equal_0(documentHash_0,
                                            new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])),
                            'Invalid document hash');
    __compactRuntime.assert(!_descriptor_6.fromValue(Contract._query(context,
                                                                     partialProofData,
                                                                     [
                                                                      { dup: { n: 0 } },
                                                                      { idx: { cached: false,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_4.toValue(0n),
                                                                                                 alignment: _descriptor_4.alignment() } }] } },
                                                                      { push: { storage: false,
                                                                                value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(documentHash_0),
                                                                                                                             alignment: _descriptor_0.alignment() }).encode() } },
                                                                      'member',
                                                                      { popeq: { cached: true,
                                                                                 result: undefined } }]).value),
                            'Document already registered');
    const ownerCommitment_0 = this.#_commit_to_did_0(context,
                                                     partialProofData,
                                                     ownerDID_0);
    const tmp_0 = { documentType: documentType_0,
                    ownerCommitment: ownerCommitment_0,
                    multiParty: multiParty_0,
                    requiredSignatures: requiredSignatures_0,
                    signerCount: 0n,
                    version: 1n };
    Contract._query(context,
                    partialProofData,
                    [
                     { idx: { cached: false,
                              pushPath: true,
                              path: [
                                     { tag: 'value',
                                       value: { value: _descriptor_4.toValue(0n),
                                                alignment: _descriptor_4.alignment() } }] } },
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(documentHash_0),
                                                                            alignment: _descriptor_0.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(tmp_0),
                                                                            alignment: _descriptor_5.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } },
                     { ins: { cached: true, n: 1 } }]);
    const tmp_1 = 0n;
    Contract._query(context,
                    partialProofData,
                    [
                     { idx: { cached: false,
                              pushPath: true,
                              path: [
                                     { tag: 'value',
                                       value: { value: _descriptor_4.toValue(4n),
                                                alignment: _descriptor_4.alignment() } }] } },
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(documentHash_0),
                                                                            alignment: _descriptor_0.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(tmp_1),
                                                                            alignment: _descriptor_3.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } },
                     { ins: { cached: true, n: 1 } }]);
    this.#_get_version_0(context, partialProofData);
    return [];
  }
  #_generate_signature_proof_0(context,
                               partialProofData,
                               documentHash_0,
                               signerDID_0)
  {
    const sk_0 = this.#_local_secret_key_0(context, partialProofData);
    const signerCommitment_0 = this.#_commit_to_did_0(context,
                                                      partialProofData,
                                                      signerDID_0);
    const nullifier_0 = this.#_generate_nullifier_0(context,
                                                    partialProofData,
                                                    signerDID_0,
                                                    documentHash_0);
    const proof_0 = this.#_persistent_hash_1(context,
                                             partialProofData,
                                             [documentHash_0,
                                              signerCommitment_0,
                                              nullifier_0,
                                              sk_0]);
    return proof_0;
  }
  #_verify_signature_proof_0(context,
                             partialProofData,
                             documentHash_0,
                             signerCommitment_0,
                             proof_0,
                             nullifierHash_0)
  {
    const sk_0 = this.#_local_secret_key_0(context, partialProofData);
    const expected_0 = this.#_persistent_hash_1(context,
                                                partialProofData,
                                                [documentHash_0,
                                                 signerCommitment_0,
                                                 nullifierHash_0,
                                                 sk_0]);
    return this.#_equal_1(proof_0, expected_0)? 1n : 0n;
  }
  #_signDocument_0(context,
                   partialProofData,
                   documentHash_0,
                   signerDID_0,
                   proof_0)
  {
    __compactRuntime.assert(_descriptor_6.fromValue(Contract._query(context,
                                                                    partialProofData,
                                                                    [
                                                                     { dup: { n: 0 } },
                                                                     { idx: { cached: false,
                                                                              pushPath: false,
                                                                              path: [
                                                                                     { tag: 'value',
                                                                                       value: { value: _descriptor_4.toValue(0n),
                                                                                                alignment: _descriptor_4.alignment() } }] } },
                                                                     { push: { storage: false,
                                                                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(documentHash_0),
                                                                                                                            alignment: _descriptor_0.alignment() }).encode() } },
                                                                     'member',
                                                                     { popeq: { cached: true,
                                                                                result: undefined } }]).value),
                            'Document not found');
    __compactRuntime.assert(!_descriptor_6.fromValue(Contract._query(context,
                                                                     partialProofData,
                                                                     [
                                                                      { dup: { n: 0 } },
                                                                      { idx: { cached: false,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_4.toValue(2n),
                                                                                                 alignment: _descriptor_4.alignment() } }] } },
                                                                      { push: { storage: false,
                                                                                value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(documentHash_0),
                                                                                                                             alignment: _descriptor_0.alignment() }).encode() } },
                                                                      'member',
                                                                      { popeq: { cached: true,
                                                                                 result: undefined } }]).value),
                            'Document is revoked');
    const doc_0 = _descriptor_5.fromValue(Contract._query(context,
                                                          partialProofData,
                                                          [
                                                           { dup: { n: 0 } },
                                                           { idx: { cached: false,
                                                                    pushPath: false,
                                                                    path: [
                                                                           { tag: 'value',
                                                                             value: { value: _descriptor_4.toValue(0n),
                                                                                      alignment: _descriptor_4.alignment() } }] } },
                                                           { idx: { cached: false,
                                                                    pushPath: false,
                                                                    path: [
                                                                           { tag: 'value',
                                                                             value: { value: _descriptor_0.toValue(documentHash_0),
                                                                                      alignment: _descriptor_0.alignment() } }] } },
                                                           { popeq: { cached: false,
                                                                      result: undefined } }]).value);
    const signerCommitment_0 = this.#_commit_to_did_0(context,
                                                      partialProofData,
                                                      signerDID_0);
    const nullifier_0 = this.#_generate_nullifier_0(context,
                                                    partialProofData,
                                                    signerDID_0,
                                                    documentHash_0);
    const nullifierHash_0 = this.#_persistent_hash_2(context,
                                                     partialProofData,
                                                     [new Uint8Array([110, 104, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                                      nullifier_0]);
    __compactRuntime.assert(!_descriptor_6.fromValue(Contract._query(context,
                                                                     partialProofData,
                                                                     [
                                                                      { dup: { n: 0 } },
                                                                      { idx: { cached: false,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_4.toValue(5n),
                                                                                                 alignment: _descriptor_4.alignment() } }] } },
                                                                      { push: { storage: false,
                                                                                value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(nullifierHash_0),
                                                                                                                             alignment: _descriptor_0.alignment() }).encode() } },
                                                                      'member',
                                                                      { popeq: { cached: true,
                                                                                 result: undefined } }]).value),
                            'Signature already exists');
    if (!(doc_0.multiParty === 0n)) {
      __compactRuntime.assert(doc_0.signerCount < doc_0.requiredSignatures,
                              'All required signatures collected');
    }
    const timestamp_0 = this.#_get_version_0(context, partialProofData);
    const currentCount_0 = _descriptor_3.fromValue(Contract._query(context,
                                                                   partialProofData,
                                                                   [
                                                                    { dup: { n: 0 } },
                                                                    { idx: { cached: false,
                                                                             pushPath: false,
                                                                             path: [
                                                                                    { tag: 'value',
                                                                                      value: { value: _descriptor_4.toValue(4n),
                                                                                               alignment: _descriptor_4.alignment() } }] } },
                                                                    { idx: { cached: false,
                                                                             pushPath: false,
                                                                             path: [
                                                                                    { tag: 'value',
                                                                                      value: { value: _descriptor_0.toValue(documentHash_0),
                                                                                               alignment: _descriptor_0.alignment() } }] } },
                                                                    { popeq: { cached: false,
                                                                               result: undefined } }]).value);
    const newCount_0 = ((t1) => {
                         if (t1 > 18446744073709551615n)
                           throw new __compactRuntime.CompactError('src/contracts/signatures/signature_verification.compact line 191, char 22: cast from unsigned value to smaller unsigned value failed: ' + t1 + ' is greater than 18446744073709551615');
                         return t1;
                       })(currentCount_0 + 1n);
    Contract._query(context,
                    partialProofData,
                    [
                     { idx: { cached: false,
                              pushPath: true,
                              path: [
                                     { tag: 'value',
                                       value: { value: _descriptor_4.toValue(5n),
                                                alignment: _descriptor_4.alignment() } }] } },
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(nullifierHash_0),
                                                                            alignment: _descriptor_0.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newNull().encode() } },
                     { ins: { cached: false, n: 1 } },
                     { ins: { cached: true, n: 1 } }]);
    const tmp_0 = { documentHash: documentHash_0,
                    signerCommitment: signerCommitment_0,
                    proof: proof_0,
                    nullifierHash: nullifierHash_0,
                    timestamp: timestamp_0 };
    Contract._query(context,
                    partialProofData,
                    [
                     { idx: { cached: false,
                              pushPath: true,
                              path: [
                                     { tag: 'value',
                                       value: { value: _descriptor_4.toValue(1n),
                                                alignment: _descriptor_4.alignment() } }] } },
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(nullifierHash_0),
                                                                            alignment: _descriptor_0.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(tmp_0),
                                                                            alignment: _descriptor_7.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } },
                     { ins: { cached: true, n: 1 } }]);
    Contract._query(context,
                    partialProofData,
                    [
                     { idx: { cached: false,
                              pushPath: true,
                              path: [
                                     { tag: 'value',
                                       value: { value: _descriptor_4.toValue(4n),
                                                alignment: _descriptor_4.alignment() } }] } },
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(documentHash_0),
                                                                            alignment: _descriptor_0.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(newCount_0),
                                                                            alignment: _descriptor_3.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } },
                     { ins: { cached: true, n: 1 } }]);
    const tmp_1 = { documentType: doc_0.documentType,
                    ownerCommitment: doc_0.ownerCommitment,
                    multiParty: doc_0.multiParty,
                    requiredSignatures: doc_0.requiredSignatures,
                    signerCount: newCount_0,
                    version: doc_0.version };
    Contract._query(context,
                    partialProofData,
                    [
                     { idx: { cached: false,
                              pushPath: true,
                              path: [
                                     { tag: 'value',
                                       value: { value: _descriptor_4.toValue(0n),
                                                alignment: _descriptor_4.alignment() } }] } },
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(documentHash_0),
                                                                            alignment: _descriptor_0.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(tmp_1),
                                                                            alignment: _descriptor_5.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } },
                     { ins: { cached: true, n: 1 } }]);
    return [];
  }
  #_revokeDocument_0(context, partialProofData, documentHash_0, ownerDID_0) {
    __compactRuntime.assert(_descriptor_6.fromValue(Contract._query(context,
                                                                    partialProofData,
                                                                    [
                                                                     { dup: { n: 0 } },
                                                                     { idx: { cached: false,
                                                                              pushPath: false,
                                                                              path: [
                                                                                     { tag: 'value',
                                                                                       value: { value: _descriptor_4.toValue(0n),
                                                                                                alignment: _descriptor_4.alignment() } }] } },
                                                                     { push: { storage: false,
                                                                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(documentHash_0),
                                                                                                                            alignment: _descriptor_0.alignment() }).encode() } },
                                                                     'member',
                                                                     { popeq: { cached: true,
                                                                                result: undefined } }]).value),
                            'Document not found');
    __compactRuntime.assert(!_descriptor_6.fromValue(Contract._query(context,
                                                                     partialProofData,
                                                                     [
                                                                      { dup: { n: 0 } },
                                                                      { idx: { cached: false,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_4.toValue(2n),
                                                                                                 alignment: _descriptor_4.alignment() } }] } },
                                                                      { push: { storage: false,
                                                                                value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(documentHash_0),
                                                                                                                             alignment: _descriptor_0.alignment() }).encode() } },
                                                                      'member',
                                                                      { popeq: { cached: true,
                                                                                 result: undefined } }]).value),
                            'Document already revoked');
    const doc_0 = _descriptor_5.fromValue(Contract._query(context,
                                                          partialProofData,
                                                          [
                                                           { dup: { n: 0 } },
                                                           { idx: { cached: false,
                                                                    pushPath: false,
                                                                    path: [
                                                                           { tag: 'value',
                                                                             value: { value: _descriptor_4.toValue(0n),
                                                                                      alignment: _descriptor_4.alignment() } }] } },
                                                           { idx: { cached: false,
                                                                    pushPath: false,
                                                                    path: [
                                                                           { tag: 'value',
                                                                             value: { value: _descriptor_0.toValue(documentHash_0),
                                                                                      alignment: _descriptor_0.alignment() } }] } },
                                                           { popeq: { cached: false,
                                                                      result: undefined } }]).value);
    const ownerCommitment_0 = this.#_commit_to_did_0(context,
                                                     partialProofData,
                                                     ownerDID_0);
    __compactRuntime.assert(this.#_equal_2(doc_0.ownerCommitment,
                                           ownerCommitment_0),
                            'Not document owner');
    Contract._query(context,
                    partialProofData,
                    [
                     { idx: { cached: false,
                              pushPath: true,
                              path: [
                                     { tag: 'value',
                                       value: { value: _descriptor_4.toValue(2n),
                                                alignment: _descriptor_4.alignment() } }] } },
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(documentHash_0),
                                                                            alignment: _descriptor_0.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newNull().encode() } },
                     { ins: { cached: false, n: 1 } },
                     { ins: { cached: true, n: 1 } }]);
    this.#_get_version_0(context, partialProofData);
    return [];
  }
  #_verifySignatures_0(context, partialProofData, documentHash_0) {
    __compactRuntime.assert(_descriptor_6.fromValue(Contract._query(context,
                                                                    partialProofData,
                                                                    [
                                                                     { dup: { n: 0 } },
                                                                     { idx: { cached: false,
                                                                              pushPath: false,
                                                                              path: [
                                                                                     { tag: 'value',
                                                                                       value: { value: _descriptor_4.toValue(0n),
                                                                                                alignment: _descriptor_4.alignment() } }] } },
                                                                     { push: { storage: false,
                                                                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(documentHash_0),
                                                                                                                            alignment: _descriptor_0.alignment() }).encode() } },
                                                                     'member',
                                                                     { popeq: { cached: true,
                                                                                result: undefined } }]).value),
                            'Document not found');
    const doc_0 = _descriptor_5.fromValue(Contract._query(context,
                                                          partialProofData,
                                                          [
                                                           { dup: { n: 0 } },
                                                           { idx: { cached: false,
                                                                    pushPath: false,
                                                                    path: [
                                                                           { tag: 'value',
                                                                             value: { value: _descriptor_4.toValue(0n),
                                                                                      alignment: _descriptor_4.alignment() } }] } },
                                                           { idx: { cached: false,
                                                                    pushPath: false,
                                                                    path: [
                                                                           { tag: 'value',
                                                                             value: { value: _descriptor_0.toValue(documentHash_0),
                                                                                      alignment: _descriptor_0.alignment() } }] } },
                                                           { popeq: { cached: false,
                                                                      result: undefined } }]).value);
    if (!(doc_0.multiParty === 0n)) {
      return !(doc_0.signerCount < doc_0.requiredSignatures)? 1n : 0n;
    } else {
      return 0n < doc_0.signerCount? 1n : 0n;
    }
  }
  #_equal_0(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) return false;
    return true;
  }
  #_equal_1(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) return false;
    return true;
  }
  #_equal_2(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) return false;
    return true;
  }
  static _query(context, partialProofData, prog) {
    var res;
    try {
      res = context.transactionContext.query(prog, __compactRuntime.CostModel.dummyCostModel());
    } catch (err) {
      throw new __compactRuntime.CompactError(err.toString());
    }
    context.transactionContext = res.context;
    var reads = res.events.filter((e) => e.tag === 'read');
    var i = 0;
    partialProofData.publicTranscript = partialProofData.publicTranscript.concat(prog.map((op) => {
      if(typeof(op) === 'object' && 'popeq' in op) {
        return { popeq: {
          ...op.popeq,
          result: reads[i++].content,
        } };
      } else {
        return op;
      }
    }));
    if(res.events.length == 1 && res.events[0].tag === 'read') {
      return res.events[0].content;
    } else {
      return res.events;
    }
  }
}
function ledger(state) {
  const context = {
    originalState: state,
    transactionContext: new __compactRuntime.QueryContext(state, __compactRuntime.dummyContractAddress())
  };
  const partialProofData = {
    input: { value: [], alignment: [] },
    output: undefined,
    publicTranscript: [],
    privateTranscriptOutputs: []
  };
  return {
  };
}
const _emptyContext = {
  originalState: new __compactRuntime.ContractState(),
  transactionContext: new __compactRuntime.QueryContext(new __compactRuntime.ContractState().data, __compactRuntime.dummyContractAddress())
};
const _dummyContract = new Contract({
  local_secret_key: (...args) => undefined
});
const pureCircuits = { };
const contractReferenceLocations = { tag: 'publicLedgerArray', indices: { } };
exports.Contract = Contract;
exports.ledger = ledger;
exports.pureCircuits = pureCircuits;
exports.contractReferenceLocations = contractReferenceLocations;
//# sourceMappingURL=index.cjs.map
