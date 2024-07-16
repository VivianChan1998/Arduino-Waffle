class InputDevice:
    def __init__(self, name: str, isDigital: bool=True, isAnalog: bool=False,
        library: str

    ):
        self.name = name
        self.isDigital = isDigital
        self.isAnalog = isAnalog

    def include(self):

        return 