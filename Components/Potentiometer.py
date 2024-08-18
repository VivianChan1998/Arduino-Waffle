from Component import Component
from QA import Question, Answer
from Enums import ComponentType, AnswerType

class Potentiometer(Component):
    def __init__(self, id):
        super().__init__(id)
        self.name = "potentiometer"
        self.device_type = ComponentType.INPUT_DEVICE_ANALOG
        self.library = None
        follow_up_threshold = Question(self, "threshold", "What should the binary threshold be? The max value a potentiometer can read is 1023?",
                                AnswerType.TEXT
                                )
        self.question = Question(self, "mode", "What do you what to use the potentiometer for?",
                                 AnswerType.MULTI_OPTION,
                                 [
                                    Answer("Binary threshold with respect to an output device, one output state under threshold, one output state over threshold", "binary threshold", follow_up_threshold),
                                    Answer("Use analog input as direct determinant for the output, each different analog value will impact state", "analog direct")
                                 ]
                                 )
        self.parameter = {
            "mode" : "binary threshold",
            "threshold" : "512"
        }
        self._pin = "potPin_" + str(id)
        self._val = "potVal_" + str(id)
        
    def get_global_var(self):
        ret = self.str_init_variable("int", self._pin, "A3") # Hardcoded analog pin value
        ret += self.str_init_variable("int", self._pin, "0")
        if self.parameter["mode"] == "binary threshold": # if specific mode is picked then we need to remember the threshold 
            ret += self.str_init_variable("int", "boundary", self.parameter["threshold"])
        return ret
    
    def get_setup(self):
        return "" # To read value from potentiometer, nothing is needed in setup(), need to think about how this might change for more complex cases

    def get_loop_start(self):
        return self._val + "=" "analogRead(" + self._pin + ");"
    
    def get_loop_logic(self):
        match self.parameter["mode"]:
            case "binary threshold":
                ret =  "distance > boundary"
            case "analog direct":
                ret = ""
                # TODO more complex case requires knowing output code before 
        return ret