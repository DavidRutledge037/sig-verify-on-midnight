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

const _descriptor_0 = new __compactRuntime.CompactTypeBytes(32);

const _descriptor_1 = new __compactRuntime.CompactTypeField();

const _descriptor_2 = new __compactRuntime.CompactTypeEnum(2, 1);

class _SignatureRecord_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_1.alignment().concat(_descriptor_2.alignment()))));
  }
  fromValue(value_0) {
    return {
      signer: _descriptor_0.fromValue(value_0),
      document: _descriptor_0.fromValue(value_0),
      signature: _descriptor_0.fromValue(value_0),
      timestamp: _descriptor_1.fromValue(value_0),
      doc_type: _descriptor_2.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.signer).concat(_descriptor_0.toValue(value_0.document).concat(_descriptor_0.toValue(value_0.signature).concat(_descriptor_1.toValue(value_0.timestamp).concat(_descriptor_2.toValue(value_0.doc_type)))));
  }
}

const _descriptor_3 = new _SignatureRecord_0();

const _descriptor_4 = new __compactRuntime.CompactTypeBoolean();

const _descriptor_5 = new __compactRuntime.CompactTypeUnsignedInteger(18446744073709551615n, 8);

const _descriptor_6 = new __compactRuntime.CompactTypeUnsignedInteger(65535n, 2);

const _descriptor_7 = new __compactRuntime.CompactTypeUnsignedInteger(255n, 1);

const _descriptor_8 = new __compactRuntime.CompactTypeVector(4, _descriptor_0);

const _descriptor_9 = new __compactRuntime.CompactTypeVector(3, _descriptor_0);

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

