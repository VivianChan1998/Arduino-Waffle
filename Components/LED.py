from Component import Component
from Enums import ComponentType, AnswerType, PinType
from QA import Question, Answer

class LED(Component):
    def __init__(self, id, board):
        super().__init__(id, board)
        self.name = "LED"
        self.device_type = ComponentType.OUTPUT_DEVICE
        self.library = 'Adafruit_NeoPixel.h'
        self.init_question = Question(self.init, "number", "How many LEDs are there on this strip?", AnswerType.NUMERCIAL)
        follow_up_color = Question(self.parameter, "color", "What color should the LEDs turn into?", AnswerType.TEXT)
        self.question = Question( self.parameter, "mode", "What kind of pattern do you want it to show?",
                                 AnswerType.MULTI_OPTION,
                                 [
                                    Answer("Turn into one color", "color", follow_up_color),
                                    Answer("Do a rainbow pattern circulation", "rainbow")
                                 ]
                                 )
        self.question_analog = Question( self.parameter, "mode", "What kind of pattern do you want it to show?",
                                 AnswerType.MULTI_OPTION,
                                 [
                                    Answer("Turn into one color", "color", follow_up_color),
                                    #Answer("Do a rainbow pattern circulation", "rainbow")
                                 ]
                                 )
        self.pin_spec = [PinType.DIGITAL]
        self.pin_reg = self.board.register_device(self.name, self.pin_spec)
        self._pin = "led" + str(id) + "_pin"
        self._num = "led" + str(id) + "_num"
        self._obj_name = "pixels_" + str(id)
        self.analog_max = 255
        
    def get_global_var(self):
        ret = self.str_define(self._pin, self.pin_reg[0])
        ret += self.str_define(self._num, self.init["number"])
        ret += "Adafruit_NeoPixel " + self._obj_name + " = Adafruit_NeoPixel(" + self._num + ', ' +  self._pin + ", NEO_GRB + NEO_KHZ800);\n" #TODO
        return ret
    
    def get_setup(self):
        return self._obj_name + ".begin();\n"
    
    
    def get_loop_logic(self, state_num = 0):
        state = self.states[state_num]
        match state["mode"]:
            case "color":
                color = state["color"]
                ret = "colorWipe("+ self._obj_name+ ".Color(" + color[0] + color[1] + ',' + color[2] + color[3] + ',' + color[4] + color[5] + "), 50);"
            case "rainbow":
                ret = "theaterChaseRainbow("+ self._obj_name + ", 50)"
            case _:
                ret = ""
        return ret
    
    def get_loop_logic_analog(self, state_num, param: str, param_max: int, reverse: bool = False) -> str: 
        brightness = "int(" + str(self.analog_max) + " / " + str(param_max) + " * " + param
        if reverse:
            brightness = str(self.analog_max) + "-" + brightness
        ret = self._obj_name + "strip.setBrightness(" + brightness + ");\n"
        color = self.states[state_num]["color"]
        ret += "colorWipe("+ self._obj_name+ ".Color(" + color[0] + color[1] + ',' + color[2] + color[3] + ',' + color[4] + color[5] + "), 50);"
        return ret

    def get_helper_function(self): ## TODO change helper function to accomodate which led strip it is
        ret = ''
        if self.parameter["mode"] is "rainbow":
            ret += "void theaterChaseRainbow(int wait) {\n\
                    int firstPixelHue = 0;\n\
                    for(int a=0; a<30; a++) {  // Repeat 30 times...\n\
                    for(int b=0; b<3; b++) {\n\
                    pixels.clear();\n\
                    for(int c=b; c<pixels.numPixels(); c += 3) {\n\
                        int hue = firstPixelHue + c * 65536L / pixels.numPixels();\n\
                        uint32_t color = pixels.gamma32(pixels.ColorHSV(hue));\n\
                        pixels.setPixelColor(c, color);\n\
                    }\n\
                    pixels.show();\n\
                    delay(wait);\n\
                    firstPixelHue += 65536 / 90;\n\
                    }\n}\n}\n"
        else:
            ret += "void colorWipe(uint32_t color, int wait) {\
                    for(int i=0; i<pixels.numPixels(); i++) { // For each pixel in strip...\n\
                    pixels.setPixelColor(i, color);         //  Set pixel's color (in RAM)\n\
                    pixels.show();                          //  Update strip to match\n\
                    delay(wait);                           //  Pause for a moment\n\
                    }\n\
                    }\n"
        return ret