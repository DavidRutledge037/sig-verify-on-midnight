'use strict';
const __compactRuntime = require('@midnight-ntwrk/compact-runtime');
const expectedRuntimeVersionString = '0.7.0';
const expectedRuntimeVersion = expectedRuntimeVersionString.split('-')[0].split('.').map(Number);
const actualRuntimeVersion = __compactRuntime.versionString.split('-')[0].split('.').map(Number);

if (expectedRuntimeVersion[0] !== actualRuntimeVersion[0] || expectedRuntimeVersion[1] !== actualRuntimeVersion[1])
  throw new __compactRuntime.CompactError(`Runtime version mismatch: expected ${expectedRuntimeVersionString}, got ${__compactRuntime.versionString}`);

// KYC Status type
class _KYCStatus_0 {
  alignment() {
    return [1n];
  }
  fromValue(value_0) {
    return value_0[0];
  }
  toValue(value_0) {
    return [value_0];
  }
}

const _descriptor_1 = new _KYCStatus_0();

// KYC Record type
class _KYCRecord_0 {
  alignment() {
    return [32n, 1n, 32n, 32n];
  }
  fromValue(value_0) {
    return {
      holder: value_0[0],
      status: value_0[1],
      verifier: value_0[2],
      timestamp: value_0[3]
    };
  }
  toValue(value_0) {
    return [value_0.holder, value_0.status, value_0.verifier, value_0.timestamp];
  }
}

const _descriptor_2 = new _KYCRecord_0();

class Contract {
  constructor(witnesses_0) {
    if (typeof(witnesses_0) !== 'object')
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor is not an object');
    if (typeof(witnesses_0.local_secret_key) !== 'function')
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named local_secret_key');
    this.witnesses = witnesses_0;
    this.circuits = {
      generate_key_proof: (...args_1) => {
        if (args_1.length !== 2)
          throw new __compactRuntime.CompactError(`generate_key_proof: expected 2 arguments, received ${args_1.length}`);
        const contextOrig_0 = args_1[0];
        const instance_0 = args_1[1];
        const context = { ...contextOrig_0 };
        const partialProofData = {
          input: {
            value: [instance_0],
            alignment: [32n]
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this.#_generate_key_proof_0(context, partialProofData, instance_0);
        partialProofData.output = { value: [result_0], alignment: [32n] };
        return { result: result_0, context: context, proofData: partialProofData };
      },
      set_admin: (...args_1) => {
        if (args_1.length !== 2)
          throw new __compactRuntime.CompactError(`set_admin: expected 2 arguments, received ${args_1.length}`);
        const contextOrig_0 = args_1[0];
        const new_admin_0 = args_1[1];
        const context = { ...contextOrig_0 };
        const partialProofData = {
          input: {
            value: [new_admin_0],
            alignment: [32n]
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this.#_set_admin_0(context, partialProofData, new_admin_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData };
      }
    };
    this.impureCircuits = {
      generate_key_proof: this.circuits.generate_key_proof,
      set_admin: this.circuits.set_admin
    };
  }

  #_local_secret_key_0(context, partialProofData) {
    return this.witnesses.local_secret_key();
  }

  #_generate_key_proof_0(context, partialProofData, instance_0) {
    const sk_0 = this.#_local_secret_key_0(context, partialProofData);
    const proof_0 = this.#_persistent_hash_0(context,
                                           partialProofData,
                                           [new Uint8Array([107, 121, 99, 58, 112, 107, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                            instance_0,
                                            sk_0]);
    return proof_0;
  }

  #_set_admin_0(context, partialProofData, new_admin_0) {
    const current_proof = this.#_generate_key_proof_0(context, partialProofData, Buffer.from(context.transactionContext.counter.toString(16), 'hex'));
    assert(context.transactionContext.state.admin == new Uint8Array(32) || context.transactionContext.state.admin == current_proof,
           "Only current admin can set new admin");
    context.transactionContext.state.admin = new_admin_0;
    return [];
  }

  initialState(...args_0) {
    if (args_0.length !== 1)
      throw new __compactRuntime.CompactError(`initialState: expected 1 argument, received ${args_0.length}`);
    const context_0 = args_0[0];
    return {
      currentPrivateState: {},
      currentZswapLocalState: {},
      currentContractState: new __compactRuntime.ContractState()
    };
  }
}

const _emptyContext = {
  originalState: new __compactRuntime.ContractState(),
  transactionContext: new __compactRuntime.QueryContext(new __compactRuntime.ContractState().data, __compactRuntime.dummyContractAddress())
};

const _dummyContract = new Contract({
  local_secret_key: () => new Uint8Array(32)
});

const pureCircuits = {
  generate_key_proof: _dummyContract.circuits.generate_key_proof
};

const contractReferenceLocations = { tag: 'publicLedgerArray', indices: {} };

exports.Contract = Contract;
exports.pureCircuits = pureCircuits;
exports.contractReferenceLocations = contractReferenceLocations;