const _descriptor_10 = new _ContractAddress_0();

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
      generate_key_proof: (...args_1) => {
        if (args_1.length !== 2)
          throw new __compactRuntime.CompactError(`generate_key_proof: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        const contextOrig_0 = args_1[0];
        const instance_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.originalState != undefined && contextOrig_0.transactionContext != undefined))
          __compactRuntime.type_error('generate_key_proof',
                                      'argument 1 (as invoked from Typescript)',
                                      'src/contracts/signatures/signature_circuit.compact line 29, char 1',
                                      'CircuitContext',
                                      contextOrig_0)
        if (!(instance_0.buffer instanceof ArrayBuffer && instance_0.BYTES_PER_ELEMENT === 1 && instance_0.length === 32))
          __compactRuntime.type_error('generate_key_proof',
                                      'argument 1 (argument 2 as invoked from Typescript)',
                                      'src/contracts/signatures/signature_circuit.compact line 29, char 1',
                                      'Bytes<32>',
                                      instance_0)
        const context = { ...contextOrig_0 };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(instance_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this.#_generate_key_proof_0(context,
                                                     partialProofData,
                                                     instance_0);
        partialProofData.output = { value: _descriptor_0.toValue(result_0), alignment: _descriptor_0.alignment() };
        return { result: result_0, context: context, proofData: partialProofData };
      },
      set_admin: (...args_1) => {
        if (args_1.length !== 2)
          throw new __compactRuntime.CompactError(`set_admin: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        const contextOrig_0 = args_1[0];
        const new_admin_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.originalState != undefined && contextOrig_0.transactionContext != undefined))
          __compactRuntime.type_error('set_admin',
                                      'argument 1 (as invoked from Typescript)',
                                      'src/contracts/signatures/signature_circuit.compact line 36, char 1',
                                      'CircuitContext',
                                      contextOrig_0)
        if (!(new_admin_0.buffer instanceof ArrayBuffer && new_admin_0.BYTES_PER_ELEMENT === 1 && new_admin_0.length === 32))
          __compactRuntime.type_error('set_admin',
                                      'argument 1 (argument 2 as invoked from Typescript)',
                                      'src/contracts/signatures/signature_circuit.compact line 36, char 1',
                                      'Bytes<32>',
                                      new_admin_0)
        const context = { ...contextOrig_0 };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(new_admin_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this.#_set_admin_0(context,
                                            partialProofData,
                                            new_admin_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData };
      },
      sign_document: (...args_1) => {
        if (args_1.length !== 4)
          throw new __compactRuntime.CompactError(`sign_document: expected 4 arguments (as invoked from Typescript), received ${args_1.length}`);
        const contextOrig_0 = args_1[0];
        const doc_0 = args_1[1];
        const did_0 = args_1[2];
        const doc_type_0 = args_1[3];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.originalState != undefined && contextOrig_0.transactionContext != undefined))
          __compactRuntime.type_error('sign_document',
                                      'argument 1 (as invoked from Typescript)',
                                      'src/contracts/signatures/signature_circuit.compact line 45, char 1',
                                      'CircuitContext',
                                      contextOrig_0)
        if (!(doc_0.buffer instanceof ArrayBuffer && doc_0.BYTES_PER_ELEMENT === 1 && doc_0.length === 32))
          __compactRuntime.type_error('sign_document',
                                      'argument 1 (argument 2 as invoked from Typescript)',
                                      'src/contracts/signatures/signature_circuit.compact line 45, char 1',
                                      'Bytes<32>',
                                      doc_0)
        if (!(did_0.buffer instanceof ArrayBuffer && did_0.BYTES_PER_ELEMENT === 1 && did_0.length === 32))
          __compactRuntime.type_error('sign_document',
                                      'argument 2 (argument 3 as invoked from Typescript)',
                                      'src/contracts/signatures/signature_circuit.compact line 45, char 1',
                                      'Bytes<32>',
                                      did_0)
        if (!(typeof(doc_type_0) === 'number' && doc_type_0 >= 0 && doc_type_0 <= 2))
          __compactRuntime.type_error('sign_document',
                                      'argument 3 (argument 4 as invoked from Typescript)',
                                      'src/contracts/signatures/signature_circuit.compact line 45, char 1',
                                      'Enum<DocumentType, Basic, Legal, Regulated>',
                                      doc_type_0)
        const context = { ...contextOrig_0 };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(doc_0).concat(_descriptor_0.toValue(did_0).concat(_descriptor_2.toValue(doc_type_0))),
            alignment: _descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_2.alignment()))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this.#_sign_document_0(context,
                                                partialProofData,
                                                doc_0,
                                                did_0,
                                                doc_type_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData };
      },
      commit_to_did: (...args_1) => {
        if (args_1.length !== 2)
          throw new __compactRuntime.CompactError(`commit_to_did: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        const contextOrig_0 = args_1[0];
        const did_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.originalState != undefined && contextOrig_0.transactionContext != undefined))
          __compactRuntime.type_error('commit_to_did',
                                      'argument 1 (as invoked from Typescript)',
                                      'src/contracts/signatures/signature_circuit.compact line 83, char 1',
                                      'CircuitContext',
                                      contextOrig_0)
        if (!(did_0.buffer instanceof ArrayBuffer && did_0.BYTES_PER_ELEMENT === 1 && did_0.length === 32))
          __compactRuntime.type_error('commit_to_did',
                                      'argument 1 (argument 2 as invoked from Typescript)',
                                      'src/contracts/signatures/signature_circuit.compact line 83, char 1',
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
      verify_signature: (...args_1) => {
        if (args_1.length !== 2)
          throw new __compactRuntime.CompactError(`verify_signature: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        const contextOrig_0 = args_1[0];
        const doc_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.originalState != undefined && contextOrig_0.transactionContext != undefined))
          __compactRuntime.type_error('verify_signature',
                                      'argument 1 (as invoked from Typescript)',
                                      'src/contracts/signatures/signature_circuit.compact line 90, char 1',
                                      'CircuitContext',
                                      contextOrig_0)
        if (!(doc_0.buffer instanceof ArrayBuffer && doc_0.BYTES_PER_ELEMENT === 1 && doc_0.length === 32))
          __compactRuntime.type_error('verify_signature',
                                      'argument 1 (argument 2 as invoked from Typescript)',
                                      'src/contracts/signatures/signature_circuit.compact line 90, char 1',
                                      'Bytes<32>',
                                      doc_0)
        const context = { ...contextOrig_0 };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(doc_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this.#_verify_signature_0(context,
                                                   partialProofData,
                                                   doc_0);
        partialProofData.output = { value: _descriptor_1.toValue(result_0), alignment: _descriptor_1.alignment() };
        return { result: result_0, context: context, proofData: partialProofData };
      }
    };
    this.impureCircuits = {
      generate_key_proof: this.circuits.generate_key_proof,
      set_admin: this.circuits.set_admin,
      sign_document: this.circuits.sign_document,
      commit_to_did: this.circuits.commit_to_did,
      verify_signature: this.circuits.verify_signature
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
    state_0.data = stateValue_0;
    state_0.setOperation('generate_key_proof', new __compactRuntime.ContractOperation());
    state_0.setOperation('set_admin', new __compactRuntime.ContractOperation());
    state_0.setOperation('sign_document', new __compactRuntime.ContractOperation());
    state_0.setOperation('commit_to_did', new __compactRuntime.ContractOperation());
    state_0.setOperation('verify_signature', new __compactRuntime.ContractOperation());
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
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(0n),
                                                                            alignment: _descriptor_7.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newMap(
                                        new __compactRuntime.StateMap()
                                      ).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(1n),
                                                                            alignment: _descriptor_7.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newMap(
                                        new __compactRuntime.StateMap()
                                      ).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(2n),
                                                                            alignment: _descriptor_7.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(new Uint8Array(32)),
                                                                            alignment: _descriptor_0.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(3n),
                                                                            alignment: _descriptor_7.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(0n),
                                                                            alignment: _descriptor_5.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    state_0.data = context.transactionContext.state;
    return {
      currentContractState: state_0,
      currentPrivateState: context.currentPrivateState,
      currentZswapLocalState: context.currentZswapLocalState
    }
  }
  #_persistent_hash_0(context, partialProofData, value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_8, value_0);
    return result_0;
  }
  #_persistent_hash_1(context, partialProofData, value_0) {
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
                                  'src/contracts/signatures/signature_circuit.compact line 27, char 1',
                                  'Bytes<32>',
                                  result_0)
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_0.toValue(result_0),
      alignment: _descriptor_0.alignment()
    });
    return result_0;
  }
  #_generate_key_proof_0(context, partialProofData, instance_0) {
    const sk_0 = this.#_local_secret_key_0(context, partialProofData);
    const proof_0 = this.#_persistent_hash_1(context,
                                             partialProofData,
                                             [new Uint8Array([115, 105, 103, 58, 112, 107, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                              instance_0,
                                              sk_0]);
    return proof_0;
  }
  #_set_admin_0(context, partialProofData, new_admin_0) {
    const current_proof_0 = this.#_generate_key_proof_0(context,
                                                        partialProofData,
                                                        __compactRuntime.convert_bigint_to_Uint8Array(32,
                                                                                                      _descriptor_5.fromValue(Contract._query(context,
                                                                                                                                              partialProofData,
                                                                                                                                              [
                                                                                                                                               { dup: { n: 0 } },
                                                                                                                                               { idx: { cached: false,
                                                                                                                                                        pushPath: false,
                                                                                                                                                        path: [
                                                                                                                                                               { tag: 'value',
                                                                                                                                                                 value: { value: _descriptor_7.toValue(3n),
                                                                                                                                                                          alignment: _descriptor_7.alignment() } }] } },
                                                                                                                                               { popeq: { cached: true,
                                                                                                                                                          result: undefined } }]).value)));
    __compactRuntime.assert(this.#_equal_0(_descriptor_0.fromValue(Contract._query(context,
                                                                                   partialProofData,
                                                                                   [
                                                                                    { dup: { n: 0 } },
                                                                                    { idx: { cached: false,
                                                                                             pushPath: false,
                                                                                             path: [
                                                                                                    { tag: 'value',
                                                                                                      value: { value: _descriptor_7.toValue(2n),
                                                                                                               alignment: _descriptor_7.alignment() } }] } },
                                                                                    { popeq: { cached: false,
                                                                                               result: undefined } }]).value),
                                           new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]))
                            ||
                            this.#_equal_1(_descriptor_0.fromValue(Contract._query(context,
                                                                                   partialProofData,
                                                                                   [
                                                                                    { dup: { n: 0 } },
                                                                                    { idx: { cached: false,
                                                                                             pushPath: false,
                                                                                             path: [
                                                                                                    { tag: 'value',
                                                                                                      value: { value: _descriptor_7.toValue(2n),
                                                                                                               alignment: _descriptor_7.alignment() } }] } },
                                                                                    { popeq: { cached: false,
                                                                                               result: undefined } }]).value),
                                           current_proof_0),
                            'Only current admin can set new admin');
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(2n),
                                                                            alignment: _descriptor_7.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(new_admin_0),
                                                                            alignment: _descriptor_0.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    return [];
  }
  #_sign_document_0(context, partialProofData, doc_0, did_0, doc_type_0) {
    __compactRuntime.assert(!_descriptor_4.fromValue(Contract._query(context,
                                                                     partialProofData,
                                                                     [
                                                                      { dup: { n: 0 } },
                                                                      { idx: { cached: false,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_7.toValue(0n),
                                                                                                 alignment: _descriptor_7.alignment() } }] } },
                                                                      { push: { storage: false,
                                                                                value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(doc_0),
                                                                                                                             alignment: _descriptor_0.alignment() }).encode() } },
                                                                      'member',
                                                                      { popeq: { cached: true,
                                                                                 result: undefined } }]).value),
                            'Document already signed');
    const kyc_level_0 = _descriptor_7.fromValue(Contract._query(context,
                                                                partialProofData,
                                                                [
                                                                 { dup: { n: 0 } },
                                                                 { idx: { cached: false,
                                                                          pushPath: false,
                                                                          path: [
                                                                                 { tag: 'value',
                                                                                   value: { value: _descriptor_7.toValue(1n),
                                                                                            alignment: _descriptor_7.alignment() } }] } },
                                                                 { idx: { cached: false,
                                                                          pushPath: false,
                                                                          path: [
                                                                                 { tag: 'value',
                                                                                   value: { value: _descriptor_0.toValue(did_0),
                                                                                            alignment: _descriptor_0.alignment() } }] } },
                                                                 { popeq: { cached: false,
                                                                            result: undefined } }]).value);
    __compactRuntime.assert(!(kyc_level_0
                              <
                              ((t1) => {
                                if (t1 > 255n)
                                  throw new __compactRuntime.CompactError('src/contracts/signatures/signature_circuit.compact line 52, char 25: cast from field value to Uint value failed: ' + t1 + ' is greater than 255');
                                return t1;
                              })(BigInt(doc_type_0))),
                            'Insufficient KYC level');
    const sk_0 = this.#_local_secret_key_0(context, partialProofData);
    const pk_0 = this.#_persistent_hash_1(context,
                                          partialProofData,
                                          [new Uint8Array([115, 105, 103, 58, 112, 107, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                           __compactRuntime.convert_bigint_to_Uint8Array(32,
                                                                                         _descriptor_5.fromValue(Contract._query(context,
                                                                                                                                 partialProofData,
                                                                                                                                 [
                                                                                                                                  { dup: { n: 0 } },
                                                                                                                                  { idx: { cached: false,
                                                                                                                                           pushPath: false,
                                                                                                                                           path: [
                                                                                                                                                  { tag: 'value',
                                                                                                                                                    value: { value: _descriptor_7.toValue(3n),
                                                                                                                                                             alignment: _descriptor_7.alignment() } }] } },
                                                                                                                                  { popeq: { cached: true,
                                                                                                                                             result: undefined } }]).value)),
                                           sk_0]);
    __compactRuntime.assert(this.#_equal_2(pk_0, did_0),
                            'DID verification failed');
    const sig_0 = this.#_persistent_hash_0(context,
                                           partialProofData,
                                           [new Uint8Array([115, 105, 103, 58, 115, 105, 103, 110, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                            doc_0,
                                            did_0,
                                            __compactRuntime.convert_bigint_to_Uint8Array(32,
                                                                                          _descriptor_5.fromValue(Contract._query(context,
                                                                                                                                  partialProofData,
                                                                                                                                  [
                                                                                                                                   { dup: { n: 0 } },
                                                                                                                                   { idx: { cached: false,
                                                                                                                                            pushPath: false,
                                                                                                                                            path: [
                                                                                                                                                   { tag: 'value',
                                                                                                                                                     value: { value: _descriptor_7.toValue(3n),
                                                                                                                                                              alignment: _descriptor_7.alignment() } }] } },
                                                                                                                                   { popeq: { cached: true,
                                                                                                                                              result: undefined } }]).value))]);
    const record_0 = { signer: did_0,
                       document: doc_0,
                       signature: sig_0,
                       timestamp:
                         _descriptor_5.fromValue(Contract._query(context,
                                                                 partialProofData,
                                                                 [
                                                                  { dup: { n: 0 } },
                                                                  { idx: { cached: false,
                                                                           pushPath: false,
                                                                           path: [
                                                                                  { tag: 'value',
                                                                                    value: { value: _descriptor_7.toValue(3n),
                                                                                             alignment: _descriptor_7.alignment() } }] } },
                                                                  { popeq: { cached: true,
                                                                             result: undefined } }]).value),
                       doc_type: doc_type_0 };
    Contract._query(context,
                    partialProofData,
                    [
                     { idx: { cached: false,
                              pushPath: true,
                              path: [
                                     { tag: 'value',
                                       value: { value: _descriptor_7.toValue(0n),
                                                alignment: _descriptor_7.alignment() } }] } },
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(doc_0),
                                                                            alignment: _descriptor_0.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(record_0),
                                                                            alignment: _descriptor_3.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } },
                     { ins: { cached: true, n: 1 } }]);
    const tmp_0 = 1n;
    Contract._query(context,
                    partialProofData,
                    [
                     { idx: { cached: false,
                              pushPath: true,
                              path: [
                                     { tag: 'value',
                                       value: { value: _descriptor_7.toValue(3n),
                                                alignment: _descriptor_7.alignment() } }] } },
                     { addi: { immediate: parseInt(__compactRuntime.valueToBigInt(
                                            { value: _descriptor_6.toValue(tmp_0),
                                              alignment: _descriptor_6.alignment() }
                                              .value
                                          )) } },
                     { ins: { cached: true, n: 1 } }]);
    return [];
  }
  #_commit_to_did_0(context, partialProofData, did_0) {
    const sk_0 = this.#_local_secret_key_0(context, partialProofData);
    const proof_0 = this.#_persistent_hash_1(context,
                                             partialProofData,
                                             [new Uint8Array([115, 105, 103, 58, 99, 111, 109, 109, 105, 116, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                              did_0,
                                              sk_0]);
    return proof_0;
  }
  #_verify_signature_0(context, partialProofData, doc_0) {
    __compactRuntime.assert(_descriptor_4.fromValue(Contract._query(context,
                                                                    partialProofData,
                                                                    [
                                                                     { dup: { n: 0 } },
                                                                     { idx: { cached: false,
                                                                              pushPath: false,
                                                                              path: [
                                                                                     { tag: 'value',
                                                                                       value: { value: _descriptor_7.toValue(0n),
                                                                                                alignment: _descriptor_7.alignment() } }] } },
                                                                     { push: { storage: false,
                                                                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(doc_0),
                                                                                                                            alignment: _descriptor_0.alignment() }).encode() } },
                                                                     'member',
                                                                     { popeq: { cached: true,
                                                                                result: undefined } }]).value),
                            'Document not signed');
    return 1n;
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
