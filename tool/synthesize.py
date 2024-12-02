from questions import Quiz, Question

color_map = {'Red' : '252, 5, 5', 'Blue' : '5, 5, 252', 'Orange' : '252, 157, 5'}
def synthesize(questions, answers):
    threshold = answers[1]
    color = color_map[answers[3]]


    [self.str_define(self._pin, self.pin_reg[0]), 
    self.str_define(self._num, self.init["number"]), 
    "Adafruit_NeoPixel pixels = Adafruit_NeoPixel(" + self._num + 'led_num, ' +  self._pin + ", NEO_GRB + NEO_KHZ800)"]