const transform = (obj, predicate) => {
    return Object.keys(obj).reduce((memo, key) => {
        if(predicate(obj[key], key)) {
            memo[key] = obj[key]
        }
        return memo
    }, {});
}

const omit = (obj, items) => transform(obj, (value, key) => !items.includes(key));

function isEmail(email) {
    const regexExp =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
    return regexExp.test(email);
}

function isDataURL(value) {
    const dataUrlRegex =
    /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\\/?%\s]*)\s*$/i;
    return dataUrlRegex.test(value);
}

function filterOut(obj, ...fields) {
    const newObj = { ...obj };
    fields.forEach(field => {
        delete newObj[field];
    });
    return newObj;
}

function sortObject(obj) {
    const sorted = {};
    const str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

module.exports = {
    omit,
    isEmail,
    isDataURL,
    filterOut,
    sortObject
}