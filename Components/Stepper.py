from Component import Component
from Enums import ComponentType

class Stepper(Component):
    def __init__(self, id):
        super().__init__(id)
        self.name = "stepper"
        self.device_type = ComponentType.OUTPUT_DEVICE_W_LIBRARY
        self.library = "Stepper.h"
        self.state_names = ["rotate forward 100 steps", "rotate backward 100 steps"]
        self.parameter = [None, None]
    
    def get_global_var(self):
        ret = self.str_define("STEPS", "100")
        ret += "Stepper stepper(STEPS, 8, 9, 10, 11);\n" #TODO
        return ret
    
    def get_setup(self):
        return self.str_call_function("stepper", "setspeed", [30])
    
    def get_loop_logic(self):
        if self.state is "rotate forward 100 steps":
            steps = 100
        else:
            steps = -100
        ret = self.str_call_function("stepper", "step", [steps])
        return ret