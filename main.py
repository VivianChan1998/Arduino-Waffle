import argparse
from Components.Stepper import Stepper
from Components.Button import Button
from Components.LED import LED
from Board import Board

def main(args):
    # list all usable components    
    inputs = ["button"]
    outputs = ["stepper", "LED"]

    # TODO
    # establish component instances based on user input



    Uno = Board("ArduinoUno")
    ### TEMP ###
    #stepper_component = Stepper(1, Uno)
    #button_component = Button(1, Uno)
    led_component  = LED(1, Uno)
    
    included_input = []
    included_output = [led_component]

    print(Uno)

    print("What input components do you want to include in this program?")
    for c in included_input:
        print(c.name)
    
    print("What output components do you want to include in this program?")
    for c in included_output:
        print(c.name)

    print("---------------\n")


    # pair input and output with their behavior

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


    # generate code

    code = []

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
    # need to modify them to ensure each entry in `code[]` is one line of code

    # TODO
    # fix code indent

    for c in code:
        print(c, end='')


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="")
    args = parser.parse_args()
    main(args)
