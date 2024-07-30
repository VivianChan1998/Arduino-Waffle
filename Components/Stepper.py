from Component import Component
from Enums import ComponentType

class Stepper(Component):
    def __init__(self):
        super().__init__()
        self.name = "stepper"
        self.device_type = ComponentType.OUTPUT_DEVICE_W_LIBRARY
        self.library = "Stepper.h"
        self.state_names = ["rotate forward 100 steps", "rotate backward 100 steps"]
        self._steps = 0
        self._
    
    def get_global_var(self):
        ret = self.str_define("STEPS", "100")
        #ret += self.str_init_variable("int", "prev", "0")
        ret += "Stepper stepper(STEPS, 8, 9, 10, 11);\n" #TODO
        return ret
    
    def get_setup(self):
        return self.str_call_function("stepper", "setspeed", [30])
    
    def get_loop_start(self):
        #ret = self.str_init_variable("int", "val", "analogRead(0)")
        ret = self.str_call_function("stepper", "step", [100])
        return ret

    #def get_loop_end(self):
        #ret = self.str_assign_variable("prev", "val")
        #return ret