Symbol.observable = Symbol.observable || Symbol('@@observable');
import { SubscriptionObserver } from './subscription-observer.class';

export class Observable {
    /**
     * Create an observable that can be subscribed to.
     *
     * @param  {function} _subscribe callback function to call when the Observer emits a value
     *
     * @return {object} observable an instance of Observable
     */
    constructor(_subscribe) {
        if (typeof _subscribe !== 'function') {
            throw new Error('Observer must be instantiated with a subscription function.');

        }

        this._subscribe = _subscribe;
        // this [Symbol.observable] = () => this;
    }


    [Symbol.observable]() {
        return this;
    }


    /**
     * Subscribe to events passed by the observer
     *
     * @param  {object} observer object with methods for subscription
     * @param  {function} observer.next function to be called when a new value is pushed
     * @param  {function} observer.error function to be called when an error occurs
     * @param  {function} complete function to be called when the observer completes
     *
     * @return {function} unsubscribe function to call to unsubscribe from the observer
     */
    subscribe(observer) {
        if (!observer || typeof observer.next !== 'function') {
            throw new Error('Subscribe requires a observer object with a next method.');
        }

        const subscriptionObserver = new SubscriptionObserver(observer);

        subscriptionObserver._unsubscribe = this._subscribe(subscriptionObserver);
        return () => subscriptionObserver.unsubscribe();
    }

    /**
     * forEach operates on each value emitted by the observable, by applying
     * that value to a given onNext function.
     *
     * @param  {function} onNext callback to run when the observer emits a new value
     * @return {Promise} Promise that is resolved when the obserable completes
     */
    forEach(onNext) {
        if (!onNext || typeof onNext !== 'function') {
            throw new Error('forEach requires an onNext function.');
        }

        return new Promise((resolve, reject) => {
            this.subscribe({
                next: onNext,
                error: reject,
                complete: resolve,
            });
        });
    }


    /**
     * Create a Observable of the values provided in the arguments.
     *
     * The method accepts any number of arguments and will return the, one by
     * one, in the observable.
     *
     * @return {function} function to call when unsubscribing from the Observable.
     */
    static of(...args) {
        return new Observable(observer => {
            setTimeout(() => {
                args.forEach(item => {
                    return observer.next(item)
                });

                observer.complete();
            });

            return () => {};
        });
    }


    /**
     * Create an observable from the given observable or iterable.

     * @param  {Object} obj Should be either an iterable or an observable
     * @return {Observable}
     */
    static from(obj) {
        if ( !obj ||
            (
                !Array.isArray(obj) &&
                obj[Symbol.observable] === undefined &&
                obj[Symbol.iterator]   === undefined
            )
        ) {
            throw new Error('from requires an observable or an iterable.');
        }

        if (typeof obj[Symbol.observable] === 'function') {
            return obj[Symbol.observable]();
        }

        return new Observable(observer => {
            setTimeout(() => {
                for (let item of obj) {
                    observer.next(item);
                }

                observer.complete();
            });

            return () => {};
        });
    }
}

// static listenFor(event, element) {
//     return new Observable(observer => {
//         function callback(ev) {
//             observer.next(ev);
//         }
//
//         element.addEventListener(event, callback);
//
//         return () => element.removeEventListener(event, callback);
//     });
// }
//
// static interval(_interval) {
//     return new Observable(observer => {
//         const id = setInterval(() => observer.next(), _interval);
//
//         return () => clearInterval(id);
//     });
// }
