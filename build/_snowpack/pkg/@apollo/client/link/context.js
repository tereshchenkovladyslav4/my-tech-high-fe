import { A as ApolloLink, r as __rest, O as Observable } from '../../../common/ApolloLink-153f28d0.js';
import '../../../common/process-2545f00a.js';

function setContext(setter) {
    return new ApolloLink(function (operation, forward) {
        var request = __rest(operation, []);
        return new Observable(function (observer) {
            var handle;
            var closed = false;
            Promise.resolve(request)
                .then(function (req) { return setter(req, operation.getContext()); })
                .then(operation.setContext)
                .then(function () {
                if (closed)
                    return;
                handle = forward(operation).subscribe({
                    next: observer.next.bind(observer),
                    error: observer.error.bind(observer),
                    complete: observer.complete.bind(observer),
                });
            })
                .catch(observer.error.bind(observer));
            return function () {
                closed = true;
                if (handle)
                    handle.unsubscribe();
            };
        });
    });
}

export { setContext };
