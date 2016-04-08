export class SubscriptionObserver {
  constructor(destination) {
    this.destination = destination;
  }

  next(value) {
    const destination = this.destination;

    if (destination.next && !this.isUnsubscribed) {
      destination.next(value);
    }
  }

  error(err) {
    const destination = this.destination;

    if (!this.isUnsubscribed) {
      if (destination.error) {
        destination.error(err);
      }

      this.unsubscribe();
    }
  }

  complete() {
    const destination = this.destination;

    if (!this.isUnsubscribed) {
      if (destination.complete) {
        destination.complete();
      }

      this.unsubscribe();
    }
  }

  unsubscribe() {
    this.isUnsubscribed = true;

    if (this._unsubscribe) {
      this._unsubscribe();
    }
  }
}
