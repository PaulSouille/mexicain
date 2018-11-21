module.exports = class Tools {
    static isEmpty(obj) {
        if (obj == null) return true;
        if (obj.length && obj.length > 0)    return false;
        if (obj.length === 0)  return true;
        for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) return false;
        }

        return true;
    }
}