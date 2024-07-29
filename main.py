import argparse
import Library
from Enums import ComponentType 
from Components.Stepper import Stepper
from Components.Button import Button

def main(args):
    # 1 internally establish components
    #establish all usable libraries and usable components
    #stepper_lib = Library("<Stepper.h>")
    stepper_component = Stepper()
    button_component = Button()
    #button_component = Component("Button", ComponentType.INPUT_DEVICE_DIGITAL, None)


    #Libraries = [stepper_lib]
    inputs = []
    outputs = [stepper_component]


    included_input = [] #TEMP
    included_output = [stepper_component]

    code = ""

    # 2 ask about what components to include in this code

    print("What input components do you want to include in this program?")
    for c in inputs:
        print(c.name)
    
    print("What output components do you want to include in this program?")
    for c in outputs:
        print(c.name)


    # 3 ask about each input, to which output?


    for c in included_output:
        code += c.get_include()

    for c in included_output:
        code += c.get_global_var()

    code += "void setup() {\n"
    
    for c in included_output:
        code += c.get_setup()

    code += "} \n\n"

    code += "void loop() {\n"
    
    for c in included_output:
        code += c.get_loop_start()
    
    #TODO code logic

    for c in included_output:
        code += c.get_loop_end()
    
    code += "} \n\n"

    print(code)

    

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="")
    args = parser.parse_args()
    main(args)
