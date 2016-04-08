const test = require('tape');
import { Observable } from '../../../src/observable.class';

function newObservable() {
    return new Observable(() => {});
}

test('Observable should be a class', t => {
    t.equal(typeof Observable, 'function', 'Is a function');
    t.throws(Observable, /TypeError/, 'Throws on execution');
    t.ok(() => new Observable(), 'Runs as constructor')

    t.end();
});

test('Observable should require a subscribe method', t => {
    function instantiateObservable() {
        return new Observable();
    }
    t.throws(instantiateObservable);
    t.end();
});

test('A new Observable should contain a static of method', t => {
    t.equal(typeof Observable.of, 'function');
    t.end();
});

test('A new Observable should contain a subscribe method', t => {
    const observable = newObservable();
    t.equal(typeof observable.subscribe, 'function')
    t.end();
});

test('A new Observable should contain a forEach method', t => {
    const observable = newObservable();
    t.equal(typeof observable.forEach, 'function')
    t.end();
});

test('A new Observable should contain a Symbol.observable method', t => {
    const observable = newObservable();
    t.equal(typeof observable[Symbol.observable], 'function');
    t.end();
});

test('observable.subscribe should throw if it is not given an observer with a next method', t => {
    const observable = newObservable();

    function subscriber() {
        return observable.subscribe();
    }

    t.throws(subscriber);
    t.end();
});

test('observable.subscribe should return an unsubscribe function', t => {
    const observable = newObservable();
    const unsubscribe = observable.subscribe({
        next() {}
    });

    t.equal(typeof unsubscribe, 'function');
    t.end();
});

test('observable.forEach should throw if no onNext function is provided', t => {
    const observable = newObservable();

    function thrower() {
        return observable.forEach();
    }

    t.throws(thrower);
    t.end();
});

test('observable.forEach should return a promise', t => {
    const observable = newObservable();
    const promise = observable.forEach(() => {});

    t.equal(typeof promise.then, 'function');
    t.end();
});
