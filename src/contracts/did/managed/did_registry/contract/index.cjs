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

class _VerificationMethod_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment()));
  }
  fromValue(value_0) {
    return {
      id: _descriptor_0.fromValue(value_0),
      controller: _descriptor_0.fromValue(value_0),
      publicKey: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.id).concat(_descriptor_0.toValue(value_0.controller).concat(_descriptor_0.toValue(value_0.publicKey)));
  }
}

const _descriptor_1 = new _VerificationMethod_0();

const _descriptor_2 = new __compactRuntime.CompactTypeVector(32, _descriptor_1);

class _Service_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment()));
  }
  fromValue(value_0) {
    return {
      id: _descriptor_0.fromValue(value_0),
      serviceType: _descriptor_0.fromValue(value_0),
      endpoint: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.id).concat(_descriptor_0.toValue(value_0.serviceType).concat(_descriptor_0.toValue(value_0.endpoint)));
  }
}

const _descriptor_3 = new _Service_0();

const _descriptor_4 = new __compactRuntime.CompactTypeVector(32, _descriptor_3);

class _DIDDocument_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_2.alignment().concat(_descriptor_4.alignment())));
  }
  fromValue(value_0) {
    return {
      id: _descriptor_0.fromValue(value_0),
      controller: _descriptor_0.fromValue(value_0),
      verificationMethods: _descriptor_2.fromValue(value_0),
      services: _descriptor_4.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.id).concat(_descriptor_0.toValue(value_0.controller).concat(_descriptor_2.toValue(value_0.verificationMethods).concat(_descriptor_4.toValue(value_0.services))));
  }
}

const _descriptor_5 = new _DIDDocument_0();

const _descriptor_6 = new __compactRuntime.CompactTypeBoolean();

const _descriptor_7 = new __compactRuntime.CompactTypeField();

const _descriptor_8 = new __compactRuntime.CompactTypeUnsignedInteger(18446744073709551615n, 8);

const _descriptor_9 = new __compactRuntime.CompactTypeUnsignedInteger(65535n, 2);

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

