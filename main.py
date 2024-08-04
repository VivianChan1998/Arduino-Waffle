import argparse
import Library
from Enums import ComponentType 
from Components.Stepper import Stepper
from Components.Button import Button
from Components.LED import LED

def main(args):
    # 1 internally establish components
    #establish all usable libraries and usable components
    #stepper_lib = Library("<Stepper.h>")
    stepper_component = Stepper(id = 1)
    button_component = Button(id = 1)
    led_component  = LED(id = 1)
    #button_component = Component("Button", ComponentType.INPUT_DEVICE_DIGITAL, None)


    #Libraries = [stepper_lib]
    inputs = [button_component]
    outputs = [stepper_component]


    included_input = [button_component] #TEMP
    included_output = [led_component]

    code = ""

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
        print("for the " + i.name + ", what does it do?")
        for s in i.state_names:
            print(s)
        state_num = input('?\n')
        i.choose_state(state_num)

        print('for this input component, which output component reacts to it?')

        for o in included_output:
            print(o.name)
        output_device_num = input('?\n')
        o = included_output[int(output_device_num)]
        io_pair.append((i, o))

        print('how does this output component act?')

        for s in o.state_names:
            print(s)
        state_num = int(input('?\n'))
        o.choose_state(state_num)
        if o.parameter[state_num] is not None:
            param = o.parameter[state_num]
            print(param['prompt'])
            ans = input("?\n")
            o.parameter[state_num]['val'] = ans
            print(o.parameter)



    for c in included_input:
        code += c.get_include()
    for c in included_output:
        code += c.get_include()

    for c in included_input:
        code += c.get_global_var()
    for c in included_output:
        code += c.get_global_var()

    code += "void setup() {\n"
    
    for c in included_input:
        code += c.get_setup()
    for c in included_output:
        code += c.get_setup()

    code += "} \n\n"

    code += "void loop() {\n"
    
    for c in included_input:
        code += c.get_loop_start()
    for c in included_output:
        code += c.get_loop_start()
    
    for p in io_pair:
        code += 'if (' + p[0].get_loop_logic() + ') {\n'
        code += p[1].get_loop_logic() + '}\n'

    for c in included_input:
        code += c.get_loop_end()
    for c in included_output:
        code += c.get_loop_end()
    
    code += "} \n\n"

    for c in included_input:
        code += c.get_helper_function()
    for c in included_output:
        code += c.get_helper_function()

    print(code)

    

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="")
    args = parser.parse_args()
    main(args)
