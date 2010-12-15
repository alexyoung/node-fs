var fs = require('fs');

/**
 * Export everything already available through fs.
 */
for (var fun in fs) {
    exports[fun] = fs[fun];
}

/**
 * Offers functionality similar to mkdir -p
 *
 * Asynchronous operation. No arguments other than a possible exception
 * are given to the completion callback.
 */
function mkdir_p (path, mode, callback, position) {
    mode = mode || 0777;
    position = position || 0;
    parts = require('path').normalize(path).split('/');

    if (position >= parts.length) {
        if (callback) {
            return callback();
        } else {
            return true;
        }
    }

    var directory = parts.slice(0, position + 1).join('/');
    fs.stat(directory, function(err) {
        if (err === null) {
            mkdir_p(path, mode, callback, position + 1);
        } else {
            fs.mkdir(directory, mode, function (err) {
                if (err) {
                    if (callback) {
                        return callback(err);
                    } else {
                        throw err;
                    }
                } else {
                    mkdir_p(path, mode, callback, position + 1);
                }
            })
        }
    })
}

/**
 * Polymorphic approach to fs.mkdir()
 *
 * If the third parameter is boolean and true assume that
 * caller wants recursive operation.
 */
exports.mkdir = function (path, mode, recursive, callback) {
    if (typeof(recursive) != 'boolean') {
        callback = recursive;
        recursive = false;
    }
    if (!recursive) {
        fs['mkdir'](path, mode, callback);
    } else {
        return mkdir_p(path, mode, callback);
    }
}