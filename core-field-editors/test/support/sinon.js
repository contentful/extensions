import * as sinon from 'sinon'

export * from 'sinon'

/**
 * Allows one to call `sinon.stub().resolves(true)`
 * to create a stub that returns a promise the will resolve to `true`.
 */
sinon.stub.resolves = function (value) {
  return this.returns(Promise.resolve(value))
}

/**
 * Allows one to call `sinon.stub().rejects(err)`
 * to create a stub that returns a promise the be rejected with the
 * given error.
 */
sinon.stub.rejects = function (err) {
  return this.returns(Promise.reject(err))
}
