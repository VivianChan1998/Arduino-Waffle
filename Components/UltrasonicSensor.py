from Component import Component
from QA import Question, Answer
from Enums import ComponentType, AnswerType

class UltrasonicSensor(Component):
    def __init__(self, id, board):
        super().__init__(id, board)
        self.name = "ultrasonic sensor"
        self.device_type = ComponentType.INPUT_DEVICE_ANALOG
        follow_up_threshold = Question(self.init, "threshold", "What should the binary threshold be in cm?",
                                AnswerType.NUMERCIAL
                                )
        self.init_question = Question(self.init, "mode", "What do you what to use the ultrasonic sensor for?",
                                 AnswerType.MULTI_OPTION,
                                 [
                                    Answer("Binary threshold with respect to an output device, one output state under threshold, one output state over threshold", "binary threshold", follow_up_threshold),
                                    Answer("Use analog input as direct determinant for the output, each different analog value will impact state", "analog direct")
                                 ]
                                 )
        self._trig = "ultrasonic_trig_" + str(id) + "_pin"
        self._echo = "ultrasonic_echo_" + str(id) + "_pin"
        
    def get_global_var(self):
        ret = self.str_define(self._trig, '9') 
        ret += self.str_define(self._echo, '10') 
        ret += "float duration, distance;\n" 
        ret += self.str_init_variable("int", "boundary", self.init["threshold"]) # <--- TODO: CHANGE FROM HARDCODED
        return ret
    
    def get_setup(self):
        return f"\n\tpinMode({self._trig}, OUTPUT);\n\tpinMode({self._echo}, INPUT);\n\tSerial.begin(9600);" # (!!) Serial Begin should not be in individual components

    def get_loop_start(self):
        return ("\n\tdigitalWrite(ULTRASONIC_TRIG_PIN, LOW);\n\tdelayMicroseconds(2);\n\tdigitalWrite(",
                       "ULTRASONIC_TRIG_PIN, HIGH);\n\tdelayMicroseconds(10);\n\tdigitalWrite(ULTRASONIC_TRIG_PIN, ",
                       "LOW);\n\tduration = pulseIn(ULTRASONIC_ECHO_PIN, HIGH);\n\tdistance = duration * 0.034 / 2; ",
                       "//distance in cm\n\tSerial.print(\"Distance: \");\n\tSerial.println(distance);") # (!!) Serial print can be enabled separatedly
    
    def get_loop_logic(self):
        match self.init["mode"]:
            case "binary threshold":
                ret =  "distance > boundary"
            case "analog direct":
                ret = "" # TODO
            
        return ret