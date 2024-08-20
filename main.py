import argparse
from Enums import ComponentType
from Components.Stepper import Stepper
from Components.Button import Button
from Components.LED import LED
from Components.Potentiometer import Potentiometer
from Board import Board
from IOBehavior import IOBehavior

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
    
    included_input_behavior = [IOBehavior(Potentiometer(1, Uno))]
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
            if o.device_type != ComponentType.OUTPUT_DEVICE_ONLY_DIGITAL:
                print(str(n) + ' ' + o.name)
        output_device_num = input('(temp: type the number next to the component)?\n')

        nums = output_device_num.split()

        for n in nums:
            o = included_output[int(n)]
            state_num = o.ask_question()
            i.add_output(o, state_num)

    code = []

    for i in included_input_behavior:
        code.append(i.input_obj.get_include())
    for o in included_output:
        code.append(o.get_include())

    for i in included_input_behavior:
        code.append(i.input_obj.get_global_var())
    for o in included_output:
        code.append(o.get_global_var())

    code.append("void setup() {\n")
    
    for i in included_input_behavior:
        code.append(i.input_obj.get_setup())
    for o in included_output:
        code.append(o.get_setup())

    code.append("} \n\n")

    code.append("void loop() {\n")
    
    for i in included_input_behavior:
        code.append(i.input_obj.get_loop_start())
    for o in included_output:
        code.append(o.get_loop_start())
    
    for i in included_input_behavior:
        if i.use_analog:
            code_temp = i.get_output_loop_analog()
            code.append(code_temp)
        else:
            code.append('if (' + i.input_obj.get_loop_logic() + ') {\n')
            code_temp = i.get_output_loop()
            code.append(code_temp)
        code.append('\n}\n')

    for i in included_input_behavior:
        code.append(i.input_obj.get_loop_end())
    for o in included_output:
        code.append(o.get_loop_end())
    
    code.append("} \n\n")

    '''

    for i in included_input_behavior:
        code.append(i.input_obj.get_helper_function())
    for o in included_output:
        code.append(o.get_helper_function())
    ''' #TEMP: fix led helper function

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
