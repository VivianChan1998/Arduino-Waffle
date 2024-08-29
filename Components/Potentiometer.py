from Component import Component
from QA import Question, Answer
from Enums import ComponentType, AnswerType

class Potentiometer(Component):
    def __init__(self, id, board):
        super().__init__(id, board)
        self.name = "potentiometer"
        self.device_type = ComponentType.INPUT_DEVICE
        follow_up_threshold = Question(self.init, "threshold", "What should the binary threshold be? (The max value a potentiometer can read is 1023)",
                                AnswerType.NUMERCIAL
                                )
        self.init_question = Question(self.init, "mode", "What do you what to use the potentiometer for?",
                                 AnswerType.MULTI_OPTION,
                                 [
                                    Answer("Binary threshold with respect to an output device, one output state under threshold, one output state over threshold", "binary threshold", follow_up_threshold),
                                    Answer("Use analog input as direct determinant for the output, each different analog value will impact state", "analog direct", callback_function = self.set_analog)
                                 ]
                                 )
        self._pin = "potPin_" + str(id)
        self._val = "potVal_" + str(id)
        self._boundary = "potBoundary_" + str(id)
        self.analog_max = 1023
        self.analog_param_name = self._val
        
    def get_global_var(self):
        ret = [self.str_init_variable("int", self._pin, "A3"), self.str_init_variable("int", self._val, "0")] # Hardcoded analog pin value
        if self.init["mode"] == "binary threshold": # if specific mode is picked then we need to remember the threshold 
            ret.append(self.str_init_variable("int", self._boundary, self.init["threshold"]))
        return ret
    
    def get_setup(self):
        return [] # To read value from potentiometer, nothing is needed in setup(), need to think about how this might change for more complex cases

    def get_loop_start(self):
        ret = [self._val + " = analogRead(" + self._pin + ")", "Serial.println(" + self._val + ")"] 
        return ret
    
    
    def get_loop_logic(self):
        match self.init["mode"]:
            case "binary threshold":
                ret =  f"distance > {self._boundary}"
            case "analog direct":
                ret = ""
                # Solely dependent on output code
        return ret