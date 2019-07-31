/* eslint-disable */

parcelRequire = (function(e, r, t, n) {
  var i,
    o = 'function' == typeof parcelRequire && parcelRequire,
    u = 'function' == typeof require && require;
  function f(t, n) {
    if (!r[t]) {
      if (!e[t]) {
        var i = 'function' == typeof parcelRequire && parcelRequire;
        if (!n && i) return i(t, !0);
        if (o) return o(t, !0);
        if (u && 'string' == typeof t) return u(t);
        var c = new Error("Cannot find module '" + t + "'");
        throw ((c.code = 'MODULE_NOT_FOUND'), c);
      }
      (p.resolve = function(r) {
        return e[t][1][r] || r;
      }),
        (p.cache = {});
      var l = (r[t] = new f.Module(t));
      e[t][0].call(l.exports, p, l, l.exports, this);
    }
    return r[t].exports;
    function p(e) {
      return f(p.resolve(e));
    }
  }
  (f.isParcelRequire = !0),
    (f.Module = function(e) {
      (this.id = e), (this.bundle = f), (this.exports = {});
    }),
    (f.modules = e),
    (f.cache = r),
    (f.parent = o),
    (f.register = function(r, t) {
      e[r] = [
        function(e, r) {
          r.exports = t;
        },
        {}
      ];
    });
  for (var c = 0; c < t.length; c++)
    try {
      f(t[c]);
    } catch (e) {
      i || (i = e);
    }
  if (t.length) {
    var l = f(t[t.length - 1]);
    'object' == typeof exports && 'undefined' != typeof module
      ? (module.exports = l)
      : 'function' == typeof define && define.amd
      ? define(function() {
          return l;
        })
      : n && (this[n] = l);
  }
  if (((parcelRequire = f), i)) throw i;
  return f;
})(
  {
    pBGv: [
      function(require, module, exports) {
        var t,
          e,
          n = (module.exports = {});
        function r() {
          throw new Error('setTimeout has not been defined');
        }
        function o() {
          throw new Error('clearTimeout has not been defined');
        }
        function i(e) {
          if (t === setTimeout) return setTimeout(e, 0);
          if ((t === r || !t) && setTimeout) return (t = setTimeout), setTimeout(e, 0);
          try {
            return t(e, 0);
          } catch (n) {
            try {
              return t.call(null, e, 0);
            } catch (n) {
              return t.call(this, e, 0);
            }
          }
        }
        function u(t) {
          if (e === clearTimeout) return clearTimeout(t);
          if ((e === o || !e) && clearTimeout) return (e = clearTimeout), clearTimeout(t);
          try {
            return e(t);
          } catch (n) {
            try {
              return e.call(null, t);
            } catch (n) {
              return e.call(this, t);
            }
          }
        }
        !(function() {
          try {
            t = 'function' == typeof setTimeout ? setTimeout : r;
          } catch (n) {
            t = r;
          }
          try {
            e = 'function' == typeof clearTimeout ? clearTimeout : o;
          } catch (n) {
            e = o;
          }
        })();
        var c,
          s = [],
          l = !1,
          a = -1;
        function f() {
          l && c && ((l = !1), c.length ? (s = c.concat(s)) : (a = -1), s.length && h());
        }
        function h() {
          if (!l) {
            var t = i(f);
            l = !0;
            for (var e = s.length; e; ) {
              for (c = s, s = []; ++a < e; ) c && c[a].run();
              (a = -1), (e = s.length);
            }
            (c = null), (l = !1), u(t);
          }
        }
        function m(t, e) {
          (this.fun = t), (this.array = e);
        }
        function p() {}
        (n.nextTick = function(t) {
          var e = new Array(arguments.length - 1);
          if (arguments.length > 1)
            for (var n = 1; n < arguments.length; n++) e[n - 1] = arguments[n];
          s.push(new m(t, e)), 1 !== s.length || l || i(h);
        }),
          (m.prototype.run = function() {
            this.fun.apply(null, this.array);
          }),
          (n.title = 'browser'),
          (n.env = {}),
          (n.argv = []),
          (n.version = ''),
          (n.versions = {}),
          (n.on = p),
          (n.addListener = p),
          (n.once = p),
          (n.off = p),
          (n.removeListener = p),
          (n.removeAllListeners = p),
          (n.emit = p),
          (n.prependListener = p),
          (n.prependOnceListener = p),
          (n.listeners = function(t) {
            return [];
          }),
          (n.binding = function(t) {
            throw new Error('process.binding is not supported');
          }),
          (n.cwd = function() {
            return '/';
          }),
          (n.chdir = function(t) {
            throw new Error('process.chdir is not supported');
          }),
          (n.umask = function() {
            return 0;
          });
      },
      {}
    ],
    Zt7E: [
      function(require, module, exports) {
        var define;
        var global = arguments[3];
        var process = require('process');
        var t,
          e = arguments[3],
          r = require('process');
        !(function(e, r) {
          'object' == typeof exports && 'undefined' != typeof module
            ? (module.exports = r())
            : 'function' == typeof t && t.amd
            ? t(r)
            : (e.ES6Promise = r());
        })(this, function() {
          'use strict';
          function t(t) {
            return 'function' == typeof t;
          }
          var n = Array.isArray
              ? Array.isArray
              : function(t) {
                  return '[object Array]' === Object.prototype.toString.call(t);
                },
            o = 0,
            i = void 0,
            s = void 0,
            u = function(t, e) {
              (p[o] = t), (p[o + 1] = e), 2 === (o += 2) && (s ? s(_) : w());
            };
          var c = 'undefined' != typeof window ? window : void 0,
            a = c || {},
            f = a.MutationObserver || a.WebKitMutationObserver,
            l =
              'undefined' == typeof self &&
              void 0 !== r &&
              '[object process]' === {}.toString.call(r),
            h =
              'undefined' != typeof Uint8ClampedArray &&
              'undefined' != typeof importScripts &&
              'undefined' != typeof MessageChannel;
          function v() {
            var t = setTimeout;
            return function() {
              return t(_, 1);
            };
          }
          var p = new Array(1e3);
          function _() {
            for (var t = 0; t < o; t += 2) {
              (0, p[t])(p[t + 1]), (p[t] = void 0), (p[t + 1] = void 0);
            }
            o = 0;
          }
          var d,
            y,
            m,
            b,
            w = void 0;
          function g(t, e) {
            var r = this,
              n = new this.constructor(S);
            void 0 === n[j] && N(n);
            var o = r._state;
            if (o) {
              var i = arguments[o - 1];
              u(function() {
                return K(o, n, i, r._result);
              });
            } else k(r, n, t, e);
            return n;
          }
          function A(t) {
            if (t && 'object' == typeof t && t.constructor === this) return t;
            var e = new this(S);
            return O(e, t), e;
          }
          l
            ? (w = function() {
                return r.nextTick(_);
              })
            : f
            ? ((y = 0),
              (m = new f(_)),
              (b = document.createTextNode('')),
              m.observe(b, { characterData: !0 }),
              (w = function() {
                b.data = y = ++y % 2;
              }))
            : h
            ? (((d = new MessageChannel()).port1.onmessage = _),
              (w = function() {
                return d.port2.postMessage(0);
              }))
            : (w =
                void 0 === c && 'function' == typeof require
                  ? (function() {
                      try {
                        var t = Function('return this')().require('vertx');
                        return void 0 !== (i = t.runOnLoop || t.runOnContext)
                          ? function() {
                              i(_);
                            }
                          : v();
                      } catch (e) {
                        return v();
                      }
                    })()
                  : v());
          var j = Math.random()
            .toString(36)
            .substring(2);
          function S() {}
          var E = void 0,
            T = 1,
            M = 2,
            P = { error: null };
          function x(t) {
            try {
              return t.then;
            } catch (e) {
              return (P.error = e), P;
            }
          }
          function C(e, r, n) {
            r.constructor === e.constructor && n === g && r.constructor.resolve === A
              ? (function(t, e) {
                  e._state === T
                    ? F(t, e._result)
                    : e._state === M
                    ? Y(t, e._result)
                    : k(
                        e,
                        void 0,
                        function(e) {
                          return O(t, e);
                        },
                        function(e) {
                          return Y(t, e);
                        }
                      );
                })(e, r)
              : n === P
              ? (Y(e, P.error), (P.error = null))
              : void 0 === n
              ? F(e, r)
              : t(n)
              ? (function(t, e, r) {
                  u(function(t) {
                    var n = !1,
                      o = (function(t, e, r, n) {
                        try {
                          t.call(e, r, n);
                        } catch (o) {
                          return o;
                        }
                      })(
                        r,
                        e,
                        function(r) {
                          n || ((n = !0), e !== r ? O(t, r) : F(t, r));
                        },
                        function(e) {
                          n || ((n = !0), Y(t, e));
                        },
                        t._label
                      );
                    !n && o && ((n = !0), Y(t, o));
                  }, t);
                })(e, r, n)
              : F(e, r);
          }
          function O(t, e) {
            var r, n;
            t === e
              ? Y(t, new TypeError('You cannot resolve a promise with itself'))
              : ((n = typeof (r = e)),
                null === r || ('object' !== n && 'function' !== n) ? F(t, e) : C(t, e, x(e)));
          }
          function q(t) {
            t._onerror && t._onerror(t._result), D(t);
          }
          function F(t, e) {
            t._state === E &&
              ((t._result = e), (t._state = T), 0 !== t._subscribers.length && u(D, t));
          }
          function Y(t, e) {
            t._state === E && ((t._state = M), (t._result = e), u(q, t));
          }
          function k(t, e, r, n) {
            var o = t._subscribers,
              i = o.length;
            (t._onerror = null),
              (o[i] = e),
              (o[i + T] = r),
              (o[i + M] = n),
              0 === i && t._state && u(D, t);
          }
          function D(t) {
            var e = t._subscribers,
              r = t._state;
            if (0 !== e.length) {
              for (var n = void 0, o = void 0, i = t._result, s = 0; s < e.length; s += 3)
                (n = e[s]), (o = e[s + r]), n ? K(r, n, o, i) : o(i);
              t._subscribers.length = 0;
            }
          }
          function K(e, r, n, o) {
            var i = t(n),
              s = void 0,
              u = void 0,
              c = void 0,
              a = void 0;
            if (i) {
              if (
                ((s = (function(t, e) {
                  try {
                    return t(e);
                  } catch (r) {
                    return (P.error = r), P;
                  }
                })(n, o)) === P
                  ? ((a = !0), (u = s.error), (s.error = null))
                  : (c = !0),
                r === s)
              )
                return void Y(
                  r,
                  new TypeError('A promises callback cannot return that same promise.')
                );
            } else (s = o), (c = !0);
            r._state !== E ||
              (i && c ? O(r, s) : a ? Y(r, u) : e === T ? F(r, s) : e === M && Y(r, s));
          }
          var L = 0;
          function N(t) {
            (t[j] = L++), (t._state = void 0), (t._result = void 0), (t._subscribers = []);
          }
          var U = (function() {
            function t(t, e) {
              (this._instanceConstructor = t),
                (this.promise = new t(S)),
                this.promise[j] || N(this.promise),
                n(e)
                  ? ((this.length = e.length),
                    (this._remaining = e.length),
                    (this._result = new Array(this.length)),
                    0 === this.length
                      ? F(this.promise, this._result)
                      : ((this.length = this.length || 0),
                        this._enumerate(e),
                        0 === this._remaining && F(this.promise, this._result)))
                  : Y(this.promise, new Error('Array Methods must be provided an Array'));
            }
            return (
              (t.prototype._enumerate = function(t) {
                for (var e = 0; this._state === E && e < t.length; e++) this._eachEntry(t[e], e);
              }),
              (t.prototype._eachEntry = function(t, e) {
                var r = this._instanceConstructor,
                  n = r.resolve;
                if (n === A) {
                  var o = x(t);
                  if (o === g && t._state !== E) this._settledAt(t._state, e, t._result);
                  else if ('function' != typeof o) this._remaining--, (this._result[e] = t);
                  else if (r === W) {
                    var i = new r(S);
                    C(i, t, o), this._willSettleAt(i, e);
                  } else
                    this._willSettleAt(
                      new r(function(e) {
                        return e(t);
                      }),
                      e
                    );
                } else this._willSettleAt(n(t), e);
              }),
              (t.prototype._settledAt = function(t, e, r) {
                var n = this.promise;
                n._state === E && (this._remaining--, t === M ? Y(n, r) : (this._result[e] = r)),
                  0 === this._remaining && F(n, this._result);
              }),
              (t.prototype._willSettleAt = function(t, e) {
                var r = this;
                k(
                  t,
                  void 0,
                  function(t) {
                    return r._settledAt(T, e, t);
                  },
                  function(t) {
                    return r._settledAt(M, e, t);
                  }
                );
              }),
              t
            );
          })();
          var W = (function() {
            function e(t) {
              (this[j] = L++),
                (this._result = this._state = void 0),
                (this._subscribers = []),
                S !== t &&
                  ('function' != typeof t &&
                    (function() {
                      throw new TypeError(
                        'You must pass a resolver function as the first argument to the promise constructor'
                      );
                    })(),
                  this instanceof e
                    ? (function(t, e) {
                        try {
                          e(
                            function(e) {
                              O(t, e);
                            },
                            function(e) {
                              Y(t, e);
                            }
                          );
                        } catch (r) {
                          Y(t, r);
                        }
                      })(this, t)
                    : (function() {
                        throw new TypeError(
                          "Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function."
                        );
                      })());
            }
            return (
              (e.prototype.catch = function(t) {
                return this.then(null, t);
              }),
              (e.prototype.finally = function(e) {
                var r = this.constructor;
                return t(e)
                  ? this.then(
                      function(t) {
                        return r.resolve(e()).then(function() {
                          return t;
                        });
                      },
                      function(t) {
                        return r.resolve(e()).then(function() {
                          throw t;
                        });
                      }
                    )
                  : this.then(e, e);
              }),
              e
            );
          })();
          return (
            (W.prototype.then = g),
            (W.all = function(t) {
              return new U(this, t).promise;
            }),
            (W.race = function(t) {
              var e = this;
              return n(t)
                ? new e(function(r, n) {
                    for (var o = t.length, i = 0; i < o; i++) e.resolve(t[i]).then(r, n);
                  })
                : new e(function(t, e) {
                    return e(new TypeError('You must pass an array to race.'));
                  });
            }),
            (W.resolve = A),
            (W.reject = function(t) {
              var e = new this(S);
              return Y(e, t), e;
            }),
            (W._setScheduler = function(t) {
              s = t;
            }),
            (W._setAsap = function(t) {
              u = t;
            }),
            (W._asap = u),
            (W.polyfill = function() {
              var t = void 0;
              if (void 0 !== e) t = e;
              else if ('undefined' != typeof self) t = self;
              else
                try {
                  t = Function('return this')();
                } catch (o) {
                  throw new Error(
                    'polyfill failed because global object is unavailable in this environment'
                  );
                }
              var r = t.Promise;
              if (r) {
                var n = null;
                try {
                  n = Object.prototype.toString.call(r.resolve());
                } catch (o) {}
                if ('[object Promise]' === n && !r.cast) return;
              }
              t.Promise = W;
            }),
            (W.Promise = W),
            W
          );
        });
      },
      { process: 'pBGv' }
    ],
    HrMX: [
      function(require, module, exports) {
        function t(e) {
          return (t =
            'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
              ? function(t) {
                  return typeof t;
                }
              : function(t) {
                  return t &&
                    'function' == typeof Symbol &&
                    t.constructor === Symbol &&
                    t !== Symbol.prototype
                    ? 'symbol'
                    : typeof t;
                })(e);
        }
        function e(t) {
          return o(t) || r(t) || n();
        }
        function n() {
          throw new TypeError('Invalid attempt to spread non-iterable instance');
        }
        function r(t) {
          if (
            Symbol.iterator in Object(t) ||
            '[object Arguments]' === Object.prototype.toString.call(t)
          )
            return Array.from(t);
        }
        function o(t) {
          if (Array.isArray(t)) {
            for (var e = 0, n = new Array(t.length); e < t.length; e++) n[e] = t[e];
            return n;
          }
        }
        function i(e, n) {
          return !n || ('object' !== t(n) && 'function' != typeof n) ? u(e) : n;
        }
        function u(t) {
          if (void 0 === t)
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
          return t;
        }
        function c(t, e, n) {
          return (c =
            'undefined' != typeof Reflect && Reflect.get
              ? Reflect.get
              : function(t, e, n) {
                  var r = a(t, e);
                  if (r) {
                    var o = Object.getOwnPropertyDescriptor(r, e);
                    return o.get ? o.get.call(n) : o.value;
                  }
                })(t, e, n || t);
        }
        function a(t, e) {
          for (; !Object.prototype.hasOwnProperty.call(t, e) && null !== (t = f(t)); );
          return t;
        }
        function f(t) {
          return (f = Object.setPrototypeOf
            ? Object.getPrototypeOf
            : function(t) {
                return t.__proto__ || Object.getPrototypeOf(t);
              })(t);
        }
        function l(t, e) {
          if ('function' != typeof e && null !== e)
            throw new TypeError('Super expression must either be null or a function');
          (t.prototype = Object.create(e && e.prototype, {
            constructor: { value: t, writable: !0, configurable: !0 }
          })),
            e && s(t, e);
        }
        function s(t, e) {
          return (s =
            Object.setPrototypeOf ||
            function(t, e) {
              return (t.__proto__ = e), t;
            })(t, e);
        }
        function p(t, e) {
          if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function');
        }
        function y(t, e) {
          for (var n = 0; n < e.length; n++) {
            var r = e[n];
            (r.enumerable = r.enumerable || !1),
              (r.configurable = !0),
              'value' in r && (r.writable = !0),
              Object.defineProperty(t, r.key, r);
          }
        }
        function h(t, e, n) {
          return e && y(t.prototype, e), n && y(t, n), t;
        }
        var b = (function() {
            function t() {
              p(this, t), (this._id = 0), (this._listeners = {});
            }
            return (
              h(t, [
                {
                  key: 'dispatch',
                  value: function() {
                    for (var t in this._listeners) {
                      var e;
                      (e = this._listeners)[t].apply(e, arguments);
                    }
                  }
                },
                {
                  key: 'attach',
                  value: function(t) {
                    var e = this;
                    if ('function' != typeof t) throw new Error('listener function expected');
                    var n = this._id++;
                    return (
                      (this._listeners[n] = t),
                      function() {
                        return delete e._listeners[n];
                      }
                    );
                  }
                }
              ]),
              t
            );
          })(),
          v = '__private__memoized__arguments__',
          _ = (function(t) {
            function n() {
              var t;
              p(this, n);
              for (var e = arguments.length, r = new Array(e), o = 0; o < e; o++)
                r[o] = arguments[o];
              if (!r.length) throw new Error('Initial value to be memoized expected');
              return ((t = i(this, f(n).call(this)))[v] = r), t;
            }
            return (
              l(n, b),
              h(n, [
                {
                  key: 'dispatch',
                  value: function() {
                    for (var t, e = arguments.length, r = new Array(e), o = 0; o < e; o++)
                      r[o] = arguments[o];
                    (this[v] = r),
                      (t = c(f(n.prototype), 'dispatch', this)).call.apply(t, [this].concat(r));
                  }
                },
                {
                  key: 'attach',
                  value: function(t) {
                    var r = c(f(n.prototype), 'attach', this).call(this, t);
                    return t.apply(void 0, e(this[v])), r;
                  }
                }
              ]),
              n
            );
          })();
        module.exports = { Signal: b, MemoizedSignal: _ };
      },
      {}
    ],
    sCMk: [
      function(require, module, exports) {
        function e(e, n) {
          if (!(e instanceof n)) throw new TypeError('Cannot call a class as a function');
        }
        function n(e, n) {
          for (var r = 0; r < n.length; r++) {
            var t = n[r];
            (t.enumerable = t.enumerable || !1),
              (t.configurable = !0),
              'value' in t && (t.writable = !0),
              Object.defineProperty(e, t.key, t);
          }
        }
        function r(e, r, t) {
          return r && n(e.prototype, r), t && n(e, t), e;
        }
        function t(e) {
          return i(e) || s(e) || a();
        }
        function a() {
          throw new TypeError('Invalid attempt to spread non-iterable instance');
        }
        function s(e) {
          if (
            Symbol.iterator in Object(e) ||
            '[object Arguments]' === Object.prototype.toString.call(e)
          )
            return Array.from(e);
        }
        function i(e) {
          if (Array.isArray(e)) {
            for (var n = 0, r = new Array(e.length); n < e.length; n++) r[n] = e[n];
            return r;
          }
        }
        var o = require('es6-promise'),
          l = o.Promise,
          u = require('./signal'),
          c = u.Signal;
        function d(e, n) {
          e.addEventListener('message', function r(a) {
            var s = a.data;
            'connect' === s.method &&
              (e.removeEventListener('message', r), n.apply(void 0, t(s.params)));
          });
        }
        module.exports = function(e, n) {
          d(e, function(r, t) {
            var a = new f(r.id, e);
            n(a, r, t);
          });
        };
        var f = (function() {
          function n(r, t) {
            var a = this;
            e(this, n),
              (this._messageHandlers = {}),
              (this._responseHandlers = {}),
              (this._send = h(r, t.parent)),
              t.addEventListener('message', function(e) {
                a._handleMessage(e.data);
              });
          }
          return (
            r(n, [
              {
                key: 'call',
                value: function(e) {
                  for (
                    var n = this, r = arguments.length, t = new Array(r > 1 ? r - 1 : 0), a = 1;
                    a < r;
                    a++
                  )
                    t[a - 1] = arguments[a];
                  var s = this._send(e, t);
                  return new l(function(e, r) {
                    n._responseHandlers[s] = { resolve: e, reject: r };
                  });
                }
              },
              {
                key: 'send',
                value: function(e) {
                  for (
                    var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), t = 1;
                    t < n;
                    t++
                  )
                    r[t - 1] = arguments[t];
                  this._send(e, r);
                }
              },
              {
                key: 'addHandler',
                value: function(e, n) {
                  return (
                    e in this._messageHandlers || (this._messageHandlers[e] = new c()),
                    this._messageHandlers[e].attach(n)
                  );
                }
              },
              {
                key: '_handleMessage',
                value: function(e) {
                  if (e.method) {
                    var n = e.method,
                      r = e.params,
                      a = this._messageHandlers[n];
                    a && a.dispatch.apply(a, t(r));
                  } else {
                    var s = e.id,
                      i = this._responseHandlers[s];
                    if (!i) return;
                    'result' in e ? i.resolve(e.result) : 'error' in e && i.reject(e.error),
                      delete this._responseHandlers[s];
                  }
                }
              }
            ]),
            n
          );
        })();
        function h(e, n) {
          var r = 0;
          return function(t, a) {
            var s = r++;
            return n.postMessage({ source: e, id: s, method: t, params: a }, '*'), s;
          };
        }
      },
      { 'es6-promise': 'Zt7E', './signal': 'HrMX' }
    ],
    Mq5l: [
      function(require, module, exports) {
        var e = require('es6-promise'),
          n = e.Promise,
          r = require('./channel');
        function t() {
          var e = {};
          return (
            (e.promise = new n(function(n) {
              e.resolve = n;
            })),
            e
          );
        }
        module.exports = function(e, n) {
          var o = t(),
            i = t();
          return (
            i.promise.then(function(n) {
              var r = e.document;
              r.addEventListener(
                'focus',
                function() {
                  return n.send('setActive', !0);
                },
                !0
              ),
                r.addEventListener(
                  'blur',
                  function() {
                    return n.send('setActive', !1);
                  },
                  !0
                );
            }),
            r(e, function(r, t, s) {
              i.resolve(r);
              var u = n(r, t, e);
              s.forEach(function(e) {
                r._handleMessage(e);
              }),
                o.resolve(u);
            }),
            function(e) {
              o.promise.then(e);
            }
          );
        };
      },
      { 'es6-promise': 'Zt7E', './channel': 'sCMk' }
    ],
    GnXy: [
      function(require, module, exports) {
        function e(e, a) {
          if (!(e instanceof a)) throw new TypeError('Cannot call a class as a function');
        }
        function a(e, a) {
          for (var n = 0; n < a.length; n++) {
            var i = a[n];
            (i.enumerable = i.enumerable || !1),
              (i.configurable = !0),
              'value' in i && (i.writable = !0),
              Object.defineProperty(e, i.key, i);
          }
        }
        function n(e, n, i) {
          return n && a(e.prototype, n), i && a(e, i), e;
        }
        var i = require('./signal'),
          l = i.MemoizedSignal,
          t = ['id', 'locale', 'type', 'required', 'validations', 'items'];
        module.exports = (function() {
          function a(n, i) {
            var r = this;
            e(this, a),
              t.forEach(function(e) {
                void 0 !== i[e] && (r[e] = i[e]);
              }),
              (this._value = i.value),
              (this._valueSignal = new l(this._value)),
              (this._isDisabledSignal = new l(void 0)),
              (this._schemaErrorsChangedSignal = new l(void 0)),
              (this._channel = n),
              n.addHandler('valueChanged', function(e, a, n) {
                e !== r.id || (a && a !== r.locale) || ((r._value = n), r._valueSignal.dispatch(n));
              }),
              n.addHandler('isDisabledChanged', function(e) {
                r._isDisabledSignal.dispatch(e);
              }),
              n.addHandler('schemaErrorsChanged', function(e) {
                r._schemaErrorsChangedSignal.dispatch(e);
              });
          }
          return (
            n(a, [
              {
                key: 'getValue',
                value: function() {
                  return this._value;
                }
              },
              {
                key: 'setValue',
                value: function(e) {
                  return (
                    (this._value = e),
                    this._valueSignal.dispatch(e),
                    this._channel.call('setValue', this.id, this.locale, e)
                  );
                }
              },
              {
                key: 'removeValue',
                value: function() {
                  return (
                    (this._value = void 0), this._channel.call('removeValue', this.id, this.locale)
                  );
                }
              },
              {
                key: 'setInvalid',
                value: function(e) {
                  return this._channel.call('setInvalid', e, this.locale);
                }
              },
              {
                key: 'onValueChanged',
                value: function(e) {
                  return this._valueSignal.attach(e);
                }
              },
              {
                key: 'onIsDisabledChanged',
                value: function(e) {
                  return this._isDisabledSignal.attach(e);
                }
              },
              {
                key: 'onSchemaErrorsChanged',
                value: function(e) {
                  return this._schemaErrorsChangedSignal.attach(e);
                }
              }
            ]),
            a
          );
        })();
      },
      { './signal': 'HrMX' }
    ],
    daBI: [
      function(require, module, exports) {
        function e(e) {
          for (var n = 1; n < arguments.length; n++) {
            var o = null != arguments[n] ? arguments[n] : {},
              l = Object.keys(o);
            'function' == typeof Object.getOwnPropertySymbols &&
              (l = l.concat(
                Object.getOwnPropertySymbols(o).filter(function(e) {
                  return Object.getOwnPropertyDescriptor(o, e).enumerable;
                })
              )),
              l.forEach(function(n) {
                t(e, n, o[n]);
              });
          }
          return e;
        }
        function t(e, t, n) {
          return (
            t in e
              ? Object.defineProperty(e, t, {
                  value: n,
                  enumerable: !0,
                  configurable: !0,
                  writable: !0
                })
              : (e[t] = n),
            e
          );
        }
        function n(e, t) {
          if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
        }
        function o(e, t) {
          for (var n = 0; n < t.length; n++) {
            var o = t[n];
            (o.enumerable = o.enumerable || !1),
              (o.configurable = !0),
              'value' in o && (o.writable = !0),
              Object.defineProperty(e, o.key, o);
          }
        }
        function l(e, t, n) {
          return t && o(e.prototype, t), n && o(e, n), e;
        }
        var r = require('./field-locale'),
          i = ['id', 'locales', 'type', 'required', 'validations', 'items'];
        function a(e, t) {
          if (!e._fieldLocales[t])
            throw new Error('Unknown locale "'.concat(t, '" for field "').concat(e.id, '"'));
        }
        module.exports = (function() {
          function o(l, u, c) {
            var f = this;
            n(this, o),
              i.forEach(function(e) {
                void 0 !== u[e] && (f[e] = u[e]);
              }),
              (this._defaultLocale = c),
              (this._fieldLocales = u.locales.reduce(function(n, o) {
                return e({}, n, t({}, o, new r(l, { id: u.id, locale: o, value: u.values[o] })));
              }, {})),
              a(this, c);
          }
          return (
            l(o, [
              {
                key: 'getValue',
                value: function(e) {
                  return this._getFieldLocale(e).getValue();
                }
              },
              {
                key: 'setValue',
                value: function(e, t) {
                  return this._getFieldLocale(t).setValue(e);
                }
              },
              {
                key: 'removeValue',
                value: function(e) {
                  return this.setValue(void 0, e);
                }
              },
              {
                key: 'onValueChanged',
                value: function(e, t) {
                  return t || ((t = e), (e = void 0)), this._getFieldLocale(e).onValueChanged(t);
                }
              },
              {
                key: 'onIsDisabledChanged',
                value: function(e, t) {
                  return (
                    t || ((t = e), (e = void 0)), this._getFieldLocale(e).onIsDisabledChanged(t)
                  );
                }
              },
              {
                key: '_getFieldLocale',
                value: function(e) {
                  return a(this, (e = e || this._defaultLocale)), this._fieldLocales[e];
                }
              }
            ]),
            o
          );
        })();
      },
      { './field-locale': 'GnXy' }
    ],
    XV20: [
      function(require, module, exports) {
        module.exports = function(e, t) {
          var n = e.document,
            i = e.MutationObserver,
            r = function() {
              c.updateHeight();
            },
            u = new i(r),
            o = null,
            s = !1,
            c = {
              startAutoResizer: function() {
                if ((c.updateHeight(), s)) return;
                (s = !0),
                  u.observe(n.body, {
                    attributes: !0,
                    childList: !0,
                    subtree: !0,
                    characterData: !0
                  }),
                  e.addEventListener('resize', r);
              },
              stopAutoResizer: function() {
                if (!s) return;
                (s = !1), u.disconnect(), e.removeEventListener('resize', r);
              },
              updateHeight: function(e) {
                null == e && (e = Math.ceil(n.documentElement.getBoundingClientRect().height));
                e !== o && (t.send('setHeight', e), (o = e));
              }
            };
          return c;
        };
      },
      {}
    ],
    '97BZ': [
      function(require, module, exports) {
        var n = require('./signal'),
          e = n.MemoizedSignal;
        module.exports = function(n, r, t, i) {
          var u = r.sys,
            a = new e(u);
          return (
            n.addHandler('sysChanged', function(n) {
              (u = n), a.dispatch(u);
            }),
            {
              getSys: function() {
                return u;
              },
              onSysChanged: function(n) {
                return a.attach(n);
              },
              fields: t.reduce(function(n, e) {
                return (n[e.id] = i(e)), n;
              }, {})
            }
          );
        };
      },
      { './signal': 'HrMX' }
    ],
    iabO: [
      function(require, module, exports) {
        var e = [
          'getContentType',
          'getEntry',
          'getEntrySnapshots',
          'getAsset',
          'getEditorInterface',
          'getPublishedEntries',
          'getPublishedAssets',
          'getContentTypes',
          'getEntries',
          'getAssets',
          'createContentType',
          'createEntry',
          'createAsset',
          'updateContentType',
          'updateEntry',
          'updateAsset',
          'deleteContentType',
          'deleteEntry',
          'deleteAsset',
          'publishEntry',
          'publishAsset',
          'unpublishEntry',
          'unpublishAsset',
          'archiveEntry',
          'archiveAsset',
          'unarchiveEntry',
          'unarchiveAsset',
          'createUpload',
          'processAsset',
          'waitUntilAssetProcessed',
          'getUsers'
        ];
        module.exports = function(t) {
          var s = {};
          return (
            e.forEach(function(e) {
              s[e] = function() {
                for (var s = arguments.length, n = new Array(s), r = 0; r < s; r++)
                  n[r] = arguments[r];
                return t.call('callSpaceMethod', e, n);
              };
            }),
            s
          );
        };
      },
      {}
    ],
    '6GEt': [
      function(require, module, exports) {
        function n(t) {
          return (n =
            'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
              ? function(n) {
                  return typeof n;
                }
              : function(n) {
                  return n &&
                    'function' == typeof Symbol &&
                    n.constructor === Symbol &&
                    n !== Symbol.prototype
                    ? 'symbol'
                    : typeof n;
                })(t);
        }
        module.exports = function(t) {
          return {
            openAlert: e.bind(null, 'alert'),
            openConfirm: e.bind(null, 'confirm'),
            openPrompt: e.bind(null, 'prompt'),
            openExtension: e.bind(null, 'extension'),
            selectSingleEntry: l.bind(null, 'Entry', !1),
            selectSingleAsset: l.bind(null, 'Asset', !1),
            selectMultipleEntries: l.bind(null, 'Entry', !0),
            selectMultipleAssets: l.bind(null, 'Asset', !0)
          };
          function e(n, e) {
            return t.call('openDialog', n, o(e));
          }
          function l(n, e, l) {
            return (
              ((l = o(l)).entityType = n),
              (l.multiple = e),
              t.call('openDialog', 'entitySelector', l)
            );
          }
          function o(t) {
            return 'object' === n(t) && null !== t && !Array.isArray(t) ? t : {};
          }
        };
      },
      {}
    ],
    fqJo: [
      function(require, module, exports) {
        var e = require('./signal'),
          n = e.MemoizedSignal;
        module.exports = function(e, a) {
          var d = new n(void 0),
            t = new n(void 0);
          return (
            e.addHandler('localeSettingsChanged', function(e) {
              d.dispatch(e);
            }),
            e.addHandler('showDisabledFieldsChanged', function(e) {
              t.dispatch(e);
            }),
            {
              editorInterface: a,
              onLocaleSettingsChanged: function(e) {
                return d.attach(e);
              },
              onShowDisabledFieldsChanged: function(e) {
                return t.attach(e);
              }
            }
          );
        };
      },
      { './signal': 'HrMX' }
    ],
    Y2Q9: [
      function(require, module, exports) {
        function t(t) {
          for (var e = 1; e < arguments.length; e++) {
            var r = null != arguments[e] ? arguments[e] : {},
              o = Object.keys(r);
            'function' == typeof Object.getOwnPropertySymbols &&
              (o = o.concat(
                Object.getOwnPropertySymbols(r).filter(function(t) {
                  return Object.getOwnPropertyDescriptor(r, t).enumerable;
                })
              )),
              o.forEach(function(e) {
                n(t, e, r[e]);
              });
          }
          return t;
        }
        function n(t, n, e) {
          return (
            n in t
              ? Object.defineProperty(t, n, {
                  value: e,
                  enumerable: !0,
                  configurable: !0,
                  writable: !0
                })
              : (t[n] = e),
            t
          );
        }
        module.exports = function(n) {
          return {
            openEntry: function(e, r) {
              return n.call('navigateToContentEntity', t({}, r, { entityType: 'Entry', id: e }));
            },
            openNewEntry: function(e, r) {
              return n.call(
                'navigateToContentEntity',
                t({}, r, { entityType: 'Entry', id: null, contentTypeId: e })
              );
            },
            openAsset: function(e, r) {
              return n.call('navigateToContentEntity', t({}, r, { entityType: 'Asset', id: e }));
            },
            openNewAsset: function(e) {
              return n.call('navigateToContentEntity', t({}, e, { entityType: 'Asset', id: null }));
            }
          };
        };
      },
      {}
    ],
    CHnp: [
      function(require, module, exports) {
        module.exports = {
          LOCATION_ENTRY_FIELD: 'entry-field',
          LOCATION_ENTRY_FIELD_SIDEBAR: 'entry-field-sidebar',
          LOCATION_ENTRY_SIDEBAR: 'entry-sidebar',
          LOCATION_DIALOG: 'dialog',
          LOCATION_ENTRY_EDITOR: 'entry-editor'
        };
      },
      {}
    ],
    LVu9: [
      function(require, module, exports) {
        var e;
        function r(e) {
          for (var r = 1; r < arguments.length; r++) {
            var t = null != arguments[r] ? arguments[r] : {},
              o = Object.keys(t);
            'function' == typeof Object.getOwnPropertySymbols &&
              (o = o.concat(
                Object.getOwnPropertySymbols(t).filter(function(e) {
                  return Object.getOwnPropertyDescriptor(t, e).enumerable;
                })
              )),
              o.forEach(function(r) {
                n(e, r, t[r]);
              });
          }
          return e;
        }
        function n(e, r, n) {
          return (
            r in e
              ? Object.defineProperty(e, r, {
                  value: n,
                  enumerable: !0,
                  configurable: !0,
                  writable: !0
                })
              : (e[r] = n),
            e
          );
        }
        var t = require('./field'),
          o = require('./field-locale'),
          i = require('./window'),
          u = require('./entry'),
          a = require('./space'),
          c = require('./dialogs'),
          l = require('./editor'),
          f = require('./navigator'),
          s = require('./locations'),
          d = [p, T, b, I, y],
          O =
            (n((e = {}), s.LOCATION_ENTRY_FIELD, d),
            n(e, s.LOCATION_ENTRY_FIELD_SIDEBAR, d),
            n(e, s.LOCATION_ENTRY_SIDEBAR, [p, T, I, y]),
            n(e, s.LOCATION_ENTRY_EDITOR, [p, T, I]),
            n(e, s.LOCATION_DIALOG, [p, g, y]),
            e);
        function p(e, r) {
          var n = r.user,
            t = r.parameters,
            o = r.locales,
            i = r.ids;
          return {
            location: {
              is: function(e) {
                return (r.location || s.LOCATION_ENTRY_FIELD) === e;
              }
            },
            user: n,
            parameters: t,
            locales: { available: o.available, default: o.default, names: o.names },
            space: a(e),
            dialogs: c(e),
            navigator: f(e),
            notifier: {
              success: function(r) {
                return e.send('notify', { type: 'success', message: r });
              },
              error: function(r) {
                return e.send('notify', { type: 'error', message: r });
              }
            },
            ids: i,
            alpha: function(r, n) {
              return e.call('alpha', { command: r, args: n });
            }
          };
        }
        function y(e, r, n) {
          return { window: i(n, e) };
        }
        function I(e, r) {
          var n = r.editorInterface;
          return { editor: l(e, n) };
        }
        function T(e, r) {
          var n = r.locales,
            o = r.contentType,
            i = r.entry,
            a = r.fieldInfo;
          return {
            contentType: o,
            entry: u(e, i, a, function(r) {
              return new t(e, r, n.default);
            })
          };
        }
        function b(e, r) {
          var n = r.field;
          return { field: new o(e, n) };
        }
        function g(e) {
          return {
            close: function(r) {
              return e.send('closeDialog', r);
            }
          };
        }
        module.exports = function(e, n, t) {
          return (O[n.location] || d).reduce(function(o, i) {
            return r({}, o, i(e, n, t));
          }, {});
        };
      },
      {
        './field': 'daBI',
        './field-locale': 'GnXy',
        './window': 'XV20',
        './entry': '97BZ',
        './space': 'iabO',
        './dialogs': '6GEt',
        './editor': 'fqJo',
        './navigator': 'Y2Q9',
        './locations': 'CHnp'
      }
    ],
    Focm: [
      function(require, module, exports) {
        var i = require('./initialize'),
          e = require('./api'),
          r = require('./locations');
        module.exports = { init: i(window, e), locations: r };
      },
      { './initialize': 'Mq5l', './api': 'LVu9', './locations': 'CHnp' }
    ]
  },
  {},
  ['Focm'],
  'contentfulExtension'
);
