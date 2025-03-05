export default class Code {
    strInclude(name) {
        return `#include <${name}>`;
    }

    strPinMode(name, io) {
        let ret = `pinMode(${name}, `;
        ret += (io === 'i') ? "INPUT)" : "OUTPUT);";
        return ret;
    }

    strDefine(variable, value) {
        return `#define ${variable} ${value}`;
    }

    strInitVariable(varType, variable, value) {
        return `${varType} ${variable} = ${value};`;
    }

    strAssignVariable(left, right) {
        return `${left} = ${right};`;
    }

    strCallFunction(obj, funcName, listToPass) {
        return `${obj}.${funcName}(${listToPass.join(', ')})`;
    }
}