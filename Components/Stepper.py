from Component import Component
from QA import Question, Answer
from Enums import ComponentType, AnswerType

class Stepper(Component):
    def __init__(self, id):
        super().__init__(id)
        # No analog options available! 

        self.name = "stepper"
        self.device_type = ComponentType.OUTPUT_DEVICE_ONLY_DIGITAL
        self.library = "Stepper.h"
        follow_up = Question(self.parameter, "step", "For how many steps?", AnswerType.NUMERCIAL)
        self.question = Question(self.parameter, "forward", "Which direction do you want the stepper to rotate?",
                                    AnswerType.MULTI_OPTION,
                                    [
                                        Answer("forward", 1, follow_up),
                                        Answer("backward", 0, follow_up)
                                    ]
                                )
    
        self._obj_name = "stepper_" + str(id)
        
    def get_global_var(self):
        ret = self.str_define("STEPS", "100")
        ret += "Stepper " + self._obj_name + " = stepper(STEPS, 8, 9, 10, 11);\n" #TODO
        return ret
    
    def get_setup(self):
        return self.str_call_function(self._obj_name, "setspeed", [30])
    
    def get_loop_logic(self, state_num = 0):

        state = self.states[state_num]
        steps = int(state["step"]) if state["forward"] else -1 * int(state["step"])
        ret = self.str_call_function(self._obj_name, "step", [steps])
        return ret