import argparse
from Enums import ComponentType
from Components.Stepper import Stepper
from Components.Button import Button
from Components.LED import LED
from Components.Potentiometer import Potentiometer
from Components.UltrasonicSensor import UltrasonicSensor
from Board import Board
from IOBehavior import IOBehavior
from Utils import form_program

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
    led_component2  = LED(2, Uno)
    
    included_input_behavior = [IOBehavior(UltrasonicSensor(1, Uno))]
    included_output = [led_component, led_component2]

    print(Uno)
    
    print("---------------\n")

    print("What input components do you want to include in this program?")
    for i in included_input_behavior:
        print(i.input_obj.name)
    
    print("What output components do you want to include in this program?")
    for c in included_output:

        print(c.name)

    print("---------------\n")

    # if all ouptput is ONLY_DIGITAL
    #     input can only be used as digital

    for i in included_input_behavior:
        i.input_obj.ask_init_question()
        if i.input_obj.is_analog:
            i.set_analog()
    for o in included_output:
        o.ask_init_question()
    

    for i in included_input_behavior:
        print("for the " + i.input_obj.name + "... ")
        i.input_obj.ask_question()
        print('for the ' + i.input_obj.name + ', which output component reacts to it?')
        for n, o in enumerate(included_output):
            if i.use_analog:
                if o.device_type != ComponentType.OUTPUT_DEVICE_ONLY_DIGITAL:
                    print(str(n) + ' ' + o.name)
            else:
                print(str(n) + ' ' + o.name)


        output_device_num = input('(temp: type the number next to the component)?\n')

        nums = output_device_num.split()

        for n in nums:
            o = included_output[int(n)]
            if i.use_analog:
                o.set_analog()
            state_num = o.ask_question()
            i.add_output(o, state_num)

    code = []
    seen_library = []

    for i in included_input_behavior:
        if i.input_obj.library and i.input_obj.name not in seen_library:
            seen_library.append(i.input_obj.name)
            code.append(i.input_obj.str_include(i.input_obj.library))
    for o in included_output:
        if o.library and o.name not in seen_library:
            seen_library.append(o.name)
            code.append(o.str_include(o.library))

    # Not necessary anymore 
    '''
    for i in included_input_behavior:
        code.extend(i.input_obj.get_include())
    for o in included_output:
        code.extend(o.get_include())
    '''
    
    for i in included_input_behavior:
        code.extend(i.input_obj.get_global_var())
    for o in included_output:
        code.extend(o.get_global_var())

    code.append("void setup() {")
    
    code.append("Serial.begin(9600)")
    for i in included_input_behavior:
        code.extend(i.input_obj.get_setup())
    for o in included_output:
        code.extend(o.get_setup())

    code.append("}")

    code.append("void loop() {")
    
    for i in included_input_behavior:
        code.extend(i.input_obj.get_loop_start())
    for o in included_output:
        code.extend(o.get_loop_start())
    
    for i in included_input_behavior:
        if i.use_analog:
            code_temp = i.get_output_loop_analog()
            code.extend(code_temp)
        else:
            code.append('if (' + i.input_obj.get_loop_logic() + ') {')
            code_temp = i.get_output_loop()
            code.extend(code_temp)
        code.append('}')

    for i in included_input_behavior:
        code.extend(i.input_obj.get_loop_end())
    for o in included_output:
        code.extend(o.get_loop_end())
    
    code.append("}")

    seen_helper_functions = []

    # SOME ERROR ABOUT CONVERTING QUESTIONS TO STATE HERE, NOT QUITE SURE
    '''    
    for i in included_input_behavior:
        if i.input_obj.get_helper_function() != "":
            func, name = i.input_obj.get_helper_function()
            if name not in seen_helper_functions:
                seen_helper_functions.append(name)
                code.extend(func)
        
    for o in included_output:
        if o.get_helper_function() != "":
            func, name = o.get_helper_function()
            if name not in seen_helper_functions:
                seen_helper_functions.append(name)
                code.extend(func)
    '''

    # TODO
    # function returned object is a string which might have multiple lines of code
    # need to modify them to ensure each entry in `code[]` is one line of code

    # TODO
    # fix code indent
    print(code)
    code = form_program(code)

    print("-----------------\n\n")


    for c in code:
        print(c, end='')


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="")
    args = parser.parse_args()
    main(args)
