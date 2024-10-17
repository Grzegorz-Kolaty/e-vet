import {Subscription} from "rxjs";

export class SubscriptionsManager {
    private subs: Subscription[] = [];

    set add(s: Subscription) {
        this.subs.push(s);
        // console.log('subs when add: ', this.subs);
    }

    dispose() {
        this.subs.forEach((s) => {
            s.unsubscribe();
        });
        // console.log('subs when disposed: ', this.subs);

    }
}