const _descriptor_12 = new __compactRuntime.CompactTypeUnsignedInteger(255n, 1);

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
                                      'src/contracts/did/did_registry.compact line 33, char 1',
                                      'CircuitContext',
                                      contextOrig_0)
        if (!(instance_0.buffer instanceof ArrayBuffer && instance_0.BYTES_PER_ELEMENT === 1 && instance_0.length === 32))
          __compactRuntime.type_error('generate_key_proof',
                                      'argument 1 (argument 2 as invoked from Typescript)',
                                      'src/contracts/did/did_registry.compact line 33, char 1',
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
      public_key: (...args_1) => {
        if (args_1.length !== 3)
          throw new __compactRuntime.CompactError(`public_key: expected 3 arguments (as invoked from Typescript), received ${args_1.length}`);
        const contextOrig_0 = args_1[0];
        const sk_0 = args_1[1];
        const instance_0 = args_1[2];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.originalState != undefined && contextOrig_0.transactionContext != undefined))
          __compactRuntime.type_error('public_key',
                                      'argument 1 (as invoked from Typescript)',
                                      'src/contracts/did/did_registry.compact line 39, char 1',
                                      'CircuitContext',
                                      contextOrig_0)
        if (!(sk_0.buffer instanceof ArrayBuffer && sk_0.BYTES_PER_ELEMENT === 1 && sk_0.length === 32))
          __compactRuntime.type_error('public_key',
                                      'argument 1 (argument 2 as invoked from Typescript)',
                                      'src/contracts/did/did_registry.compact line 39, char 1',
                                      'Bytes<32>',
                                      sk_0)
        if (!(instance_0.buffer instanceof ArrayBuffer && instance_0.BYTES_PER_ELEMENT === 1 && instance_0.length === 32))
          __compactRuntime.type_error('public_key',
                                      'argument 2 (argument 3 as invoked from Typescript)',
                                      'src/contracts/did/did_registry.compact line 39, char 1',
                                      'Bytes<32>',
                                      instance_0)
        const context = { ...contextOrig_0 };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(sk_0).concat(_descriptor_0.toValue(instance_0)),
            alignment: _descriptor_0.alignment().concat(_descriptor_0.alignment())
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this.#_public_key_0(context,
                                             partialProofData,
                                             sk_0,
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
                                      'src/contracts/did/did_registry.compact line 44, char 1',
                                      'CircuitContext',
                                      contextOrig_0)
        if (!(new_admin_0.buffer instanceof ArrayBuffer && new_admin_0.BYTES_PER_ELEMENT === 1 && new_admin_0.length === 32))
          __compactRuntime.type_error('set_admin',
                                      'argument 1 (argument 2 as invoked from Typescript)',
                                      'src/contracts/did/did_registry.compact line 44, char 1',
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
      create_did: (...args_1) => {
        if (args_1.length !== 3)
          throw new __compactRuntime.CompactError(`create_did: expected 3 arguments (as invoked from Typescript), received ${args_1.length}`);
        const contextOrig_0 = args_1[0];
        const verification_methods_0 = args_1[1];
        const services_0 = args_1[2];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.originalState != undefined && contextOrig_0.transactionContext != undefined))
          __compactRuntime.type_error('create_did',
                                      'argument 1 (as invoked from Typescript)',
                                      'src/contracts/did/did_registry.compact line 53, char 1',
                                      'CircuitContext',
                                      contextOrig_0)
        if (!(Array.isArray(verification_methods_0) && verification_methods_0.length === 32 && verification_methods_0.every((t) => typeof(t) === 'object' && t.id.buffer instanceof ArrayBuffer && t.id.BYTES_PER_ELEMENT === 1 && t.id.length === 32 && t.controller.buffer instanceof ArrayBuffer && t.controller.BYTES_PER_ELEMENT === 1 && t.controller.length === 32 && t.publicKey.buffer instanceof ArrayBuffer && t.publicKey.BYTES_PER_ELEMENT === 1 && t.publicKey.length === 32)))
          __compactRuntime.type_error('create_did',
                                      'argument 1 (argument 2 as invoked from Typescript)',
                                      'src/contracts/did/did_registry.compact line 53, char 1',
                                      'Vector<32, struct VerificationMethod<id: Bytes<32>, controller: Bytes<32>, publicKey: Bytes<32>>>',
                                      verification_methods_0)
        if (!(Array.isArray(services_0) && services_0.length === 32 && services_0.every((t) => typeof(t) === 'object' && t.id.buffer instanceof ArrayBuffer && t.id.BYTES_PER_ELEMENT === 1 && t.id.length === 32 && t.serviceType.buffer instanceof ArrayBuffer && t.serviceType.BYTES_PER_ELEMENT === 1 && t.serviceType.length === 32 && t.endpoint.buffer instanceof ArrayBuffer && t.endpoint.BYTES_PER_ELEMENT === 1 && t.endpoint.length === 32)))
          __compactRuntime.type_error('create_did',
                                      'argument 2 (argument 3 as invoked from Typescript)',
                                      'src/contracts/did/did_registry.compact line 53, char 1',
                                      'Vector<32, struct Service<id: Bytes<32>, serviceType: Bytes<32>, endpoint: Bytes<32>>>',
                                      services_0)
        const context = { ...contextOrig_0 };
        const partialProofData = {
          input: {
            value: _descriptor_2.toValue(verification_methods_0).concat(_descriptor_4.toValue(services_0)),
            alignment: _descriptor_2.alignment().concat(_descriptor_4.alignment())
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this.#_create_did_0(context,
                                             partialProofData,
                                             verification_methods_0,
                                             services_0);
        partialProofData.output = { value: _descriptor_0.toValue(result_0), alignment: _descriptor_0.alignment() };
        return { result: result_0, context: context, proofData: partialProofData };
      },
      update_did: (...args_1) => {
        if (args_1.length !== 4)
          throw new __compactRuntime.CompactError(`update_did: expected 4 arguments (as invoked from Typescript), received ${args_1.length}`);
        const contextOrig_0 = args_1[0];
        const did_id_0 = args_1[1];
        const verification_methods_0 = args_1[2];
        const services_0 = args_1[3];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.originalState != undefined && contextOrig_0.transactionContext != undefined))
          __compactRuntime.type_error('update_did',
                                      'argument 1 (as invoked from Typescript)',
                                      'src/contracts/did/did_registry.compact line 73, char 1',
                                      'CircuitContext',
                                      contextOrig_0)
        if (!(did_id_0.buffer instanceof ArrayBuffer && did_id_0.BYTES_PER_ELEMENT === 1 && did_id_0.length === 32))
          __compactRuntime.type_error('update_did',
                                      'argument 1 (argument 2 as invoked from Typescript)',
                                      'src/contracts/did/did_registry.compact line 73, char 1',
                                      'Bytes<32>',
                                      did_id_0)
        if (!(Array.isArray(verification_methods_0) && verification_methods_0.length === 32 && verification_methods_0.every((t) => typeof(t) === 'object' && t.id.buffer instanceof ArrayBuffer && t.id.BYTES_PER_ELEMENT === 1 && t.id.length === 32 && t.controller.buffer instanceof ArrayBuffer && t.controller.BYTES_PER_ELEMENT === 1 && t.controller.length === 32 && t.publicKey.buffer instanceof ArrayBuffer && t.publicKey.BYTES_PER_ELEMENT === 1 && t.publicKey.length === 32)))
          __compactRuntime.type_error('update_did',
                                      'argument 2 (argument 3 as invoked from Typescript)',
                                      'src/contracts/did/did_registry.compact line 73, char 1',
                                      'Vector<32, struct VerificationMethod<id: Bytes<32>, controller: Bytes<32>, publicKey: Bytes<32>>>',
                                      verification_methods_0)
        if (!(Array.isArray(services_0) && services_0.length === 32 && services_0.every((t) => typeof(t) === 'object' && t.id.buffer instanceof ArrayBuffer && t.id.BYTES_PER_ELEMENT === 1 && t.id.length === 32 && t.serviceType.buffer instanceof ArrayBuffer && t.serviceType.BYTES_PER_ELEMENT === 1 && t.serviceType.length === 32 && t.endpoint.buffer instanceof ArrayBuffer && t.endpoint.BYTES_PER_ELEMENT === 1 && t.endpoint.length === 32)))
          __compactRuntime.type_error('update_did',
                                      'argument 3 (argument 4 as invoked from Typescript)',
                                      'src/contracts/did/did_registry.compact line 73, char 1',
                                      'Vector<32, struct Service<id: Bytes<32>, serviceType: Bytes<32>, endpoint: Bytes<32>>>',
                                      services_0)
        const context = { ...contextOrig_0 };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(did_id_0).concat(_descriptor_2.toValue(verification_methods_0).concat(_descriptor_4.toValue(services_0))),
            alignment: _descriptor_0.alignment().concat(_descriptor_2.alignment().concat(_descriptor_4.alignment()))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this.#_update_did_0(context,
                                             partialProofData,
                                             did_id_0,
                                             verification_methods_0,
                                             services_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData };
      },
      deactivate_did: (...args_1) => {
        if (args_1.length !== 2)
          throw new __compactRuntime.CompactError(`deactivate_did: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        const contextOrig_0 = args_1[0];
        const did_id_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.originalState != undefined && contextOrig_0.transactionContext != undefined))
          __compactRuntime.type_error('deactivate_did',
                                      'argument 1 (as invoked from Typescript)',
                                      'src/contracts/did/did_registry.compact line 97, char 1',
                                      'CircuitContext',
                                      contextOrig_0)
        if (!(did_id_0.buffer instanceof ArrayBuffer && did_id_0.BYTES_PER_ELEMENT === 1 && did_id_0.length === 32))
          __compactRuntime.type_error('deactivate_did',
                                      'argument 1 (argument 2 as invoked from Typescript)',
                                      'src/contracts/did/did_registry.compact line 97, char 1',
                                      'Bytes<32>',
                                      did_id_0)
        const context = { ...contextOrig_0 };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(did_id_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this.#_deactivate_did_0(context,
                                                 partialProofData,
                                                 did_id_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData };
      },
      get_did_document: (...args_1) => {
        if (args_1.length !== 2)
          throw new __compactRuntime.CompactError(`get_did_document: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        const contextOrig_0 = args_1[0];
        const did_id_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.originalState != undefined && contextOrig_0.transactionContext != undefined))
          __compactRuntime.type_error('get_did_document',
                                      'argument 1 (as invoked from Typescript)',
                                      'src/contracts/did/did_registry.compact line 113, char 1',
                                      'CircuitContext',
                                      contextOrig_0)
        if (!(did_id_0.buffer instanceof ArrayBuffer && did_id_0.BYTES_PER_ELEMENT === 1 && did_id_0.length === 32))
          __compactRuntime.type_error('get_did_document',
                                      'argument 1 (argument 2 as invoked from Typescript)',
                                      'src/contracts/did/did_registry.compact line 113, char 1',
                                      'Bytes<32>',
                                      did_id_0)
        const context = { ...contextOrig_0 };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(did_id_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this.#_get_did_document_0(context,
                                                   partialProofData,
                                                   did_id_0);
        partialProofData.output = { value: _descriptor_5.toValue(result_0), alignment: _descriptor_5.alignment() };
        return { result: result_0, context: context, proofData: partialProofData };
      },
      is_deactivated: (...args_1) => {
        if (args_1.length !== 2)
          throw new __compactRuntime.CompactError(`is_deactivated: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        const contextOrig_0 = args_1[0];
        const did_id_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.originalState != undefined && contextOrig_0.transactionContext != undefined))
          __compactRuntime.type_error('is_deactivated',
                                      'argument 1 (as invoked from Typescript)',
                                      'src/contracts/did/did_registry.compact line 119, char 1',
                                      'CircuitContext',
                                      contextOrig_0)
        if (!(did_id_0.buffer instanceof ArrayBuffer && did_id_0.BYTES_PER_ELEMENT === 1 && did_id_0.length === 32))
          __compactRuntime.type_error('is_deactivated',
                                      'argument 1 (argument 2 as invoked from Typescript)',
                                      'src/contracts/did/did_registry.compact line 119, char 1',
                                      'Bytes<32>',
                                      did_id_0)
        const context = { ...contextOrig_0 };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(did_id_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this.#_is_deactivated_0(context,
                                                 partialProofData,
                                                 did_id_0);
        partialProofData.output = { value: _descriptor_7.toValue(result_0), alignment: _descriptor_7.alignment() };
        return { result: result_0, context: context, proofData: partialProofData };
      }
    };
    this.impureCircuits = {
      generate_key_proof: this.circuits.generate_key_proof,
      set_admin: this.circuits.set_admin,
      create_did: this.circuits.create_did,
      update_did: this.circuits.update_did,
      deactivate_did: this.circuits.deactivate_did,
      get_did_document: this.circuits.get_did_document,
      is_deactivated: this.circuits.is_deactivated
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
    state_0.setOperation('create_did', new __compactRuntime.ContractOperation());
    state_0.setOperation('update_did', new __compactRuntime.ContractOperation());
    state_0.setOperation('deactivate_did', new __compactRuntime.ContractOperation());
    state_0.setOperation('get_did_document', new __compactRuntime.ContractOperation());
    state_0.setOperation('is_deactivated', new __compactRuntime.ContractOperation());
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
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_12.toValue(0n),
                                                                            alignment: _descriptor_12.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newMap(
                                        new __compactRuntime.StateMap()
                                      ).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_12.toValue(1n),
                                                                            alignment: _descriptor_12.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newMap(
                                        new __compactRuntime.StateMap()
                                      ).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_12.toValue(2n),
                                                                            alignment: _descriptor_12.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(new Uint8Array(32)),
                                                                            alignment: _descriptor_0.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_12.toValue(3n),
                                                                            alignment: _descriptor_12.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(0n),
                                                                            alignment: _descriptor_8.alignment() }).encode() } },
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
  #_local_secret_key_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.witnessContext(ledger(context.transactionContext.state), context.currentPrivateState, context.transactionContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.local_secret_key(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(result_0.buffer instanceof ArrayBuffer && result_0.BYTES_PER_ELEMENT === 1 && result_0.length === 32))
      __compactRuntime.type_error('local_secret_key',
                                  'return value',
                                  'src/contracts/did/did_registry.compact line 31, char 1',
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
    const proof_0 = this.#_persistent_hash_0(context,
                                             partialProofData,
                                             [new Uint8Array([100, 105, 100, 58, 112, 107, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                              instance_0,
                                              sk_0]);
    return proof_0;
  }
  #_public_key_0(context, partialProofData, sk_0, instance_0) {
    return this.#_persistent_hash_0(context,
                                    partialProofData,
                                    [new Uint8Array([100, 105, 100, 58, 112, 107, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                     instance_0,
                                     sk_0]);
  }
  #_set_admin_0(context, partialProofData, new_admin_0) {
    const current_proof_0 = this.#_generate_key_proof_0(context,
                                                        partialProofData,
                                                        __compactRuntime.convert_bigint_to_Uint8Array(32,
                                                                                                      _descriptor_8.fromValue(Contract._query(context,
                                                                                                                                              partialProofData,
                                                                                                                                              [
                                                                                                                                               { dup: { n: 0 } },
                                                                                                                                               { idx: { cached: false,
                                                                                                                                                        pushPath: false,
                                                                                                                                                        path: [
                                                                                                                                                               { tag: 'value',
                                                                                                                                                                 value: { value: _descriptor_12.toValue(3n),
                                                                                                                                                                          alignment: _descriptor_12.alignment() } }] } },
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
                                                                                                      value: { value: _descriptor_12.toValue(2n),
                                                                                                               alignment: _descriptor_12.alignment() } }] } },
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
                                                                                                      value: { value: _descriptor_12.toValue(2n),
                                                                                                               alignment: _descriptor_12.alignment() } }] } },
                                                                                    { popeq: { cached: false,
                                                                                               result: undefined } }]).value),
                                           current_proof_0),
                            'Only current admin can set new admin');
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_12.toValue(2n),
                                                                            alignment: _descriptor_12.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(new_admin_0),
                                                                            alignment: _descriptor_0.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    return [];
  }
  #_create_did_0(context, partialProofData, verification_methods_0, services_0)
  {
    const controller_0 = this.#_generate_key_proof_0(context,
                                                     partialProofData,
                                                     __compactRuntime.convert_bigint_to_Uint8Array(32,
                                                                                                   _descriptor_8.fromValue(Contract._query(context,
                                                                                                                                           partialProofData,
                                                                                                                                           [
                                                                                                                                            { dup: { n: 0 } },
                                                                                                                                            { idx: { cached: false,
                                                                                                                                                     pushPath: false,
                                                                                                                                                     path: [
                                                                                                                                                            { tag: 'value',
                                                                                                                                                              value: { value: _descriptor_12.toValue(3n),
                                                                                                                                                                       alignment: _descriptor_12.alignment() } }] } },
                                                                                                                                            { popeq: { cached: true,
                                                                                                                                                       result: undefined } }]).value)));
    const tmp_0 = 1n;
    Contract._query(context,
                    partialProofData,
                    [
                     { idx: { cached: false,
                              pushPath: true,
                              path: [
                                     { tag: 'value',
                                       value: { value: _descriptor_12.toValue(3n),
                                                alignment: _descriptor_12.alignment() } }] } },
                     { addi: { immediate: parseInt(__compactRuntime.valueToBigInt(
                                            { value: _descriptor_9.toValue(tmp_0),
                                              alignment: _descriptor_9.alignment() }
                                              .value
                                          )) } },
                     { ins: { cached: true, n: 1 } }]);
    const did_id_0 = this.#_generate_key_proof_0(context,
                                                 partialProofData,
                                                 __compactRuntime.convert_bigint_to_Uint8Array(32,
                                                                                               _descriptor_8.fromValue(Contract._query(context,
                                                                                                                                       partialProofData,
                                                                                                                                       [
                                                                                                                                        { dup: { n: 0 } },
                                                                                                                                        { idx: { cached: false,
                                                                                                                                                 pushPath: false,
                                                                                                                                                 path: [
                                                                                                                                                        { tag: 'value',
                                                                                                                                                          value: { value: _descriptor_12.toValue(3n),
                                                                                                                                                                   alignment: _descriptor_12.alignment() } }] } },
                                                                                                                                        { popeq: { cached: true,
                                                                                                                                                   result: undefined } }]).value)));
    __compactRuntime.assert(!_descriptor_6.fromValue(Contract._query(context,
                                                                     partialProofData,
                                                                     [
                                                                      { dup: { n: 0 } },
                                                                      { idx: { cached: false,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_12.toValue(0n),
                                                                                                 alignment: _descriptor_12.alignment() } }] } },
                                                                      { push: { storage: false,
                                                                                value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(did_id_0),
                                                                                                                             alignment: _descriptor_0.alignment() }).encode() } },
                                                                      'member',
                                                                      { popeq: { cached: true,
                                                                                 result: undefined } }]).value),
                            'DID already exists');
    const tmp_1 = { id: did_id_0,
                    controller: controller_0,
                    verificationMethods: verification_methods_0,
                    services: services_0 };
    Contract._query(context,
                    partialProofData,
                    [
                     { idx: { cached: false,
                              pushPath: true,
                              path: [
                                     { tag: 'value',
                                       value: { value: _descriptor_12.toValue(0n),
                                                alignment: _descriptor_12.alignment() } }] } },
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(did_id_0),
                                                                            alignment: _descriptor_0.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(tmp_1),
                                                                            alignment: _descriptor_5.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } },
                     { ins: { cached: true, n: 1 } }]);
    return did_id_0;
  }
  #_update_did_0(context,
                 partialProofData,
                 did_id_0,
                 verification_methods_0,
                 services_0)
  {
    const controller_0 = this.#_generate_key_proof_0(context,
                                                     partialProofData,
                                                     __compactRuntime.convert_bigint_to_Uint8Array(32,
                                                                                                   _descriptor_8.fromValue(Contract._query(context,
                                                                                                                                           partialProofData,
                                                                                                                                           [
                                                                                                                                            { dup: { n: 0 } },
                                                                                                                                            { idx: { cached: false,
                                                                                                                                                     pushPath: false,
                                                                                                                                                     path: [
                                                                                                                                                            { tag: 'value',
                                                                                                                                                              value: { value: _descriptor_12.toValue(3n),
                                                                                                                                                                       alignment: _descriptor_12.alignment() } }] } },
                                                                                                                                            { popeq: { cached: true,
                                                                                                                                                       result: undefined } }]).value)));
    __compactRuntime.assert(_descriptor_6.fromValue(Contract._query(context,
                                                                    partialProofData,
                                                                    [
                                                                     { dup: { n: 0 } },
                                                                     { idx: { cached: false,
                                                                              pushPath: false,
                                                                              path: [
                                                                                     { tag: 'value',
                                                                                       value: { value: _descriptor_12.toValue(0n),
                                                                                                alignment: _descriptor_12.alignment() } }] } },
                                                                     { push: { storage: false,
                                                                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(did_id_0),
                                                                                                                            alignment: _descriptor_0.alignment() }).encode() } },
                                                                     'member',
                                                                     { popeq: { cached: true,
                                                                                result: undefined } }]).value),
                            'DID does not exist');
    __compactRuntime.assert(!_descriptor_6.fromValue(Contract._query(context,
                                                                     partialProofData,
                                                                     [
                                                                      { dup: { n: 0 } },
                                                                      { idx: { cached: false,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_12.toValue(1n),
                                                                                                 alignment: _descriptor_12.alignment() } }] } },
                                                                      { push: { storage: false,
                                                                                value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(did_id_0),
                                                                                                                             alignment: _descriptor_0.alignment() }).encode() } },
                                                                      'member',
                                                                      { popeq: { cached: true,
                                                                                 result: undefined } }]).value)
                            ||
                            _descriptor_7.fromValue(Contract._query(context,
                                                                    partialProofData,
                                                                    [
                                                                     { dup: { n: 0 } },
                                                                     { idx: { cached: false,
                                                                              pushPath: false,
                                                                              path: [
                                                                                     { tag: 'value',
                                                                                       value: { value: _descriptor_12.toValue(1n),
                                                                                                alignment: _descriptor_12.alignment() } }] } },
                                                                     { idx: { cached: false,
                                                                              pushPath: false,
                                                                              path: [
                                                                                     { tag: 'value',
                                                                                       value: { value: _descriptor_0.toValue(did_id_0),
                                                                                                alignment: _descriptor_0.alignment() } }] } },
                                                                     { popeq: { cached: false,
                                                                                result: undefined } }]).value)
                            ===
                            0n,
                            'DID is deactivated');
    const doc_0 = _descriptor_5.fromValue(Contract._query(context,
                                                          partialProofData,
                                                          [
                                                           { dup: { n: 0 } },
                                                           { idx: { cached: false,
                                                                    pushPath: false,
                                                                    path: [
                                                                           { tag: 'value',
                                                                             value: { value: _descriptor_12.toValue(0n),
                                                                                      alignment: _descriptor_12.alignment() } }] } },
                                                           { idx: { cached: false,
                                                                    pushPath: false,
                                                                    path: [
                                                                           { tag: 'value',
                                                                             value: { value: _descriptor_0.toValue(did_id_0),
                                                                                      alignment: _descriptor_0.alignment() } }] } },
                                                           { popeq: { cached: false,
                                                                      result: undefined } }]).value);
    __compactRuntime.assert(this.#_equal_2(doc_0.controller, controller_0),
                            'Not authorized to update DID');
    const tmp_0 = { id: did_id_0,
                    controller: controller_0,
                    verificationMethods: verification_methods_0,
                    services: services_0 };
    Contract._query(context,
                    partialProofData,
                    [
                     { idx: { cached: false,
                              pushPath: true,
                              path: [
                                     { tag: 'value',
                                       value: { value: _descriptor_12.toValue(0n),
                                                alignment: _descriptor_12.alignment() } }] } },
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(did_id_0),
                                                                            alignment: _descriptor_0.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(tmp_0),
                                                                            alignment: _descriptor_5.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } },
                     { ins: { cached: true, n: 1 } }]);
    return [];
  }
  #_deactivate_did_0(context, partialProofData, did_id_0) {
    const controller_0 = this.#_generate_key_proof_0(context,
                                                     partialProofData,
                                                     __compactRuntime.convert_bigint_to_Uint8Array(32,
                                                                                                   _descriptor_8.fromValue(Contract._query(context,
                                                                                                                                           partialProofData,
                                                                                                                                           [
                                                                                                                                            { dup: { n: 0 } },
                                                                                                                                            { idx: { cached: false,
                                                                                                                                                     pushPath: false,
                                                                                                                                                     path: [
                                                                                                                                                            { tag: 'value',
                                                                                                                                                              value: { value: _descriptor_12.toValue(3n),
                                                                                                                                                                       alignment: _descriptor_12.alignment() } }] } },
                                                                                                                                            { popeq: { cached: true,
                                                                                                                                                       result: undefined } }]).value)));
    __compactRuntime.assert(_descriptor_6.fromValue(Contract._query(context,
                                                                    partialProofData,
                                                                    [
                                                                     { dup: { n: 0 } },
                                                                     { idx: { cached: false,
                                                                              pushPath: false,
                                                                              path: [
                                                                                     { tag: 'value',
                                                                                       value: { value: _descriptor_12.toValue(0n),
                                                                                                alignment: _descriptor_12.alignment() } }] } },
                                                                     { push: { storage: false,
                                                                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(did_id_0),
                                                                                                                            alignment: _descriptor_0.alignment() }).encode() } },
                                                                     'member',
                                                                     { popeq: { cached: true,
                                                                                result: undefined } }]).value),
                            'DID does not exist');
    __compactRuntime.assert(!_descriptor_6.fromValue(Contract._query(context,
                                                                     partialProofData,
                                                                     [
                                                                      { dup: { n: 0 } },
                                                                      { idx: { cached: false,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_12.toValue(1n),
                                                                                                 alignment: _descriptor_12.alignment() } }] } },
                                                                      { push: { storage: false,
                                                                                value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(did_id_0),
                                                                                                                             alignment: _descriptor_0.alignment() }).encode() } },
                                                                      'member',
                                                                      { popeq: { cached: true,
                                                                                 result: undefined } }]).value)
                            ||
                            _descriptor_7.fromValue(Contract._query(context,
                                                                    partialProofData,
                                                                    [
                                                                     { dup: { n: 0 } },
                                                                     { idx: { cached: false,
                                                                              pushPath: false,
                                                                              path: [
                                                                                     { tag: 'value',
                                                                                       value: { value: _descriptor_12.toValue(1n),
                                                                                                alignment: _descriptor_12.alignment() } }] } },
                                                                     { idx: { cached: false,
                                                                              pushPath: false,
                                                                              path: [
                                                                                     { tag: 'value',
                                                                                       value: { value: _descriptor_0.toValue(did_id_0),
                                                                                                alignment: _descriptor_0.alignment() } }] } },
                                                                     { popeq: { cached: false,
                                                                                result: undefined } }]).value)
                            ===
                            0n,
                            'DID is already deactivated');
    const doc_0 = _descriptor_5.fromValue(Contract._query(context,
                                                          partialProofData,
                                                          [
                                                           { dup: { n: 0 } },
                                                           { idx: { cached: false,
                                                                    pushPath: false,
                                                                    path: [
                                                                           { tag: 'value',
                                                                             value: { value: _descriptor_12.toValue(0n),
                                                                                      alignment: _descriptor_12.alignment() } }] } },
                                                           { idx: { cached: false,
                                                                    pushPath: false,
                                                                    path: [
                                                                           { tag: 'value',
                                                                             value: { value: _descriptor_0.toValue(did_id_0),
                                                                                      alignment: _descriptor_0.alignment() } }] } },
                                                           { popeq: { cached: false,
                                                                      result: undefined } }]).value);
    __compactRuntime.assert(this.#_equal_3(doc_0.controller, controller_0),
                            'Not authorized to deactivate DID');
    const tmp_0 = 1n;
    Contract._query(context,
                    partialProofData,
                    [
                     { idx: { cached: false,
                              pushPath: true,
                              path: [
                                     { tag: 'value',
                                       value: { value: _descriptor_12.toValue(1n),
                                                alignment: _descriptor_12.alignment() } }] } },
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(did_id_0),
                                                                            alignment: _descriptor_0.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(tmp_0),
                                                                            alignment: _descriptor_7.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } },
                     { ins: { cached: true, n: 1 } }]);
    return [];
  }
  #_get_did_document_0(context, partialProofData, did_id_0) {
    __compactRuntime.assert(_descriptor_6.fromValue(Contract._query(context,
                                                                    partialProofData,
                                                                    [
                                                                     { dup: { n: 0 } },
                                                                     { idx: { cached: false,
                                                                              pushPath: false,
                                                                              path: [
                                                                                     { tag: 'value',
                                                                                       value: { value: _descriptor_12.toValue(0n),
                                                                                                alignment: _descriptor_12.alignment() } }] } },
                                                                     { push: { storage: false,
                                                                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(did_id_0),
                                                                                                                            alignment: _descriptor_0.alignment() }).encode() } },
                                                                     'member',
                                                                     { popeq: { cached: true,
                                                                                result: undefined } }]).value),
                            'DID does not exist');
    return _descriptor_5.fromValue(Contract._query(context,
                                                   partialProofData,
                                                   [
                                                    { dup: { n: 0 } },
                                                    { idx: { cached: false,
                                                             pushPath: false,
                                                             path: [
                                                                    { tag: 'value',
                                                                      value: { value: _descriptor_12.toValue(0n),
                                                                               alignment: _descriptor_12.alignment() } }] } },
                                                    { idx: { cached: false,
                                                             pushPath: false,
                                                             path: [
                                                                    { tag: 'value',
                                                                      value: { value: _descriptor_0.toValue(did_id_0),
                                                                               alignment: _descriptor_0.alignment() } }] } },
                                                    { popeq: { cached: false,
                                                               result: undefined } }]).value);
  }
  #_is_deactivated_0(context, partialProofData, did_id_0) {
    __compactRuntime.assert(_descriptor_6.fromValue(Contract._query(context,
                                                                    partialProofData,
                                                                    [
                                                                     { dup: { n: 0 } },
                                                                     { idx: { cached: false,
                                                                              pushPath: false,
                                                                              path: [
                                                                                     { tag: 'value',
                                                                                       value: { value: _descriptor_12.toValue(0n),
                                                                                                alignment: _descriptor_12.alignment() } }] } },
                                                                     { push: { storage: false,
                                                                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(did_id_0),
                                                                                                                            alignment: _descriptor_0.alignment() }).encode() } },
                                                                     'member',
                                                                     { popeq: { cached: true,
                                                                                result: undefined } }]).value),
                            'DID does not exist');
    if (_descriptor_6.fromValue(Contract._query(context,
                                                partialProofData,
                                                [
                                                 { dup: { n: 0 } },
                                                 { idx: { cached: false,
                                                          pushPath: false,
                                                          path: [
                                                                 { tag: 'value',
                                                                   value: { value: _descriptor_12.toValue(1n),
                                                                            alignment: _descriptor_12.alignment() } }] } },
                                                 { push: { storage: false,
                                                           value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(did_id_0),
                                                                                                        alignment: _descriptor_0.alignment() }).encode() } },
                                                 'member',
                                                 { popeq: { cached: true,
                                                            result: undefined } }]).value))
    {
      return _descriptor_7.fromValue(Contract._query(context,
                                                     partialProofData,
                                                     [
                                                      { dup: { n: 0 } },
                                                      { idx: { cached: false,
                                                               pushPath: false,
                                                               path: [
                                                                      { tag: 'value',
                                                                        value: { value: _descriptor_12.toValue(1n),
                                                                                 alignment: _descriptor_12.alignment() } }] } },
                                                      { idx: { cached: false,
                                                               pushPath: false,
                                                               path: [
                                                                      { tag: 'value',
                                                                        value: { value: _descriptor_0.toValue(did_id_0),
                                                                                 alignment: _descriptor_0.alignment() } }] } },
                                                      { popeq: { cached: false,
                                                                 result: undefined } }]).value);
    } else {
      return 0n;
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
  #_equal_3(x0, y0) {
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
const pureCircuits = {
  public_key: (...args_0) => _dummyContract.circuits.public_key(_emptyContext, ...args_0).result
};
const contractReferenceLocations = { tag: 'publicLedgerArray', indices: { } };
exports.Contract = Contract;
exports.ledger = ledger;
exports.pureCircuits = pureCircuits;
exports.contractReferenceLocations = contractReferenceLocations;
//# sourceMappingURL=index.cjs.map
