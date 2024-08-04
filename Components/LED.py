from Component import Component
from Enums import ComponentType, AnswerType
from QA import Question, Answer

class LED(Component):
    def __init__(self, id):
        super().__init__(id)
        self.name = "LED"
        self.device_type = ComponentType.OUTPUT_DEVICE_W_LIBRARY
        self.library = 'Adafruit_NeoPixel.h'
        self.question = Question( self, "mode", "What kind of pattern do you want it to show?",
                                 AnswerType.MULTI_OPTION,
                                 [
                                    Answer("Turn into one color", "color"),
                                    Answer("Do a ranbow pattern circulation", "rainbow")
                                 ]
                                 )
        self.state_names = ['turn into one color', 'do rainbow']
        self.parameter = [{
                'prompt': 'what color?',
                'val': '000000'
            }, None]
        self._pin = "led" + str(id) + "_pin"
        self._num = "led" + str(id) + "_num"

        
    def get_global_var(self):
        ret = self.str_define(self._pin, '6') #TEMP
        ret += self.str_define(self._num, '10') #TEMP
        ret += "Adafruit_NeoPixel pixels(" + self._num + ', ' +  self._pin + ", NEO_GRB + NEO_KHZ800);\n" #TODO
        return ret
    
    def get_setup(self):
        return "pixels.begin();\npixels.begin();\n"
    
    
    def get_loop_logic(self):
        match self.state:
            case 'turn into one color':
                color = self.parameter[0]['val']
                print(color)
                ret = "colorWipe(pixels.Color(" + color[0] + color[1] + ',' + color[2] + color[3] + ',' + color[4] + color[5] + "), 50);"
            case 'do rainbow':
                ret = "theaterChaseRainbow(50)"
            case _:
                ret = ""
        return ret
    
    def get_loop_end(self):
        return ''

    def get_helper_function(self):
        ret = ''
        if self.state is self.state_names[1]:
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