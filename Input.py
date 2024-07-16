import Component

class InputDevice(Component):
    def __init__(self, name: str, isDigital: bool=True, isAnalog: bool=False):
        self.isDigital = isDigital
        self.isAnalog = isAnalog


