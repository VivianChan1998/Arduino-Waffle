from Component import Component
from QA import Question, Answer
from Enums import ComponentType, AnswerType

class UltrasonicSensor(Component):
    def __init__(self, id, board): # can_analog = True)
        super().__init__(id, board)
        self.name = "ultrasonic sensor"
        self.device_type = ComponentType.INPUT_DEVICE
        follow_up_threshold = Question(self.init, "threshold", "What should the binary threshold be in cm?",
                                AnswerType.NUMERCIAL
                                )
        self.init_question = Question(self.init, "mode", "What do you want to use the ultrasonic sensor for?",
                                 AnswerType.MULTI_OPTION,
                                 [
                                    Answer("Binary threshold with respect to an output device, one output state under threshold, one output state over threshold", "binary threshold", follow_up_threshold),
                                    # if !can_analog then no analog option
                                    Answer("Use analog input as direct determinant for the output, each different analog value will impact state", "analog direct", callback_function = self.set_analog)
                                 ]
                                 )
        self._trig = "ultrasonicTrig_" + str(id) + "_pin"
        self._echo = "ultrasonicEcho_" + str(id) + "_pin"
        self._boundary = "ultrasonicBoundary_" + str(id)
        self._duration = "duration_" + str(id)
        self._distance = "ultrasonicDistance_" + str(id)
        self.analog_max = 1023
        self.analog_param_name = self._distance # is analog max the same for distance? need to check on the same 

        
    def get_global_var(self):
        ret = [self.str_define(self._trig, '9'), 
               self.str_define(self._echo, '10'), 
               "float duration, distance"]
        if self.init["threshold"]:
            ret.append(self.str_init_variable("int", self._boundary, self.init["threshold"]))
        return ret
    
    def get_setup(self):
        return [f"pinMode({self._trig}, OUTPUT)", f"pinMode({self._echo}, INPUT)"]

    def get_loop_start(self):
        return [f"digitalWrite({self._trig}, LOW)", "delayMicroseconds(2)", 
                f"digitalWrite({self._trig}, HIGH)", "delayMicroseconds(10)", 
                f"digitalWrite({self._trig}, LOW)", 
                f"{self._duration} = pulseIn({self._echo}, HIGH)", 
                f"{self._distance} = {self._duration} * 0.034 / 2", 
                f"Serial.print(\"Distance: \")", f"Serial.println({self._distance})"] 
    
    def get_loop_logic(self):
        match self.init["mode"]:
            case "binary threshold":
                ret =  f"{self._distance} > {self._boundary}"
            case "analog direct":
                ret = ""
        return ret