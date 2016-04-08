const test = require('tape');

import { SubscriptionObserver } from '../../../src/subscription-observer.class';

test('SubscriptionObserver should export a function', t => {
    t.equal(typeof SubscriptionObserver, 'function');
    t.end();
});

test('SubscriptionObserver should return an instance with these properties', t => {
    const destination = {};
    const observer = new SubscriptionObserver(destination);

    t.true(observer.destination === destination);
    t.false(observer.isUnsubscribed);
    t.equal(typeof observer.next, 'function');
    t.equal(typeof observer.error, 'function');
    t.equal(typeof observer.complete, 'function');
    t.equal(typeof observer.unsubscribe, 'function');
    t.end();
});

test('observer.unsubscribe should set isUnsubscribed to true', t => {
    const observer = new SubscriptionObserver({});

    observer.unsubscribe();

    t.true(observer.isUnsubscribed);
    t.end();
});

test('observer.unsubscribe should call this._unsubscribe if set', t => {
    const observer = new SubscriptionObserver({});

    let called = false;
    observer._unsubscribe = function() {
        called = true;
    }

    observer.unsubscribe();

    t.true(called);
    t.end();
});

test('observer.next should call destination.next with a value if it is set', t => {
    let called = false;
    const observer = new SubscriptionObserver({
        next(value) {
            called = value;
        },
    });

    observer.next('this is true');

    t.true('this is true');
    t.end();
});

test('observer.next should not throw if destination.next is not set', t => {
    const observer = new SubscriptionObserver({});

    function thrower() {
        observer.next();
    }

    t.doesNotThrow(thrower);
    t.end();
});

test('observer.next should not call destination.next if unusubscribed', t => {
    let called = false;
    const observer = new SubscriptionObserver({
        next() {
            called = true;
        },
    });

    observer.unsubscribe();
    observer.next();

    t.false(called);
    t.end();
});

test('observer.error should call destination.error with a value if it is set', t => {
    let called = false;
    const observer = new SubscriptionObserver({
        error(err) {
            called = err;
        },
    });

    observer.error('this is an error');

    t.true('this is an error');
    t.end();
});

test('observer.error should not throw if destination.error is not set', t => {
    const observer = new SubscriptionObserver({});

    function thrower() {
        observer.error();
    }

    t.doesNotThrow(thrower);
    t.end();
});

test('observer.error should not call destination.error if unusubscribed', t => {
    let called = false;
    const observer = new SubscriptionObserver({
        error() {
            called = true;
        },
    });

    observer.unsubscribe();
    observer.error();

    t.false(called);
    t.end();
});
