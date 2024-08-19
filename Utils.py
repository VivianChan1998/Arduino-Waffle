def form_program(program: list[str]) -> str: 
    current_indent_counter = 0  
    formatted_program = ""

    for line in program: 
        if "#define" in line: 
            indent = "\t" * current_indent_counter
            formatted_program += indent + line + "\n"
        elif "{" in line:
            indent = "\t" * current_indent_counter
            formatted_program += indent + line + "\n"
            current_indent_counter += 1
        elif "}" in line:
            current_indent_counter -= 1
            indent = "\t" * current_indent_counter
            formatted_program += indent + line + "\n"
        else: 
            indent = "\t" * current_indent_counter
            formatted_program += indent + line + ";" + "\n" 

        if current_indent_counter == 0:
            formatted_program += "\n"   
    

    return formatted_program

test = ["#define x 1", "void myFunction() {", "printf('I just got executed!')", "}", "int main() {", "myFunction()", "return 0", "}"]

print(form_program(test))

