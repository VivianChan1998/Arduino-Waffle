export function formProgram(program, indent) {
    if(program === undefined) return ""
    let currentIndentCounter = indent;
    let formattedProgram = "";

    for (let line of program) {
        let indent = "\t".repeat(currentIndentCounter);

        if (line===undefined) {
            continue;
        }
        
        if (line.includes("#define")) {
            formattedProgram += indent + line + "\n";
        } else if (line.includes("{")) {
            formattedProgram += indent + line + "\n";
            currentIndentCounter++;
        } else if (line.includes("}")) {
            currentIndentCounter--;
            indent = "\t".repeat(currentIndentCounter);
            formattedProgram += indent + line + "\n";
        } else {
            formattedProgram += indent + line + "\n";
        }

        if (currentIndentCounter === 0) {
            formattedProgram += "\n";
        }
    }
    
    return formattedProgram;
}