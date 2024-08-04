import argparse
from Enums import ComponentType 
from Components.Stepper import Stepper
from Components.Button import Button
from Components.LED import LED

def main(args):
    # 1 internally establish components
    #establish all usable libraries and usable components

    stepper_component = Stepper(id = 1)
    button_component = Button(id = 1)
    led_component  = LED(id = 1)
    
    inputs = [button_component]
    outputs = [stepper_component]


    included_input = [button_component] #TEMP
    included_output = [led_component]

    code = []

    # 2 ask about what components to include in this code

    print("What input components do you want to include in this program?")
    for c in included_input:
        print(c.name)
    
    print("What output components do you want to include in this program?")
    for c in included_output:
        print(c.name)

    print("---------------")


    # 3 ask about each input, to which output?

    io_pair = []

    for i in included_input:
        print("for the " + i.name + "... ")
        i.ask_question()
        print('for the ' + i.name + ', which output component reacts to it?')

        for o in included_output:
            print(o.name)
        output_device_num = input('?\n')

        o = included_output[int(output_device_num)]
        io_pair.append((i, o))

        print('for the ' + o.name + '... ')
        o.ask_question()


    for c in included_input:
        code.append(c.get_include())
    for c in included_output:
        code.append(c.get_include())

    for c in included_input:
        code.append(c.get_global_var())
    for c in included_output:
        code.append(c.get_global_var())

    code.append("void setup() {\n")
    
    for c in included_input:
        code.append(c.get_setup())
    for c in included_output:
        code.append(c.get_setup())

    code.append("} \n\n")

    code.append("void loop() {\n")
    
    for c in included_input:
        code.append(c.get_loop_start())
    for c in included_output:
        code.append(c.get_loop_start())
    
    for p in io_pair:
        code.append('if (' + p[0].get_loop_logic() + ') {\n')
        code.append(p[1].get_loop_logic() + '}\n')

    for c in included_input:
        code.append(c.get_loop_end())
    for c in included_output:
        code.append(c.get_loop_end())
    
    code.append("} \n\n")

    for c in included_input:
        code.append(c.get_helper_function())
    for c in included_output:
        code.append(c.get_helper_function())

    # TODO
    # function returned object is a string which might have multiple lines of code
    # need to modify them to ensure each entry in `code[]` is one line of codeg

    for c in code:
        print(c, end='')


    

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="")
    args = parser.parse_args()
    main(args)
