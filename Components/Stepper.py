from Component import Component
from QA import Question, Answer
from Enums import ComponentType, AnswerType

class Stepper(Component):
    def __init__(self, id):
        super().__init__(id)
        self.name = "stepper"
        self.device_type = ComponentType.OUTPUT_DEVICE_W_LIBRARY
        self.library = "Stepper.h"
        follow_up = Question( self, "step", "For how many steps?",
                                AnswerType.NUMERCIAL
                            )
        self.question = Question( self, "forward", "Which direction do you want the stepper to rotate?",
                                    AnswerType.MULTI_OPTION,
                                    [
                                        Answer("forward", 1, follow_up),
                                        Answer("backward", 0, follow_up)
                                    ]
                                )

        self.parameter = {
            "forward": 1,
            "step": 0
        }

    
    def get_global_var(self):
        ret = self.str_define("STEPS", "100")
        ret += "Stepper stepper(STEPS, 8, 9, 10, 11);\n" #TODO
        return ret
    
    def get_setup(self):
        return self.str_call_function("stepper", "setspeed", [30])
    
    def get_loop_logic(self):
        steps = int(self.parameter["step"]) if self.parameter["forward"] else -1 * int(self.parameter["step"])
        ret = self.str_call_function("stepper", "step", [steps])
        return ret